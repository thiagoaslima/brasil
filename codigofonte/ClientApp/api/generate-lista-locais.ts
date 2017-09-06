import { ufs } from './ufs';
import { municipios } from './municipios';

const fs = require('fs');

fs.writeFileSync('lista-pais.txt', 'brasil', function () { });

const ufUrls = ufs.map(uf => uf.sigla.toLowerCase()).sort();

fs.writeFileSync('lista-ufs.txt', ufUrls.join('\n'), function () { });

const ufObj = ufs.reduce((agg, uf) => Object.assign(agg, { [uf.codigo]: uf.sigla.toLowerCase() }), {});
const munUrls = municipios.map(mun => {
    return ufObj[mun.codigoUf] + '/' + mun.slug;
}).sort();

fs.writeFileSync('lista-municipios.txt', munUrls.join('\n'), function () { });