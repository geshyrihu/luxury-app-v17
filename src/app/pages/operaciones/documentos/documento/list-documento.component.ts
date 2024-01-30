import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable, Subject, takeUntil } from 'rxjs';
import {
  ApiRequestService,
  CustomToastService,
  CustomerIdService,
  DataService,
} from 'src/app/core/services/common-services';
import ComponentsModule from 'src/app/shared/components.module';
import PrimeNgModule from 'src/app/shared/prime-ng.module';
import { environment } from 'src/environments/environment';
import AddoreditDocumentoComponent from './addoredit-documento.component';

@Component({
  selector: 'app-list-docuento',
  templateUrl: './list-documento.component.html',
  standalone: true,
  imports: [ComponentsModule, CommonModule, PrimeNgModule],
  providers: [DialogService, MessageService, CustomToastService],
})
export default class ListDocumentoComponent implements OnInit, OnDestroy {
  public customToastService = inject(CustomToastService);
  public dataService = inject(DataService);
  public customerIdService = inject(CustomerIdService);
  public apiRequestService = inject(ApiRequestService);
  public dialogService = inject(DialogService);
  public messageService = inject(MessageService);

  data: any[] = [];

  customerId$: Observable<number> = this.customerIdService.getCustomerId$();
  urlBase = environment.base_urlImg;
  // state: boolean = true;
  ref: DynamicDialogRef;

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  items = [
    {
      label: 'Editar',
      // command: () => this.onModalAddOrEdit(this.produc),
    },
  ];

  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }

  ngOnInit(): void {
    this.onLoadData();
    this.customerId$ = this.customerIdService.getCustomerId$();
    this.customerId$.subscribe((_) => {
      this.onLoadData();
    });
  }

  onLoadData() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.dataService
      .get(
        'DocumentoCustomer/GetAll/' +
          this.customerIdService.getcustomerId() +
          '/'
      )
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.data = this.customToastService.onCloseOnGetData(resp.body);
          console.log('🚀 ~ resp.body:', resp.body);
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }
  // onChangeState(state: boolean) {
  //   this.onLoadData();
  // }
  onModalAddOrEdit(data: any) {
    this.ref = this.dialogService.open(AddoreditDocumentoComponent, {
      data: {
        id: data.id,
      },
      header: data.title,
      styleClass: 'modal-md',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.customToastService.onShowSuccess();
        this.onLoadData();
      }
    });
  }

  onDelete(id: number) {
    this.apiRequestService
      .onDelete(`documentocustomer/${id}`)
      .then((result: boolean) => {
        if (result) this.data = this.data.filter((item) => item.id !== id);
      });
  }
}
