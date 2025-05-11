
import { OfertadepComponent } from '../ofertadep/ofertadep.component';
import { GaleriaComponent } from '../galeria/galeria.component';
import { HeaderComponent } from '../header/header.component';
import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [GaleriaComponent,OfertadepComponent, HeaderComponent],

  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}