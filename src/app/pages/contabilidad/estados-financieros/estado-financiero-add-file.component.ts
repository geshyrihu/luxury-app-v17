import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-estado-financiero-add-file',
  templateUrl: './estado-financiero-add-file.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class EstadoFinancieroAddFileComponent implements OnInit {
  formB = inject(FormBuilder);
  apiRequestS = inject(ApiRequestService);
  authS = inject(AuthService);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);

  submitting: boolean = false;
  id: number = 0;
  filePath: string = '';

  form: FormGroup = this.formB.group({
    nameFileEstadoFinanciero: [''],
  });
  ngOnInit(): void {
    this.id = this.config.data.id;
  }

  change(file: any) {
    this.form.patchValue({ nameFileEstadoFinanciero: file });
  }
  onSubmit() {
    if (!this.apiRequestS.validateForm(this.form)) return;

    this.id = this.config.data.id;
    const model = this.onCreateFormData(this.form.value);

    this.submitting = true;

    this.apiRequestS
      .onPost(
        `EstadoFinanciero/UploadFile/${this.id}/${this.authS.applicationUserId}`,
        model
      )
      .then((responseData: boolean) => {
        responseData ? this.ref.close(true) : (this.submitting = false);
      });
  }

  onCreateFormData(dto: any) {
    let formData = new FormData();
    if (dto.nameFileEstadoFinanciero) {
      formData.append('nameFileEstadoFinanciero', dto.nameFileEstadoFinanciero);
    }
    return formData;
  }
}
