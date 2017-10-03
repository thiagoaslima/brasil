# Change log

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