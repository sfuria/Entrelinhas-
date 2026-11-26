# Entrelinhas — Projeto de editor profissional integrado

## Objetivo
O Entrelinhas deve permitir criar e editar documentos ricos dentro do próprio PWA, no PC e no Android, sem exigir Word, Google Docs, Docker nem outra instalação. O programa deve continuar gratuito para o usuário final sempre que tecnicamente e juridicamente viável.

**Qualidade desejada:** interação e fidelidade próximas às de Word e Google Docs. **Limite:** identidade absoluta entre as três plataformas não pode ser prometida; comportamento e arquivos complexos precisarão de testes de compatibilidade.

## Princípios não negociáveis
1. Nunca migrar ou substituir os documentos antigos automaticamente.
2. Guardar snapshots reversíveis antes de qualquer conversão de documentos.
3. Não enviar manuscritos para terceiros sem consentimento específico.
4. Usar controles reais, com testes de digitação, cursor, seleção, imagens, exportação e reabertura.
5. Separar dados e interface: modelo estruturado versionado em JSON e renderização desacoplada.
6. Compatibilidade mobile, teclado físico, leitor de telas e PWA offline.
7. Fazer revisão de dependências/licenças antes de anunciar o aplicativo como livre/gratuito de longo prazo.

## Marcos

### M0 — Base isolada (esta versão 4.0.0 alfa)
- Tela `editor-next.html` incorporada ao PWA, sem serviço adicional.
- Rascunho experimental estruturado em blocos (parágrafos, títulos, imagens, divisórias).
- Fonte e tamanho por bloco; alinhamento; margens e recuo; primeira edição de imagem.
- Salvamento local independente; cópias JSON e HTML.
- Sem alteração nem migração dos manuscritos de produção.
- Limites: editor ainda usa blocos `contenteditable` nativos; não há motor profissional instalado, paginação real, DOCX/PDF, texto flutuando ao redor de imagens, tabelas ou colaboração simultânea.

### M1 — Núcleo robusto de edição
- Escolher e empacotar editor estruturado, p.ex. ProseMirror/Tiptap ou alternativa livre após prova de conceito.
- Seleção de texto e formatação em operações do modelo, histórico consistente, desfazer/refazer, atalhos, colagem e IME/teclado virtual.
- Testes de regressão automatizados de cursor e edição Android/PC.

### M2 — Imagens, tabelas e layout
- Nós de imagem com alças de redimensionamento, alinhamento, legendas, texto ao redor e reordenação.
- Tabelas com operações confiáveis.
- Margens, tamanhos e estilos de parágrafo preservados na reabertura.
- Diferenciar editor fluido de exportação/paginação: medir desempenho e implementar paginação quando robusta.

### M3 — Interoperabilidade e impressão
- Importação DOCX com relatório de fidelidade e sem substituir original.
- Exportação DOCX e PDF; numeração, cabeçalhos/rodapés, notas, tabelas, imagens.
- Testes com corpus de documentos (simples, grandes, imagens, tabelas, notas, quebra de página).

### M4 — Migração e disponibilização
- Conversor somente com confirmação, backup e teste de ida e volta.
- Ativação gradual nos capítulos e no Diário, permitindo voltar ao editor anterior.
- Testes de acessibilidade, uso offline e recuperação após falha.

## Privacidade
Nesta alfa, o laboratório armazena um rascunho sob a chave `entrelinhas:next-editor:alpha:1` do armazenamento do navegador. Esses dados **não são criptografados** e não sincronizam entre dispositivos. O arquivo exportado também não é criptografado. Não armazenar manuscritos privados importantes ali.

## Próxima etapa de desenvolvimento
Empacotar um motor de edição rico de código aberto e reimplementar as operações usando transações do modelo. Remover a dependência de `contenteditable` livre para estruturar todo o documento; ele deve ficar só dentro dos componentes controlados pelo motor. Não avançar a migração sem testes funcionais.
