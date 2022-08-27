import { Component, OnInit, ViewChild } from '@angular/core';
import { Usuario, Usuarios, Respuesta, UsuarioNuevo } from '../../auth/interfaces/interfaces';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuariosService } from '../services/usuarios.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import Swal from 'sweetalert2';
declare var window: any;
@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  page_size        : number     = 5;
  page_number      : number     = 1;
  pageSizeOptions  : number[]   = [5, 10, 25, 100];
  total            : number     = 0;
  total_pages      : number     = 0;
  cargando         : boolean    = false;
  editarUsuario    : boolean    = false;
  idUsuario?       : number     = 0;
  usuarios         : Usuario[]  = [];
  persona   : number     = 0;
  modalNuevaUsuario:any;
  constructor(
    private fb:FormBuilder,
    private usuarioService:UsuariosService,
  ) { }
   //DATA SOURCE
   dataSource = new MatTableDataSource<Usuario>();
   //mostrar el nombre de la columna
   displayedColumns: string[] = [
     'id',
     'username',
     'nombre',
     'identificacion',
     'correo',
     'status',
     'acciones'
   ];
   formNuevoUsuario:FormGroup=this.fb.group({
    identificacion: ['',[Validators.required]],
    username: ['',[Validators.required]],
    password: ['',[Validators.required]],
    correo: ['',[Validators.required,Validators.email]],

  });
  ngOnInit(): void {
    this.cargando=true;
    this.cargarDatos();
    setTimeout(() => {
      this.modalNuevaUsuario= new window.bootstrap.Modal(document.getElementById('nuevoUsuario'));
    }, 1000);
  }
  cargarDatos(){
    this.usuarioService.getUsuarios().subscribe(
      (data:Usuarios)=>{
        this.dataSource.data=data.usuarios;
        this.total=data.total;
        this.cargando=false;
      }
    );
  }
  //metodo para cargar los datos en la tabla al iniciar la pagina
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  save(){
    if(!this.formNuevoUsuario.valid){
      return Object.values(this.formNuevoUsuario.controls).forEach(control=>{
        control.markAsTouched();
      });
    }
    this.cargando=true;
    if(!this.editarUsuario){
      this.usuarioService.guardar(this.formNuevoUsuario.value).subscribe(
        (data:Respuesta)=>{
          if(data.status==200){
            this.cargarDatos();
            this.formNuevoUsuario.reset();
            Swal.fire('Guardado',data.message,'success');
            this.modalNuevaUsuario.hide();
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
    }else{
      let data=this.formNuevoUsuario.value;
      data.id=this.idUsuario;
      data.persona=this.persona;
      this.usuarioService.editar(data).subscribe(
        (data:Respuesta)=>{
          if(data.status==200){
            this.cargarDatos();
            Swal.fire('Guardado',data.message,'success');
            this.editarUsuario=false;
            this.modalNuevaUsuario.hide();
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
  }
  edit(usuario:UsuarioNuevo){
    this.formNuevoUsuario.reset();
    this.formNuevoUsuario.patchValue({
      identificacion:usuario.identificacion,
      username:usuario.username,
      password:usuario.password,
      correo:usuario.correo,
    });
    this.idUsuario=usuario.id;
    this.persona=usuario.persona;
    this.editarUsuario=true;
    this.modalNuevaUsuario.show();
  }
  delete(id: number) {
    Swal.fire({
      title: '¿Desea eliminar el estudiante?',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.cargando=true;
        this.usuarioService.eliminar(id!).subscribe(
          (data:Respuesta)=>{
            if(data.status==200){
              this.cargarDatos();
              Swal.fire('Eliminado',data.message,'success');
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
    })
  }
  clearformNuevoUsuario(){
    this.formNuevoUsuario.reset();
    this.editarUsuario=false;
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  onPageChange(e: PageEvent) {
    this.page_size = e.pageSize;
    this.page_number = e.pageIndex + 1;
  }

}
