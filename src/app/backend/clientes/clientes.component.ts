import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BackendService } from 'src/app/services/backend.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html'
})
export class ClientesComponent implements OnInit {

  clientes: any[] = [];
  temp: any = [];
  activeRow: any;

  constructor(
    public router: Router,
    private backendService: BackendService) { }

  ngOnInit(): void {
    this.fetchClientes();
  }

  fetchClientes() {
    const sus = this.backendService.getClientes().subscribe(data => {
      this.clientes = data;
      this.temp = this.clientes.map((prop, key) => {
        return {
          ...prop
        };
      });
      sus.unsubscribe();
    }, err => {
      if (err.status == 401) {
        this.router.navigate(['/login']);
      }
    });
}



  onActivate(event: any) {
    if (event.type == 'click') {
      this.activeRow = event.row;
      this.router.navigate(['admin/cliente-edit/' + this.activeRow.id]);
    }
  }

}
