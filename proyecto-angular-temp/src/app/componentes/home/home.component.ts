import { Component } from '@angular/core';

import { OfertadepComponent } from '../ofertadep/ofertadep.component';
import { GaleriaComponent } from '../galeria/galeria.component';

@Component({
  selector: 'app-home',
  imports: [OfertadepComponent,GaleriaComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}