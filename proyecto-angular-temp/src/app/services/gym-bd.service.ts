import { Injectable } from '@angular/core';
import { addDoc, collection, Firestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class GymBdService {

  constructor(private firestore: Firestore) { }

  agregarUsuario(usuario: any) {
    const usuariosRef = collection(this.firestore, 'usuarios');
    return addDoc(usuariosRef, usuario);
  }

  agregarFormulario(formulario: any) {
    const formulariosRef = collection(this.firestore, 'formularios');
    return addDoc(formulariosRef, formulario);
  }

  agregarAdministrador(admin: any) {
    const adminRef = collection(this.firestore, 'administradores');
    return addDoc(adminRef, admin);
  }
}
