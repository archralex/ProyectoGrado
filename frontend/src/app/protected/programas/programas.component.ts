import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Programa, Programas, Respuesta } from '../../auth/interfaces/interfaces';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProgramaService } from '../services/programa.service';
import Swal from 'sweetalert2';
declare var window: any;
@Component({
  selector: 'app-programas',
  templateUrl: './programas.component.html',
  styleUrls: ['./programas.component.css']
})
export class ProgramasComponent implements OnInit, AfterViewInit {
  page_size      : number     = 5;
  page_number    : number     = 1;
  pageSizeOptions: number[]   = [5, 10, 25, 100];
  total          : number     = 0;
  total_pages    : number     = 0;
  cargando       : boolean    = false;
  editarPrograma  : boolean    = false;
  idPrograma?  : number     = 0;
  programas      : Programa[] = [];
  modalNuevoPrograma:any;
  constructor(private fb:FormBuilder,
    private programaService:ProgramaService,
    ) { }
   //DATA SOURCE
   dataSource = new MatTableDataSource<Programa>();
   //mostrar el nombre de la columna
   displayedColumns: string[] = [
     'id',
     'nombre',
     'status',
     'acciones'
   ];
   formNuevoPrograma:FormGroup=this.fb.group({
    nombre: ['',[Validators.required]],
    status: ['',[Validators.required]],

  });
  ngOnInit(): void {
    this.cargando=true;
    this.cargarDatos();
    setTimeout(() => {
      this.modalNuevoPrograma= new window.bootstrap.Modal(document.getElementById('nuevoPrograma'));
    }, 1000);
  }
  cargarDatos(){
    this.programaService.getProgramas().subscribe(
      (data:Programas)=>{
        this.dataSource.data=data.programas;
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
    if(!this.formNuevoPrograma.valid){
      return Object.values(this.formNuevoPrograma.controls).forEach(control=>{
        control.markAsTouched();
      });
    }
    this.cargando=true;
    if(!this.editarPrograma){
      this.programaService.guardar(this.formNuevoPrograma.value).subscribe(
        (data:Respuesta)=>{
          if(data.status==200){
            this.cargarDatos();
            this.formNuevoPrograma.reset();
            Swal.fire('Guardado',data.message,'success');
            this.modalNuevoPrograma.hide();
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
      let data=this.formNuevoPrograma.value;
      data.id=this.idPrograma;
      this.programaService.editar(data).subscribe(
        (data:Respuesta)=>{
          if(data.status==200){
            this.cargarDatos();
            Swal.fire('Guardado',data.message,'success');
            this.editarPrograma=false;
            this.modalNuevoPrograma.hide();
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
  edit(programa:Programa){
    this.formNuevoPrograma.reset();
    this.formNuevoPrograma.patchValue({
      nombre:programa.nombre,
      status:programa.status,

    });
    this.idPrograma=programa.id;
    this.editarPrograma=true;
    this.modalNuevoPrograma.show();
  }
  delete(id: number) {
    Swal.fire({
      title: '¿Desea eliminar el programa?',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.cargando=true;
        this.programaService.eliminar(id!).subscribe(
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
  clearFormNuevoPrograma(){
    this.formNuevoPrograma.reset();
    this.editarPrograma=false;
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
