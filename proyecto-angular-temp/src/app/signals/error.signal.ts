import { signal } from "@angular/core";

export const apiError = signal<string | null>(null);

// Método para limpiar el error
export function limpiarError() {
    apiError.set(null);
}