# Entrelinhas 3.0.2 — Correção de largura do desktop

A Home anterior exibiu uma grade de duas colunas dentro de uma área central estreita, causando sobreposição e palavras empilhadas. Esta atualização introduz regras de contenção explícitas de largura para PC e uma alternativa de coluna única em janelas desktop mais estreitas. **O layout mobile não foi modificado.**

## Instalação
1. Exporte um backup de seus textos atuais.
2. Na raiz de https://github.com/sfuria/Entrelinhas-/upload/main, envie os arquivos desta pasta (inclusive `styles-v302.css`, `app-v301.js`, `index.html`, `sw.js` e demais arquivos). Preserve nomes e pastas.
3. Confirme no GitHub, aguarde a publicação e abra https://sfuria.github.io/Entrelinhas-/ usando Ctrl+Shift+R.
4. **Não limpe dados do site e não desinstale o PWA**.

## Validação
- Arquivos e referências verificados estaticamente.
- Não foi possível realizar teste visual end-to-end em Chromium neste ambiente (ERR_BLOCKED_BY_ADMINISTRATOR).
- A mudança não altera o esquema de dados dos manuscritos nem a integração Google.
