import { AfterViewInit,Component, OnInit,ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';

import { Curso, Cursos, Programa, Programas, Respuesta, CursoAsociacion } from '../../auth/interfaces/interfaces';
import { CursosService } from '../services/cursos.service';
import { ProgramaService } from '../services/programa.service';
declare var window: any;
@Component({
  selector: 'app-cursos',
  templateUrl: './cursos.component.html',
  styleUrls: ['./cursos.component.css']
})

export class CursosComponent implements OnInit,AfterViewInit  {
  page_size      : number     = 5;
  page_number    : number     = 1;
  pageSizeOptions: number[]   = [5, 10, 25, 100];
  total          : number     = 0;
  total_pages    : number     = 0;
  programas      : Programa[] = [];
  cursos         : Curso[]    = [];
  editar         : boolean    = false;
  idAsociacion?  : number     = 0;
  editarCurso    : boolean    = false;
  idCurso?       : number     = 0;
  cargando       : boolean    = false;
  modalNuevoCurso:any;
  constructor(
    private fb:FormBuilder,
    private cursosService:CursosService,
    private programasService:ProgramaService
  ) { }
  //DATA SOURCE
  dataSource = new MatTableDataSource<Curso>();
  //mostrar el nombre de la columna
  displayedColumns: string[] = ['id', 'nombre', 'programa', 'acciones'];
  //metodo para cargar los datos en la tabla al iniciar la pagina
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  cargarDatos(){
    this.cursosService.getCursos().subscribe(
      (data:Cursos)=>{
        this.dataSource.data=data.curso;
        this.total=data.total;
        this.cargando=false;
      }
    );
  }

  onPageChange(e: PageEvent) {
    this.page_size = e.pageSize;
    this.page_number = e.pageIndex + 1;
  }
  cargarSelector(){
    this.programasService.getProgramas().subscribe(
      (data:Programas)=>{
        this.programas=data.programas;
      }
    );
  }
  cargarSelectorCursos(){
    this.cursosService.obtenerCursos().subscribe(
      (data:Cursos)=>{
        this.cursos=data.curso;
      }
    );
  }
  formNuevoCurso:FormGroup=this.fb.group({
    nombre: ['',[Validators.required,Validators.minLength(4)]],
    descripcion: ['',[Validators.required]],

  });
  formNuevaAsociacion:FormGroup=this.fb.group({
    curso:['',[Validators.required]],
    programa: ['',[Validators.required]],
  });
  actualizarDatos(size:number,page:number) {
    this.cursosService.getCursos(size,page).subscribe(
      (data:Cursos)=>{
        this.dataSource.data=data.curso;
      }
    );
  }
  ngOnInit(): void {
    this.cargando=true;
    this.cargarDatos();
    //esperar a que se cargue el dom
    setTimeout(() => {
      this.modalNuevoCurso= new window.bootstrap.Modal(document.getElementById('nuevoCurso'));
    }, 1000);

  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.cargarSelector();
    this.cargarSelectorCursos();
  }
  saveAsociacion(){
    if(!this.formNuevaAsociacion.valid){
      return Object.values(this.formNuevaAsociacion.controls).forEach(control=>{
        control.markAsTouched();
      });
    }
    this.cargando=true;
    if(!this.editar){
      this.cursosService.guardarAsociacion(this.formNuevaAsociacion.value).subscribe(
        (data:Respuesta)=>{
          console.log(data.status);
          if(data.status==200){
            this.cargarDatos();
            this.formNuevaAsociacion.reset();
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
    }else{
      let data=this.formNuevaAsociacion.value;
      data.id=this.idAsociacion;
      this.cursosService.editarAsociacion(data).subscribe(
        (data:Respuesta)=>{
          console.log(data.status);
          if(data.status==200){
            this.cargarDatos();
            this.formNuevaAsociacion.reset();
            Swal.fire('Guardado',data.message,'success');
            this.editar=false;
          }
          if(data.status==404){
            Swal.fire('Error',data.message,'error');
          }
          this.cargando=false;
        },(error)=>{
          console.log(error);
          this.cargando=false;
          Swal.fire('Error',error.error.message,'error');
        }
      );
    }
  }
  save(){
    if(!this.formNuevoCurso.valid){
      return Object.values(this.formNuevoCurso.controls).forEach(control=>{
        control.markAsTouched();
      });
    }
    this.cargando=true;
    if(!this.editarCurso){
    this.cursosService.guardarCurso(this.formNuevoCurso.value).subscribe(
      (data:Respuesta)=>{
        if(data.status==200){
          this.cargarDatos();
          this.cargarSelectorCursos();
          this.formNuevoCurso.reset();
          this.modalNuevoCurso.hide();
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
    }else{
      let data=this.formNuevoCurso.value;
      data.id=this.idCurso;
      this.cursosService.editarCurso(data).subscribe(
        (data:Respuesta)=>{
          if(data.status==200){
            this.cargarDatos();
            this.cargarSelectorCursos();
            this.modalNuevoCurso.hide();
            Swal.fire('Guardado',data.message,'success');
            this.formNuevoCurso.reset();
            this.editarCurso=false;
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
  edit(curso:Curso){
    this.formNuevoCurso.reset();
    this.formNuevoCurso.patchValue({
      nombre:curso.nombre,
      descripcion:curso.descripcion
    });
    this.idCurso=curso.id;
    this.editarCurso=true;
  }
  editAsociacion(curso: CursoAsociacion) {
    console.log(curso);
    this.formNuevaAsociacion.patchValue({
      curso:curso.id,
      programa:curso.idPrograma
    });
    this.idAsociacion = curso.idCursoPrograma;
    this.editar=true;
  }
  delete(curso: CursoAsociacion) {
    console.log(curso);
    Swal.fire({
      title: '¿Desea eliminar el curso?',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.cargando=true;
        this.cursosService.eliminarCurso(curso.id!).subscribe(
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
  deleteAsociacion(curso: CursoAsociacion) {
    console.log(curso);
    Swal.fire({
      title: '¿Desea eliminar la asociación del curso?',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.cargando=true;
        this.cursosService.eliminarAsociacion(curso.idCursoPrograma!).subscribe(
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
  clearFormNuevoCurso(){
    this.formNuevoCurso.reset();
    this.editarCurso=false;
  }
  clearFormNuevaAsociacion(){
    this.formNuevaAsociacion.reset();
    this.editar=false;
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}



