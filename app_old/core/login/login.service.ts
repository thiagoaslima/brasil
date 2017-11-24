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

        // if(usuario == loginValido && senha == senhaValida){
        if(usuario == loginValido && this.verificaCodigo(senha)){

            this.usuarioLogado = usuario;

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
}