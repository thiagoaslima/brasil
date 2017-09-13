import { municipios } from '../ClientApp/api/municipios';
import { ufs } from '../ClientApp/api/ufs';

const fs = require('fs');

const ufByCodigo = ufs.reduce((acc, uf) => Object.assign(acc, { [uf.codigo]: uf }), {});

let places = [].concat(municipios, ufs).sort( (a, b) => a.nome > b.nome ? 1 : -1 );

const options = places.map(place =>
    `<option value="${place.codigoUf ? 'município de' : 'estado:'} ${place.nome}${place.codigoUf ? ' - ' + ufByCodigo[place.codigoUf]['sigla'] : ''} [${place.codigo.toString(10).slice(0,6)}]">`);

fs.writeFile('options.txt', options.join('\n\t\t'), (err) => console.log(err ? err : 'ok'));
