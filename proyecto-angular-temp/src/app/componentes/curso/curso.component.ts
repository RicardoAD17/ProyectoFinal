import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Curso, CursoService } from '../../services/curso.service';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-curso',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './curso.component.html',
  styleUrl: './curso.component.css'
})
export class CursoComponent implements OnInit {
  cursos: Curso[]=[];
  constructor(private cursoService:CursoService){}
  
  ngOnInit(): void {
    this.cursoService.obtenerCursos().subscribe({
      next: data => this.cursos = data,
      error: err => console.error('Error al obtener cursos', err)
    });
  }
}  
