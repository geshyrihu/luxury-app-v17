import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ConfirmationService, MessageService } from 'primeng/api';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import {
  AuthService,
  CustomToastService,
  DataService,
} from 'src/app/core/services/common-services';
import AddoreditMaintenancePreventiveComponent from 'src/app/pages/operaciones/calendarios/mantenimiento-preventivo/addoredit-maintenance-preventive.component';
import ComponentsModule from 'src/app/shared/components.module';
//TODO: VALIDAR SU AUN ESTA ACTIVO ESTE MODULO
@Component({
  selector: 'app-order-service',
  templateUrl: './order-service.component.html',
  standalone: true,
  imports: [CommonModule, ComponentsModule, FormsModule, CKEditorModule],
  providers: [MessageService, CustomToastService],
})
export default class OrderServiceComponent implements OnInit, OnDestroy {
  public customToastService = inject(CustomToastService);
  public dataService = inject(DataService);
  public messageService = inject(MessageService);
  public dialogService = inject(DialogService);
  public authService = inject(AuthService);
  public config = inject(DynamicDialogConfig);
  public ref = inject(DynamicDialogRef);
  public confirmationService = inject(ConfirmationService);

  public Editor = ClassicEditor;

  subRef$: Subscription;
  maintenanceCalendars: any[] = [];
  idMachinery: number = 0;

  ngOnInit(): void {
    this.idMachinery = this.config.data.id;

    if (this.idMachinery !== 0) {
      this.onLoadData();
    }
  }

  onLoadData() {
    this.subRef$ = this.dataService
      .get(`MaintenanceCalendars/ListService/${this.idMachinery}`)
      .subscribe({
        next: (resp: any) => {
          this.maintenanceCalendars = resp.body;
        },
        error: (err) => {
          this.customToastService.onShowError();
          console.log(err.error);
        },
      });
  }

  confirm(event: Event, id: number) {
    this.confirmationService.confirm({
      target: event.target,
      message: '¿Desea Eliminar este registro?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        //confirm action
        this.subRef$ = this.dataService
          .delete(`MaintenanceCalendars/${id}`)
          .subscribe({
            next: () => {
              this.customToastService.onShowSuccess();
              this.onLoadData();
            },
            error: (err) => {
              this.customToastService.onShowError();
              console.log(err.error);
            },
          });
      },
      reject: () => {
        //reject action
      },
    });
  }
  showModalMaintenanceCalendar(data: any) {
    this.ref = this.dialogService.open(
      AddoreditMaintenancePreventiveComponent,
      {
        data: {
          id: data.id,
          task: data.task,
          idMachinery: data.idMachinery,
        },
        header: data.header,
        styleClass: 'modal-mdInventory',
        closeOnEscape: true,
      }
    );
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.customToastService.onShowSuccess();
        this.onLoadData();
      }
    });
  }
  deleteMaintenanceOrder(data: any) {
    this.subRef$ = this.dataService
      .delete(`MaintenanceCalendars/${data.id}`)
      .subscribe({
        next: () => {
          this.customToastService.onShowSuccess();
          this.onLoadData();
        },
        error: (err) => {
          this.customToastService.onShowError();
          console.log(err.error);
        },
      });
  }
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
