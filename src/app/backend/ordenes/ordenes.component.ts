import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BackendService } from 'src/app/services/backend.service';

@Component({
  selector: 'app-ordenes',
  templateUrl: './ordenes.component.html',
  providers: [BackendService]
})
export class OrdenesComponent implements OnInit {

  ordenes: any[] = [];
  temp:any = [];
  activeRow: any;

  constructor(
    public router: Router,
    private backendService: BackendService) { }

  ngOnInit(): void {
    this.fetchOrdenes();
  }

  fetchOrdenes() {
    const sus = this.backendService.getOrdenes().subscribe(data => {
      this.ordenes = data;
      console.log(this.ordenes);
      this.temp = this.ordenes.map((prop, key) => {
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

  onActivate(event:any) {
    if (event.type == 'click') {
      this.activeRow = event.row;
      this.router.navigate(['/admin/orden-edit/' + this.activeRow.id])
    }
  }


}
