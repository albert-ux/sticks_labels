import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {

  public data:any = {
    username: '',
    password: ''
  };

  public loginFalse:boolean = false;

  constructor(private router: Router,) { }

  onLogin() {
    console.log(this.data);
    if(this.data.username == 'admin@etiquetasoccidente.com' && this.data.password == 'admin') {
      alert('Login Success');
      this.router.navigate(['/admin']);
    }else{
      this.loginFalse = true;
    }
  }

}
