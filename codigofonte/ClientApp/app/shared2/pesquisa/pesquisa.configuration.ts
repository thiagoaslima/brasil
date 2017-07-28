export class PesquisaConfiguration {
    get validas() {
        return [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 29, 30, 31, 32, 34, 35, 36, 37, 38, 39, 40, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 10053, 10054, 10055, 10056, 10057, 10060, 10061, 10062, 10063, 10064, 10066];
    }

    isValida(pesquisaId: number) {
        return this.validas.indexOf(pesquisaId) > -1;
    }
};
