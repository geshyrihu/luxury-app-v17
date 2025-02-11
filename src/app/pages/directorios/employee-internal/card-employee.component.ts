import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IUserCard } from 'src/app/core/interfaces/user-card.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';

@Component({
  selector: 'app-card-employee',
  templateUrl: './card-employee.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class CardEmployeeComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
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
    this.apiRequestS
      .onGetItem(`Auth/CardUser/${this.applicationUserId}`)
      .then((responseData: any) => {
        this.applicationUser = responseData;
        this.urlImage = this.applicationUser.photoPath;
      });
  }
}
