import { Injectable } from '@angular/core';
import { isBrowser } from 'angular2-universal';


@Injectable()
export class ConfigService {

    private isBrowser = isBrowser;

    private hmlConfigurations = {

        URL_APLICACAO: 'brasil.homolog.ibge.gov.br',
        ENDPOINT_SERVICO_DADOS: 'https://servicodados.ibge.gov.br/api/interno'
    };

    private prdConfigurations = {

        URL_APLICACAO: 'cidades.ibge.gov.br',
        ENDPOINT_SERVICO_DADOS: 'https://servicodados.ibge.gov.br/api'
    };

    constructor() { }


    public getConfigurationValue(name: string){

        if(this.isHML()){

            return this.hmlConfigurations[name];
        } 

        return this.prdConfigurations[name];
    }

    public isHML(){

        if(isBrowser && this.hmlConfigurations.URL_APLICACAO == document.location.hostname){

            return true;
        }

        return false;
    }
}