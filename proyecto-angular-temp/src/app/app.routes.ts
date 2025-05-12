import { Routes } from '@angular/router';
import { SuscripcionComponent } from './componentes/suscripcion/suscripcion.component';
import { HomeComponent } from './componentes/home/home.component';
import { NosotrosComponent } from './componentes/nosotros/nosotros.component';
import { CursoComponent } from './componentes/curso/curso.component';
import { TablasComponent } from './componentes/tablas/tablas.component';

export const routes: Routes = [
  { path: '', component: HomeComponent }, 
  { path: 'curso', component: CursoComponent},
  { path: 'nosotros', component: NosotrosComponent},
  { path: 'suscripcion', component: SuscripcionComponent },
  { path: 'tablas', component: TablasComponent },
  { path: '**', redirectTo: '' },
];
