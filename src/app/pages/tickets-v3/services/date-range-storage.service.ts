import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DateRangeStorageService {
  private storageKey = 'ticketDateRange';

  constructor() {}

  // Guardar las fechas seleccionadas en localStorage
  saveDateRange(from: Date | null, to: Date | null): void {
    if (from && to) {
      const dateRange = {
        from: from.toISOString(),
        to: to.toISOString(),
      };
      localStorage.setItem(this.storageKey, JSON.stringify(dateRange));
    }
  }

  // Recuperar las fechas seleccionadas de localStorage
  getDateRange(): { from: Date | null; to: Date | null } {
    const savedDates = localStorage.getItem(this.storageKey);
    if (savedDates) {
      const { from, to } = JSON.parse(savedDates);
      return {
        from: new Date(from),
        to: new Date(to),
      };
    }
    return { from: null, to: null };
  }

  // Limpiar el almacenamiento de fechas
  clearDateRange(): void {
    localStorage.removeItem(this.storageKey);
  }
}
