import { Component, OnInit, OnChanges, Input } from '@angular/core';

@Component({
    selector: 'pesquisa-dados',
    templateUrl: 'pesquisa-dados.template.html',
    styleUrls: ['pesquisa-dados.style.css']
})

export class PesquisaDadosComponent {
    @Input() indicadores;
    @Input() idIndicadorSelecionado;
    public dadosCombo = [];
    public dadosTabela = [];
    public indexCombo = 0;
    public tituloPrincipal = "";
    public anos = ['-', '-'];

    ngOnChanges(){
        //reseta as variáveis do template, evita exibir dados da pesquisa anterior em uma nova pesquisa
        this.dadosCombo = [];
        this.dadosTabela = [];
        this.indexCombo = 0;
        this.tituloPrincipal = "";
        this.anos = ['-', '-'];

        //adiciona 3 novas propriedades aos indicadores: nível, visível e resultados
        //nível é usado para aplicar o css para criar a impressão de hierarquia na tabela de dados
        //visível é usado para definir se o indicador está visível ou não (dentro de um elemento pai fechado)
        //resultados contém o ano e os valores do indicador
        let indicadores = this.flat(this.indicadores);
        for(let i = 0; i < indicadores.length; i++){
            indicadores[i].nivel = indicadores[i].posicao.split('.').length - 2;
            indicadores[i].visivel = indicadores[i].nivel <= 2 ? true : false;
            if(indicadores[i].res){
                let resultados = [];
                for(let key in indicadores[i].res){
                    resultados.push({'ano' : parseInt(key), 'valor' : indicadores[i].res[key]});
                }
                //faz o sort(decrescente) dos resultados de acordo com o ano
                resultados.sort((a, b) => {
                    if(a.ano < b.ano) return 1;
                    if(a.ano > b.ano) return -1;
                    return 0;
                });
                //deixa apenas os dois últimos anos de resultados
                resultados = resultados.slice(0, 2);
                //faz o sort crescente para exibição dos dados
                resultados.sort((a, b) => {
                    if(a.ano > b.ano) return 1;
                    if(a.ano < b.ano) return -1;
                    return 0;
                });
                //seta a propriedade com os valores para montar no template
                indicadores[i].resultados = resultados;
                //seta os anos do cabeçalho da tabela
                this.anos[0] = resultados.length >= 1 ? resultados[0].ano : '-';
                this.anos[1] = resultados.length >= 2 ? resultados[1].ano : '-';
            }
        }

        //seta os dados iniciais do combobox e da tabela de dados
        for(let i = 0; i < this.indicadores.length; i++){
            if(this.indicadores[i].id == this.idIndicadorSelecionado){
                this.tituloPrincipal = this.indicadores[i].indicador;
                this.dadosCombo = this.indicadores[i].children;
                if(this.dadosCombo.length > 0){
                    this.dadosTabela = this.flat(this.dadosCombo[0]);
                }
            }
        }
    }

    //chamada quando muda o combobox
    onChange(event){
        this.indexCombo = event.target.selectedIndex;
        this.dadosTabela = this.flat(this.dadosCombo[this.indexCombo]);
    }

    //chamada quando abre os nós nível 2 da tabela de dados
    onClick(item){
        if(item.nivel != 2)
            return;
        let children = this.flat(item.children);
        for(let i = 0; i < children.length; i++){
            children[i].visivel = !children[i].visivel;
        }
    }

    //essa função dá um flat(transforma a árvore num array linear) na árvore de indicadores
    private flat(item){
        let flatItem = [];
        if(item.length){ //é um array
            for(let i = 0; i < item.length; i++){
                flatItem = flatItem.concat(this.flat(item[i]));
            }
        }else if(item.children){//é um item
            flatItem.push(item);
            for(let i = 0; i < item.children.length; i++){
                flatItem = flatItem.concat(this.flat(item.children[i]));
            }
        }
        return flatItem;
    }
}