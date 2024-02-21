import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BackendService } from 'src/app/services/backend.service';

@Component({
  selector: 'app-cursos',
  templateUrl: './cursos.component.html',
  providers: [BackendService]
})
export class CursosComponent {

  cursos: any[] = [];
  temp: any[] = []; // Variable temporal para ngx-datatable
  activeRow: any;   // Variable para la fila activa en ngx-datatable

  constructor(
    private backendService: BackendService,
    public router: Router) { }  // Inyectamos Router para la navegación

  ngOnInit(): void {
    this.fetchCursos();
  }

  fetchCursos() {
    const sus = this.backendService.getCursos().subscribe(data => {
      this.cursos = data;
      console.log(this.cursos);
      this.temp = this.cursos.map((prop, key) => {
        return {
          ...prop
        };
      });
      sus.unsubscribe();
    });
  }

  onActivate(event: any) {
    if (event.type == 'click') {
      this.activeRow = event.row;
      this.router.navigate(['/admin/curso-edit/' + this.activeRow.id]);
    }
  }
}
