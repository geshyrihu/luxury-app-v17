import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { EnumSelectService } from 'src/app/core/services/enum-select.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-module-app-add-or-edit',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
  templateUrl: './module-app-add-or-edit.component.html',
  providers: [EnumSelectService],
})
export class ModuleAppAddOrEditComponent {
  apiRequestS = inject(ApiRequestService);
  formB = inject(FormBuilder);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  enumSelectS = inject(EnumSelectService);

  cb_pathParent: ISelectItem[] = [];
  id: string = '';
  submitting: boolean = false;
  cb_rolLevel: ISelectItem[] = [];
  form: FormGroup = this.formB.group({
    id: { value: this.id, disabled: true },
    nameModule: ['', [Validators.required]],
    rolLevel: [null],
    label: [null],
    routerLink: [],
    icon: [],
    pathParent: [null],
    viewMobil: [],
  });

  async ngOnInit() {
    this.cb_rolLevel = await this.enumSelectS.rolLevel();

    this.id = this.config.data.id;
    if (this.id !== '') this.onLoadData();

    this.onLoadModuleApp();
  }
  onLoadData() {
    const urlApi = `ModuleApp/${this.id}`;
    this.apiRequestS.onGetItem(urlApi).then((responseData: any) => {
      this.form.patchValue(responseData);
    });
  }
  onSubmit() {
    if (!this.apiRequestS.validateForm(this.form)) return;
    this.submitting = true;

    if (this.id === '') {
      this.apiRequestS
        .onPost(`ModuleApp`, this.form.value)
        .then((responseData: boolean) => {
          responseData ? this.ref.close(true) : (this.submitting = false);
        });
    } else {
      this.apiRequestS
        .onPut(`ModuleApp/${this.id}`, this.form.value)
        .then((responseData: boolean) => {
          responseData ? this.ref.close(true) : (this.submitting = false);
        });
    }
  }

  onLoadModuleApp() {
    const urlApi = `ModuleApp`;
    this.apiRequestS.onGetSelectItem(urlApi).then((responseData: any) => {
      this.cb_pathParent = responseData;
    });
  }
}
