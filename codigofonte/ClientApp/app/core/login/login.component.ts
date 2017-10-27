import { Component, ViewChild, ElementRef} from '@angular/core';
import { Router } from '@angular/router';

import { LoginService } from './login.service';


@Component({
    selector: 'login',
    templateUrl: 'login.template.html',
    styleUrls: ['login.style.css']
})
export class LoginComponent{

    @ViewChild('login') loginInput: ElementRef;
    @ViewChild('senha') senhaInput: ElementRef;
    
    public erro:string = null;

    constructor(
        private loginService: LoginService,
        private router: Router
    ) { }


    validaLogin(){

        if( this.loginService.logar(this.loginInput.nativeElement.value, this.senhaInput.nativeElement.value) ){

            this.erro = null;
            this.router.navigateByUrl(`/`);

        } else {

            this.erro = 'Login ou senha incorretos.';
        }
    }
}