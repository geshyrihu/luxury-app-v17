import { Injectable, inject } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root',
})
export class CustomerIdService {
  public dataService = inject(DataService);

  nameCustomer: string = '';
  logoCustomer: string = '';
  customerId: number = 0; // Valor predeconcluido para el ID del cliente
  private customerId$ = new Subject<number>(); // Observable para el ID del cliente

  constructor(public authService: AuthService) {
    // Al construir el servicio, se intenta obtener el ID del cliente desde AuthService
    if (this.authService.userTokenDto) {
      this.customerId =
        this.authService.userTokenDto.infoUserAuthDto.customerId;
    }
  }

  /**
   * Establece el ID del cliente y notifica a los observadores.
   * @param customerId El ID del cliente a establecer.
   */
  setCustomerId(customerId: number) {
    this.customerId = customerId;
    this.customerId$.next(customerId); // Notificar a los observadores sobre el cambio en el ID del cliente.

    this.onLoadData(customerId);
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

  onLoadData(customerId: number) {
    this.dataService.get(`Customers/${customerId}`).subscribe((resp: any) => {
      this.nameCustomer = resp.body.nameCustomer;
      this.logoCustomer = `${environment.base_urlImg}Administration/customer/${resp.body.photoPath}`;
    });
  }
}
