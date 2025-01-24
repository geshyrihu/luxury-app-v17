import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-addoredit-presentacion-junta-comite',
  templateUrl: './addoredit-presentacion-junta-comite.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class AddoreditPresentacionJuntaComiteComponent
  implements OnInit
{
  apiRequestService = inject(ApiRequestService);
  formBuilder = inject(FormBuilder);
  config = inject(DynamicDialogConfig);
  authS = inject(AuthService);
  ref = inject(DynamicDialogRef);

  submitting: boolean = false;
  id: number = 0;
  filePath: string = '';
  errorMessage: string = '';

  form: FormGroup = this.formBuilder.group({
    id: { value: this.id, disabled: true },
    archivo: [''],
    area: [],
  });

  ngOnInit(): void {
    this.id = this.config.data.id;
    this.form.patchValue({ area: this.config.data.titulo });
  }

  change(file: any) {
    this.form.patchValue({ archivo: file });
  }
  onSubmit() {
    if (!this.apiRequestService.validateForm(this.form)) return;

    this.id = this.config.data.id;
    const model = this.onCreateFormData(this.form.value);

    this.submitting = true;

    this.apiRequestService
      .onPost(`PresentacionJuntaComite/AddFile`, model)
      .then((result: boolean) => {
        result ? this.ref.close(true) : (this.submitting = false);
      });
  }

  onCreateFormData(dto: any) {
    let formData = new FormData();
    formData.append('id', String(this.id));
    formData.append('applicationUserId', this.authS.applicationUserId);
    formData.append('area', String(dto.area));
    if (dto.archivo) {
      formData.append('archivo', dto.archivo);
    }
    return formData;
  }
}
