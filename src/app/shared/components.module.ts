// import { AgmCoreModule } from '@agm/core';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FlatpickrModule } from 'angularx-flatpickr';
import flatpickr from 'flatpickr';
import { Spanish } from 'flatpickr/dist/l10n/es';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { FileUploadModule } from 'primeng/fileupload';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import AgregarCorreoElectronicoComponent from './agregar-correo-electronico/agregar-correo-electronico.component';
import CabeceraSolicitudPagoPdfComponent from './cabeceras/cabecera-solicitud-pago-pdf/cabecera-solicitud-pago-pdf.component';
import PagetitleComponent from './cabeceras/pagetitle/pagetitle.component';
import ReportHeaderComponent from './cabeceras/report-header/report-header.component';
import CustomButtonModule from './custom-buttons/custom-button.module';
import AdvancedPieChartComponent from './graficos/advanced-pie-chart/advanced-pie-chart.component';
import PieChartComponent from './graficos/pie-chart/pie-chart.component';
import HaederCustomerComponent from './haeder-customer/haeder-customer.component';
import InputImgReportComponent from './input-img-report/input-img-report.component';
import InputImgComponent from './input-img/input-img.component';
import ListadoCondominosComponent from './listado-condominos/listado-condominos.component';
import LeafletMapComponent from './mapas/leaflet-map/leaflet-map.component';
import MesanioComponent from './mesanio/mesanio.component';
import CalendarRangeComponent from './rango-calendario-mes-anio/calendar-range.component';
import RangoCalendarioyyyymmddComponent from './rango-calendario-yyyymmdd/rango-calendario-yyyymmdd.component';
import SubirPdfComponent from './subir-pdf/subir-pdf.component';
import TableFooterComponent from './table-footer/table-footer.component';
import TableHeaderComponent from './table-header/table-header.component';

export function flatpickrFactory() {
  flatpickr.localize(Spanish);
  return flatpickr;
}

@NgModule({
  imports: [
    AdvancedPieChartComponent,
    AgregarCorreoElectronicoComponent,
    CabeceraSolicitudPagoPdfComponent,
    CalendarRangeComponent,
    ConfirmPopupModule,
    CustomButtonModule,
    FileUploadModule,
    FlatpickrModule.forRoot(),
    HaederCustomerComponent,
    InputImgComponent,
    InputImgReportComponent,
    LeafletMapComponent,
    LeafletModule,
    ListadoCondominosComponent,
    MesanioComponent,
    NgbTooltipModule,
    NgxChartsModule,
    PagetitleComponent,
    PieChartComponent,
    RangoCalendarioyyyymmddComponent,
    ReactiveFormsModule,
    ReportHeaderComponent,
    RouterModule,
    SubirPdfComponent,
    TableFooterComponent,
    TableHeaderComponent,
    TableModule,
    ToastModule,
    ToolbarModule,
    TooltipModule,
  ],
  exports: [
    AdvancedPieChartComponent,
    CabeceraSolicitudPagoPdfComponent,
    CalendarRangeComponent,
    CustomButtonModule,
    HaederCustomerComponent,
    InputImgComponent,
    InputImgReportComponent,
    LeafletMapComponent,
    ListadoCondominosComponent,
    MesanioComponent,
    PagetitleComponent,
    PieChartComponent,
    RangoCalendarioyyyymmddComponent,
    ReportHeaderComponent,
    SubirPdfComponent,
    TableFooterComponent,
    TableHeaderComponent,
  ],
})
export default class ComponentsModule {}
