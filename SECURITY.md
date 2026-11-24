# Segurança — Entrelinhas 2.1

**Status:** experimental. As verificações automáticas não constituem auditoria, pentest nem garantia de proteção. Não conecte contas principais ou chaves pagas de IA até completar testes independentes.

## Antes de publicar
1. Exporte e guarde backup externo. Para dados importantes, valide a restauração em uma instalação de teste.
2. Publique os arquivos `index.html`, `app.js`, `styles.css`, `pwa-register.js`, `sw.js` e a pasta `.github/workflows/security-check.yml`, mais `scripts/security-check.mjs`.
3. Em GitHub → Actions, confirme que a verificação de segurança passou.
4. Em Settings → Branches/Rulesets, ative proteção da branch `main`, bloqueio de force-push e exclusão, e exija Pull Request e status de verificação **quando disponíveis para seu plano e repositório**. Se o GitHub Pages estiver configurado para publicar diretamente da `main`, apenas rodar o teste não impede publicação de um push defeituoso.
5. Ative passkey/2FA no GitHub, guarde códigos de recuperação offline e revise sessões, tokens e aplicativos autorizados.
6. Habilite alertas de segurança do repositório e secret scanning, quando disponíveis. Não ponha manuscritos, backups ou chaves de API em commits, Issues ou Actions logs.
7. Mantenha atualizados Android, Chrome e bibliotecas. Faça um teste com documentos fictícios antes de usar manuscritos reais.

## Política de acesso
- Conta GitHub: acesso mínimo e 2FA/passkey. Não compartilhar tokens pessoais.
- Google Docs: apenas conta de testes por enquanto; escopo mínimo `drive.file`; a autorização real ainda não foi validada.
- IA: sem chaves no JavaScript ou GitHub; integração direta desativada até backend autenticado, limites de uso, proteção contra abuso e testes.
- Manuscritos: backups criptografados e Biblioteca Privada ainda experimentais. A proteção não cobre texto em tela numa sessão desbloqueada, e cópias anteriores podem permanecer em armazenamento antigo.

## O que esse teste cobre
- Sintaxe JS, recursos obrigatórios, CSP básica, ausência de padrões comuns de segredos, escopo Google e domínio externo no service worker.

## O que **não** cobre
- Vulnerabilidades XSS complexas, comprometimento de dependências/CDN, permissões reais do GitHub, vulnerabilidades no sistema operacional, falhas de armazenamento/sincronização, testagem OAuth ponta a ponta e invasões simuladas.

## Incidente ou suspeita de invasão
1. Pare de usar o app e evite desbloquear a biblioteca em uma página suspeita.
2. Use aparelho confiável para encerrar sessões e revogar autorizações Google/GitHub e chaves API potencialmente afetadas.
3. Verifique histórico de commits e deploy; restaure uma versão revisada.
4. Guarde registros de alterações e faça recuperação por backup confiável, sem limpar os dados locais antes de confirmar cópias utilizáveis.

## Auditoria de importação — versão 2.2
- ZIP: valida entradas, nomes, tamanhos declarados, limite de arquivo e total; interrompe descompactação acima do declarado.
- XML: recusa DOCTYPE e ENTITY em arquivos DOCX/EPUB e XML malformado.
- Conteúdo: sanitização elimina elementos ativos. Imagens externas não são carregadas automaticamente pelo texto sanitizado; imagens embutidas têm limite.
- Testes: `node scripts/security-check.mjs` e `node scripts/import-security-tests.mjs`.
- Limites conhecidos: sanitizador HTML feito sob medida ainda precisa de revisão externa e testes XSS em navegador; exportações HTML independentes não herdam a política CSP do aplicativo; não há garantia de segurança total.

## Versão 2.3

Colagem e soltar conteúdos nas áreas contenteditable são interceptados em captura, sanitizados antes da inserção. Limite de HTML por operação. Testes estáticos adicionais em scripts/editor-security-tests.mjs. Não equivale a prova completa contra XSS; há outras superfícies de HTML gerado que requerem revisão manual e testes reais.


## 2.8: transferência manual criptografada
- Solicita drive.appdata além de drive.file para arquivos em appDataFolder. Não exige drive completo.
- Upload usa envelope AES-256-GCM/PBKDF2 com salt e IV randômicos, sem plaintext. Arquivos são sempre novos.
- Download não modifica estado local. Restauração continua ação separada, explícita, potencialmente destrutiva.
- Testes reais de OAuth e Android pendentes; este recurso não deve ser usado como único backup.
