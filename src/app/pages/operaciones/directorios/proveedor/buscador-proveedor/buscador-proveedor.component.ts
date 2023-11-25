import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  NgbAlert,
  NgbRatingModule,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ToastModule } from 'primeng/toast';
import { Subscription } from 'rxjs';
import {
  AuthService,
  CustomToastService,
  DataService,
} from 'src/app/core/services/common-services';
import ComponentsModule from 'src/app/shared/components.module';
import { environment } from 'src/environments/environment';
import AddoreditProveedorComponent from '../addoredit-proveedor/addoredit-proveedor.component';
import CalificacionProveedorComponent from '../calificacion-proveedor/calificacion-proveedor.component';
import TarjetaProveedorComponent from '../tarjeta-proveedor/tarjeta-proveedor.component';

@Component({
  selector: 'app-buscador-proveedor',
  templateUrl: './buscador-proveedor.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ComponentsModule,
    NgbRatingModule,
    NgbTooltipModule,
    NgbAlert,
    ToastModule,
  ],
  providers: [
    DialogService,
    MessageService,
    ConfirmationService,
    CustomToastService,
  ],
})
export default class BuscadorProvedorComponent implements OnInit, OnDestroy {
  public customToastService = inject(CustomToastService);
  public dataService = inject(DataService);
  public messageService = inject(MessageService);
  public dialogService = inject(DialogService);
  public authService = inject(AuthService);
  incluirInactivos: boolean = false;
  url_img = `${environment.base_urlImg}providers/`;
  subRef$: Subscription;
  ref: DynamicDialogRef;

  filtro: string = '';
  resultados: any[] = [];
  loading: boolean = false;
  validateRole(value: string[]): boolean {
    return this.authService.onValidateRoles(value);
  }
  ngOnInit(): void {}
  onSelectForState() {
    this.incluirInactivos = !this.incluirInactivos;
    this.buscar();
  }
  onDelete(data: any) {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.subRef$ = this.dataService.delete(`Providers/${data.id}`).subscribe({
      next: () => {
        this.customToastService.onCloseToSuccess();
        this.buscar();
      },
      error: (err) => {
        // En caso de error, mostrar un mensaje de error y registrar el error en la consola
        this.customToastService.onCloseToError();
        console.log(err.error);
      },
    });
  }

  showModalCardProveedor(data: any) {
    this.ref = this.dialogService.open(TarjetaProveedorComponent, {
      data: {
        id: data.providerId,
      },
      header: data.title,
      styleClass: 'modal-lg',
      baseZIndex: 10000,
      closeOnEscape: true,
    });
  }
  showModalCalificarProveedor(data: any) {
    this.ref = this.dialogService.open(CalificacionProveedorComponent, {
      data: {
        providerId: data.providerId,
        userId: this.authService.userTokenDto.infoUserAuthDto.applicationUserId,
      },
      header: 'Calificar a ' + data.nameProvider,
      styleClass: 'modal-sm',
      baseZIndex: 10000,
      closeOnEscape: true,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.customToastService.onShowSuccess();
        this.buscar();
      }
    });
  }

  showModalAddOrEdit(data: any) {
    this.ref = this.dialogService.open(AddoreditProveedorComponent, {
      data: {
        id: data.id,
      },
      header: data.title,
      height: '100%',
      width: '100%',
      baseZIndex: 10000,
      closeOnEscape: true,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.customToastService.onShowSuccess();
        this.buscar();
      }
    });
  }

  calificacionPromedio(data: any, valor: string): number {
    let suma: number = 0;
    data.forEach((element) => {
      suma += element[valor];
    });
    const restult = suma / data.length;

    return restult;
  }
  onActivateProvider(data: any) {
    this.subRef$ = this.dataService
      .put(`Providers/ChangeState/${data.providerId}/${data.state}`, null)
      .subscribe({
        next: (resp: any) => {
          this.buscar();
          // this.onLoadData(this.stateProvider);
        },
        error: (err) => {
          this.customToastService.onShowError();
          console.log(err.error);
        },
      });
  }

  buscar() {
    if (this.filtro === '') return;
    this.resultados = [];
    this.loading = true;

    this.subRef$ = this.dataService
      .get(
        'proveedor/buscarProveedor/' + this.incluirInactivos + '/' + this.filtro
      )
      .subscribe({
        next: (resp: any) => {
          this.resultados = resp.body;
          this.loading = false;
        },
        error: (err) => {
          this.customToastService.onShowError();
          console.log(err.error);
        },
      });
  }

  ngOnDestroy(): void {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
