import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PersonaService } from '../../protected/services/persona.service';
import { Respuesta } from '../../auth/interfaces/interfaces';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  cargando       : boolean    = false;
  archivo        : any;
  user=JSON.parse(sessionStorage.getItem('user')!);
  constructor(
    private fb:FormBuilder,
    private personaService:PersonaService
  ) { }

  ngOnInit(): void {
  }
  actualizarUsuario:FormGroup=this.fb.group({
    correo: [this.user.correo,[Validators.required]]
  });
  actualizar(){
    if(!this.actualizarUsuario.valid){
      return Object.values(this.actualizarUsuario.controls).forEach(control=>{
        control.markAsTouched();
      });
    }
    this.cargando=true;
    let data = new FormData();
    data.append('correo',this.actualizarUsuario.value.correo);
    data.append('foto',this.archivo);
    data.append('id',this.user.idPersona);
    data.append('idUsuario',this.user.idUsuario);
    this.personaService.editarEstudianteFotoCorreo(data).subscribe(
      (data:Respuesta)=>{
        if(data.status==200){
          this.user.correo=this.actualizarUsuario.value.correo;
          this.user.foto=data.foto;
          sessionStorage.setItem('user',JSON.stringify(this.user));
          this.cargando=false;
          Swal.fire('Guardado',data.message,'success');
        }
        if(data.status==404){
          Swal.fire('Error',data.message,'error');
        }
        this.cargando=false;
      },(error)=>{
        console.log(error);
        Swal.fire('Error',error.error.message,'error');
      }
    );

  }
  fileChange(event: any) {
    const file = event.target.files[0];
    this.archivo = file;
  }

}
