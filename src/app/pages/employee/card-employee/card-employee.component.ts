import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IUserCard } from 'src/app/core/interfaces/user-card.interface';
import PhoneFormatPipe from 'src/app/core/pipes/phone-format.pipe';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-card-employee',
  templateUrl: './card-employee.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, PhoneFormatPipe],
})
export default class CardEmployeeComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);

  urlImage: string = '';
  applicationUserId: number = 0;
  applicationUser: IUserCard;

  ngOnInit(): void {
    this.applicationUserId = this.config.data.applicationUserId;
    this.onLoadData();
  }

  onLoadData() {
    this.apiRequestService
      .onGetItem(`Auth/CardUser/${this.applicationUserId}`)
      .then((result: any) => {
        this.applicationUser = result;
        this.urlImage = `${environment.base_urlImg}Administration/accounts/${this.applicationUser.photoPath}`;
      });
  }
}
