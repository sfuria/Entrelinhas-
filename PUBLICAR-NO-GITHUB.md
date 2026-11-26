# Entrelinhas 4.7.1 — Correção Google Picker

Corrigida a capitalização de caracteres na chave pública do Google Picker em `google-public-config.js`, anteriormente transcrita incorretamente. O serviço Google diferencia letras maiúsculas e minúsculas. Cache atualizado para forçar nova instalação. Nenhum manuscrito foi removido ou migrado.

## Instalação
1. Faça backup do Entrelinhas e dos manuscritos.
2. Extraia o ZIP; envie todos os arquivos e pastas para https://github.com/sfuria/Entrelinhas- preservando caminhos.
3. Em GitHub Code > Add file > Upload files, confirme substituições e Commit changes.
4. Aguarde a publicação no Actions e abra https://sfuria.github.io/Entrelinhas-/ ; atualize com Ctrl+Shift+R.
5. Em Mesa de escrita, use Selecionar no Google Drive.

Se ainda surgir erro de chave inválida, confirmar as restrições HTTP referer e que a Google Picker API está ativada.

Esta correção não transforma o seletor em navegador universal de arquivos; essa ampliação está pendente.
