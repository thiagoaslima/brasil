const urlBase = 'https://servicodados.ibge.gov.br/api/v1';

export const ServicoDados = {
    setUrl(path) {
        if (path.indexOf('/') === 0) {
            path = path.substring(1);
        }
        return `${urlBase}/${path}`;
    }
}