import { Component, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DataService } from 'src/app/core/services/data.service';
@Component({
  selector: 'app-send-work-plan',
  templateUrl: './send-work-plan.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class SendWorkPlanComponent {
  private dataService = inject(DataService);
  public apiRequestService = inject(ApiRequestService);
  private customToastService = inject(CustomToastService);
  private customerIdService = inject(CustomerIdService);
  private authService = inject(AuthService);

  ref: DynamicDialogRef; // Referencia a un cuadro de diálogo modal
  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  customerId = this.customerIdService.customerId;
  personId = this.authService.infoEmployeeDto.personId;
  // Inicializa con el formato adecuado "yyyy-Www"
  numeroSemanaSeleccionada: string = this.obtenerFechaActualEnFormato();

  obtenerFechaActualEnFormato(): string {
    const today = new Date();
    const year = today.getFullYear();
    const weekNumber = this.getWeekNumber(today);

    // Añade un cero al número de la semana si es menor que 10
    const formattedWeek =
      weekNumber < 10 ? `0${weekNumber}` : weekNumber.toString();

    return `${year}-W${formattedWeek}`;
  }

  getWeekNumber(date: Date): number {
    const d = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    );
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));

    // Convierte las fechas a timestamps (números)
    const timeDiff = d.getTime() - yearStart.getTime();
    return Math.ceil((timeDiff / 86400000 + 1) / 7);
  }

  onSendPlan() {
    // Obtener solo el año de la cadena '2024-W03'

    const year = this.numeroSemanaSeleccionada.split('-W')[0];

    // Obtener solo el número de semana de la cadena '2024-W03'
    const numeroSemana = +this.numeroSemanaSeleccionada.split('-W')[1];

    // Mostrar un mensaje de carga
    this.customToastService.onLoading();

    // Realizar una solicitud HTTP para eliminar un banco específico
    this.dataService
      .get(
        `WeeklyWorkPlan/Create/${numeroSemana}/${year}/${this.customerId}/${this.personId}`
      )
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: () => {
          // Cuando se completa la eliminación con éxito, mostrar un mensaje de éxito y volver a cargar los datos
          this.customToastService.onCloseToSuccess();
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }
}
