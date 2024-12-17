import { Component, OnInit, inject } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import { environment } from 'src/environments/environment';

const base_urlImg = environment.base_urlImg + 'Administration/accounts/';

@Component({
  selector: 'app-birthday',
  templateUrl: './birthday.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, FullCalendarModule],
})
export default class BirthdayComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  dialogHandlerService = inject(DialogHandlerService);
  authS = inject(AuthService);
  customerIdService = inject(CustomerIdService);

  url = base_urlImg;
  selectedMonth: number | null = null;
  months: string[] = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];

  ngOnInit() {
    const currentMonthIndex = new Date().getMonth(); // Obtiene el índice del mes actual (0-11)
    this.selectedMonth = currentMonthIndex; // Asigna el índice del mes actual
    this.onLoadData();
    this.customerId$.subscribe(() => {
      this.onLoadData();
    });
  }
  onMonthSelect(month: number): void {
    this.selectedMonth = month;
    this.onLoadData();
    // Aquí puedes hacer lo que necesites con el mes seleccionado
  }

  data: any[] = [];
  ref: DynamicDialogRef;
  customerId$: Observable<number> = this.customerIdService.getCustomerId$();

  onLoadData() {
    this.apiRequestService
      .onGetList(
        `Employees/Birthday/${this.customerIdService.customerId}/${this.selectedMonth}`
      )
      .then((result: any) => {
        this.data = result;
      });
  }
}
