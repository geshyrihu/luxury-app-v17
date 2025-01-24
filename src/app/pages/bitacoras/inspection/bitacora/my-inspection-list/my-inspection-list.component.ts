import { Component, inject, OnInit } from '@angular/core';
import { FlatpickrModule } from 'angularx-flatpickr';
import LuxuryAppComponentsModule, {
  flatpickrFactory,
} from 'app/shared/luxuryapp-components.module';
import { Observable } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';

@Component({
  selector: 'app-my-inspection-list',
  standalone: true,
  imports: [LuxuryAppComponentsModule, FlatpickrModule],
  templateUrl: './my-inspection-list.component.html',
})
export default class MyInspectionListComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  dialogHandlerService = inject(DialogHandlerService);
  custIdService = inject(CustomerIdService);

  customerId$: Observable<number> = this.custIdService.getCustomerId$();

  // Método para actualizar la fecha seleccionada
  data: any = [];
  ngOnInit(): void {
    flatpickrFactory();
    this.onLoadData();
    this.customerId$ = this.custIdService.getCustomerId$();
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

      const urlApi = `InspectionResult/GetInspectionsByCustomer/${this.custIdService.customerId}/${formattedDate}`;

      this.apiRequestService.onGetList(urlApi).then((result: any) => {
        this.data = result;
      });
    }
  }

  onDateChange(newDate: string): void {
    this.dateSelect = new Date(newDate); // Asegura que se convierta a Date
    this.onLoadData(); // Recargar datos con la nueva fecha
  }
}
