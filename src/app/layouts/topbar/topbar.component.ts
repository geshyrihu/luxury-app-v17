import { CommonModule, Location } from '@angular/common';
import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgbDropdownModule, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InfoEmployeeAuthDto } from 'src/app/core/interfaces/user-token.interface';
import {
  AuthService,
  CustomToastService,
  CustomerIdService,
  DataService,
  SelectItemService,
} from 'src/app/core/services/common-services';
import { ProfielServiceService } from 'src/app/core/services/profiel-service.service';
import { environment } from 'src/environments/environment';
import ModalSearchComponent from '../modal-search/modal-search.component';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  standalone: true,
  imports: [
    FormsModule,
    RouterModule,
    CommonModule,
    NgbDropdownModule,
    NgbTooltip,
    DialogModule,
  ],
  providers: [DialogService, MessageService, CustomToastService],
})
export class TopbarComponent implements OnInit {
  private customerIdService = inject(CustomerIdService);
  private dataService = inject(DataService);
  private location = inject(Location);
  private router = inject(Router);
  private selectItemService = inject(SelectItemService);
  public authService = inject(AuthService);
  public customToastService = inject(CustomToastService);
  public dialogService = inject(DialogService);
  public profielServiceService = inject(ProfielServiceService);

  //TODO REVISAR FUNCIONAKLIDAD QUE SE OCULTE MENU EN VERSION MOBIL
  @Output()
  mobileMenuButtonClicked = new EventEmitter();

  valueset: any;
  dataInfo: InfoEmployeeAuthDto;
  customerId = this.customerIdService.customerId;
  cb_customer: any[] = [];
  imagenPerfilUrl = '';
  ref: DynamicDialogRef | undefined;

  onLoadSelectItem() {
    this.selectItemService
      .onGetSelectItem(
        `CustomersAcceso/${this.authService.infoUserAuthDto.applicationUserId}`
      )
      .subscribe((resp) => {
        this.cb_customer = resp;
      });
  }

  selectCustomer(customerId: number) {
    this.customerIdService.setCustomerId(customerId);
  }

  onModalSearch() {
    this.ref = this.dialogService.open(ModalSearchComponent, {
      closeOnEscape: true,
      contentStyle: { overflow: 'auto', borderRadius: '3px' },
      position: 'top',
      showHeader: false,
      width: '40%',
      modal: true,
      dismissableMask: true,
      baseZIndex: 10000,
      maximizable: true,
    });
  }

  ngOnInit(): void {
    this.onLoadSelectItem();
    this.dataInfo = this.authService.userTokenDto.infoEmployeeDto;
    this.imagenPerfilUrl =
      environment.base_urlImg +
      'Administration/accounts/' +
      this.dataInfo.photoPath;
    this.profielServiceService.imagenPerfilActualizada$.subscribe(
      (nuevaImagenUrl: any) => (this.imagenPerfilUrl = nuevaImagenUrl.imagenUrl)
    );
  }

  /**
   * Toggle the menu bar when having mobile screen
   */
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

    this.dataService
      .get('Auth/Logout/' + this.authService.infoUserAuthDto.applicationUserId)
      .subscribe(() => {});
  }

  onBack() {
    this.location.back();
  }

  onNext() {
    this.location.forward();
  }
}
