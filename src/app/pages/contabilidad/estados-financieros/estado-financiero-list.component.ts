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
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import { environment } from 'src/environments/environment';
import AddFileEstadoFinancieroComponent from './add-file-estado-financiero/add-file-estado-financiero.component';
@Component({
  selector: 'app-estado-financiero-list',
  templateUrl: './estado-financiero-list.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class EstadoFinancieroListComponent
  implements OnInit, OnDestroy
{
  private authService = inject(AuthService);
  private customerIdService = inject(CustomerIdService);
  public messageService = inject(MessageService);
  public dataService = inject(DataService);
  public apiRequestService = inject(ApiRequestService);
  public customToastService = inject(CustomToastService);
  public dialogHandlerService = inject(DialogHandlerService);
  public dialogService = inject(DialogService);

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  data: any[] = [];
  ref: DynamicDialogRef;
  baseUrlApi = environment.base_urlImg;

  customerId$: Observable<number> = this.customerIdService.getCustomerId$();

  ngOnInit(): void {
    this.onLoadData();
    this.customerId$.subscribe(() => {
      this.onLoadData();
    });
  }

  onLoadData(): void {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.dataService
      .get(`EstadoFinanciero/ToCustomer/${this.customerIdService.customerId}/`)
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

  // Función para abrir un cuadro de diálogo modal paraa agregar el archivo
  onUploadFile(data: any) {
    this.dialogHandlerService
      .openDialog(
        AddFileEstadoFinancieroComponent,
        data,
        data.title,
        this.dialogHandlerService.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) {
          this.onLoadData();
        }
      });
  }
  onAuthorize(id: string) {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.dataService
      .get(
        `EstadoFinanciero/Authorize/${id}/${this.authService.infoEmployeeDto.personId}`
      )
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: () => {
          this.customToastService.onCloseToSuccess();
          this.onLoadData();
        },
        error: (error) => {
          // Habilitar el botón nuevamente al finalizar el envío del formulario
          this.customToastService.onCloseToError(error);
        },
      });
  }
  onDesauthorize(id: string) {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.dataService
      .get(`EstadoFinanciero/Desauthorize/${id}`)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: () => {
          this.customToastService.onCloseToSuccess();
          this.onLoadData();
        },
        error: (error) => {
          // Habilitar el botón nuevamente al finalizar el envío del formulario
          this.customToastService.onCloseToError(error);
        },
      });
  }

  // onSendEstadosFinancieros(data: any) {
  onSendEstadosFinancieros(data: any) {
    this.apiRequestService.onPost(
      `EstadoFinanciero/Send/${data.id}/${this.authService.infoEmployeeDto.personId}`,
      null
    );
  }

  // Destruir componente
  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
