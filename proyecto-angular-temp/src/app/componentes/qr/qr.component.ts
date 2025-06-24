import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import * as QRCode from 'qrcode';

@Component({
  selector: 'app-qr',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  template: `
    <canvas #qrCanvas></canvas>
    <button (click)="obtenerDatos()">Generar QR con datos del API</button>
  `
})
export class QrComponent {

  @ViewChild('qrCanvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;

  constructor(private http: HttpClient) {}

  obtenerDatos() {
    const userId = 'usuario123';  // Este puede venir de login o localStorage

    this.http.get(`http://localhost:3000/api/qr-data/${userId}`).subscribe({
      next: (res: any) => {
        const datos = JSON.stringify(res);
        this.generarQR(datos);
      },
      error: (err) => console.error('Error al obtener datos:', err)
    });
  }

  generarQR(texto: string) {
    QRCode.toCanvas(this.canvas.nativeElement, texto, { width: 256 }, error => {
      if (error) console.error(error);
      else console.log('QR generado con datos del API');
    });
  }
}
