import { Component, Input, OnInit } from '@angular/core';
import { BackendService } from 'src/app/services/backend.service';
import { StorageService } from 'src/app/services/storage.service';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-dosc-cliente',
  templateUrl: './dosc-cliente.component.html'
})
export class DoscClienteComponent {

  @Input() id: any;
  selectedFile: File | null = null;
  files: any[] = [];
  customFileName: string = '';
  descriptionFile: string = '';  // Para guardar una descripción del archivo no obligatoria

  constructor(
    private backendService: BackendService,
    private storageService: StorageService,
    private alertService: AlertService,
  ) { }

  ngOnInit(): void {
    if (this.id) {
      this.backendService.getFilesOfCliente(this.id).subscribe(files => {
        this.files = files;
      });
    }
  }

  onFileSelected(event: any): void {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  verArchivo(url: any) {
    window.open(url);
  }

  async uploadFile(): Promise<void> {
    if (this.selectedFile && this.customFileName) {
      const filePath = `clientFiles/${new Date().getTime()}_${this.customFileName}`;  // Usar el nombre personalizado aquí
      const result = await this.storageService.uploadFile(filePath, this.selectedFile).toPromise();

      if (result.status === 'completed') {
        const fileData = {
          fileURL: result.url,
          file: filePath,
          name: this.customFileName,
          description: this.descriptionFile,  // Usar el nombre personalizado aquí también
          uploadDate: new Date()
        };

        this.backendService.addFileToCliente(this.id, fileData).then(() => {

          // Limpia las variables después de subir con éxito
          this.selectedFile = null;
          this.customFileName = '';
          this.descriptionFile = '';

          this.alertService.showAlert('success', 'Archivo Subido', 'El archivo se subió correctamente correctamente');
        }, err => {
          this.alertService.showAlert('danger', 'Error', 'Ocurrió un error al subir el archivo');
        });
      }
    }
  }

  eliminarArchivo(fileId: string, filePath: string): void {
    if (window.confirm('¿Estás seguro de que deseas eliminar este archivo?')) {

      let deleteChain = Promise.resolve();

      if (filePath) {
        deleteChain = this.storageService.deleteFile(filePath).toPromise();
      }

      deleteChain.then(() => {
        return this.backendService.deleteFileOfCliente(fileId);
      })
        .then(() => {
          this.alertService.showAlert('warning', 'Archivo Eliminado', 'El archivo se eliminó correctamente');
        })
        .catch(error => {
          this.alertService.showAlert('danger', 'Error', 'Ocurrió un error al eliminar el archivo');
        });
    }
  }

}
