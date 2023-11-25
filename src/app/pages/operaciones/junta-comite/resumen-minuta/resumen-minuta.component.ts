import { Clipboard } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { Subscription } from 'rxjs';
import { SanitizeHtmlPipe } from 'src/app/core/pipes/sanitize-html.pipe';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { DataService } from 'src/app/core/services/data.service';
import { ReportService } from 'src/app/core/services/report.service';
import ComponentsModule from 'src/app/shared/components.module';
import ResumenMinutaGraficoComponent from '../resumen-minuta-grafico/resumen-minuta-grafico.component';

@Component({
  selector: 'app-resumen-minuta',
  templateUrl: './resumen-minuta.component.html',
  standalone: true,
  imports: [
    ResumenMinutaGraficoComponent,
    ComponentsModule,
    CommonModule,
    TableModule,
    SanitizeHtmlPipe,
  ],
  providers: [CustomToastService, MessageService],
})
export default class ResumenMinutaComponent implements OnInit, OnDestroy {
  public customToastService = inject(CustomToastService);
  public reportService = inject(ReportService);
  public dataService = inject(DataService);
  public activatedRoute = inject(ActivatedRoute);
  public clipboard = inject(Clipboard);

  subRef$: Subscription;

  data: any[] = [];
  dataGrafico: any[] = [];

  ngOnInit() {
    this.onLoadData();
  }

  onLoadData() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.subRef$ = this.dataService
      .get(
        `MeetingDertailsSeguimiento/ResumenMinutasPresentacion/${this.activatedRoute.snapshot.params.meetingId}`
      )
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
    this.subRef$ = this.dataService
      .get(
        `MeetingDertailsSeguimiento/ResumenMinutasGraficoPresentacion/${this.activatedRoute.snapshot.params.meetingId}`
      )
      .subscribe({
        next: (resp: any) => {
          this.dataGrafico = resp.body;
          this.reportService.setDataGrafico(resp.body);
          this.customToastService.onClose();
        },
        error: (err) => {
          // En caso de error, mostrar un mensaje de error y registrar el error en la consola
          this.customToastService.onCloseToError();
          console.log(err.error);
        },
      });
  }

  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
