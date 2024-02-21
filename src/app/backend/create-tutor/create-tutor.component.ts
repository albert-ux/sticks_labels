import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { BackendService } from 'src/app/services/backend.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-create-tutor',
  templateUrl: './create-tutor.component.html'
})

export class CreateTutorComponent implements OnInit {

  tutor: any = {
    nombre: '',
    registro: '',
    firmaURL: '',
    firma: '',
    constanciaURL: '',
    constancia: '',
    cursos: []
  };

  selectedFile: File | null = null;
  selectedConstancia: File | null = null;
  fileUploaded: boolean = false;
  constanciaUploaded: boolean = false;
  isSubmitting: boolean = false;
  cursos: any[] = [];

  constructor(
    private router: Router,
    private backendService: BackendService,
    private storageService: StorageService,
    private alertService: AlertService) { }


  ngOnInit(): void {
    this.backendService.getCursos().subscribe(
      cursos => {
        this.cursos = cursos;
      },
      err => {
        console.error(err);
      }
    );
  }


  onFileSelected(event: any, type: 'firma' | 'constancia'): void {
    if (event.target.files.length > 0) {
      if (type === 'firma') {
        this.selectedFile = event.target.files[0];
        this.fileUploaded = true;
      } else if (type === 'constancia') {
        this.selectedConstancia = event.target.files[0];
        this.constanciaUploaded = true;
      }
    }
  }

  async guardarTutor(): Promise<void> {
    this.isSubmitting = true;
    let firmaURL = '';
    let firmaPath = '';
    let constanciaURL = '';
    let constanciaPath = '';

    // Subir la firma
    if (this.selectedFile) {
      firmaPath = `tutoresFirmas/${new Date().getTime()}_${this.selectedFile.name}`;
      const result = await this.storageService.uploadFile(firmaPath, this.selectedFile).toPromise();
      if (result.status === 'completed') {
        firmaURL = result.url;
      }
    }

    // Subir la constancia
    if (this.selectedConstancia) {
      constanciaPath = `tutoresConstancias/${new Date().getTime()}_${this.selectedConstancia.name}`;
      const result = await this.storageService.uploadFile(constanciaPath, this.selectedConstancia).toPromise();
      if (result.status === 'completed') {
        constanciaURL = result.url;
      }
    }

    this.tutor.firmaURL = firmaURL;
    this.tutor.firma = firmaPath;
    this.tutor.constanciaURL = constanciaURL;  // Guardar la URL de la constancia
    this.tutor.constancia = constanciaPath;    // Guardar el path de la constancia

    this.backendService.createTutor(this.tutor).then((docRef) => {
      const tutorCursoPromises = this.tutor.cursos.map((cursoId: string) => {
        return this.backendService.createTutorCurso(docRef.id, cursoId);
      });
      return Promise.all(tutorCursoPromises);
    })
    .then(() => {
      this.alertService.showAlert('success', 'Asesor creado', 'El asesor se ha creado correctamente');
      this.tutor = {
        nombre: '',
        experiencia: '',
        firmaURL: '',
        firma: '',
        constanciaURL: '',  // Reiniciar los valores
        constancia: ''
      };
      this.selectedFile = null;
      this.selectedConstancia = null;  // Reiniciar el archivo seleccionado de la constancia
      this.router.navigate(['/admin/almacen']);
    })
    .catch(err => {
      console.log(err);
      this.alertService.showAlert('danger', 'Error', 'Ha ocurrido un error al crear el asesor');
    });
  }

}
