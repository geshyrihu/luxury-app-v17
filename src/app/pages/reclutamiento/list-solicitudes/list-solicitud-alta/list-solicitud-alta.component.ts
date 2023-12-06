import { CommonModule } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable, Subscription } from 'rxjs';
import {
  AuthService,
  CustomToastService,
  DataService,
  FilterRequestsService,
  StatusSolicitudVacanteService,
} from 'src/app/core/services/common-services';
import ComponentsModule from 'src/app/shared/components.module';
import PrimeNgModule from 'src/app/shared/prime-ng.module';
import FilterRequestsComponent from '../filter-requests.component';
import AddOrEditSolicitudAltaComponent from './addoredit-solicitud-alta/addoredit-solicitud-alta.component';
@Component({
  selector: 'app-list-solicitud-alta',
  templateUrl: './list-solicitud-alta.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ComponentsModule,
    FilterRequestsComponent,
    FormsModule,
    NgbDropdownModule,
    PrimeNgModule,
    RouterModule,
  ],
  providers: [DialogService, MessageService, CustomToastService],
})
export default class ListSolicitudAltaComponent implements OnInit, OnDestroy {
  private dataService = inject(DataService);
  private filterRequestsService = inject(FilterRequestsService);
  public authService = inject(AuthService);
  public dialogService = inject(DialogService);
  public messageService = inject(MessageService);
  public statusSolicitudVacanteService = inject(StatusSolicitudVacanteService);
  public customToastService = inject(CustomToastService);

  data: any[] = [];
  ref: DynamicDialogRef;
  subRef$: Subscription;

  paramsEmit$: Observable<HttpParams> = this.filterRequestsService.getParams$();
  ngOnInit(): void {
    this.onLoadData();
    this.paramsEmit$.subscribe(() => this.onLoadData());
  }

  onLoadData() {
    this.subRef$ = this.dataService
      .get(
        `RequestEmployeeRegister/GetList/`,
        this.filterRequestsService.getParams()
      )
      .subscribe({
        next: (resp: any) => {
          // Cuando se obtienen los datos con éxito, actualizar la variable 'data' y ocultar el mensaje de carga
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

  showModalAddOrEdit(data: any) {
    this.ref = this.dialogService.open(AddOrEditSolicitudAltaComponent, {
      data: {
        id: data.id,
      },
      header: 'Editar registro',
      width: '100%',
      height: '100%',
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

  onDelete(id: number) {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.subRef$ = this.dataService
      .delete(`RequestEmployeeRegister/${id}`)
      .subscribe({
        next: () => {
          this.onLoadData();
          // Mostrar un mensaje de éxito y cerrar Loading....
          this.customToastService.onCloseToSuccess();
        },
        error: (err) => {
          // En caso de error, mostrar un mensaje de error y registrar el error en la consola
          this.customToastService.onCloseToError();
          console.log(err.error);
        },
      });
  }

  ngOnDestroy(): void {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
