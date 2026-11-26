# Entrelinhas 4.1 — Edição segura (alfa incremental)

Esta é uma atualização incremental da versão 4.0, preservando o editor principal e a chave de armazenamento do laboratório. **Ainda não integra ProseMirror/Tiptap.**

## O que foi implementado
- Botões **Desfazer** e **Refazer**, com histórico de até 80 estados em memória, agrupando digitação após 650 ms sem alterações.
- Atalho Ctrl/Cmd+S para salvar o laboratório; Ctrl/Cmd+Z e Ctrl/Cmd+Y quando o foco está fora de campos editáveis (dentro de texto, o navegador mantém o próprio desfazer).
- Cópia automática anterior à substituição do rascunho por importação, novo documento ou restauração do exemplo; opção para baixar a cópia em Arquivo.
- Atualização da versão do cache offline.

## Instalar no GitHub Pages
1. Antes de atualizar, **exporte backups JSON** dos rascunhos e dos manuscritos na versão antiga.
2. Extraia o ZIP e envie todos os arquivos e pastas, preservando a estrutura, para a raiz do repositório publicado.
3. Recarregue a página. Em Escrita, abra o novo editor experimental.
4. Teste primeiro com texto fictício.

## Atenção
- O histórico de desfazer existe apenas na sessão aberta: ao fechar a aba, ele se perde.
- A cópia automática anterior fica em localStorage, no mesmo navegador, sem criptografia e pode ser perdida ao apagar os dados do site; não substitui backup externo. Apenas a **última** substituição tem cópia automática.
- Ainda sem paginação verdadeira, DOCX/PDF, tabelas e motor transacional profissional; HTML e JSON já existiam na versão 4.0.
- Esta entrega passou por testes estáticos (verificação de sintaxe e arquivos), **não por testes completos de interação em navegadores reais/Android**.

Consulte `PLANO-EDITOR-PROFISSIONAL.md` para o roteiro original.
