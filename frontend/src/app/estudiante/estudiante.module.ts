import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EstudianteRoutingModule } from './estudiante-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MaterialModule } from '../material/material.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ReactiveFormsModule } from '@angular/forms';
import { PaginadorModule } from '../paginador/paginador.module';
import { EstudianteComponent } from './estudiante.component';
import { PerfilComponent } from './perfil/perfil.component';
import { CursosComponent } from './cursos/cursos.component';


@NgModule({
  declarations: [
    DashboardComponent,
    EstudianteComponent,
    PerfilComponent,
    CursosComponent
  ],
  imports: [
    CommonModule,
    EstudianteRoutingModule,
    MaterialModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    PaginadorModule,
  ]
})
export class EstudianteModule { }
