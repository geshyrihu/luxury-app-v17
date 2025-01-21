import { NgModule } from '@angular/core';

import BtnActiveDesactiveComponent from './btn-active-desactive/btn-active-desactive.component';
import BtnBaggesComponent from './btn-bagges/btn-bagges.component';
import BtnConfirmationComponent from './btn-confirmation/btn-confirmation.component';
import BtnDeleteSpanComponent from './btn-delete-span/btn-delete-span.component';
import BtnDeleteComponent from './btn-delete/btn-delete.component';
import BtnDownloadFileComponent from './btn-download-file/btn-download-file.component';
import BtnDropdownItemComponent from './btn-dropdown-item/btn-pdf-dropdown-item.component';
import BtnEditComponent from './btn-edit/btn-edit.component';
import BtnExportExcelComponent from './btn-export-excel/btn-export-excel.component';
import BtnLinkComponent from './btn-link/btn-link.component';
import BtnRouterEventComponent from './btn-router-event/btn-router-event.component';
import BtnNotificationComponent from './btn-router-notification/btn-router-notification.component';
import BtnSendEmailComponent from './btn-send-email/btn-send-email.component';
import BtnSubmitComponent from './btn-submit/btn-submit.component';
import CustomBtnComponent from './custom-button-button/custom-button.component';

@NgModule({
  imports: [
    CustomBtnComponent,

    BtnActiveDesactiveComponent,
    BtnBaggesComponent,
    BtnConfirmationComponent,
    BtnDeleteComponent,
    BtnDeleteSpanComponent,
    BtnDownloadFileComponent,
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
    CustomBtnComponent,

    BtnActiveDesactiveComponent,
    BtnBaggesComponent,
    BtnConfirmationComponent,
    BtnDeleteComponent,
    BtnDeleteSpanComponent,
    BtnDownloadFileComponent,
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
