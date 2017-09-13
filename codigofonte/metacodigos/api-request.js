var http = require('http');

function getJSON(url) {

    return new Promise(resolve => {
        http.get(url, function (response) {
            let body = '';

            // Continuously update stream with data
            response.on('data', async function (d) {
                body += d;
            });

            response.on('end', function () {
                // Data reception is done, do whatever with it!
                resolve(JSON.parse(body));
            });
        });
    })
}

getJSON('http://servicodados.ibge.gov.br/api/v1/pesquisas')
    .then(console.log.bind(console, 1))

