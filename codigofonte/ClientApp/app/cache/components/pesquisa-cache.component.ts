import { Component, OnInit } from '@angular/core';
import { Pesquisa } from '../../shared3/models';
import { PesquisaService3 } from '../../shared3/services';

@Component({
    selector: 'pesquisa-cache',
    template: `
        <p>Pesquisas: {{ pesquisas?.join(', ') }}</p>
        <p>Pesquisa1: {{ pesquisa1 }}</p>
        <p>Pesquisa2: {{ pesquisa2 }}</p>
        <p>PesquisaArray: {{ pesquisaArray?.join(', ') }}</p>
    `
})
export class PesquisaCacheComponent implements OnInit {
    pesquisas: number[]
    pesquisa1: number
    pesquisa2: number
    pesquisaArray: number[]

    constructor(
        private _pesquisaService3: PesquisaService3
    ) {}

    ngOnInit() {
        this._pesquisaService3.getAllPesquisas().subscribe(resp => this.pesquisas = resp.map(pesquisa => pesquisa.id));
        this._pesquisaService3.getPesquisa(13).subscribe(resp => this.pesquisa1 = resp.id)
        this._pesquisaService3.getPesquisa(23).subscribe(resp => this.pesquisa2 = resp.id)
        this._pesquisaService3.getPesquisas([13, 23]).subscribe(resp => this.pesquisaArray = resp.map(pesquisa => pesquisa.id));
    }
}