import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment.prod';
import { Matricula, Respuesta, Matriculas, Cursos } from '../../auth/interfaces/interfaces';
@Injectable({
  providedIn: 'root'
})
export class MatriculaService {
  private baseUrl = `${environment.baseUrl}/api/matriculas`;
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
  getMatriculas (size:number=10,offset:number=0) {
    const url = `${this.baseUrl}/listar`;
    const body = {
      length: size,
      start: offset,
    }
    return this.http.post<Matriculas>(url, body,this.getHeader());
  }
  guardar(matricula:Matricula){
    const url = `${this.baseUrl}/guardar`;
    return this.http.post<Respuesta>(url,matricula,this.getHeader());
  }
  editar(matricula:Matricula){
    const url = `${this.baseUrl}/editar`;
    return this.http.post<Respuesta>(url,matricula,this.getHeader());
  }
  eliminar(id:number){
    const url = `${this.baseUrl}/eliminar`;
    return this.http.post<Respuesta>(url,{id},this.getHeader());
  }
  getCursos (idPersona:number=0) {
    const url = `${this.baseUrl}/cursos/listar`;
    const body = {
      idPersona:idPersona
    }
    return this.http.post<Cursos>(url, body,this.getHeader());
  }
}
