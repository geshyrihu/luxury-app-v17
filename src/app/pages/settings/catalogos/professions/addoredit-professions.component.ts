import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-addoredit-professions',
  templateUrl: './addoredit-professions.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class AddOrEditProfessionsComponent implements OnInit {
  formBuilder = inject(FormBuilder);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  apiRequestService = inject(ApiRequestService);

  submitting: boolean = false;
  id: number = 0;
  cb_area_responsable: ISelectItem[] = [];

  form: FormGroup = this.formBuilder.group({
    id: { value: this.id, disabled: true },
    nameProfession: ['', [Validators.required, Validators.minLength(5)]],
    ecompanyDepartments: ['', [Validators.required]],
    description: ['', [Validators.required]],
    hierarchy: ['', [Validators.required]],
    requirements: ['', [Validators.required]],
    responsibilities: ['', [Validators.required]],
    professionkey: ['', [Validators.required]],
  });

  onLoadSelectItem() {
    this.cb_area_responsable = [
      { value: 0, label: 'Administrativa' },
      { value: 1, label: 'Legal' },
      { value: 2, label: 'Operaciones' },
      { value: 3, label: 'Mantenimiento' },
      { value: 4, label: 'Servicio' },
    ];
  }

  ngOnInit(): void {
    this.onLoadSelectItem();
    this.id = this.config.data.id;
    if (this.id !== 0) this.onLoadData(this.id);
  }

  onLoadData(id: number) {
    const urlApi = `Professions/${id}`;
    this.apiRequestService.onGetItem(urlApi).then((result: any) => {
      this.form.patchValue(result);
    });
  }

  onSubmit() {
    if (!this.apiRequestService.validateForm(this.form)) return;

    this.submitting = true;

    if (this.id === 0) {
      this.apiRequestService
        .onPost(`Professions`, this.form.value)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    } else {
      this.apiRequestService
        .onPut(`Professions/${this.id}`, this.form.value)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    }
  }
}
