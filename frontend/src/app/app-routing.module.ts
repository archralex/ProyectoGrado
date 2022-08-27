import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ErrorPageComponent } from './shared/error-page/error-page.component';
import { ValidarTokenGuard } from './guards/validar-token.guard';
import { ValidarRolEstudianteGuard } from './guards/validar-rol-estudiante.guard';
import { ValidarRolGuard } from './guards/validar-rol.guard';
const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'estudiante',
    loadChildren: () => import('./estudiante/estudiante.module').then(m => m.EstudianteModule),
    canActivate: [ValidarTokenGuard,ValidarRolEstudianteGuard],
    canLoad: [ValidarTokenGuard,ValidarRolEstudianteGuard]
  },
  {
    path: '',
    loadChildren: () => import('./protected/protected.module').then(m => m.ProtectedModule),
    canActivate: [ValidarTokenGuard,ValidarRolGuard],
    canLoad: [ValidarTokenGuard,ValidarRolGuard]
  },
  {
    path: '404',
    component: ErrorPageComponent,
  },
  {
    path: '**',
    component: ErrorPageComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
