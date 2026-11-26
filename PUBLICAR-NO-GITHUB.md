# Publicar Entrelinhas 4.7

1. Faça backup dos manuscritos e exporte um backup do Entrelinhas antes da atualização.
2. Extraia o ZIP. Entre no GitHub: https://github.com/sfuria/Entrelinhas-
3. Aba **Code → Add file → Upload files**. Envie todos os arquivos e pastas do pacote para a raiz do repositório. É importante incluir **google-public-config.js**.
4. Clique **Commit changes**; acompanhe em **Actions**.
5. Abra https://sfuria.github.io/Entrelinhas-/ e atualize a página (Ctrl+Shift+R).
6. Em Ajustes → Google Docs e Drive, clique **Conectar com Google**; selecione conta autorizada em testes.

**Não inclua client secret no site.** As configurações `clientId`, `pickerKey` e `projectNumber` são identificadores públicos e devem permanecer restritos no Google Cloud. Se precisar trocar a chave do Picker, altere `google-public-config.js` e publique novamente.
