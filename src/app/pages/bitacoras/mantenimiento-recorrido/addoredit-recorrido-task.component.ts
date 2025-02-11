import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
    selector: 'app-addoredit-recorrido-task',
    templateUrl: './addoredit-recorrido-task.component.html',
    imports: [LuxuryAppComponentsModule, CustomInputModule]
})
export default class RecorridoTaskAddOrEditComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  formB = inject(FormBuilder);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);

  submitting: boolean = false;

  form: FormGroup;
  id: number = 0;
  routeId: number = 0;

  ngOnInit(): void {
    this.routeId = this.config.data.routeId;
    this.id = this.config.data.id;
    if (this.id !== 0) this.onLoadData();
    this.onLoadForm();
  }

  onLoadForm() {
    this.form = this.formB.group({
      id: { value: this.id, disabled: true },
      routeId: [this.routeId, Validators.required],
      task: ['', Validators.required],
    });
  }

  onLoadData() {
    const urlApi = `RouteTask/${this.id}`;
    this.apiRequestS.onGetItem(urlApi).then((responseData: any) => {
      this.form.patchValue(responseData);
    });
  }
  onSubmit() {
    if (!this.apiRequestS.validateForm(this.form)) return;
    this.id = this.config.data.id;

    this.submitting = true;

    if (this.id === 0) {
      this.apiRequestS
        .onPost(`RouteTask`, this.form.value)
        .then((responseData: boolean) => {
          responseData ? this.ref.close(true) : (this.submitting = false);
        });
    } else {
      this.apiRequestS
        .onPut(`RouteTask/${this.id}`, this.form.value)
        .then((responseData: boolean) => {
          responseData ? this.ref.close(true) : (this.submitting = false);
        });
    }
  }
}
