import { Injectable, OnDestroy, inject } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { DataService } from './data.service';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class CustomerIdService implements OnDestroy {
  public dataService = inject(DataService);
  private storageService = inject(StorageService);

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  nameCustomer: string = '';
  logoCustomer: string = '';
  customerId: number = 0; // Valor predeconcluido para el ID del cliente
  private customerId$ = new Subject<number>(); // Observable para el ID del cliente

  constructor(public authService: AuthService) {
    // Al construir el servicio, se intenta obtener el ID del cliente desde AuthService

    // Verificamos simpre que exista un Token si existe
    // Obtener el token almacenado en el sistema de almacenamiento
    if (this.authService.userTokenDto) {
      // si hay toquen intentamos obtener la clave del cliente almacenada
      // Si no existe
      if (
        this.storageService.retrieve('customerId') === null ||
        this.storageService.retrieve('customerId') === undefined
      ) {
        this.storageService.store(
          'customerId',
          this.authService.userTokenDto.infoUserAuthDto.customerId
        );
        this.customerId =
          this.authService.userTokenDto.infoUserAuthDto.customerId;
      } else {
        this.customerId = this.storageService.retrieve('customerId');
      }
    }
  }

  /**
   * Establece el ID del cliente y notifica a los observadores.
   * @param customerId El ID del cliente a establecer.
   */
  setCustomerId(customerId: number) {
    this.customerId = customerId;
    this.storageService.store('customerId', customerId);
    this.customerId$.next(customerId); // Notificar a los observadores sobre el cambio en el ID del cliente.
    this.onLoadDataCustomer(customerId);
  }

  /**
   * Obtiene un observable que emite el ID del cliente cuando cambia.
   * @returns Un observable que emite el ID del cliente cuando cambia.
   */
  getCustomerId$(): Observable<number> {
    return this.customerId$.asObservable();
  }

  /**
   * Obtiene el valor actual del ID del cliente.
   * @returns El valor actual del ID del cliente.
   */
  getcustomerId() {
    return this.customerId;
  }

  onLoadDataCustomer(customerId: number) {
    this.dataService
      .get(`Customers/${customerId}`)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.nameCustomer = resp.body.nameCustomer;
          this.logoCustomer = `${environment.base_urlImg}Administration/customer/${resp.body.photoPath}`;
        },
        error: (error) => {
          console.error(error.error);
        },
      });
  }

  ngOnDestroy(): void {
    // Cuando se destruye el componente, desvincular y liberar recursos
    this.destroy$.next();
    this.destroy$.complete();
  }
}
