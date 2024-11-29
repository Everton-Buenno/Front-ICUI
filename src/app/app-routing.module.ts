import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import { AppLayoutComponent } from './layout/app.layout.component';
import { authGuard } from './demo/components/guards/auth.guard';

@NgModule({
  imports: [
    RouterModule.forRoot([
      {
        path: '', component: AppLayoutComponent,
        canActivate: [authGuard],
        children: [
          { path: '', loadChildren: () => import('./demo/components/dashboard/dashboard.module').then(m => m.DashboardModule) },
          { path: 'lancamentos', loadChildren: () => import('./demo/components/dashboard/dashboard.module').then(m => m.DashboardModule), canActivate: [authGuard] }, 
          { path: 'igrejas', loadChildren: () => import('./demo/components/igreja/igreja.module').then(m => m.IgrejaModule), canActivate: [authGuard] }, 
          { path: 'usuarios', loadChildren: () => import('./demo/components/usuarios/usuario.module').then(m => m.UsuarioModule), canActivate: [authGuard] }, 
          { path: 'dizimistas', loadChildren: () => import('./demo/components/dizimistas/dizimista.module').then(m => m.DizimistaModule ), canActivate: [authGuard] }, 
        ]
      },
      { path: 'auth', loadChildren: () => import('./demo/components/auth/auth.module').then(m => m.AuthModule) },
      { path: 'notfound', component: NotfoundComponent },
      { path: '**', redirectTo: '/notfound' },
    ], { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
