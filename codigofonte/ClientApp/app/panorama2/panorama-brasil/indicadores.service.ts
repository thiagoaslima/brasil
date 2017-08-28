import { Injectable } from '@angular/core';

import { Http } from '@angular/http';

// import { Observable } from 'rxjs/Observable';
// import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/switchMap';
// import 'rxjs/add/operator/zip';
import { Observable } from 'rxjs';


@Injectable()
/**
 * Classe provedora de serviços relacionados à indicadores.
 */
export class IndicadoresService {

    /**
     * Parametrização dos indicadores acessados.
     *  NOME: Nome do indicador
     *  LEGENDA: Descrição od indicador
     *  LINK: Link para a página explicativa sobre o indicador
     *  SERVICE: URL de acesso ao serviço do backend, excluindo o parâmetro '&p=-', pois este é preenchido dinamicamente
     */
    public static INDICADORES = {

        'PMS': {
            'ALIAS': 'Serviços',
            'SIGLA': 'PMS',
            'NOME': 'Pesquisa Mensal de Serviços',
            'DESC': `A Pesquisa Mensal de Serviços produz indicadores que permitem acompanhar o comportamento conjuntural do setor de serviços no País, investigando a receita bruta de serviços nas empresas formalmente constituídas, com 20 ou mais pessoas ocupadas, que desempenham como principal atividade um serviço não financeiro, excluídas as áreas de saúde e educação.

            A pesquisa foi iniciada em janeiro de 2011 e apresenta indicadores a partir de janeiro de 2012. Compõem a pesquisa indicadores gerais, sem detalhamento por atividade, para o Brasil e as 27 Unidades da Federação. Para o Brasil, há indicadores por atividade, de acordo com os seguintes grupos e subgrupos: serviços prestados às famílias (alojamento e alimentação; outros serviços prestados às famílias); serviços de informação e comunicação (serviços TIC; serviços audiovisuais, de edição e agências de notícias); serviços profissionais, administrativos e complementares (serviços técnico-profissionais; serviços administrativos e complementares); transportes, serviços auxiliares aos transportes e correio (transporte terrestre; transporte aquaviário, transporte aéreo; armazenagem, serviços auxiliares dos transportes e correio); e outros serviços. Também são produzidos indicadores por atividade para os Estados do Ceará, Pernambuco, Bahia, Minas Gerais, Espírito Santo, Rio de Janeiro, São Paulo, Paraná, Santa Catarina, Rio Grande do Sul, Goiás e o Distrito Federal, com o seguinte nível de desagregação: serviços prestados às famílias; serviços de informação e comunicação; serviços profissionais, administrativos e complementares; transportes, serviços auxiliares aos transportes e correio; e outros serviços.`,
            'LINK': 'http://www.ibge.gov.br/home/estatistica/indicadores/servicos/pms/default.shtm',
            'GRAFICOS': [
                {
                    'ALIAS': 'Mês',
                    // 'SERVICE': 'http://servicodados.ibge.gov.br/api/v1/conjunturais?t=3839&ng=1&v=3802&user=ibge&d=2'
                    'SERVICE': 'http://servicodados.ibge.gov.br/api/v1/conjunturais?t=6442&ng=1&v=8677&c=11046(90668)&user=ibge&d=2'
                },
                // {
                //     'ALIAS': 'Ano',
                //     'SERVICE': 'http://servicodados.ibge.gov.br/api/v1/conjunturais?t=3839&ng=1&v=3803&user=ibge&d=2'
                //     'SERVICE': 'http://servicodados.ibge.gov.br/api/v1/conjunturais?t=6442&ng=1&v=8677&c=11046(90669)&user=ibge&d=2'
                // },
                {
                    'ALIAS': 'Acumulado 12 Meses',
                    // 'SERVICE': 'http://servicodados.ibge.gov.br/api/v1/conjunturais?t=3839&ng=1&v=3804&user=ibge&d=2'
                    'SERVICE': 'http://servicodados.ibge.gov.br/api/v1/conjunturais?t=6442&ng=1&v=8677&c=11046(90670)&user=ibge&d=2'
                }
            ],
            'CODIGOPESQUISA': 135,
            'CODIGONOTICIA': 557,//Este é o "id_pesquisa" fornecido pela URL de noticias//
            'BUSCA': 'PMS'
        },
        
        'PIB': {
            'ALIAS': 'PIB',
            'SIGLA': 'SCNT',
            'NOME': 'Sistema de Contas Nacionais Trimestrais',
            'DESC': `Apresenta os valores correntes e os índices de volume (1995=100) trimestralmente para o Produto Interno Bruto a preços de mercado, impostos sobre produtos, valor adicionado a preços básicos, consumo pessoal, consumo do governo, formação bruta de capital fixo, variação de estoques, exportações e importações de bens e serviços. São calculadas duas séries de números-índices: a com base no ano anterior e a encadeada com referência em 2010 (1995 = 100). A série encadeada é ajustada sazonalmente pelo X13-ARIMA possibilitando o cálculo das taxas de variação em relação ao trimestre imediatamente anterior.
            No IBGE, a pesquisa foi iniciada em 1988 e reestruturada a partir de 1998, quando os seus resultados foram integrados ao Sistema de Contas Nacionais, de periodicidade anual.
            Em 2015, continuando a compatibilidade com o Sistema Anual, as Contas Nacionais Trimestrais também foram reformuladas, adotando o Manual Internacional SNA 2008, passando para a referência 2010.
            As ponderações anuais são obtidas a partir deste novo sistema de contas.`,
            'LINK': 'http://www.ibge.gov.br/home/estatistica/indicadores/pib/defaultcnt.shtm',
            'GRAFICOS': [
                {
                    "ALIAS": "Acumulado 4 trimestres",
                    "SERVICE": 'http://servicodados.ibge.gov.br/api/v1/conjunturais?t=5932&ng=1&v=6562&c=11255(90707)&user=ibge&d=2'
                },
                {
                    "ALIAS": "Trimestre",
                    "SERVICE": 'http://servicodados.ibge.gov.br/api/v1/conjunturais?t=5932&ng=1&v=6561&c=11255(90707)&user=ibge&d=2'
                },
                // {
                //     "ALIAS": "Ano",
                //     "SERVICE": 'http://servicodados.ibge.gov.br/api/v1/conjunturais?t=5932&ng=1&v=6563&c=11255(90707)&user=ibge&d=2'
                // },
                {
                    "ALIAS": "Trimestre anterior",
                    "SERVICE": 'http://servicodados.ibge.gov.br/api/v1/conjunturais?t=5932&ng=1&v=6564&c=11255(90707)&user=ibge&d=2'
                }
            ],
            'CODIGOPESQUISA': 4,
            'CODIGONOTICIA': 14,
            'BUSCA': 'PIB'
        },
        
        "SINAPI": {
            "ALIAS": "Construção",
            "SIGLA": "SINAPI",
            "NOME": "Sistema Nacional de Pesquisa de Custos e Índices da Construção Civil",
            "DESC": `Efetua a produção de custos e índices da construção civil, a partir do levantamento de preços de materiais e salários pagos na construção civil, para o setor habitação. A partir de 1997 ocorreu a ampliação do Sistema, que passou a abranger o setor de saneamento e infraestrutura. Tem como unidade de coleta os fornecedores de materiais de construção e empresas construtoras do setor. O Sistema é produzido em convênio com a Caixa Econômica Federal - CAIXA. Para os dados sobre saneamento e infraestrutura estão disponíveis somente os relativos a preços. A pesquisa foi iniciada em 1969 para o setor de habitação e em 1997, para o de saneamento e infraestrutura.`,
            "LINK": 'http://www.ibge.gov.br/home/estatistica/indicadores/precos/sinapi/default.shtm',
            "GRAFICOS": [
                {
                    "ALIAS": "Mês",
                    "SERVICE": 'http://servicodados.ibge.gov.br/api/v1/conjunturais?t=2296&ng=1&v=1196&user=ibge'
                },
                // {
                //     "ALIAS": "Ano",
                //     "SERVICE": 'http://servicodados.ibge.gov.br/api/v1/conjunturais?t=2296&ng=1&v=1197&user=ibge'
                // },
                {
                    "ALIAS": "12 meses",
                    "SERVICE": 'http://servicodados.ibge.gov.br/api/v1/conjunturais?t=2296&ng=1&v=1198&user=ibge'
                },
                {
                    "ALIAS": "Custo em R$",
                    "SERVICE": 'http://servicodados.ibge.gov.br/api/v1/conjunturais?t=2296&ng=1&v=2119&user=ibge'
                }
            ],
            'CODIGOPESQUISA': 53,
            'CODIGONOTICIA': 4,
            'BUSCA': 'SINAPI'
        },

        'PMC': {
            "ALIAS": "Comércio",
            'SIGLA': 'PMC',
            'NOME': 'Pesquisa Mensal de Comércio',
            "DESC": `A Pesquisa Mensal de Comércio produz indicadores que permitem acompanhar o comportamento conjuntural do comércio varejista no País, investigando a receita bruta de revenda nas empresas formalmente constituídas, com 20 ou mais pessoas ocupadas, e cuja atividade principal é o comércio varejista. A pesquisa foi iniciada em janeiro de 1995, apenas na Região Metropolitana do Rio de Janeiro, produzindo indicadores de faturamento real e nominal, pessoal ocupado e salários e outras remunerações. A partir de 1997, a pesquisa foi expandida para as Regiões Metropolitanas de Recife e Salvador. A versão da pesquisa com abrangência nacional teve início no ano 2000, produzindo indicadores de volume e de receita nominal, desagregados em cinco grupos de atividades, para o Brasil e os Estados do Ceará, Pernambuco, Bahia, Minas Gerais, Espírito Santo, Rio de Janeiro, São Paulo, Paraná, Santa Catarina, Rio Grande do Sul, Goiás e Distrito Federal. Para as demais Unidades da Federação, são divulgados indicadores para o comércio varejista, sem desagregação. A partir de janeiro de 2004, iniciou-se a série da pesquisa, com base 2003=100. O segmento "Demais artigos de uso pessoal e doméstico" foi desagregado, iniciando a série de indicadores para os segmentos de "Artigos farmacêuticos, médicos, ortopédicos, de perfumaria e cosméticos", "Equipamentos e materiais para escritório, informática e comunicação", "Livros, jornais, revistas e papelaria" e "Outros artigos de uso pessoal e doméstico". A série 2003=100 expande a abrangência dos indicadores incluindo o comércio de material de construção e dá inicio à série de índices do Comércio Varejista Ampliado, que agrega, aos índices do varejo, as atividades "Veículos, motocicletas, partes e peças" e "Material de construção", que incluem o ramo atacadista. A partir de 2005, iniciou-se o cálculo dos indicadores de receita nominal e de volume de vendas ajustados sazonalmente. Em 2012, de janeiro em diante, iniciou-se nova série da pesquisa, com base 2011=100.`,
            "LINK": 'http://www.ibge.gov.br/home/estatistica/indicadores/comercio/pmc/default.shtm',
            "GRAFICOS": [
                {
                    "ALIAS": "Mês",
                    "SERVICE": 'http://servicodados.ibge.gov.br/api/v1/conjunturais?t=3416&ng=1&v=564&c=11046(90668)&user=ibge&d=1'
                },
                // {
                //     "ALIAS": "Ano",
                //     "SERVICE": 'http://servicodados.ibge.gov.br/api/v1/conjunturais?t=3416&ng=1&v=564&c=11046(90669)&user=ibge&d=1'
                // },
                {
                    "ALIAS": "Acumulado 12 Meses",
                    "SERVICE": 'http://servicodados.ibge.gov.br/api/v1/conjunturais?t=3416&ng=1&v=564&c=11046(90670)&user=ibge&d=1'
                }
            ],
            'CODIGOPESQUISA': 37,
            'CODIGONOTICIA': 8,
            'BUSCA': 'PMC'
        },

        "PNAD": {
            "ALIAS": "Desocupação",
            'SIGLA': 'PNAD Contínua',
            'NOME': 'Pesquisa Nacional por Amostra de Domicílio',
            "DESC": `Destina-se a produzir informações contínuas sobre a inserção da população no mercado de trabalho associada a características demográficas e de educação, e, também, para o estudo do desenvolvimento socioeconômico do País, agregando a produção de resultados anuais sobre temas permanentes da pesquisa (como trabalho infantil e outras formas de trabalho, migração, fecundidade etc.) e outros aspectos relevantes selecionados de acordo com as necessidades de informação.
            A pesquisa é realizada por meio de uma amostra de domicílios, extraída de uma amostra mestra, de forma a garantir a representatividade dos resultados para os diversos níveis geográficos definidos para sua divulgação. A cada trimestre, são investigados 211.344 domicílios particulares permanentes, em aproximadamente 16.000 setores censitários, distribuídos em cerca de 3.500 municípios.
            Periodicidade: Mensal, para um conjunto restrito de indicadores relacionados à força de trabalho e somente para o nível geográfico de Brasil; trimestral, para indicadores relacionados à força de trabalho; anual, para os demais temas permanentes da pesquisa e indicadores complementares relacionados à força de trabalho; e variável, para outros temas ou tópicos dos temas permanentes a serem pesquisados com maior periodicidade ou ocasionalmente.
            Abrangência geográfica: Brasil, Grandes Regiões, Unidades da Federação, 20 Regiões Metropolitanas que contêm Municípios das Capitais (Manaus, Belém, Macapá, São Luís, Fortaleza, Natal, João Pessoa, Recife, Maceió, Aracaju, Salvador, Belo Horizonte, Vitória, Rio de Janeiro, São Paulo, Curitiba, Florianópolis, Porto Alegre, Vale do Rio Cuiabá, e Goiânia), Municípios das Capitais e Região Integrada de Desenvolvimento da Grande Teresina.`,
            "LINK": 'http://www.ibge.gov.br/home/estatistica/indicadores/trabalhoerendimento/pnad_continua/default.shtm',
            "GRAFICOS": [
                {
                    "ALIAS": "Mês",
                    "SERVICE": 'http://servicodados.ibge.gov.br/api/v1/conjunturais?t=6381&ng=1&v=4099&user=ibge&d=2'
                    // Referente a PNAD contínua mensal
                },
                {
                    "ALIAS": "Trimestre",
                    "SERVICE": 'http://servicodados.ibge.gov.br/api/v1/conjunturais?t=4094&ng=1&v=4099&c=58(95253)&user=ibge&d=1'
                    // Referente a PNAD contínua trimestral
                }
            ],
            'CODIGOPESQUISA': 153,
            'CODIGONOTICIA': 639,
            'BUSCA': 'PNAD'
        },

        'PIMPF': {
            "ALIAS": "Indústria",
            'SIGLA': 'PIM-PF',
            'NOME': 'Pesquisa Industrial Mensal de Produção Física',
            "DESC": `A Pesquisa Industrial Mensal Produção Física – Brasil produz indicadores de curto prazo desde a década de 1970 relativos ao comportamento do produto real das indústrias extrativa e de transformação.
            A partir de maio de 2014, tem início a divulgação da nova série de índices mensais da produção industrial, elaborados com base na Pesquisa Industrial Mensal de Produção Física - PIM-PF reformulada. Essa reformulação cumpriu os seguintes objetivos: atualizar a amostra de atividades, produtos e informantes; elaborar uma nova estrutura de ponderação dos índices com base em estatísticas industriais mais recentes, de forma a integrar-se às necessidades do projeto de implantação da Série de Contas Nacionais - referência 2010; e adotar, na PIM-PF, as novas classificações, de atividades e produtos, usadas pelas demais pesquisas da indústria a partir de 2007, quais sejam: a Classificação Nacional de Atividades Econômicas - CNAE 2.0 e a Lista de Produtos da Indústria - PRODLIST-Indústria.
            A série reformulada tem início em janeiro de 2012 e sua implantação não implicou ruptura das séries históricas iniciadas em 2002, uma vez que essas foram encadeadas à nova, tanto nos níveis das grandes categorias econômicas (categorias de uso), como no âmbito das atividades (com exceção de Impressão e reprodução de gravações, e de Manutenção, reparação e instalação de máquinas e equipamentos), quanto nos diversos grupos selecionados (que substituem os subsetores).
            As séries históricas antiga (de janeiro de 1985 até janeiro de 2004), da primeira reformulação (de janeiro de 1991 até fevereiro de 2014) e a reformulada em 2014 (de janeiro de 2002 em diante) podem ser consultadas diretamente no SIDRA.`,
            "LINK": 'http://www.ibge.gov.br/home/estatistica/indicadores/industria/pimpf/br/default.shtm',
            "GRAFICOS": [
                {
                    "ALIAS": "Mês",
                    "SERVICE": 'http://servicodados.ibge.gov.br/api/v1/conjunturais?t=3653&c=544(129314)&ng=1&v=3139&user=ibge&d=2'
                },
                // {
                //     "ALIAS": "Ano",
                //     "SERVICE": 'http://servicodados.ibge.gov.br/api/v1/conjunturais?t=3653&c=544(129314)&ng=1&v=3136&user=ibge&d=2'
                // },
                {
                    "ALIAS": "Acumulado",
                    "SERVICE": 'http://servicodados.ibge.gov.br/api/v1/conjunturais?t=3653&c=544(129314)&ng=1&v=3137&user=ibge&d=2'
                },
                {
                    "ALIAS": "Acumulado 12 meses",
                    "SERVICE": 'http://servicodados.ibge.gov.br/api/v1/conjunturais?t=3653&c=544(129314)&ng=1&v=3138&user=ibge&d=2'
                }
            ],
            'CODIGOPESQUISA': 35,
            'CODIGONOTICIA': 6,
            'BUSCA': 'PIM-PF'
        },

        'IPP': {
            "ALIAS": "Preços",
            'SIGLA': 'IPP',
            'NOME': 'Índice de Preços ao Produtor',
            "DESC": `O Índice de Preços ao Produtor - IPP, cujo âmbito são as indústrias extrativas e de transformação, tem como principal objetivo mensurar a mudança média dos preços de venda recebidos pelos produtores domésticos de bens e serviços, bem como sua evolução ao longo do tempo, sinalizando as tendências inflacionárias de curto prazo no País. Constitui, assim, um indicador essencial para o acompanhamento macroeconômico e, por conseguinte, um valioso instrumento analítico para tomadores de decisão, públicos ou privados.
            O IPP investiga, em pouco mais de 1 400 empresas, os preços recebidos pelo produtor, isentos de impostos, tarifas e fretes e definidos segundo as práticas comerciais mais usuais. Os produtos coletados são especificados em detalhe (aspectos físicos e de transação), garantindo, assim, que sejam comparados produtos homogêneos ao longo do tempo. Com isso, coletam-se cerca de 5 000 preços mensalmente.
            A divulgação das séries do IPP é condensada em três comparações básicas, além do número-índice (com base em dezembro de 2013), quais sejam: M/M-1 (mês contra mês anterior); acumulado no ano (mês contra dezembro do ano anterior); e M/M-12 (mês contra mesmo mês do ano anterior). Adotando a Classificação Nacional de Atividades Econômicas - CNAE 2.0, o IPP gera indicadores para 24 atividades das indústrias extrativas e de transformação, além de reorganizar os mesmos dados em grandes categorias econômicas, abertas em bens de capital, cens intermediários e bens de consumo (duráveis e semi e não-duráveis).`,
            "LINK": 'http://www.ibge.gov.br/home/estatistica/indicadores/precos/ipp/default.shtm',
            "GRAFICOS": [
                {
                    "ALIAS": "Mês",
                    "SERVICE": 'http://servicodados.ibge.gov.br/api/v1/conjunturais?t=5796&ng=1&v=1396&c=715(33611)&user=ibge&d=2'
                },
                // {
                //     "ALIAS": "Ano",
                //     "SERVICE": 'http://servicodados.ibge.gov.br/api/v1/conjunturais?t=5796&ng=1&v=1395&c=715(33611)&user=ibge&d=2'
                // },
                {
                    "ALIAS": "Acumulado 12 Meses",
                    "SERVICE": 'http://servicodados.ibge.gov.br/api/v1/conjunturais?t=5796&ng=1&v=1394&c=715(33611)&user=ibge&d=2'
                }
            ],
            'CODIGOPESQUISA': 134,
            'CODIGONOTICIA': 402,
            'BUSCA': 'IPP'
        },

        'INPC': {
            "ALIAS": "Preços",
            'SIGLA': 'INPC',
            'NOME': 'Índice Nacional de Preços ao Consumidor',
            "DESC": `O Sistema Nacional de Índices de Preços ao Consumidor - SNIPC efetua a produção contínua e sistemática de índices de preços ao consumidor, tendo como unidade de coleta estabelecimentos comerciais e de prestação de serviços, concessionária de serviços públicos e domicílios (para levantamento de aluguel e condomínio). O período de coleta do INPC e do IPCA estende-se, em geral, do dia 01 a 30 do mês de referência. A população-objetivo do INPC abrange as famílias com rendimentos mensais compreendidos entre 1 (hum) e 5 (cinco) salários-mínimos, cuja pessoa de referência é assalariado em sua ocupação principal e residente nas áreas urbanas das regiões; a do IPCA abrange as famílias com rendimentos mensais compreendidos entre 1 (hum) e 40 (quarenta) salários-mínimos, qualquer que seja a fonte de rendimentos, e residentes nas áreas urbanas das regiões. Também são produzidos indexadores com objetivos específicos, como é o caso atualmente do Índice Nacional de Preços ao Consumidor Amplo Especial - IPCA-E. A partir do mês de maio de 2000, passou a disponibilizar através da Internet o Índice Nacional de Preços ao Consumidor Amplo-15 - IPCA-15. Outros índices foram divulgados nos seguintes períodos: Índice de Preços ao Consumidor - IPC (março de 1986 a fevereiro de 1991); Índice de Reajuste de Valores Fiscais - IRVF (junho de 1990 a janeiro de 1991); Índice da Cesta Básica - ICB (agosto de 1990 a janeiro de 1991); Índice de Reajuste do Salário-Mínimo - IRSM (janeiro de 1992 a junho de 1994); Índice Nacional de Preços ao Consumidor Especial - INPC-E (novembro de 1992 a junho de 1994); Índice de Preços ao Consumidor série r - IPC-r (julho de 1994 a junho de 1995). A pesquisa foi iniciada em 1979.`,
            "LINK": 'http://www.ibge.gov.br/home/estatistica/indicadores/precos/inpc_ipca/defaultinpc.shtm',
            "GRAFICOS": [
                {
                    "ALIAS": "Mês",
                    "SERVICE": 'http://servicodados.ibge.gov.br/api/v1/conjunturais?t=1100&c=315(7169)&ng=1&v=44&user=ibge&d=2'
                }
                
                //NÃO TEM ACUMULADO EM 12 MESES
                
                // ,
                // {
                //     "ALIAS": "Ano",
                //     "SERVICE": 'http://servicodados.ibge.gov.br/api/v1/conjunturais?t=1100&c=315(7169)&ng=1&v=68&user=ibge&d=2'
                // }
            ],
            'CODIGOPESQUISA': 52,
            'CODIGONOTICIA': 16,
            'BUSCA': 'INPC'
        },

        'IPCA': {
            "ALIAS": "Preços",
            'SIGLA': 'IPCA',
            'NOME': 'Índice Nacional de Preços ao Consumidor Amplo',
            "DESC": `O Sistema Nacional de Índices de Preços ao Consumidor - SNIPC efetua a produção contínua e sistemática de índices de preços ao consumidor, tendo como unidade de coleta estabelecimentos comerciais e de prestação de serviços, concessionária de serviços públicos e domicílios (para levantamento de aluguel e condomínio). O período de coleta do INPC e do IPCA estende-se, em geral, do dia 01 a 30 do mês de referência. A população-objetivo do INPC abrange as famílias com rendimentos mensais compreendidos entre 1 (hum) e 5 (cinco) salários-mínimos, cuja pessoa de referência é assalariado em sua ocupação principal e residente nas áreas urbanas das regiões; a do IPCA abrange as famílias com rendimentos mensais compreendidos entre 1 (hum) e 40 (quarenta) salários-mínimos, qualquer que seja a fonte de rendimentos, e residentes nas áreas urbanas das regiões. Também são produzidos indexadores com objetivos específicos, como é o caso atualmente do Índice Nacional de Preços ao Consumidor Amplo Especial - IPCA-E. A partir do mês de maio de 2000, passou a disponibilizar através da Internet o Índice Nacional de Preços ao Consumidor Amplo-15 - IPCA-15. Outros índices foram divulgados nos seguintes períodos: Índice de Preços ao Consumidor - IPC (março de 1986 a fevereiro de 1991); Índice de Reajuste de Valores Fiscais - IRVF (junho de 1990 a janeiro de 1991); Índice da Cesta Básica - ICB (agosto de 1990 a janeiro de 1991); Índice de Reajuste do Salário-Mínimo - IRSM (janeiro de 1992 a junho de 1994); Índice Nacional de Preços ao Consumidor Especial - INPC-E (novembro de 1992 a junho de 1994); Índice de Preços ao Consumidor série r - IPC-r (julho de 1994 a junho de 1995). A pesquisa foi iniciada em 1979.`,
            "LINK": 'http://www.ibge.gov.br/home/estatistica/indicadores/precos/inpc_ipca/defaultinpc.shtm',
            "GRAFICOS": [
                {
                    "ALIAS": "Mês",
                    "SERVICE": 'http://servicodados.ibge.gov.br/api/v1/conjunturais?t=1419&c=315(7169)&ng=1&v=63&user=ibge&d=2'
                }
                
                //NÃO TEM ACUMULADO NO ANO - não na mesma tabela
                
                // ,
                // {
                //     "ALIAS": "Ano",
                //     "SERVICE": 'http://servicodados.ibge.gov.br/api/v1/conjunturais?t=1419&c=315(7169)&ng=1&v=69&user=ibge&d=2'
                // }
            ],
            'CODIGOPESQUISA': 52,
            'CODIGONOTICIA': 16,
            'BUSCA': 'IPCA'
        },

        "IPCA15": {
            "ALIAS": "Preços",
            'SIGLA': 'IPCA-15',
            'NOME': 'Índice Nacional de Preços ao Consumidor Amplo - 15',
            "DESC": `O Sistema Nacional de Índices de Preços ao Consumidor - SNIPC efetua a produção contínua e sistemática de índices de preços ao consumidor, tendo como unidade de coleta estabelecimentos comerciais e de prestação de serviços, concessionária de serviços públicos e domicílios (para levantamento de aluguel e condomínio).

            A partir do mês de maio de 2000, passou a disponibilizar através da Internet o Índice Nacional de Preços ao Consumidor Amplo-15 - IPCA-15, cujo período de coleta de preços situa-se, aproximadamente, do dia 15 do mês anterior a 15 do mês de referência.

            A população-objetivo do IPCA-15 abrange as famílias com rendimentos mensais compreendidos entre 1 (hum) e 40 (quarenta) salários-mínimos, qualquer que seja a fonte de rendimentos, e residentes nas áreas urbanas das regiões.

            Também são produzidos o Índice Nacional de Preços ao Consumidor - INPC e o Índice Nacional de Preços ao Consumidor Amplo - IPCA, e indexadores com objetivos específicos, como é o caso atualmente do Índice Nacional de Preços ao Consumidor Amplo Especial- IPCA-E. O IPCA-15 coincide com as parcelas mensais do IPCA-E que é publicado com periodicidade trimestral.

            Outros índices foram divulgados nos seguintes períodos: Índice de Preços ao Consumidor - IPC (março de 1986 a fevereiro de 1991); Índice de Reajuste de Valores Fiscais - IRVF (junho de 1990 a janeiro de 1991); Índice da Cesta Básica - ICB (agosto de 1990 a janeiro de 1991); Índice de Reajuste do Salário-Mínimo - IRSM (janeiro de 1992 a junho de 1994); Índice Nacional de Preços ao Consumidor Especial - INPC-E (novembro de 1992 a junho de 1994); Índice de Preços ao Consumidor série r - IPC-r (julho de 1994 a junho de 1995).

            A publicação do IPCA-15 foi iniciada em 2000.`,
            "LINK": 'http://www.ibge.gov.br/home/estatistica/indicadores/precos/ipca15/defaultipca15.shtm',
            "GRAFICOS": [
                {
                    "ALIAS": "Mês",
                    "SERVICE": 'http://servicodados.ibge.gov.br/api/v1/conjunturais?t=1705&c=315(7169)&ng=1&v=355&user=ibge&d=2'
                                 
                }
                
                 //NÃO TEM ACUMULADO NO ANO - não na mesma tabela
                
                // ,
                // {
                //     "ALIAS": "Ano",
                //     "SERVICE": 'http://servicodados.ibge.gov.br/api/v1/conjunturais?t=1705&c=315(7169)&ng=1&v=356&user=ibge&d=2'
                                 
                // }
            ],
            'CODIGOPESQUISA': 85,
            'CODIGONOTICIA': 19,
            'BUSCA': 'IPCA'
        }

    };

