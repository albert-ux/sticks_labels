import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { BackendService } from 'src/app/services/backend.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-edit-cliente',
  templateUrl: './edit-cliente.component.html'
})
export class EditClienteComponent implements OnInit {

  clienteForm: FormGroup;
  selectedFile: File | null = null;
  public fileUploaded: boolean = false;
  isSubmitting: boolean = false;
  clienteId!: string;
  previousLogoPath: string | null = null;
  logoURL: string | null = null; // al inicio de tu clase, donde defines las variables.
  cliente: any;
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
    private route: ActivatedRoute,
    private backendService: BackendService,
    private storageService: StorageService,
    private alertService: AlertService,
    private fb: FormBuilder
  ) {
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

  ngOnInit(): void {
    // Suponiendo que el ID del cliente se pasa como un parámetro de ruta.
    this.clienteId = this.route.snapshot.params['id'];
    this.backendService.getCliente(this.clienteId).subscribe(cliente => {
      this.cliente = cliente;
      this.logoURL = cliente.logoURL;
      this.clienteForm.setValue({
        nombreComercial: cliente?.nombreComercial || null,
        razonSocial: cliente?.razonSocial || null,
        rfc: cliente?.rfc || null,
        metodoPago: cliente?.metodoPago || null,
        formaPago: cliente?.formaPago || null,
        nombre: cliente?.nombre || null,
        puesto: cliente?.puesto || null,
        telefono: cliente?.telefono || null,
        email: cliente?.email || null,
        logo: cliente?.logo || null,
      });      
      // Guardar el logo anterior
      this.previousLogoPath = cliente.logo;
    });
  }


  onFileSelected(event: any): void {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
      this.fileUploaded = true;
    }
  }

  onFileInputClick() {
    const fileInput = document.getElementById('file-upload');
    if (fileInput) {
      fileInput.click();
    }
  }

  eliminarCliente() {
    if (confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
      const logoPath = this.cliente.logo; // Asume que "this.cliente" contiene los datos del cliente actual y "logoPath" es la ruta del archivo en Firebase Storage

      // Inicia una cadena de promesas
      let deleteChain = Promise.resolve();

      // Si hay un logo, agrega la eliminación del logo a la cadena de promesas
      if (logoPath) {
        deleteChain = this.storageService.deleteFile(logoPath).toPromise();
      }

      // Luego de eliminar el logo (si existe), elimina el registro del cliente y redirige
      deleteChain
        .then(() => {
          return this.backendService.deleteCliente(this.clienteId); // Asume que "this.cliente.id" es el ID del cliente actual
        })
        .then(() => {
          this.alertService.showAlert('warning', 'Éxito', 'El cliente se ha eliminado correctamente');
          this.router.navigate(['/admin/clientes']);
        })
        .catch(error => {
          console.error("Ocurrió un error al eliminar el cliente:", error);
          // Aquí puedes mostrar un mensaje al usuario informándole del error
        });
    }
  }



  async actualizarCliente(): Promise<void> {
    this.isSubmitting = true;
    const clienteData: any = {
      ...this.clienteForm.value
    };

    if (this.selectedFile) {
      if (this.previousLogoPath) {
        await this.storageService.deleteFile(this.previousLogoPath).toPromise();
      }

      const filePath = `clientesLogos/${new Date().getTime()}_${this.selectedFile.name}`;
      const result = await this.storageService.uploadFile(filePath, this.selectedFile).toPromise();
      if (result.status === 'completed') {
        clienteData.logoURL = result.url;
        clienteData.logo = filePath;
      }
    }

    this.backendService.updateCliente(this.clienteId, clienteData).then(res => {
      this.alertService.showAlert('success', 'Cliente actualizado', 'El cliente se ha actualizado correctamente');
      this.selectedFile = null;
      this.isSubmitting = false;
    },
      err => {
        console.log(err);
        this.alertService.showAlert('danger', 'Error', 'Ha ocurrido un error al actualizar el cliente');
      });
  }


}
