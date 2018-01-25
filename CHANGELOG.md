# Change log

## [v4.3.5] - 2018-01-25
### Added
	- Implementação do download dos dados da pesqiosa para todos os municípios do mesmo esatdo.

### Fixed
	- Correção da exibição dos temas do censo na pesquisa censo.


## [v4.3.4] - 2018-01-24
### Changed
	- Remoção do indicador "Rendimento médio mensal per capita" do panorama estadual.

### Fixed
	- Correção da exibição do icone de pesquisa na página home - pesquisas.


## [v4.3.3] - 2018-01-12
### Added
	- Inclusão da notas de população juducial para os municípios Manaquiri, Santa Isabel do Rio Negro, Uarini, Urucará e Barcelos, todos do estado do Amazonas.


## [v4.3.2] - 2018-01-11
### Added
    - Inclusão da pesquisa Estadic

### Changed
	- Ajustes nos graficos do panorama Brasil: 
		Unificação das séries "Domicílios com iluminacao elétrica, coleta lixo, abastecimento de água e esgotamento sanitário"; 
		Unificação das séries "Produção industrial x Produtividade";
		Movimentação da série "Pib per capita" do tema População para o tema Economia; 
		Remoção das séries "Posse de telefone móvel celular" e "Taxa de escolarização de 6 a 14 anos de idade"; 
		Ajuste na série "Pib per capita" para exibir os últimos 10 períodos.

### Fixed
	- Ajuste no pirâmide etária para não repetir as informações do Brasil quando o nível exibido é o nacional


## [v4.3.1] - 2018-01-09
### Fixed
    - Exibição das notas especiais de demanda legal sobre a população estimada de alguns municípios.


## [v4.3.0] - 2018-01-08
### Added
	- Adicionado o panorama Brasil com os seguintes temas e respectivos indicadores:
		Geral
			Capital
			Número de municípios
			Área territorial
			Presidente
		POPULAÇÃO
			População estimada
			População no último censo
			Taxa de fecundidade
			Taxa de mortalidade infantil
			Domicílios com iluminação elétrica
			Domicílios com coleta de lixo
			Domicílios com rede geral de abastecimento de água
			Domicílios com esgotamento sanitário adequado 
			PIB per capita
			Domicílios com microcomputador
			Domicílios com acesso à Internet
			Posse de telefone móvel celular
			Domicílios com televisão
			Prática de atividade física
		ECONOMIA
			Preços - IPCA mensal
			Preços - INPC
			Preços - IPCA15
			Preços Produtor - IPP
			Preços - IPCA 12 meses
			Indústria - PIM-PF
			Comércio - PMC
			Serviços - PMS
			Taxa de desocupação - PNAD Contínua
			PIB - SCNT
			Construção - SINAPI
		EDUCAÇÃO
			Taxa de analfabetismo 10 anos ou mais de idade
			Taxa de escolarização de 6 a 14 anos de idade
		INDÚSTRIA
			Pessoal ocupado assalariado - Índice acumulado em relação ao mesmo período do ano anterior
			Produção industrial - Índice acumulado em relação ao mesmo período do ano anterior
			Produtividade - Índice acumulado em relação ao mesmo período do ano anterior
	- No nível Brasil foram adicionadas as pesquisas abaixo:
		Censo
		Censo agropecuário
		Entidades de assistência social privadas sem fins lucrativos
		Fundações privadas e associações sem fins lucrativos
		Pesquisa Anual da Indústria da Construção
		Pesquisa Anual de Comércio
		Pesquisa Anual de Serviços
		Pesquisa de serviços de hospedagem
		Pesquisa Industrial Anual - Empresa
		Pesquisa nacional de saneamento básico
		Pesquisa Nacional de Saúde
		Pesquisa Nacional de Saúde do Escolar
		PNAD - Pesquisa Nacional por Amostra de Domicílios
		PNADC - Pesquisa Nacional por Amostra de Domicílios Contínua
		POF - Pesquisa de Orçamentos Familiares
		Produção agrícola - Cereais, leguminosas e oleaginosas
		Projeção da população
		Registro civil
		Série estudos e pesquisas: estatísticas de empreendedorismo
		Serviços de saúde
    - Em estados, foi incluído o histórico.

