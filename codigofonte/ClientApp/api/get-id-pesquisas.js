var http = require('http');
var fs = require('fs');

var config = {
    pais: ['101010', '101000', '100000'], 
    ufs: ['101010', '101000', '1010', '1000'],  
    municipios: ['101010', '1010', '10'] 
};

var NIVEL_ATUAL = 'municipios';

var request = promiseRequest('http://servicodados.ibge.gov.br/api/v1/pesquisas/');

var pesquisas = request
    .then(pesquisas => pesquisas.filter(pesquisa => config[NIVEL_ATUAL].indexOf(pesquisa.contexto) >= 0))
    .then(pesquisas => { console.log(pesquisas.length); return pesquisas; });

var indicadores = pesquisas.then(pesquisas => {
    return Promise.all(pesquisas.map(pesquisa => {
        return promiseRequest('http://servicodados.ibge.gov.br/api/v1/pesquisas/' + pesquisa.id + '/indicadores/0')
            .then(indicadores => ({pesquisaId: pesquisa.id, indicadoresId: pesquisa.id === 23 ? indicadores.map(ind => ind.id) : indicadores.slice(0, 1).map(ind => ind.id)}));
    }));
});

var urls = indicadores.then(arr => arr.reduce( (array, obj, idx) => {
    return array.concat(obj.indicadoresId.map(id => obj.pesquisaId + '/' + id));
}, []))

urls.then(urls => {
    fs.writeFile('lista-ids-pesquisas-' + NIVEL_ATUAL + '.txt', urls.join('\n'), function(err) {
        if (err) { console.log('ERROR', err)}
        console.log('arquivo criado com sucesso');
    })
})



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