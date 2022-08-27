import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator,PageEvent } from '@angular/material/paginator';
import Swal from 'sweetalert2'

import { Persona, Personas, Respuesta, Programa, Programas } from '../../auth/interfaces/interfaces';
import { PersonaService } from '../services/persona.service';
import { ProgramaService } from '../services/programa.service';
declare var window: any;

@Component({
  selector: 'app-estudiantes',
  templateUrl: './estudiantes.component.html',
  styleUrls: ['./estudiantes.component.css']
})
export class EstudiantesComponent implements OnInit,AfterViewInit {
  constructor(
    private fb:FormBuilder,
    private personaService:PersonaService,
    private programasService:ProgramaService
  ) { }
  page_size      : number     = 5;
  page_number    : number     = 1;
  pageSizeOptions: number[]   = [5, 10, 25, 100];
  total          : number     = 0;
  total_pages    : number     = 0;
  cargando       : boolean    = false;
  editarPersona  : boolean    = false;
  idEstudiante?  : number     = 0;
  programas      : Programa[] = [];
  modalNuevoEstudiante:any;
   //DATA SOURCE
  dataSource = new MatTableDataSource<Persona>();
  //mostrar el nombre de la columna
  displayedColumns: string[] = [
    'id',
    'tipoId',
    'identificacion',
    'nombres',
    'apellidos',
    'celular',
    'nombrePrograma',
    'acciones'
  ];

  formNuevoEstudiante:FormGroup=this.fb.group({
    tipoId: ['',[Validators.required]],
    identificacion: ['',[Validators.required]],
    nombres: ['',[Validators.required]],
    apellidos: ['',[Validators.required]],
    celular: ['',[Validators.required]],
    programa: ['',[Validators.required]],

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
    this.cargarSelector();
  }
  ngOnInit(): void {
    this.cargando=true;
    this.cargarDatos();
    setTimeout(() => {
      this.modalNuevoEstudiante= new window.bootstrap.Modal(document.getElementById('nuevoEstudiante'));
    }, 1000);
  }
  cargarDatos(){
    this.personaService.getEstudiantes().subscribe(
      (data:Personas)=>{
        this.dataSource.data=data.personas;
        this.total=data.total;
        this.cargando=false;
      }
    );
  }
  cargarSelector(){
    this.programasService.getProgramas().subscribe(
      (data:Programas)=>{
        this.programas=data.programas;
      }
    );
  }
  save(){
    if(!this.formNuevoEstudiante.valid){
      return Object.values(this.formNuevoEstudiante.controls).forEach(control=>{
        control.markAsTouched();
      });
    }
    this.cargando=true;
    if(!this.editarPersona){
      this.personaService.guardarEstudiante(this.formNuevoEstudiante.value).subscribe(
        (data:Respuesta)=>{
          if(data.status==200){
            this.cargarDatos();
            this.formNuevoEstudiante.reset();
            Swal.fire('Guardado',data.message,'success');
            this.modalNuevoEstudiante.hide();
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
      let data=this.formNuevoEstudiante.value;
      data.id=this.idEstudiante;
      this.personaService.editarEstudiante(data).subscribe(
        (data:Respuesta)=>{
          if(data.status==200){
            this.cargarDatos();
            Swal.fire('Guardado',data.message,'success');
            this.editarPersona=false;
            this.modalNuevoEstudiante.hide();
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
  edit(estudiante:Persona){
    this.formNuevoEstudiante.reset();
    this.formNuevoEstudiante.patchValue({
      tipoId:estudiante.idTipo,
      identificacion:estudiante.identificacion,
      nombres:estudiante.nombres,
      apellidos:estudiante.apellidos,
      celular:estudiante.celular,
      programa:estudiante.programa

    });
    this.idEstudiante=estudiante.id;
    this.editarPersona=true;
    this.modalNuevoEstudiante.show();
  }
  delete(id: number) {
    console.log(id);
    Swal.fire({
      title: '¿Desea eliminar el estudiante?',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.cargando=true;
        this.personaService.eliminarEstudiante(id!).subscribe(
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
  clearFormNuevoEstudiante(){
    this.formNuevoEstudiante.reset();
    this.editarPersona=false;
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}

