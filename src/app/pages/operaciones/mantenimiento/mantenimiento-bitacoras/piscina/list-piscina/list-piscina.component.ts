import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ImageModule } from 'primeng/image';
import { Observable, Subject, takeUntil } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DataService } from 'src/app/core/services/data.service';
import { environment } from 'src/environments/environment';
import AddOrEditPiscinaComponent from '../addoredit-piscina/addoredit-piscina.component';

@Component({
  selector: 'app-list-piscina',
  templateUrl: './list-piscina.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, ImageModule],
})
export default class ListPiscinaComponent implements OnInit, OnDestroy {
  dataService = inject(DataService);
  apiRequestService = inject(ApiRequestService);
  authService = inject(AuthService);
  public dialogService = inject(DialogService);
  public messageService = inject(MessageService);
  customToastService = inject(CustomToastService);
  public customerIdService = inject(CustomerIdService);

  data: any[] = [];
  ref: DynamicDialogRef;

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  customerId$: Observable<number> = this.customerIdService.getCustomerId$();
  urlBaseImg = `${
    environment.base_urlImg
  }customers/${this.customerIdService.getcustomerId()}/piscina/`;
  ngOnInit(): void {
    this.onLoadData();
    this.customerId$ = this.customerIdService.getCustomerId$();
    this.customerId$.subscribe(() => {
      this.onLoadData();
    });
  }
  onLoadData() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();

    this.dataService
      .get<any[]>('piscina/getall/' + this.customerIdService.customerId)
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
  onModalAddOrEdit(data: any) {
    this.ref = this.dialogService.open(AddOrEditPiscinaComponent, {
      data: {
        id: data.id,
      },
      header: data.title,
      styleClass: 'modal-md ',
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
    this.apiRequestService.onDelete(`piscina/${id}`).then((result: boolean) => {
      if (result) this.data = this.data.filter((item) => item.id !== id);
    });
  }

  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
