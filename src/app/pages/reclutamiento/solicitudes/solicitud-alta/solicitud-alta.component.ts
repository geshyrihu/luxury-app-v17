import { CommonModule } from '@angular/common'
import { Component, OnDestroy, OnInit, inject } from '@angular/core'
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms'
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog'
import { Subscription } from 'rxjs'
import { ISelectItemDto } from 'src/app/core/interfaces/ISelectItemDto.interface'
import {
  AuthService,
  CustomToastService,
  DataService,
} from 'src/app/core/services/common-services'
import { EnumService } from 'src/app/core/services/enum-service'
import ComponentsModule from 'src/app/shared/components.module'
import CustomInputModule from 'src/app/shared/custom-input-form/custom-input.module'

@Component({
  selector: 'app-solicitud-alta',
  templateUrl: './solicitud-alta.component.html',
  standalone: true,
  imports: [
    ComponentsModule,
    ReactiveFormsModule,
    CommonModule,
    CustomInputModule,
  ],
})
export default class SolicitudAltaComponent implements OnInit, OnDestroy {
  private formBuilder = inject(FormBuilder)
  private dataService = inject(DataService)
  public ref = inject(DynamicDialogRef)
  public config = inject(DynamicDialogConfig)
  public authService = inject(AuthService)
  private customToastService = inject(CustomToastService)
  private enumService = inject(EnumService)

  requestPositionCandidateId: number = 0
  data: any
  submitting: boolean = false

  subRef$: Subscription
  cb_typeContractRegister: ISelectItemDto[] = []

  // [
  //   { value: 0, label: 'Por un mes' },
  //   { value: 1, label: 'Por tres mes' },
  //   { value: 2, label: 'Temporal' },
  //   { value: 3, label: 'Indefinido' },
  // ];

  form: FormGroup = this.formBuilder.group({
    requestPositionCandidateId: [
      this.config.data.requestPositionCandidateId,
      Validators.required,
    ],
    boss: ['', Validators.required],
    candidateName: ['', Validators.required],
    customerAddress: ['', Validators.required],
    professionName: ['', Validators.required],
    salary: ['', Validators.required],
    typeContractRegister: [1, Validators.required],
    additionalInformation: [],
  })

  ngOnInit(): void {
    this.requestPositionCandidateId =
      this.config.data.requestPositionCandidateId
    if (this.requestPositionCandidateId !== 0) this.onLoadData()
  }
  onLoadData() {
    this.enumService
      .getEnumValuesDisplay('ETypeContractRegister')
      .subscribe((resp) => {
        this.cb_typeContractRegister = resp
      })
    this.subRef$ = this.dataService
      .get(
        `RequestEmployeeRegister/GetEmployeeRegister/${this.requestPositionCandidateId}`,
      )
      .subscribe({
        next: (resp: any) => {
          this.data = resp.body
          this.form.patchValue(resp.body)
        },

        error: (err) => {
          this.customToastService.onShowError()
          console.log(err.error)
        },
      })
  }
  onSubmit() {
    if (this.form.invalid) {
      Object.values(this.form.controls).forEach((x) => {
        x.markAllAsTouched()
      })
      return
    }

    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true
    // Mostrar un mensaje de carga
    this.customToastService.onLoading()

    this.subRef$ = this.dataService
      .post(
        `SolicitudesReclutamiento/SolicitudAlta/${this.authService.infoUserAuthDto.applicationUserId}`,
        this.form.value,
      )
      .subscribe({
        next: () => {
          this.ref.close(true)
          this.customToastService.onClose()
        },
        error: (err) => {
          // Habilitar el botón nuevamente al finalizar el envío del formulario
          this.submitting = false
          // En caso de error, mostrar un mensaje de error y registrar el error en la consola
          this.customToastService.onCloseToError()
          console.log(err.error)
        },
      })
  }
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe()
  }
}
