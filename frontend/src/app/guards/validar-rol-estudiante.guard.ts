import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ValidarRolEstudianteGuard implements CanActivate, CanLoad {
  constructor(private router:Router) {}
  canActivate(): Observable<boolean> | boolean {
    //Validar que el usuario tenga el rol correspondiente
    const user = JSON.parse(sessionStorage.getItem('user')!)|| '';
    if(user==''){
      this.router.navigateByUrl('/auth');
      return false;
    }
    if(user.nombreRol!='ESTUDIANTE'){
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
    if(user.nombreRol!='ESTUDIANTE'){
      this.router.navigateByUrl('/auth');
      return false;
    }
    return true;
  }
}
