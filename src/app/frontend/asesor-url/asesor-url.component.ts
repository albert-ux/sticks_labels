import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/app/services/alert.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BackendService } from 'src/app/services/backend.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-asesor-url',
  templateUrl: './asesor-url.component.html'
})
export class AsesorURLComponent implements OnInit {

  id: any;

  ordenForm!: FormGroup;
  clientes: any[] = [];
  clientesSeleccionados: any[] = [];
  orden: any = {};

  ocupaciones = [
    { clave: "1", name: "CULTIVO, CRIANZA Y APROVECHAMIENTO" },
    { clave: "1.1", name: "AGRICULTURA Y SILVICULTURA" },
    { clave: "1.2", name: "GANADERÍA" },
    { clave: "1.3", name: "PESCA Y ACUACULTURA" },
    { clave: "2", name: "EXTRACCIÓN Y SUMINISTRO" },
    { clave: "2.1", name: "EXPLORACIÓN" },
    { clave: "2.2", name: "EXTRACCIÓN" },
    { clave: "2.3", name: "REFINACIÓN Y BENEFICIO" },
    { clave: "2.4", name: "PROVISIÓN DE ENERGÍA" },
    { clave: "2.5", name: "PROVISIÓN DE AGUA" },
    { clave: "3", name: "CONSTRUCCIÓN" },
    { clave: "3.1", name: "PLANEACIÓN Y DIRECCIÓN DE OBRAS" },
    { clave: "3.2", name: "EDIFICACIÓN Y URBANIZACIÓN" },
    { clave: "3.3", name: "ACABADO" },
    { clave: "3.4", name: "INSTALACIÓN Y MANTENIMIENTO" },
    { clave: "4", name: "TECNOLOGÍA" },
    { clave: "4.1", name: "MECÁNICA" },
    { clave: "4.2", name: "ELECTRICIDAD" },
    { clave: "4.3", name: "ELECTRÓNICA" },
    { clave: "4.4", name: "INFORMÁTICA" },
    { clave: "4.5", name: "TELECOMUNICACIONES" },
    { clave: "4.6", name: "PROCESOS INDUSTRIALES" },
    { clave: "5", name: "PROCESAMIENTO Y FABRICACIÓN" },
    { clave: "5.1", name: "MINERALES NO METÁLICOS" },
    { clave: "5.2", name: "METALES" },
    { clave: "5.3", name: "ALIMENTOS Y BEBIDAS" },
    { clave: "5.4", name: "TEXTILES Y PRENDAS DE VESTIR" },
    { clave: "5.5", name: "MATERIA ORGÁNICA" },
    { clave: "5.6", name: "PRODUCTOS QUÍMICOS" },
    { clave: "5.7", name: "PRODUCTOS METÁLICOS Y DE HULE Y PLÁSTICO" },
    { clave: "5.8", name: "PRODUCTOS ELÉCTRICOS Y ELECTRÓNICOS" },
    { clave: "5.9", name: "PRODUCTOS IMPRESOS" },
    { clave: "6", name: "TRANSPORTE" },
    { clave: "6.1", name: "FERROVIARIO" },
    { clave: "6.2", name: "AUTOTRANSPORTE" },
    { clave: "6.3", name: "AÉREO" },
    { clave: "6.4", name: "MARÍTIMO Y FLUVIAL" },
    { clave: "6.5", name: "SERVICIOS DE APOYO" },
    { clave: "7", name: "PROVISIÓN DE BIENES Y SERVICIOS" },
    { clave: "7.1", name: "COMERCIO" },
    { clave: "7.2", name: "ALIMENTACIÓN Y HOSPEDAJE" },
    { clave: "7.3", name: "TURISMO" },
    { clave: "7.4", name: "DEPORTE Y ESPARCIMIENTO" },
    { clave: "7.5", name: "SERVICIOS PERSONALES" },
    { clave: "7.6", name: "REPARACIÓN DE ARTÍCULOS DE USO DOMÉSTICO Y PERSONAL" },
    { clave: "7.7", name: "LIMPIEZA" },
    { clave: "7.8", name: "SERVICIO POSTAL Y MENSAJERÍA" },
    { clave: "8", name: "SALUD Y BIENESTAR" },
    { clave: "8.1", name: "MEDICINA" },
    { clave: "8.2", name: "ENFERMERÍA" },
    { clave: "8.3", name: "PSICOLOGÍA" },
    { clave: "8.4", name: "ODONTOLOGÍA" },
    { clave: "8.5", name: "NUTRICIÓN" },
    { clave: "9", name: "EDUCACIÓN Y CULTURA" },
    { clave: "9.1", name: "DOCENCIA" },
    { clave: "9.2", name: "INVESTIGACIÓN" },
    { clave: "9.3", name: "ARTES" },
    { clave: "9.4", name: "MÚSICA Y DANZA" },
    { clave: "10", name: "GOBIERNO Y DEFENSA" },
    { clave: "10.1", name: "ADMINISTRACIÓN PÚBLICA" },
    { clave: "10.2", name: "MILITAR" },
    { clave: "10.3", name: "POLICIAL" },
    { clave: "11", name: "FINANZAS Y NEGOCIOS" },
    { clave: "11.1", name: "BANCA" },
    { clave: "11.2", name: "SEGUROS" },
    { clave: "11.3", name: "INVERSIÓN" },
  ];
  constructor(
    private fb: FormBuilder,
    private backendService: BackendService,
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService,
  ) {

  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.ordenForm = this.fb.group({
      noOrden: [''],
      clienteId: [''],
      cursoTitulo: [''],
      cursoId: [''],
      metodologia: [''],
      practica: [''],
      objetivo: [''],
      tutorNombre: [''],
      tutorId: [''],
      domicilio: [''],
      duracion: [''],
      participantes: this.fb.array([]),
      isRango: [false],
      fechaInicio: [null],
      fechaFin: [null]
    });


    // Escuchar cambios en isRango y actualizar validaciones
    this.ordenForm.get('isRango')?.valueChanges.subscribe(isRango => {
      const fechaInicioControl = this.ordenForm.get('fechaInicio');
      const fechaFinControl = this.ordenForm.get('fechaFin');

      if (isRango) {
        fechaInicioControl?.setValidators(Validators.required);
        fechaFinControl?.setValidators(Validators.required);
      } else {
        fechaFinControl?.clearValidators();
        fechaInicioControl?.setValidators(Validators.required);
      }

      fechaInicioControl?.updateValueAndValidity();
      fechaFinControl?.updateValueAndValidity();
    });


    this.ordenForm.get('clienteId')?.valueChanges.subscribe(clienteIds => {

      if (clienteIds && Array.isArray(clienteIds)) {
        const selectedIds = clienteIds.map(cliente => cliente.id);  // Extraemos solo los IDs
        this.clientesSeleccionados = this.clientes.filter(cliente => selectedIds.includes(cliente.id));
      } else {
        this.clientesSeleccionados = [];
      }
    });

    this.backendService.getClientes().subscribe(data => {
      this.clientes = data;
    });
    
    this.getOrden();
  }

