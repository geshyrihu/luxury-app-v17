import { Component, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { TicketGroupService } from '../../ticket.service';

@Component({
  selector: 'app-ticket-message-report-work-plan-preview',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
  templateUrl: './ticket-message-report-work-plan-preview.component.html',
})
export default class TicketMessageReportWorkPlanPreviewComponent {
  apiRequestService = inject(ApiRequestService);
  custIdService = inject(CustomerIdService);
  authS = inject(AuthService);
  ticketGroupService = inject(TicketGroupService);

  data: any; // Almacena los datos obtenidos del API

  year: number = 0; // Almacena el año seleccionado
  numeroSemana: number = 0; // Almacena el número de semana seleccionado
  weekInputValue: string = '';

  ngOnInit(): void {
    this.setCurrentWeekAndYear();
    this.onLoadData(); // Cargar datos al inicializar el componente
  }

  onSendWoekPlan() {
    const urlApi = `TicketWorkPlan/Create/${
      this.authS.applicationUserId
    }/${this.custIdService.getCustomerId()}/${this.year}/${this.numeroSemana}`;
    this.apiRequestService.onGetList(urlApi);
  }
  onLoadData() {
    // No sobreescribimos el año y la semana seleccionados con los valores actuales
    const urlApi = `TicketWorkPlan/Preview/${this.custIdService.getCustomerId()}/${
      this.year
    }/${this.numeroSemana}`;

    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.data = result;
    });
  }

  handleWeekChange(event: Event): void {
    const weekValue = (event.target as HTMLInputElement).value; // '2024-W41' o '2024-W42'

    // Verifica el valor de 'weekValue'
    if (weekValue) {
      const [year, week] = weekValue.split('-W');
      this.year = parseInt(year, 10);
      this.numeroSemana = parseInt(week, 10);

      // Luego carga los datos
      this.onLoadData();
    }
  }
  // Función para calcular la semana actual y establecerla en el input
  setCurrentWeekAndYear(): void {
    const today = new Date();
    const currentYear = today.getFullYear();

    // Obtener el primer día del año
    const firstDayOfYear = new Date(currentYear, 0, 1);
    const dayOfYear = Math.floor(
      (today.getTime() - firstDayOfYear.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Obtener la semana actual (añadir 1 ya que la semana 1 empieza en el primer día)
    const currentWeek = Math.ceil(
      (dayOfYear + firstDayOfYear.getDay() + 1) / 7
    );

    // Asignar año y semana al input en formato 'YYYY-WXX'
    this.year = currentYear;
    this.numeroSemana = currentWeek;
    this.weekInputValue = `${this.year}-W${this.numeroSemana
      .toString()
      .padStart(2, '0')}`;
  }
}
