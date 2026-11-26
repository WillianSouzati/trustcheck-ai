# TrustCheck AI — Análise Inteligente de Riscos em Anúncios

Sistema de análise de anúncios de marketplace com inteligência artificial para identificar possíveis inconsistências e indicadores de risco, auxiliando processos de moderação e revisão humana.

**Aplicação:** [https://trustcheck-ai-beta.vercel.app/](https://trustcheck-ai-beta.vercel.app/)

## Sobre o projeto

O TrustCheck AI é uma aplicação desenvolvida para demonstrar como a inteligência artificial pode apoiar processos de análise e moderação de anúncios em marketplaces.

A solução permite inserir informações de um anúncio, como título, descrição, preço e categoria, para que a IA analise o conteúdo e identifique possíveis inconsistências, expressões suspeitas e outros indicadores que possam merecer atenção.

Após o processamento, a aplicação apresenta uma classificação, os indicadores identificados, suas justificativas e uma recomendação de revisão.

O projeto foi desenvolvido como uma demonstração prática da aplicação de inteligência artificial em segurança de marketplaces, análise de conteúdo e apoio à tomada de decisão.

## Problema e objetivo

Marketplaces recebem grandes volumes de anúncios diariamente. A análise dessas publicações pode envolver a identificação de informações contraditórias, descrições suspeitas, solicitações de contato fora da plataforma e possíveis sinais de risco.

A revisão manual de grandes volumes de conteúdo pode consumir tempo das equipes de moderação e dificultar a identificação de anúncios que merecem atenção prioritária.

O objetivo do projeto é demonstrar como a inteligência artificial pode auxiliar nesse processo, analisando informações dos anúncios e organizando possíveis indicadores de risco para apoiar a avaliação humana.

## Funcionalidades

- Cadastro de anúncios para análise.
- Entrada de título, descrição, preço e categoria.
- Análise automatizada utilizando inteligência artificial.
- Identificação de possíveis inconsistências nas informações.
- Identificação de expressões e comportamentos que podem indicar riscos.
- Classificação dos resultados em três níveis:
  - Sem indicadores relevantes.
  - Atenção recomendada.
  - Revisão prioritária.
- Apresentação dos indicadores identificados e suas justificativas.
- Exibição de trechos do anúncio relacionados aos indicadores encontrados.
- Geração de recomendações para revisão humana.
- Armazenamento dos resultados das análises no banco de dados.
- Dashboard demonstrativo com indicadores e gráficos ilustrativos.

## Tecnologias utilizadas

- **Google AI Studio:** apoio ao desenvolvimento da aplicação e geração de código.
- **React:** desenvolvimento da interface.
- **Vite:** ferramenta de desenvolvimento e build da aplicação.
- **Supabase:** banco de dados, autenticação e infraestrutura de backend.
- **Supabase Edge Functions:** processamento das análises e integração com serviços externos.
- **Google Gemini API:** análise e interpretação dos anúncios por inteligência artificial.
- **Vercel:** hospedagem e publicação da aplicação.
- **GitHub:** versionamento e documentação do código-fonte.

## Arquitetura e fluxo da aplicação

1. O usuário acessa a aplicação e preenche o formulário com as informações do anúncio.
2. A aplicação realiza a validação dos dados e utiliza autenticação anônima do Supabase.
3. As informações são enviadas à Supabase Edge Function `analyze-trustcheck-listing`.
4. A função de backend valida os dados recebidos e encaminha o conteúdo à API Google Gemini.
5. O Gemini analisa o anúncio e retorna uma resposta estruturada com classificação, indicadores identificados, justificativas e recomendação.
6. A Edge Function processa o retorno e armazena o resultado na tabela `trustcheck_analyses`, no Supabase.
7. A aplicação recebe os dados e apresenta o resultado da análise na interface.

## Segurança e tratamento de dados

A integração com a API Google Gemini é realizada no backend, mantendo a chave de acesso armazenada nos Secrets do Supabase.

As operações que utilizam credenciais privilegiadas são executadas na função de backend, sem exposição da chave `service_role` na interface pública.

A aplicação utiliza autenticação anônima do Supabase para permitir o envio de análises sem exigir a criação de uma conta pelo visitante.

O frontend utiliza apenas as credenciais públicas necessárias para a comunicação com o Supabase. As variáveis de ambiente são configuradas no ambiente de publicação.

O projeto utiliza dados fictícios nos testes e apresenta informações demonstrativas no dashboard. Não devem ser inseridas informações pessoais ou confidenciais.

## Testes realizados

Foram realizados testes funcionais para verificar:

- Preenchimento e validação do formulário.
- Envio das informações para a Supabase Edge Function.
- Comunicação com a API Google Gemini.
- Processamento e classificação dos anúncios.
- Identificação e apresentação dos indicadores encontrados.
- Geração das justificativas e recomendações.
- Gravação dos resultados na tabela `trustcheck_analyses`.
- Retorno e apresentação dos resultados na interface.
- Funcionamento da aplicação publicada na Vercel.

Os cenários testados apresentaram funcionamento esperado.

## Limitações e melhorias futuras

O TrustCheck AI é um protótipo demonstrativo de apoio à moderação de anúncios.

A classificação gerada pela inteligência artificial representa uma avaliação automatizada de possíveis indicadores de risco, não uma comprovação de fraude ou irregularidade.

A solução não realiza bloqueios automáticos de anúncios e não substitui a avaliação de profissionais responsáveis pela moderação.

Entre as possibilidades de evolução estão:

- Integração com sistemas de moderação de marketplaces.
- Implementação de painel administrativo para equipes de revisão.
- Criação de fluxos de acompanhamento dos anúncios sinalizados.
- Evolução dos critérios de análise e identificação de riscos.
- Implementação de indicadores baseados em dados operacionais reais.

## Autor

**Willian Scher**

Projeto desenvolvido com foco na aplicação prática de inteligência artificial em processos de negócio, análise de riscos, segurança de marketplaces e apoio à tomada de decisão.
