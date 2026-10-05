# É Só Pedir pra IA

> “Com IA eu faço tudo que você faz.” Então a produção é sua.

Um desafio interativo e bem-humorado sobre a vida real de quem desenvolve software. A IA acelera o trabalho; escolher, avaliar e assumir a responsabilidade também faz parte dele.

## Histórias e links diretos

A página inicial apresenta duas histórias independentes. No celular, os cards ficam um abaixo do outro.

- `/#dev-em-30-segundos`: o desafio original, com produção, cliente e incidentes.
- `/#fiscal-de-ia`: 10 textos para classificar como humano, IA ou humano revisado por IA; ferramentas de brincadeira, origem revelada, placar, certificado e compartilhamento.

Os links usam fragmentos para funcionar em hospedagem estática sem regras de redirecionamento. Voltar/avançar no navegador troca a história e inicia uma nova rodada. Cada final permite experimentar a outra história.

### Origem dos exemplos do Fiscal

Os exemplos humanos são trechos de **Dom Casmurro**, de Machado de Assis, em domínio público. Fontes: [capítulo I](https://pt.wikisource.org/wiki/Dom_Casmurro/I) e [capítulo CX](https://pt.wikisource.org/wiki/Dom_Casmurro/CX). Os gerados foram criados por IA para este jogo. Os mistos são adaptações por IA desses trechos públicos. Nenhuma conversa privada é usada.

O registro está em `fiscal.js`, é revelado após o palpite com link para a fonte e não muda quando os casos são embaralhados. São exemplos literários e comentários fictícios: o jogo não é um detector e o placar não representa precisão geral.

## A brincadeira original

- Botão que foge quando o requisito muda.
- Cliente pedindo “só mais uma coisinha”.
- Incidentes fictícios em produção e decisões sobre como responder.
- Certificado final e rodada extra.
- Som ligado por padrão, ativado na primeira interação, com opção de desligar.

## Executar localmente

O projeto usa HTML, CSS e JavaScript, sem dependências de build.

```bash
python -m http.server 8000
```

Abra http://localhost:8000.

## Publicar no Cloudflare Pages

Para conectar este repositório ao Pages, selecione um projeto de site estático, deixe o comando de build vazio e use `.` como diretório de saída. Para upload direto, envie os arquivos do site com `index.html` na raiz.

## Estrutura

- `index.html`: página inicial e estrutura do desafio.
- `style.css`: estilos e layout responsivo.
- `app.js`: desafios originais, sons, certificado.
- `fiscal.js`: navegação entre histórias, casos com origem registrada e jogo Fiscal de IA.
- `favicon.svg`: ícone do site.

