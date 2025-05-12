import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Curso, CursoService } from '../../services/curso.service';
import { CursoCardComponent } from '../curso-card/curso-card.component';

@Component({
  selector: 'app-curso',
  standalone: true,
  imports: [CommonModule,CursoCardComponent,],
  templateUrl: './curso.component.html',
  styleUrl: './curso.component.css'
})
export class CursoComponent implements OnInit {
  cursos: Curso[]=[];
  constructor(private cursoService:CursoService){}
   ngOnInit(): void {
  this.cursoService.obtenerCursos().subscribe(data => {
    console.log('Cursos cargados:', data); // verifica en la consola
    this.cursos = data;
  });
}  
     manejarSeleccion(curso: Curso) {
    alert(`Has seleccionado el curso: ${curso.nombre}`);
  }
}
