import { Injectable, inject } from '@angular/core';
import { ISelectItem } from '../interfaces/select-Item.interface';
import { ApiRequestService } from './api-request.service';

@Injectable({
  providedIn: 'root',
})
export class EnumSelectService {
  apiRequestService = inject(ApiRequestService);

  async onLoadEnumList(
    nameEnum: string,
    defaultOption?: boolean
  ): Promise<ISelectItem[]> {
    const urlApi =
      defaultOption !== undefined
        ? `EnumSelectItem/${nameEnum}/${defaultOption}`
        : `EnumSelectItem/${nameEnum}`;

    try {
      return await this.apiRequestService.onGetList(urlApi);
    } catch (error) {
      console.error(`Error al obtener ${nameEnum}:`, error);
      return [];
    }
  }

  async onLoadSelectList(nameEnum: string): Promise<ISelectItem[]> {
    const urlApi = `${nameEnum}`;

    try {
      return await this.apiRequestService.onGetSelectItem(urlApi);
    } catch (error) {
      console.error(`Error al obtener ${nameEnum}:`, error);
      return [];
    }
  }

  boolYesNo(): Promise<ISelectItem[]> {
    return this.onLoadSelectList('BoolYesNo');
  }
  areaMinutasDetalles(defaultOption?: boolean): Promise<ISelectItem[]> {
    return this.onLoadEnumList('EAreaMinutasDetalles', defaultOption);
  }

  departament(defaultOption?: boolean): Promise<ISelectItem[]> {
    return this.onLoadEnumList('EDepartament', defaultOption);
  }

  areaOrganigrama(defaultOption?: boolean): Promise<ISelectItem[]> {
    return this.onLoadEnumList('EAreaOrganigrama', defaultOption);
  }

  assetCategory(defaultOption?: boolean): Promise<ISelectItem[]> {
    return this.onLoadEnumList('EAssetCategory', defaultOption);
  }

  bloodType(defaultOption?: boolean): Promise<ISelectItem[]> {
    return this.onLoadEnumList('EBloodType', defaultOption);
  }

  companyArea(defaultOption?: boolean): Promise<ISelectItem[]> {
    return this.onLoadEnumList('ECompanyArea', defaultOption);
  }

  educationLevel(defaultOption?: boolean): Promise<ISelectItem[]> {
    return this.onLoadEnumList('EEducationLevel', defaultOption);
  }

  extintor(defaultOption?: boolean): Promise<ISelectItem[]> {
    return this.onLoadEnumList('EExtintor', defaultOption);
  }

  frequencyType(defaultOption?: boolean): Promise<ISelectItem[]> {
    return this.onLoadEnumList('EFrequencyType', defaultOption);
  }

  fuenteReclutamiento(defaultOption?: boolean): Promise<ISelectItem[]> {
    return this.onLoadEnumList('EFuenteReclutamiento', defaultOption);
  }

  maritalStatus(defaultOption?: boolean): Promise<ISelectItem[]> {
    return this.onLoadEnumList('EMaritalStatus', defaultOption);
  }

  month(defaultOption?: boolean): Promise<ISelectItem[]> {
    return this.onLoadEnumList('EMonth', defaultOption).then(
      (months) => months.sort((a, b) => a.value - b.value) // Ordena por valor numérico
    );
  }

  permission(defaultOption?: boolean): Promise<ISelectItem[]> {
    return this.onLoadEnumList('EPermission', defaultOption);
  }

  priorityLevel(defaultOption?: boolean): Promise<ISelectItem[]> {
    return this.onLoadEnumList('EPriorityLevel', defaultOption);
  }

  recurrence(defaultOption?: boolean): Promise<ISelectItem[]> {
    return this.onLoadEnumList('ERecurrence', defaultOption);
  }

  sex(defaultOption?: boolean): Promise<ISelectItem[]> {
    return this.onLoadEnumList('ESex', defaultOption);
  }

  status(defaultOption?: boolean): Promise<ISelectItem[]> {
    return this.onLoadEnumList('EStatus', defaultOption);
  }

  tipoBaja(defaultOption?: boolean): Promise<ISelectItem[]> {
    return this.onLoadEnumList('ETipoBaja', defaultOption);
  }

  tipoGasto(defaultOption?: boolean): Promise<ISelectItem[]> {
    return this.onLoadEnumList('ETipoGasto', defaultOption);
  }

  turnoTrabajo(defaultOption?: boolean): Promise<ISelectItem[]> {
    return this.onLoadEnumList('ETurnoTrabajo', defaultOption);
  }

  typeContract(defaultOption?: boolean): Promise<ISelectItem[]> {
    return this.onLoadEnumList('ETypeContract', defaultOption);
  }

  typePiscina(defaultOption?: boolean): Promise<ISelectItem[]> {
    return this.onLoadEnumList('ETypePiscina', defaultOption);
  }

  typeMaintance(defaultOption?: boolean): Promise<ISelectItem[]> {
    return this.onLoadEnumList('ETypeMaintance', defaultOption);
  }
  typeContractRegister(defaultOption?: boolean): Promise<ISelectItem[]> {
    return this.onLoadEnumList('ETypeContractRegister', defaultOption);
  }
  typeMeeting(defaultOption?: boolean): Promise<ISelectItem[]> {
    return this.onLoadEnumList('ETypeMeeting', defaultOption);
  }
  typeStatusOrdenCompra(defaultOption?: boolean): Promise<ISelectItem[]> {
    return this.onLoadEnumList('EStatusOrdenCompra', defaultOption);
  }
  typePosicionComite(defaultOption?: boolean): Promise<ISelectItem[]> {
    return this.onLoadEnumList('EPosicionComite', defaultOption);
  }
  typeHabitant(defaultOption?: boolean): Promise<ISelectItem[]> {
    return this.onLoadEnumList('EHabitant', defaultOption);
  }
  typeTicketMessageStatus(defaultOption?: boolean): Promise<ISelectItem[]> {
    return this.onLoadEnumList('ETicketMessageStatus', defaultOption);
  }
  relationEmployee(defaultOption?: boolean): Promise<ISelectItem[]> {
    return this.onLoadEnumList('ERelationEmployee', defaultOption);
  }
  inventoryCategory(defaultOption?: boolean): Promise<ISelectItem[]> {
    return this.onLoadEnumList('EInventoryCategory', defaultOption);
  }
  state(defaultOption?: boolean): Promise<ISelectItem[]> {
    return this.onLoadEnumList('EState', defaultOption);
  }
  typePerson(defaultOption?: boolean): Promise<ISelectItem[]> {
    return this.onLoadEnumList('ETypePerson', defaultOption);
  }
  productClasificacion(defaultOption?: boolean): Promise<ISelectItem[]> {
    return this.onLoadEnumList('EProductClasificacion', defaultOption);
  }
  rolLevel(defaultOption?: boolean): Promise<ISelectItem[]> {
    return this.onLoadEnumList('ERolLevel', defaultOption);
  }
  visibilityLevel(defaultOption?: boolean): Promise<ISelectItem[]> {
    return this.onLoadEnumList('EVisibilityLevel', defaultOption);
  }
}
