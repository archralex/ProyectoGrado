import { environment } from '../../../environments/environment.prod';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Contenidos, Contenido, Respuesta } from '../../auth/interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ContenidosService {

  private baseUrl = `${environment.baseUrl}/api/contenidos`;
  constructor(private http: HttpClient) { }
  getHeader() {
    const token = localStorage.getItem('token') || '';
    return {
      headers: new HttpHeaders({
        'Authorization': `${token}`
      })
    };
  }
  getContenidos (size:number=10,offset:number=0) {
    const url = `${this.baseUrl}/listar`;
    const body = {
      length: size,
      start: offset,
    }
    return this.http.post<Contenidos>(url, body,this.getHeader());
  }
  getContenidosPorCurso (curso:number) {
    const url = `${this.baseUrl}/temas/listar`;
    const body = {
      curso: curso,
    }
    return this.http.post<Contenidos>(url, body,this.getHeader());
  }
  guardar(contenido:FormData){
    const url = `${this.baseUrl}/guardar`;
    return this.http.post<Respuesta>(url,contenido,this.getHeader());
  }
  editar(contenido:FormData){
    const url = `${this.baseUrl}/editar`;
    return this.http.post<Respuesta>(url,contenido,this.getHeader());
  }
  eliminar(data:FormData){
    const url = `${this.baseUrl}/eliminar`;
    return this.http.post<Respuesta>(url,data,this.getHeader());
  }
}
