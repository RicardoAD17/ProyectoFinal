import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { PlanesComponent } from '../planes/planes.component';
import { DomseguroPipe } from '../domseguro.pipe';
import { PaypalButtonComponent } from '../paypal-button/paypal-button.component';
import { Suscripcion } from '../../interfacesBD/Formularios.interface';
import { GymBdService } from '../../services/gym-bd.service';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { LoadingService } from '../../services/loading.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-suscripcion',
  imports: [CommonModule,ReactiveFormsModule,PlanesComponent,DomseguroPipe,PaypalButtonComponent,RouterModule],
  templateUrl: './suscripcion.component.html',
  styleUrl: './suscripcion.component.css'
})
export class SuscripcionComponent {
  suscripcionForm: FormGroup;
  planes = ['Básico', 'Intermedio', 'Avanzado'];
  objetivos = ['Perder peso', 'Ganar masa muscular', 'Mantener condición'];
  editando = false;
  hovering = false;
  video:string="I_RYujJvZ7s"; // videoo
    get isLoggedIn(): boolean {
    return localStorage.getItem('logueado') === 'true';
  }

indiceEditando = -1;

  constructor(private fb: FormBuilder,private gymBdService: GymBdService, private router:Router,private loadingService: LoadingService, private http: HttpClient) {
    const fechaMinima = new Date();
    this.suscripcionForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      correo: [
        '',
        [Validators.required, Validators.email],
      ],
      fecha: ['', [Validators.required, this.fechaNoPasadaValidator,this.fechaRangoValida]],
      plan: ['', Validators.required],
      objetivos: this.buildObjetivos(),
      genero: ['', Validators.required],
    });
  }
   verificarEnvio(event: Event): void {
      if (!this.isLoggedIn) {
        event.preventDefault(); // Detiene el envío
        Swal.fire({
          icon: 'warning',
          title: 'Acceso denegado',
          text: 'Debes iniciar sesión para enviar el formulario.'
        });
        return;
      }

      this.onSubmit();
    }

    // ngOnInit con Firestore para editar suscripción 
async ngOnInit() {
  const registro = localStorage.getItem('registroEditando');
  if (registro) {
    const { tipo, id } = JSON.parse(registro);
    if (tipo === 'suscripcion' && id) {
      try {
        const docSnap = await this.gymBdService.recuperaSuscripcionPorId(id);
        if (docSnap.exists()) {
          const datos = docSnap.data() as Suscripcion;
          this.editando = true;

          this.suscripcionForm.patchValue({
            nombre: datos.nombre,
            correo: datos.correo,
            fecha: datos.fecha,
            plan: datos.plan,
            genero: datos.genero
          });

          datos.objetivos.forEach((obj: string) => {
            const index = this.objetivos.indexOf(obj);
            if (index !== -1) {
              (this.objetivosFormArray.at(index) as any).setValue(true);
            }
          });

        } else {
          console.warn('La suscripción no existe.');
        }
      } catch (error) {
        console.error('Error al obtener suscripción:', error);
      }
    }
  }
}


  

  buildObjetivos(): FormArray {
    return this.fb.array(
      this.objetivos.map(() => this.fb.control(false)),
      this.minimoUnoSeleccionado
    );
  }

  minimoUnoSeleccionado(control: AbstractControl) {
  const formArray = control as FormArray;
  return formArray.value.some((val: boolean) => val)
    ? null
    : { requerido: true };
  }

  fechaNoPasadaValidator(control: any) {
    const fechaIngresada = new Date(control.value);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    return fechaIngresada < hoy ? { fechaInvalida: true } : null;
  }

  get objetivosFormArray() {
    return this.suscripcionForm.get('objetivos') as FormArray;
  }
  
  async onSubmit() {
    if (this.suscripcionForm.valid) {
      const objetivosSeleccionados = this.suscripcionForm.value.objetivos
        .map((checked: boolean, i: number) => checked ? this.objetivos[i] : null)
        .filter((v: string | null) => v !== null) as string[];

      const nuevaSuscripcion: Suscripcion = {
        nombre: this.suscripcionForm.value.nombre,
        correo: this.suscripcionForm.value.correo,
        fecha: this.suscripcionForm.value.fecha,
        plan: this.suscripcionForm.value.plan,
        genero: this.suscripcionForm.value.genero,
        objetivos: objetivosSeleccionados
      };

      try {
        // Confirmación opcional (si quieres que confirme antes de guardar):
        const confirmacion = await Swal.fire({
          title: '¿Confirmar suscripción?',
          html: `
            <p><strong>Nombre:</strong> ${nuevaSuscripcion.nombre}</p>
            <p><strong>Correo:</strong> ${nuevaSuscripcion.correo}</p>
            <p><strong>Plan:</strong> ${nuevaSuscripcion.plan}</p>
            <p><strong>Género:</strong> ${nuevaSuscripcion.genero}</p>
            <p><strong>Fecha:</strong> ${nuevaSuscripcion.fecha}</p>
            <p><strong>Objetivos:</strong> ${nuevaSuscripcion.objetivos.join(', ')}</p>
          `,
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Sí, suscribirme',
          cancelButtonText: 'Cancelar'
        });

        if (confirmacion.isConfirmed) {
          await this.gymBdService.agregarSuscripcion(nuevaSuscripcion);

          await Swal.fire({
            icon: 'success',
            title: '¡Registro exitoso!',
            text: 'Tu suscripción ha sido registrada correctamente.'
          });

          this.suscripcionForm.reset();
          this.editando = false;
          this.indiceEditando = -1;

        } else {
          await Swal.fire({
            icon: 'info',
            title: 'Suscripción cancelada',
            text: 'No se realizó ninguna acción.'
          });
        }
      } catch (error) {
        console.error('Error al guardar en Firestore:', error);
        await Swal.fire('Error', 'No se pudo guardar la suscripción.', 'error');
      }
    } else {
      this.suscripcionForm.markAllAsTouched();
      await Swal.fire({
        icon: 'error',
        title: 'Formulario inválido',
        text: 'Por favor completa todos los campos correctamente.'
      });
    }
  }



fechaRangoValida(control: AbstractControl): ValidationErrors | null {
  const fechaSeleccionada = new Date(control.value);
  const hoy = new Date();
  const maxFecha = new Date();
  maxFecha.setDate(hoy.getDate() + 10);

  if (isNaN(fechaSeleccionada.getTime())) return null; // si no es una fecha válida

  if (fechaSeleccionada < hoy) {
    return { fechaInvalida: true };
  }

  if (fechaSeleccionada > maxFecha) {
    return { fechaFueraDeRango: true };
  }

  return null;
}

videoEstilos = {
  backgroundColor: '#f4faff',
  padding: '10px',
  borderRadius: '15px'
};

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

  openExternalLinkWithLoading(url: string) {
    this.loadingService.show();

    // Se hace una petición real a un endpoint
    this.http.get('https://jsonplaceholder.typicode.com/posts/1').subscribe({
      next: () => {
        this.loadingService.hide();
      },
      error: () => {
        this.loadingService.hide();
      }
    });
  }
//fin parte del loading -----------------------------------------------------------------------------------


}