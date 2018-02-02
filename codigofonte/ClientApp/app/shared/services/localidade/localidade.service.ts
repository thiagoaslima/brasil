import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/retry';
import 'rxjs/add/operator/share';

import { Localidade } from '.';
import { niveisTerritoriais } from '../values';
import { forceArray } from '../../../../utils';
import { municipios } from '../../../../api/municipios';
import { ufs } from '../../../../api/ufs';
import { brasil } from '../../../../api/brasil';
import { slugify } from '../../../../utils/slug';


class LocalidadeCache {

    private _list = <Localidade[]>[];
    private _codigo = <{ [idx: number]: Localidade }>{};
    private _identificador = <{ [idx: string]: Localidade[] }>{};

    get todos() {
        return this._list.slice(0);
    }

    buscarPorIdentificador(identificador: string) {
        return this._identificador[identificador];
    }

    buscarPorCodigo(codigo: number) {
        codigo = codigo > 1000000 ? Math.floor(codigo / 10) : codigo;
        return this._codigo[codigo];
    }

    registerElement(localidade: Localidade, group?: number) {

        if (!this._codigo[localidade.codigo]) {
            this._list.push(localidade);
            this._codigo[localidade.codigo] = localidade;
            if (!this._identificador[localidade.identificador]) {
                this._identificador[localidade.identificador] = [];
            }
            this._identificador[localidade.identificador].push(localidade);
        }

        if (Number.isInteger(group)) {
            const _group = group.toString();

            if (!this._identificador[_group]) {
                this._identificador[_group] = [];
            }

            this._identificador[_group].push(localidade);
        }
    }
}

@Injectable()
export class LocalidadeService3 {

    private _brasil: Localidade;
    private _municipios = new LocalidadeCache();
    private _ufs = new LocalidadeCache();
    private _microrregioes = {} as { [codigo: number]: Localidade[] };


    constructor(private _http: Http) {
        this._buildLocalidadesTree();
        Localidade.setLocalidadeStrategy({ retrieve: this.getByCodigo.bind(this) });
    }

    public getRoot(): Localidade {
        return this._brasil;
    }
    public getPais = this.getRoot;


    public getAllUfs(): Localidade[] {
        return this._ufs.todos;
    }

    public getAllMunicipios() {
        return this._municipios.todos;
    }

    public getByCodigo(codigo: number, escopo: 'proprio' | 'filhos' = 'proprio'): Localidade[] {
        if (codigo == undefined || codigo === null) { return [null]; }

        switch (codigo.toString().length) {
            case niveisTerritoriais.pais.codeLength: // Brasil
                return escopo === 'proprio' ? [this.getRoot()] : this.getAllUfs();

            case niveisTerritoriais.uf.codeLength: // UF
                const uf = this.getUfByCodigo(codigo);
                return escopo === 'proprio' ? [uf] : this._municipios.buscarPorIdentificador(uf.codigo.toString());

            case niveisTerritoriais.municipio.codeLength: // Municipio
            case niveisTerritoriais.municipio.codeLength + 1: // Codigo Municipio completo (com dígito verificador)
                if (escopo === 'filhos') {
                    throw new Error('Municipio não tem filhos');
                }
                const municipio = this.getMunicipioByCodigo(codigo);
                return [municipio];

            default:
                return [];
        }
    }

    public getLocalidadesByCodigo(codigos: number | number[], escopo: 'proprio' | 'filhos' = 'proprio'): Localidade[] {
        const _codigos = forceArray(codigos);
        return _codigos.reduce((agg, codigo) => agg.concat(this.getByCodigo(codigo, escopo)), [] as Localidade[]);
    }

    getLocalByIdentificador(identificador: string): Localidade[] {
        if (!identificador) return [];
        return this.buscar(identificador);
    }

    public getUf(identificador): Localidade {
        if (Number.isNaN(parseInt(identificador, 10))) {
            return this.getUfBySigla(identificador);
        }
        return this.getUfByCodigo(identificador);
    }

    public getUfByCodigo(ufCodigo: number) {
        if (!ufCodigo) return;
        return this._ufs.buscarPorCodigo(ufCodigo);
    }

    public getUfBySigla(ufSigla: string) {
        if (!ufSigla) return;
        return this._ufs.buscarPorIdentificador(ufSigla)[0];
    }

    public getUfByNome(ufNome: string) {
        return this.getAllUfs().filter(localidade => localidade.nome.toLowerCase() == ufNome.toLowerCase())[0];
    }

