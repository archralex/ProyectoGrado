import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthService } from '../auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ValidarTokenGuard implements CanActivate, CanLoad {
  constructor(private authService:AuthService,private router:Router) {}
  canActivate(): Observable<boolean> | boolean {
    //obtener token del localStorage
    const token = localStorage.getItem('token') || '';
    //si el token es nulo, redirigir al login
    if(token.length<=0){
      this.router.navigateByUrl('/auth');
      return false;
    }
    //validar que el token no haya expirado
    const esvalido = this.authService.validarToken();
    if(!esvalido){
      this.router.navigateByUrl('/auth');
      return false;
    }
    //si el token es valido, retornar true
    return true;
  }
  canLoad(): Observable<boolean> | boolean {
    //obtener token del localStorage
    const token = localStorage.getItem('token') || '';
    //si el token es nulo, redirigir al login
    if(token.length<=0){
      this.router.navigateByUrl('/auth');
      return false;
    }
    //validar que el token no haya expirado
    const esvalido = this.authService.validarToken();
    if(!esvalido){
      this.router.navigateByUrl('/auth');
      return false;
    }
    //si el token es valido, retornar true
    return true;
  }
}
