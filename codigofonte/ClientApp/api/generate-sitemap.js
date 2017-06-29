var fs = require('fs');

var municipios = fs.readFileSync('lista-urls-locais.txt', 'utf8').split('\n').filter(Boolean);;
var pesquisas = fs.readFileSync('lista-urls-pesquisas2.txt', 'utf8').split('\n').filter(Boolean);;

var contents = [];

municipios.forEach(line => {
    contents.push(`https://cidades.ibge.gov.br/brasil/${line}/panorama`);
    contents.push(`https://cidades.ibge.gov.br/brasil/${line}/historico`);
})

municipios.forEach(munUrl => {
    pesquisas.forEach(pesqUrl => {
        contents.push(`https://cidades.ibge.gov.br/v4/brasil/${munUrl}/pesquisa/${pesqUrl}`)
    })
})


var i = 0;
while (contents.length > 0) {
    // Google limita o arquivo até 50 mil urls
    var subgroup = contents.splice(0, 49999);
    fs.writeFile(`sitemap${i}.txt`, subgroup.join('\n'), function (err) {
        if (err) {
            return console.log(err);
        }

        console.log(`The file ${i} was saved!`);
    }); 
    i++;
}