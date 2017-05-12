import { LocalDTO } from '../dto';
import { niveisTerritoriais, listaNiveisTerritoriais } from '../values';

export class Local {
    static criar(tipo, dados: LocalDTO) {
        if (Local.tiposPossiveis.indexOf(tipo) < 0) {
            throw new TypeError(`O Local desejado não pode ser do tipo ${tipo}. Passe um dos seguintes tipos: ${Local.tiposPossiveis.join(', ')}`)
        }
    }

    static get tiposPossiveis() {
        return [niveisTerritoriais.pais.label, niveisTerritoriais.uf.label, niveisTerritoriais.municipio.label];
    }

    public readonly codigo: number
    public readonly codigoCompleto: number
    public readonly digitoVerificador: number

    public readonly nome: string
    public readonly tipo: string
    public readonly sigla?: string
    public readonly slug: string
    public readonly codigoCapital?: number
    public readonly capital?: Local
    public readonly codigoParent?: number
    public readonly parent: Local
    public readonly microrregiao?: number

    private _link: string

    constructor() {

    }

    get identificador() {
        return this.sigla ? this.sigla.toLowerCase() : this.slug;
    }

    get link() {
        if (!this._link) { this._link = this.parent ? this.parent.link + '/' + this.identificador : '/' + this.identificador; }
        return this._link;
    }
}