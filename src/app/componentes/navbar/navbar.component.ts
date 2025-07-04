import { AfterViewInit,Component, OnInit, Renderer2 } from '@angular/core';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { RecaptchaModule } from 'ng-recaptcha';
import { ViewChild } from '@angular/core';
import { RecaptchaComponent } from 'ng-recaptcha';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { GymBdService } from '../../services/gym-bd.service';

import { Firestore} from '@angular/fire/firestore'; 
import { signInWithEmailAndPassword, Auth } from '@angular/fire/auth';
import { LoadingService } from '../../services/loading.service';
import { HttpClient } from '@angular/common/http';
import { GithubAuthProvider, signInWithPopup } from '@angular/fire/auth';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { QrComponent } from '../qr/qr.component';

declare var bootstrap: any;

export function passwordValidator(control: AbstractControl): ValidationErrors | null {
  const value: string = control.value || '';

  // Debe tener solo letras, dígitos y guion bajo
  const validChars = /^[A-Za-z0-9_]+$/.test(value);
  // Al menos una mayúscula
  const hasUpperCase = /[A-Z]/.test(value);
  // Al menos un dígito
  const hasNumber = /\d/.test(value);

  const passwordValid = validChars && hasUpperCase && hasNumber;

  return !passwordValid ? { invalidPassword: true } : null;
}

