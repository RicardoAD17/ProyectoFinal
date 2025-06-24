import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { LoadingService } from '../../services/loading.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-galeria',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './galeria.component.html',
  styleUrl: './galeria.component.css'
})
export class GaleriaComponent {

   constructor(private router:Router,private loadingService: LoadingService, private http: HttpClient){}

   images=[
    'assets/imgcar1.jpg',
    'assets/imgcar2.jpg',
    'assets/imgcar3.jpg'
   ]
   selectedImage= this.images[0];
   selectImage(img:string){
      this.selectedImage=img;
   }

   //Parte del loading -------------------------------------------------------------------------------------
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

  openExternalLinkWithLoading(url: string) {
    this.loadingService.show();

    // Se hace una petición real a un endpoint
    this.http.get('https://jsonplaceholder.typicode.com/posts/1').subscribe({
      next: () => {
        this.loadingService.hide();
      },
      error: () => {
        this.loadingService.hide();
      }
    });
  }
//fin parte del loading -----------------------------------------------------------------------------------

}
