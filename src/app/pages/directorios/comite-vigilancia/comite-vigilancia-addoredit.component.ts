import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { EnumSelectService } from 'src/app/core/services/enum-select.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-comite-vigilancia-addoredit',
  templateUrl: './comite-vigilancia-addoredit.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
  providers: [EnumSelectService],
})
export default class ComiteVigilanciaAddOrEditComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  config = inject(DynamicDialogConfig);
  customerIdS = inject(CustomerIdService);
  enumSelectS = inject(EnumSelectService);
  formB = inject(FormBuilder);
  ref = inject(DynamicDialogRef);

  submitting: boolean = false;

  cb_position: ISelectItem[] = [];
  cb_condomino: ISelectItem[] = [];
  id: number = 0;
  form: FormGroup = this.formB.group({
    id: { value: this.id, disabled: true },
    listCondominoId: ['', Validators.required],
    nameDirectoryCondominium: ['', Validators.required],
    ePosicionComite: [null, [Validators.required]],
    customerId: [],
  });

  async ngOnInit() {
    this.apiRequestS
      .onGetSelectItem(`listcondomino/${this.customerIdS.getCustomerId()}`)
      .then((response: any) => {
        this.cb_condomino = response;
      });

    this.form.patchValue({
      customerId: this.customerIdS.getCustomerId(),
    });

    this.id = this.config.data.id;
    if (this.id !== 0) this.onLoadData();

    this.cb_position = await this.enumSelectS.typePosicionComite();
  }

  public saveCondominoId(e: any): void {
    let find = this.cb_condomino.find((x) => x?.label === e.target.value);
    this.form.patchValue({
      listCondominoId: find?.value,
    });
  }

  onLoadData() {
    this.apiRequestS
      .onGetItem(`comitevigilancia/${this.id}`)
      .then((result: any) => {
        this.form.patchValue(result);
        this.form.patchValue({
          nameDirectoryCondominium: result.nameDirectoryCondominium,
        });
      });
  }
  onSubmit() {
    if (!this.apiRequestS.validateForm(this.form)) return;
    this.submitting = true;

    const formValue = this.form.value;

    const filteredFormValue = {
      customerId: formValue.customerId,
      listCondominoId: formValue.listCondominoId,
      ePosicionComite: formValue.ePosicionComite,
    };

    if (this.id === 0) {
      this.apiRequestS
        .onPost(`ComiteVigilancia`, filteredFormValue)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    } else {
      this.apiRequestS
        .onPut(`ComiteVigilancia/${this.id}`, filteredFormValue)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    }
  }
}
