import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-add-file-estado-financiero',
  templateUrl: './add-file-estado-financiero.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class AddFileEstadoFinancieroComponent implements OnInit {
  formBuilder = inject(FormBuilder);
  apiRequestService = inject(ApiRequestService);
  authService = inject(AuthService);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);

  submitting: boolean = false;
  id: number = 0;
  filePath: string = '';

  form: FormGroup = this.formBuilder.group({
    nameFileEstadoFinanciero: [''],
  });
  ngOnInit(): void {
    this.id = this.config.data.id;
  }

  change(file: any) {
    this.form.patchValue({ nameFileEstadoFinanciero: file });
  }
  onSubmit() {
    if (!this.apiRequestService.validateForm(this.form)) return;

    this.id = this.config.data.id;
    const model = this.onCreateFormData(this.form.value);

    this.submitting = true;

    this.apiRequestService
      .onPost(
        `EstadoFinanciero/UploadFile/${this.id}/${this.authService.infoEmployeeDto.personId}`,
        model
      )
      .then((result: boolean) => {
        result ? this.ref.close(true) : (this.submitting = false);
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
