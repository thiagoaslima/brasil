import { Component, Input, OnChanges, OnInit, SimpleChange, ViewChild, ElementRef } from '@angular/core';

import {
    TraducaoService,
    Indicador,
    Localidade,
} from '../../shared';

import { MapaService } from './mapa.service';

const FileSaver = require('file-saver');

@Component({
    selector: 'ibge-cartograma',
    templateUrl: './ibge-cartograma.component.html',
    styleUrls: ['./ibge-cartograma.component.css']
})
export class IBGECartograma implements OnInit, OnChanges {
    @Input() indicador: Indicador;
    @Input() localidade: Localidade;
    @Input() localidadesMarcadas: Localidade[];
    @Input() resultados;
    @Input() periodo;
    @Input() titulo;

    @ViewChild("mapa") mapa: ElementRef;

    municSelected = '';
    valores;
    malha;

    carregando;

    strokeWidth = 0.001;

    ampliado = false;
    
    public get lang() {
        return this._traducaoServ.lang;
    }

    constructor(
        private _mapaService: MapaService,
        private _traducaoServ: TraducaoService
    ) { }

    ngOnInit() {
        this.updateCartograma();
    }

     ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
        this.updateCartograma();
    }

    updateCartograma() {
        this.carregando = true;

        if (this.localidade) {
            if (this.localidade.tipo === "pais") {
                this._mapaService.getMalhaSubdivisao(undefined)
                    .subscribe((malha) => {
                        this.setMalha(malha);
                    });
            } else {
                this._mapaService.getMalhaSubdivisao(this.localidade.codigo)
                    .subscribe((malha) => {
                        this.setMalha(malha);
                    });
            }
        }

        if (this.resultados) {
            let valores = Object.keys(this.resultados)
                .map((resultadoKey) => this.resultados[resultadoKey])
                .map(resultado => {
                    let valor;
                    // resultado && resultado.getValor(this.periodo)
                    if (this.periodo) {
                        valor = resultado && resultado.getValor(this.periodo);
                    } else {
                        valor = resultado && resultado.valorMaisRecente;
                    }
                    return Number.parseFloat(valor);
                })
                .filter(val => !Number.isNaN(val))
                .filter(this._isValorValido)
                .sort((a, b) => a < b ? -1 : 1);
            

            if(valores && valores.length > 0) {
                const len = valores.length;
                const q1 = valores[Math.round(0.25 * (len + 1))];
                const q2 = len % 2 ? valores[(len + 1) / 2] : ((valores[len / 2] + valores[(len / 2) + 1]) / 2).toFixed(2);
                const q3 = valores[Math.round(0.75 * (len + 1))];

                this.valores = [q1, q2, q3];
            } else {
                valores = [];
            }

        }

    }

    setMalha(malha) {
        this.malha = malha;
        let [minX, minY, width, height] = this.malha.viewBox.split(" ").map(parseFloat);

        this.strokeWidth = Math.max(width, height)/1000;

        this.carregando = false;
    }

    get marcadores() {
        let [minX, minY, width, height] = this.malha.viewBox.split(" ").map(parseFloat);
        let marcadorSize = (Math.max(width, height)/15);

        let marcadores = this.localidadesMarcadas.map((localidade) => {

        });
        return this.localidadesMarcadas.map((localidade) => {
            return {
                x: this.getCenter(this.malha.geometries, localidade.codigo)[0] - marcadorSize/2,
                y: this.getCenter(this.malha.geometries, localidade.codigo)[1] - marcadorSize/2,
                width: marcadorSize,
                height: marcadorSize
            }
        });
    }

    getValorMunicipio(codmun: number) {
        let valor;

        let resultado = this.resultados && this.resultados[codmun];

        if (this.periodo) {
            valor = resultado && resultado.getValor(this.periodo);
        } else {
            valor = resultado && resultado.valorMaisRecente;
        }

        return valor;
    }

    private _isValorValido(valor) {
        let valoresInvalidos = [
            '99999999999999',
            '99999999999998',
            '99999999999997',
            '99999999999996',
            '99999999999995',
            '99999999999992',
            '99999999999991'
        ];

        return valoresInvalidos.findIndex((v) => v == valor.toString()) === -1;
    }

    getFaixaMunicipio(codmun: number) {

        let valor = this.getValorMunicipio(codmun);

        let faixa;
        const valorNumerico = Number.parseFloat(valor);
        if (this.valores && this.valores.length == 0 || !this._isValorValido(valorNumerico) || Number.isNaN(valorNumerico)) {
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

    getFillMunicipio(codmun: number) {

        let valor = this.getValorMunicipio(codmun);

        let faixa;
        const valorNumerico = Number.parseFloat(valor);
        if (this.valores && this.valores.length == 0 || !this._isValorValido(valorNumerico) || Number.isNaN(valorNumerico)) {
            return '#999';
        }

        if (valorNumerico < this.valores[0]) {
            faixa = '#7fcdbb'
        }
        else if (valorNumerico < this.valores[1]) {
            faixa = '#41b6c4'
        }
        else if (valorNumerico < this.valores[2]) {
            faixa = '#308bc9'
        }
        else {
            faixa = '#1b779b'
        }

        return faixa;
    }

    public getCenter(geometries, codigo) {
        if (codigo) {
            let el = geometries.find(item => item.codigo.toString() == codigo.toString().substring(0, 6));
            if (el && el.center)
                return el.center;
            else
                return [0, 0];
        } else {
            return [0, 0];
        }
    }
    public getIconHeight(bbox, pos) {
        return bbox[3] - pos[1];
    }
    public getPercLeftIconPosition(bbox, pos) {
        return Math.round(100 * (pos[0] - bbox[0]) / (bbox[2] - bbox[0]));
    }
    public getPercRightIconPosition(bbox, pos) {
        return 100 - this.getPercLeftIconPosition(bbox, pos);
    }
    public getPercIconPosition(bbox, pos) {
        let left = this.getPercLeftIconPosition(bbox, pos);
        let right = this.getPercRightIconPosition(bbox, pos);
        return left < right ? { left: left, right: 0, align: 'left', borderLeft: 3, borderRight: 0 } : { left: 0, right: right, align: 'right', borderLeft: 0, borderRight: 3 };
    }

    download(){
        //baixa o svg
        let blob = new Blob([this.mapa.nativeElement.innerHTML], { type: "image/svg+xml" });
        FileSaver.saveAs(blob, "mapa.svg");

        //baixa o csv
        let csv = '"Local", "' + this.titulo + '"\r\n';
        for(let i = 0; i < this.malha.geometries.length; i++){
            let item = this.malha.geometries[i];
            csv += '"' + item.nome + '", ' + this.getValorMunicipio(item.codigo) +'\r\n';
        }
        blob = new Blob([csv], { type: "text/csv" });
        FileSaver.saveAs(blob, "mapa.csv");
    }
   
}