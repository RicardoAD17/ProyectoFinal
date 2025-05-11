import { AfterViewInit, Component } from '@angular/core';
import * as L from 'leaflet';
@Component({
  selector: 'app-ubicacion',
  standalone:true,
  imports: [],
  templateUrl: './ubicacion.component.html',
  styleUrl: './ubicacion.component.css'
})
export class UbicacionComponent implements AfterViewInit{
  private map: L.Map | undefined;
  ngAfterViewInit(): void {
    this.initMap();
  }
  private initMap(): void {
    this.map = L.map('map').setView([21.81294374043674, -102.28633600744277], 18); 
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

   L.marker([21.81294374043674, -102.28633600744277]).addTo(this.map)
  .openPopup();
  }
}
