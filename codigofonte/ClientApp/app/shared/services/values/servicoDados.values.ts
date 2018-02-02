import { ConfigService, ENDPOINT } from '../../';

export const ServicoDados = {
    setUrl(path, endpoint = ENDPOINT.SERVICO_DADOS, version = 1) {
        if (path.indexOf('/') === 0) {
            path = path.substring(1);
        }
        return `${new ConfigService("server").getConfigurationValue(endpoint)}/v${version}/${path}`;
    }
}