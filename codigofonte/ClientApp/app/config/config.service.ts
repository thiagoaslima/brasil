import { Injectable } from '@angular/core';
import { isBrowser } from 'angular2-universal';


@Injectable()
export class ConfigService {

    private isBrowser = isBrowser;


    // CONFIGURAÇÕES PARA O AMBIENTE DE HOMOLOGAÇÃO
    private hmlConfigurations = {

        URL_APLICACAO: 'brasilhomolog.ibge.gov.br',
        URL_APLICACAO_ALTERNATIVA: 'brasil.homolog.ibge.gov.br',
        URL_BIBLIOTECA: 'https://www.biblioteca.ibge.gov.br',

        ENDPOINT_SERVICO_DADOS: 'https://servicodados.ibge.gov.br/api/interno',
        ENDPOINT_SERVICO_BIBLIOTECA: 'https://servicodados.ibge.gov.br/api',
        ENDPOINT_SERVICO_MAPAS: 'https://servicomapas.ibge.gov.br/api'
    };


    // CONFIGURAÇÕES PARA O AMBIENTE DE PRODUÇÃO
    private prdConfigurations = {

        URL_APLICACAO: 'cidades.ibge.gov.br',
        URL_BIBLIOTECA: 'https://www.biblioteca.ibge.gov.br',

        ENDPOINT_SERVICO_DADOS: 'https://servicodados.ibge.gov.br/api',
        ENDPOINT_SERVICO_BIBLIOTECA: 'https://servicodados.ibge.gov.br/api',
        ENDPOINT_SERVICO_MAPAS: 'https://servicomapas.ibge.gov.br/api'
    };

    constructor() { }


    public getConfigurationValue(name: string){

        if(this.isHML()){

            console.log('-------------------------------------------------')
            console.log('------------ AMBIENTE DE HOMOLOGAÇÃO ------------')
            console.log('-------------------------------------------------')

            return this.hmlConfigurations[name];
        } 

        return this.prdConfigurations[name];
    }

    public isHML(){

        if(isBrowser && (this.hmlConfigurations.URL_APLICACAO == document.location.hostname || this.hmlConfigurations.URL_APLICACAO_ALTERNATIVA == document.location.hostname)){

            return true;
        }

        return false;
    }
}