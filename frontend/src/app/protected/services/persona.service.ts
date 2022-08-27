import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment.prod';
import { Respuesta, Persona, Personas, actualizarCorreoFoto } from '../../auth/interfaces/interfaces';
@Injectable({
  providedIn: 'root'
})
export class PersonaService {

  private baseUrl = `${environment.baseUrl}/api`;
  constructor(private http: HttpClient) { }
  getHeader() {
    const token = localStorage.getItem('token') || '';
    return {
      headers: new HttpHeaders({
        'Authorization': `${token}`
      })
    };
  }
  getEstudiantes (size:number=5,offset:number=0) {
    const url = `${this.baseUrl}/estudiantes/listar`;
    const body = {
      length: size,
      start: offset,
    }
    return this.http.post<Personas>(url, body,this.getHeader());
  }
  guardarEstudiante(persona:Persona){
    const url = `${this.baseUrl}/estudiantes/guardar`;
    return this.http.post<Respuesta>(url,persona,this.getHeader());
  }
  editarEstudiante(persona:Persona){
    const url = `${this.baseUrl}/estudiantes/editar`;
    return this.http.post<Respuesta>(url,persona,this.getHeader());
  }
  eliminarEstudiante(id:number){
    const url = `${this.baseUrl}/estudiantes/eliminar`;
    return this.http.post<Respuesta>(url,{id},this.getHeader());
  }
  editarEstudianteFotoCorreo(data:FormData){
    const url = `${this.baseUrl}/estudiantes/correoFoto/editar`;
    return this.http.post<Respuesta>(url,data,this.getHeader());
  }
}
