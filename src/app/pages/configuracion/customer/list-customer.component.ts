import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { ICustomerDto } from 'src/app/core/interfaces/ICustomerDto.interface';
import { CelularNumberPipe } from 'src/app/core/pipes/celular-number.pipe';
import {
  AuthService,
  CustomToastService,
  DataService,
} from 'src/app/core/services/common-services';
import ComponentsModule from 'src/app/shared/components.module';
import PrimeNgModule from 'src/app/shared/prime-ng.module';
import { environment } from 'src/environments/environment';
import AddOrEditClienteComponent from './addoredit-clientes.component';

@Component({
  selector: 'app-list-customer',
  templateUrl: './list-customer.component.html',
  standalone: true,
  imports: [CommonModule, ComponentsModule, PrimeNgModule, CelularNumberPipe],
  providers: [DialogService, MessageService, CustomToastService],
})
export default class ListCustomerComponent implements OnInit, OnDestroy {
  private dataService = inject(DataService);
  public authService = inject(AuthService);
  public customToastService = inject(CustomToastService);
  public dialogService = inject(DialogService);
  public messageService = inject(MessageService);

  urlBaseImg = `${environment.base_urlImg}Administration/customer/`;
  data: ICustomerDto[] = [];
  ref: DynamicDialogRef;
  title = 'Activos';
  state = true;
  mostrar = true;

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.subRef$ = this.dataService
      .get(`Customers/GetAllAsync/${this.state}`)
      .subscribe({
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

  onDelete(data: any) {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.subRef$ = this.dataService.delete('Customers/' + data.id).subscribe({
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

  onModalAddOrEdit(data: any) {
    this.ref = this.dialogService.open(AddOrEditClienteComponent, {
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

  onSortChange(valor: any) {
    this.state = valor;
    this.state === true ? (this.title = 'Activos') : (this.title = 'Inctivos');
    this.onLoadData();
  }
  subRef$: Subscription;
  ngOnDestroy(): void {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
