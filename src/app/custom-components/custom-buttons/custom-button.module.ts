import { NgModule } from '@angular/core';
import { CBtnRouterEventComponent } from './c-btn-router-event/c-btn-router-event.component';
import CBtnNotificationComponent from './c-btn-router-notification/c-btn-router-notification.component';
import CustomButtonActiveDesactiveComponent from './custom-button-active-desactive/custom-button-active-desactive.component';
import CustomButtonConfirmationComponent from './custom-button-confirmation/custom-button-confirmation.component';
import CustomButtonDeleteSpanComponent from './custom-button-delete-span/custom-button-delete-span.component';
import CustomButtonDeleteComponent from './custom-button-delete/custom-button-delete.component';
import CustomButtonDownloadFileComponent from './custom-button-download-file/custom-button-download-file.component';
import CustomButtonDownloadPdfComponent from './custom-button-download-pdf/custom-button-download-pdf.component';
import CustomButtomDropdownItemComponent from './custom-button-dropdown-item/custom-buttom-dropdown-item.component';
import CustomButtonEditComponent from './custom-button-edit/custom-button-edit.component';
import CustomButtonExportExcelComponent from './custom-button-export-excel/custom-button-export-excel.component';
import CustomButtonLinkComponent from './custom-button-link/custom-button-link.component';
import CustomButtonSendEmailComponent from './custom-button-send-email/custom-button-send-email.component';
import CustomButtonSubmitComponent from './custom-button-submit/custom-button-submit.component';
import CustomButtonComponent from './custom-button/custom-button.component';

@NgModule({
  imports: [
    CustomButtomDropdownItemComponent,
    CustomButtonActiveDesactiveComponent,
    CustomButtonComponent,
    CustomButtonConfirmationComponent,
    CustomButtonDeleteComponent,
    CustomButtonDeleteSpanComponent,
    CustomButtonDownloadFileComponent,
    CustomButtonDownloadPdfComponent,
    CustomButtonEditComponent,
    CustomButtonExportExcelComponent,
    CustomButtonLinkComponent,
    CustomButtonSendEmailComponent,
    CustomButtonSubmitComponent,
    CBtnNotificationComponent,
    CBtnRouterEventComponent,
  ],
  exports: [
    CustomButtomDropdownItemComponent,
    CustomButtonActiveDesactiveComponent,
    CustomButtonComponent,
    CustomButtonConfirmationComponent,
    CustomButtonDeleteComponent,
    CustomButtonDeleteSpanComponent,
    CustomButtonDownloadFileComponent,
    CustomButtonDownloadPdfComponent,
    CustomButtonEditComponent,
    CustomButtonExportExcelComponent,
    CustomButtonLinkComponent,
    CustomButtonSendEmailComponent,
    CustomButtonSubmitComponent,
    CBtnNotificationComponent,
    CBtnRouterEventComponent,
  ],
})
export default class CustomButtonModule {}
