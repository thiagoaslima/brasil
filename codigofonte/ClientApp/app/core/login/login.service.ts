import { Injectable, Inject, PLATFORM_ID } from '@angular/core';


@Injectable()
export class LoginService {

    private usuarioLogado: string;


    constructor() { 

    }
    

    public isLogado(){

        // Verifica se o usuário já está logado
        if(!!this.usuarioLogado){

            return true;
        }

        // Verifica se o usuário já se logou em algum momento e 
        // valida se o token ainda é válido para que não 
        // precise ficar digitando a senha varia vezes no mesmo dia
        let codigo = this.getCookie('brasilemsintese.autorizacao');
        if(!!codigo && this.verificaCodigo(codigo)){

            this.usuarioLogado = 'ibge';

            return true;
        }

        return false;
    }

    public logar(usuario: string, senha: string){

        let loginValido: string = 'ibge';

        // if(usuario == loginValido && senha == senhaValida){
        if(usuario == loginValido && this.verificaCodigo(senha)){

            this.usuarioLogado = usuario;

            // armazema o acesso do usuário em um token
            this.setCookie('brasilemsintese.autorizacao', senha, 1);

            return true;

        } else {

            this.usuarioLogado = null;

            return false;
        }
    }


    public verificaCodigo(cod:string) {
        let getWeekNumber = function(date){
            var d:any = new Date(+date);
            d.setHours(0,0,0,0);
            d.setDate(d.getDate()+4-(d.getDay() || 7));
            let jan:any = new Date(d.getFullYear(),0,1);
            return Math.ceil((((d-jan)/8.64e7)+1)/7);
        };

        var geraCodigo_old = function(numSemana, numAno) {
            return (((numSemana*100 + numSemana) - numAno) + 5432)%10000;
        }

        var geraCodigo = function(numSemana, numAno) {
            var x = numSemana;
            var x_2 = numSemana*(numSemana - numAno%100);
            var x_3 = numSemana*(numSemana - numAno%100)*numSemana;

            return ((534*x + 132*x_2 - x_3) + 150432)%9000 + 1000;
        }

        let hoje = new Date();
        let numSemana = getWeekNumber(hoje);
        let numAno = hoje.getFullYear();

        let codigoCerto = geraCodigo(numSemana, numAno);

        return cod === codigoCerto.toString();
    }

    private setCookie(cname, cvalue, exdays) {

        let d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        let expires = "expires="+ d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    private getCookie(cname) {

        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');

        for(let i = 0; i <ca.length; i++) {

            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }

            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }

        return "";
    }
}