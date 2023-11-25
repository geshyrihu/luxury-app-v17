import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { AutosizeDirective } from 'src/app/core/directives/autosize-text-area.diective';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { DataService } from 'src/app/core/services/data.service';

@Component({
  selector: 'app-descripcion-puesto',
  templateUrl: './descripcion-puesto.component.html',
  standalone: true,
  imports: [CommonModule, AutosizeDirective],
  providers: [CustomToastService],
})
export default class DescripcionPuestoComponent implements OnInit, OnDestroy {
  public dataService = inject(DataService);
  public config = inject(DynamicDialogConfig);
  public customToastService = inject(CustomToastService);
  profesion: any;
  subRef$: Subscription;

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    this.subRef$ = this.dataService
      .get('Professions/' + this.config.data.id)
      .subscribe({
        next: (resp: any) => {
          this.profesion = resp.body;
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
