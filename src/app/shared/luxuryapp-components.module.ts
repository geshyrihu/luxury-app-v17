import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import {
  NgbAlertModule,
  NgbDropdownModule,
  NgbModule,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import flatpickr from 'flatpickr';
import { Spanish } from 'flatpickr/dist/l10n/es';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { DialogModule } from 'primeng/dialog';
import { DialogService } from 'primeng/dynamicdialog';
import { EditorModule } from 'primeng/editor';
import { FileUploadModule } from 'primeng/fileupload';
import { ImageModule } from 'primeng/image';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { CustomPipeModule } from '../core/pipes/custom-pipe.module';
import { ApiRequestService } from '../core/services/api-request.service';
import { CustomToastService } from '../core/services/custom-toast.service';
import { DialogHandlerService } from '../core/services/dialog-handler.service';
import CustomButtonModule from '../custom-components/custom-buttons/custom-button.module';
import AgregarCorreoElectronicoComponent from './agregar-correo-electronico/agregar-correo-electronico.component';
import CabeceraSolicitudPagoPdfComponent from './cabeceras/cabecera-solicitud-pago-pdf/cabecera-solicitud-pago-pdf.component';
import PagetitleComponent from './cabeceras/pagetitle/pagetitle.component';
import ReportHeaderComponent from './cabeceras/report-header/report-header.component';
import AdvancedPieChartComponent from './graficos/advanced-pie-chart/advanced-pie-chart.component';
import PieChartComponent from './graficos/pie-chart/pie-chart.component';
import HaederCustomerComponent from './haeder-customer/haeder-customer.component';
import InputImgReportComponent from './input-img-report/input-img-report.component';
import InputImgComponent from './input-img/input-img.component';
import ListadoCondominosComponent from './listado-condominos/listado-condominos.component';
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
    HaederCustomerComponent,
    InputImgComponent,
    InputImgReportComponent,
    ListadoCondominosComponent,
    MesanioComponent,
    PagetitleComponent,
    PieChartComponent,
    RangoCalendarioyyyymmddComponent,
    ReportHeaderComponent,
    SubirPdfComponent,
    TableFooterComponent,
    TableHeaderComponent,

    ConfirmPopupModule,
    FileUploadModule,
    FormsModule,
    LeafletModule,
    NgbAlertModule,
    NgbModule,
    NgbTooltipModule,
    NgbDropdownModule,
    NgxChartsModule,
    ReactiveFormsModule,
    RouterModule,
    ToolbarModule,
    TooltipModule,

    // PrimeNgModule
    TableModule,
    ToastModule,
    CheckboxModule,
    DialogModule,
    ImageModule,
    MenuModule,
    MultiSelectModule,
    InputTextModule,
    EditorModule,

    // Other
    CommonModule,

    // Custom Modules
    CustomButtonModule,

    // Custom Pipes
    CustomPipeModule,
  ],
  exports: [
    AdvancedPieChartComponent,
    AgregarCorreoElectronicoComponent,
    CabeceraSolicitudPagoPdfComponent,
    CalendarRangeComponent,
    HaederCustomerComponent,
    InputImgComponent,
    InputImgReportComponent,
    ListadoCondominosComponent,
    MesanioComponent,
    PagetitleComponent,
    PieChartComponent,
    RangoCalendarioyyyymmddComponent,
    ReportHeaderComponent,
    SubirPdfComponent,
    TableFooterComponent,
    TableHeaderComponent,

    ConfirmPopupModule,
    CustomButtonModule,
    FileUploadModule,
    FormsModule,
    LeafletModule,
    NgbAlertModule,
    NgbModule,
    NgbTooltipModule,
    NgbDropdownModule,
    NgxChartsModule,
    ReactiveFormsModule,
    RouterModule,
    TableModule,
    ToastModule,
    ToolbarModule,
    TooltipModule,

    // PrimeNgModule
    TableModule,
    ToastModule,
    CheckboxModule,
    DialogModule,
    ImageModule,
    MenuModule,
    MultiSelectModule,
    InputTextModule,
    EditorModule,

    // Other
    CommonModule,

    // Custom Modules

    // Custom Pipes
    CustomPipeModule,
  ],
  providers: [
    DialogService,
    MessageService,
    DialogHandlerService,
    CustomToastService,
    ApiRequestService,
    ConfirmationService,
  ],
})
export default class LuxuryAppComponentsModule {}
