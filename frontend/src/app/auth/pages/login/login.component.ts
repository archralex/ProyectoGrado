import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  faUser=faUser;
  hide = true;
  cargando=false;
  miFormulario:FormGroup=this.fb.group({
    username: ['',[Validators.required,Validators.minLength(4)]],
    password: ['',[Validators.required,Validators.minLength(6)]]
  });
  login(){
    console.log(this.miFormulario.value);
    this.cargando=true;
    this.authService.login(this.miFormulario)
      .subscribe(ok=>{
        console.log(ok);
        if(ok==true){
          //obtener rol del usuario de la sesion
          const user = JSON.parse(sessionStorage.getItem('user')!);
          if(user.nombreRol=='ADMINISTRADOR'){
            this.router.navigateByUrl('/dashboard');
          }if(user.nombreRol=='ESTUDIANTE'){
            this.router.navigateByUrl('/estudiante');
          }
        }else{
          Swal.fire({
            icon: 'error',
            title: "Oops...no nos pudimos autenticar",
            heightAuto: false
          });
        }
        this.cargando=false;
      });
    //this.router.navigateByUrl('/dashboard');
  }

  constructor(
    private fb:FormBuilder,
    private router:Router,
    private authService:AuthService
  ) { }


  ngOnInit(): void {
  }

}
