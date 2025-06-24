import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private admin: { username: string, nombre: string } | null = null;

  private validAdmins = [
    { username: 'admin1', password: 'admin123', nombre: 'Jaime López' },
    { username: 'admin2', password: 'clave456', nombre: 'Ricardo Almada' },
    { username: 'entrenador', password: 'fit789', nombre: 'Diego Saldaña' }
  ];

  login(username: string, password: string): { username: string, nombre: string } | null {
    const found = this.validAdmins.find(
      user => user.username === username && user.password === password
    );
    if (found) {
      this.admin = { username: found.username, nombre: found.nombre };
      return this.admin;
    }
    return null;
  }

  logout() {
    this.admin = null;
  }

  isLoggedIn(): boolean {
    return this.admin !== null;
  }

  getCurrentAdmin() {
    return this.admin;
  }
}
