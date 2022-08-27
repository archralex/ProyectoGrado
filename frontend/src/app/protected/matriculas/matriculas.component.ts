import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { Matricula, Matriculas, Respuesta, Curso, Cursos } from '../../auth/interfaces/interfaces';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatriculaService } from '../services/matricula.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { CursosService } from '../services/cursos.service';
declare var window: any;
@Component({
  selector: 'app-matriculas',
  templateUrl: './matriculas.component.html',
  styleUrls: ['./matriculas.component.css']
})
export class MatriculasComponent implements OnInit, AfterViewInit {

  page_size        : number     = 5;
  page_number      : number     = 1;
  pageSizeOptions  : number[]   = [5, 10, 25, 100];
  total            : number     = 0;
  total_pages      : number     = 0;
  cargando         : boolean    = false;
  editarMatricula  : boolean    = false;
  idMatricula?     : number     = 0;
  idUsuario?       : number     = 0;
  matriculas       : Matricula[]= [];
  cursos           : Curso[]    = [];
  modalNuevaMatricula:any;
  constructor(private fb:FormBuilder,
    private matriculaService:MatriculaService,private cursosService:CursosService,) { }
   //DATA SOURCE
   dataSource = new MatTableDataSource<Matricula>();
   //mostrar el nombre de la columna
   displayedColumns: string[] = [
     'id',
     'tipoId',
     'identificacion',
     'estudiante',
     'cursoNombre',
     'status',
     'acciones'
   ];
   formNuevaMatricula:FormGroup=this.fb.group({
    curso: ['',[Validators.required]],
    identificacion: ['',[Validators.required]],

  });
  ngOnInit(): void {
    this.cargando=true;
    this.cargarDatos();
    setTimeout(() => {
      this.modalNuevaMatricula= new window.bootstrap.Modal(document.getElementById('nuevaMatricula'));
    }, 1000);
  }
  cargarDatos(){
    this.matriculaService.getMatriculas().subscribe(
      (data:Matriculas)=>{
        this.dataSource.data=data.matriculas;
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
    this.cargarSelectorCursos();
  }
  save(){
    if(!this.formNuevaMatricula.valid){
      return Object.values(this.formNuevaMatricula.controls).forEach(control=>{
        control.markAsTouched();
      });
    }
    this.cargando=true;
    if(!this.editarMatricula){
      this.matriculaService.guardar(this.formNuevaMatricula.value).subscribe(
        (data:Respuesta)=>{
          if(data.status==200){
            this.cargarDatos();
            this.formNuevaMatricula.reset();
            Swal.fire('Guardado',data.message,'success');
            this.modalNuevaMatricula.hide();
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
      let data=this.formNuevaMatricula.value;
      data.id=this.idMatricula;
      data.usuario=this.idUsuario;
      this.matriculaService.editar(data).subscribe(
        (data:Respuesta)=>{
          if(data.status==200){
            this.cargarDatos();
            Swal.fire('Guardado',data.message,'success');
            this.editarMatricula=false;
            this.modalNuevaMatricula.hide();
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
  edit(matricula:Matricula){
    this.formNuevaMatricula.reset();
    this.formNuevaMatricula.patchValue({
      curso:matricula.curso,
      identificacion:matricula.identificacion,
    });
    this.idMatricula=matricula.id;
    this.idUsuario=matricula.usuario;
    this.editarMatricula=true;
    this.modalNuevaMatricula.show();
  }
  delete(id: number) {
    Swal.fire({
      title: '¿Desea eliminar el registro?',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.cargando=true;
        this.matriculaService.eliminar(id!).subscribe(
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
  clearformNuevaMatricula(){
    this.formNuevaMatricula.reset();
    this.editarMatricula=false;
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  onPageChange(e: PageEvent) {
    this.page_size = e.pageSize;
    this.page_number = e.pageIndex + 1;
  }
  cargarSelectorCursos(){
    this.cursosService.obtenerCursos().subscribe(
      (data:Cursos)=>{
        this.cursos=data.curso;
      }
    );
  }
}
