import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import PrimeNgModule from 'app/shared/prime-ng.module';
import { NgxMaskModule } from 'ngx-mask';
import { ConfirmationService, MessageService } from 'primeng/api';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { ToastModule } from 'primeng/toast';
import { Subscription } from 'rxjs';
import {
  CustomToastService,
  DataService,
  SelectItemService,
} from 'src/app/core/services/common-services';
import ComponentsModule from 'src/app/shared/components.module';
import AddoreditPersonEmergencyContactComponent from '../addoredit-person-emergency-contact/addoredit-person-emergency-contact.component';

@Component({
  selector: 'app-list-person-emergency-contact',
  templateUrl: './list-person-emergency-contact.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ComponentsModule,
    FormsModule,
    ToastModule,
    NgxMaskModule,
    PrimeNgModule,
  ],
  providers: [MessageService, ConfirmationService, CustomToastService],
})
export default class ListPersonEmergencyContactComponent
  implements OnInit, OnDestroy
{
  private formBuilder = inject(FormBuilder);
  public config = inject(DynamicDialogConfig);
  public customToastService = inject(CustomToastService);
  public dataService = inject(DataService);
  public messageService = inject(MessageService);
  public ref = inject(DynamicDialogRef);
  public selectItemService = inject(SelectItemService);
  public dialogService = inject(DialogService);

  personId: number = 0;
  id: string = '';
  contactEmployeeAdd: any;
  subRef$: Subscription;

  data: any[] = [];
  ngOnInit(): void {
    this.personId = this.config.data.personId;
    this.onLoadData();
  }

  onLoadData() {
    this.subRef$ = this.dataService
      .get(`personemergencycontact/listtoperson/${this.personId}`)
      .subscribe({
        next: (resp: any) => {
          this.data = resp.body;
          console.log('🚀 ~ resp.body:', resp.body);
          this.customToastService.onClose();
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }

  onDelete(item: any) {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.subRef$ = this.dataService
      .delete(`ContactEmployees/${item.id}`)
      .subscribe({
        next: () => {
          this.onLoadData();
          this.customToastService.onCloseToSuccess();
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }

  onModalAddOrEdit(data: any) {
    this.ref = this.dialogService.open(
      AddoreditPersonEmergencyContactComponent,
      {
        data: {
          personId: this.personId,
          id: data.id,
        },
        header: data.title,
        styleClass: 'modal-md ',
        closeOnEscape: true,
        baseZIndex: 10000,
      }
    );
    // Escuchar el evento 'onClose' cuando se cierra el cuadro de diálogo
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        // Cuando se recibe 'true', mostrar un mensaje de éxito y volver a cargar los datos
        this.customToastService.onShowSuccess();
        this.onLoadData();
      }
    });
  }
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
