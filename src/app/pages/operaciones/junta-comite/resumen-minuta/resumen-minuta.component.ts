import { Clipboard } from '@angular/cdk/clipboard';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { Subject, takeUntil } from 'rxjs';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { DataService } from 'src/app/core/services/data.service';
import { ReportService } from 'src/app/core/services/report.service';
import ResumenMinutaGraficoComponent from '../resumen-minuta-grafico/resumen-minuta-grafico.component';

@Component({
  selector: 'app-resumen-minuta',
  templateUrl: './resumen-minuta.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, ResumenMinutaGraficoComponent],
})
export default class ResumenMinutaComponent implements OnInit, OnDestroy {
  public customToastService = inject(CustomToastService);
  public reportService = inject(ReportService);
  public dataService = inject(DataService);
  public activatedRoute = inject(ActivatedRoute);
  public clipboard = inject(Clipboard);

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  data: any[] = [];
  dataGrafico: any[] = [];

  ngOnInit() {
    this.onLoadData();
  }

  onLoadData() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.dataService
      .get(
        `MeetingDertailsSeguimiento/ResumenMinutasPresentacion/${this.activatedRoute.snapshot.params.meetingId}`
      )
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.data = this.customToastService.onCloseOnGetData(resp.body);
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
    this.dataService
      .get(
        `MeetingDertailsSeguimiento/ResumenMinutasGraficoPresentacion/${this.activatedRoute.snapshot.params.meetingId}`
      )
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.dataGrafico = resp.body;
          this.reportService.setDataGrafico(resp.body);
          this.customToastService.onClose();
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }

  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
