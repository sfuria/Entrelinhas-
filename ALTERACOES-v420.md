# Entrelinhas 4.2 — Pesquisa e recuperação (alfa)

## Implementado
- Aba **Pesquisar** com contagem e substituição de ocorrências de texto dentro dos blocos, preservando marcação inline quando a correspondência está dentro do mesmo nó textual. Atalho Ctrl/Cmd+F abre a pesquisa enquanto o laboratório está ativo.
- Exportação TXT UTF-8.
- Até 8 pontos de recuperação locais e opção de restauração manual, mantendo a chave antiga do documento. Ponto automático após 25 edições registradas e ponto manual via aba Arquivo.
- Tentativa de salvar imediatamente quando a aba fica oculta.
- Registro de checkpoint antes da edição de texto para reduzir lacunas no histórico experimental.
- Cache PWA versionado para 4.2.

## Limites importantes
- **Ainda NÃO é ProseMirror/Tiptap**: nenhuma biblioteca externa foi adicionada porque não houve acesso ao registro de pacotes. O editor continua baseado em contenteditable.
- Undo/redo em áreas contenteditable ainda apresenta diferenças conforme o navegador; cursor, composição IME e colagem de texto complexo precisam de testes.
- Buscar/substituir não detecta palavras divididas entre tags HTML adjacentes, e busca não realça ocorrências na página.
- Pontos de recuperação ficam somente neste navegador, não são criptografados e podem desaparecer ao limpar os dados do site. Eles não substituem backup externo.
- Edição e recuperação não passaram por testes de interação no Android ou navegador real; foram aplicadas verificações estáticas.
- Arquivos da aplicação principal mantidos sem alterações.
