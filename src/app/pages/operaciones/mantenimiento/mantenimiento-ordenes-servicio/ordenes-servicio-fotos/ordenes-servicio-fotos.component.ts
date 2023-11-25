import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ImageModule } from 'primeng/image';
import { Subscription } from 'rxjs';
import {
  CustomToastService,
  CustomerIdService,
  DataService,
} from 'src/app/core/services/common-services';
import ComponentsModule from 'src/app/shared/components.module';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-ordenes-servicio-fotos',
  templateUrl: './ordenes-servicio-fotos.component.html',
  standalone: true,
  imports: [CommonModule, ComponentsModule, ImageModule],
  providers: [MessageService, CustomToastService],
})
export default class OrdenesServicioFotosComponent
  implements OnInit, OnDestroy
{
  public config = inject(DynamicDialogConfig);
  public customerIdService = inject(CustomerIdService);
  public dataService = inject(DataService);
  public messageService = inject(MessageService);
  public ref = inject(DynamicDialogRef);
  public customToastService = inject(CustomToastService);

  id: number = 0;
  subRef$: Subscription;
  data: any[] = [];
  urlImg: string = '';
  nameCarpetaFecha = '';

  ngOnInit(): void {
    this.id = this.config.data.id;
    if (this.id !== 0) this.onLoadData();
  }
  onLoadData() {
    this.subRef$ = this.dataService
      .get(`ServiceOrders/OrdenesServicioFotos/${this.id}`)
      .subscribe({
        next: (resp: any) => {
          this.data = resp.body;

          if (this.data.length !== 0) {
            this.nameCarpetaFecha = this.data[0].nameFolder;
            this.urlImg = `${environment.base_urlImg}customers/${this.customerIdService.customerId}/ordenServicio/${this.nameCarpetaFecha}/`;
          }
        },
        error: (err) => {
          this.customToastService.onShowError();
          console.log(err.error);
        },
      });
  }

  deleteImg(id: number): void {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.subRef$ = this.dataService
      .delete(`ServiceOrders/DeleteImg/${id}`)
      .subscribe({
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

  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
