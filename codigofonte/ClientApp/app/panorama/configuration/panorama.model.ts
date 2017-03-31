import { Pesquisa } from '../../shared2/pesquisa/pesquisa.model';
import { Indicador } from '../../shared2/indicador/indicador.model';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

export class PanoramaConfigurationItem {
    public titulo: string
    public subtitulo: string
    public tema: string
    public largura: string
    public link: string
    public pesquisaId: number
    public indicadorId: number
    public unidade: string
    public visualizacao: string
    public indicador: Indicador

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

        if (data.indicador && data.indicador instanceof Indicador) {
            this.indicador = data.indicador;
        } else {
            this.indicador = null;
        }
    }
}

export const PanoramaVisualizacao = {
    graficoLinha: "linha",
    graficoBarra: "barra",
    mapa: "cartograma",
    numerico: "numero",
    painel: "painel"
}

export type PanoramaItem = {
    tema: string, 
    painel: PanoramaConfigurationItem[]
    graficos: PanoramaConfigurationItem[]
}

export type PanoramaDescriptor = PanoramaItem[]
