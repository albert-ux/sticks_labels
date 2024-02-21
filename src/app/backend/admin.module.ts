import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { RouterModule } from "@angular/router";
import { HttpClientModule } from '@angular/common/http';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgSelectModule } from '@ng-select/ng-select';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { CursosComponent } from './cursos/cursos.component';
import { CreateCursoComponent } from './create-curso/create-curso.component';
import { EditCursoComponent } from './edit-curso/edit-curso.component';
import { CreateTutorComponent } from './create-tutor/create-tutor.component';
import { EditTutorComponent } from './edit-tutor/edit-tutor.component';
import { TutoresComponent } from './tutores/tutores.component';
import { CreateOrdenComponent } from './create-orden/create-orden.component';
import { EditOrdenComponent } from './edit-orden/edit-orden.component';
import { OrdenesComponent } from './ordenes/ordenes.component';
import { AdminRoutingModule } from './admin.routing';
import { ClientesComponent } from './clientes/clientes.component';
import { EditClienteComponent } from './edit-cliente/edit-cliente.component';
import { CreateClienteComponent } from './create-cliente/create-cliente.component';
import { OrdenClientUrlComponent } from './orden-client-url/orden-client-url.component';
import { OrdenAsesorUrlComponent } from './orden-asesor-url/orden-asesor-url.component';
import { DocsAsesorComponent } from './docs-asesor/docs-asesor.component';
import { DoscClienteComponent } from './dosc-cliente/dosc-cliente.component';
import { OrdenesClienteComponent } from './ordenes-cliente/ordenes-cliente.component';



@NgModule({
  declarations: [
    CursosComponent,
    CreateCursoComponent,
    EditCursoComponent,
    CreateTutorComponent,
    EditTutorComponent,
    TutoresComponent,
    CreateOrdenComponent,
    EditOrdenComponent,
    OrdenesComponent,
    ClientesComponent,
    EditClienteComponent,
    CreateClienteComponent,
    OrdenClientUrlComponent,
    OrdenAsesorUrlComponent,
    DocsAsesorComponent,
    DoscClienteComponent,
    OrdenesClienteComponent
  ],
  imports: [
    HttpClientModule,
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    AdminRoutingModule, 
    NgxDatatableModule,
    NgSelectModule,
    TabsModule.forRoot(),
    BsDatepickerModule.forRoot(),
  ]
})
export class AdminModule { }
