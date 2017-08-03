import {
    Component,
    EventEmitter,
    HostListener,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChange,
} from '@angular/core';

import { TEMAS } from '../../panorama2/configuration';
import { Panorama2Service } from '../panorama.service';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';

@Component({
    selector: 'panorama-resumo',
    templateUrl: './panorama-resumo.template.html',
    styleUrls: ['./panorama-resumo.style.css']
})
export class PanoramaResumoComponent implements OnInit, OnChanges, OnDestroy {

    @Input() configuracao = [];
    @Input() localidade = null;
    @Input() resultados = [];

    public icones: { [tema: string]: string } = {};
    public cabecalho = [];
    public temas = [];
    public notas = [];
    public fontes = [];
    public isHeaderStatic: Observable<boolean>;
    public exibirFontesENotas = false;

    private _scrollTop$ = new BehaviorSubject(0);

    private nota;

    @Output() temaSelecionado = new EventEmitter();
    temaAtual = '#po';

    @HostListener('window:scroll', ['$event']) onScroll({ target }) {
        if (target) {
            let scrollTop = target.body.scrollTop;
            this._scrollTop$.next(scrollTop);
        }
    }

    constructor(
        private _panoramaService: Panorama2Service
    ) {
        this.setIcones();
    }

    ngOnInit() {
        this.isHeaderStatic = this._scrollTop$.debounceTime(100).map(scrollTop => scrollTop > 100).distinctUntilChanged();
    }

    ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
        this.nota = false;

        if (
            changes.hasOwnProperty('configuracao') && changes.configuracao.currentValue && changes.configuracao.currentValue.length > 0 ||
            changes.hasOwnProperty('localidade') && changes.localidade.currentValue &&
            this.localidade && this.configuracao && this.configuracao.length > 0
        ) {
            this._panoramaService.getResumo(this.configuracao, this.localidade).subscribe(resp => {

                let temas = resp.slice(0);
                let cabecalho = [];
                let i = 0;
                while (temas[i].tema === '') {
                    cabecalho.push(temas.shift());
                }

                this.cabecalho = cabecalho;
                this.temas = temas;

                this.notas = resp.filter(resultado => {
                    return resultado.notas.length > 0
                        && (
                            resultado.notas[0]['periodo'] === resultado.periodo
                            || resultado.notas[0]['periodo'] === '-'
                        );
                }).map(resultado => `${resultado.titulo}: ${resultado.notas[0]['notas']}`);

                this.fontes = resp.filter(resultado => {
                    return !!resultado.fontes
                        && resultado.fontes.length > 0
                        && (
                            resultado.fontes[0]['periodo'] === resultado.periodo
                            || resultado.fontes[0]['periodo'] === '-'
                        );
                }).map(resultado => `${resultado.titulo}: ${resultado.fontes[0]['fontes']}`);
            });
        }
    }

    ngOnDestroy() {
        this._scrollTop$.complete();
        this._scrollTop$ = null;
    }

    fireTemaSelecionado(tema) {
        if (this.temaAtual == tema) {
            this.temaSelecionado.emit(tema + '-alt');
            this.temaAtual = '';
        } else {
            this.temaSelecionado.emit(tema);
            this.temaAtual = tema;
        }
    }

    getNotaEspecial(idLocalidade, idIndicador) {

        return this._panoramaService.getNotaEspecial(idLocalidade, idIndicador);
    }

    private setIcones(): void {
        Object.keys(TEMAS).forEach(key => {
            let { label, icon } = TEMAS[key];
            this.icones[label] = `./img/ico/${icon}`;
        });
    }

}