import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { ToastModule } from 'primeng/toast';
import { Subject, takeUntil } from 'rxjs';
import { IRolesDto } from 'src/app/core/interfaces/IRolesDto.interface';
import {
  CustomToastService,
  DataService,
} from 'src/app/core/services/common-services';
@Component({
  selector: 'app-update-role',
  templateUrl: './update-role.component.html',
  standalone: true,
  imports: [
    LuxuryAppComponentsModule,
    CommonModule,
    FormsModule,
    NgbModule,
    ToastModule,
  ],
})
export default class UpdateRoleComponent implements OnInit, OnDestroy {
  private dataService = inject(DataService);
  private customToastService = inject(CustomToastService);

  roles: IRolesDto[] = [];
  rolesUpdate: IRolesDto[] = [];
  checked = false;

  @Input()
  applicationUserId: string = '';

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  ngOnInit(): void {
    this.getRoles();
  }
  getRoles() {
    this.dataService
      .get('Accounts/GetRole/' + this.applicationUserId)
      .subscribe((resp: any) => {
        this.roles = resp.body;
        this.rolesUpdate = this.roles;
      });
  }

  updateRole(roles: any) {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();

    const url = `Accounts/AddRoleToUser/${this.applicationUserId}`;
    this.dataService
      .post(url, roles)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: () => {
          this.customToastService.onCloseToSuccess();
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }
  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
