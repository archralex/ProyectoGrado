import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ProtectedRoutingModule } from './protected-routing.module';
import { MaterialModule } from '../material/material.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EstudiantesComponent } from './estudiantes/estudiantes.component';
import { ProtectedComponent } from './protected.component';
import { MatriculasComponent } from './matriculas/matriculas.component';
import { CursosComponent } from './cursos/cursos.component';
import { ProgramasComponent } from './programas/programas.component';
import { ContenidosComponent } from './contenidos/contenidos.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { PaginadorModule } from '../paginador/paginador.module';

@NgModule({
  declarations: [
    DashboardComponent,
    EstudiantesComponent,
    ProtectedComponent,
    MatriculasComponent,
    CursosComponent,
    ProgramasComponent,
    ContenidosComponent,
    UsuariosComponent
  ],
  imports: [
    CommonModule,
    ProtectedRoutingModule,
    MaterialModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    PaginadorModule
  ]

})
export class ProtectedModule { }