  get participantes(): FormArray {
    return this.ordenForm.get('participantes') as FormArray;
  }

  get participantesArray(): FormArray {
    return this.ordenForm.get('participantes') as FormArray;
  }

  getOrden(): void {
    this.backendService.getOrdenById(this.id).pipe(take(1)).subscribe(data => {
      this.orden = data;
      this.ordenForm.patchValue(this.orden);
      this.orden.participantes.forEach((participante:any) => {
        this.participantesArray.push(this.pushForm(participante));
      })

    });
  }

  pushForm(values:any): FormGroup {
    return this.fb.group({
      nombre: values.nombre,
      apellido: values.apellido,
      puesto: values.puesto,
      curp: values.curp,
      clienteId: values.clienteId,
      representanteComercial: values.representanteComercial,
      representanteLaboral: values.representanteLaboral,
      asistencia: values.asistencia,
      clienteIdForParticipante: values.clienteIdForParticipante,
      catalogo: values.catalogo,
      calificacionTeorica: values.calificacionTeorica,
      calificacionPractica: values.calificacionPractica,
      comentariosDesempeno: values.comentarios,
      aprobatoria: values.aprobatoria,
      evalucacionCumplimiento: values.evalucacionCumplimiento,
      evaluacionDesarrollo: values.evaluacionDesarrollo,
      evaluacionMezcla: values.evaluacionMezcla,
      evaluacionDominio: values.evaluacionDominio,
      evaluacionMetodologia: values.evalucionMetodologia,
      evaluacionVisuales: values.evaluacionVisuales,
      evaluacionCumplimiento: values.evaluacionCumplimiento,
      comentariosMejores: values.comentariosMejores,
      comentariosRecomendaciones: values.comentariosRecomendaciones,
    })
  }

  agregarParticipante(): void {
    const clienteIds = this.ordenForm.get('clienteId')?.value || [];
    const clienteId = clienteIds.length > 1 ? '' : clienteIds[0];
    // this.clientesSeleccionados = this.clientes.filter(cliente => clienteIds.includes(cliente.id));

    console.log('clienteIds', this.clientesSeleccionados);

    let representanteComercial = '';
    let representanteLaboral = '';

    // Si ya hay participantes, copia los valores del último
    if (this.participantes.length > 0) {
      const lastParticipant = this.participantes.at(this.participantes.length - 1);
      representanteComercial = lastParticipant.get('representanteComercial')?.value || '';
      representanteLaboral = lastParticipant.get('representanteLaboral')?.value || '';
    }

    this.participantes.push(this.fb.group({
      nombre: [''],
      apellido: [''],
      puesto: [''],
      curp: ['', [Validators.required, this.curpValidator]],
      clienteId: clienteId,
      representanteComercial: [representanteComercial], // Asigna el valor copiado
      representanteLaboral: [representanteLaboral],
      asistencia: [true],  
      clienteIdForParticipante: [''],
      catalogo: [null],
      calificacionTeorica: [''],
      calificacionPractica: [''],
      comentariosDesempeno: [''],
      aprobatoria: [true],
      evalucacionCumplimiento: [''],
      evaluacionDesarrollo: [''],
      evaluacionMezcla: [''],
      evaluacionDominio: [''],
      evaluacionMetodologia: [''],
      evaluacionVisuales: [''],
      evaluacionCumplimiento: [''],
      comentariosMejores: [''],
      comentariosRecomendaciones: [''],

    }));
  }


  // Validador personalizado para CURP
  curpValidator(control: AbstractControl): { [key: string]: any } | null {
    const curpRegex = /^[A-Z]{4}[0-9]{6}[A-Z]{6}[A-Z0-9]{2}$/;
    const valid = curpRegex.test(control.value);
    return valid ? null : { invalidCURP: true };
  }


  guardarOrden(): void {
    this.backendService.updateOrden(this.ordenForm.value, this.id).then(() => {
      this.alertService.showAlert('success', 'Inscripción actualizada', 'La inscripción se ha actualizado correctamente');
    },
      err => {
        this.alertService.showAlert('danger', 'Error', 'Ha ocurrido un error al actualizar la inscripción, contacto al administrador');
        console.error('Error al guardar orden:', err);

      });
  }






}
