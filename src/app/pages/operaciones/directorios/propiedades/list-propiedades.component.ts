import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable, Subject, takeUntil } from 'rxjs';
import { IDirectoryCondominiumDto } from 'src/app/core/interfaces/IDirectoryCondominiumDto.interface';
import {
  ApiRequestService,
  AuthService,
  CustomToastService,
  CustomerIdService,
  DataService,
} from 'src/app/core/services/common-services';

import AddOrEditPropiedadesComponent from './addoredit-propiedades.component';

@Component({
  selector: 'app-list-propiedades',
  templateUrl: './list-propiedades.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class ListPropiedadesComponent implements OnInit, OnDestroy {
  public customToastService = inject(CustomToastService);
  public authService = inject(AuthService);
  public dataService = inject(DataService);
  public messageService = inject(MessageService);
  public dialogService = inject(DialogService);
  public customerIdService = inject(CustomerIdService);
  public apiRequestService = inject(ApiRequestService);

  data: IDirectoryCondominiumDto[] = [];
  ref: DynamicDialogRef;
  customerId$: Observable<number> = this.customerIdService.getCustomerId$();

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

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
      .get<IDirectoryCondominiumDto[]>(
        `DirectoryCondominium/GetAllAsync/${this.customerIdService.customerId}`
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
  }

  onDelete(id: number) {
    this.apiRequestService
      .onDelete(`directorycondominium/${id}`)
      .then((result: boolean) => {
        if (result) this.data = this.data.filter((item) => item.id !== id);
      });
  }
  showModalAddOrEdit(data: any) {
    this.ref = this.dialogService.open(AddOrEditPropiedadesComponent, {
      data: {
        id: data.id,
      },
      header: data.title,
      styleClass: 'modal-md',
      closeOnEscape: true,
      autoZIndex: true,
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
