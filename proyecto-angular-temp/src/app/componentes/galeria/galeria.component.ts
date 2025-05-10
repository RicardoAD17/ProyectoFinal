import { Component } from '@angular/core';

@Component({
  selector: 'app-galeria',
  standalone: true,
  imports: [],
  templateUrl: './galeria.component.html',
  styleUrl: './galeria.component.css'
})
export class GaleriaComponent {
   images=[
    'assets/imgcar1.jpg',
    'assets/imgcar2.jpg',
    'assets/imgcar3.jpg'
   ]
   selectedImage= this.images[0];
   selectImage(img:string){
      this.selectedImage=img;
   }
}