@Component({
  selector: 'app-navbar',
  standalone:true,
  imports: [MatButtonModule,MatMenuModule,RouterModule,CommonModule,ReactiveFormsModule,RecaptchaModule,
    MatFormFieldModule,
    MatInputModule,QrComponent
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  @ViewChild('recaptchaRef') recaptchaComponent!: RecaptchaComponent;

  recaptchaVerifier: RecaptchaVerifier | undefined;

  public form: FormGroup = new FormGroup({
    nombre: new FormControl('', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/),Validators.minLength(10),Validators.maxLength(40)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required,Validators.minLength(8),Validators.maxLength(20),passwordValidator]),
    repeat_password: new FormControl('', [Validators.required, Validators.minLength(8),Validators.maxLength(20),passwordValidator]),
  });

  public adminForm: FormGroup = new FormGroup({
    nombre: new FormControl('', [Validators.required,Validators.minLength(10),Validators.maxLength(40)]),
    correo: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8),Validators.maxLength(20),passwordValidator])
  });

  currentAdmin: { username: string, nombre: string } | null = null;
  loginError = false;

  userTipo: string | null = null;
  ngOnInit(): void {
    const stored = localStorage.getItem('usuarioActual');
    if (stored) {
      const parsed = JSON.parse(stored);
      this.userTipo = parsed.tipo; // 'admin' o 'usuario'
    }
  }

  telefono: string = '';
  codigoVerificacion: string = '';
  confirmacionSMS: any;


  constructor(private gymBdService: GymBdService,private auth: Auth, private firestore: Firestore,private router: Router,
              private loadingService: LoadingService, private http: HttpClient, private renderer:Renderer2){
    this.form.get('repeat_password')?.setValidators([
      Validators.required,
      Validators.minLength(8),
      this.passwordValidator()
    ]);

  }
  
  public passwordValidator(): ValidatorFn {
    return () => {
      const password = this.form.get('password')?.value;
      const repeat_password = this.form.get('repeat_password')?.value;

      if (!password || !repeat_password) return { isValid: false };

      if (password !== repeat_password) return { isValid: false };

      return null;
    };
  }

  captchaToken: string | null = null;

  onCaptchaResolved(token: string | null) {
  this.captchaToken = token;
  }

  async login() {
    if (!this.captchaToken) {
      Swal.fire('Captcha requerido', 'Por favor, verifica que no eres un robot.', 'warning');
      return;
    }

    const email = this.form.get('email')?.value;
    const password = this.form.get('password')?.value;

    try {
      const cred = await signInWithEmailAndPassword(this.auth, email, password);
      const uid = cred.user.uid;

      // Buscar
      const adminData = await this.gymBdService.obtenerAdministradorPorUID(uid);
      if (adminData) {
        this.currentAdmin = {
          username: email,
          nombre: adminData['nombre']
        };

        localStorage.setItem('usuarioActual', JSON.stringify({
          tipo: 'admin',
          nombre: adminData['nombre'],
          uid, 
          correo: adminData['correo'] 
        }));
        this.userTipo = 'admin';
            localStorage.setItem('logueado', 'true');
        Swal.fire('Administrador', `Bienvenido administrador ${adminData['nombre']}`, 'success');
        this.router.navigate(['/tablas']);
      } else {
        const userData = await this.gymBdService.obtenerUsuarioPorUID(uid);

        if (userData) {
          this.currentAdmin = {
            username: email,
            nombre: userData['nombre']
          };

          localStorage.setItem('usuarioActual', JSON.stringify({
            tipo: 'usuario',
            nombre: userData['nombre'],
            uid,
            correo: userData['correo'] 
          }));
          this.userTipo = 'usuario';
              localStorage.setItem('logueado', 'true');
          Swal.fire('Bienvenido', `Hola ${userData['nombre']}`, 'success');
        } else {
          this.currentAdmin = null;
          Swal.fire('Usuario no encontrado', 'No estás registrado como usuario ni administrador.', 'warning');
          return;
        }
      }

      // Cierra el modal
      const modalElement = document.getElementById('LogInModal');
      if (modalElement) {
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        modalInstance?.hide();
      }
    } catch (err: any) {
      Swal.fire('Error de inicio de sesión', err.message, 'error');
    } finally {
      this.recaptchaComponent?.reset();
      this.captchaToken = null;
    }
  }

  async loginConGitHub() {
    try {
      const provider = new GithubAuthProvider();
      const cred = await signInWithPopup(this.auth, provider);

      const nombre = cred.user.displayName || 'Sin nombre';
      const correo = cred.user.email || 'Correo no disponible';
      const uid = cred.user.uid;

      // Guarda en localStorage
      localStorage.setItem('usuarioActual', JSON.stringify({
        tipo: 'github',
        nombre,
        correo,
        uid
      }));

      this.currentAdmin = { username: correo, nombre };
    localStorage.setItem('logueado', 'true');
      Swal.fire('¡Bienvenido!', `Hola ${nombre}, has iniciado sesión con GitHub.`, 'success');

      // Cierra el modal si está abierto
      const modal = document.getElementById('LogInModal');
      if (modal) bootstrap.Modal.getInstance(modal)?.hide();

    } catch (error: any) {
      console.error('Error de GitHub login:', error);
      Swal.fire('Error', error.message, 'error');
    }
  }
  /*
  enviarCodigoTelefono() {
    if (!this.telefono.startsWith('+')) {
      Swal.fire('Formato incorrecto', 'Incluye el código de país. Ej: +521234567890', 'warning');
      return;
    }

    signInWithPhoneNumber(this.auth, this.telefono, this.recaptchaVerifier)
      .then((confirmationResult) => {
        this.confirmacionSMS = confirmationResult;
        Swal.fire('Código enviado', 'Revisa tu SMS para el código de verificación.', 'info');
      })
      .catch((error) => {
        console.error(error);
        Swal.fire('Error al enviar código', error.message, 'error');
      });
  }*/


  enviarFormulario() {
  if (this.form.valid) {
    const datos = {
      nombre: this.form.value.nombre,
      correo: this.form.value.email,
      password: this.form.value.password
    };

    this.gymBdService.registrarUsuario(datos)
      .then(() => {
        Swal.fire('¡Registro exitoso!', 'Usuario creado correctamente.', 'success');
        
        // Aquí envías el correo de bienvenida
        const correoData = {
          correoDestino: datos.correo,
          asunto: '¡Bienvenido al Gimnasio!',
          mensaje: `Hola ${datos.nombre}, gracias por registrarte en nuestra plataforma.
          
          Agradecemos que hayas escogido nuestro GYM.
          Este sera el inicio de un nuevo mundo para ti, asiste a nuestra sucursal para atenderte de mejor manera
          
          Este correo se genera automaticamente, favor de no responder 
          `
        };

        this.http.post('http://localhost:3000/api/enviar-correo', correoData).subscribe({
          next: (res) => {
            console.log('Correo enviado correctamente', res);
          },
          error: (err) => {
            console.error('Error al enviar el correo', err);
            Swal.fire('Advertencia', 'Usuario registrado, pero no se pudo enviar el correo.', 'warning');
          }
        });

        this.form.reset();
      })
      .catch((error) => {
        console.error('Error al registrar:', error);
        Swal.fire('Error', 'No se pudo registrar el usuario: ' + error.message, 'error');
      });
  } else {
    this.form.markAllAsTouched();
  }
}
  registrarAdministrador() {
    if (this.adminForm.valid) {
      const { nombre, correo, password } = this.adminForm.value;

      this.gymBdService.registrarAdministrador({ nombre, correo, password })
        .then(() => {
          Swal.fire('Éxito', 'Administrador registrado correctamente', 'success');
          this.adminForm.reset();

          const modal = document.getElementById('adminSignupModal');
          if (modal) {
            const modalInstance = bootstrap.Modal.getInstance(modal);
            modalInstance?.hide();
          }
        })
        .catch(err => {
          console.error(err);
          Swal.fire('Error', 'No se pudo registrar: ' + err.message, 'error');
        });
    } else {
      this.adminForm.markAllAsTouched();
    }
  }


  logout() {
    this.currentAdmin = null;
    this.recaptchaComponent?.reset(); //  Reinicia el captcha visual y lógicamente
    this.captchaToken = null;
    localStorage.setItem('logueado', 'false');
    Swal.fire({
      icon: 'info',
      title: 'Sesión cerrada',
      text: 'Has cerrado la sesión exitosamente.'
    });
    this.userTipo = null;
    localStorage.removeItem('usuarioActual');
  }


    //Parte del loading -------------------------------------------------------------------------------------
  navigateWithLoading(path: string) {
    this.loadingService.show();

    this.http.get('https://jsonplaceholder.typicode.com/posts/1').subscribe({
      next: () => {
        this.loadingService.hide();
        this.router.navigate([path]);
      },
      error: () => {
        this.loadingService.hide();
        this.router.navigate([path]);
      }
    });
  }
