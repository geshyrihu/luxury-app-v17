import { Component, Input, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { IRoles } from 'src/app/core/interfaces/roles.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';

@Component({
  selector: 'app-update-role',
  templateUrl: './update-role.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class UpdateRoleComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);

  roles: IRoles[] = [];
  @Input() applicationUserId: string = '';

  ngOnInit(): void {
    this.getRoles();
  }

  getRoles() {
    this.apiRequestS
      .onGetList('ApplicationUser/GetRole/' + this.applicationUserId)
      .then((responseData: any) => {
        this.roles = responseData;
      });
  }

  selectRole(selectedRole: IRoles): void {
    // Deseleccionar todos los roles
    this.roles.forEach((role) => (role.isSelected = false));

    // Seleccionar el rol actual
    selectedRole.isSelected = true;

    // Enviar al backend
    this.apiRequestS.onPost(
      `ApplicationUser/AddRoleToUser/${this.applicationUserId}`,
      selectedRole
    );
  }
}
