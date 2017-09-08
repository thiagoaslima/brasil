import { municipios } from './municipios';

const http = require('http');
const fs = require('fs');

let request = Promise.all(municipios.map(municipio => {
    let cod = municipio.codigo.toString(10).slice(0,6);
    return promiseRequest(`https://servicodados.ibge.gov.br/api/v1/biblioteca?aspas=3&codmun=${cod}`)
        .then(response => ({
            codigo: cod,
            municipio: municipio,
            response: response,
            hasData: response[cod] && Object.keys(response[cod]).length > 0,
            hasGentilico: response[cod] && response[cod]['GENTILICO']
        }));
}));

const teste = request.then(responses => responses.reduce((agg, obj) => {

    if (obj.hasData) {
         agg.withData.push({codigo: obj.codigo, municipio: obj.municipio.slug});
    } else {
        agg.noData.push({codigo: obj.codigo, municipio: obj.municipio.slug});
    }

    if (!obj.hasGentilico) {
        agg.noGentilico.push({codigo: obj.codigo, municipio: obj.municipio.slug});
    }

    responses[obj.codigo] = obj;

    return agg;
}, {withData: [], noData: [], noGentilico: [], responses: {}}));

fs.writeFileSync('teste-biblioteca-gentilico.json', JSON.stringify(teste));

function promiseRequest(url) {
    return new Promise(function (resolve, reject) {
        // var timerId = setTimeout(reject(new Error('timeout')), 30);
        return http.get(url, function (response) {
            var body = '';
            response.on('data', function (chunk) {
                body += chunk;
            })
            response.on('end', function () {
                // clearTimeout(timerId);
                resolve(JSON.parse(body));
            });
        });
    });
}