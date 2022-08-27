import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment.prod';
import { Curso, Cursos, Respuesta, Asociacion, EditCursoAsociacion } from '../../auth/interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class CursosService {
  private baseUrl = `${environment.baseUrl}/api/cursos`;
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
  getCursos (size:number=5,offset:number=0) {
    const url = `${this.baseUrl}/listar`;
    const body = {
      length: size,
      start: offset,
    }
    return this.http.post<Cursos>(url, body,this.getHeader());
  }
  guardarCurso(curso:Curso){
    const url = `${this.baseUrl}/guardar`;
    return this.http.post<Respuesta>(url,curso,this.getHeader());
  }
  guardarAsociacion(asociacion:Asociacion){
    const url = `${this.baseUrl}/asociacion/guardar`;
    return this.http.post<Respuesta>(url,asociacion,this.getHeader());
  }
  editarCurso(curso:Curso){
    const url = `${this.baseUrl}/editar`;
    return this.http.post<Respuesta>(url,curso,this.getHeader());
  }
  editarAsociacion(curso:EditCursoAsociacion){
    const url = `${this.baseUrl}/asociacion/editar`;
    return this.http.post<Respuesta>(url,curso,this.getHeader());
  }
  eliminarCurso(id:number){
    const url = `${this.baseUrl}/eliminar`;
    return this.http.post<Respuesta>(url,{id},this.getHeader());
  }
  eliminarAsociacion(id:number){
    const url = `${this.baseUrl}/asociacion/eliminar`;
    return this.http.post<Respuesta>(url,{id},this.getHeader());
  }
  obtenerCursos(size:number=5,offset:number=0){
    const url = `${this.baseUrl}/obtener/cursos`;
    const body = {
      length: size,
      start: offset,
    }
    return this.http.post<Cursos>(url,body,this.getHeader());
  }

}
