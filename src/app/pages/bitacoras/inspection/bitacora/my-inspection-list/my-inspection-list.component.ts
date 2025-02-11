import { Component, inject, OnInit } from '@angular/core';
import { FlatpickrModule } from 'angularx-flatpickr';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { Observable } from 'rxjs';
import { flatpickrFactory } from 'src/app/core/helpers/flatpickr-factory';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';

@Component({
  selector: 'app-my-inspection-list',
  standalone: true,
  imports: [LuxuryAppComponentsModule, FlatpickrModule],
  templateUrl: './my-inspection-list.component.html',
})
export default class MyInspectionListComponent implements OnInit {
  authService = inject(AuthService);
  apiRequestS = inject(ApiRequestService);
  dialogHandlerS = inject(DialogHandlerService);
  customerIdS = inject(CustomerIdService);

  customerId$: Observable<number> = this.customerIdS.getCustomerId$();

  // Método para actualizar la fecha seleccionada
  data: any = [];
  ngOnInit(): void {
    flatpickrFactory();
    this.onLoadData();
    this.customerId$.subscribe(() => {
      this.onLoadData();
    });
  }

  dateSelect: Date | string = new Date(); // Asegura que sea un Date al inicializar

  onLoadData() {
    // Formatear la fecha manualmente sin zonas horarias
    if (this.dateSelect instanceof Date) {
      const year = this.dateSelect.getFullYear();
      const month = String(this.dateSelect.getMonth() + 1).padStart(2, '0'); // Mes comienza en 0
      const day = String(this.dateSelect.getDate()).padStart(2, '0');

      const formattedDate = `${year}-${month}-${day}`; // yyyy-MM-dd

      const urlApi = `InspectionResult/GetInspectionsByCustomer/${this.authService.applicationUserId}/${this.customerIdS.customerId}/${formattedDate}`;

      this.apiRequestS.onGetList(urlApi).then((responseData: any) => {
        this.data = responseData;
      });
    }
  }

  onDateChange(newDate: string): void {
    this.dateSelect = new Date(newDate); // Asegura que se convierta a Date
    this.onLoadData(); // Recargar datos con la nueva fecha
  }
}
