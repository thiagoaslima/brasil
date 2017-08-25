/*
metadados dos links usados pela busca completa
*/
export const links = [
    {
        name: "Histórico & Fotos", //nome mostrado no resultado da busca
        link: "/historico", //link relativo
        //palavras chave (no caso das palavras que tem masculino/feminico/plural/partes em comum, incluir apenas o pedaço em comum entre elas)
        keywords: ["histórico", "história", "foto", "imagem", "imagens", "criad", "criação", "formad", "formação", "formação administrativa"],
        target: ["pais", "estado", "cidade"], //se o link serve para pais/estado/cidade
        tipo: "pagina" //tipo: página/pesquisa
    },
    {
        name: "Panorama",
        link: "/panorama", 
        keywords: ["panorama", "resumo", "prefeito", "gentílico", "natural", "código", "população", "população estimada", "população censo", "pessoas", "densidade demográfica", "Salário médio", "Pessoal ocupado", "População ocupada", "População trabalhando",
            "pessoal trabalhando", "escolarização", "IDEB", "Matrículas no ensino fundamental", "PIB per capita", "PIB", "IDHM", "Índice de Desenvolvimento Humano Municipal", "Mortalidade Infantil", "Internações por diarreia", "área", "Esgot", "Arborização", "Urbanização"],
        target: ["pais", "estado", "cidade"],
        tipo: "pagina"
    },
    {
        name: "Frota",
        link: "/pesquisa/22/0",
        keywords: ["frota", "veículo", "automóve", "carro", "caminh", "trator", "ônibus", "camioneta", "moto", "utilitário"],
        target: ["pais", "estado", "cidade"],
        tipo: "pesquisa"
    },
    {
        name: "Pecuária",
        link: "/pesquisa/18/0",
        keywords: ["Pecuária", "AQUICULTURA", "peixe", "camarão", "ASININ", "galin", "pato", "frango", "BICHO-DA-SEDA", "BOVIN", "boi", "vaca", "suín", "porco", "gado", "JACARÉ", "SIRI", "CARANGUEJO", "LAGOSTA", "BICHO-DA-SEDA", "leite", "búfalo", "cabra", "bode", "CAPRINO",
            "BUBALINO", "CODORNA", "COELHO", "ovo", "carne", "MEL DE ABELHA", "MUARES", "mula", "jumento", "OVINO", "ovelha", "SUÍNO", "EQUINO", "cavalo", "égua"],
        target: ["pais", "estado", "cidade"],
        tipo: "pesquisa"
    }
];
