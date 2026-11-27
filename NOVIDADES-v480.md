# Entrelinhas 4.8.0 — Conexão Google e biblioteca

- Separa autenticação OAuth da abertura do Picker.
- Botão conectar deixa a sessão ativa sem iniciar o seletor.
- Seletor aceita outros tipos de arquivos e navegação por pastas, preservando os originais.
- Vincula Google Docs no formato existente; outros formatos são adicionados por link Google Drive seguro.
- Erro de Picker não desconecta a conta.
- Ajusta política de referrer e força atualização do cache offline.

## Limitação que não pode ser removida pelo código
O serviço Google Picker ainda pode rejeitar uma chave ou ser afetado por bloqueios de cookies. Não foi possível realizar o fluxo OAuth real nesta entrega; NÃO considere a conexão com a conta Google validada em produção. Se houver uma falha na janela, seus manuscritos continuam protegidos.

## Atenção
Não compartilhe client secrets ou tokens. As credenciais públicas do projeto estão em google-public-config.js. Para eventual rotação da chave de API, atualize apenas esse arquivo.
