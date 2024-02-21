import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule }   from '@angular/forms';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};
import { SidebarComponent } from "./sidebar/sidebar.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { FooterComponent } from "./footer/footer.component";
import { RouterModule } from "@angular/router";
import { CollapseModule } from "ngx-bootstrap/collapse";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { AlertComponent } from './alert/alert.component';
import { AlertModule } from 'ngx-bootstrap/alert';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    CollapseModule.forRoot(),
    BsDropdownModule.forRoot(),
    FormsModule,
    AlertModule.forRoot()
  ],
  declarations: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    AlertComponent
  ],
  exports: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    AlertComponent
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ]
})
export class ComponentsModule {}
