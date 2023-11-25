import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const urlBase = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private http = inject(HttpClient);

  /**
   * Realiza una solicitud GET al servidor.
   * @param url La URL del recurso.
   * @param httpParams Los parámetros de la solicitud HTTP (opcional).
   * @returns Un observable que emite una respuesta HTTP con datos de tipo T.
   */
  get<T>(url: string, httpParams?: any): Observable<HttpResponse<T>> {
    const httpHeaders: HttpHeaders = this.getHeaders();
    return this.http.get<T>(urlBase + url, {
      headers: httpHeaders,
      params: httpParams,
      observe: 'response',
    });
  }

  /**
   * Realiza una solicitud GET al servidor para obtener un archivo (por ejemplo, una imagen o un archivo PDF).
   * @param url La URL del recurso.
   * @param httpParams Los parámetros de la solicitud HTTP (opcional).
   * @returns Un observable que emite un objeto Blob representando el archivo.
   */
  getFile(url: string, httpParams?: any): Observable<Blob> {
    const httpHeaders: HttpHeaders = this.getHeaders();
    return this.http.get<Blob>(urlBase + url, {
      headers: httpHeaders,
      params: httpParams,
      responseType: 'blob' as 'json', // Especificar el tipo de respuesta como 'blob'.
    });
  }

  /**
   * Realiza una solicitud POST al servidor.
   * @param url La URL del recurso.
   * @param data Los datos a enviar en el cuerpo de la solicitud.
   * @returns Un observable que emite una respuesta HTTP con datos de tipo T.
   */
  post<T>(url: string, data: any): Observable<HttpResponse<T>> {
    const httpHeaders: HttpHeaders = this.getHeaders();
    return this.http.post<T>(urlBase + url, data, {
      headers: httpHeaders,
      observe: 'response',
    });
  }

  /**
   * Realiza una solicitud PUT al servidor.
   * @param url La URL del recurso.
   * @param data Los datos a enviar en el cuerpo de la solicitud.
   * @returns Un observable que emite una respuesta HTTP con datos de tipo T.
   */
  put<T>(url: string, data: any): Observable<HttpResponse<T>> {
    const httpHeaders: HttpHeaders = this.getHeaders();
    return this.http.put<T>(urlBase + url, data, {
      headers: httpHeaders,
      observe: 'response',
    });
  }

  /**
   * Realiza una solicitud DELETE al servidor.
   * @param url La URL del recurso.
   * @param params Los parámetros de la solicitud HTTP (opcional).
   * @returns Un observable que emite una respuesta HTTP con datos de tipo T.
   */
  delete<T>(url: string, params?: any): Observable<HttpResponse<T>> {
    const httpHeaders: HttpHeaders = this.getHeaders();
    return this.http.delete<T>(urlBase + url, {
      headers: httpHeaders,
      observe: 'response',
    });
  }

  /**
   * Obtiene las cabeceras HTTP para la solicitud.
   * @returns Un objeto HttpHeaders con las cabeceras de la solicitud.
   */
  getHeaders(): HttpHeaders {
    let httpHeaders: HttpHeaders = new HttpHeaders();

    // Aquí puedes agregar la lógica para incluir el token de autenticación si es necesario.
    // const token = this.securityService.getToken();
    // if (token) {
    //   httpHeaders = httpHeaders.append('Authorization', 'Bearer ' + token);
    // }

    return httpHeaders;
  }
}
