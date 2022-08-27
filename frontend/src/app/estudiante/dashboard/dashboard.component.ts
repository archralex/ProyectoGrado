import { Component, OnInit, ViewChild } from '@angular/core';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { FormBuilder } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Curso, Cursos, Contenido, Contenidos } from '../../auth/interfaces/interfaces';
import { MatriculaService } from '../../protected/services/matricula.service';
import { ContenidosService } from '../../protected/services/contenidos.service';
declare var window: any;
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  page_size      : number     = 5;
  page_number    : number     = 1;
  pageSizeOptions: number[]   = [5, 10, 25, 100];
  total          : number     = 0;
  total_pages    : number     = 0;
  contenidos     : Contenido[]= [];
  nombreCurso    : string     = '';
  cargando       : boolean    = false;
  modalVerCurso:any;
  user=JSON.parse(sessionStorage.getItem('user')!);
  constructor(
    private fb:FormBuilder,
    private matriculaService:MatriculaService,
    private contenidosService:ContenidosService
  ) { }
  //DATA SOURCE
  dataSource = new MatTableDataSource<Curso>();
  //mostrar el nombre de la columna
  displayedColumns: string[] = ['id', 'nombre', 'acciones'];
  //metodo para cargar los datos en la tabla al iniciar la pagina
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  cargarDatos(){
    this.matriculaService.getCursos(this.user.idPersona).subscribe(
      (data:Cursos)=>{
        this.dataSource.data=data.curso;
        this.total=data.total;
        this.cargando=false;
      }
    );
  }
  ngOnInit(): void {
    this.cargando=true;
    this.cargarDatos();
    setTimeout(() => {
      this.modalVerCurso= new window.bootstrap.Modal(document.getElementById('verCurso'));
    }, 1000);
  }
  onPageChange(e: PageEvent) {
    this.page_size = e.pageSize;
    this.page_number = e.pageIndex + 1;
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  ver(curso:Curso){
    this.modalVerCurso.show();
    this.cargando=true;
    this.nombreCurso=curso.nombre;
    console.log(curso);
    this.contenidosService.getContenidosPorCurso(curso.id!).subscribe(
      (data:Contenidos)=>{
        this.contenidos=data.contenidos;
        this.cargando=false;
      }
    );
  }
}
