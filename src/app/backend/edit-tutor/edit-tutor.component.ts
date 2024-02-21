import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { BackendService } from 'src/app/services/backend.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-edit-tutor',
  templateUrl: './edit-tutor.component.html'
})
export class EditTutorComponent implements OnInit {

  id: string | null = null;
  tutor: any = {};
  cursos: any[] = [];  // Para almacenar los cursos disponibles
  cursosTutor: any[] = [];  // Para almacenar los cursos asignados al tutor
  selectedFirma: File | null = null;
  selectedConstancia: File | null = null;
  public fileUploaded: boolean = false;
  previousFirmaPath: string | null = null;
  previousConstanciaPath: string | null = null;
  isSubmitting: boolean = false;

  constructor(
    private backendService: BackendService,
    private route: ActivatedRoute,
    private router: Router,
    private storageService: StorageService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.backendService.getTutor(this.id).subscribe(data => {
        this.tutor = data;
        this.previousFirmaPath = this.tutor.firma;
        this.previousConstanciaPath = this.tutor.constancia;
      });

      // Obtener los cursos asignados al tutor
      this.backendService.getCursosByTutorId(this.id).subscribe(cursos => {
        this.cursosTutor = cursos;
        this.actualizarCursosDisponibles(); // llama a actualizarCursosDisponibles después de asignar this.cursosTutor
      },
        err => {
          console.error(err);
          this.alertService.showAlert('danger', 'Error', 'Ha ocurrido un error al obtener los cursos del tutor');
        });
    }
  }

  actualizarCursosDisponibles(): void {
    // Obtener todos los cursos disponibles
    this.backendService.getCursos().subscribe(cursos => {
      this.cursos = cursos.filter((curso: any) =>
        !this.cursosTutor.some(cursoTutor => cursoTutor.id === curso.id)
      );
    });
  }



  onFileSelected(event: any, type: 'firma' | 'constancia'): void {
    if (event.target.files.length > 0) {
      if (type === 'firma') {
        this.selectedFirma = event.target.files[0];
      } else if (type === 'constancia') {
        this.selectedConstancia = event.target.files[0];
      }
      this.fileUploaded = true;  // Este indicador muestra que un archivo fue seleccionado. Se puede mejorar para manejar firma y constancia de manera separada.
    }
  }


  onFileInputClick(type: 'firma' | 'constancia'): void {
    const fileInput = document.getElementById(type === 'firma' ? 'file-upload-firma' : 'file-upload-constancia');
    if (fileInput) {
      fileInput.click();
    }
  }


  async actualizarTutor(): Promise<void> {
    this.isSubmitting = true;

    // Firma
    if (this.selectedFirma) {
      await this.uploadFile('firma', this.previousFirmaPath, this.selectedFirma);
    }

    // Constancia
    if (this.selectedConstancia) {
      await this.uploadFile('constancia', this.previousConstanciaPath, this.selectedConstancia);
    }

    if (this.id) {
      this.backendService.updateTutor(this.id, this.tutor).then(() => {
        this.alertService.showAlert('success', 'Tutor actualizado', 'El tutor se ha actualizado correctamente');
        this.selectedFirma = null;
        this.selectedConstancia = null;
        this.isSubmitting = false;
      }, err => {
        console.error(err);
        this.alertService.showAlert('danger', 'Error', 'Ha ocurrido un error al actualizar el tutor');
      });
    }
  }

  async uploadFile(type: 'firma' | 'constancia', previousPath: string | null, file: File): Promise<void> {
    let fileURL = '';
    let filePath = '';

    if (previousPath) {
      await this.storageService.deleteFile(previousPath).toPromise();
    }

    filePath = `${type}s/${new Date().getTime()}_${file.name}`;
    const result = await this.storageService.uploadFile(filePath, file).toPromise();
    if (result.status === 'completed') {
      fileURL = result.url;
    }

    this.tutor[`${type}URL`] = fileURL;
    this.tutor[type] = filePath;
  }

  eliminarTutor(): void {
    if (window.confirm('¿Estás seguro de que deseas eliminar este insumo?') && this.id) {
      const firmaPath = this.tutor.firma;

      let deleteChain = Promise.resolve();

      if (firmaPath) {
        deleteChain = this.storageService.deleteFile(firmaPath).toPromise();
      }

      deleteChain.then(() => {
        return this.backendService.deleteTutor(this.id);
      })
        .then(() => {
          this.alertService.showAlert('warning', 'Éxito', 'El insumo se ha eliminado correctamente');
          this.router.navigate(['/admin/asesores']);
        })
        .catch(error => {
          console.error("Ocurrió un error al eliminar el insumo:", error);
        });
    }
  }

  agregarCurso(cursoId: any): void {
    const idCurso = cursoId.id;
    if (this.id) {
      this.backendService.addCursoToTutor(this.id, idCurso).then(() => {
        this.alertService.showAlert('success', 'Curso agregado', 'El curso se ha agregado correctamente al insumo');
        // Actualizar la lista de cursos del tutor
        this.backendService.getCursosByTutorId(this.id).subscribe(cursos => {
          this.cursosTutor = cursos;
          // Actualizar la lista de cursos disponibles
          this.backendService.getCursos().subscribe(cursosDisponibles => {
            this.cursos = cursosDisponibles.filter((curso: any) =>
              !this.cursosTutor.some(cursoTutor => cursoTutor.id === curso.id)
            );
          });
        });
      }, err => {
        this.alertService.showAlert('danger', 'Error', 'Ha ocurrido un error al agregar el curso al tutor');
      });
    }
  }


  eliminarCurso(cursoId: any): void {
    if (this.id) {
        this.backendService.removeCursoFromTutor(this.id, cursoId).then(() => {
            this.alertService.showAlert('success', 'Curso eliminado', 'El curso se ha eliminado correctamente del tutor');
            // Actualizar la lista de cursos del tutor
            this.backendService.getCursosByTutorId(this.id).subscribe(cursos => {
                this.cursosTutor = cursos;
                this.actualizarCursosDisponibles(); // Actualizar la lista de cursos disponibles
            });
        }, err => {
            this.alertService.showAlert('danger', 'Error', 'Ha ocurrido un error al eliminar el curso del tutor');
        });
    }
}


}
