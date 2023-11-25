import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import { environment } from 'src/environments/environment';

// Obtenemos la URL de la configuración de entorno para SignalR
const url = environment.base_signalr;

@Injectable({
  providedIn: 'root',
})
export class SignalrcustomService {
  public hubConnection: HubConnection;

  constructor() {
    // Inicializamos el servicio SignalR
    console.log('SignalrcustomService iniciado!!!');

    // Creamos una instancia de HubConnectionBuilder
    let builder = new HubConnectionBuilder();

    // Construimos la conexión al servidor SignalR utilizando la URL especificada
    this.hubConnection = builder.withUrl(`${url}cnn`).build();

    // Iniciamos la conexión al servidor SignalR
    this.hubConnection.start();

    // Configuramos un controlador para escuchar el evento 'Nueva solicitud' y mostrarlo en la consola
    this.hubConnection.on('Nueva solicitud', (respuesta) => {
      console.log('hubConnection: ', respuesta);
    });
  }
}
