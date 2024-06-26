import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { AutosizeDirective } from 'src/app/core/directives/autosize-text-area.diective';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { DataService } from 'src/app/core/services/data.service';
@Component({
  selector: 'app-descripcion-puesto',
  templateUrl: './descripcion-puesto.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, AutosizeDirective],
})
export default class DescripcionPuestoComponent implements OnInit, OnDestroy {
  dataService = inject(DataService);
  apiRequestService = inject(ApiRequestService);
  config = inject(DynamicDialogConfig);
  customToastService = inject(CustomToastService);

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente
  profesion: any;

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    this.dataService
      .get('Professions/' + this.config.data.id)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.profesion = resp.body;
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
