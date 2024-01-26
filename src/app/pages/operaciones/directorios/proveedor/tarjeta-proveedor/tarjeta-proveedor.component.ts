import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { DataService } from 'src/app/core/services/data.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-tarjeta-proveedor',
  templateUrl: './tarjeta-proveedor.component.html',
  standalone: true,
  imports: [CommonModule, NgbAlert],
})
export default class TarjetaProveedorComponent implements OnInit, OnDestroy {
  public config = inject(DynamicDialogConfig);
  public dataService = inject(DataService);

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
