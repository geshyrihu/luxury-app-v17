import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
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
  subRef$: Subscription;

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
    this.subRef$ = this.dataService
      .get(`Proveedor/${this.id}`)
      .subscribe((resp: any) => {
        this.urlLogo = `${environment.base_urlImg}providers/${resp.body.pathPhoto}`;
        this.model = resp.body;
      });
  }

  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
