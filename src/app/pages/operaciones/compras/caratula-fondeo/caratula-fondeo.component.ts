import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { ETipoGasto } from 'src/app/core/enums/tipo-gasto.enum';
import { onGetSelectItemFromEnum } from 'src/app/core/helpers/enumeration';
import { ISelectItemDto } from 'src/app/core/interfaces/ISelectItemDto.interface';
import { CaratulaFondeoService } from 'src/app/core/services/caratula-fondeo.service';
import {
  ApiRequestService,
  CustomerIdService,
  DataService,
} from 'src/app/core/services/common-services';
import { DateService } from 'src/app/core/services/date.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

const date = new Date();
@Component({
  selector: 'app-caratula-fondeo',
  templateUrl: './caratula-fondeo.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
  providers: [MessageService],
})
export default class CaratulaFondeoComponent implements OnInit {
  public dateService = inject(DateService);
  public dataService = inject(DataService);
  public apiRequestService = inject(ApiRequestService);
  private formBuilder = inject(FormBuilder);
  public ref = inject(DynamicDialogRef);
  public customerIdService = inject(CustomerIdService);
  public router = inject(Router);
  public caratulaFondeoService = inject(CaratulaFondeoService);

  submitting: boolean = false;

  tipoGasto: ISelectItemDto[] = onGetSelectItemFromEnum(ETipoGasto);
  form: FormGroup = this.formBuilder.group({
    fechaInicial: ['', Validators.required],
    fechaFinal: [this.dateService.getDateFormat(date), Validators.required],
    eTipoGasto: [0, Validators.required],
    cuenta: ['', Validators.required],
    datoDePago: ['', Validators.required],
    entregadoPor: ['', Validators.required],
    ligaFacturas: ['', Validators.required],
  });
  customerId$: Observable<number> = this.customerIdService.getCustomerId$();

  ngOnInit(): void {
    if (this.caratulaFondeoService.requestFondeoCaratulaDto !== undefined) {
      this.form.patchValue(this.caratulaFondeoService.requestFondeoCaratulaDto);
    }
    this.customerId$ = this.customerIdService.getCustomerId$();
  }
  onSubmit() {
    if (!this.apiRequestService.validateForm(this.form)) return;
    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;

    const CaratulaFondeo = {
      customerId: this.customerIdService.getcustomerId(),
      fechaInicial: this.form.get('fechaInicial').value,
      fechaFinal: this.form.get('fechaFinal').value,
      eTipoGasto: this.form.get('eTipoGasto').value,
      cuenta: this.form.get('cuenta').value,
      datoDePago: this.form.get('datoDePago').value,
      entregadoPor: this.form.get('entregadoPor').value,
      ligaFacturas: this.form.get('ligaFacturas').value,
    };
    this.caratulaFondeoService.createRequestFondeoCaratulaDto(CaratulaFondeo);

    this.router.navigateByUrl('operaciones/compras/caratula-fondeo');
    // Habilitar el botón nuevamente al finalizar el envío del formulario
    this.submitting = false;
    this.ref.close(true);
  }
}
