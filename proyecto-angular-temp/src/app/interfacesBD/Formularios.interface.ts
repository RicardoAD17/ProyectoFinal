export interface Suscripcion {
  id?: string; // Opcional, Firestore lo genera automáticamente si no lo defines
  nombre: string;
  correo: string;
  plan: string;
  objetivos: string[]; // Checkbox múltiple devuelto como array de strings
  genero: 'Masculino' | 'Femenino' | 'Otro';
  fecha: string; // formato 'YYYY-MM-DD'
}