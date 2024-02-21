import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BackendService } from 'src/app/services/backend.service';

@Component({
  selector: 'app-tutores',
  templateUrl: './tutores.component.html'
})
export class TutoresComponent {

  tutores: any[] = [];
  temp: any[] = []; 
  activeRow: any;

  constructor(
    public router: Router,
    private backendService: BackendService) { }

  ngOnInit(): void {
    this.fetchTutores();
  }

  fetchTutores() {
    const sus = this.backendService.getTutores().subscribe(data => {
      this.tutores = data;
      console.log(this.tutores);
      this.temp = this.tutores.map((prop, key) => {
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
      this.router.navigate(['/admin/insumo-edit/' + this.activeRow.id]); // Suponiendo que tengas una ruta para editar tutores
    }
  }
}
