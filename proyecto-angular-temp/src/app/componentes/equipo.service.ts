import { Injectable } from '@angular/core';

export interface Integrante {
  nombre: string;
  id: string;
  edad: number;
  foto: string;
  carrera: string;
  semestre: string;
}


@Injectable({
  providedIn: 'root'
})
export class EquipoService {
  private integrantes: Integrante[] = [
    {
      nombre: 'Ricardo Almada Díaz',
      id: '281466',
      edad: 20,
      foto: 'assets/ricardo.jpg',
      carrera: 'Ing. en Sistemas Computacionales',
      semestre: '6° C'
    },
    {
      nombre: 'Jaime López Martínez',
      id: '347301',
      edad: 20,
      foto: 'assets/jaime.jpg',
      carrera: 'Ing. en Sistemas Computacionales',
      semestre: '6° C'
    },
    {
      nombre: 'Ilse Jacqueline Martínez Espinosa',
      id: '349964',
      edad: 21,
      foto: 'assets/Ilse.jpg',
      carrera: 'Ing. en Sistemas Computacionales',
      semestre: '6° C'
    },
    {
      nombre: 'Nadia Ramírez Solis',
      id: '348271',
      edad: 21,
      foto: 'assets/Nadia.jpg',
      carrera: 'Ing. en Sistemas Computacionales',
      semestre: '6° C'
    },
    {
      nombre: 'Uriel Rodríguez Guadarrama',
      id: '349397',
      edad: 21,
      foto: 'assets/Guada.jpg',
      carrera: 'Ing. en Sistemas Computacionales',
      semestre: '6° C'
    },
    {
      nombre: 'Valeria Michelle Saucedo Díaz',
      id: '352288',
      edad: 20,
      foto: 'assets/Vale.jpg',
      carrera: 'Ing. en Sistemas Computacionales',
      semestre: '6° C'
    }
  ];

  getIntegrantes(): Integrante[] {
    return this.integrantes;
  }
  constructor() { }
}