import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable, Subject, takeUntil } from 'rxjs';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DataService } from 'src/app/core/services/data.service';
import ComponentsModule from 'src/app/shared/components.module';
import PrimeNgModule from 'src/app/shared/prime-ng.module';
import AddOrEditVacanteCandidatoComponent from '../list-solicitudes/list-solicitud-vacantes/list-vacante-candidatos/addoredit-vacante-candidato.component';

@Component({
  selector: 'app-agenda-entrevistas',
  templateUrl: './agenda-entrevistas.component.html',
  standalone: true,
  imports: [ComponentsModule, PrimeNgModule, CommonModule],
  providers: [DialogService, MessageService, CustomToastService],
})
export default class AgendaEntrevistasComponent implements OnInit {
  private customerIdService = inject(CustomerIdService);
  private dataService = inject(DataService);
  public customToastService = inject(CustomToastService);
  public dialogService = inject(DialogService);

  // Declaración e inicialización de variables
  data: any[] = [];
  ref: DynamicDialogRef; // Referencia a un cuadro de diálogo modal
  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente
  customerId$: Observable<number> = this.customerIdService.getCustomerId$();

  ngOnInit() {
    this.onLoadData();
    this.customerId$ = this.customerIdService.getCustomerId$();
    this.customerId$.subscribe(() => {
      this.onLoadData();
    });
  }

  // Función para cargar los datos de los bancos
  onLoadData() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();

    // Realizar una solicitud HTTP para obtener datos de bancos
    this.dataService
      .get(
        `candidate/solicitudespendientes/${this.customerIdService.customerId}`
      )
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          // Cuando se obtienen los datos con éxito, actualizar la variable 'data' y ocultar el mensaje de carga
          this.data = resp.body;
          console.log('🚀 ~ resp.body:', resp.body);
          this.customToastService.onClose();
        },
        error: (err) => {
          // En caso de error, mostrar un mensaje de error y registrar el error en la consola
          this.customToastService.onCloseToError();
          console.log(err.error);
        },
      });
  }

  onModalAddOrEdit(data: any) {
    this.ref = this.dialogService.open(AddOrEditVacanteCandidatoComponent, {
      data: {
        id: data.id,
        positionRequestId: data.positionRequestId,
      },
      header: data.title,
      styleClass: 'modal-md ',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      this.onLoadData();
      if (resp) {
        this.onLoadData();
        this.customToastService.onShowSuccess();
      }
    });
  }

  ngOnDestroy(): void {
    // Cuando se destruye el componente, desvincular y liberar recursos
    this.destroy$.next();
    this.destroy$.complete();
  }
}
