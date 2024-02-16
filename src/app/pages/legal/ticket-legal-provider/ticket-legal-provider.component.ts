import { Component, OnInit, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FlatpickrModule } from 'angularx-flatpickr';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ETypePerson as ETypeProvider } from 'src/app/core/enums/type-person.enum';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';

import flatpickr from 'flatpickr';
import { Spanish } from 'flatpickr/dist/l10n/es';
import { Subject, takeUntil } from 'rxjs';
import { ISelectItemDto } from 'src/app/core/interfaces/ISelectItemDto.interface';
import { SelectItemService } from 'src/app/core/services/select-item.service';
import { SignalrcustomService } from 'src/app/core/services/signalrcustom.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';
export function flatpickrFactory() {
  flatpickr.localize(Spanish);
  return flatpickr;
}
@Component({
  selector: 'app-ticket-legal-provider',
  templateUrl: './ticket-legal-provider.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, FlatpickrModule, CustomInputModule],
})
export default class TicketLegalProviderComponent implements OnInit {
  private auhtService = inject(AuthService);
  private customerIdService = inject(CustomerIdService);
  private formBuilder = inject(FormBuilder);
  private selectItemService = inject(SelectItemService);
  private signalrcustomService = inject(SignalrcustomService);
  public apiRequestService = inject(ApiRequestService);
  public ref = inject(DynamicDialogRef);

  ETypeProviderEnum = ETypeProvider; // Importa tu enum y asígnalo a una propiedad para usarlo en la plantilla

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  cb_providers: ISelectItemDto[] = [];
  submitting: boolean = false;

  form: FormGroup = this.formBuilder.group({
    requestPersonId: [
      this.auhtService.infoEmployeeDto.personId,
      [Validators.required],
    ],
    customerId: [this.customerIdService.customerId],
    providerId: ['', [Validators.required]],
    providerName: ['', [Validators.required]],
    typeProvider: [ETypeProvider.PersonaMoral, [Validators.required]],
    duration: [null],
    description: [, Validators.required],
    price: [, Validators.required],
    Documents: this.formBuilder.array([]),
  });

  ngOnInit() {
    this.signalrcustomService.hubConnection.on(
      'Nueva solicitud',
      (respuesta) => {
        console.log(
          'estamos desde el Componente.... hubConnection: ',
          respuesta
        );
      }
    );
    this.selectItemService
      .onGetSelectItem('Providers')
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe((resp) => {
        this.cb_providers = resp;
        console.log('🚀 ~ this.cb_providers:', this.cb_providers);
      });
    flatpickrFactory();
  }

  onSubmit() {
    const formData = new FormData();

    // Agrega las propiedades principales al FormData
    formData.append('requestPersonId', this.form.get('requestPersonId')?.value);
    formData.append('customerId', this.form.get('customerId')?.value);
    formData.append('providerId', this.form.get('providerId')?.value);
    formData.append('typeProvider', this.form.get('typeProvider')?.value);
    formData.append('description', this.form.get('description')?.value);
    formData.append('price', this.form.get('price')?.value);

    // Obtener el valor de duration del formulario
    let durationValue = this.form.get('duration')?.value;

    // Verificar si durationValue es null o undefined
    if (durationValue === null || durationValue === undefined) {
      // Asignar un valor por defecto si durationValue es null o undefined
      durationValue = ''; // Aquí puedes asignar un valor por defecto que acepte el servidor
    } else {
      formData.append('duration', this.form.get('duration')?.value);
    }

    // Obtén la lista de documentos
    const documents = this.form.get('Documents') as FormArray;

    // Agrega cada documento al FormData
    for (let i = 0; i < documents.length; i++) {
      const document = documents.at(i) as FormGroup;
      formData.append(
        `Documents[${i}].NameDocument`,
        document.get('NameDocument')?.value
      );
      formData.append(
        `Documents[${i}].Document`,
        document.get('Document')?.value
      );
    }

    // Mostrar el contenido de FormData en la consola
    console.log('FormData:');
    formData.forEach((value, key) => {
      console.log(key, value);
    });
    // Ahora, puedes enviar formData al servidor
    this.apiRequestService
      .onPostForModal('TicketLegal/ProviderContract', formData)
      .then((response) => {
        if (response) {
          this.ref.close(true);
        }
      });
  }

  change(event: any, nameDocument: string): void {
    const file = (event.target as HTMLInputElement).files[0];
    const documentsControl = this.form.get('Documents') as FormArray;

    documentsControl.push(
      this.formBuilder.group({
        NameDocument: nameDocument,
        Document: file,
      })
    );
  }

  public saveProviderId(e: any): void {
    let find = this.cb_providers.find((x) => x?.label === e.target.value);
    this.form.patchValue({
      providerId: find?.value,
    });
  }
}
export interface RequetTicketLegalProviderDto {
  requestPersonId: number;
  customerId: number;
  providerId: number;
  documents: Documents[];
  typeProvider: ETypeProvider;
}

export interface Documents {
  nameDocument: string;
  document: File;
}
