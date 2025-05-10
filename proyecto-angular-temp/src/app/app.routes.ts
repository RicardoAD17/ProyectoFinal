import { Routes } from '@angular/router';
import { SuscripcionComponent } from './componentes/suscripcion/suscripcion.component';
import { HomeComponent } from './componentes/home/home.component';

export const routes: Routes = [
    { path: '', component: HomeComponent }, // página principal
  { path: 'suscripcion', component: SuscripcionComponent },
  { path: '**', redirectTo: '' } // redirección a home si ruta no existe
];
