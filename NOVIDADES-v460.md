# Entrelinhas 4.6 — Criação conectada

## Implementado
- O botão **Novo capítulo** agora apresenta Google Docs (autenticado), Google Docs na Web, Word na Web e editor local legado.
- No Google Docs com OAuth previamente configurado, o Entrelinhas usa a rotina já existente da API para criar e vincular o documento.
- Sem OAuth Google, abre a página oficial de criação do Docs, seguida do fluxo de vínculo manual.
- No Microsoft Word, abre word.new e orienta como vincular o arquivo criado ao projeto.
- Os arquivos antigos continuam locais e intactos; sua conversão não é automática.
- Cache de aplicação atualizado.

## Limitações importantes
- Word ainda **não** cria e vincula automaticamente por Microsoft Graph. Isso requer login Microsoft com OAuth e um arquivo DOCX válido.
- Listagem automática do Drive requer Picker configurado; OneDrive não está integrado.
- A criação via Google API requer Client ID, consentimento e permissões válidas.
- Documentos locais antigos NÃO são migrados automaticamente para a nuvem, para evitar perdas.
- Testes reais de OAuth e navegadores ainda são necessários.
