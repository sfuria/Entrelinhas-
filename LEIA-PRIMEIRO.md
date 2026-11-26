# Entrelinhas 3.1.5 — Correções de documento e imagens

Esta atualização preserva o armazenamento e os ícones existentes e entrega mudanças no editor HTML atual.

- Editor de notas: mais comandos para texto, títulos, listas, alinhamento e recuo.
- Ferramentas de imagem consolidadas e inseridas junto ao documento, não sobre outros elementos da tela.
- Imagens permanecem no fluxo do documento, com ajuste de largura, texto ao lado e movimento entre parágrafos.
- Arrastar imagens no Diário e editor local não deve ser convertido em colagem de texto.
- Campo de descrição acessível para imagens.
- Imagem nova no Diário entra num parágrafo próprio.
- Preservadas as fontes, ícones ilustrados, temas, leitura e configurações anteriores.

**Limite:** o motor ainda é HTML contenteditable com comandos document.execCommand (legados). Isso NÃO é equivalente à paginação, coautoria ou layout fiel de Word/Google Docs. Uma migração para um editor estruturado (ProseMirror/Tiptap ou equivalente) requer planejamento, testes de conversão e proteção contra perda de dados.

**Segurança:** exporte backup antes de publicar. Não limpe os dados do navegador. Conexão Google continua sujeita à configuração e validação próprias.

Publicar: envie todos os arquivos e subpastas extraídos para a raiz do GitHub Pages. Não faça upload apenas deste ZIP.
