import { Injectable } from '@angular/core';
import {  CanActivate, CanLoad, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ValidarRolGuard implements CanActivate, CanLoad {
  constructor(private router:Router) {}
  canActivate(): Observable<boolean> | boolean {
    //Validar que el usuario tenga el rol correspondiente
    const user = JSON.parse(sessionStorage.getItem('user')!)|| '';
    if(user==''){
      this.router.navigateByUrl('/auth');
      return false;
    }
    if(user.nombreRol!='ADMINISTRADOR'){
      sessionStorage.clear();
      this.router.navigateByUrl('/auth');
      return false;
    }
    return true;
  }
  canLoad(): Observable<boolean> | boolean{
    //Validar que el usuario tenga el rol correspondiente
    const user = JSON.parse(sessionStorage.getItem('user')!)|| '';
    if(user==''){
      this.router.navigateByUrl('/auth');
      return false;
    }
    if(user.nombreRol!='ADMINISTRADOR'){
      this.router.navigateByUrl('/auth');
      return false;
    }
    return true;
  }
}
