import { Injectable } from '@angular/core';

@Injectable()
export class LoginService {

    private usuarioLogado: string;


    constructor() { }
    

    public isLogado(){

        return !!this.usuarioLogado;
    }

    public logar(usuario: string, senha: string){

        let loginValido: string = 'ibge';
        let senhaValida: string = 'hml%405';

        if(usuario == loginValido && senha == senhaValida){

            this.usuarioLogado = usuario;

            return true;

        } else {

            this.usuarioLogado = null;

            return false;
        }
    }
}