import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { SanitizeHtmlPipe } from 'src/app/core/pipes/sanitize-html.pipe';
import {
  CustomToastService,
  DataService,
} from 'src/app/core/services/common-services';
import PrimeNgModule from 'src/app/shared/prime-ng.module';

@Component({
  selector: 'app-cont-minuta-pendientes-pdf',
  templateUrl: './cont-minuta-pendientes-pdf.component.html',
  standalone: true,
  imports: [CommonModule, PrimeNgModule, SanitizeHtmlPipe],
  providers: [MessageService, CustomToastService],
})
export default class ConMinutaPendientesPdfComponent
  implements OnInit, OnDestroy
{
  public customToastService = inject(CustomToastService);
  private dataService = inject(DataService);
  public messageService = inject(MessageService);

  data: any[] = [];
  subRef$: Subscription;

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.subRef$ = this.dataService
      .get('ContabilidadMinuta/Pendientes/0')
      .subscribe({
        next: (resp: any) => {
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

  ngOnDestroy(): void {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