### Changed
	- Em estados, foram adicionados os seguintes indicadores ao panorama:
        POPULAÇÃO
			Rendimento médio mensal per capita
			Total de veículos	
		EDUCAÇÃO
			Matrículas no ensino médio
			Docentes no ensino fundamental
			Docentes no ensino médio
			Número de estabelecimentos de ensino fundamental
			Número de estabelecimentos de ensino médio
		TRABALHO E RENDIMENTO
			Pessoas de 16 anos ou mais ocupadas na semana de referência
			Proporção de pessoas de 16 anos ou mais em trabalho formal, considerando apenas as ocupadas na semana de referência 
		ECONOMIA
			Número de agências
			Total de depósitos
	- Em municípios, foram incluídos os seguintes indicadores ao panorama:
		EDUCAÇÃO
			Docentes no ensino fundamental
			Docentes no ensino médio
			Número de estabelecimentos de ensino fundamental
			Número de estabelecimentos de ensino médio
		ECONOMIA
			Total de receitas realizadas
			Total das despesas realizadas

### Fixed
    - Erro na geração do resumo da síntese estadual.
    - Bug que não exibia o cartograma na pesquisa quando não havia dados para a localidade selecionada, mas havia nas localidades vizinhas.
    - Bug que não traduzia as notas e fontes dos indicadores do panorama.
    - Bug que não traduzia os títulos dos gráficos.
    - Bug que não traduzia o indicador gentílico.


## [v4.2.16.1] - 2017-12-15
### Changed
 - Ajuste no panorama estadual para remover o tratamento especial de casas decimais no indicador 63238 da SIS.


## [v4.2.16] - 2017-12-15
### Changed
 - Alteração no panorama estadual para substituir indicadores de trabalho e rendimento por sua versão mais atual na Síntese de Indicadores Sociais.


## [v4.2.15] - 2017-12-14
### Changed
 - Alteração do período de exibição do PIB municipal de 2014 para 2015.


## [v4.2.14] - 2017-12-04
### Changed
 - Alteração do nome do município de MG de Brasópolis para Brazópolis.
 - Inclusão das fontes para os indicadores no panorama municial.
 - Casas decimais até 3 dígitos para indicadores como o índice GINI.


## [v4.2.12] - 2017-11-01
### Fixed
- Correção do bug que gerava múltiplas requisições na pesquisa.


## [v4.2.11] - 2017-10-31
### Added
 - Inclusão de nota de demanda legal para o município Paço do Lumiar - MA.
 - Pesquisa MUNIC.
 - Tabela de resumo do estado.
 - Analytics no Download do CSV da tela de Pesquisa.
 - Traducao service nos serviços de indicadores e pesquisa.
 - Parametrização das urls de consumo de serviço para utilizarem serviços de homologação, caso a aplicação esteja em hml.
 - Autorização de acesso ao ambiente de homologação.

### Changed
 - Formatação das nota de demanda legal.
 - Ajuste no componente estado-sintese para impressão.


## [v4.2.10] - 2017-10-19
### Added
 - Tradução para inglês.

### Changed
 - Alteração do nome do município de Iguaraci para Iguaracy em Pernambuco.
 

## [v4.2.9] - 2017-10-17
### Added
 - Autocompletar dos códigos do local.
 - Exibição de mensagem de erro nas situações de exceção.
 - Analytics: clicks no link para o site antigo.
 - Inclusão nos elementos da pasquisa ranking um link para seus respectivos panoramas.
 - Inclução da pesquisa PNADC para estado.

### Changed
 - Ampliação do cartograma.
 - Dasabilitado o questionário.
 - Tabela de pesquisa exibindo inicialmente o período mais recente que possua dados.
 - Componente de compartilhamento em redes sociais para carregar título do compartilhamento de acordo com a página visitada.
 - Adição do botão de fechar no não achei.

### Fixed
- Adicionar comparação na tabela de pesquisas.
- Erro na pesquisa.
- Submenu redirecionava para pesquisa com Brasil como comparação.


## [v4.2.7] - 2017-10-03
### Changed
 - Permitindo que se responda 1 ou mais questões.

### Fixed
 - Correção do seletor de localidade no IOS.


## [v4.2.6] - 2017-10-03
### Added
- Inclusão de pirâmide da etária no panorama.
- Projeção da população para as UFs no panorama.
- Versão do panorama para impressão.
- Donwload do svg e do csv dos cartogramas.
- Testes automatizados.

### Changed
 - Melhoria na identificação de palavras chave na busca completa.
 - Inclusão de pirâmide da etária no panorama.
 - Melhoria na busca.
 - Busca pelo código da localidade.
 - Melhoria em Aniversários.
 - Apontamento para novo servidor Redis.

### Fixed
 - Correção do bug dos gráficos, quando os dados vinham com períodos diferentes.
 - Ajuste na largura dos contornos do cartograma.
 - Pin de localidade no cartograma para funcionar no IE.
 - Pin de localidade no cartograma para funcionar no FIREFOX.
 - Seleção de localidade na comparação.
 - Namespaces dos mapas svg.
 - Geolocalização.
 - Inclusão das unidades e fator multiplicador no título dos gráficos do temas.


