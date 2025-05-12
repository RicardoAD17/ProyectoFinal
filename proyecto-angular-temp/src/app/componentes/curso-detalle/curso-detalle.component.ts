import { Component, OnInit } from '@angular/core';
import { Curso, CursoService } from '../../services/curso.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-curso-detalle',
  standalone: true,
  imports: [],
  templateUrl: './curso-detalle.component.html',
  styleUrl: './curso-detalle.component.css'
})
export class CursoDetalleComponent implements OnInit {
  curso: Curso | null = null;

  constructor(
    private route: ActivatedRoute,
    private cursoService: CursoService
  ) {}

    ngOnInit(): void {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        this.cursoService.obtenerCursoPorId(id).subscribe({
          next: (data) => this.curso = data,
          error: (err) => {
            console.error('Error al obtener el curso:', err);
          }
        });
      }
    }
}

