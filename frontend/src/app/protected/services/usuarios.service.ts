import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment.prod';
import { UsuarioLogin, Respuesta, Usuarios } from '../../auth/interfaces/interfaces';
@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private baseUrl = `${environment.baseUrl}/api/usuarios`;
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
  getUsuarios (size:number=5,offset:number=0) {
    const url = `${this.baseUrl}/listar`;
    const body = {
      length: size,
      start: offset,
    }
    return this.http.post<Usuarios>(url, body,this.getHeader());
  }
  guardar(usuario:UsuarioLogin){
    const url = `${this.baseUrl}/guardar`;
    return this.http.post<Respuesta>(url,usuario,this.getHeader());
  }
  editar(usuario:UsuarioLogin){
    const url = `${this.baseUrl}/editar`;
    return this.http.post<Respuesta>(url,usuario,this.getHeader());
  }
  eliminar(id:number){
    const url = `${this.baseUrl}/eliminar`;
    return this.http.post<Respuesta>(url,{id},this.getHeader());
  }

}
