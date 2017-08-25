/*
metadados dos links usados pela busca completa
*/
export const links = [
    {
        name: "Histórico & Foto", //nome mostrado no resultado da busca
        link: "/historico", //link relativo
        //palavras chave (no caso das palavras que tem masculino/feminico/plural/partes em comum, incluir apenas o pedaço em comum entre elas)
        keywords: ["histórico", "história", "foto", "imagem", "imagen", "criad", "criação", "formad", "formação", "formação administrativa"],
        target: ["pai", "estado", "cidade"], //se o link serve para pais/estado/cidade
        tipo: "pagina" //tipo: página/pesquisa
    },
    {
        name: "Panorama",
        link: "/panorama", 
        keywords: ["panorama", "resumo", "prefeito", "gentílico", "natural", "código", "população", "população estimada", "população censo", "pessoa", "densidade demográfica", "Salário médio", "Pessoal ocupado", "População ocupada", "População trabalhando",
            "pessoal trabalhando", "escolarização", "IDEB", "Matrículas no ensino fundamental", "PIB per capita", "PIB", "IDHM", "Índice de Desenvolvimento Humano Municipal", "Mortalidade Infantil", "Internações por diarreia", "área", "Esgot", "Arborização", "Urbanização"],
        target: ["pai", "estado", "cidade"],
        tipo: "pagina"
    },

    {
        name: "Cadastro Central de Empresa",
        link: "/pesquisa/19/0",
        keywords: ["CADASTRO CENTRAL DE EMPRESA", 
                    "EMPRESA",
                    "ECONÔMICA",
                    "ADMINISTRAÇÃO PÚBLICA",
                    "SEGURIDADE SOCIAL",
                    "DEFESA",
                    "PRODUÇÃO FLORESTAL",
                    "PESCA",
                    "AQUICULTURA",
                    "DESCONTAMINAÇÃO",
                    "ALOJAMENTO",
                    "ALIMENTAÇÃO",
                    "ARTE",
                    "CULTURA",
                    "ESPORTE",
                    "RECREAÇÃO",
                    "FINANCEIRA",
                    "SEGUROS",
                    "ADMINISTRATIVA",
                    "IMOBILIÁRIA",
                    "CIENTÍFICA",
                    "TÉCNICA",
                    "COMÉRCIO",
                    "REPARAÇÃO",
                    "CONSTRUÇÃO",
                    "INDÚSTRIA",
                    "COMUNICAÇÃO",
                    "INFORMAÇÃO",
                    "INTERNACIONA",
                    "EXTRATERRITORIA",
                    "TRANSPORTE",
                    "ARMAZENAGEM",
                    "CORREIO"],
        target: ["cidade"],
        tipo: "pesquisa"
    },

    {
        name: "Mortalidade Infantil",
        link: "/pesquisa/39/0",
        keywords: ["MORTALIDADE",
                    "INFANTIL",
                    "INFANTO"],
        target: ["cidade"],
        tipo: "pesquisa"
    },

    {
        name: "Saúde",
        link: "/pesquisa/32/0",
        keywords: ["SAÚDE",
                    "EMERGÊNCIA",
                    "MÉDIC",
                    "CIRURGIA",
                    "CLÍNICA",
                    "BUCOMAXILOFACIAL",
                    "NEUROCIRURGIA",
                    "OBSTETRÍCIA",
                    "PEDIATRIA",
                    "PSIQUIATRIA",
                    "TRAUMATO-ORTOPEDIA",
                    "CIRÚRGICA",
                    "CATEGORIA",
                    "INTERNAÇÃO",
                    "ESPECIALIDADE",
                    "AMBULATORIAL",
                    "DIÁLISE",
                    "EMERGÊNCIA",
                    "UTI",
                    "CTI",
                    "ASSISTÊNCIA",
                    "ODONTOLÓGIC",
                    "TERAPIA",
                    "SADT",
                    "EQUIPAMENTO",
                    "ELETROCARDIÓGRAFO",
                    "ELETROENCEFALÓGRAFO",
                    "HEMODIÁLISE",
                    "MAMÓGRAFO",
                    "COMANDO",
                    "ESTÉREO",
                    "RAIO X",
                    "DENSITOMETRIA ÓSSEA",
                    "RESSONÂNCIA MAGNÉTICA",
                    "TOMÓGRAFO",
                    "ULTRASSOM",
                    "LEITO"],
        target: ["cidade"],
        tipo: "pesquisa"
    },

    {
        name: "Registro Civil",
        link: "/pesquisa/20/0",
        keywords: ["REGISTRO",
                    "CIVIL",
                    "CASAMENTO",
                    "DIVÓRCIO",
                    "NASCID",
                    "NASCIMENTO",
                    "MÃE",
                    "REGISTRADO",
                    "ÓBITO",
                    "FALECIDO",
                    "FETAI",
                    "SEPARAÇ",
                    "JUDICIAL",
                    "ESCRITURA",
                    "TABELIONATO"],
        target: ["cidade"],
        tipo: "pesquisa"
    },

    {
        name: "Produto Interno Bruto dos Município",
        link: "/pesquisa/38/0",
        keywords: ["PRODUTO INTERNO BRUTO MUNICÍPIO",
                    "PIB",
                    "PREÇO",
                    "PER CAPITA",
                    "VALOR",
                    "IMPOSTO",
                    "SUBSÍDIO",
                    "PRODUTO"],
        target: ["cidade"],
        tipo: "pesquisa"
    },

    {
        name: "Produção Agrícola - Lavoura Temporária",
        link: "/pesquisa/14/0",
        keywords: ["LAVOURA",
                    "TEMPORÁRIA",
                    "ABACAXI",
                    "PRODUÇÃO",
                    "PLANTA",
                    "COLHIDA",
                    "ALGODÃO",
                    "HERBÁCEO",
                    "CAROÇO",
                    "ALHO",
                    "AMENDOIM",
                    "CASCA",
                    "ARROZ",
                    "AVEIA",
                    "BATATA-DOCE",
                    "BATATA-INGLESA",
                    "CANA-DE-AÇÚCAR",
                    "CEBOLA",
                    "CENTEIO",
                    "CEVADA",
                    "ERVILHA",
                    "FAVA",
                    "FEIJÃO",
                    "FUMO",
                    "FOLHA",
                    "GIRASSOL",
                    "JUTA",
                    "FIBRA",
                    "LINHO",
                    "MALVA",
                    "MAMONA",
                    "BAGA",
                    "MANDIOCA",
                    "MELANCIA",
                    "MELÃO",
                    "MILHO",
                    "RAMI",
                    "SOJA",
                    "SORGO",
                    "TOMATE",
                    "TRIGO",
                    "TRITICALE"],
        target: ["cidade"],
        tipo: "pesquisa"
    },

    {
        name: "Produção Agrícola - Lavoura Permanente",
        link: "/pesquisa/15/0",
        keywords: ["LAVOURA PERMANENTE",
                    "ABACATE",
                    "ALGODÃO",
                    "CAROÇO",
                    "AZEITONA",
                    "BANANA",
                    "CACHO",
                    "BORRACHA",
                    "CACAU",
                    "AMÊNDOA",
                    "CAFÉ",
                    "ARÁBICA",
                    "CANEPHORA",
                    "CAQUI",
                    "CASTANHA",
                    "CHÁ-DA-ÍNDIA",
                    "FOLHA VERDE",
                    "COCO-DA-BAÍA",
                    "DENDÊ",
                    "COCO",
                    "ERVA-MATE",
                    "FOLHA VERDE",
                    "FIGO",
                    "GOIABA",
                    "GUARANÁ",
                    "LARANJA",
                    "LIMÃO",
                    "MAÇÃ",
                    "MAMÃO",
                    "MANGA",
                    "MARACUJÁ",
                    "MARMELO",
                    "NOZ",
                    "FRUTO SECO",
                    "PALMITO",
                    "PERA",
                    "PÊSSEGO",
                    "PIMENTA-DO-REINO",
                    "SISAL",
                    "AGAVE",
                    "TANGERINA",
                    "TUNGUE",
                    "URUCUM",
                    "UVA"],
        target: ["cidade"],
        tipo: "pesquisa"
    },

    {
        name: "Produção Agrícola - Cereais, Leguminosas e Oleaginosa",
        link: "/pesquisa/31/0",
        keywords: ["PRODUÇÃO AGRÍCOLA",
                    "CEREAI",
                    "LEGUMINOSA",
                    "OLEAGINOSA",
                    "ALGODÃO",
                    "ARBÓREO",
                    "CAROÇO",
                    "HERBÁCEO",
                    "CAROÇO",
                    "AMENDOIM",
                    "ARROZ",
                    "AVEIA",
                    "CENTEIO",
                    "CEVADA",
                    "FEIJÃO",
                    "GIRASSOL",
                    "MAMONA",
                    "BAGA",
                    "MILHO",
                    "SOJA",
                    "SORGO GRANÍFERO",
                    "TRIGO",
                    "TRITICALE"],
        target: ["cidade"],
        tipo: "pesquisa"
    },


    {
        name: "Saneamento Básico",
        link: "/pesquisa/30/0",
        keywords: ["SANEAMENTO BÁSICO",
                    "SANEAMENTO",
                    "ABASTECIMENTO",
                    "ÁGUA",
                    "TRATADA",
                    "TRATAMENTO",
                    "DISTRIBUIÇÃO",
                    "DESINFECÇÃO",
                    "CLORAÇÃO",
                    "PLUVIA",
                    "DRENAGEM",
                    "COLETORA",
                    "EFLUENTE",
                    "LAGOA",
                    "MAR",
                    "DRENAGEM",
                    "ESGOT",
                    "PLUVIAI",
                    "HÍDRICO"],
        target: ["cidade"],
        tipo: "pesquisa"
    },


    {
        name: "Serviços de Hospedagem",
        link: "/pesquisa/34/0",
        keywords: ["SERVIÇOS DE HOSPEDAGEM",
                    "HABITACIONAI",
                    "HOSPEDAGEM",
                    "ACOMODAÇÃO",
                    "APARTAMENTO",
                    "ESTABELECIMENTO",
                    "ALBERGUE",
                    "APART-HOTEL",
                    "HOTEL",
                    "MOTEL",
                    "PENSÃO",
                    "POUSADA",
                    "CHALÉ",
                    "QUARTO",
                    "SUÍTE"],
        target: ["cidade"],
        tipo: "pesquisa"
    },


    {
        name: "Pecuária",
        link: "/pesquisa/18/0",
        keywords: ["PECUÁRIA",
                    "AQUICULTURA",
                    "ALEVINO",
                    "CAMARÃO",
                    "LARVAS ",
                    "CARPA",
                    "CURIMATÃ",
                    "CURIMBATÁ",
                    "DOURADO",
                    "JATUARANA",
                    "PIABANHA",
                    "PIRACANJUBA",
                    "LAMBARI",
                    "MATRINXÃ",
                    "OSTRA",
                    "VIEIRA", 
                    "MEXILH",
                    "PACU",
                    "PATINGA",
                    "PIAU", 
                    "PIAPARA", 
                    "PIAUÇU", 
                    "PIAVA",
                    "PINTADO", 
                    "CACHARA",
                    "CACHAPIRA",
                    "PINTACHARA", 
                    "SURUBIM",
                    "PIRAPITINGA",
                    "PIRARUCU",
                    "MOLUSCO",
                    "TAMBACU",
                    "TAMBATINGA",
                    "TAMBAQUI",
                    "TILÁPIA",
                    "TRAÍRA",
                    "TRAIRÃO",
                    "TRUTA",
                    "TUCUNARÉ",
                    "PEIXE",
                    "RÃ",
                    "JACARÉ",
                    "SIRI",
                    "CARANGUEJO",
                    "LAGOSTA",
                    "ASININO",
                    "BICHO-DA-SEDA",
                    "BOVINO",
                    "VACA ORDENHADA",
                    "REBANHO",
                    "LEITE",
                    "BUBALINO",
                    "CAPRINO",
                    "CODORNA",
                    "OVO",
                    "COELHO",
                    "CABEÇA",
                    "EQUINO",
                    "GALINÁCEO",
                    "GALO",
                    "PINTO",
                    "GALINHA",
                    "MEL DE ABELHA",
                    "MUARE",
                    "OVINO",
                    "TOSQUIADO",
                    "LÃ",
                    "SUÍNO",
                    "MATRIZ"],
        target: ["cidade"],
        tipo: "pesquisa"
    },


    {
        name: "Notificações de Dengue",
        link: "/pesquisa/42/0",
        keywords: ["NOTIFICAÇÕES DENGUE",
                    "DENGUE",
                    "MOSQUITO"],
        target: ["cidade"],
        tipo: "pesquisa"
    },


    {
        name: "Morbidade Hospitalar",
        link: "/pesquisa/17/0",
        keywords: ["MORBIDADE HOSPITALAR",
                    "MORBIDADE",
                    "HOSPITALAR",
                    "ÓBITO",
                    "DOENÇA",
                    "CIRCULATÓRIO",
                    "DIGESTIVO",
                    "GENITURINÁRIO",
                    "RESPIRATÓRIO",
                    "ENDÓCRINAS", 
                    "NUTRICIONAIS",
                    "METABÓLICA",
                    "INFECCIOSAS",
                    "PARASITÁRIA",
                    "OLHO",
                    "PERINATAL",
                    "OSTEOMUSCULAR",
                    "CONJUNTIVO",
                    "OUVIDO",
                    "PELE",
                    "SANGUE",
                    "HEMATOLÓGICOS",
                    "IMUNITÁRIO",
                    "TRANSTORNO",
                    "NERVOSO",
                    "GRAVIDEZ",
                    "PARTO",
                    "PUERPÉRIO",
                    "LESÕES",
                    "ENVENENAMENTOS",
                    "MALFORMAÇÕES",
                    "CONGÊNITAS", 
                    "DEFORMIDADES", 
                    "ANOMALIAS",
                    "CROMOSSÔMICA",
                    "NEOPLASIA",
                    "TUMOR",
                    "CLÍNICO", 
                    "LABORATORI",
                    "TRANSTORNO",
                    "COMPORTAMENTA"],
        target: ["cidade"],
        tipo: "pesquisa"
    },


    {
        name: "Mapa da Pobreza e Desigualdade",
        link: "/pesquisa/36/0",
        keywords: ["MAPA DE POBREZA",
                    "POBREZA",
                    "DESIGUALDADE",
                    "GINI"],
        target: ["cidade"],
        tipo: "pesquisa"
    },

    {
        name: "Instituições Financeiras",
        link: "/pesquisa/29/0",
        keywords: ["INSTITUIÇÕES FINANCEIRA",
                    "INSTITUIÇÕES",
                    "FINANCEIR",
                    "DEPÓSITO",
                    "PRAZO",
                    "VISTA",
                    "AGÊNCIA",
                    "RECEBIMENTO",
                    "CRÉDITO",
                    "POUPANÇA"],
        target: ["cidade"],
        tipo: "pesquisa"
    },

    {
        name: "Índice de Desenvolvimento Humano",
        link: "/pesquisa/37/0",
        keywords: ["ÍNDICE DE DESENVOLVIMENTO HUMANO",
                    "HUMANO",
                    "IDH"],
        target: ["cidade"],
        tipo: "pesquisa"
    },

    {
        name: "Índice de Desenvolvimento da Educação Básica",
        link: "/pesquisa/40/0",
        keywords: ["ÍNDICE DE DESENVOLVIMENTO DA EDUCAÇÃO BÁSICA",
                    "EDUCAÇÃO",
                    "IDEB"],
        target: ["cidade"],
        tipo: "pesquisa"
    },

    {
        name: "Fundações Privadas e Associações Sem Fins Lucrativo",
        link: "/pesquisa/35/0",
        keywords: ["FUNDAÇÕES PRIVADAS E ASSOCIAÇÕES SEM FINS LUCRATIVO",
                    "ENTIDADES",
                    "LUCRATIVO",
                    "ASSOCIAÇ",
                    "FUNDAÇ",
                    "PARTIDOS",
                    "POLÍTICOS", 
                    "SINDICATOS", 
                    "PATRONA", 
                    "PROFISSIONAI"],
        target: ["cidade"],
        tipo: "pesquisa"
    },

    {
        name: "Frota",
        link: "/pesquisa/22/0",
        keywords: ["FROTA",
                    "VEÍCULO",
                    "AUTOMÓVEL",
                    "CAMINHÃO",
                    "CAMINHÃO TRATOR",
                    "CAMINHONETE",
                    "CAMIONETA",
                    "MICRO-ÔNIBU",
                    "MOTOCICLETA",
                    "MOTONETA",
                    "ÔNIBU",
                    "TRATOR DE RODA",
                    "UTILITÁRIO",
                    "CARRO"],
        target: ["cidade"],
        tipo: "pesquisa"
    },

    {
        name: "Finanças Pública",
        link: "/pesquisa/21/0",
        keywords: ["FINANÇAS PÚBLICA",
                    "FINANÇAS",
                    "DESPESAS",
                    "ORÇAMENTÁRIA",
                    "EMPENHADA",
                    "INVESTIMENTO",
                    "OBRAS",
                    "PESSOAL",
                    "ENCARGOS",
                    "REALIZADA",
                    "RECEITAS",
                    "CONTRIBUIÇÃO",
                    "DÍVIDA",
                    "IMPOSTO",
                    "IPTU",
                    "ISS",
                    "ITBI",
                    "PATRIMONIAL",
                    "TAXA",
                    "TRANSFERÊNCIA",
                    "INTERGORVENAMENTAL",
                    "TRIBUTÁRIA",
                    "FUNDO",
                    "FPM",
                    "IOF",
                    "OURO",
                    "REPASSADO",
                    "ITR"],
        target: ["cidade"],
        tipo: "pesquisa"
    },

    {
        name: "Extração Vegetal e Silvicultura",
        link: "/pesquisa/16/0",
        keywords: ["EXTRAÇÃO VEGETAL E SILVICULTURA",
                    "EXTRAÇÃO",
                    "VEGETAL",
                    "SILVICULTURA",
                    "ALIMENTÍCIO",
                    "AÇAÍ",
                    "FRUTO",
                    "CASTANHA DE CAJÚ",
                    "CASTANHA-DO-PARÁ",
                    "ERVA-MATE",
                    "MANGABA",
                    "PALMITO",
                    "PEQUI",
                    "PINHÃO",
                    "UMBU",
                    "AROMÁTICOS",
                    "MEDICINAIS", 
                    "TÓXICOS", 
                    "CORANTE",
                    "IPECACUANHA",
                    "POAIA",
                    "RAIZ",
                    "JABORANDI",
                    "FOLHA",
                    "URUCUM",
                    "SEMENTE",
                    "BORRACHA",
                    "CAUCHO",
                    "HÉVEA",
                    "LÁTEX",
                    "CERA",
                    "CARNAÚBA",
                    "CERA",
                    "PÓ",
                    "FIBRA",
                    "BURITI",
                    "CARNAÚBA",
                    "PIAÇAVA",
                    "GOMA",
                    "NÃO ELÁSTICA",
                    "BALATA",
                    "MAÇARANDUBA",
                    "SORVA",
                    "MADEIRA",
                    "CARVÃO VEGETAL",
                    "LENHA",
                    "MADEIRA EM TORA",
                    "OLEAGINOSO",
                    "BABAÇU",
                    "AMÊNDOA",
                    "COPAÍBA",
                    "ÓLEO",
                    "CUMARU",
                    "LICURI",
                    "COQUILHO",
                    "OITICICA",
                    "SEMENTE",
                    "PEQUI",
                    "TUCUM",
                    "PINHEIRO",
                    "NÓ-DE-PINHO",
                    "ÁRVORES",
                    "MADEIRA",
                    "TANANTE",
                    "ANGICO",
                    "CASCA",
                    "BARBATIMÃO",
                    "SILVICULTURA",
                    "EUCALIPTO",
                    "PINU",
                    "ACÁCIA-NEGRA",
                    "LENHA",
                    "PAPEL",
                    "CELULOSE",
                    "RESINA"],
        target: ["cidade"],
        tipo: "pesquisa"
    },

    {
        name: "Ensino - Matrículas, Docentes e Rede Escolar",
        link: "/pesquisa/13/0",
        keywords: ["ENSINO - MATRÍCULAS, DOCENTES E REDE ESCOLAR",
                    "MATRÍCULAS",
                    "PROFESSOR",
                    "ALUNO",
                    "DOCENTES",
                    "ESCOLA",
                    "ENSINO"],
        target: ["cidade"],
        tipo: "pesquisa"
    },

    {
        name: "Censo Agropecuário",
        link: "/pesquisa/24/0",
        keywords: ["CENSO AGROPECUÁRIO",
                    "AGROPECUÁRIO",
                    "AGRO",
                    "TERRA",
                    "LAVOURA",
                    "GRÃO"],
        target: ["cidade"],
        tipo: "pesquisa"
    },

    {
        name: "Censo Sinopse",
        link: "/pesquisa/23/27652",
        keywords: ["CENSO SINOPSE",
                    "DOMICÍLIO",
                    "COLETIVO",
                    "MORADOR",
                    "PARTICULARE",
                    "ENTREVISTA",
                    "OCUPADO",
                    "RECENSEADO",
                    "POPULAÇÃO",
                    "RESIDENTE",
                    "MASCULINO",
                    "IDADE",
                    "ANO",
                    "DOMICILIAR",
                    "URBANA",
                    "FEMININO",
                    "PESSOA",
                    "RURAL",
                    "MORADORE"],
        target: ["cidade"],
        tipo: "pesquisa"
    },

    {
        name: "Censo Nupcialidade",
        link: "/pesquisa/23/22714",
        keywords: ["NUPCIALIDADE",
                    "CASAMENTO",
                    "ESTADO CIVIL",
                    "CASADO",
                    "CASADA",
                    "CASADO",
                    "DESQUITADO",
                    "DESQUITADA",
                    "DESQUITADO",
                    "SEPARADO",
                    "SEPARADA",
                    "SEPARADO",
                    "DIVORCIADO",
                    "DIVORCIADA",
                    "DIVORCIADO",
                    "SOLTEIRO",
                    "SOLTEIRA",
                    "SOLTEIRO",
                    "VIÚVO",
                    "VIÚVA",
                    "VIÚVO",
                    "URBANA",
                    "RURAL",
                    "URBANA",
                    "CONJUGAL",
                    "UNIÃO",
                    "COR",
                    "RAÇA",
                    "AMARELA",
                    "BRANCA",
                    "INDÍGENA",
                    "PARDA",
                    "PRETA",
                    "CONJUGAL",
                    "CASAMENTO CIVIL",
                    "CASAMENTO RELIGIOSO",
                    "CONSENSUAL"],
        target: ["cidade"],
        tipo: "pesquisa"
    },


    {
        name: "Censo - Pessoas com Deficiência",
        link: "/pesquisa/23/23612",
        keywords: ["DEFICIÊNCIA",
                    "DEFICIÊNTE",
                    "AUDITIVA",
                    "MENTAL",
                    "INTELECTUAL",
                    "MOTORA",
                    "VISUAL"],
        target: ["cidade"],
        tipo: "pesquisa"
    },

    {
        name: "Censo - Religião",
        link: "/pesquisa/23/22107",
        keywords: ["RELIGIÃO",
                    "IGREJA",
                    "CATÓLICA APOSTÓLICA ROMANA",
                    "ESPÍRITA",
                    "EVANGÉLICA",
                    "MISSIONÁRIA",
                    "PENTECOSTAL",
                    "UMBANDA",
                    "CANDOMBLÉ",
                    "RELIGIOSIDADE",
                    "AGNÓSTICO",
                    "ATEU",
                    "BUDISMO",
                    "CATÓLICA APOSTÓLICA BRASILEIRA",
                    "CATÓLICA ORTODOXA",
                    "ESPIRITUALISTA",
                    "ADVENTISTA",
                    "BATISTA",
                    "CONGREGACIONAL",
                    "LUTERANA",
                    "METODISTA",
                    "PRESBITERIANA",
                    "COMUNIDADE EVANGÉLICA",
                    "EVANGÉLICA RENOVADA",
                    "ASSEMBLÉIA DE DEU",
                    "CASA DA BÊNÇÃO",
                    "CONGREGAÇÃO CRISTÃ DO BRASIL",
                    "DEUS É AMOR",
                    "IGREJA DO EVANGELHO QUADRANGULAR",
                    "MARANATA",
                    "NOVA VIDA",
                    "O BRASIL PARA CRISTO",
                    "IGREJA UNIVERSAL DO REINO DE DEU",
                    "HINDUÍSMO",
                    "IGREJA DE JESUS CRISTO DOS SANTOS DOS ÚLTIMOS DIA",
                    "ISLAMISMO",
                    "JUDAÍSMO",
                    "IGREJA MESSIÂNICA MUNDIAL",
                    "TESTEMUNHAS DE JEOVÁ",
                    "CRISTÃ"],
        target: ["cidade"],
        tipo: "pesquisa"
    },

    {
        name: "Censo - Rendimento",
        link: "/pesquisa/23/22787",
        keywords: ["RENDIMENTO",
                    "SALÁRIO",
                    "PREVIDÊNCIA",
                    "CONTRIBUINTE"],
        target: ["cidade"],
        tipo: "pesquisa"
    },

    {
        name: "Censo - Trabalho",
        link: "/pesquisa/23/22957",
        keywords: ["TRABALHO",
                    "APOSENTADA",
                    "PENSIONISTA",
                    "OCUPAÇ",
                    "OPERADOR",
                    "PROFISSIONA",
                    "TRABALHADA",
                    "EMPREGADORE",
                    "EMPREGADO",
                    "DOMÉSTIC"],
        target: ["cidade"],
        tipo: "pesquisa"
    },

    {
        name: "Censo - Trabalho Infantil",
        link: "/pesquisa/23/23226",
        keywords: ["TRABALHO INFANTIL",
                    "INFANTIL",
                    "CRIANÇA"],
        target: ["cidade"],
        tipo: "pesquisa"
    },

    {
        name: "Aglomerados Subnormais",
        link: "/pesquisa/23/25359",
        keywords: ["AGLOMERADOS SUBNORMAIS",
                    "AGLOMERADOS",
                    "SUBNORMAIS",
                    "FAVELA"],
        target: ["cidade"],
        tipo: "pesquisa"
    },

    // {
    //     name: "",
    //     link: "/pesquisa/xxx/0",
    //     keywords: [],
    //     target: ["cidade"],
    //     tipo: "pesquisa"
    // },

    // {
    //     name: "",
    //     link: "/pesquisa/xxx/0",
    //     keywords: [],
    //     target: ["cidade"],
    //     tipo: "pesquisa"
    // },

    // {
    //     name: "",
    //     link: "/pesquisa/xxx/0",
    //     keywords: [],
    //     target: ["cidade"],
    //     tipo: "pesquisa"
    // },

    // {
    //     name: "",
    //     link: "/pesquisa/xxx/0",
    //     keywords: [],
    //     target: ["cidade"],
    //     tipo: "pesquisa"
    // },

    // {
    //     name: "",
    //     link: "/pesquisa/xxx/0",
    //     keywords: [],
    //     target: ["cidade"],
    //     tipo: "pesquisa"
    // },

    // {
    //     name: "",
    //     link: "/pesquisa/xxx/0",
    //     keywords: [],
    //     target: ["cidade"],
    //     tipo: "pesquisa"
    // },    
];
