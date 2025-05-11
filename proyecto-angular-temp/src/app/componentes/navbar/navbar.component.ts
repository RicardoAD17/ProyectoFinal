import { Component } from '@angular/core';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
declare var bootstrap: any;
@Component({
  selector: 'app-navbar',
  standalone:true,
  imports: [MatButtonModule,MatMenuModule,RouterModule,CommonModule,FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  admin = { email: '', password: '' };
  loginError = false;
  validAdmins = [
    { email: 'admin@gym.com', password: 'admin123' },
    { email: 'entrenador@gym.com', password: 'fit456' }
  ];

  loginExitoso = false;

login() {
  const found = this.validAdmins.find(
    user => user.email === this.admin.email && user.password === this.admin.password
  );

  this.loginExitoso = !!found;
  this.loginError = !this.loginExitoso;

  if (this.loginExitoso) {
    Swal.fire({
      icon: 'success',
      title: '¡Inicio de sesión exitoso!',
      text: 'Bienvenido!.'
    }).then(() => {
      const modalElement = document.getElementById('adminLoginModal');
      if (modalElement) {
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        modalInstance?.hide();
      }
    });
  }
}
}
