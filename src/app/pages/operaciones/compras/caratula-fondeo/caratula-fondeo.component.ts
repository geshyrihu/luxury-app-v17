import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { ETipoGasto } from 'src/app/core/enums/tipo-gasto.enum';
import { onGetSelectItemFromEnum } from 'src/app/core/helpers/enumeration';
import { ISelectItemDto } from 'src/app/core/interfaces/ISelectItemDto.interface';
import { CaratulaFondeoService } from 'src/app/core/services/caratula-fondeo.service';
import { CustomerIdService } from 'src/app/core/services/common-services';
import { DateService } from 'src/app/core/services/date.service';
import ComponentsModule from 'src/app/shared/components.module';
import CustomInputModule from 'src/app/shared/custom-input-form/custom-input.module';

const date = new Date();
@Component({
  selector: 'app-caratula-fondeo',
  templateUrl: './caratula-fondeo.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ComponentsModule,
    CustomInputModule,
  ],
  providers: [MessageService],
})
export default class CaratulaFondeoComponent implements OnInit {
  public dateService = inject(DateService);
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
    if (this.form.invalid) {
      Object.values(this.form.controls).forEach((x) => {
        x.markAllAsTouched();
      });
      return;
    }
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
