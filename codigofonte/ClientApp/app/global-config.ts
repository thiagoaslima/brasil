export class PESQUISAS {
    get validas() {
        return [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 42, 43, 44];
    }

    isValida(pesquisaId: number) {
        return this.validas.indexOf(pesquisaId) > -1;
    }
};


export class BASES {
    get default() {
        return {
            base: (str) => `http://servicodados.ibge.gov.br/api/v1/${str}`
        };
    }

    get historico() {
        return {
            base: (codigoLocalidade) => `http://servicodados.ibge.gov.br/api/v1/biblioteca?aspas=3&codmun=${codigoLocalidade}`
        }
    }

    get fotos() {
        return {
            lista: (codigoLocalidade) => `http://servicodados.ibge.gov.br/api/v1/biblioteca?codmun=${codigoLocalidade}&aspas=3&fotografias=1&serie=Acervo%20dos%20Trabalhos%20Geogr%C3%A1ficos%20de%20Campo|Acervo%20dos%20Munic%C3%ADpios%20brasileiros`,
            bruta: (linkFoto) => `http://www.biblioteca.ibge.gov.br/visualizacao/fotografias/GEBIS%20-%20RJ/${linkFoto}`,
            redimensionada: (linkFoto: string, width = 600, height = 600) => `http://servicodados.ibge.gov.br/api/v1/resize/image?maxwidth=${width}&maxheight=${height}&caminho=www.biblioteca.ibge.gov.br/visualizacao/fotografias/GEBIS%20-%20RJ/${linkFoto}`,
            detalhes: (idFoto) => `http://www.biblioteca.ibge.gov.br/index.php/biblioteca-catalogo?view=detalhes&id=${idFoto}`,
            download: (linkFoto) => `http://servicodados.ibge.gov.br/Download/Download.ashx?http=1&u=biblioteca.ibge.gov.br/visualizacao/fotografias/GEBIS%20-%20RJ/${linkFoto}`
        }
    }

    get mapas() {
        /**
         * nivel
         * 0 - própria localidade
         * 1 - subdivisões
         */
        return {
            malhaTarsus: (codigoLocalidade, nivel: number) => `http://servicomapas.ibge.gov.br/api/mapas/${codigoLocalidade}/${nivel}`
        }
    }
}
