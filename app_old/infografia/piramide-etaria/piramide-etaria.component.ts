import { Component, OnChanges, Input } from '@angular/core';
import { Observable } from 'rxjs';

import { PiramideEtariaService } from './piramide-etaria.service';
import { ModalErrorService } from '../../core/modal-erro/modal-erro.service';


@Component({
    selector: 'piramide-etaria',
    templateUrl: 'piramide-etaria.template.html',
    styleUrls: ['piramide-etaria.style.css']
})
export class PiramideEtariaComponent implements OnChanges {

    @Input() codmun;

    public data;
    public max;
    carregando = false;

    constructor(
        private _piramideEtariaService: PiramideEtariaService,
        private modalErrorService: ModalErrorService
    ) {  }

    ngOnChanges() {

        this.carregando = true;

        let pesquisa = '23';
        let indicadores = ['27692','27693','27694','27695','27696','27697','27698','27699','27700','27701','27702','27703','27704','27705','27706','27707','27708','27709','27710','27711','27712','27713','27719','27720','27721','27722','27723','27724','27725','27726','27727','27728','27729','27730','27731','27732','27733','27734','27735','27736','27737','27738','27739','27740'];

        Observable.zip(
            this._piramideEtariaService.getPesquisa(this.codmun, pesquisa, indicadores),
            this._piramideEtariaService.getPeriodosDisponiveisPesquisa(pesquisa)
        )
            .map(this._piramideEtariaService.limparDadosInvalidos)
            .subscribe(([_indicadores, _periodos]) => {
                this.carregando = false;

                this.data = {};

                this.data.selectedIndex = null;
                this.data.toolTipPosition = {
                    x: 0,
                    y: 0
                }

                let indicadores = (<any[]>_indicadores);
                let periodos    = (<any[]>_periodos);

                periodos = periodos.map(item => item.periodo);
                periodos.sort();

                let ultimoPeriodo = periodos.pop();

                // soma as duas primeiras classes, 0 a 1 e 1 a 4, para obter a classe de 0 a 4 anos
                let h0a1   = this.getIndicador(indicadores, 27692);
                let h1a4   = this.getIndicador(indicadores, 27693);
                let h5a9   = this.getIndicador(indicadores, 27694);
                let h10a14 = this.getIndicador(indicadores, 27695);
                let h15a19 = this.getIndicador(indicadores, 27696);
                let h20a24 = this.getIndicador(indicadores, 27697);
                let h25a29 = this.getIndicador(indicadores, 27698);
                let h30a34 = this.getIndicador(indicadores, 27699);
                let h35a39 = this.getIndicador(indicadores, 27700);
                let h40a44 = this.getIndicador(indicadores, 27701);
                let h45a49 = this.getIndicador(indicadores, 27702);
                let h50a54 = this.getIndicador(indicadores, 27703);
                let h55a59 = this.getIndicador(indicadores, 27704);
                let h60a64 = this.getIndicador(indicadores, 27705);
                let h65a69 = this.getIndicador(indicadores, 27706);
                let h70a74 = this.getIndicador(indicadores, 27707);
                let h75a79 = this.getIndicador(indicadores, 27708);
                let h80a84 = this.getIndicador(indicadores, 27709);
                let h85a89 = this.getIndicador(indicadores, 27710);
                let h90a94 = this.getIndicador(indicadores, 27711);
                let h95a99 = this.getIndicador(indicadores, 27712);
                let h100   = this.getIndicador(indicadores, 27713);

                let m0a1   = this.getIndicador(indicadores, 27719);
                let m1a4   = this.getIndicador(indicadores, 27720);
                let m5a9   = this.getIndicador(indicadores, 27721);
                let m10a14 = this.getIndicador(indicadores, 27722);
                let m15a19 = this.getIndicador(indicadores, 27723);
                let m20a24 = this.getIndicador(indicadores, 27724);
                let m25a29 = this.getIndicador(indicadores, 27725);
                let m30a34 = this.getIndicador(indicadores, 27726);
                let m35a39 = this.getIndicador(indicadores, 27727);
                let m40a44 = this.getIndicador(indicadores, 27728);
                let m45a49 = this.getIndicador(indicadores, 27729);
                let m50a54 = this.getIndicador(indicadores, 27730);
                let m55a59 = this.getIndicador(indicadores, 27731);
                let m60a64 = this.getIndicador(indicadores, 27732);
                let m65a69 = this.getIndicador(indicadores, 27733);
                let m70a74 = this.getIndicador(indicadores, 27734);
                let m75a79 = this.getIndicador(indicadores, 27735);
                let m80a84 = this.getIndicador(indicadores, 27736);
                let m85a89 = this.getIndicador(indicadores, 27737);
                let m90a94 = this.getIndicador(indicadores, 27738);
                let m95a99 = this.getIndicador(indicadores, 27739);
                let m100   = this.getIndicador(indicadores, 27740);

                // monta a resposta no formato esperado pelo componente
                this.data.piramide = [
                    { classe: "0 a 4",    cidade: { homens: (parseInt(h0a1.res[ultimoPeriodo]) + parseInt(h1a4.res[ultimoPeriodo])), mulheres: (parseInt(m0a1.res[ultimoPeriodo]) + parseInt(m1a4.res[ultimoPeriodo])) }, brasil: { homens: 7016614, mulheres: 6778795 } },
                    { classe: "5 a 9",   cidade: { homens: parseInt(h5a9.res[ultimoPeriodo]),   mulheres: parseInt(m5a9.res[ultimoPeriodo]) },   brasil: { homens: 7623749, mulheres: 7344867 } },
                    { classe: "10 a 14", cidade: { homens: parseInt(h10a14.res[ultimoPeriodo]), mulheres: parseInt(m10a14.res[ultimoPeriodo]) }, brasil: { homens: 8724960, mulheres: 8440940 } },
                    { classe: "15 a 19", cidade: { homens: parseInt(h15a19.res[ultimoPeriodo]), mulheres: parseInt(m15a19.res[ultimoPeriodo]) }, brasil: { homens: 8558497, mulheres: 8431641 } },
                    { classe: "20 a 24", cidade: { homens: parseInt(h20a24.res[ultimoPeriodo]), mulheres: parseInt(m20a24.res[ultimoPeriodo]) }, brasil: { homens: 8629807, mulheres: 8614581 } },
                    { classe: "25 a 29", cidade: { homens: parseInt(h25a29.res[ultimoPeriodo]), mulheres: parseInt(m25a29.res[ultimoPeriodo]) }, brasil: { homens: 8460631, mulheres: 8643096 } },
                    { classe: "30 a 34", cidade: { homens: parseInt(h30a34.res[ultimoPeriodo]), mulheres: parseInt(m30a34.res[ultimoPeriodo]) }, brasil: { homens: 7717365, mulheres: 8026554 } },
                    { classe: "35 a 39", cidade: { homens: parseInt(h35a39.res[ultimoPeriodo]), mulheres: parseInt(m35a39.res[ultimoPeriodo]) }, brasil: { homens: 6766450, mulheres: 7121722 } },
                    { classe: "40 a 44", cidade: { homens: parseInt(h40a44.res[ultimoPeriodo]), mulheres: parseInt(m40a44.res[ultimoPeriodo]) }, brasil: { homens: 6320374, mulheres: 6688585 } },
                    { classe: "45 a 49", cidade: { homens: parseInt(h45a49.res[ultimoPeriodo]), mulheres: parseInt(m45a49.res[ultimoPeriodo]) }, brasil: { homens: 5691791, mulheres: 6141128 } },
                    { classe: "50 a 54", cidade: { homens: parseInt(h50a54.res[ultimoPeriodo]), mulheres: parseInt(m50a54.res[ultimoPeriodo]) }, brasil: { homens: 4834828, mulheres: 5305231 } },
                    { classe: "55 a 59", cidade: { homens: parseInt(h55a59.res[ultimoPeriodo]), mulheres: parseInt(m55a59.res[ultimoPeriodo]) }, brasil: { homens: 3902183, mulheres: 4373673 } },
                    { classe: "60 a 64", cidade: { homens: parseInt(h60a64.res[ultimoPeriodo]), mulheres: parseInt(m60a64.res[ultimoPeriodo]) }, brasil: { homens: 3040897, mulheres: 3467956 } },
                    { classe: "65 a 69", cidade: { homens: parseInt(h65a69.res[ultimoPeriodo]), mulheres: parseInt(m65a69.res[ultimoPeriodo]) }, brasil: { homens: 2223953, mulheres: 2616639 } },
                    { classe: "70 a 74", cidade: { homens: parseInt(h70a74.res[ultimoPeriodo]), mulheres: parseInt(m70a74.res[ultimoPeriodo]) }, brasil: { homens: 1667289, mulheres: 2074165 } },
                    { classe: "75 a 79", cidade: { homens: parseInt(h75a79.res[ultimoPeriodo]), mulheres: parseInt(m75a79.res[ultimoPeriodo]) }, brasil: { homens: 1090455, mulheres: 1472860 } },
                    { classe: "80 a 84", cidade: { homens: parseInt(h80a84.res[ultimoPeriodo]), mulheres: parseInt(m80a84.res[ultimoPeriodo]) }, brasil: { homens: 668589,  mulheres: 998311 } },
                    { classe: "85 a 89", cidade: { homens: parseInt(h85a89.res[ultimoPeriodo]), mulheres: parseInt(m85a89.res[ultimoPeriodo]) }, brasil: { homens: 310739,  mulheres: 508702 } },
                    { classe: "90 a 94", cidade: { homens: parseInt(h90a94.res[ultimoPeriodo]), mulheres: parseInt(m90a94.res[ultimoPeriodo]) }, brasil: { homens: 114961,  mulheres: 211589 } },
                    { classe: "95 a 99", cidade: { homens: parseInt(h95a99.res[ultimoPeriodo]), mulheres: parseInt(m95a99.res[ultimoPeriodo]) }, brasil: { homens: 31528,   mulheres: 66804 } },
                    { classe: "100 ou mais",   cidade: { homens: parseInt(h100.res[ultimoPeriodo]),   mulheres: parseInt(m100.res[ultimoPeriodo]) },   brasil: { homens: 7245,    mulheres: 16987 } }
                ];

                this.data.piramide.reverse();

                // calcula o valor máximo por sexo, da cidade, uf e pais
                this.data.max = {
                    cidade: 0,
                    brasil: 0
                }
                this.data.piramide.forEach((item) => {
                    if (item.cidade.homens > this.data.max.cidade)
                        this.data.max.cidade = item.cidade.homens;
                    if (item.cidade.mulheres > this.data.max.cidade)
                        this.data.max.cidade = item.cidade.mulheres;

                    if (item.brasil.homens > this.data.max.brasil)
                        this.data.max.brasil = item.brasil.homens;
                    if (item.brasil.mulheres > this.data.max.brasil)
                        this.data.max.brasil = item.brasil.mulheres;

                    // aproveita e cria os titulos das faixas
                    item.title = item.classe + " - Cidade: " + item.cidade.homens + " homens e " + item.cidade.mulheres + " mulheres; Brasil: " + item.brasil.homens + " homens e " + item.brasil.mulheres + " mulheres;";

                });

                // calcula a altura dos retãngulos
            this.data.py = 100 / this.data.piramide.length;

            }
        , error => {
            console.error(error);
            this.modalErrorService.showError();
        });

    }

    private getIndicador = (res, id) => {
        return res.filter((indicador) => {
            return indicador.id === id;
        })[0];
    }

    private getArrValues(scope, sex) {
        return this.data.piramide.map(function(item){
            return item[scope][sex];
        })
    }

    public getPathD(scope, sex, type) {

        let values = this.getArrValues(scope, sex);// homens, cidade
        let py = 100 / values.length;

        if (type == "fill") { // desenha um polígono fechado
            return "M 0 0 L " + values.map((v, i) => {
                return (100 * (v/this.data.max[scope])) + " " + py * i;
            }).join(" L ") + " M 0 100 Z";
        } else {
            return "M " + values.map((v, i) => {
                return (100 * (v/this.data.max[scope])) + " " + py*i;
            }).join(" L ");
        }
    }

    private setTip(i) {
        this.data.selectedIndex = i;
    }

    private moveToolTip(event) {
        if (event.layerX > 120) {
            this.data.toolTipPosition = {
                x: event.layerX - 120,
                y: event.layerY - 120
            }
        } else {
            this.setTip(null);
        }
    }

}
