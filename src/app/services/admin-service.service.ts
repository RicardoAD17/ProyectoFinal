import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private apiUrl = 'http://localhost:3000/api';  // Ajusta según sea necesario

  constructor(private http: HttpClient) {}
  eliminarSuscripcion(id: string) {
    return this.http.delete(`http://localhost:3000/api/suscripciones/${id}`);
  }
  editarSuscripcion(id: string, datos: any) {
    return this.http.put(`http://localhost:3000/api/suscripciones/${id}`, datos);
  }
  editarQueja(id: string, datos: any) {
    return this.http.put(`http://localhost:3000/api/quejas/${id}`, datos);
  }

  eliminarQueja(id: string) {
    return this.http.delete(`http://localhost:3000/api/quejas/${id}`);
  }

  obtenerSuscripciones() {
    return this.http.get<any[]>(`${this.apiUrl}/suscripciones`);
  }

  obtenerQuejas() {
    return this.http.get<any[]>(`${this.apiUrl}/quejas`);
  }
}
