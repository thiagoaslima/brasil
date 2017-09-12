import { urls } from './lista-urls';

const http = require('https');
const fs = require('fs');

const check = checkUrl(urls, 0, []);

const dados = check.then(response => {
    console.log('http request ended!');
    return response.reduce( (agg, obj) => {
        agg.responses[obj.url] = obj;
        if (obj.ok) {
            agg.ok.push(obj.url);
        }
        if (obj.missing) {
            agg.missing.push(obj.url);
        }
        if (obj.error) {
            agg.error.push(obj.url);
        }
    }, { ok: [], error: [], missing: [], responses: {} });
});

dados.then(values => fs.writeFileSync('teste-prerender.txt', JSON.stringify(values)));

function checkUrl(urls, idx, agg) {
    let errors = 0;
    console.log(idx, urls[idx], 'requested');

    if (!urls[idx]) {
        return new Promise(function (resolve, request) { resolve(agg); });
    }

    return promiseRequest('https://cidades.ibge.gov.br/v4/' + urls[idx])
        .then(function (status) {
            console.log(idx, ':', status);
            return {
                url: urls[idx],
                status: status,
                ok: status === 200,
                error: status >= 500,
                missing: status === 400
            };
        })
        .then(function (obj) {

            console.log(idx, urls[idx], 'retrieved!');
            agg.push(obj);
            return checkUrl(urls, idx+1, agg);
        })
        .catch(function(err) {
            errors++;
            if (errors < 10) {
                console.log('Erro no:', errors);
                return checkUrl(urls, idx, agg);
            }
        });
}

function promiseRequest(url) {
    return new Promise(function (resolve, reject) {
        // var timerId = setTimeout(reject(new Error('timeout')), 30);
        return http.get(url, function (response) {
            resolve(response.statusCode);
        }, function(err) {
            reject(err);
        });
    });
}
