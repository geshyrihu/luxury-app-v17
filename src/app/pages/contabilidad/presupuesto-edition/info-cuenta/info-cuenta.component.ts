import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import {
  CustomToastService,
  DataService,
} from 'src/app/core/services/common-services';

@Component({
  selector: 'app-info-cuenta',
  templateUrl: './info-cuenta.component.html',
  standalone: true,
})
export default class InfoCuentaComponent implements OnInit, OnDestroy {
  public config = inject(DynamicDialogConfig);
  private dataService = inject(DataService);
  private customToastService = inject(CustomToastService);

  id: number = 0;
  subRef$: Subscription;
  info: string = '';

  ngOnInit() {
    this.id = this.config.data.id;
    if (this.id !== 0) this.onLoadData();
  }

  onLoadData() {
    this.subRef$ = this.dataService.get(`Cuentas/Info/${this.id}`).subscribe({
      next: (resp: any) => {
        this.info = resp.body.information;
      },
      error: (err) => {
        this.customToastService.onShowError();
        console.log(err.error);
      },
    });
  }
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
