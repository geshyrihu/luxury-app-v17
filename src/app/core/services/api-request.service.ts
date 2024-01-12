import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class ApiRequestService {
  onValidateForm(form: FormGroup) {
    if (form.invalid) {
      Object.values(form.controls).forEach((x) => {
        x.markAllAsTouched();
      });
      return;
    }
  }
}
