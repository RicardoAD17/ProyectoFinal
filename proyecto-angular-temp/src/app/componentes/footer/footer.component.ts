import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingService } from '../../services/loading.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
//Parte del loading -------------------------------------------------------------------------------------
  constructor(private router:Router,private loadingService: LoadingService, private http: HttpClient){}
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
