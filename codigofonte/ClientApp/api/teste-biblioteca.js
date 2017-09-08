"use strict";

var municipios_1 = require('./municipios');
var http = require('http');
var fs = require('fs');
var municipios = municipios_1.municipios.sort(function (a, b) { return a.codigo > b.codigo ? 1 : -1 });
var request = getDados(municipios, 0, []);

/*
Promise.all(municipios.map(function (municipio) {
    var cod = municipio.codigo;
    return promiseRequest("http://servicodados.ibge.gov.br/api/v1/biblioteca?aspas=3&codmun=" + cod)
        .then(function (response) {
            return {
                codigo: cod,
                municipio: municipio,
                response: response,
                hasData: response[cod] && Object.keys(response[cod]).length > 0,
                hasGentilico: response[cod] && response[cod]['GENTILICO']
            };
        });

}));
*/

var teste = request.then(function (responses) {
    return responses.reduce(function (agg, obj) {

        if (obj.hasData) {
            agg.withData.push({ codigo: obj.codigo, municipio: obj.municipio.slug });
        }
        else {
            agg.noData.push({ codigo: obj.codigo, municipio: obj.municipio.slug });
        }
        if (!obj.hasGentilico) {
            agg.noGentilico.push({ codigo: obj.codigo, municipio: obj.municipio.slug });
        }
        responses[obj.codigo] = obj;
        return agg;
    }, { withData: [], noData: [], noGentilico: [], responses: {} });
});



teste.then(function (value) {
    fs.writeFile('teste-biblioteca-gentilico.json', JSON.stringify(value), function (err) {
        if (err) { console.log('ERRO', err) }
        console.log('SALVO!')
    });
});
function promiseRequest(url) {
    return new Promise(function (resolve, reject) {
        // var timerId = setTimeout(reject(new Error('timeout')), 30);
        return http.get(url, function (response) {
            var body = '';
            response.on('data', function (chunk) {
                body += chunk;
            });
            response.on('end', function () {
                // clearTimeout(timerId);
                resolve(JSON.parse(body));
            });
        });
    });
}

function getDados(municipios, idx, agg) {
    console.log('getting', idx);
    if (idx == 4055) { debugger; }

    if (!municipios[idx]) {
        return new Promise(function (resolve, request) { resolve(agg); });
    }

    var cod = municipios[idx].codigo;
    return promiseRequest("http://servicodados.ibge.gov.br/api/v1/biblioteca?aspas=3&codmun=" + cod)
        .then(function (response) {
            return {
                codigo: cod,
                municipio: municipios[idx],
                response: response,
                hasData: response[cod] && Object.keys(response[cod]).length > 0,
                hasGentilico: response[cod] && response[cod]['GENTILICO']
            };
        })
        .then(function (obj) {

            console.log(idx, 'retrieved!');
            agg.push(obj);
            return getDados(municipios, idx+1, agg);
        });
}
