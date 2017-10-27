import { Component, ViewChild, ElementRef} from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'login',
    templateUrl: 'login.template.html',
    styleUrls: ['login.style.css']
})
export class LoginComponent{
    @ViewChild('login') loginInput: ElementRef;
    @ViewChild('senha') senhaInput: ElementRef;
    
    private login:string = 'ibge';
    private senha:string = 'hml%405';
    public erro:string = null;

    constructor( ) { }

    validaLogin(){
        if(this.login == this.loginInput.nativeElement.value && this.senha == this.senhaInput.nativeElement.value){
            console.log('certo');
            this.erro = null;
        }else{
            console.log('errado');
            this.erro = 'Login ou senha incorretos.';
        }
    }
}