## [v4.2.4] - 2017-09-19
### Changed
- Removido o v4 das URLs.

### Fixed
- Correção do panorara panorama resumo.
- Correção do nome do município de Parati para Paraty no RJ.
- Correção do integrity key na importação do inc_GA_portal.js (analytics) na página index.cshtml.


## [v4.2.3] - 2017-09-11
### Fixed
- Correção do nome do município de Seridó para São Vicente do Seridó em PB.


## [v4.2.2] - 2017-08-31
### Fixed
- Pré-render.


## [v4.2.1] - 2017-08-31
### Fixed
- Exibição de notas no panorama.


## [v4.2] - 2017-08-30
### Added
- Questionário de avaliação da experiência do usuário.
- Busca completa.
- Página inicial.
- Página de tratamento de erro 404.
- Download de CSV completo da pesquisa.

### Changed
- Envio de feedbacks.
- Aniversários de municípios.
- Notas jurídicas sobre população estimada de alguns municípios.
- Estimativa da população para UFs e municípios no panorama para o ano de 2017.
- Origêm do gentílico municial como serviço da biblioteca.

### Fixed
- Problemas de exibição e usabilidade.
- Problemas de desempenho.
- Melhoria na indexação de páginas pelo google.


## [v4.1.15.6] - 2017-08-25
### Fixed
- Nome do município de São Vicente de Sevidó.


## [v4.1.15.5] - 2017-08-23
### Changed
- Texto dos gentílicos das UFs e municípios em minúsculo no panorama.


## [v4.1.15.4] - 2017-08-21
### Fixed
- Nome do município de Mogi Mirim.
- Exibição de notas especiais.


## [v4.1.15.2] - 2017-08-11
### Changed
- Desabilitada a opção de envio de feedback.


## [v4.1.15.1] - 2017-08-11
### Added
- Panorama de estados.
- Pesquisa de estados.
- Fotos de estados.
- Opção de envio de feedback.

### Changed
- Desabilitado o prerender, devido a problema no servidor.
- Alteração no card do panorama para melhor visualização dos dados.

### Fixed
- Correção do nome do município de Florínea/SP.
- Ajuste na legenda dos gráficos.
- Tratamento de nomes longos de pesquisas.
- Mudança de cor no seletor de localidade (estados).
- Ajuste na exibição mobile.


## [v4.1.14] - 2017-07-05
### Fixed
- Correção na visualização dos dados na tabela das pesquisas.


## [v4.1.13] - 2017-07-05
### Added
- Metatags('description' e 'keywords').
- Sitemaps.

### Changed
- Alteração do período de consulta dos indicadores "Salário médio mensal dos trabalhadores formais", "Pessoal ocupado" e "População ocupada" para 2015 no panorama.
- Otimizações para google analytics.
- Otimizações de SEO.
- Font-awesome incluído do proprio servidor IBGE

### Fixed
- Ajustes na exibição do cartograma.
- Correções apontadas pelo validador W3C.


## [v4.1.10] - 2017-06-21
### Changed
- Reinclusão da opção 'versão anterior do site'.


## [v4.1.9] - 2017-06-19
### Added
- Nota especial sobre processo judicial no indicador "População Estimada" para os municípios Coronel João Sá, Jacareacanga e Porto Velho.
- Código do município no resultado da busca.
- Ícone de carregando no botão obter localidade.
- Ícone de carregando no cartograma.
- Mensagem explicativa sobre seleção de indicador ao clicar na seta na pesquisa.
- Unidade de medida e fator multiplicativo no título do indicador.

### Changed
- Remoção da opção 'versão anterior do site'.
- Exibição do valor do indicador no ranking.
- Desabilitado o botão de séries históricas quando não há mais de 1 ano para comparar.
- Melhorias no breadcrumb com a inclusão da unidade de medida e fator multiplicador.
- Primeira letra do indicador selecionado capitalizada.
- Melhorias no CSS da legenda da série histórica.

### Fixed
- Posição dos municípios no ranking.
- Formatação de valores no ranking.
- Bug que chamava o parseInt em uma localidade nula.
- Layout da linha preta do menu pesquisa indo até o final da página.
- Layout da coluna cinza em pesquisa, retirando o 'dente'.
- Formatação dos valores na série temporal.


## [v4.1.6] - 2017-06-09
### Added
- Pesquisa Séries Históricas.
- Pesquisa Cartogramas.
- Pesquisa Ranking.
- Obter localidade do usuário por geolocalização.

### Changed
- URL Rewrite configurado para redirecionar chamadar HTTP para HTTPS, ignorando localhost.
- Alteração no protocolo dos serviços para HTTPS.

### Fixed
- Nomes de municípios.
- Menu de pesquisa para mobile.
- Serviço de fotos.