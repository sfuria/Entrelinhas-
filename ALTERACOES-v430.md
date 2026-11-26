# Entrelinhas 4.3 Alfa — Estrutura e metas

## Implementado
- Aba **Estrutura** com índice navegável dos blocos do tipo Título.
- Meta de palavras opcional persistida no navegador, independentemente do rascunho.
- Estatísticas de caracteres e estimativa aproximada de leitura (220 palavras/minuto).
- Botão **Imprimir / Salvar PDF** que usa a impressão do próprio navegador. Não equivale a um exportador PDF com paginação profissional.
- Atualização de cache offline para v430.
- Mantido o editor legado isolado.

## Limitações
- Ainda usa `contenteditable`; **ProseMirror/Tiptap não foi instalado**.
- A impressão não garante fidelidade de páginas ou margens em todas as plataformas.
- Dados experimentais ficam no armazenamento local, sem sincronização ou criptografia.
- Testes automatizados de sintaxe/integridade não substituem testes em navegador e Android.
