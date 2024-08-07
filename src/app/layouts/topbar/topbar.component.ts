import { CommonModule, Location } from '@angular/common';
import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgbDropdownModule, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DialogModule } from 'primeng/dialog';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InfoAccountAuthDto } from 'src/app/core/interfaces/user-token.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import { ProfielServiceService } from 'src/app/core/services/profiel-service.service';
import { environment } from 'src/environments/environment';
import MenuSelectCustomerComponent from '../menu-select-customer/menu-select-customer.component';
import ModalSearchComponent from '../modal-search/modal-search.component';
@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  standalone: true,
  imports: [
    LuxuryAppComponentsModule,
    FormsModule,
    RouterModule,
    CommonModule,
    NgbDropdownModule,
    NgbTooltip,
    DialogModule,
    MenuSelectCustomerComponent,
  ],
})
export class TopbarComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  authService = inject(AuthService);
  customToastService = inject(CustomToastService);
  dialogHandlerService = inject(DialogHandlerService);
  dialogService = inject(DialogService);
  location = inject(Location);
  router = inject(Router);
  profielServiceService = inject(ProfielServiceService);

  @Output() settingsButtonClicked = new EventEmitter();

  valueset: any;
  infoAccountAuthDto: InfoAccountAuthDto;
  imagenPerfilUrl = '';
  ref: DynamicDialogRef | undefined;

  onModalSearch() {
    this.ref = this.dialogService.open(ModalSearchComponent, {
      closeOnEscape: true,
      contentStyle: { overflow: 'auto', borderRadius: '3px' },
      position: 'top',
      showHeader: false,
      width: '40%',
      baseZIndex: 10000,
    });
  }

  toggleRightSidebar() {
    this.settingsButtonClicked.emit();
  }

  ngOnInit(): void {
    this.infoAccountAuthDto = this.authService.infoUserAuthDto;
    this.imagenPerfilUrl =
      environment.base_urlImg +
      'Administration/accounts/' +
      this.infoAccountAuthDto.photoPath;
    this.profielServiceService.imagenPerfilActualizada$.subscribe(
      (nuevaImagenUrl: any) => {
        this.imagenPerfilUrl = nuevaImagenUrl.imagenUrl;
      }
    );
  }

  /**
   * Toggle the menu bar when having mobile screen
   */
  @Output()
  mobileMenuButtonClicked = new EventEmitter();
  toggleMobileMenu(event: any) {
    event.preventDefault();
    this.mobileMenuButtonClicked.emit();
  }

  /**
   * Logout the user
   */
  logout() {
    const currentUrl = this.router.url;
    localStorage.setItem('currentUrl', currentUrl);
    this.router.navigate(['/auth/login']);

    this.apiRequestService
      .onGetItem(
        `Auth/Logout/${this.authService.infoUserAuthDto.applicationUserId}`
      )
      .then(() => {});
  }

  // Datos Personales
  onShowModalDatosPersonales() {}

  // Modal datos direccion
  onModalDataAddress() {}

  onBack() {
    this.location.back();
  }

  onNext() {
    this.location.forward();
  }

  onRefresh() {
    // window.location.href = window.location.href; // Reasignar la URL actual para recargar la página

    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }
}
