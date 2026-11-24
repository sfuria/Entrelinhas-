# Entrelinhas 3.0.4 — Corrigido para telas de PC

**Causa corrigida:** o CSS global continha duas regras `body` que limitavam toda a página a 760px e 780px, com margens automáticas. Essa era a origem do deslocamento e da rolagem horizontal. As regras foram removidas e a grade desktop agora respeita a largura disponível.

## Instalação
1. Antes de qualquer alteração, exporte o backup dos seus textos.
2. Extraia o ZIP e envie **os arquivos de dentro** para a raiz do repositório GitHub Pages, preservando subpastas se houver. Não envie só o arquivo ZIP.
3. Garanta que `index.html`, `styles-v304.css`, `app-v301.js`, `sw.js`, `pwa-register.js`, `manifest.json`, `icon-192.png` e `icon-512.png` estejam na mesma pasta raiz.
4. Faça o commit e aguarde a publicação do GitHub Pages.
5. Abra o app no PC. Atualize com Ctrl+Shift+R se necessário. Não limpe o armazenamento do site.

Os arquivos antigos `styles.css`, `styles-v301.css`, `styles-v302.css` e `styles-v303.css` podem ficar no repositório; a versão 3.0.4 não os referencia.

## Validação
Testes estáticos de CSS em navegador local sem rodar o aplicativo inteiro foram feitos para 1800px, 1366px, 1180px, 1024px e 390px, para verificar rolagem horizontal e dimensões da grade. A autenticação Google e os dados reais não foram testados. O navegador de testes desta sessão bloqueou a navegação à página completa, portanto o teste usou conteúdo demonstrativo com a folha de estilos real.
