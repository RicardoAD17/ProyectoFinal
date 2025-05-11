import { Component } from '@angular/core';
import { OfertadepComponent } from '../ofertadep/ofertadep.component';
import { GaleriaComponent } from '../galeria/galeria.component';
import { UbicacionComponent } from '../ubicacion/ubicacion.component';

@Component({
  selector: 'app-home',
  imports: [GaleriaComponent,OfertadepComponent,UbicacionComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
