# Entrelinhas 4.5 — Biblioteca conectada

- Vincular Google Docs ou Word (OneDrive/SharePoint) por link HTTPS verificado.
- Organizar atalhos por projeto e abrir o documento original em nova aba.
- Alterar título, URL e projeto de um vínculo; removê-lo sem excluir o arquivo remoto.
- Google Picker anterior preservado, condicionado à configuração OAuth Google Cloud.
- Nenhum login Microsoft/OneDrive ou listagem automática de todos os arquivos nesta versão.
- Nenhum conteúdo de documento externo é copiado para a biblioteca nessa modalidade.
- O conteúdo do Word/Docs só é editado no site oficial, com os direitos de acesso da conta.
- O editor local e os manuscritos anteriores permanecem intactos.

**Limitações:** A vinculação por link não importa arquivos DOCX armazenados no computador, nem faz sincronização de texto, contagens ou revisão. Os atalhos ficam armazenados no dispositivo junto aos demais dados da biblioteca.

**Testes:** verificação estática do JavaScript, caminhos do ZIP e funções de validação de URL. Testes reais no navegador e nas contas Google/Microsoft ainda são necessários.
