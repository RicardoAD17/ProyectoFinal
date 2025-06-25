import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { Queja } from '../queja.interface';
import { CommonModule } from '@angular/common';
import { EquipoService, Integrante } from '../equipo.service';
import { Router } from '@angular/router';
import { LoadingService } from '../../services/loading.service';
import { HttpClient } from '@angular/common/http';
import { GymBdService } from '../../services/gym-bd.service';

@Component({
  selector: 'app-nosotros',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './nosotros.component.html',
  styleUrl: './nosotros.component.css'
})
export class NosotrosComponent {
  integrantes: Integrante[] = [];
  queja: Queja = {
    nombre: '',
    correo: '',
    motivo: '',
    fecha: '',
    opciones: [],
    gravedad: ''
  };
  hoy = new Date().toISOString().split('T')[0]; // Para restringir la fecha al día actual o anterior
  motivos: string[] = ['Instalaciones', 'Entrenadores', 'Cobros', 'Otros'];
  opcionesDisponibles: string[] = ['Ruido excesivo', 'Malos tratos', 'Equipos dañados'];
  submitted = false;
  editando = false;
  indiceEditando = -1;
  get isLoggedIn(): boolean {
    return localStorage.getItem('logueado') === 'true';
  }


  constructor(private equipoService: EquipoService, private router:Router,private loadingService: LoadingService, private http: HttpClient, private gymBdService: GymBdService) {}

  ngOnInit(): void {
  this.integrantes = this.equipoService.getIntegrantes();

  const registro = localStorage.getItem('registroEditando');
  if (registro) {
    const { tipo, index } = JSON.parse(registro);
    if (tipo === 'queja') {
      const quejas = JSON.parse(localStorage.getItem('quejas') || '[]');
      const datos = quejas[index];
      if (datos) {
        this.editando = true;
        this.indiceEditando = index;
        this.queja = { ...datos }; // copia segura
      }
    }
  }
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

  isValid(): boolean {
  return (
    this.queja.nombre.length >= 10 &&
    this.validateEmail(this.queja.correo) &&
    this.queja.motivo.length >= 10 &&
    this.queja.fecha !== '' &&
    this.esFechaEnRangoValido() &&
    this.queja.opciones.length > 0 &&
    this.queja.gravedad !== ''
  );
}


esFechaEnRangoValido(): boolean {
  if (!this.queja.fecha) return false;

  const fechaSeleccionada = new Date(this.queja.fecha);
  const hoy = this.getToday();

  const diezDiasDespues = new Date(hoy);
  diezDiasDespues.setDate(hoy.getDate() + 10);

  return fechaSeleccionada >= hoy && fechaSeleccionada <= diezDiasDespues;
}

  getToday(): Date {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    return hoy;
  }

  validateEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

    async onSubmit() {
  this.submitted = true;

  if (this.isValid()) {
    try {
      const confirmacion = await Swal.fire({
        title: '¿Confirmar queja?',
        html: `
          <p><strong>Nombre:</strong> ${this.queja.nombre}</p>
          <p><strong>Correo:</strong> ${this.queja.correo}</p>
          <p><strong>Fecha:</strong> ${this.queja.fecha}</p>
          <p><strong>Gravedad:</strong> ${this.queja.gravedad}</p>
          <p><strong>Motivo:</strong> ${this.queja.motivo}</p>
          <p><strong>Opciones:</strong> ${this.queja.opciones.join(', ')}</p>
        `,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, enviar',
        cancelButtonText: 'Cancelar'
      });

      if (confirmacion.isConfirmed) {
        await this.gymBdService.agregarQueja(this.queja);

        await Swal.fire({
          icon: 'success',
          title: '¡Queja enviada!',
          text: 'Gracias por compartir tu opinión. Trabajaremos en ello.'
        });

        this.queja = {
          nombre: '',
          correo: '',
          motivo: '',
          fecha: '',
          opciones: [],
          gravedad: ''
        };
        this.submitted = false;
        this.editando = false;
        this.indiceEditando = -1;

        localStorage.removeItem('registroEditando');
      } else {
        await Swal.fire({
          icon: 'info',
          title: 'Envío cancelado',
          text: 'No se guardó la queja.'
        });
      }
    } catch (error) {
      console.error('Error al guardar queja en Firestore:', error);
      await Swal.fire('Error', 'No se pudo guardar la queja.', 'error');
    }
  }
}





  tieneOpcionesSeleccionadas(): boolean {
  return this.queja.opciones.some(o => o);
}
esFechaValida(): boolean {
  if (!this.queja.fecha) return false;
  return new Date(this.queja.fecha) >= this.getToday();
}

handleChange(event: Event, opcion: string): void {
  const input = event.target as HTMLInputElement;
  if (input.checked) {
    this.queja.opciones.push(opcion);
  } else {
    const index = this.queja.opciones.indexOf(opcion);
    if (index > -1) {
      this.queja.opciones.splice(index, 1);
    }
  }
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
