import { Injectable } from '@angular/core';
import { addDoc, collection, Firestore, getDocs, query, where } from '@angular/fire/firestore';
import { Suscripcion } from '../interfacesBD/Formularios.interface';
import { Queja } from '../componentes/queja.interface';
import { Usuarios} from '../interfacesBD/Usuarios.interface';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class GymBdService {

  constructor(private firestore: Firestore,private auth: Auth) { }

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
  // Registro con Firebase Authentication y Firestore
  async registrarUsuario(usuario: Usuarios) {
    const credenciales = await createUserWithEmailAndPassword(this.auth, usuario.correo, usuario.password);
    
    // Si se registra, guarda el nombre y email en Firestore
    const refUsuarios = collection(this.firestore, 'usuarios');
    return addDoc(refUsuarios, {
      uid: credenciales.user.uid,
      nombre: usuario.nombre,
      correo: usuario.correo
    });
  }

  async registrarAdministrador(admin: { nombre: string, correo: string, password: string }) {
    const cred = await createUserWithEmailAndPassword(this.auth, admin.correo, admin.password);

    const ref = collection(this.firestore, 'administradores');
    return addDoc(ref, {
      uid: cred.user.uid,
      nombre: admin.nombre,
      correo: admin.correo
    });
  }

  async obtenerAdministradorPorUID(uid: string) {
    const ref = collection(this.firestore, 'administradores');
    const q = query(ref, where('uid', '==', uid));
    const snapshot = await getDocs(q);
    return snapshot.empty ? null : snapshot.docs[0].data();
  }

  async obtenerUsuarioPorUID(uid: string) {
    const ref = collection(this.firestore, 'usuarios');
    const q = query(ref, where('uid', '==', uid));
    const snapshot = await getDocs(q);
    return snapshot.empty ? null : snapshot.docs[0].data();
  }

}