import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { Subscription } from 'rxjs';
import { IFechasFiltro } from 'src/app/core/interfaces/IFechasFiltro.interface';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { DataService } from 'src/app/core/services/data.service';
import { DateService } from 'src/app/core/services/date.service';
import { FiltroCalendarService } from 'src/app/core/services/filtro-calendar.service';
import ComponentsModule from 'src/app/shared/components.module';

@Component({
  selector: 'app-resultado-general-posicion',
  templateUrl: './resultado-general-posicion.component.html',
  standalone: true,
  imports: [ComponentsModule, CommonModule, TableModule],
  providers: [MessageService, CustomToastService],
})
export default class ResultadoGeneralPosicionComponent
  implements OnInit, OnDestroy
{
  public dataService = inject(DataService);
  public dateService = inject(DateService);
  public customToastService = inject(CustomToastService);
  public dialogService = inject(DialogService);
  public messageService = inject(MessageService);
  public rangoCalendarioService = inject(FiltroCalendarService);

  fechaInicial: string = '';
  fechaFinal: string = '';
  data: any;
  subRef$: Subscription;

  ngOnInit() {
    this.fechaInicial = this.dateService.getDateFormat(
      this.rangoCalendarioService.fechaInicial
    );
    this.fechaFinal = this.dateService.getDateFormat(
      this.rangoCalendarioService.fechaFinal
    );
    this.onLoadData(this.fechaInicial, this.fechaFinal);
    this.rangoCalendarioService.fechas$.subscribe((resp: IFechasFiltro) => {
      this.onLoadData(resp.fechaInicio, resp.fechaFinal);
    });
  }

  onLoadData(fechaInicio: string, fechaFinal: string) {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.subRef$ = this.dataService
      .get(`ResumenGeneral/Posicion/${fechaInicio}/${fechaFinal}`)
      .subscribe({
        next: (resp: any) => {
          this.data = resp.body;
          this.customToastService.onClose();
        },
        error: (err) => {
          // En caso de error, mostrar un mensaje de error y registrar el error en la consola
          this.customToastService.onCloseToError();
          console.log(err.error);
        },
      });
  }

  ngOnDestroy(): void {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
