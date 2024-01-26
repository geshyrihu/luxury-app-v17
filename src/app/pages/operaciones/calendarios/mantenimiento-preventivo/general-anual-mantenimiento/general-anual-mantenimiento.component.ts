import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'primeng/api';
import { Observable, Subject, takeUntil } from 'rxjs';
import { ISelectItemDto } from 'src/app/core/interfaces/ISelectItemDto.interface';
import { SanitizeHtmlPipe } from 'src/app/core/pipes/sanitize-html.pipe';
import {
  CustomToastService,
  CustomerIdService,
  DataService,
} from 'src/app/core/services/common-services';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-general-anual-mantenimiento',
  templateUrl: './general-anual-mantenimiento.component.html',
  standalone: true,
  imports: [FormsModule, CommonModule, NgbAlertModule, SanitizeHtmlPipe],
  providers: [CustomToastService, MessageService],
})
export default class GeneralAnualMantenimientoComponent
  implements OnInit, OnDestroy
{
  public dataService = inject(DataService);
  public customerIdService = inject(CustomerIdService);
  public customToastService = inject(CustomToastService);

  data: any[] = [];

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  customerId$: Observable<number> = this.customerIdService.getCustomerId$();
  cb_providers: ISelectItemDto[] = [];
  providerId = '';
  pathImg = '';

  ngOnInit() {
    this.onLoadData();
    this.onLoadProveedores();
    this.pathImg = `${environment.base_urlImg}customers/${this.customerIdService.customerId}/machinery/`;
    this.customerId$.subscribe((resp) => {
      this.pathImg = `${environment.base_urlImg}customers/${this.customerIdService.customerId}/machinery/`;
      this.onLoadData();
    });
  }
  onLoadProveedores() {
    this.cb_providers = [];
    this.dataService
      .get(
        `MaintenanceCalendars/ProveedoresCalendario/${this.customerIdService.customerId}`
      )
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.cb_providers = resp.body;
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }
  onLoadData() {
    this.data = [];
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.dataService
      .get(
        `MaintenanceCalendars/GeneralMantenimiento/${this.customerIdService.customerId}/${this.providerId}`
      )
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.data = this.customToastService.onCloseOnGetData(resp.body);
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }
  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
