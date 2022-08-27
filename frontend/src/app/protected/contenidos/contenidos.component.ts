import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Contenido, Contenidos, Respuesta, Cursos, Curso, eliminarContenido } from '../../auth/interfaces/interfaces';
import { CursosService } from '../services/cursos.service';
import { ContenidosService } from '../services/contenidos.service';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import Swal from 'sweetalert2';
declare var window: any;
@Component({
  selector: 'app-contenidos',
  templateUrl: './contenidos.component.html',
  styleUrls: ['./contenidos.component.css']
})
export class ContenidosComponent implements OnInit {

  constructor(
    private fb:FormBuilder,
    private contenidosService:ContenidosService,
    private cursosService:CursosService
  ) { }
  page_size      : number     = 5;
  page_number    : number     = 1;
  pageSizeOptions: number[]   = [5, 10, 25, 100];
  total          : number     = 0;
  total_pages    : number     = 0;
  cargando       : boolean    = false;
  editarContenido: boolean    = false;
  idContenido?   : number     = 0;
  contenidos     : Contenido[]= [];
  cursos         : Curso[]    = [];
  archivo        : any;
  modalNuevoContenido:any;
   //DATA SOURCE
  dataSource = new MatTableDataSource<Contenido>();
  //mostrar el nombre de la columna
  displayedColumns: string[] = [
    'id',
    'cursoNombre',
    'tema',
    'status',
    'acciones'
  ];

  formNuevoContenido:FormGroup=this.fb.group({
    curso: ['',[Validators.required]],
    tema: ['',[Validators.required]],
    descripcion: ['',[Validators.required]],
    archivo: ['',],
    status: ['',[Validators.required]],

  });
  onPageChange(e: PageEvent) {
    this.page_size = e.pageSize;
    this.page_number = e.pageIndex + 1;
  }
  //metodo para cargar los datos en la tabla al iniciar la pagina
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.cargarSelectorCursos();
  }
  ngOnInit(): void {
    this.cargando=true;
    this.cargarDatos();
    setTimeout(() => {
      this.modalNuevoContenido= new window.bootstrap.Modal(document.getElementById('nuevoContenido'));
    }, 1000);
  }
  cargarDatos(){
    this.contenidosService.getContenidos().subscribe(
      (data:Contenidos)=>{
        this.dataSource.data=data.contenidos;
        this.total=data.total;
        this.cargando=false;
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
  save(){
    if(!this.formNuevoContenido.valid){
      return Object.values(this.formNuevoContenido.controls).forEach(control=>{
        control.markAsTouched();
      });
    }
    this.cargando=true;
    if(!this.editarContenido){
      let data=new FormData();
      data.append('curso',this.formNuevoContenido.value.curso);
      data.append('tema',this.formNuevoContenido.value.tema);
      data.append('descripcion',this.formNuevoContenido.value.descripcion);
      data.append('status',this.formNuevoContenido.value.status);
      data.append('archivo',this.archivo);
      /* this.contenidosService.guardar(data) */
      this.contenidosService.guardar(data).subscribe(
        (data:Respuesta)=>{
          if(data.status==200){
            this.cargarDatos();
            this.formNuevoContenido.reset();
            Swal.fire('Guardado',data.message,'success');
            this.modalNuevoContenido.hide();
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
      let data=new FormData();
      data.append('curso',this.formNuevoContenido.value.curso);
      data.append('tema',this.formNuevoContenido.value.tema);
      data.append('descripcion',this.formNuevoContenido.value.descripcion);
      data.append('status',this.formNuevoContenido.value.status);
      data.append('archivo',this.archivo);
      data.append('id',this.idContenido!.toString());
      this.contenidosService.editar(data).subscribe(
        (data:Respuesta)=>{
          if(data.status==200){
            this.cargarDatos();
            Swal.fire('Guardado',data.message,'success');
            this.editarContenido=false;
            this.modalNuevoContenido.hide();
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
  edit(contenido:Contenido){
    this.formNuevoContenido.reset();
    this.formNuevoContenido.patchValue({
      curso:contenido.curso,
      tema:contenido.tema,
      descripcion:contenido.descripcion,
      status:contenido.status
    });
    this.idContenido=contenido.id;
    this.editarContenido=true;
    this.modalNuevoContenido.show();
  }
  delete(contenido: eliminarContenido) {
    console.log(contenido.id);
    Swal.fire({
      title: '¿Desea eliminar el contenido?',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.cargando=true;
        let data=new FormData();
        data.append('id',contenido.id.toString());
        data.append('idContenidoDocumento',contenido.idContenidoDocumento!.toString());
        data.append('idDocumento',contenido.idDocumento!.toString());
        this.contenidosService.eliminar(data).subscribe(
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
  clearformNuevoContenido(){
    this.formNuevoContenido.reset();
    this.editarContenido=false;
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  fileChange(event: any) {
    const file = event.target.files[0];
    this.archivo = file;
  }
}
