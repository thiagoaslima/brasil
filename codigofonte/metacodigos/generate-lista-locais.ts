import { ufs } from '../ClientApp/api/ufs';
import { municipios } from '../ClientApp/api/municipios';

const fs = require('fs');
const path = require('path');
const folder = './listas/';

fs.writeFileSync(path.join(folder, 'lista-pais.txt'), 'brasil', function () { });

const ufUrls = ufs.map(uf => uf.sigla.toLowerCase()).sort();

fs.writeFileSync(path.join(folder, 'lista-ufs.txt'), ufUrls.join('\n'), function () { });

const ufObj = ufs.reduce((agg, uf) => Object.assign(agg, { [uf.codigo]: uf.sigla.toLowerCase() }), {});
const munUrls = municipios.map(mun => {
    return ufObj[mun.codigoUf] + '/' + mun.slug;
}).sort();

fs.writeFileSync(path.join(folder, 'lista-municipios.txt'), munUrls.join('\n'), function () { });
