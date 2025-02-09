import { Component, OnInit, inject } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';

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
  custIdService = inject(CustomerIdService);

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
  }

  data: any[] = [];
  ref: DynamicDialogRef;
  customerId$: Observable<number> = this.custIdService.getCustomerId$();

  onLoadData() {
    this.apiRequestService
      .onGetList(
        `Birthday/${this.custIdService.customerId}/${this.selectedMonth}`
      )
      .then((result: any) => {
        this.data = result;
      });
  }
}
