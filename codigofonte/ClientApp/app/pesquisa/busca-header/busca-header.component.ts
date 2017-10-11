import { TraducaoService } from '../../traducao/traducao.service';
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

    @Input() localidadePrincipal: Localidade;
    @Input() localidadeAtual: Localidade;
    @Input() localidadeIrma: Localidade;
    // 'estadual' ou 'municipal'
    @Input() nivelRegional: string = 'municipal';
    @Output() onLocalidade = new EventEmitter();
    
    mostrarMenu = false;
    localidades: Localidade[];
    capitais: Localidade[];

    public get lang() {
        return this._traducaoServ.lang;
    }

    constructor(
        private _localidadeService: LocalidadeService2,
        private _traducaoServ: TraducaoService
    ) { }


    ngOnInit(){
         this.capitais = this._localidadeService.getAllCapitais();
    }

    onChangeInput(event){
        
        let texto = event.target.value;

        if(texto.length >= 2){

            this.localidades = this._localidadeService.buscar(texto);

            // this.localidades = this._localidadeService.buscar(texto)
            //     .filter((item) => {

            //         return item.tipo == (this.nivelRegional == 'municipal' ? 'municipio' : 'uf');
            //     });

        }else{

            this.localidades = null;
        }
    }

    onClickItem(localidade: Localidade){
        this.mostrarMenu = false;

        /*impede comparação com a mesma localide*/
        if(localidade && (localidade == this.localidadePrincipal || localidade == this.localidadeIrma))
            return;

        this.onLocalidade.emit(localidade);
    }
}