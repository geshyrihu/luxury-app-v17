import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { DataConnectorService } from 'src/app/core/services/data.service';
import { DateService } from 'src/app/core/services/date.service';
import { FiltroCalendarService } from 'src/app/core/services/filtro-calendar.service';

@Component({
  selector: 'app-presentaciones-juntas-comite',
  templateUrl: './presentaciones-juntas-comite.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class PresentacionesJuntasComiteComponent
  implements OnInit, OnDestroy
{
  dataService = inject(DataConnectorService);
  apiRequestService = inject(ApiRequestService);
  rangoCalendarioService = inject(FiltroCalendarService);
  route = inject(Router);
  dateService = inject(DateService);
  messageService = inject(MessageService);
  customToastService = inject(CustomToastService);

  data: any[] = [];
  periodo: string = this.dateService.onParseToInputMonth(
    this.rangoCalendarioService.fechaInicial
  );

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData(): void {
    let inicial = this.dateService.getDateFormat(
      new Date(this.periodo + '-' + 1)
    );
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.dataService
      .get(`PresentacionJuntaComite/Generales/${inicial}/`)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.data = this.customToastService.onCloseOnGetData(resp.body);
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }

  navigateToPdf(url: string) {
    // this.viewPdfService.setNameDocument(url);
    this.route.navigate(['documento/view-documento']);
  }
  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
