import { Component, OnInit } from "@angular/core";
import { SinteseService } from "../panorama/sintese/sintese.service";
import { RouterParamsService } from "../shared/router-params.service";
import { IndicadorService3, LocalidadeService3, PesquisaService3, TraducaoService, Pesquisa, Localidade } from "../shared/index";
import { ModalErrorService } from "../core/index";
import { AnalyticsService } from "../shared/analytics.service";
import { Observable } from "rxjs/Observable";

// Biblioteca usada no download de arquivos.
// Possui um arquivo de definição de tipos file-saver.d.ts do typings.
const FileSaver = require('file-saver');
const json2csv = require('json2csv');

@Component({
    selector: 'dump-csv',
    templateUrl: 'dump2.component.html',
    styles: [`
        .success {
            color: green;
        }
        .fail {
            color: red;
        }
    `]
})
export class Dump2Component implements OnInit {
    lista$;
    localidades: Partial<Localidade>[] = [];
    pesquisas: Pesquisa[] = [];
    canStart = false;

    downloading = '';

    constructor(
        // TODO: Retirar SinteseService e usar PesquisaService e/ou IndicadrService
        private _sintese: SinteseService,
        private _routerParamsService: RouterParamsService,
        private _indicadorService: IndicadorService3,
        private _localidadeService: LocalidadeService3,
        private _pesquisaService: PesquisaService3,
        private modalErrorService: ModalErrorService,
        private _traducaoServ: TraducaoService,
        private _analyticsService: AnalyticsService
    ) { }

    pesquisasBaixadas: Pesquisa[] = [];
    localidadesBaixadas: Partial<Localidade>[][] = [];

    pesquisasErro: Pesquisa[] = [];
    localidadesErro: Partial<Localidade>[][] = [];

    trackByFn(index, item) { return index; }

    public ngOnInit() {
        this.lista$ = this._pesquisaService.getAllPesquisas().map(pesquisas => pesquisas.sort((a, b) => {
            if (this.isCenso(a) && !this.isCenso(b)) { return 1; }
            return a.nome > b.nome ? 1 : -1;
        }));

        this.localidades = [{ identificador: 'pais', tipo: '', nome: 'pais', codigo: -1 }, this._localidadeService.getPais()].concat(this._localidadeService.getAllUfs().sort((a, b) => a.slug > b.slug ? 1 : -1));

        this.lista$.subscribe(ps => {
            this.pesquisas = ps
            this.canStart = true;
        });
    }

    private isCenso(pesquisa: Pesquisa) {
        return [23, 24].includes(pesquisa.id);
    }

    start(indexPesquisa = 0, indexLocalidade = 0) {

        return this.download({
            pesquisa: this.pesquisas[indexPesquisa],
            localidade: this.localidades[indexLocalidade]
        }).subscribe(
            ({ pesquisa, localidade, csv }) => {
                let nome = localidade.identificador == 'pais' ? 'Brasil' : localidade.identificador == 'brasil' ? 'UFS' : localidade.identificador;
                this.downloadCSVFile(csv, `${pesquisa.nome}-${nome}`)

                if (!this.pesquisasBaixadas.includes(pesquisa)) {
                    this.pesquisasBaixadas.push(pesquisa);
                }

                const idx = this.pesquisasBaixadas.indexOf(pesquisa);

                if (!this.localidadesBaixadas[idx]) {
                    this.localidadesBaixadas[idx] = [];
                }

                this.localidadesBaixadas[idx].push(localidade);

                if (++indexLocalidade < this.localidades.length) {
                    this.start(indexPesquisa, indexLocalidade);
                } else if (++indexPesquisa < this.pesquisas.length) {
                    this.start(indexPesquisa, 0);
                }
            },
            (err) => {
                this.downloading = '';
                const pesquisa = this.pesquisas[indexPesquisa];
                const localidade = this.localidades[indexLocalidade];

                if (!this.pesquisasErro.includes(pesquisa)) {
                    this.pesquisasErro.push(pesquisa);
                }

                const idx = this.pesquisasErro.indexOf(pesquisa);

                if (!this.localidadesErro[idx]) {
                    this.localidadesErro[idx] = [];
                }

                this.localidadesErro[idx].push(localidade);

                if (++indexLocalidade < this.localidades.length) {
                    this.start(indexPesquisa, indexLocalidade);
                } else if (++indexPesquisa < this.pesquisas.length) {
                    this.start(indexPesquisa, 0);
                }
            }
            )
    }