    dadosIndicador;

    /**
     * Contrutor padrão que injeta o serviço HTTP.
     */
    constructor(private _http: Http) { }

    getPIB() {
        return this.getIndicador("PIB", 30)
            .map(
                (json) => {
                    let valoresPIB = json.map((pesquisa) => { return { value: pesquisa.v }; });
                    let variacaoPIB = this.calcularValorVariacaoPIB(valoresPIB);

                    return variacaoPIB[variacaoPIB.length - 1];
                }
                );
    }

    /**
     * Recupera os valores de um indicador para o período informado.
     *  @siglaIndicador: sigla do indicador. 
     *  @periodo: quantidade de meses passados.
     */
    getIndicador(siglaIndicador, periodo) {
        // Caso particular da PNAD Contínua Mensal que não aceita o parâmetro período 
        let parametro = siglaIndicador == 'PNADM' ? '' : '&p=-' + periodo;

        // Baca. Pega o primeiro que estiver nos GRAFICOS.
        return this._http.get(IndicadoresService.INDICADORES[siglaIndicador]["GRAFICOS"][0].SERVICE + parametro)
            .map(response => response.json());
    }

    getKeyIndicadorPorCodigoPesquisa(codigopesquisa) {
        return Object.keys(IndicadoresService.INDICADORES).find((key) => {
            return IndicadoresService.INDICADORES[key]["CODIGOPESQUISA"] === codigopesquisa;
        });

    }

