import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import PresupuestoEditPartidaComponent from 'src/app/pages/contabilidad/presupuesto/presupuesto-edit-partida.component';
import OrdenesCompraCedulaListComponent from '../../compras/cedula-presupuestal/ordenes-compra-cedula-list.component';
import PresupuestoAddPartidaComponent from '../presupuesto/presupuesto-add-partida.component';
import InfoCuentaComponent from './info-cuenta.component';
import MantenimientosProgramadosComponent from './mantenimientos-programados.component';
import PresupuestoDetalleEdicionHistorialComponent from './presupuesto-detalle-edicion-historial.component';
import PresupuestoEditionFileComponent from './presupuesto-edition-file.component';

@Component({
    selector: 'app-presupuesto-individual',
    templateUrl: './presupuesto-individual.component.html',
    imports: [LuxuryAppComponentsModule]
})
export default class PresupuestoIndividualComponent implements OnInit {
  authS = inject(AuthService);
  customerIdS = inject(CustomerIdService);
  apiRequestS = inject(ApiRequestService);
  dialogHandlerS = inject(DialogHandlerService);
  private activatedRoute = inject(ActivatedRoute);

  // Declaración e inicialización de variables
  id: number = 0;
  applicationUserId: string = this.authS.applicationUserId;
  data: any;
  ref: DynamicDialogRef; // Referencia a un cuadro de diálogo modal

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.params.id;
    // Cuando se inicia el componente, cargar los datos de los bancos
    this.onLoadData();
  }

  onLoadData() {
    this.apiRequestS
      .onGetItem(`Presupuesto/GetById/${this.id}`)
      .then((responseData: any) => {
        this.data = responseData;
      });
  }

  onModalAdd() {
    this.dialogHandlerS
      .openDialog(
        PresupuestoAddPartidaComponent,
        {
          idBudgetCard: this.id,
        },
        'Agregar Partida',
        this.dialogHandlerS.dialogSizeMd
      )
      .then((responseData: boolean) => {
        if (responseData) this.onLoadData();
      });
  }

  // Función para eliminar un partida presupuestal
  onDelete(id: number) {
    this.apiRequestS
      .onDelete(`cedulapresupuestal/cedulapresupuestaldetalle/${id}`)
      .then((responseData: boolean) => {
        if (responseData) {
          this.data = this.data.filter((item: any) => item.id !== id);
        }
      });
  }
  // Función para eliminar
  onGetHistorial(id: number) {
    this.dialogHandlerS.openDialog(
      PresupuestoDetalleEdicionHistorialComponent,
      {
        id,
      },
      'Historial de movimientos',
      this.dialogHandlerS.dialogSizeMd
    );
  }
  onModalInfoCuenta(id: number) {
    this.dialogHandlerS.openDialog(
      InfoCuentaComponent,
      {
        id: this.id,
      },
      'Consideraciones',
      this.dialogHandlerS.dialogSizeMd
    );
  }

  // Función para abrir un cuadro de diálogo modal para agregar o editar información sobre un banco
  onModalAddOrEdit(data: any) {
    this.dialogHandlerS
      .openDialog(
        PresupuestoEditPartidaComponent,
        {
          id: this.id,
        },
        data.title,
        this.dialogHandlerS.dialogSizeMd
      )
      .then((responseData: boolean) => {
        if (responseData) this.onLoadData();
      });
  }

  ServiciosMttoProgramados(cuentaId: number) {
    this.dialogHandlerS.openDialog(
      MantenimientosProgramadosComponent,
      {
        cuentaId: cuentaId,
      },
      'Mantenimientos programados',
      this.dialogHandlerS.dialogSizeMd
    );
  }

  onModalDocument(id: number) {
    this.dialogHandlerS
      .openDialog(
        PresupuestoEditionFileComponent,
        {
          id: id,
        },
        'Soporte documentos',
        this.dialogHandlerS.dialogSizeMd
      )
      .then((responseData: boolean) => {
        if (responseData) this.onLoadData();
      });
  }

  onEnterPressed(item: any) {
    // Mostrar un mensaje de carga
    // this.customToastService.onLoading();

    const data = {
      id: item.id,
      applicationUserId: this.applicationUserId,
      monthlyBudget: item.monthlyBudget,
    };

    this.apiRequestS.onPost(`Presupuesto/UpdateAccount/`, data).then((_) => {
      const index = this.data.budgetDetailDto.findIndex(
        (existingItem) => existingItem.id === data.id
      );
      // Calcula el porcentaje de aumento
      const porcentaje = this.PorcentajeAumento(
        data.monthlyBudget,
        item.monthlyBudgetFormet
      ); // Reemplaza 'originalValor' por el valor correcto

      if (index !== -1) {
        // Actualiza el elemento en la matriz
        this.data.budgetDetailDto[index] = {
          ...this.data.budgetDetailDto[index],
          monthlyBudget: parseFloat(data.monthlyBudget).toLocaleString(),
          percentageIncrease: porcentaje,
          totalBudget: (
            this.data.duracion * parseFloat(data.monthlyBudget)
          ).toLocaleString(),
        };
      }
    });
  }
  onEnterPressedPorcentaje(item: any) {
    if (item.percentageIncrease > 100) return;
    // Obtén el valor original de monthlyBudget (asegúrate de que sea un número)
    const monthlyBudgetOriginal = parseFloat(
      item.monthlyBudgetFormet.replace(/,/g, '')
    );

    // Obtén el porcentaje de aumento (asegúrate de que sea un número)
    const percentageIncrease = parseFloat(item.percentageIncrease);

    if (isNaN(monthlyBudgetOriginal) || isNaN(percentageIncrease)) {
      // Maneja valores no válidos
      return;
    }

    // Calcula el nuevo valor de monthlyBudget aplicando el porcentaje de aumento
    const newmonthlyBudget =
      monthlyBudgetOriginal * (1 + percentageIncrease / 100);

    // Aquí puedes hacer lo que necesites con monthlyBudgetFormet
    // Por ejemplo, llenar el objeto que se enviará en el POST
    const data = {
      id: item.id,
      applicationUserId: this.applicationUserId,
      monthlyBudget: newmonthlyBudget,
    };

    this.apiRequestS
      .onPost(`Presupuesto/UpdateAccount/`, data)
      .then((responseData: boolean) => {
        // Cuando se actualiza el elemento con éxito, buscar su índice en la matriz
        const index = this.data.budgetDetailDto.findIndex(
          (existingItem) => existingItem.id === data.id
        );

        if (index !== -1) {
          // Actualiza el elemento en la matriz
          this.data.budgetDetailDto[index] = {
            ...this.data.budgetDetailDto[index],
            monthlyBudget: newmonthlyBudget.toLocaleString(),
            percentageIncrease: percentageIncrease.toFixed(2) + '%',
            totalBudget: (
              this.data.duracion * newmonthlyBudget
            ).toLocaleString(),
          };
        }
      });
  }

  onModalOrdenesCompraCedula(
    presupuestoAnteriorDetalleId: number,
    presupuestoAnteriorId: number
  ) {
    this.dialogHandlerS
      .openDialog(
        OrdenesCompraCedulaListComponent,
        {
          partidaPresupuestalId: presupuestoAnteriorDetalleId,
          cedulaPresupuestalId: presupuestoAnteriorId,
        },
        'Ordenes de Compra',
        this.dialogHandlerS.dialogSizeFull
      )
      .then((responseData: boolean) => {
        if (responseData) this.onLoadData();
      });
  }

  private PorcentajeAumento(
    nuevoValor: string,
    originalValor: string | null
  ): string {
    // Elimina comas de los valores y convierte a números
    const nuevoValorNumero = parseFloat(nuevoValor.replace(/,/g, ''));

    const originalValorNumero = parseFloat(originalValor.replace(/,/g, ''));

    if (
      isNaN(nuevoValorNumero) ||
      isNaN(originalValorNumero) ||
      originalValorNumero === 0
    ) {
      return 'N/A'; // Maneja valores no válidos o cero
    }

    const aumento = nuevoValorNumero - originalValorNumero;
    const porcentajeAumento = (aumento / originalValorNumero) * 100;

    return porcentajeAumento.toFixed(2) + '%';
  }
}
