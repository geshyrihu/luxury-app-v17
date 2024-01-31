import { Component, inject, OnDestroy, type OnInit } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable, Subject, takeUntil } from 'rxjs';
import {
  ApiRequestService,
  AuthService,
  CustomerIdService,
  CustomToastService,
  DataService,
} from 'src/app/core/services/common-services';
import { environment } from 'src/environments/environment';
import AddOrEditCustomerProviderComponent from '../addoredit-customer-provider.component';
@Component({
  selector: 'app-mis-proveedores',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
  templateUrl: './mis-proveedores.component.html',
})
export default class MisProveedoresComponent implements OnInit, OnDestroy {
  private dataService = inject(DataService);
  public authService = inject(AuthService);
  public customToastService = inject(CustomToastService);
  public dialogService = inject(DialogService);
  public messageService = inject(MessageService);
  public customerIdService = inject(CustomerIdService);
  public apiRequestService = inject(ApiRequestService);

  data: any[] = [];
  ref: DynamicDialogRef; // Referencia a un cuadro de diálogo modal
  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente
  url_img = `${environment.base_urlImg}providers/`;

  // logica para el cambio de cliente
  customerId: number;
  customerId$: Observable<number> = this.customerIdService.getCustomerId$();

  ngOnInit(): void {
    this.onLoadData();
    this.customerId$ = this.customerIdService.getCustomerId$();
    this.customerId$.subscribe(() => {
      this.onLoadData();
    });
  }

  // Función para cargar los datos de los CustomerProviders
  onLoadData() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();

    // Realizar una solicitud HTTP para obtener datos de CustomerProviders
    this.dataService
      .get(`CustomerProvider/${this.customerIdService.customerId}`)
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

  // Función para abrir un cuadro de diálogo modal para agregar o editar información sobre un CustomerProvider
  onModalAddOrEdit(data: any) {
    this.ref = this.dialogService.open(AddOrEditCustomerProviderComponent, {
      data: {
        id: data.id,
      },
      header: data.title,
      styleClass: 'modal-md ',
      closeOnEscape: true,
      baseZIndex: 10000,
    });

    // Escuchar el evento 'onClose' cuando se cierra el cuadro de diálogo
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        // Cuando se recibe 'true', mostrar un mensaje de éxito y volver a cargar los datos
        this.customToastService.onShowSuccess();
        this.onLoadData();
      }
    });
  }

  // Función para eliminar un CustomerProvider
  onDelete(id: number) {
    this.apiRequestService
      .onDelete(`customerprovider/${id}`)
      .then((result: boolean) => {
        if (result) this.data = this.data.filter((item) => item.id !== id);
      });
  }
  ngOnDestroy(): void {
    // Cuando se destruye el componente, desvincular y liberar recursos
    this.destroy$.next();
    this.destroy$.complete();
  }
}
