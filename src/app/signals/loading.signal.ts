import { signal } from "@angular/core";

export const isLoading = signal(false);

export function startLoading() {
    isLoading.set(true);
}

export function stopLoading() {
    isLoading.set(false);
}