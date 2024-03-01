import { Component, Input, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { IRolesDto } from 'src/app/core/interfaces/IRolesDto.interface';
import { ApiRequestService } from 'src/app/core/services/common-services';
@Component({
  selector: 'app-update-role',
  templateUrl: './update-role.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class UpdateRoleComponent implements OnInit {
  public apiRequestService = inject(ApiRequestService);

  roles: IRolesDto[] = [];
  rolesUpdate: IRolesDto[] = [];
  checked = false;

  @Input()
  applicationUserId: string = '';

  ngOnInit(): void {
    this.getRoles();
  }
  getRoles() {
    this.apiRequestService
      .onGetList('Accounts/GetRole/' + this.applicationUserId)
      .then((result: any) => {
        this.roles = result;
        this.rolesUpdate = this.roles;
      });
  }

  updateRole(roles: any): void {
    this.apiRequestService.onPost(
      `Accounts/AddRoleToUser/${this.applicationUserId}`,
      roles
    );
  }
}