    public download({ pesquisa, localidade }: { pesquisa: Pesquisa, localidade: Partial<Localidade> }) {

        this.downloading = `${pesquisa.nome} - ${localidade.identificador}`;

        return this._sintese.getPesquisaCompletaLocalidades(pesquisa.id, localidade.codigo, '0')
            .map(resp => ({ pesquisa, localidade, resp }))
            .flatMap(({ pesquisa, localidade, resp }) => {
                return this._sintese.getInfoPesquisa(pesquisa.id.toString()).map(info => {
                    this.downloading = '';
                    let periodosDisponiveis = info.periodos.map(obj => obj.periodo);

                    var fields = ['posicao', 'nome', 'resultado.nomeLocalidade', ...periodosDisponiveis.map(periodo => `resultado.res.${periodo}`), 'unidade', 'multiplicador'];
                    var fieldNames = ['Posição', 'Nome', 'Localidade', ...periodosDisponiveis, 'Unidade', 'Multiplicador'];

                    let csv = json2csv({ data: resp, fields, fieldNames: fieldNames, unwindPath: ['resultado', 'resultado.res'] });

                    //fontes e notas
                    csv = csv + this.obterFontesENotasPesquisaEmCSV(pesquisa);

                    return csv;
                }).map(csv => ({ pesquisa, localidade, csv }))
            });


        /*
                let localidadeSelecionada = this._localidadeService.getLocalidadesByCodigo(this.localidades[0])[0];
                let posicaoIndicadorSelecionado = this.indicadores[0].posicao;
                
                // Recupera os indicadores e seus resultados
                this._sintese.getPesquisaCompletaLocalidades(this.pesquisa.id, !!localidadeSelecionada.parent ? localidadeSelecionada.parent.codigo : localidadeSelecionada.codigo, posicaoIndicadorSelecionado).subscribe(res => {
        
                    this._sintese.getInfoPesquisa(this.pesquisa.id.toString()).subscribe(pesquisa => {
        
                        let periodosDisponiveis = pesquisa.periodos.map(info => info.periodo );
        
                        var fields = ['posicao', 'nome', 'resultado.nomeLocalidade', ...periodosDisponiveis.map(periodo => `resultado.res.${periodo}`), 'unidade', 'multiplicador'];
                        var fieldNames = ['Posição', 'Nome', 'Localidade', ...periodosDisponiveis, 'Unidade', 'Multiplicador'];
                        var csv = json2csv({data: res , fields, fieldNames: fieldNames, unwindPath: ['resultado', 'resultado.res']});
                        
                        //fontes e notas
                        csv = csv + this.obterFontesENotasPesquisaEmCSV();
        
                        this.downloadCSVFile(csv, `${this.pesquisa['nome']}`);
                    });
                },
                error => {
                    console.error(error);
                    this.modalErrorService.showError();
                });
        */

    }

    private obterFontesENotasPesquisaEmCSV(pesquisa: Pesquisa) {


        let csv = '\n \n \n ';

        //fontes e notas
        for (let i = 0; i < pesquisa['periodos'].length; i++) {

            let notas = pesquisa['periodos'][i].notas;

            for (let j = 0; j < notas.length; j++) {
                csv += `Nota [${pesquisa.periodos[i].nome}]: ` + notas[j];
                csv += '\n';
            }

        }

        csv += '\n \n \n';
        for (let i = 0; i < pesquisa['periodos'].length; i++) {
            // if(pesquisa['periodos'][i].nome == this.periodo){
            let fontes = pesquisa['periodos'][i].fontes;
            for (let j = 0; j < fontes.length; j++) {
                csv += 'Fonte: ' + fontes[j];
                csv += '\n';
            }
            // }
        }

        return csv;

    }

    private downloadCSVFile(content: string, name: string) {
        name = `${name.toLowerCase().replace(/\s/g, '-').replace(/--/g, '-')}.csv`;
        let blob = new Blob([content], { type: 'text/csv' });
        FileSaver.saveAs(blob, name);
    }
}