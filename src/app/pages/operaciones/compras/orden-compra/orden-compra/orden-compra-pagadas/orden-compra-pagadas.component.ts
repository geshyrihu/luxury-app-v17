import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable, Subject, takeUntil } from 'rxjs';
import { CurrencyMexicoPipe } from 'src/app/core/pipes/currencyMexico.pipe';
import { CustomerIdService } from 'src/app/core/services/common-services';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { DataService } from 'src/app/core/services/data.service';
import { OrdenCompraService } from 'src/app/core/services/orden-compra.service';

import OrdenCompraComponent from '../orden-compra.component';

@Component({
  selector: 'app-orden-compra-pagadas',
  templateUrl: './orden-compra-pagadas.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CurrencyMexicoPipe],
})
export default class OrdenCompraPagadasComponent implements OnInit, OnDestroy {
  public customToastService = inject(CustomToastService);
  public dataService = inject(DataService);
  public customerIdService = inject(CustomerIdService);
  public router = inject(Router);
  public dialogService = inject(DialogService);
  public messageService = inject(MessageService);
  public ordenCompraService = inject(OrdenCompraService);

  data: any[] = [];
  customerId$: Observable<number> = this.customerIdService.getCustomerId$();
  tipo = 1;
  ref: DynamicDialogRef;

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  ngOnInit(): void {
    this.onLoadData(1);
    this.customerId$ = this.customerIdService.getCustomerId$();
    this.customerId$.subscribe((resp) => {
      this.onLoadData(1);
    });
  }

  onLoadData(type: any) {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.dataService
      .get(`OrdenCompra/Pagadas/${this.customerIdService.customerId}/${type}`)
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
  onAddOrEdit(id: number) {
    this.ordenCompraService.setOrdenCompraId(id);
    this.ref = this.dialogService.open(OrdenCompraComponent, {
      data: {
        id,
      },
      header: 'Editar Orden de Compra',
      width: '100%',
      height: '100%',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.customToastService.onShowSuccess();
        this.onLoadData(this.tipo);
      }
    });
  }
  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
