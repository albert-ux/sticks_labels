import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BackendService } from 'src/app/services/backend.service';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-edit-curso',
  templateUrl: './edit-curso.component.html'
})
export class EditCursoComponent {

  id: string | null = null;
  curso: any = {};
  categorias = [
    '1000 PRODUCCIÓN GENERAL',
    '2000 SERVICIOS',
    '3000 ADMINISTRACIÓN, CONTABILIDAD Y ECONOMÍA',
    '4000 COMERCIALIZACIÓN',
    '5000 MANTENIMIENTO Y REPARACIÓN',
    '6000 SEGURIDAD',
    '7000 DESARROLLO PERSONAL Y FAMILIAR',
    '8000 USO DE TECNOLOGÍAS DE LA INFORMACIÓN Y COMUNICACIÓN',
    '9000 PARTICIPACIÓN SOCIAL'
  ];

  tutores:any = [];

  constructor(
    private backendService: BackendService,
    private alertService: AlertService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.backendService.getCursoById(this.id).subscribe(data => {
        this.curso = data;
      });
      this.getAllTutores(this.id);
    }
  }

  actualizarCurso() {
    if (this.id) {
      this.backendService.updateCurso(this.id, this.curso).then(() => {
        this.alertService.showAlert('success', 'Éxito', 'El cliente se ha actualizado correctamente');
      },
        err => {
          this.alertService.showAlert('danger', 'Error', 'Ha ocurrido un error al actualizar el cliente');
        });
    }
  }

  eliminarCurso() {
    if (window.confirm('¿Estás seguro de que deseas eliminar este curso?') && this.id) {
      this.backendService.deleteCurso(this.id).then(() => {
        this.alertService.showAlert('warning', 'Éxito', 'El curso se ha eliminado correctamente');
        this.router.navigate(['/admin/cursos']);
      },
        err => {
          this.alertService.showAlert('danger', 'Error', 'Ha ocurrido un error al eliminar el curso');
        });
    }

  }

  

  getAllTutores(id:any){
    this.backendService.getTutoresByCursoId(id).subscribe(data => { 
      this.tutores = data;
    },
    err => {
      console.log(err);
    });
  }

}
