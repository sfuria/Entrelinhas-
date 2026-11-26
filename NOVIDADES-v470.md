# Entrelinhas 4.7 — Google com um clique (beta)

- Configuração pública do Google centralizada em `google-public-config.js`.
- Campos técnicos de OAuth/Picker removidos da interface comum de Ajustes.
- Botões Conectar com Google, Escolher documentos e Criar Google Docs.
- Autorização via janela oficial do Google; o token continua apenas em memória.
- Documentos vinculados abrem no Google Docs original.
- Nenhum manuscrito local foi migrado ou apagado.

## Limitações e segurança

- Ainda não há integração Microsoft automática: Word continua por link.
- O OAuth de produção ainda depende da publicação/verificação apropriada do projeto Google.
- A conta de testes precisa estar cadastrada enquanto o Google OAuth estiver em teste.
- O Google Picker exige que a chave de API tenha restrições de site e API adequadas.
- As credenciais usadas neste pacote são identificadores públicos extraídos das configurações fornecidas pela proprietária. Nenhum client secret foi inserido.
- Nenhum teste de autorização com uma conta Google real foi executado. Se aparecer erro 403, confira permissões, restrições e referenciadores no Google Cloud.
