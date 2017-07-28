import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

import { Localidade } from '../../shared2/localidade/localidade.model';
import { LocalidadeService2 } from '../../shared2/localidade/localidade.service';


/**
 * Componente do cabeçalho com busca de localidade.
 **/
@Component({
    selector: 'busca-header',
    templateUrl: './busca-header.component.html',
    styleUrls: ['./pesquisa-header.component.css']
})
export class BuscaHeaderComponent implements OnInit {

    @Input() localidadeAtual: Localidade;
    // 'estadual' ou 'municipal'
    @Input() nivelRegional: string = 'municipal';
    @Output() onLocalidade = new EventEmitter();
    
    mostrarMenu = false;
    localidades: Localidade[];
    capitais: Localidade[];


    constructor(
        private _localidadeService: LocalidadeService2
    ) { }


    ngOnInit(){
         this.capitais = this._localidadeService.getAllCapitais();
    }

    onChangeInput(event){

        let texto = event.srcElement.value;

        if(texto.length >= 3){

            this.localidades = this._localidadeService.buscar(texto)
                .filter((item) => {

                    return item.tipo == (this.nivelRegional == 'municipal' ? 'municipio' : 'uf');
                });

        }else{

            this.localidades = null;
        }
    }

    onClickItem(localidade: Localidade){

        debugger;

        this.mostrarMenu = false;

        this.onLocalidade.emit(localidade);
    }
}