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

    ngOnChanges(){
        let indicadores = this.flat(this.indicadores);
        for(let i = 0; i < indicadores.length; i++){
            indicadores[i].nivel = indicadores[i].posicao.split('.').length - 2;
            indicadores[i].visivel = indicadores[i].nivel <= 2 ? true : false;
        }

        for(let i = 0; i < this.indicadores.length; i++){
            if(this.indicadores[i].id == this.idIndicadorSelecionado){
                this.dadosCombo = this.indicadores[i].children;
                if(this.dadosCombo.length > 0){
                    this.dadosTabela = this.flat(this.dadosCombo[0].children);
                }
            }
        }
    }

    onChange(event){
        this.indexCombo = event.target.selectedIndex;
        this.dadosTabela = this.flat(this.dadosCombo[this.indexCombo].children);
    }

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