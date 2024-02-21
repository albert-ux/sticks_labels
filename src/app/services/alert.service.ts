import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Alert {
  type: 'success' | 'info' | 'warning' | 'danger'; // Define los tipos de alertas que quieres manejar
  title: string;
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {

   // Usa un Subject para emitir eventos cuando quieres mostrar una alerta
   alertSubject = new Subject<Alert>();

   constructor() { }
 
   showAlert(type: Alert['type'], title: string, description?: string): void {
    console.log('showAlert');
     this.alertSubject.next({ type, title, description });
   }
}
