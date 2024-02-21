import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { RouterModule } from "@angular/router";
import { HttpClientModule } from '@angular/common/http';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgSelectModule } from '@ng-select/ng-select';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { FrontEndRoutingModule } from './frontend.routing';
import { ClientUrlComponent } from './client-url/client-url.component';
import { AsesorURLComponent } from './asesor-url/asesor-url.component';
import { LoginComponent } from './login/login.component';


@NgModule({
  declarations: [
    ClientUrlComponent,
    AsesorURLComponent,
    LoginComponent
  ],
  imports: [
    HttpClientModule,
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    FrontEndRoutingModule, 
    NgxDatatableModule,
    NgSelectModule,
    TabsModule.forRoot(),
    BsDatepickerModule.forRoot(),
  ]
})
export class FrontEndModule { }
