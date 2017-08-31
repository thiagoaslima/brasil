const urlBase = 'https://servicodados.ibge.gov.br/api/v';

export const ServicoDados = {
    setUrl(path, version = 1) {
        if (path.indexOf('/') === 0) {
            path = path.substring(1);
        }
        return `${urlBase}${version}/${path}`;
    }
}