    /**
     * Recupera os valores de um indicador para o período informado.
     *  @siglaIndicador: sigla do indicador. 
     *  @periodo: quantidade de meses passados.
     */
    getIndicadores(siglaIndicador, periodo) {
        // Caso particular da PNAD Contínua Mensal que não aceita o parâmetro período 
        let parametro = siglaIndicador == 'PNADM' ? '' : '&p=-' + periodo;

        let graficos: Array<Object> = IndicadoresService.INDICADORES[siglaIndicador]['GRAFICOS'];

        let graficos$ = graficos.map((grafico) => {
            return this._http.get(grafico['SERVICE'] + parametro).map(response => response.json());
        });

        return Observable.zip(...graficos$);
    }

    /**
     * Recupera os valores de um grafico específico do indicador
     */
    getDadosGrafico(siglaIndicador, index, periodo) {

        // Caso particular da PNAD Contínua Mensal que não aceita o parâmetro período 
        let parametro = siglaIndicador == 'PNADM' ? '' : '&p=-' + periodo;

        return {
            legenda: IndicadoresService.INDICADORES[siglaIndicador]["GRAFICOS"][index].LEGENDA,
            dados: this._http.get(IndicadoresService.INDICADORES[siglaIndicador]["GRAFICOS"][index].SERVICE + parametro)
            .map(response => response.json())
        };
    }

