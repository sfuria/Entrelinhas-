# Entrelinhas 4.8.1 — Vinculação direta pelo Google Picker

## Correção

- Corrigido erro 404 após selecionar arquivo: a biblioteca agora utiliza nome, ID e URL devolvidos diretamente pelo Google Picker, sem exigir uma segunda chamada `files.get` para criar o vínculo.
- Mantidos seleção de arquivos, abertura do original no Google, login e documentos locais existentes.
- A vinculação **não faz download do arquivo nem garante permissão para leitura do conteúdo pela API**: apenas salva referência ao documento na biblioteca. A abertura do original continua sujeita à permissão da conta no Drive.
- Arquivos não Docs são vinculados como arquivos Google Drive, preservando links válidos de Docs, Sheets e Slides enviados pelo Picker.
- Cache do service worker atualizado para v481.

## Validação
- Sintaxe JavaScript e integridade do ZIP verificadas.
- A validação de autenticação e clique real no Google Picker depende da conta Google do usuário.
- Não altera manuscritos existentes nem migra dados.
