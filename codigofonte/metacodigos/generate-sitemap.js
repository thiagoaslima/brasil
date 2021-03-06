var fs = require('fs');
var path = require('path');
var folderEntrada = './listas/';
var folderDestino = '../wwwroot/';

var pais = fs.readFileSync(path.join(folderEntrada, 'lista-pais.txt'), 'utf8').split('\n').filter(Boolean);
var ufs = fs.readFileSync(path.join(folderEntrada, 'lista-ufs.txt'), 'utf8').split('\n').filter(Boolean);
var municipios = fs.readFileSync(path.join(folderEntrada, 'lista-municipios.txt'), 'utf8').split('\n').filter(Boolean);

var pesquisasPais = fs.readFileSync(path.join(folderEntrada, 'lista-ids-pesquisas-pais.txt'), 'utf8').split('\n').filter(Boolean);
var pesquisasUfs = fs.readFileSync(path.join(folderEntrada, 'lista-ids-pesquisas-ufs.txt'), 'utf8').split('\n').filter(Boolean);
var pesquisasMun = fs.readFileSync(path.join(folderEntrada, 'lista-ids-pesquisas-municipios.txt'), 'utf8').split('\n').filter(Boolean);

var contents = [];

municipios.forEach(munUrl => {
    contents.push(`https://cidades.ibge.gov.br/v4/brasil/${munUrl}/panorama`);
    contents.push(`https://cidades.ibge.gov.br/v4/brasil/${munUrl}/historico`);

    pesquisasMun.forEach(pesqUrl => {
        contents.push(`https://cidades.ibge.gov.br/v4/brasil/${munUrl}/pesquisa/${pesqUrl}`);
        contents.push(`https://cidades.ibge.gov.br/v4/brasil/${munUrl}/pesquisa/${pesqUrl}?tipo=grafico`);
        // contents.push(`https://cidades.ibge.gov.br/v4/brasil/${munUrl}/pesquisa/${pesqUrl}?tipo=cartograma`);
        contents.push(`https://cidades.ibge.gov.br/v4/brasil/${munUrl}/pesquisa/${pesqUrl}?tipo=ranking`);
    })

})

ufs.forEach(munUf => {
    contents.push(`https://cidades.ibge.gov.br/v4/brasil/${munUf}/panorama`);
    contents.push(`https://cidades.ibge.gov.br/v4/brasil/${munUf}/historico`);

    pesquisasUfs.forEach(pesqUrl => {
        contents.push(`https://cidades.ibge.gov.br/v4/brasil/${munUf}/pesquisa/${pesqUrl}`);
        contents.push(`https://cidades.ibge.gov.br/v4/brasil/${munUf}/pesquisa/${pesqUrl}?tipo=grafico`);
        // contents.push(`https://cidades.ibge.gov.br/v4/brasil/${munUf}/pesquisa/${pesqUrl}?tipo=cartograma`);
        contents.push(`https://cidades.ibge.gov.br/v4/brasil/${munUf}/pesquisa/${pesqUrl}?tipo=ranking`);
    })

})

// pais.forEach(munUrl => {
//     contents.push(`https://cidades.ibge.gov.br/v4/brasil/panorama`);
//     contents.push(`https://cidades.ibge.gov.br/v4/brasil/historico`);

//     pesquisasPais.forEach(pesqUrl => {
//         contents.push(`https://cidades.ibge.gov.br/v4/brasil/pesquisa/${pesqUrl}`);
//         contents.push(`https://cidades.ibge.gov.br/v4/brasil/pesquisa/${pesqUrl}?tipo=grafico`);
//         contents.push(`https://cidades.ibge.gov.br/v4/brasil/pesquisa/${pesqUrl}?tipo=cartograma`);
//         contents.push(`https://cidades.ibge.gov.br/v4/brasil/pesquisa/${pesqUrl}?tipo=ranking`);
//     })

// })

console.log(contents.length);

fs.readdirSync(folderDestino).forEach(file => {
    if (file.indexOf('sitemap') >= 0 && file.indexOf('.xml') > 0) {
        fs.unlinkSync(path.join(folderDestino, file));
    }
})

var i = 1;
while (contents.length > 0) {
    // Google limita o arquivo até 50 mil urls
    // salvando arquivos com 30 mil endereços
    var subgroup = contents.splice(0, 30000);
    var content = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n\t<url>\n\t\t<loc>${subgroup.join('</loc>\n\t</url>\n\t<url>\n\t\t<loc>')}</loc>\n\t</url>\n</urlset>`;

    (function (i) {
        fs.writeFileSync(path.join(folderDestino, `sitemap${pad(i)}.xml`), content, function (err) {
            if (err) {
                return console.log(err);
            }

            console.log(`The file ${pad(i)} was saved!`);
        });
    }(i));

    i++;
}

function generateIndex(len) {
    let node = `\n\t<sitemap>\n\t\t<loc>https://cidades.ibge.gov.br/sitemap{{NUMERO}}.xml</loc>\n\t</sitemap>`;
    let tree = '<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
    for (let i = 1; i < len; i++) {
        tree += node.replace('{{NUMERO}}', pad(i));
    }
    return tree + '\n</sitemapindex>';
}

fs.writeFileSync(path.join(folderDestino, `sitemap-index.xml`), generateIndex(i), function (err) {
    if (err) {
        return console.log(err);
    }

    console.log(`The file ${i} was saved!`);
});

function pad(number, size) {
    var s = String(number);
    while (s.length < (size || 2)) { s = "0" + s; }
    return s;
}