import { ConfigService } from './config/config.service';


export class PESQUISAS {
    get validas() {
        return [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 29, 30, 31, 32, 34, 35, 36, 37, 38, 39, 40, 42, 43];
    }

    isValida(pesquisaId: number) {
        return this.validas.indexOf(pesquisaId) > -1;
    }
};


export class BASES {

    private ENDPOINT_SERVICO_DADOS = new ConfigService().getConfigurationValue('ENDPOINT_SERVICO_BIBLIOTECA') + '/v1';

    get default() {
        return {
            base: (str) => `${this.ENDPOINT_SERVICO_DADOS}/${str}`
        };
    }

    get historico() {
        return {
            base: (codigoLocalidade) => `${this.ENDPOINT_SERVICO_DADOS}/biblioteca?aspas=3&codmun=${codigoLocalidade}`
        }
    }

    get fotos() {
        return {
            lista: (codigoLocalidade) => `${this.ENDPOINT_SERVICO_DADOS}/biblioteca?codmun=${codigoLocalidade}&aspas=3&fotografias=1&serie=Acervo%20dos%20Trabalhos%20Geogr%C3%A1ficos%20de%20Campo|Acervo%20dos%20Munic%C3%ADpios%20brasileiros`,
            bruta: (linkFoto) => `${new ConfigService().getConfigurationValue('URL_BIBLIOTECA')}/visualizacao/fotografias/GEBIS%20-%20RJ/${linkFoto}`,
            redimensionada: (linkFoto: string, width = 600, height = 600) => `${this.ENDPOINT_SERVICO_DADOS}/resize/image?maxwidth=${width}&maxheight=${height}&caminho=www.biblioteca.ibge.gov.br/visualizacao/fotografias/GEBIS%20-%20RJ/${linkFoto}`,
            detalhes: (idFoto) => `${new ConfigService().getConfigurationValue('URL_BIBLIOTECA')}/index.php/biblioteca-catalogo?view=detalhes&id=${idFoto}`,
            download: (linkFoto) => `https://servicodados.ibge.gov.br/Download/Download.ashx?http=1&u=biblioteca.ibge.gov.br/visualizacao/fotografias/GEBIS%20-%20RJ/${linkFoto}`
        }
    }

    get mapas() {
        /**
         * nivel
         * 0 - própria localidade
         * 1 - subdivisões
         */
        return {
            malhaTarsus: (codigoLocalidade, nivel: number) => `${new ConfigService().getConfigurationValue('ENDPOINT_SERVICO_MAPAS')}/mapas/${codigoLocalidade}/${nivel}`
        }
    }
}
