import { environment } from './../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthResponse, Usuario, TokenResponse, TokenPayload } from '../interfaces/interfaces';
import { FormGroup } from '@angular/forms';
import { catchError, map, of, tap, Observable } from 'rxjs';
import jwt_decode from "jwt-decode";
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = environment.baseUrl;
  private _usuario!:Usuario;
  get usuario(){
    return {...this._usuario};
  }
  constructor(private http:HttpClient) {}
  login(formulario:FormGroup){
    //
    const url = `${this.baseUrl}/login`;
    const body = {
      username: formulario.value.username,
      password: formulario.value.password
    };
    return this.http.post<AuthResponse>(url,body)
    .pipe(
      tap(resp => {
        if(resp.ok){
          localStorage.setItem('token',resp.token!);
          this._usuario = {
            idUsuario:          resp.idUsuario,
            correo:             resp.correo,
            idPersona:          resp.idPersona,
            nombres:            resp.nombres,
            apellidos:          resp.apellidos,
            identificacion:     resp.identificacion,
            foto:               resp.foto,
            tipoIdentificacion: resp.tipoIdentificacion,
            nombreRol:          resp.nombreRol,
            idRol:              resp.idRol,

          };
          sessionStorage.setItem('user',JSON.stringify(this._usuario));
        }
      }),
      map(resp=>resp.ok),
      catchError(err=>of(err.error.msg))
    );

  }
  validarToken(){
    //obtener token del localStorage
    const token = localStorage.getItem('token') || '';
    //si el token es nulo, devolver false
    if(token.length<=0){
      return false;
    }
    //si el token no ha expirado, devolver true
    const payload = this.obtenerDatosToken(token);

    const expira = payload.exp;
    const ahora = new Date().getTime()/1000;
    if(ahora>expira!){
      return false;
    }
    return true;
  }
  private obtenerDatosToken(token:string){
    const payload:TokenPayload = jwt_decode(token);
    return payload;
  }
  logout(){

    localStorage.clear();
    sessionStorage.clear();
  }
}
