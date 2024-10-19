import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable, Subject, takeUntil } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DataService } from 'src/app/core/services/data.service';
import { ReporteHerramientasPdfService } from 'src/app/core/services/reporte-herramientas-pdf.service';
import { environment } from 'src/environments/environment';
import AddoreditToolsComponent from './addoredit-herramienta.component';

@Component({
  selector: 'app-list-herramientas',
  templateUrl: './list-herramientas.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class ListerramientasComponent implements OnInit, OnDestroy {
  customToastService = inject(CustomToastService);
  authService = inject(AuthService);
  dataService = inject(DataService);
  apiRequestService = inject(ApiRequestService);
  messageService = inject(MessageService);
  dialogService = inject(DialogService);
  customerIdService = inject(CustomerIdService);
  public reporteHerramientasPdfService = inject(ReporteHerramientasPdfService);

  base_urlImg = '';
  data: any[] = [];

  ref: DynamicDialogRef;

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  customerId$: Observable<number> = this.customerIdService.getCustomerId$();

  ngOnInit(): void {
    this.onLoadData();
    this.urlImg(this.customerIdService.getCustomerId());
    this.customerId$ = this.customerIdService.getCustomerId$();
    this.customerId$.subscribe((resp) => {
      this.urlImg(this.customerIdService.getCustomerId());
      this.onLoadData();
    });
  }
  urlImg(customerId: number): void {
    this.base_urlImg = `${environment.base_urlImg}customers/${customerId}/tools/`;
  }
  onLoadData() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.dataService
      .get(`Tools/${this.customerIdService.customerId}`)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.data = this.customToastService.onCloseOnGetData(resp.body);
          this.reporteHerramientasPdfService.setData(this.data);
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }

  onDelete(id: number) {
    this.apiRequestService.onDelete(`Tools/${id}`).then((result: boolean) => {
      if (result) this.data = this.data.filter((item) => item.id !== id);
    });
  }

  showModalAddOrEdit(data: any) {
    this.ref = this.dialogService.open(AddoreditToolsComponent, {
      data: {
        id: data.id,
      },
      header: data.title,
      styleClass: 'modal-mdInventory',
      baseZIndex: 10000,
      closeOnEscape: true,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.customToastService.onShowSuccess();
        this.onLoadData();
      }
    });
  }
  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
