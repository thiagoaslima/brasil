import { Component, Input, OnChanges, OnInit, SimpleChange } from '@angular/core';
import { Localidade } from '../../shared2/localidade/localidade.model';

import { MapaService } from './mapa.service';

@Component({
    selector: 'ibge-cartograma',
    templateUrl: './ibge-cartograma.component.html',
    styleUrls: [ './ibge-cartograma.component.css' ]
})
export class IBGECartograma implements OnInit, OnChanges{
    @Input() localidade: Localidade;
    @Input() resultados;
    @Input() periodo;
    @Input() titulo;

    municSelected = '';
    valores;
    malha;
    existeVazio = false;

    constructor(
        private _mapaService: MapaService,
    ) {}

    ngOnInit() {
        this.updateCartograma();
    }

    updateCartograma() {
        if(this.localidade) {
            this._mapaService.getMalhaSubdivisao(this.localidade.parent.codigo)
                .subscribe((malha) => {
                    this.malha = malha;
                });
        }

        if(this.resultados) {
            this.existeVazio = false;
            let valores = Object.keys(this.resultados)
                .map((resultadoKey) => this.resultados[resultadoKey])
                .map(resultado => Number.parseFloat(resultado && resultado.valorValidoMaisRecente))
                .filter(val => !Number.isNaN(val))
                .sort( (a, b) => a < b ? -1 : 1);
            
            const len = valores.length;
            const q1 = valores[Math.round(0.25 * (len + 1))];
            const q2 = len % 2 ? valores[(len + 1) / 2] : ((valores[len / 2] + valores[(len / 2) + 1]) / 2).toFixed(2);
            const q3 = valores[Math.round(0.75 * (len + 1))];

            this.valores = [q1, q2, q3];

        }

    }

    getValorMunicipio(codmun: number) {
        return this.resultados
                && this.resultados[codmun]
                && this.resultados[codmun].valorValidoMaisRecente;
    }
    getFaixaMunicipio(codmun: number) {

        let valor = this.getValorMunicipio(codmun);

        let faixa;
        const valorNumerico = Number.parseFloat(valor);
        if (Number.isNaN(valorNumerico)) {
            this.existeVazio = true;
            return 'semValor';
        }

        if (valorNumerico < this.valores[0]) {
            faixa = 'faixa1'
        }
        else if (valorNumerico < this.valores[1]) {
            faixa = 'faixa2'
        }
        else if (valorNumerico < this.valores[2]) {
            faixa = 'faixa3'
        }
        else {
            faixa = 'faixa4'
        }

        return faixa;
    }

    public getCenter(geometries, codigo) {
        if (codigo) {
            let el = geometries.find(item => item.codigo.toString() == codigo.toString().substring(0,6));
            if (el.center)
                return el.center;
            else
                return [0, 0];
        } else {
            return [0, 0];
        }
    }
    public getIconHeight(bbox, pos) {
        return bbox[3]-pos[1];
    }
    public getPercLeftIconPosition(bbox, pos) {
        return Math.round(100*(pos[0]-bbox[0])/(bbox[2]-bbox[0]));
    }
    public getPercRightIconPosition(bbox, pos) {
        return 100 - this.getPercLeftIconPosition(bbox, pos);
    }
    public getPercIconPosition(bbox, pos) {
        let left = this.getPercLeftIconPosition(bbox, pos);
        let right = this.getPercRightIconPosition(bbox, pos);
        return left < right ? {left: left, right: 0, align: 'left', borderLeft: 3, borderRight: 0} : {left: 0, right: right, align: 'right', borderLeft: 0, borderRight: 3};
    }


    ngOnChanges(changes: { [propKey: string]: SimpleChange}) {
        this.updateCartograma();
    }
}