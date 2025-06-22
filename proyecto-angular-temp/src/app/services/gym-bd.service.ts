import { Injectable } from '@angular/core';
import { addDoc, collection, Firestore } from '@angular/fire/firestore';
import { Suscripcion } from '../interfacesBD/Formularios.interface';
import { Queja } from '../componentes/queja.interface';

@Injectable({
  providedIn: 'root'
})
export class GymBdService {

  constructor(private firestore: Firestore,) { }

  //Formularios
  agregarSuscripcion(suscripcion: Suscripcion) {
    const ref = collection(this.firestore, 'formularioSuscripcion');
    return addDoc(ref, suscripcion);
  }

  agregarQueja(queja: Queja) {
    const ref = collection(this.firestore, 'formularioQueja');
    return addDoc(ref, queja);
  }

  //Usuarios
  agregarUsuario(usuario: any) {
    const usuariosRef = collection(this.firestore, 'usuarios');
    return addDoc(usuariosRef, usuario);
  }

  //Administrador
  agregarAdministrador(admin: any) {
    const adminRef = collection(this.firestore, 'administradores');
    return addDoc(adminRef, admin);
  }
}
