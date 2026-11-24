# Entrelinhas 3.0.3 — correção de consistência de publicação

Este pacote corrige a incompatibilidade entre Service Worker e arquivo JS: antes o cache exigia `app-v302.js` inexistente; agora usa `app-v301.js`, realmente incluído.

Publicar todos os arquivos do ZIP na raiz do repositório, respeitando nomes e pastas.

Antes de substituir qualquer arquivo, exportar um backup dos registros. Não limpar dados do navegador.

Não há comprovação de que o problema de largura do desktop esteja resolvido: deve ser testado em navegador real.