//fin parte del loading -----------------------------------------------------------------------------------

//inicio parte accesibilidad
  private isHighContrast = false;
  private currentFontSize = 100; // porcentaje
  private fonts = [
    "'Segoe UI', sans-serif",
    "'Comic Sans MS', cursive, sans-serif", 
    "'Courier New', monospace",      
    "'Impact', sans-serif",         
    "'Georgia', serif",            
    "'Lucida Console', monospace"
  ];
  private currentFontIndex = 0;

  private speechSynthesis = window.speechSynthesis;
  private utterance: SpeechSynthesisUtterance | null = null;

  toggleScreenReader() {
    if (this.speechSynthesis.speaking) {
      this.speechSynthesis.cancel();
      return;
    }

    const mainContent = document.querySelector('main');
    if (mainContent) {
      const text = mainContent.textContent || '';
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = this.speechSynthesis.getVoices();
      const spanishVoice = voices.find(voice => voice.lang.startsWith('es'));

      if (spanishVoice) {
        utterance.voice = spanishVoice;
      }

      this.speechSynthesis.speak(utterance);
    }
  }


  toggleContrast() {
    this.isHighContrast = !this.isHighContrast;
    if (this.isHighContrast) {
      this.renderer.addClass(document.body, 'high-contrast');
    } else {
      this.renderer.removeClass(document.body, 'high-contrast');
    }
  }


  increaseFontSize() {
    this.currentFontSize += 20;
    this.applyFontStyles();
  }

  decreaseFontSize() {
    this.currentFontSize = Math.max(50, this.currentFontSize - 20);
    this.applyFontStyles();
  }

  cycleFont() {
    this.currentFontIndex = (this.currentFontIndex + 1) % this.fonts.length;
    this.applyFontStyles();
  }

  private applyFontStyles() {
    const fontFamily = this.fonts[this.currentFontIndex];
    const fontSize = `${this.currentFontSize}%`;

    document.documentElement.style.setProperty('font-family', fontFamily, 'important');
    document.documentElement.style.setProperty('font-size', fontSize, 'important');
    document.body.style.setProperty('font-family', fontFamily, 'important');
    document.body.style.setProperty('font-size', fontSize, 'important');

    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
      (form as HTMLElement).style.setProperty('font-family', fontFamily, 'important');
      (form as HTMLElement).style.setProperty('font-size', fontSize, 'important');
    });
  }


//final accesibilidad

}
