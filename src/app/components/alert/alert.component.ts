import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Alert, AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-alert',
  template: `
  <div class="alert-container">
    <alert *ngFor="let alert of alerts" [type]="alert.type" [dismissOnTimeout]="5000">
      <strong>{{ alert.title }}</strong> {{ alert.description }}
    </alert>
  </div>
`,
  styles: [`
.alert-container {
  position: fixed;
  top: 20px; /* ajusta esta distancia desde la parte superior si es necesario */
  left: 50%;
  transform: translateX(-50%); /* esto centrará el contenedor horizontalmente */
  width: auto; /* ajuste automático basado en el contenido */
  z-index: 9999;
}

alert {
  display: block;
  opacity: 1;
  animation: fadeIn 0.5s forwards; /* animación de aparición suave */
  transition: opacity 0.5s; /* transición suave al desaparecer */
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
`]



})
export class AlertComponent implements OnInit, OnDestroy {

  alerts: Alert[] = [];
  alertSubscription?: Subscription;

  constructor(private alertService: AlertService) { }

  ngOnInit(): void {
    this.alertSubscription = this.alertService.alertSubject.subscribe(alert => {
      this.alerts.push(alert);
    });
  }

  ngOnDestroy(): void {
    if (this.alertSubscription) {
      this.alertSubscription.unsubscribe();
    }
  }


}
