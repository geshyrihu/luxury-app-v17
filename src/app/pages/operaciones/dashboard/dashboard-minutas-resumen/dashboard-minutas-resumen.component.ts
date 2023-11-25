import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { Subscription } from 'rxjs';
import { SanitizeHtmlPipe } from 'src/app/core/pipes/sanitize-html.pipe';
import {
  CustomToastService,
  CustomerIdService,
  DataService,
} from 'src/app/core/services/common-services';
import ComponentsModule from 'src/app/shared/components.module';
@Component({
  selector: 'app-dashboard-minutas-resumen',
  templateUrl: './dashboard-minutas-resumen.component.html',
  standalone: true,
  imports: [ComponentsModule, CommonModule, TableModule, SanitizeHtmlPipe],
  providers: [DialogService, MessageService, CustomToastService],
})
export default class DashboardMinutasResumenComponent
  implements OnInit, OnDestroy
{
  public customToastService = inject(CustomToastService);
  public dataService = inject(DataService);
  public dialogService = inject(DialogService);
  public messageService = inject(MessageService);
  public customerIdService = inject(CustomerIdService);
  public config = inject(DynamicDialogConfig);

  data: any[] = [];
  ref: DynamicDialogRef;
  subRef$: Subscription;
  eAreaMinutasDetalles: any;

  ngOnInit(): void {
    this.eAreaMinutasDetalles = this.config.data.eAreaMinutasDetalles;
    this.onLoadData();
  }
  onLoadData() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.subRef$ = this.dataService
      .get(
        `Dashboard/MinutasPendientesResumen/${this.customerIdService.getcustomerId()}/${
          this.eAreaMinutasDetalles
        }`
      )
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

  ngOnDestroy(): void {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
