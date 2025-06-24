import { Component, effect, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './componentes/footer/footer.component';
import { NavbarComponent } from './componentes/navbar/navbar.component';
import { HeaderComponent } from './componentes/header/header.component';
import * as AOS from 'aos';

import { LoadingComponent } from './componentes/loading/loading.component';

import { apiError, limpiarError } from './signals/error.signal';
import Swal from 'sweetalert2';
import { isLoading } from './signals/loading.signal';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FooterComponent,NavbarComponent,HeaderComponent,LoadingComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'proyecto-angular-temp';
  isLoading = isLoading;
  apiError = apiError;

  constructor() {
    effect(() => {
      const mensajeError = this.apiError();
      if (mensajeError) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: mensajeError ?? '', 
          confirmButtonText: 'Cerrar'
        }).then(() => limpiarError());
      }
    });
  }
  limpiarError = limpiarError;

  ngOnInit() {
    AOS.init();
  }
}