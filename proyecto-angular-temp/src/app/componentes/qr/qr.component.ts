import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';  // Import necesario para ngModel
import { HttpClient, HttpClientModule } from '@angular/common/http';
import * as QRCode from 'qrcode';

@Component({
  selector: 'app-qr',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './qr.component.html',
})
export class QrComponent {

  textoQR: string = '';  // Propiedad para ngModel
  @ViewChild('qrCanvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;

  constructor(private http: HttpClient) {}

  obtenerDatos() {
    const userId = 'usuario123';
    this.http.get(`http://localhost:3000/api/qr-data/${userId}`).subscribe({
      next: (res: any) => {
        const datos = JSON.stringify(res);
        this.generarQR(datos);
      },
      error: (err) => console.error('Error al obtener datos:', err)
    });
  }

  generarQR(texto: string) {
QRCode.toCanvas(this.canvas.nativeElement, texto, { width: 256 }, (error?: Error | null) => {
  if (error) console.error(error);
  else console.log('QR generado');
});
  }
}
