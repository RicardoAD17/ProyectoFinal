import { Component } from '@angular/core';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { RecaptchaModule } from 'ng-recaptcha';
import { ViewChild } from '@angular/core';
import { RecaptchaComponent } from 'ng-recaptcha';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { GymBdService } from '../../services/gym-bd.service';

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
    MatInputModule,
    MatInputModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  @ViewChild('recaptchaRef') recaptchaComponent!: RecaptchaComponent;

  public form: FormGroup = new FormGroup({
    nombre: new FormControl('', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/),Validators.minLength(10),Validators.maxLength(40)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required,Validators.minLength(8),Validators.maxLength(20),passwordValidator]),
    repeat_password: new FormControl('', [Validators.required, Validators.minLength(8),Validators.maxLength(20),passwordValidator]),
  });
  
  admin = { username: '', password: '' };
  currentAdmin: { username: string, nombre: string } | null = null;
  loginError = false;

  validAdmins = [
    { username: 'admin1', password: 'admin123', nombre: 'Jaime López' },
    { username: 'admin2', password: 'clave456', nombre: 'Ricardo Almada' },
    { username: 'entrenador', password: 'fit789', nombre: 'Diego Saldaña' }
  ];

  constructor(private gymBdService: GymBdService){
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


  login() {
    if (!this.captchaToken) {
      Swal.fire({
        icon: 'warning',
        title: 'Captcha requerido',
        text: 'Por favor, verifica que no eres un robot.'
      });
      return;
    }

    const found = this.validAdmins.find(
      user => user.username === this.admin.username && user.password === this.admin.password
    );


    if (found) {
      this.currentAdmin = { username: found.username, nombre: found.nombre };
      this.loginError = false;

      Swal.fire({
        icon: 'success',
        title: '¡Inicio de sesión exitoso!',
        text: `Bienvenido, ${found.nombre}`
      }).then(() => {
        const modalElement = document.getElementById('adminLoginModal');
        if (modalElement) {
          const modalInstance = bootstrap.Modal.getInstance(modalElement);
          modalInstance?.hide();
        }
      });
    } else {
      this.loginError = true;
    }

    // Limpia el captcha después de cada intento
    this.captchaToken = null;
  }

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

  logout() {
    this.currentAdmin = null;
    this.recaptchaComponent?.reset(); // 💡 Reinicia el captcha visual y lógicamente
    this.captchaToken = null;
    Swal.fire({
      icon: 'info',
      title: 'Sesión cerrada',
      text: 'Has cerrado la sesión exitosamente.'
    });
  }
}
