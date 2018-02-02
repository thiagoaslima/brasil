export interface Teste {
    propriedade: string,
    mensagemErro: string,
    funcaoTeste: (data) => Boolean,
}

export class Validador {
    private _erros = [] as string[];
    private _testes = [] as Teste[];

    constructor() {}

    resgitrarTestes(testes: Teste[]) {
        testes.forEach(teste => this.registrarTeste(teste));
    }

    registrarTeste(teste: Teste): void {
        if (!this._testes.find(this._equals.bind(null, teste))) {
            this._testes.push(teste);
        }
    }

    deregistrarTeste(teste: Teste): boolean {
        const idx = this._testes.findIndex(this._equals.bind(this, teste));
        if (idx >= 0) { this._testes.splice(idx, 1); }
        return idx >= 0;
    }

    validar(data, cb) {
        this._testes.forEach(teste => {
            if (!teste.funcaoTeste(data)) {
                // console.log(teste.mensagemErro, data);
                this._erros.push(teste.mensagemErro);
            }
        });
        if (this._erros.length) {
            throw new TypeError(this._erros.join(','));
        }
        return cb(data);
    }

    private _equals(referencia: Teste, comparacao: Teste): boolean {
        return referencia.funcaoTeste === comparacao.funcaoTeste && referencia.propriedade === comparacao.propriedade;
    }
}