import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EstudiantesComponent } from './estudiantes/estudiantes.component';
import { ProtectedComponent } from './protected.component';
import { CursosComponent } from './cursos/cursos.component';
import { MatriculasComponent } from './matriculas/matriculas.component';
import { ContenidosComponent } from './contenidos/contenidos.component';
import { ProgramasComponent } from './programas/programas.component';
import { UsuariosComponent } from './usuarios/usuarios.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: ProtectedComponent,
        children: [
          {
            path: 'contenidos',
            component: ContenidosComponent,
          },
          {
            path: 'cursos',
            component: CursosComponent,
          },
          {
            path: 'dashboard',
            component: DashboardComponent,
          },
          {
            path: 'estudiantes',
            component: EstudiantesComponent,
          },
          {
            path: 'matriculas',
            component: MatriculasComponent,
          },
          {
            path: 'programas',
            component: ProgramasComponent,
          },
          {
            path: 'usuarios',
            component: UsuariosComponent,
          },
          {
            path: '',
            redirectTo: 'dashboard',
            pathMatch: 'full',
          }


        ]
      },
      {
        path: '**',
        redirectTo: '',
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProtectedRoutingModule { }
