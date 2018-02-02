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
    ViewChild
} from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';

import { TEMAS } from '../../panorama2/configuration';
import { Panorama2Service } from '../panorama.service';
import { ModalErrorService } from '../../core/modal-erro/modal-erro.service';
import { TraducaoService } from '../../traducao/traducao.service';


@Component({
    selector: 'panorama-resumo',
    templateUrl: './panorama-resumo.template.html',
    styleUrls: ['./panorama-resumo.style.css']
})
export class PanoramaResumoComponent implements OnInit, OnChanges, OnDestroy {

    @Input() configuracao = [];
    @Input() localidade = null;
    @Input() resultados = [];

    public static NUM_MAXIMO_INDICADORES_FILTRO = 6;
    public icones: { [tema: string]: string } = {};
    public cabecalho = [];
    public temas = [];
    public notas = [];
    public fontes = [];
    public opcoesIndicadores = [];
    public isHeaderStatic: Observable<boolean>;
    public exibirFontesENotas = false;
    public IsMobileService: boolean;
    public exibirFiltroResumo = false;
    public sinteseEstadoUrl;
    public temasModalFiltroPanorama;
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

    public get lang() {
        return this._traducaoServ.lang;
    }

    constructor(
        private _panoramaService: Panorama2Service,
        private modalErrorService: ModalErrorService,
        private _traducaoServ: TraducaoService

    ) {
        this.setIcones();

    }

    ngOnInit() {
        this.isHeaderStatic = this._scrollTop$.debounceTime(100).map(scrollTop => scrollTop > 100).distinctUntilChanged();
        this.temasModalFiltroPanorama = this._panoramaService.getConfiguracao('municipio').filter(ind => ind.tema && ind.tema != "");


    }

    selecionaIndicadoresFiltro(item, idx, event) {

        if (this.opcoesIndicadores && this.opcoesIndicadores.length < PanoramaResumoComponent.NUM_MAXIMO_INDICADORES_FILTRO) {

            if (event.target.checked) {
                this.opcoesIndicadores.push(item.indicadorId);
            }
        } else if (event.target.checked) {
            event.target.checked = false;
            event.stopPropagation();
            let mensagem = this._traducaoServ.L10N(this._traducaoServ.lang, 'panorama_resumo__numero_maximo_indicadores_selecionados');
            alert(mensagem)


        }
        if (!event.target.checked) {
            this.opcoesIndicadores = this.opcoesIndicadores.filter(ind => {
                if (item.indicadorId != ind) {return ind; }
            })
        }


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

                    if (resultado.notas.length === 0) {

                        return false;
                    }

                    for (let i = 0; i < resultado.notas.length; i++) {

                        if (resultado.notas[i]['periodo'] === resultado.periodo || resultado.notas[i]['periodo'] === '-') {

                            return true;
                        }
                    }

                    return false;

                }).map(resultado => {

                    for (let i = 0; i < resultado.notas.length; i++) {

                        if (resultado.notas[i]['periodo'] == resultado.periodo || resultado.notas[i]['periodo'] === '-') {

                            return {titulo: resultado.titulo, texto: resultado.notas[i]['notas'].join(', ')};
                        }
                    }
                });

                this.fontes = resp.reduce((agg, resultado) => {
                    const fontes = resultado.fontes.filter(f => f.periodo === resultado.periodo || f.periodo === '-');
                    if (fontes.length > 0) {
                        agg.push({ titulo: resultado.titulo, texto: fontes[0]['fontes'].join(', ') });
                    }
                    return agg;
                }, []);
            },
                error => {
                    console.error(error);
                    this.modalErrorService.showError();
                });
        }
    }
    gerarSinteseEstado() {

        let indicadores = this.getIndicadoresSelecionados();
        if (indicadores != null && indicadores.length > 0) {
            this.sinteseEstadoUrl = '/brasil/sintese/' + this.localidade.sigla.toLowerCase() + '?indicadores=' + indicadores.join(',');
            window.open(this.sinteseEstadoUrl, '_blank');
        } else {

            let mensagem = this._traducaoServ.L10N(this._traducaoServ.lang, 'panorama_resumo__numero_minimo_indicadores_selecionados');
            alert(mensagem);
        }

    }
    getIndicadoresSelecionados() {
        return this.opcoesIndicadores.filter(res => res !== false);
    }

    ngOnDestroy() {
        this._scrollTop$.complete();
        this._scrollTop$ = null;
    }

    fireTemaSelecionado(tema) {
        if (this.temaAtual === tema) {
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
            // this.icones[label] = `./img/ico/${icon}`;
            this.icones[label] = `${icon}`;
        });
    }

}