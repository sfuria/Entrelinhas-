# Entrelinhas 3.1.4 — Editores, imagens e leitura

Atualização experimental do app GitHub Pages, baseada na 3.1.3. Faça um backup antes de instalar. Extraia o ZIP e envie TODOS os arquivos/pastas para a raiz do repositório. Preserve `assets/interface`.

## Correções
- Imagens não usam mais posicionamento absoluto dentro do documento; fotos antigas são normalizadas ao carregar.
- Editor do Diário e editor de capítulos compartilham seleção e ferramentas de imagem, incluindo tamanhos prontos, tamanho percentual, disposição de texto em fluxo e comandos para mover por parágrafo.
- Leitura: famílias de fontes do editor ficam disponíveis no leitor; escolhas Google Fonts carregam via rede quando selecionadas.
- Seleção de voz em português disponibilizada conforme o navegador/sistema; algumas vozes podem depender de serviços on-line do sistema.
- Novos ícones de funções com identidades separadas; iconografia autoral existente mantida.

## Limites
- O editor continua baseado em contenteditable. Ainda não é equivalente ao motor de paginação Word/Google Docs, e não oferece a mesma fidelidade DOCX.
- Texto ao redor da imagem é CSS float e depende da estrutura dos parágrafos. Imagens atrás do texto foram desabilitadas para evitar invasão de outras seções.
- Funcionalidades não foram testadas com login Google real. Use manuscritos de teste primeiro.
- O app não apaga seus textos intencionalmente, mas uma migração pode falhar: salve backup externo.