    /**
     * Recupera o elemento inteiro do objeto
     */
    getItem(sigla: string) {
        return IndicadoresService.INDICADORES[sigla] ? IndicadoresService.INDICADORES[sigla] : null;
    }

    /**
     * Recupera os últimos indicadores publicados no período informado.
     *  @periodo: quantidade de meses passados.
     */
    getUltimosIndicadoresPublicados(periodo: number) {

        // Configura o período de pesquisa
        let hoje = new Date();
        let dataInicial = new Date();
        dataInicial.setDate(1);
        dataInicial.setMonth(hoje.getMonth() - periodo);

        // Obtém os indicadores
        let pesquisas$ = this._http.get('http://servicodados.ibge.gov.br/api/v1/calendario/conjuntural/' + this.formatDate(dataInicial) + '/' + this.formatDate(hoje))
            .map(response => response.json())
            .map(pesquisas => pesquisas.filter(pesquisa => this.isIndicadorValido(pesquisa.sigla)));

        // Obtém os valores dos indicadores
        let indicadores$ = pesquisas$
            .switchMap(pesquisas => Observable.zip(
                ...pesquisas.map(pesquisa => this.getIndicador(pesquisa.sigla, 1))
                )
                );

        // Retorna uma resposta JSON juntando os indicadores e seus respectivos valores
        return Observable.zip(pesquisas$, indicadores$)
            .map(([pesquisas, indicadores]) => {
                return (<any[]>pesquisas).map((pesquisa, idx) => {

                    return {
                        nome: pesquisa.nome,
                        mesreferencia: pesquisa.mesreferencia,
                        sigla: pesquisa.sigla,
                        valor: indicadores[idx][0].v
                    }
                })

            });
    }


