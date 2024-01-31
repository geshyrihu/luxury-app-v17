import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { MessageService, TreeNode } from 'primeng/api';
import { Observable, Subject, takeUntil } from 'rxjs';
import {
  CustomToastService,
  CustomerIdService,
  DataService,
} from 'src/app/core/services/common-services';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-organigrama',
  templateUrl: './organigrama.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class OrganigramaComponent implements OnInit, OnDestroy {
  public customToastService = inject(CustomToastService);
  public dataService = inject(DataService);
  public customerIdService = inject(CustomerIdService);
  public messageService = inject(MessageService);
  data: TreeNode[];

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  customerId$: Observable<number> = this.customerIdService.getCustomerId$();
  base_urlImg = `${environment.base_urlImg}Administration/accounts/`;

  ngOnInit() {
    this.onLoadData();
    this.customerId$ = this.customerIdService.getCustomerId$();
    this.customerId$.subscribe(() => {
      this.onLoadData();
    });
  }
  onLoadData() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.dataService
      .get('EntregaRecepcion/Organigrama/' + this.customerIdService.customerId)
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
