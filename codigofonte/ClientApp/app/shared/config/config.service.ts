import { PLATFORM_ID, Inject, Injectable } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export const ENDPOINT = {
    SERVICO_DADOS: 'ENDPOINT_SERVICO_DADOS',
    SERVICO_DADOS_CONJUNTURAIS: 'ENDPOINT_SERVICO_DADOS_CONJUNTURAIS',
    SERVICO_MAPAS: 'ENDPOINT_SERVICO_MAPAS',
    SERVICO_BIBLIOTECA: 'ENDPOINT_SERVICO_BIBLIOTECA'
}

@Injectable()
export class ConfigService {

    private isBrowser;


    // CONFIGURAÇÕES PARA O AMBIENTE DE HOMOLOGAÇÃO
    private hmlConfigurations = {
        
        URL_APLICACAO: 'brasilhomolog.ibge.gov.br',
        URL_APLICACAO_ALTERNATIVA: 'brasil.homolog.ibge.gov.br',
        URL_BIBLIOTECA: 'https://www.biblioteca.ibge.gov.br',

        ENDPOINT_SERVICO_DADOS: 'https://servicodados.ibge.gov.br/api/interno',
        ENDPOINT_SERVICO_DADOS_CONJUNTURAIS: 'https://servicodados.ibge.gov.br/api',
        ENDPOINT_SERVICO_MAPAS: 'https://servicomapas.ibge.gov.br/api',
        ENDPOINT_SERVICO_BIBLIOTECA: 'https://servicodados.ibge.gov.br/api'
    };


    // CONFIGURAÇÕES PARA O AMBIENTE DE PRODUÇÃO
    private prdConfigurations = {

        URL_APLICACAO: 'cidades.ibge.gov.br',
        URL_BIBLIOTECA: 'https://www.biblioteca.ibge.gov.br',

        ENDPOINT_SERVICO_DADOS: 'https://servicodados.ibge.gov.br/api',
        ENDPOINT_SERVICO_DADOS_CONJUNTURAIS: 'https://servicodados.ibge.gov.br/api',
        ENDPOINT_SERVICO_MAPAS: 'https://servicomapas.ibge.gov.br/api',
        ENDPOINT_SERVICO_BIBLIOTECA: 'https://servicodados.ibge.gov.br/api'
    };

    constructor(
        @Inject(PLATFORM_ID) platformId: string = "server",
    ) {
        this.isBrowser = isPlatformBrowser(PLATFORM_ID);
    }


    public getConfigurationValue(name: string){

        if(this.isHML()){

            console.log('-------------------------------------------------\n' +
                        '------------ AMBIENTE DE HOMOLOGAÇÃO ------------\n' +
                        '-------------------------------------------------')

            return this.hmlConfigurations[name];
        } 

        return this.prdConfigurations[name];
    }

    public isHML(){

        if(this.isBrowser && (this.hmlConfigurations.URL_APLICACAO == document.location.hostname || this.hmlConfigurations.URL_APLICACAO_ALTERNATIVA == document.location.hostname)){

            return true;
        }

        return false;
    }
}