import { Component, Input } from '@angular/core';
import { Localidade } from '../../shared/localidade/localidade.interface';
import { LocalidadeService } from '../../shared/localidade/localidade.service';
import { slugify } from '../../utils/slug';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';

@Component({
    selector: 'seletor-localidade',
    templateUrl: 'seletor-localidade.template.html',
    styleUrls: ['seletor-localidade.styles.css'],
    exportAs: 'seletor-localidade'
})
export class SeletorLocalidadeComponent {
    @Input() aberto = false;

    public pais;
    public selecao: string;
    public ufVisualizada: Localidade | null;
    public listaMunicipios = [];

    constructor(
        private _localidadeService: LocalidadeService
    ) {
        this.pais = this._localidadeService.getRoot();
    }

    abrirSeletor() {
        this.aberto = true;
    }

    fecharSeletor() {
        this.aberto = false;
    }

    setSelecao(str: string) {
        this.selecao = str;
    }

    setUfVisualizada(uf: Localidade | null) {
        this.ufVisualizada = uf;
        if (uf) {
            this.buildListaMunicipios(uf);
        }
    }

    reset() {
        this.fecharSeletor();
        this.setSelecao('');
        this.setUfVisualizada(null);
    }

    buildListaMunicipios(uf: Localidade, termo = '') {
        termo = slugify(termo);

        let hash = uf.children.reduce((agg, municipio) => {
            if (!municipio.identificador.includes(termo)) {
                return agg;
            }

            let initialLetter = municipio.identificador.charAt(0);

            if (!agg[initialLetter]) {
                agg[initialLetter] = [];
            }

            agg[initialLetter].push(municipio);

            return agg;
        }, {});

        this.listaMunicipios = Object.keys(hash).sort().map(letter => {
            return {
                letter,
                municipios: hash[letter]
            }
        });
    }
}