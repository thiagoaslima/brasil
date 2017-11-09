import { ConfigService, ENDPOINT } from '../../config/config.service';

export const ServicoDados = {
    setUrl(path, endpoint = ENDPOINT.SERVICO_DADOS, version = 1) {
        if (path.indexOf('/') === 0) {
            path = path.substring(1);
        }
        return `${new ConfigService().getConfigurationValue(endpoint)}/v${version}/${path}`;
    }
}