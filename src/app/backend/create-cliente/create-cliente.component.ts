import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { BackendService } from 'src/app/services/backend.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-create-cliente',
  templateUrl: './create-cliente.component.html'
})

export class CreateClienteComponent {

  clienteForm: FormGroup;
  selectedFile: File | null = null;
  public fileUploaded: boolean = false;
  isSubmitting: boolean = false;
  tiposDePago: string[] = [
    'PPD - Pago en parcialidades o diferidos',
    'PUE - Pago en una sola exhibición'
  ];

  metodosDePago: string[] = [
    '01 - Efectivo',
    '02 - Cheque nominativo',
    '03 - Transferencia electrónica de fondos',
    '04 - Tarjeta de crédito',
    '28 - Tarjeta de débito',
    '99 - Por definir'
  ];


  constructor(
    private router: Router,
    private backendService: BackendService,
    private storageService: StorageService,
    private alertService: AlertService,
    private fb: FormBuilder) {
    this.clienteForm = this.fb.group({
      nombreComercial: [''], 
      razonSocial: [''],     
      rfc: [''],
      metodoPago: [''],      
      formaPago: [''],       
      nombre: [''],
      puesto: [''],          
      telefono: [''],
      email: [''],
      logo: ['']
    });
  }

  onFileSelected(event: any): void {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
      this.fileUploaded = true;  
    }
  }
  
  async guardarCliente(): Promise<void> {
    this.isSubmitting = true;
    let fileURL = '';
    let filePath = '';  
    
    if (this.selectedFile) {
      filePath = `clientesLogos/${new Date().getTime()}_${this.selectedFile.name}`; 
      const result = await this.storageService.uploadFile(filePath, this.selectedFile).toPromise();
      if (result.status === 'completed') {
        fileURL = result.url;
      }
    }
  
    const clienteData = {
      ...this.clienteForm.value,
      logoURL: fileURL,
      logo: filePath 
    };
  
    this.backendService.createCliente(clienteData).then(res => {
      // Resetear el formulario o redirigir a otro lugar después de guardar
      this.alertService.showAlert('success', 'Cliente creado', 'El cliente se ha creado correctamente');
      this.clienteForm.reset();
      this.selectedFile = null;
      this.router.navigate(['/admin/clientes']);
    },
    err => {
      console.log(err);
      this.alertService.showAlert('danger', 'Error', 'Ha ocurrido un error al crear el cliente');
    });
}


}
