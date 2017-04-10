import { Pesquisa } from '../../shared2/pesquisa/pesquisa.model';
import { Indicador } from '../../shared2/indicador/indicador.model';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

export type GraficoConfiguration = {
    tipo: string,
    titulo: string,
    subtitulo?: string,
    dados: Array<{
        indicadorId: number,
        pesquisaId: number,
        indicador: Indicador
    }>
}

export class PanoramaConfigurationItem {
    public titulo: string
    public subtitulo: string
    public tema: string
    public largura: string
    public link: string
    public pesquisaId: number
    public indicadorId: number
    public unidade: string
    public periodo: string
    public visualizacao: string
    public indicador: Indicador
    public grafico: GraficoConfiguration;

    constructor(data) {
        this.titulo = data.titulo || "";
        this.subtitulo = data.subtitulo || "";
        this.tema = data.tema;
        this.largura = data.largura || "full";
        this.link = data.link || "";
        this.pesquisaId = data.pesquisaId || 0;
        this.indicadorId = data.indicadorId || 0;
        this.unidade = data.unidade || "";
        this.visualizacao = data.visualizacao;
        this.periodo = data.periodo || "";

        if (data.indicador && data.indicador instanceof Indicador) {
            this.indicador = data.indicador;
        } else {
            this.indicador = null;
        }

        if (data.grafico && data.grafico.dados && data.grafico.dados.length) {
            this.grafico = Object.assign(
                {},
                data.grafico,
                {
                    dados: data.grafico.dados.map(obj => {
                        if (obj.indicador === undefined) {
                            obj.indicador = null;
                        }
                        return obj;
                    })
                });
            if (this.grafico.titulo === undefined) {
                this.grafico.titulo = this.titulo;
            }
        } else {
            this.grafico = null;
        }
    }
}

export const PanoramaVisualizacao = {
    grafico: "grafico",
    mapa: "cartograma",
    numerico: "numero",
    painel: "painel"
}

export type PanoramaItem = {
    tema: string,
    painel: PanoramaConfigurationItem[]
    grafico: PanoramaConfigurationItem[]
    cartograma: PanoramaConfigurationItem[]
    numero: PanoramaConfigurationItem[]
}

export type PanoramaDescriptor = PanoramaItem[]
