import { ConfigService } from '../../config/config.service';

export const ServicoDados = {
    setUrl(path, version = 1) {
        if (path.indexOf('/') === 0) {
            path = path.substring(1);
        }
        return `${new ConfigService().getConfigurationValue('ENDPOINT_SERVICO_DADOS')}/v${version}/${path}`;
    }
}