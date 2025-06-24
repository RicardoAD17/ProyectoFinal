export interface Usuarios {
  id?: string; // Opcional, Firestore lo genera automáticamente si no lo defines
  nombre: string;
  correo: string;
  password: string;
}