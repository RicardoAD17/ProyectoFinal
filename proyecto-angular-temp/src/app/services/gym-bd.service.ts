import { Injectable } from '@angular/core';
import { addDoc, collection, Firestore } from '@angular/fire/firestore';
import { Suscripcion } from '../interfacesBD/Formularios.interface';
import { Queja } from '../componentes/queja.interface';
import { Usuarios} from '../interfacesBD/Usuarios.interface';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { doc, getDoc } from '@angular/fire/firestore';

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
      // no guardes la contraseña aquí, Firebase la maneja
    });
  }
  agregarUsuario(usuario: any) {
    const usuariosRef = collection(this.firestore, 'usuarios');
    return addDoc(usuariosRef, usuario);
  }

  //Administrador
  agregarAdministrador(admin: any) {
    const adminRef = collection(this.firestore, 'administradores');
    return addDoc(adminRef, admin);
  }

  // Formulario suscripcion con Firestore
  recuperaSuscripcionPorId(id: string) {
  const ref = doc(this.firestore, 'formularioSuscripcion', id);
  return getDoc(ref);
  }
}