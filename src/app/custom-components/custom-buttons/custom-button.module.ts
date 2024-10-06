import { NgModule } from '@angular/core';
import BtnBaggesComponent from './c-btn-bagges/c-btn-bagges.component';
import { CBtnRouterEventComponent as BtnRouterEventComponent } from './c-btn-router-event/c-btn-router-event.component';
import BtnNotificationComponent from './c-btn-router-notification/c-btn-router-notification.component';
import BtnActiveDesactiveComponent from './custom-button-active-desactive/custom-button-active-desactive.component';
import BtnConfirmationComponent from './custom-button-confirmation/custom-button-confirmation.component';
import BtnDeleteSpanComponent from './custom-button-delete-span/custom-button-delete-span.component';
import BtnDeleteComponent from './custom-button-delete/custom-button-delete.component';
import BtnDownloadFileComponent from './custom-button-download-file/custom-button-download-file.component';
import BtnDownloadPdfComponent from './custom-button-download-pdf/custom-button-download-pdf.component';
import BtnDropdownItemComponent from './custom-button-dropdown-item/custom-buttom-dropdown-item.component';
import BtnEditComponent from './custom-button-edit/custom-button-edit.component';
import BtnExportExcelComponent from './custom-button-export-excel/custom-button-export-excel.component';
import BtnLinkComponent from './custom-button-link/custom-button-link.component';
import BtnSendEmailComponent from './custom-button-send-email/custom-button-send-email.component';
import BtnSubmitComponent from './custom-button-submit/custom-button-submit.component';
import BtnComponent from './custom-button/custom-button.component';

@NgModule({
  imports: [
    BtnComponent,

    BtnActiveDesactiveComponent,
    BtnBaggesComponent,
    BtnConfirmationComponent,
    BtnDeleteComponent,
    BtnDeleteSpanComponent,
    BtnDownloadFileComponent,
    BtnDownloadPdfComponent,
    BtnDropdownItemComponent,
    BtnEditComponent,
    BtnExportExcelComponent,
    BtnLinkComponent,
    BtnNotificationComponent,
    BtnRouterEventComponent,
    BtnSendEmailComponent,
    BtnSubmitComponent,
  ],
  exports: [
    BtnComponent,

    BtnActiveDesactiveComponent,
    BtnBaggesComponent,
    BtnConfirmationComponent,
    BtnDeleteComponent,
    BtnDeleteSpanComponent,
    BtnDownloadFileComponent,
    BtnDownloadPdfComponent,
    BtnDropdownItemComponent,
    BtnEditComponent,
    BtnExportExcelComponent,
    BtnLinkComponent,
    BtnNotificationComponent,
    BtnRouterEventComponent,
    BtnSendEmailComponent,
    BtnSubmitComponent,
  ],
})
export default class CustomButtonModule {}
