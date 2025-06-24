import { Injectable } from '@angular/core';
import { addDoc, collection, Firestore } from '@angular/fire/firestore';
import { Suscripcion } from '../interfacesBD/Formularios.interface';
import { Queja } from '../componentes/queja.interface';
<<<<<<< HEAD
=======
import { Usuarios} from '../interfacesBD/Usuarios.interface';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
>>>>>>> ec1f3c105991aea59a1d4c76b35ac9f60d6a49f3

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
<<<<<<< HEAD
=======
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
>>>>>>> ec1f3c105991aea59a1d4c76b35ac9f60d6a49f3
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