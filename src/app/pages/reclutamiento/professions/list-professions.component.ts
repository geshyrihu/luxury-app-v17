import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { IProfessionDto } from 'src/app/core/interfaces/IProfessionDto.interface';
import {
  AuthService,
  CustomToastService,
  DataService,
} from 'src/app/core/services/common-services';
import ComponentsModule from 'src/app/shared/components.module';
import PrimeNgModule from 'src/app/shared/prime-ng.module';
import AddOrEditProfessionsComponent from './addoredit-professions.component';
import DescripcionPuestoComponent from './descripcion-puesto.component';

@Component({
  selector: 'app-professions',
  templateUrl: './list-professions.component.html',
  standalone: true,
  imports: [CommonModule, ComponentsModule, NgbAlertModule, PrimeNgModule],
  providers: [DialogService, MessageService, CustomToastService],
})
export default class ListProfessionsComponent implements OnInit, OnDestroy {
  public customToastService = inject(CustomToastService);
  public authService = inject(AuthService);
  public dataService = inject(DataService);
  public messageService = inject(MessageService);
  public dialogService = inject(DialogService);

  data: any[] = [];
  ref: DynamicDialogRef;
  subRef$: Subscription;

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.subRef$ = this.dataService
      .get<IProfessionDto>('Professions/')
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

  onRowReorder(event: any) {
    let movedItem = this.data[event.dragIndex];
    this.data.splice(event.dragIndex, 1);
    this.data.splice(event.dropIndex, 0, movedItem);

    let newdate: NewProfession[] = [];
    for (let i = 0; i < this.data.length; i++) {
      const elemento: NewProfession = {
        hierarchy: i,
        id: this.data[i].id,
      };

      newdate.push(elemento);
    }
    this.subRef$ = this.dataService
      // .get(`Professions/UpdateHierarchy/${item.id}/${event.dropIndex}`)
      .post(`Professions/ResetHierarchy/`, newdate)
      .subscribe({
        next: () => {
          // Cuando se completa la eliminación con éxito, mostrar un mensaje de éxito y volver a cargar los datos
          this.customToastService.onCloseToSuccess();
          this.onLoadData();
        },
        error: (err) => {
          // En caso de error, mostrar un mensaje de error y registrar el error en la consola
          this.customToastService.onCloseToError();
          console.log(err.error);
        },
      });
  }

  onDelete(data: IProfessionDto) {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.subRef$ = this.dataService.delete('Professions/' + data.id).subscribe({
      next: () => {
        // Cuando se completa la eliminación con éxito, mostrar un mensaje de éxito y volver a cargar los datos
        this.customToastService.onCloseToSuccess();
        this.onLoadData();
      },
      error: (err) => {
        // En caso de error, mostrar un mensaje de error y registrar el error en la consola
        this.customToastService.onCloseToError();
        console.log(err.error);
      },
    });
  }

  showModalAddOrEdit(data: any) {
    this.ref = this.dialogService.open(AddOrEditProfessionsComponent, {
      data: {
        id: data.id,
      },
      header: data.title,
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

  onModalDescripcionPuestos(data: any) {
    this.ref = this.dialogService.open(DescripcionPuestoComponent, {
      data: {
        id: data.id,
      },
      header: data.nameProfession,
      width: '100%',
      height: '100%',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
  }
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
export interface NewProfession {
  id: number;
  hierarchy: number;
}
