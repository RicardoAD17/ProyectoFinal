import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
export interface Curso{
  id:number,
  nombre: string;
  descripcion: string;
  duracion: string;
  intensidad: string;
  imagen: string;
}
@Injectable({
  providedIn: 'root'
})
export class CursoService {
  private apiUrl="https://cursosgym.free.beeceptor.com"

  constructor( private http: HttpClient) {
    
   }
   obtenerCursos(): Observable<Curso[]> {
    return this.http.get<Curso[]>(this.apiUrl);
  }
}
