import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import ComponentsModule from 'app/shared/components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DataService } from 'src/app/core/services/data.service';
import { SelectItemService } from 'src/app/core/services/select-item.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-addoredit-person-data',
  templateUrl: './addoredit-person-data.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ComponentsModule,
    CommonModule,
    CustomInputModule,
  ],
  providers: [DatePipe, CustomToastService],
})
export default class AddoreditPersonDataComponent implements OnInit, OnDestroy {
  private customToastService = inject(CustomToastService);
  private formBuilder = inject(FormBuilder);
  public authService = inject(AuthService);
  public config = inject(DynamicDialogConfig);
  public customerIdService = inject(CustomerIdService);
  public dataService = inject(DataService);
  public datepipe = inject(DatePipe);
  public ref = inject(DynamicDialogRef);
  public selectItemService = inject(SelectItemService);

  personId = 0;
  submitting: boolean = false;
  subRef$: Subscription;
  ngOnInit() {}

  ngOnDestroy(): void {}
}
