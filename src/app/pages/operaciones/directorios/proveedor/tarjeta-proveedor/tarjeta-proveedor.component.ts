import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { DataService } from 'src/app/core/services/data.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-tarjeta-proveedor',
  templateUrl: './tarjeta-proveedor.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class TarjetaProveedorComponent implements OnInit, OnDestroy {
  config = inject(DynamicDialogConfig);
  dataService = inject(DataService);
  apiRequestService = inject(ApiRequestService);

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente
  model: any;
  id: number;
  urlLogo = '';

  ngOnInit(): void {
    this.id = this.config.data.id;
    if (this.id !== null) {
      this.onLoadItem();
    }
  }
  onLoadItem() {
    this.dataService
      .get(`Proveedor/${this.id}`)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe((resp: any) => {
        this.urlLogo = `${environment.base_urlImg}providers/${resp.body.pathPhoto}`;
        this.model = resp.body;
      });
  }

  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
