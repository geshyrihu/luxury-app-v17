import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { IFichaTecnicaActivoDto } from 'src/app/core/interfaces/IFichaTecnicaActivoDto.interface';
import {
  CustomToastService,
  DataService,
} from 'src/app/core/services/common-services';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-ficha-tecnica-activo',
  templateUrl: './ficha-tecnica-activo.component.html',
  standalone: true,
  imports: [
    NgbAlert,
    CommonModule,
  ],
  providers: [CustomToastService],
})
export default class FichaTecnicaActivoComponent implements OnInit, OnDestroy {
  public dataService = inject(DataService);
  public ref = inject(DynamicDialogRef);
  public config = inject(DynamicDialogConfig);
  public customToastService = inject(CustomToastService);

  urlImgBase: string = environment.base_urlImg;
  data: IFichaTecnicaActivoDto;
  id: number = 0;
  subRef$: Subscription;

  ngOnInit(): void {
    this.id = this.config.data.id;
    if (this.id !== 0) this.onLoadData();
  }

  onLoadData() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.subRef$ = this.dataService
      .get<IFichaTecnicaActivoDto>(`Machineries/Fichatecnica/${this.id}`)
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
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
