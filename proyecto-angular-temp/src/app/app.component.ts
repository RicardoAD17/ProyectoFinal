import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './componentes/footer/footer.component';
import { NavbarComponent } from './componentes/navbar/navbar.component';
import { HeaderComponent } from './componentes/header/header.component';
import { OfertadepComponent } from './componentes/ofertadep/ofertadep.component';
import { GaleriaComponent } from './componentes/galeria/galeria.component';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FooterComponent,NavbarComponent,HeaderComponent,OfertadepComponent,GaleriaComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'proyecto-angular-temp';
}
