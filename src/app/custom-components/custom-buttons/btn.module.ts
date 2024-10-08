import { NgModule } from '@angular/core';

import BtnComponent from './a-master-btn-button/a-master-btn.component';
import BtnActiveDesactiveComponent from './btn-active-desactive/btn-active-desactive.component';
import BtnBaggesComponent from './btn-bagges/btn-bagges.component';
import BtnConfirmationComponent from './btn-confirmation/btn-confirmation.component';
import BtnDeleteSpanComponent from './btn-delete-span/btn-delete-span.component';
import BtnDeleteComponent from './btn-delete/btn-delete.component';
import BtnDownloadFileComponent from './btn-download-file/btn-download-file.component';
import BtnDownloadPdfComponent from './btn-download-pdf/btn-download-pdf.component';
import BtnDropdownItemComponent from './btn-dropdown-item/btn-pdf-dropdown-item.component';
import BtnEditComponent from './btn-edit/btn-edit.component';
import BtnExportExcelComponent from './btn-export-excel/btn-export-excel.component';
import BtnLinkComponent from './btn-link/btn-link.component';
import BtnRouterEventComponent from './btn-router-event/btn-router-event.component';
import BtnNotificationComponent from './btn-router-notification/btn-router-notification.component';
import BtnSendEmailComponent from './btn-send-email/btn-send-email.component';
import BtnSubmitComponent from './btn-submit/btn-submit.component';

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
export default class CBtnModule {}
