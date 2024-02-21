import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { BackendService } from 'src/app/services/backend.service';

@Component({
  selector: 'app-create-curso',
  templateUrl: './create-curso.component.html'
})
export class CreateCursoComponent {

  curso: string = '';
  metodologia: string = '';
  practica: string = '';
  objetivo: string = '';
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

  categoriaSeleccionada: string = '';

  constructor(
    private backendService: BackendService,
    private alertService: AlertService,
    private router: Router,) { }

  guardarCurso() {
    const data = {
      curso: this.curso,
      tematica: this.categoriaSeleccionada,
      metodologia: this.metodologia,
      practica: this.practica,
      objetivo: this.objetivo
    };

    this.backendService.createCurso(data).then(() => {
      this.alertService.showAlert('success', 'Curso creado', 'El curso se ha creado correctamente');
      this.curso = '';
      this.metodologia = '';
      this.practica = '';
      this.objetivo = '';
      this.router.navigate(['/admin/cursos']);
    }).catch(error => {
      this.alertService.showAlert('danger', 'Error', 'Ha ocurrido un error al crear el curso, contacto al administrador');
    });
  }


}