    /**
     * Extrai o conteúdo JSON de uma resposta http.
     */
    // private extractData(res: Response) {

    //     let body = res.json();
    //     let json = body.data || {};

    //     return json;
    // }

    /**
     * Formata uma data javascript em uma string no formato YYYY-MM-DD.
     */
    private formatDate(date) {

        return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    }

    private isIndicadorValido(sigla) {

        let isIndicadorValido = false;

        let keys = Object.keys(IndicadoresService.INDICADORES);

        for (let i = 0; i < keys.length; i++) {

            if (IndicadoresService.INDICADORES[keys[i]].SIGLA == sigla || keys[i] == sigla) {

                isIndicadorValido = true;
            }
        }

        return isIndicadorValido;
    }

    /**
     * Recupera os valores de um indicador para o município.
     *  @siglaIndicador: sigla do indicador.
     *  @codMunicipio: código do município.
    */
    getIndicadorMunicipio(siglaIndicador, codMunicipio) {
        return this._http.get(IndicadoresService.INDICADORES[siglaIndicador].SERVICE + '&localidade=' + codMunicipio.toString().substr(0, 6))
            .map(response => response.json());

    }
    
    /**
     * Calcula os valores a serem exibidos para o PIB.
     */
    private calcularValorVariacaoPIB(valores: any[]) {
        let publicacoesPIB = JSON.parse(JSON.stringify(valores));

        for (var i = 8; i < valores.length; i++) {

            var pibvariation = ((((Number(valores[i].value) + Number(valores[i - 1].value) + Number(valores[i - 2].value) + Number(valores[i - 3].value)) / 4) / ((Number(valores[i - 4].value) + Number(valores[i - 5].value) + Number(valores[i - 6].value) + Number(valores[i - 7].value)) / 4)) - 1) * 100;
            pibvariation = Math.round(pibvariation * 10) / 10;

            publicacoesPIB[i].value = pibvariation;
        }

        return publicacoesPIB.slice(8);
    }
}