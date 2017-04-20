export class PesquisaConfiguration {
    get validas() {
        return [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 42, 43];
    }

    isValida(pesquisaId: number) {
        return this.validas.indexOf(pesquisaId) > -1;
    }
};