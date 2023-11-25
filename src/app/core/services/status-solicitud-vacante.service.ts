import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StatusSolicitudVacanteService {
  private positionRequestId: number | null = null;
  private employeeId: number | null = null;
  private workPositionId: number | null = null;
  // Método para agregar el positionRequestId
  public setPositionRequestId(id: number): void {
    this.positionRequestId = id;
  }

  // Método para extraer el positionRequestId
  public getPositionRequestId(): number | null {
    return this.positionRequestId;
  }

  // Método para agregar el employeeId
  public setemployeeId(id: number): void {
    this.employeeId = id;
  }

  // Método para extraer el employeeId
  public getemployeeId(): number | null {
    return this.employeeId;
  }

  // Método para agregar el workPositionId
  public setworkPositionId(id: number): void {
    this.workPositionId = id;
  }

  // Método para extraer el workPositionId
  public getworkPositionId(): number | null {
    return this.workPositionId;
  }
}
