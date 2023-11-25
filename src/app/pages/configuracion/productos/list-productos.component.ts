import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import {
  AuthService,
  CustomToastService,
  DataService,
} from 'src/app/core/services/common-services';
import ComponentsModule from 'src/app/shared/components.module';
import PrimeNgModule from 'src/app/shared/prime-ng.module';
import { environment } from 'src/environments/environment';
import AddOrEditProductosComponent from './addoredit-productos.component';

@Component({
  selector: 'app-list-productos',
  templateUrl: './list-productos.component.html',
  standalone: true,
  imports: [ComponentsModule, CommonModule, PrimeNgModule],
  providers: [DialogService, MessageService, CustomToastService],
})
export default class ListProductosComponent implements OnInit, OnDestroy {
  public customToastService = inject(CustomToastService);
  public authService = inject(AuthService);
  private dataService = inject(DataService);
  public messageService = inject(MessageService);
  public dialogService = inject(DialogService);
  urlBaseImg = `${environment.base_urlImg}Administration/products/`;
  urlBaseImgUser = `${environment.base_urlImg}Administration/accounts/`;
  data: any[] = [];

  ref: DynamicDialogRef;
  subRef$: Subscription;

  account_id: string = '';
  constructor() {
    this.account_id =
      this.authService.userTokenDto.infoUserAuthDto.applicationUserId;
  }

  ngOnInit(): void {
    //
    this.onLoadData();
  }

  onLoadData() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.subRef$ = this.dataService.get(`Productos`).subscribe({
      next: (resp: any) => {
        this.data = resp.body;
        this.customToastService.onClose();
      },
      error: (err) => {
        // En caso de error, mostrar un mensaje de error y registrar el error en la consola
        this.customToastService.onCloseToError();
        console.log(err.error);
      },
    });
  }

  // ... Eliminar registro
  onDelete(data: any) {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.subRef$ = this.dataService.delete(`Productos/${data.id}`).subscribe({
      next: () => {
        this.onLoadData();
        this.customToastService.onCloseToSuccess();
      },
      error: (err) => {
        // En caso de error, mostrar un mensaje de error y registrar el error en la consola
        this.customToastService.onCloseToError();
        console.log(err.error);
      },
    });
  }

  // ... Llamada al Modal agregar o editar
  showModalAddOrEdit(data: any) {
    this.ref = this.dialogService.open(AddOrEditProductosComponent, {
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
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
