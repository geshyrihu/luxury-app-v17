import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { CustomerIdService } from 'src/app/core/services/common-services';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { DataService } from 'src/app/core/services/data.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-report-client',
  templateUrl: './report-client.component.html',
  standalone: true,
  imports: [CommonModule],
  providers: [CustomToastService, MessageService],
})
export default class ReportClientComponent implements OnInit, OnDestroy {
  public dataService = inject(DataService);
  public rutaActiva = inject(ActivatedRoute);
  public customerIdService = inject(CustomerIdService);
  public customToastService = inject(CustomToastService);

  subRef$: Subscription;
  data: any = [];
  imgBase = environment.base_urlImg + 'Administration/customer/';
  urlImgBase = environment.base_urlImg;
  customer: string = '';
  inicio: string = '';
  final: string = '';
  rutaFinal: string = '';

  ngOnInit(): void {
    this.customer = this.rutaActiva.snapshot.params.customer;
    this.inicio = this.rutaActiva.snapshot.params.inicio;
    this.final = this.rutaActiva.snapshot.params.final;
    this.rutaFinal =
      'Ticket/GetReportClient/' +
      this.customer +
      '/' +
      this.inicio +
      '/' +
      this.final;
    this.urlImgBase = `${environment.base_urlImg}customers/${this.customer}/report/`;

    this.subRef$ = this.dataService.get(this.rutaFinal).subscribe({
      next: (resp: any) => {
        this.data = resp.body;
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
