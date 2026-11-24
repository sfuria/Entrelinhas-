# Entrelinhas 3.0.1 — correção de atualização da interface

## Por que aparecia a Home antiga?
A versão 3.0 já estava publicada no GitHub, mas o Service Worker guardava `app.js` e `styles.css` e priorizava as cópias em cache. Assim, o HTML novo podia carregar a interface antiga.

## Como atualizar
1. Antes, exporte um backup dos manuscritos.
2. No GitHub, envie TODOS os arquivos desta pasta para a raiz de `sfuria/Entrelinhas-`, mantendo seus nomes: `index.html`, `app-v301.js`, `styles-v301.css`, `sw.js`, `pwa-register.js`, `manifest.json` e os ícones.
3. Confirme o commit. Após a publicação do GitHub Pages, recarregue a página com Ctrl+Shift+R no PC.
4. Confira o código-fonte da página: deve conter `3.0.1-cache-corrigido`.
5. Não limpe os dados do site e não desinstale o PWA.

O código do aplicativo e o esquema dos dados locais não foram modificados nesta correção; apenas a forma de servir a interface. Não é uma atualização de segurança auditada.
