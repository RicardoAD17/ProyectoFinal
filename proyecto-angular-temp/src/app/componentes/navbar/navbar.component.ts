import { Component } from '@angular/core';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { RecaptchaModule } from 'ng-recaptcha';
import { ViewChild } from '@angular/core';
import { RecaptchaComponent } from 'ng-recaptcha';

import { Router } from '@angular/router';
import { LoadingService } from '../../services/loading.service';
import { HttpClient } from '@angular/common/http';

declare var bootstrap: any;
@Component({
  selector: 'app-navbar',
  standalone:true,
  imports: [MatButtonModule,MatMenuModule,RouterModule,CommonModule,FormsModule,RecaptchaModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  @ViewChild('recaptchaRef') recaptchaComponent!: RecaptchaComponent;

  admin = { username: '', password: '' };
  currentAdmin: { username: string, nombre: string } | null = null;
  loginError = false;

  validAdmins = [
    { username: 'admin1', password: 'admin123', nombre: 'Jaime López' },
    { username: 'admin2', password: 'clave456', nombre: 'Ricardo Almada' },
    { username: 'entrenador', password: 'fit789', nombre: 'Diego Saldaña' }
  ];

  captchaToken: string | null = null;

  onCaptchaResolved(token: string | null) {
  this.captchaToken = token;
  }


  login() {
  if (!this.captchaToken) {
    Swal.fire({
      icon: 'warning',
      title: 'Captcha requerido',
      text: 'Por favor, verifica que no eres un robot.'
    });
    return;
  }

  const found = this.validAdmins.find(
    user => user.username === this.admin.username && user.password === this.admin.password
  );

  if (found) {
    this.currentAdmin = { username: found.username, nombre: found.nombre };
    this.loginError = false;

    Swal.fire({
      icon: 'success',
      title: '¡Inicio de sesión exitoso!',
      text: `Bienvenido, ${found.nombre}`
    }).then(() => {
      const modalElement = document.getElementById('adminLoginModal');
      if (modalElement) {
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        modalInstance?.hide();
      }
    });
  } else {
    this.loginError = true;
  }

  // Limpia el captcha después de cada intento
  this.captchaToken = null;
}


  logout() {
    this.currentAdmin = null;
    this.recaptchaComponent?.reset(); // 💡 Reinicia el captcha visual y lógicamente
    this.captchaToken = null;
    Swal.fire({
      icon: 'info',
      title: 'Sesión cerrada',
      text: 'Has cerrado la sesión exitosamente.'
    });
  }


    //Parte del loading -------------------------------------------------------------------------------------
  constructor(private router:Router,private loadingService: LoadingService, private http: HttpClient){}
  navigateWithLoading(path: string) {
    this.loadingService.show();

    this.http.get('https://jsonplaceholder.typicode.com/posts/1').subscribe({
      next: () => {
        this.loadingService.hide();
        this.router.navigate([path]);
      },
      error: () => {
        this.loadingService.hide();
        this.router.navigate([path]);
      }
    });
  }
//fin parte del loading -----------------------------------------------------------------------------------

}
