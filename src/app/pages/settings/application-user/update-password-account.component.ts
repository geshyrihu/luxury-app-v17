import { Component, Input, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { UpdatePasswordDto } from 'src/app/core/interfaces/user-info.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';

@Component({
    selector: 'app-update-password-account',
    templateUrl: './update-password-account.component.html',
    imports: [LuxuryAppComponentsModule]
})
export default class UpdatePasswordAccountComponent implements OnInit {
  config = inject(DynamicDialogConfig);
  apiRequestS = inject(ApiRequestService);
  customToastService = inject(CustomToastService);

  submitting: boolean = false;
  email = this.config.data.email;
  @Input()
  applicationUserId: string = '';
  userInfoDto: UpdatePasswordDto;

  ngOnInit(): void {}

  sendOnlyPasswordEmail() {
    this.submitting = true;
    this.apiRequestS
      .onGetItem(`Auth/SendNewPasswordForEmail/${this.applicationUserId}`)
      .then(() => {
        this.submitting = false;
        this.customToastService.onShowSuccess();
      });
  }
  onGenerateUserNameAndPassword() {
    this.submitting = true;
    this.apiRequestS
      .onGetItem(`Auth/SendNewUserNameForEmail/${this.applicationUserId}`)
      .then(() => {
        this.submitting = false;
        this.customToastService.onShowSuccess();
      });
  }
}
