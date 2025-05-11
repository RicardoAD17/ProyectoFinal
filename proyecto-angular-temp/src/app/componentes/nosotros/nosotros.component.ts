import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { Queja } from '../queja.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nosotros',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './nosotros.component.html',
  styleUrl: './nosotros.component.css'
})
export class NosotrosComponent {
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

  isValid(): boolean {
    return (
      this.queja.nombre.length >= 3 &&
      this.validateEmail(this.queja.correo) &&
      this.queja.motivo !== '' &&
      this.queja.fecha !== '' &&
      new Date(this.queja.fecha) >= this.getToday() &&
      this.queja.opciones.length > 0 &&
      this.queja.gravedad !== ''
    );
  }

  getToday(): Date {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    return hoy;
  }

  validateEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  onSubmit() {
    this.submitted = true;
    if (this.isValid()) {
      localStorage.setItem('quejaGimnasio', JSON.stringify(this.queja));
      Swal.fire({
        icon: 'success',
        title: '¡Queja registrada!',
        text: 'Gracias por compartir tu opinión. Trabajaremos en ello.',
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

}
