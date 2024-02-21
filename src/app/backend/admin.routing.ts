import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLayoutComponent } from '../layouts/admin-layout/admin-layout.component';
import { CursosComponent } from './cursos/cursos.component';
import { CreateCursoComponent } from './create-curso/create-curso.component';
import { EditCursoComponent } from './edit-curso/edit-curso.component';
import { TutoresComponent } from './tutores/tutores.component';
import { EditTutorComponent } from './edit-tutor/edit-tutor.component';
import { CreateTutorComponent } from './create-tutor/create-tutor.component';
import { OrdenesComponent } from './ordenes/ordenes.component';
import { EditOrdenComponent } from './edit-orden/edit-orden.component';
import { CreateOrdenComponent } from './create-orden/create-orden.component';
import { ClientesComponent } from './clientes/clientes.component';
import { EditClienteComponent } from './edit-cliente/edit-cliente.component';
import { CreateClienteComponent } from './create-cliente/create-cliente.component';
import { OrdenClientUrlComponent } from './orden-client-url/orden-client-url.component';
import { OrdenAsesorUrlComponent } from './orden-asesor-url/orden-asesor-url.component';

const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: '', component: OrdenesComponent }, 
      { path: 'ordenes', component: OrdenesComponent }, 
      { path: 'orden-edit/:id', component: EditOrdenComponent },
      { path: 'orden-nueva', component: CreateOrdenComponent },
      { path: 'clientes', component: ClientesComponent }, 
      { path: 'cliente-nuevo', component: CreateClienteComponent },
      { path: 'cliente-edit/:id', component: EditClienteComponent },
      { path: 'cursos', component: CursosComponent }, 
      { path: 'curso-nuevo', component: CreateCursoComponent }, 
      { path: 'curso-edit/:id', component: EditCursoComponent },
      { path: 'almacen', component: TutoresComponent }, 
      { path: 'insumo-nuevo', component: CreateTutorComponent }, 
      { path: 'insumo-edit/:id', component: EditTutorComponent },
      { path: 'orden-client/:id', component: OrdenClientUrlComponent },
      { path: 'orden-asesor/:id', component: OrdenAsesorUrlComponent },

    ]
  }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
