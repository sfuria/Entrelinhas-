# Alterações da versão 4.1 alfa

## Implementado
- Histórico de versões em memória para operações de edição do laboratório (limite 80).
- Controles visuais desfazer/refazer, estados habilitado/desabilitado.
- Snapshot pré-substituição e download do snapshot anterior.
- Atalho de salvar manualmente e atualização de cache PWA.

## Não implementado
- ProseMirror/Tiptap (indisponível neste ambiente de compilação); o laboratório continua com `contenteditable` em blocos.
- Testes automatizados de cursor, Android, composição IME, múltiplos navegadores.
- DOCX, PDF, tabelas, paginação.

## Próximo marco
Empacotar motor de edição licenciado e validado, com suíte de testes em Chrome/Android e desktop, sem migrar manuscritos existentes.
