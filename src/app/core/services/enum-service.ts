import { Injectable, inject } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { ISelectItemDto } from '../interfaces/ISelectItemDto.interface';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root',
})
export class EnumService {
  private dataService = inject(DataService);
  // public customToastService = inject(CustomToastService);

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  onGetSelectItemEmun(enumName: string): Observable<ISelectItemDto[]> {
    const dataSubject = new Subject<ISelectItemDto[]>();
    this.dataService
      .get<ISelectItemDto[]>(
        `Enumeration/CapaDatos.Core.Enumerations.${enumName}`
      )
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          dataSubject.next(resp.body);
          dataSubject.complete();
        },
        error: (err) => {
          console.error(err.error);
          // this.customToastService.onCloseToError();
          dataSubject.error(err.error);
        },
      });
    return dataSubject.asObservable();
  }
  getEnumValuesDisplay(enumName: string): Observable<ISelectItemDto[]> {
    const dataSubject = new Subject<ISelectItemDto[]>();
    this.dataService
      .get<ISelectItemDto[]>(
        `Enumeration/display/CapaDatos.Core.Enumerations.${enumName}`
      )
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          dataSubject.next(resp.body);
          dataSubject.complete();
        },
        error: (err) => {
          console.error(err.error);
          // this.customToastService.onCloseToError();
          dataSubject.error(err.error);
        },
      });
    return dataSubject.asObservable();
  }
}
