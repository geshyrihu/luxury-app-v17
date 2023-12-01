import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import saveAs from 'file-saver';
import { Subscription } from 'rxjs';
import { ISelectItemDto } from 'src/app/core/interfaces/ISelectItemDto.interface';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { DataService } from 'src/app/core/services/data.service';
import { FilterRequestsService } from 'src/app/core/services/filter-requests.service';
import CustomButtonModule from 'src/app/custom-components/custom-buttons/custom-button.module';

@Component({
  selector: 'app-filter-requests',
  templateUrl: './filter-requests.component.html',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, CustomButtonModule],
  providers: [CustomToastService],
})
export default class FilterRequestsComponent implements OnInit, OnDestroy {
  ngOnInit(): void {}
  private dataService = inject(DataService);
  private router = inject(Router);
  private filterRequestsService = inject(FilterRequestsService);
  public customToastService = inject(CustomToastService);
  menu = [
    { label: 'Vacantes', path: 'vacantes' },
    { label: 'Altas', path: 'altas' },
    { label: 'Bajas', path: 'bajas' },
    { label: 'Modificación de salario', path: 'aumento-sueldo' },
  ];
  subRef$: Subscription;
  fechaInicial = new Date(new Date().getFullYear(), 0, 1);
  fechaFormateada = this.fechaInicial.toISOString().slice(0, 7);
  // params = new HttpParams();
  statusRequestValue: string = 'Pendiente';

  @Input() noCandidates: number = 0;
  cb_status_request: ISelectItemDto[] = [
    { value: 'Pendiente', label: 'Pendiente' },
    { value: 'Proceso', label: 'Proceso' },
    { value: 'Concluido', label: 'Concluido' },
    { value: 'Cancelado', label: 'Cancelada' },
  ];

  @Input() apiUrl: string;
  @Input() nameFile: string;

  exportToExcel(): void {
    this.subRef$ = this.dataService
      .getFile(this.apiUrl, this.filterRequestsService.getParams())
      .subscribe({
        next: (resp: Blob) => {
          // Crea un objeto de tipo Blob a partir de la respuesta
          const blob = new Blob([resp], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          });

          // Utiliza la función saveAs del paquete 'file-saver' para descargar el archivo
          saveAs(blob, this.nameFile);
        },
        error: (err) => {
          this.customToastService.onShowError();
          console.log(err.error);
        },
      });
  }
  onSendReportVacants() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.subRef$ = this.dataService
      .get(`solicitudesreclutamiento/sendreportvacants`)
      .subscribe({
        next: (_) => {
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

  onLoadData() {
    this.filterRequestsService.setParams(
      this.fechaFormateada,
      this.statusRequestValue
    );
  }
  // Utiliza el método `url` del Router para obtener la ruta actual.
  currentPath = this.router.url;

  isActive(path: string): boolean {
    // Utiliza el método `url` del Router para obtener la ruta actual.
    const currentPath = this.router.url;
    // Verifica si la ruta actual coincide con el enlace del botón.
    return currentPath.includes('/reclutamiento/solicitudes/' + path);
  }

  ngOnDestroy(): void {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
