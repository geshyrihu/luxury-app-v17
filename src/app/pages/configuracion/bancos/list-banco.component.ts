import { Component, OnInit, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IBankDto } from 'src/app/core/interfaces/IBankDto.interface';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import ComponentsModule from 'src/app/shared/components.module';
import PrimeNgModule from 'src/app/shared/prime-ng.module';
import { ApiRequestService } from '../../../core/services/api-request.service';
import AddOrEditBancoComponent from './addoredit-banco.component';

@Component({
  selector: 'app-banco',
  templateUrl: './list-banco.component.html',
  standalone: true,
  imports: [ComponentsModule, PrimeNgModule],
})
export default class ListBancoComponent implements OnInit {
  public dialogHandlerService = inject(DialogHandlerService);
  public dialogService = inject(DialogService);
  public messageService = inject(MessageService);
  public apiRequestService = inject(ApiRequestService);

  // Declaración e inicialización de variables
  data: IBankDto[] = [];
  ref: DynamicDialogRef; // Referencia a un cuadro de diálogo modal

  ngOnInit(): void {
    this.onLoadData();
  }

  // Función para cargar los datos de los bancos
  onLoadData() {
    this.apiRequestService
      .onLoadData<IBankDto[]>('banks')
      .then((result: IBankDto[]) => {
        this.data = result;
      });
  }

  // Funcion para eliminar un banco y refres
  onDelete(id: number) {
    this.apiRequestService.onDelete(`banks/${id}`).then((result: boolean) => {
      if (result) this.data = this.data.filter((item) => item.id !== id);
    });
  }

  // Función para abrir un cuadro de diálogo modal para agregar o editar o crear
  onModalAddOrEdit(data: any) {
    this.dialogHandlerService
      .openDialog(
        AddOrEditBancoComponent,
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
}
