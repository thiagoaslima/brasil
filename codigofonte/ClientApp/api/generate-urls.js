var fs = require('fs');

var pais = fs.readFileSync('lista-pais.txt', 'utf8').split('\n').filter(Boolean);
var ufs = fs.readFileSync('lista-ufs.txt', 'utf8').split('\n').filter(Boolean);
var municipios = fs.readFileSync('lista-municipios.txt', 'utf8').split('\n').filter(Boolean);

var pesquisasPais = fs.readFileSync('lista-ids-pesquisas-pais.txt', 'utf8').split('\n').filter(Boolean);
var pesquisasUfs = fs.readFileSync('lista-ids-pesquisas-ufs.txt', 'utf8').split('\n').filter(Boolean);
var pesquisasMun = fs.readFileSync('lista-ids-pesquisas-municipios.txt', 'utf8').split('\n').filter(Boolean);

var contents = [];

municipios.forEach(munUrl => {
    contents.push(`${munUrl}/panorama`);
    contents.push(`${munUrl}/historico`);

    pesquisasMun.forEach(pesqUrl => {
        contents.push(`${munUrl}/pesquisa/${pesqUrl}`);
        contents.push(`${munUrl}/pesquisa/${pesqUrl}?tipo=grafico`);
        // contents.push(`${munUrl}/pesquisa/${pesqUrl}?tipo=cartograma`);
        contents.push(`${munUrl}/pesquisa/${pesqUrl}?tipo=ranking`);
    })

})

ufs.forEach(munUf => {
    contents.push(`${munUf}/panorama`);
    contents.push(`${munUf}/historico`);

    pesquisasUfs.forEach(pesqUrl => {
        contents.push(`${munUf}/pesquisa/${pesqUrl}`);
        contents.push(`${munUf}/pesquisa/${pesqUrl}?tipo=grafico`);
        // contents.push(`${munUf}/pesquisa/${pesqUrl}?tipo=cartograma`);
        contents.push(`${munUf}/pesquisa/${pesqUrl}?tipo=ranking`);
    })

})

// pais.forEach(munUrl => {
//     contents.push(`panorama`);
//     contents.push(`historico`);

//     pesquisasPais.forEach(pesqUrl => {
//         contents.push(`pesquisa/${pesqUrl}`);
//         contents.push(`pesquisa/${pesqUrl}?tipo=grafico`);
//         contents.push(`pesquisa/${pesqUrl}?tipo=cartograma`);
//         contents.push(`pesquisa/${pesqUrl}?tipo=ranking`);
//     })

// })

const fileContents = 'export const urls =' + JSON.stringify(contents) + ';\n'

fs.writeFileSync(`lista-urls.ts`, fileContents , function (err) {
    if (err) {
        return console.log(err);
    }

    console.log(`The file lista-urls.txt was saved!`);
});

