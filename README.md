# É Só Pedir pra IA

> “Com IA eu faço tudo que você faz.” Então a produção é sua.

Um desafio interativo e bem-humorado sobre a vida real de quem desenvolve software. A IA acelera o trabalho; escolher, avaliar e assumir a responsabilidade também faz parte dele.

## Histórias e links diretos

O site abre com a apresentação do desafio original. O Fiscal de IA está desativado e preservado no código; seu script não é carregado e não há botões para acessá-lo. Links antigos com `#fiscal-de-ia` voltam à apresentação original.

Para reativar, altere `const FISCAL_ENABLED = false` para `true` em `index.html` e publique. Isso restaura a escolha entre as duas histórias, os links diretos e o botão do Fiscal no certificado do primeiro jogo.

Quando ativado:

- `/#dev-em-30-segundos`: desafio original, com produção, cliente e incidentes.
- `/#fiscal-de-ia`: 10 textos para classificar como humano, IA ou humano revisado por IA.

### Origem dos exemplos do Fiscal

Os exemplos humanos são trechos de **Dom Casmurro**, de Machado de Assis, em domínio público. Fontes: [capítulo I](https://pt.wikisource.org/wiki/Dom_Casmurro/I) e [capítulo CX](https://pt.wikisource.org/wiki/Dom_Casmurro/CX). Os gerados foram criados por IA para este jogo. Os mistos são adaptações por IA desses trechos públicos. Nenhuma conversa privada é usada.

O registro está em `fiscal.js`, é revelado após o palpite com link para a fonte e não muda quando os casos são embaralhados. São exemplos literários e comentários fictícios: o jogo não é um detector e o placar não representa precisão geral.

## A brincadeira original

- Botão que foge quando o requisito muda.
- Cliente pedindo “só mais uma coisinha”.
- Incidentes fictícios em produção e decisões sobre como responder.
- Certificado final e rodada extra.
- Contribuição opcional via Pix no certificado, com QR Code e botão de copiar.
- Som ligado por padrão, ativado na primeira interação, com opção de desligar.

## Entrega até sexta

Acesse `/entrega.html` diretamente ou pelo convite na abertura e no certificado. Simulador 2D de um freela de quatro minutos: loja interativa, alterações do cliente, seis pedidos à IA, testes, versões e três finais. Não exige completar o desafio original.

O progresso e o tempo restante ficam neste navegador; sair da aba pausa a partida. O pagamento da loja é fictício. Não usa login nem IA em tempo real.

Três mensagens de voz do cliente usam scripts fixos e a síntese de voz do navegador em português. Tocam na loja gerada, no carrinho duplicado e após a entrega, com transcrição e botão de repetir/parar. O som geral controla a reprodução automática e o relógio pausa durante a fala. Navegadores sem síntese de voz mantêm o texto; a voz disponível varia por aparelho.

## Executar localmente

O projeto usa HTML, CSS e JavaScript, sem dependências de build.

```bash
python -m http.server 8000
```

Abra http://localhost:8000.

## Publicar no Cloudflare Pages

Para conectar este repositório ao Pages, selecione um projeto de site estático, deixe o comando de build vazio e use `.` como diretório de saída. Para upload direto, envie os arquivos do site com `index.html` na raiz.

### Métricas anônimas

`game-events.js` registra visualizações, início e conclusão dos dois jogos no projeto Supabase **Prototype Metrics (Supa1)**. Um identificador aleatório fica no navegador para reconhecer a mesma pessoa entre os jogos. Não pedimos cadastro nem registramos nome, e-mail ou IP no banco de métricas. A contagem é aproximada: outro navegador ou aparelho aparece como outra pessoa.

Os dados ficam isolados no schema `esopraia_metrics`. A migração está em `supabase/migrations/20261008191000_add_esopraia_game_metrics.sql`, e a Edge Function em `supabase/functions/prototype-game-metrics/`. O navegador usa apenas a chave pública anon; a chave `service_role` permanece nos segredos do Supabase e não é incluída no site.

O painel fica em `/metrics.html` e usa o token administrativo já configurado para o dashboard do projeto. Ele mostra visitantes únicos, sessões ativas nos últimos cinco minutos, início/conclusão por jogo e quantos visitantes jogaram ou concluíram os dois. A coleta começa quando a versão atualizada do site for publicada; não recupera acessos anteriores.

## Estrutura

- `index.html`: página inicial e estrutura do desafio.
- `style.css`: estilos e layout responsivo.
- `app.js`: desafios originais, sons, certificado.
- `fiscal.js`: navegação entre histórias, casos com origem registrada e jogo Fiscal de IA.
- `favicon.svg`: ícone do site.

