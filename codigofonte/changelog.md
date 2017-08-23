# Change log

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