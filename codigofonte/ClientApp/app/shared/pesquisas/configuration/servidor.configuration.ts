export enum EscopoIndicadores {
    'proprio',
    'filhos',
    'arvore',
}

type ResultadosUrlParams = { pesquisaId: number, indicadorId: number, codigoLocalidade: number, periodo: string }


export class ServidorPesquisas {
    private _path = `http://servicodados.ibge.gov.br/api/v1`;

    private _dicionarioEscoposServer = {
        [EscopoIndicadores.proprio]: 'base',
        [EscopoIndicadores.filhos]: 'one',
        [EscopoIndicadores.arvore]: 'sub'
    }

    custom(str) {
        return `${this._path}/${str}`;
    }


    // PESQUISAS
    // ======================================================

    pesquisas() {
        return this.custom('pesquisas');
    }

    pesquisa(pesquisaId: number) {
        return this.custom(`pesquisas/${pesquisaId}`);
    }




    // INDICADORES
    // ======================================================

    indicadoresPesquisa(pesquisaId: number) {
        return this.custom(`pesquisas/${pesquisaId}/periodos/all/indicadores`);
    }

    indicadorByPosicao(pesquisaId: number, posicaoIndicador: string, codigoLocalidade?) {
        let queryArgs = codigoLocalidade ? `&codigoLocalidade=${codigoLocalidade}` : '';
        return this.custom(`pesquisas/${pesquisaId}/periodos/all/indicadores/${posicaoIndicador}?scope=base${queryArgs}`);
    }

    indicadoresFilhos(pesquisaId: number, posicaoIndicadorPai: string = '0', codigoLocalidade?: number | string, escopo = EscopoIndicadores.filhos) {
        let queryArgs = codigoLocalidade ? `&codigoLocalidade=${codigoLocalidade}` : '';
        return this.custom(`pesquisas/${pesquisaId}/periodos/all/indicadores/${posicaoIndicadorPai}?scope=${this._dicionarioEscoposServer[escopo]}${queryArgs}`);
    }




    // RESULTADOS
    // ======================================================

    resultadosIndicador({ pesquisaId, indicadorId, codigoLocalidade, periodo }: { pesquisaId: number, indicadorId: number, codigoLocalidade: string, periodo: string }) {
        return this.custom(`pesquisas/${pesquisaId}/periodos/${periodo}/resultados?indicadores=${indicadorId}&localidade=${codigoLocalidade}`);
    }

    resultadosIndicadoresFilhos({ pesquisaId, posicaoIndicador, codigoLocalidade, periodo, escopo = EscopoIndicadores.filhos }: { pesquisaId: number, posicaoIndicador: string, codigoLocalidade: string, periodo: string, escopo?: EscopoIndicadores }) {
        return this.custom(`pesquisas/${pesquisaId}/periodos/${periodo}/indicadores/${posicaoIndicador}/resultados?localidade=${codigoLocalidade}&scope=one`);
    }

    resultadosLocalidade({ pesquisaId, indicadoresId, codigoLocalidade, periodo }: { pesquisaId: number, indicadoresId?: number | number[], codigoLocalidade: number, periodo: string }) {
        indicadoresId = Array.isArray(indicadoresId) ? indicadoresId : [indicadoresId];
        const indicadoresParams = indicadoresId.length ? `indicadores=${indicadoresId.join(',')}` : '';
        const localidadeParams = `localidade=${codigoLocalidade}`;

        const queryParams = [localidadeParams, indicadoresParams].filter(val => !!val).join('&');

        return this.custom(`pesquisas/${pesquisaId}/periodos/${periodo}/resultados?${queryParams}`);
    }



    // MIXED
    // ================================================================
    indicadoresComResultados({
        pesquisaId,
        posicaoIndicador = 0,
        codigoLocalidade,
        escopo = EscopoIndicadores.filhos }: {
            pesquisaId: number,
            posicaoIndicador: string,
            codigoLocalidade: string | number | Array<number | string>,
            escopo: EscopoIndicadores
        }) {
        codigoLocalidade = Array.isArray(codigoLocalidade) ? codigoLocalidade : [codigoLocalidade];

        const scopeParams = `scope=${this._dicionarioEscoposServer[escopo]}`;
        const localidadeParams = `localidade=${codigoLocalidade.join(',')}`;
        const queryParams = `${[scopeParams, localidadeParams].join('&')}`;

        return this.custom(`pesquisas/${pesquisaId}/periodos/all/indicadores/${posicaoIndicador}?${queryParams}`);
    }
}
