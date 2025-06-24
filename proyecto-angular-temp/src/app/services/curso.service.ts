import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { apiError } from '../signals/error.signal';
export interface Curso {
  id: number;
  nombre: string;
  descripcion: string;
  duracion: string;
  intensidad: string;
  imagen: string;

  categoria?: string;
  requisitos?: string;
  instructor?: string;
  cupos?: number;
  ubicacion?: string;
  horarios?: string[];
  beneficios?: string[];
}
@Injectable({
  providedIn: 'root'
})
export class CursoService {
  private apiUrl="https://cursogym.free.beeceptor.com"

  constructor( private http: HttpClient) {}

   obtenerCursos(): Observable<Curso[]> {
    return this.http.get<Curso[]>(this.apiUrl).pipe(
      catchError((error) => {
        apiError.set('Error al obtener los cursos');
        return throwError(() => error);
      })
    );
  }

  obtenerCursoPorId(id: string): Observable<Curso> {
    return this.http.get<Curso[]>(this.apiUrl).pipe(
      map((cursos: Curso[]) => cursos.find((c: Curso) => c.id === Number(id)) as Curso),
      catchError((error) => {
        apiError.set('Error al cargar el curso solicitado');
        return throwError(() => error);
      })
    );
  }
}