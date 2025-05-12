import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Curso } from '../../services/curso.service';

@Component({
  selector: 'app-curso-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './curso-card.component.html',
  styleUrl: './curso-card.component.css'
})
export class CursoCardComponent {
  @Input() curso!:Curso;
  @Output() seleccionar= new EventEmitter<Curso>() 
  emitirSeleccion() {
    this.seleccionar.emit(this.curso);
  }
}