    public getMunicipios(identificador): Localidade[] {
        const uf = this.getUf(identificador)
        return uf.children;
    }

    public getMunicipioBySlug(ufSigla, munSlug) {
        if (!ufSigla || !munSlug) return;
        let arr = this._municipios.buscarPorIdentificador(munSlug);
        return arr.reduce((agg, mun) => mun.parent.identificador === ufSigla ? mun : agg, null);
    }

    public getMunicipioByCodigo(munCodigo) {
        if (!munCodigo) return;
        return this._municipios.buscarPorCodigo(munCodigo);
    }

    public getMunicipiosByRegiao(codigoRegiao: string) {
        const codigo = codigoRegiao.replace(/x/g, '');
        return this._municipios.todos.filter(municipio => municipio.codigo.toString().indexOf(codigo) === 0);
    }

    public getMunicipioByCoordinates(latitude: number, longitude: number): Observable<Localidade> {

        const serviceEndpointURL = `https://nominatim.openstreetmap.org/reverse?format=xml&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1&format=json`;

        return this._http.get(serviceEndpointURL)
            .map(res => res.json())
            .flatMap(json => {

                let municipio: Localidade = this.getMunicipioBySlug(this.getUfByNome(json.address.state).sigla.toLowerCase(), slugify(json.address.city));

                return Observable.of(municipio);
            });
    }

    public buscar(termo: string): Localidade[] {
        const municipios = this._municipios.todos.filter(mun => searchTest(termo, mun))
        const ufs = this._ufs.todos.filter(uf => searchTest(termo, uf));
        const pais = [this._brasil].filter(pais => searchTest(termo, pais))
        return pais.concat(ufs, municipios);
    }

    public getAllCapitais() {
        let arr = [];
        for (let i = 0; i < this._ufs.todos.length; i++) {
            arr.push(this._ufs.todos[i].capital);
        }
        arr.sort((a, b) => {
            return a.nome.localeCompare(b.nome);
        });
        return arr;
    }

    public getMunicipiosMicrorregiao(codMicrorregiao: number) {
        return this._microrregioes[codMicrorregiao] || [];
    }

    /**
     * Retorna a preposição (do, da ou de) mais adequada ao nome da UF.
     */
    public getPreprosicaoTituloUF(nomeUF: string): string {

        let ufsComPreposicaoDo = ['brasil', 'acre', 'amapá', 'amazonas', 'ceará', 'distrito federal', 'mato grosso', 'mato grosso do sul', 'maranhão', 'paraná', 'pará', 'piauí', 'rio grande do norte', 'rio grande do sul', 'rio de janeiro'];
        let ufsComPreposicaoDa = ['bahia', 'paraíba'];
        let ufsComPreposicaoDe = ['alagoas', 'goiás', 'minas gerais', 'pernanbuco', 'rondônia', 'roraima', 'santa catarina', 'sergipe', 'são paulo', 'tocantins'];

        if (ufsComPreposicaoDo.indexOf(nomeUF.toLowerCase()) >= 0) {

            return 'do';
        }


        if (ufsComPreposicaoDa.indexOf(nomeUF.toLowerCase()) >= 0) {

            return 'da';
        }

        if (ufsComPreposicaoDe.indexOf(nomeUF.toLowerCase()) >= 0) {

            return 'de';
        }


        return 'de';
    }

    private _buildLocalidadesTree() {
        this._brasil = Localidade.criar(Localidade.convertDTO(brasil));

        ufs.forEach(uf => {
            let _uf = Localidade.criar(Localidade.convertDTO(uf));;
            this._ufs.registerElement(_uf, this._brasil.codigo);
        });

        municipios.forEach(municipio => {
            let _mun = Localidade.criar(Localidade.convertDTO(municipio));;
            this._municipios.registerElement(_mun, _mun.codigoParent);

            if (!this._microrregioes[_mun.microrregiao]) {
                this._microrregioes[_mun.microrregiao] = [];
            }
            this._microrregioes[_mun.microrregiao].push(_mun);
        });
    }
}

function searchTest(termo: string, local: Localidade) {
    termo = slugify(termo);

    return (local.codigo && local.codigo.toString().indexOf(termo) >= 0)
        || (local.sigla && local.sigla.indexOf(termo) >= 0)
        || (local.slug && local.slug.indexOf(termo) >= 0);
}