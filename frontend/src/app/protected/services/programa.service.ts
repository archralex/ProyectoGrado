import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Programas, Programa, Respuesta } from '../../auth/interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ProgramaService {
  private baseUrl = `${environment.baseUrl}/api/programas`;
  constructor(private http: HttpClient) { }
  getHeader() {
    const token = localStorage.getItem('token') || '';
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `${token}`
      })
    };
  }
  getProgramas (size:number=10,offset:number=0) {
    const url = `${this.baseUrl}/listar`;
    const body = {
      length: size,
      start: offset,
    }
    return this.http.post<Programas>(url, body,this.getHeader());
  }
  guardar(programa:Programa){
    const url = `${this.baseUrl}/guardar`;
    return this.http.post<Respuesta>(url,programa,this.getHeader());
  }
  editar(programa:Programa){
    const url = `${this.baseUrl}/editar`;
    return this.http.post<Respuesta>(url,programa,this.getHeader());
  }
  eliminar(id:number){
    const url = `${this.baseUrl}/eliminar`;
    return this.http.post<Respuesta>(url,{id},this.getHeader());
  }
}
