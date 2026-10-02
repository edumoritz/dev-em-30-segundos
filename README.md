# Dev em 30 segundos

> “Com IA eu faço tudo que você faz.” Então a produção é sua.

Um desafio interativo e bem-humorado sobre a vida real de quem desenvolve software. A IA acelera o trabalho; escolher, avaliar e assumir a responsabilidade também faz parte dele.

## A brincadeira

- Botão que foge quando o requisito muda.
- Cliente pedindo “só mais uma coisinha”.
- Incidentes fictícios em produção e decisões sobre como responder.
- Certificado final e rodada extra.
- Som ligado por padrão, ativado na primeira interação, com opção de desligar.
- Contribuição opcional via Pix, com QR Code e Copia e Cola.

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
- `app.js`: desafios, sons, certificado e código Pix.
- `pix-qr.png`: QR Code da contribuição opcional.
- `favicon.svg`: ícone do site.

O QR Code e o código Pix em `app.js` precisam ser atualizados juntos caso o destinatário seja alterado. O site não confirma pagamentos automaticamente.

Criado por Eduardo Moritz.
