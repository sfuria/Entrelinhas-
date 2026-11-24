# Entrelinhas 2.8 — Transferência criptografada entre celular e PC

## O que realmente funciona (depois de configurar Google Cloud)
- Interface no Ajustes para criar cópia criptografada na pasta privada `appDataFolder` do Google Drive; cada upload cria um novo arquivo sem sobrescrever versões anteriores.
- Listar e baixar cópias criptografadas (sem alterar dados atuais).
- Usar **Restaurar backup** existente para importar a cópia no outro dispositivo, com senha e confirmação de substituição.
- Google Docs permanece como editor original dos capítulos. A biblioteca local, Diário, personagens e estatísticas só atravessam dispositivos por transferência manual.
- O Google recebe apenas o JSON cifrado, nome e metadados do arquivo; a senha não é enviada. O aplicativo ainda pode ser comprometido enquanto desbloqueado.

## Como testar sem risco
1. Não use sua conta Google principal. Comece com conta de testes no Google Cloud e documentos fictícios.
2. Publique o pacote com pastas intactas no GitHub Pages após salvar um backup anterior.
3. Em Ajustes > Google, preencha ID OAuth; Google Cloud deve ter a origem exata HTTPS autorizada e Drive API habilitada.
4. Conecte o Google e aceite os escopos drive.file e `drive.appdata`. O escopo adicional é necessário para `appDataFolder`.
5. Crie um projeto **fictício** no celular e use Ajustes > Transferência > Criar cópia; defina senha com pelo menos 12 caracteres.
6. No PC, conecte a MESMA conta Google; clique Recuperar cópia > Baixar protegido. Antes de restaurar, exporte um backup do PC. Clique Restaurar backup e escolha o JSON baixado, digite a senha e confirme.
7. Confira o projeto fictício. Teste também senha errada e cancelamento sem alterar conteúdo.

## Limitações e segurança
- Não há sincronização automática ou fusão de edições, portanto alterações diferentes em dois dispositivos podem conflitar. Restaurar SUBSTITUI a biblioteca local depois de perguntar; nunca substitua sem cópia externa.
- A integração OAuth com Google Cloud ainda não foi validada com conta real por testes desta execução. Falhas de permissão, cotas ou consentimento podem ocorrer.
- Os limites de tamanho impedem cópias grandes; se precisar, use backup local via arquivo.
- A senha é solicitada por prompt do navegador nesta versão experimental, ainda não há gerenciador de chaves nem garantia contra código malicioso.
- O armazenamento no Google está sob as políticas do Google. A criptografia oferece proteção adicional, mas risco zero não existe.
- Jamais inclua OAuth client secret, senha ou chave privada nos arquivos GitHub Pages.
- Não desinstale o PWA nem limpe dados do navegador antes de conferir restauração.
