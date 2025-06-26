export interface Queja {
  id?: string;
  nombre: string;
  correo: string;
  motivo: string;
  fecha: string;
  opciones: string[];
  gravedad: string;
}