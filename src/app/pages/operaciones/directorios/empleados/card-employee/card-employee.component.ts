import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { IUserCardDto } from 'src/app/core/interfaces/IUserCardDto.interface';
import PhoneFormatPipe from 'src/app/core/pipes/phone-format.pipe';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { DataService } from 'src/app/core/services/data.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-card-employee',
  templateUrl: './card-employee.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, PhoneFormatPipe],
})
export default class CardEmployeeComponent implements OnInit, OnDestroy {
  private dataService = inject(DataService);
  public ref = inject(DynamicDialogRef);
  public config = inject(DynamicDialogConfig);
  public customToastService = inject(CustomToastService);

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  urlImage: string = '';
  employeeId: number = 0;
  user: IUserCardDto;

  ngOnInit(): void {
    this.employeeId = this.config.data.employeeId;
    this.onLoadData();
  }

  onLoadData() {
    this.dataService
      .get<IUserCardDto>(`Auth/CardUser/${this.employeeId}`)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.user = resp.body;
          this.urlImage = `${environment.base_urlImg}Administration/accounts/${this.user.photoPath}`;
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
