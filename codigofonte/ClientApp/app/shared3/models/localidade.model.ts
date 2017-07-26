import { niveisTerritoriais } from '../values';
import { LocalidadeDTO } from '../dto';
import { converterEmNumero } from '../../utils2';

interface LocalidadeParameters {
    codigo: number;
    codigoCompleto: number;
    digitoVerificador?: number;
    nome: string;
    tipo: 'pais' | 'uf' | 'municipio';
    slug: string;
    sigla?: string;
    codigoCapital?: number;
    codigoParent?: number;
    microrregiao?: number;
}

export class Localidade {

    static localidadeStrategy = null;

    public readonly codigo: number;
    public readonly codigoCompleto: number;
    public readonly digitoVerificador?: number;
    public readonly nome: string;
    public readonly tipo: string;
    public readonly sigla?: string;
    public readonly slug: string;
    public readonly codigoCapital?: number;
    public readonly codigoParent?: number;
    public readonly microrregiao?: number;

    private _link = '';
    static criar(dados: LocalidadeParameters) {
        if (Localidade.validarParametros(dados)) {
            return new Localidade(dados);
        }
    }

    static get tiposPossiveis() {
        return [niveisTerritoriais.pais.label, niveisTerritoriais.uf.label, niveisTerritoriais.municipio.label];
    }

    static validarParametros(dados: LocalidadeParameters) {
        if (!dados.hasOwnProperty('codigo')) {
            throw new Error(`Obrigatório informar o código da localidade. [dados: ${JSON.stringify(dados)}]`);
        }

        if (!dados.nome) {
            throw new Error(`Obrigatório informar o nome da localidade. [dados: ${JSON.stringify(dados)}]`);
        }

        if (Localidade.tiposPossiveis.indexOf(dados.tipo) === -1) {
            throw new Error(`Tipo informado não é compatível com a classe Localidade. [tipo: ${dados.tipo}]`);
        }

        return true;
    }

    static get(codigo: number): Localidade {
        return Localidade.localidadeStrategy.retrieve(codigo, 'proprio')[0];
    }

    static getFilhos(codigo: number): Localidade[] {
        return Localidade.localidadeStrategy.retrieve(codigo, 'filhos');
    }

    static convertDTO(dto: LocalidadeDTO) {
        const codigoLen = dto.codigo.toString().length;

        const nivelTerritorial = niveisTerritoriais.pais.codeLength === codigoLen ? niveisTerritoriais.pais
            : niveisTerritoriais.uf.codeLength === codigoLen ? niveisTerritoriais.uf
                : niveisTerritoriais.municipio;

        let parameter: any = {
            codigo: converterEmNumero(dto.codigo.toString().slice(0, nivelTerritorial.codeLength)),
            codigoCompleto: dto.codigo,
            tipo: nivelTerritorial.label,
            nome: dto.nome,
            slug: dto.slug
        }

        if (codigoLen > nivelTerritorial.codeLength) {
            parameter.digitoVerificador = converterEmNumero(dto.codigo.toString().slice(6))
        }

        if (dto.hasOwnProperty('codigoUf')) {
            parameter.codigoParent = converterEmNumero(dto['codigoUf'])
        } else if (parameter.codigo !== 0) {
            parameter.codigoParent = 0
        }

        if (dto.hasOwnProperty('sigla')) {
            parameter.sigla = dto['sigla'];
        }

        if (dto.hasOwnProperty('codigoCapital')) {
            parameter.codigoCapital = dto['codigoCapital'];
        }

        if (dto.hasOwnProperty('microrregiao')) {
            parameter.microrregiao = dto['microrregiao'];
        }

        return parameter as LocalidadeParameters;
    }

    static setLocalidadeStrategy(strategy) {
        Localidade.localidadeStrategy = strategy;
    }

    constructor(dados) {
        this.codigo = dados.codigo;
        this.codigoCompleto = dados.codigoCompleto;

        if (dados.digitoVerificador) { this.digitoVerificador = dados.digitoVerificador }

        this.nome = dados.nome;
        this.tipo = dados.tipo;

        if (dados.sigla) { this.sigla = dados.sigla; }

        this.slug = dados.slug;

        if (dados.codigoCapital) { this.codigoCapital = dados.codigoCapital }
        if (dados.codigoParent) { this.codigoParent = dados.codigoParent }
        if (dados.microrregiao) { this.microrregiao = dados.microrregiao }
    }

    public get identificador() {
        return this.sigla ? this.sigla.toLowerCase() : this.slug;
    }

    public get link() {
        if (!this._link) {
            this._link = this.parent ? this.parent.link + '/' + this.identificador : '/' + this.identificador;
        }
        return this._link;
    }

    get children() {
        return Localidade.getFilhos(this.codigo);
    }

    get parent() {
        return Localidade.get(this.codigoParent);
    }

    get capital() {
        if (this.codigoCapital) {
            return Localidade.get(this.codigoCapital);
        }
        return null;
    }
}