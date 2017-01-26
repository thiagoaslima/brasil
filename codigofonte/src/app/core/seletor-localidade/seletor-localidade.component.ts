import { Component, Input } from '@angular/core';
import { UF } from '../../shared/localidade/localidade.interface';
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
    public ufVisualizada: UF | null;
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

    setUfVisualizada(uf: UF | null) {
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

    buildListaMunicipios(uf, termo = '') {
        termo = slugify(termo);

        let hash = uf.municipios.lista.reduce((agg, municipio) => {
            if (!municipio.slug.includes(termo)) {
                return agg;
            }

            let initialLetter = municipio.slug.charAt(0);

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