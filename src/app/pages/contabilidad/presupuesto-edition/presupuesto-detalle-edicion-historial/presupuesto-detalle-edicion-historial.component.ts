import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { DataService } from 'src/app/core/services/data.service';
import PrimeNgModule from 'src/app/shared/prime-ng.module';

@Component({
  selector: 'app-presupuesto-detalle-edicion-historial',
  templateUrl: './presupuesto-detalle-edicion-historial.component.html',
  standalone: true,
  imports: [PrimeNgModule],
})
export default class PresupuestoDetalleEdicionHistorialComponent
  implements OnInit, OnDestroy
{
  private dataService = inject(DataService);
  public ref = inject(DynamicDialogRef);
  public config = inject(DynamicDialogConfig);
  private customToastService = inject(CustomToastService);

  data: any[] = [];
  id: number = 0;
  subRef$: Subscription;

  ngOnInit() {
    this.id = this.config.data.id;
    if (this.id !== 0) this.onLoadData();
  }

  onLoadData() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();

    // Realizar una solicitud HTTP para eliminar un banco específico
    this.subRef$ = this.dataService
      .get(`Presupuesto/HistorialToEdition/${this.id}`)
      .subscribe({
        next: (resp: any) => {
          this.data = resp.body;
          // Cuando se completa la eliminación con éxito, mostrar un mensaje de éxito y volver a cargar los datos
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
