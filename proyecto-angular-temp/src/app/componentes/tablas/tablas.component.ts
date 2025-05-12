import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tablas',
  imports: [CommonModule],
  templateUrl: './tablas.component.html',
  styleUrl: './tablas.component.css'
})
export class TablasComponent {
   suscripciones: any[] = [];
  quejas: any[] = [];

  constructor() {
    this.cargarDatos();
  }

  cargarDatos() {
    const suscripcion = localStorage.getItem('suscripcion');
    if (suscripcion) {
      this.suscripciones = [JSON.parse(suscripcion)];
    }

    const queja = localStorage.getItem('quejaGimnasio');
    if (queja) {
      this.quejas = [JSON.parse(queja)];
    }
  }

  eliminarSuscripcion(index: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará la suscripción.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.suscripciones.splice(index, 1);
        localStorage.removeItem('suscripcion');
        Swal.fire('Eliminado', 'La suscripción ha sido eliminada.', 'success');
      }
    });
  }

  eliminarQueja(index: number) {
    Swal.fire({
      title: '¿Eliminar queja?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.quejas.splice(index, 1);
        localStorage.removeItem('quejaGimnasio');
        Swal.fire('Eliminada', 'La queja ha sido eliminada.', 'success');
      }
    });
  }

  editarSuscripcion(index: number) {
    Swal.fire('Función no implementada', 'Aquí podrías redirigir al formulario para editar.', 'info');
  }

  editarQueja(index: number) {
    Swal.fire('Función no implementada', 'Aquí podrías redirigir al formulario para editar.', 'info');
  }
}
