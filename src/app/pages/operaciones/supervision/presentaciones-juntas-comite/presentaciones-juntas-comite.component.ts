import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { DataService } from 'src/app/core/services/data.service';
import { DateService } from 'src/app/core/services/date.service';
import { FiltroCalendarService } from 'src/app/core/services/filtro-calendar.service';
// import { ViewPdfService } from 'src/app/core/services/view-pdf.service';
import ComponentsModule from 'src/app/shared/components.module';
import PrimeNgModule from 'src/app/shared/prime-ng.module';

@Component({
  selector: 'app-presentaciones-juntas-comite',
  templateUrl: './presentaciones-juntas-comite.component.html',
  standalone: true,
  imports: [ComponentsModule, CommonModule, FormsModule, PrimeNgModule],
  providers: [MessageService, CustomToastService],
})
export default class PresentacionesJuntasComiteComponent
  implements OnInit, OnDestroy
{
  private dataService = inject(DataService);
  private rangoCalendarioService = inject(FiltroCalendarService);
  private route = inject(Router);
  // private viewPdfService = inject(ViewPdfService);
  public dateService = inject(DateService);
  public messageService = inject(MessageService);
  public customToastService = inject(CustomToastService);

  data: any[] = [];
  periodo: string = this.dateService.onParseToInputMonth(
    this.rangoCalendarioService.fechaInicial
  );

  subRef$: Subscription;
  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData(): void {
    let inicial = this.dateService.getDateFormat(
      new Date(this.periodo + '-' + 1)
    );
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.subRef$ = this.dataService
      .get(`PresentacionJuntaComite/Generales/${inicial}/`)
      .subscribe({
        next: (resp: any) => {
          // Cuando se obtienen los datos con éxito, actualizar la variable 'data' y ocultar el mensaje de carga
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

  navigateToPdf(url: string) {
    // this.viewPdfService.setNameDocument(url);
    this.route.navigate(['documento/view-documento']);
  }
  ngOnDestroy(): void {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
