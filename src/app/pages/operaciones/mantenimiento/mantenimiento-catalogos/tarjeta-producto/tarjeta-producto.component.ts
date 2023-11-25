import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/core/services/data.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-tarjeta-producto',
  templateUrl: './tarjeta-producto.component.html',
  standalone: true,
  imports: [
    CommonModule,
  ],
})
export default class TarjetaProductoComponent implements OnInit, OnDestroy {
  public dataService = inject(DataService);
  public config = inject(DynamicDialogConfig);

  subRef$: Subscription;

  productoId: number = 0;
  producto: any;
  urlImg: string = `${environment.base_urlImg}Administration/products/`;

  ngOnInit(): void {
    this.productoId = this.config.data.productoId;
    this.subRef$ = this.dataService
      .get(`Productos/${this.productoId}`)
      .subscribe((resp) => {
        this.producto = resp.body;
      });
  }
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
