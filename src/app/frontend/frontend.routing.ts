import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FrontEndLayoutComponent } from '../layouts/frontend-layout/frontend-layout.component';
import { ClientUrlComponent } from './client-url/client-url.component';
import { AsesorURLComponent } from './asesor-url/asesor-url.component';
import { LoginComponent } from './login/login.component';


const routes: Routes = [
  {
    path: '',
    component: FrontEndLayoutComponent,
    children: [
      {
        path: '',
        component: LoginComponent
      },
      {
        path: 'client-url/:idCliente/:idOrden',
        component: ClientUrlComponent
      },
      {
        path: 'asesor-url/:id',
        component: AsesorURLComponent
      }

    ]
  }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FrontEndRoutingModule { }
