import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  Columns,
  Img,
  PdfMakeWrapper,
  Stack,
  Table,
  Txt,
} from 'pdfmake-wrapper';
import { ITable } from 'pdfmake-wrapper/lib/interfaces';
import { MenuItem, MessageService } from 'primeng/api';
import { ContextMenuModule } from 'primeng/contextmenu';
import { Subscription } from 'rxjs';
import { IFondeoCaratulaDto } from 'src/app/core/interfaces/IFondeoCaratulaDto.interface';
import {
  IItemsFondeoCaratulaDto,
  TableRowItemFondeoCaratulaDto,
} from 'src/app/core/interfaces/IItemsFondeoCaratulaDto.interface';
import { CurrencyMexicoPipe } from 'src/app/core/pipes/currencyMexico.pipe';
import { CaratulaFondeoService } from 'src/app/core/services/caratula-fondeo.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { DataService } from 'src/app/core/services/data.service';
import { DateService } from 'src/app/core/services/date.service';
import PrimeNgModule from 'src/app/shared/prime-ng.module';
import { environment } from 'src/environments/environment';
const date = new Date();

PdfMakeWrapper.useFont('roboto');
subRef$: Subscription;

@Component({
  selector: 'app-vista-caratula-fondeo',
  templateUrl: './vista-caratula-fondeo.component.html',
  standalone: true,
  imports: [CommonModule, PrimeNgModule, ContextMenuModule, CurrencyMexicoPipe],
  providers: [CustomToastService, MessageService],
})
export default class VistaCaratulaFondeoComponent implements OnInit, OnDestroy {
  public dateService = inject(DateService);
  public caratulaFondeoService = inject(CaratulaFondeoService);
  public dataService = inject(DataService);
  public router = inject(Router);
  public customToastService = inject(CustomToastService);

  subRef$: Subscription;

  data: IFondeoCaratulaDto;
  dataSelect: any;
  items: MenuItem[] = [
    {
      label: 'Eliminar',
      icon: 'fa-duotone fa-xmark',
      command: () => this.viewItem(this.dataSelect),
    },
  ];
  cols: any[];
  baseUrlImg = environment.base_urlImg;
  logoLuxury = `${environment.base_urlImg}logo2.jpg`;

  ngOnInit(): void {
    this.onLoadData();
    if (this.data !== undefined) {
      this.items = [
        {
          label: 'Eliminar',
          icon: 'fa-duotone fa-xmark',
          command: () => this.viewItem(this.dataSelect),
        },
      ];
    }
  }

  onLoadData() {
    if (this.caratulaFondeoService.requestFondeoCaratulaDto === undefined) {
      this.router.navigateByUrl('compras/ordenesCompra');
    } else {
      // Mostrar un mensaje de carga
      this.customToastService.onLoading();

      this.subRef$ = this.dataService
        .post(
          'OrdenCompra/Fondeo/',
          this.caratulaFondeoService.requestFondeoCaratulaDto
        )
        .subscribe({
          next: (resp: any) => {
            this.data = undefined;
            this.data = resp.body;
            this.customToastService.onCloseToSuccess();
          },
          error: (err: any) => {
            // En caso de error, mostrar un mensaje de error y registrar el error en la consola
            this.customToastService.onCloseToError();
            console.log(err.error);
          },
        });
    }
  }

  viewItem(model: IItemsFondeoCaratulaDto) {
    var i = this.data.itemsFondeoCaratulaDto.indexOf(model);
    if (i !== -1) {
      this.data.itemsFondeoCaratulaDto.splice(i, 1);

      this.data.totalImporte = this.data.totalImporte - model.importe;
      this.data.totalIva = this.data.totalIva - model.iva;
      this.data.totalTotales = this.data.totalTotales - model.totales;
    }
  }
  async downloadAsPdf() {
    const pdf = new PdfMakeWrapper();
    pdf.info({
      title: 'Informe de pagos',
      author: 'Grupo Shemesh Administration',
      subject: 'Caratula',
      producer: 'Ricardo Márquez Escobedo',
    });

    pdf.pageSize('A4');
    pdf.pageMargins(20);
    pdf.pageOrientation('landscape'); // 'portrait' 'landscape'

    pdf.watermark(
      new Txt('Grupo Shemesh Administration S.A. de C.V.')
        .color('#F4F6F6')
        .fontSize(30).end
    );

    pdf.add(
      new Columns([
        new Stack([
          new Txt(this.data.nameCustomer).fontSize(16).alignment('center').end,
          new Txt('Reporte de Cuentas por Pagar a Proveedores')
            .fontSize(10)
            .alignment('center').end,
          new Txt(this.data.cuenta).fontSize(10).alignment('center').end,
          new Txt(this.data.datoDePago).fontSize(10).alignment('center').end,
          new Txt(this.data.ligaFacturas).fontSize(10).alignment('center').end,
        ]).end,
      ]).end
    );

    pdf.add(this.createTable(this.data.itemsFondeoCaratulaDto));
    pdf.footer(
      new Txt(
        `Copyright © ${date.getFullYear()} Grupo Shemesh Administration S.A. de C.V.`
      )
        .color('#5F6A6A')
        .fontSize(10)
        .alignment('center').end
    );

    pdf.create().download('caratula.pdf');
  }
  createTable(data: IItemsFondeoCaratulaDto[]): ITable {
    return new Table([
      [
        'No.',
        'FECHA',
        'PROVEEDOR Y/O ACREEDOR	',
        'No. FACTURA',
        'CONCEPTO',
        'IMPORTE',
        'I.V.A.',
        'TOTALES',
        'BANCO',
        'CUENTA DEPÓSITO',
      ],
      ...this.extractData(data),
      [
        '',
        '',
        '',
        '',
        '',
        this.onFormtatMoney(this.data.totalImporte),
        this.onFormtatMoney(this.data.totalIva),
        this.onFormtatMoney(this.data.totalTotales),

        '',
        '',
      ],
    ])
      .layout({
        fillColor: (rowIndex: number, node: any, columnIndex: number) => {
          return rowIndex === 0 ? '#CCCCCC' : '';
        },
      })
      .fontSize(8).end;
  }

  extractData(
    data: IItemsFondeoCaratulaDto[]
  ): TableRowItemFondeoCaratulaDto[] {
    return data.map((row, index) => [
      (row.id = index + 1),
      this.dateService.formDateToStringLocale(new Date(row.fecha)),
      row.acreedor,
      row.factura,
      row.concepto,
      this.onFormtatMoney(Number(row.importe)),
      this.onFormtatMoney(Number(row.iva)),
      this.onFormtatMoney(Number(row.totales)),

      row.banco,
      row.cuentaDeposito,
    ]);
  }
  ///fORMATO MODENA
  onFormtatMoney(value: number): string {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    });

    return formatter.format(value);
  }

  async columsStructure() {
    return new Columns([await this.sidebar(), 'Columna 2']).end;
  }
  async sidebar() {
    return new Stack([
      await this.img(),
      'About me',
      'Contact',
      'Skills',
      'Languages',
    ]).end;
  }

  async img() {
    return await new Img(
      '../../../../../assets/img/Administration/layout/logo_dark.png'
    )
      .fit([30, 30])
      .build();
  }

  downloadAsExcel() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();

    this.subRef$ = this.dataService
      .post('ExportExcel/GetCaratulaFondeo', this.data)
      .subscribe({
        next: (_) => this.customToastService.onClose(),
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
