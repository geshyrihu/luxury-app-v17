import { Component, OnInit, inject } from '@angular/core';

import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { ApiRequestService } from 'src/app/core/services/common-services';
@Component({
  selector: 'app-list-roles',
  templateUrl: './list-roles.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class ListRolesComponent implements OnInit {
  public apiRequestService = inject(ApiRequestService);
  data: any[] = [];

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    this.apiRequestService.onGetList('Roles').then((result: any) => {
      this.data = result;
    });
  }
}
