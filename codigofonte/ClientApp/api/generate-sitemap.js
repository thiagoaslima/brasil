var fs = require('fs');

var municipios = fs.readFileSync('lista-urls-locais.txt', 'utf8').split('\n').filter(Boolean);;
var pesquisas = fs.readFileSync('lista-urls-pesquisas2.txt', 'utf8').split('\n').filter(Boolean);;

var contents = [];

municipios.forEach(munUrl => {
    contents.push(`https://cidades.ibge.gov.br/v4/brasil/${munUrl}/panorama`);
    contents.push(`https://cidades.ibge.gov.br/v4/brasil/${munUrl}/historico`);

    pesquisas.forEach(pesqUrl => {
        contents.push(`https://cidades.ibge.gov.br/v4/brasil/${munUrl}/pesquisa/${pesqUrl}`);
        contents.push(`https://cidades.ibge.gov.br/v4/brasil/${munUrl}/pesquisa/${pesqUrl}?tipo=grafico`);
        contents.push(`https://cidades.ibge.gov.br/v4/brasil/${munUrl}/pesquisa/${pesqUrl}?tipo=cartograma`);
        contents.push(`https://cidades.ibge.gov.br/v4/brasil/${munUrl}/pesquisa/${pesqUrl}?tipo=ranking`);
    })

})



var i = 1;
while (contents.length > 0) {
    // Google limita o arquivo até 50 mil urls
    // salvando arquivos com 30 mil endereços
    var subgroup = contents.splice(0, 30000);
    var content = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n\t<url>\n\t\t<loc>${subgroup.join('</loc>\n\t</url>\n\t\t<loc>')}</loc>\n\t</url>\n</urlset>`;

    (function(i) {
        fs.writeFile(`sitemap${i}.txt`, content, function (err) {
            if (err) {
                return console.log(err);
            }

            console.log(`The file ${i} was saved!`);
        });
    }(i));

    i++;
}

function generateIndex(len) {
    let node = `\n\t<sitemap>\n\t\t<loc>https://cidades.ibge.gov.br/sitemap{{NUMERO}}.xml</loc>\n\t</sitemap>`;
    let tree = '<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
    for (let i = 1; i < len; i++) {
        tree += node.replace('{{NUMERO}}', i);
    }
    return tree + '\n</sitemapindex>';
}

fs.writeFile(`sitemap-index.txt`, generateIndex(i), function (err) {
    if (err) {
        return console.log(err);
    }

    console.log(`The file ${i} was saved!`);
}); 