# Entrelinhas 4.7.2 — Correção da política de origem (Google Picker)

## Diagnóstico
A versão 4.7.1 publicada no GitHub incluía `<meta name="referrer" content="no-referrer">`, que impede o navegador de enviar o cabeçalho Referer. Isso pode impedir a validação de chaves de API com restrição por site HTTP referrer no Google Picker, produzindo `The API developer key is invalid`.

## Alterações
- `index.html`: política alterada para `no-referrer-when-downgrade` para permitir verificação da origem em solicitações HTTPS.
- `sw.js`: cache atualizado para `entrelinhas-app-shell-v472`.
- Nenhum manuscrito, armazenamento ou chave foi alterado.

## Limites
Correção fundada em diagnóstico estático: não há como validar a autenticação em conta real neste ambiente. Se o erro persistir, precisamos inspecionar o referrer real, a chave enviada e as respostas do Google no navegador. Nunca exponha client secret.

## Publicação
Enviar `index.html` e `sw.js` à raiz do repositório sfuria/Entrelinhas- (ou publicar o ZIP completo). Após commit e publicação, atualizar com Ctrl+Shift+R.
