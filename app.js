/* Entrelinhas Estúdio Literário — v0.9. Projeto pessoal, sem servidor. */
(()=>{'use strict';
const KEY='entrelinhas-studio-v2',LEGACY='entrelinhas-demo-v1',DB_NAME='entrelinhas-offline-v3';
const EL_VAULT_FLAG='entrelinhas-vault-active-v1';
let elVaultActive=localStorage.getItem(EL_VAULT_FLAG)==='1',elVaultKey=null,elVaultLocked=elVaultActive,elVaultHiddenAt=0;
const colors=['#795A96','#A86F86','#5F8399','#617C63','#AE765A','#88789B'];
const palettes={lavanda:{accent:'#9064AE',bg:'#F7F1FA',card:'#FFFFFF',soft:'#EBDDF2'},noturno:{accent:'#D0A7EC',bg:'#231D2D',card:'#342B42',soft:'#50405F'},papel:{accent:'#946D50',bg:'#F3E8D7',card:'#FFF9EF',soft:'#EAD9C1'}};
const noteTypes={ideia:'💡 Ideias',escaleta:'🧭 Escaleta',cena:'🎬 Cenas',personagem:'👤 Personagens',mundo:'🗺️ Mundo',diario:'📔 Diário',pesquisa:'🔎 Pesquisa',cronologia:'⏳ Cronologia'};
const noteFields={
 ideia:[['resumo','Resumo da ideia'],['origem','De onde surgiu'],['destino','Pode virar (cena, capítulo, personagem…)'],['potencial','O que torna a ideia interessante'],['proximo','Próximo passo']],
 escaleta:[['resumo','Resumo do arco'],['ato','Ato / parte'],['conflito','Conflito central'],['objetivo','Objetivo narrativo'],['virada','Ponto de virada'],['desfecho','Desfecho planejado']],
 cena:[['capitulo','Capítulo / sequência'],['resumo','Resumo'],['pov','Ponto de vista (POV)'],['local','Local'],['tempo','Momento da história'],['objetivo','Objetivo da cena'],['obstaculo','Conflito / obstáculo'],['consequencia','Consequência'],['estado','Estado da cena']],
 personagem:[['nomecompleto','Nome completo / apelidos'],['idade','Idade'],['especie','Espécie / raça'],['ocupacao','Ocupação'],['papel','Papel na história'],['altura','Altura'],['olhos','Olhos'],['cabelo','Cabelo'],['aparencia','Descrição física'],['estilo','Estilo / vestuário'],['marcas','Marcas e características'],['personalidade','Personalidade'],['qualidades','Qualidades'],['defeitos','Defeitos'],['medos','Medos'],['gostos','Gostos / desgostos'],['manias','Manias'],['passado','Passado e origem'],['segredo','Segredos'],['motivacao','Motivação e objetivo'],['conflito','Conflitos internos e externos'],['arco','Arco narrativo'],['voz','Voz / jeito de falar'],['frases','Frases memoráveis'],['relacoes','Relações e vínculos']],
 mundo:[['categoria','Tipo (reino, local, cultura, magia, facção…)'],['local','Localização'],['descricao','Descrição geral'],['historia','História / origem'],['regras','Regras e características'],['sociedade','Sociedade, cultura e costumes'],['politica','Política e relações'],['magia','Magia e elementos especiais'],['curiosidades','Curiosidades']],
 cronologia:[['quando','Data / período (AAAA-MM-DD ou descrição)'],['evento','O que aconteceu'],['local','Local'],['envolvidos','Personagens envolvidos'],['impacto','Impacto na história'],['arco','Arco narrativo']],
 pesquisa:[['assunto','Assunto / categoria'],['fonte','Fonte / autoria'],['url','Link da fonte'],['citacao','Citação ou trecho de referência'],['aplicacao','Como usar no livro'],['confiabilidade','Confiabilidade / observações']],
 diario:[['humor','Humor / estado criativo'],['metas','Metas do dia'],['progresso','Progresso'],['dificuldades','Desafios'],['reflexoes','Reflexões'],['proximos','Próximas ações']]
};
const noteSections={
 ideia:[['Semente da ideia',['resumo','origem','destino','potencial','proximo']]],
 escaleta:[['Visão geral do enredo',['resumo','ato','conflito','objetivo','virada','desfecho']]],
 cena:[['Localização da cena',['capitulo','pov','local','tempo']],['Desenvolvimento dramático',['resumo','objetivo','obstaculo','consequencia','estado']]],
 personagem:[['Identidade',['nomecompleto','idade','especie','ocupacao','papel']],['Aparência',['altura','olhos','cabelo','aparencia','estilo','marcas']],['Personalidade',['personalidade','qualidades','defeitos','medos','gostos','manias']],['História e conflitos',['passado','segredo','motivacao','conflito']],['Arco e voz',['arco','voz','frases','relacoes']]],
 mundo:[['Identidade do mundo',['categoria','local','descricao','historia']],['Cultura e regras',['regras','sociedade','politica','magia','curiosidades']]],
 cronologia:[['Evento na linha do tempo',['quando','evento','local','envolvidos','impacto','arco']]],
 pesquisa:[['Referências',['assunto','fonte','url','citacao']],['Aplicação',['aplicacao','confiabilidade']]],
 diario:[['Meu registro',['humor','metas','progresso','dificuldades','reflexoes','proximos']]]
};
const $=sel=>document.querySelector(sel),esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])),uid=()=>((crypto?.randomUUID?.())||Date.now().toString(36)+'-'+Math.random().toString(36).slice(2)),nfmt=n=>Number(n||0).toLocaleString('pt-BR');
const day=(d=new Date())=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const validDay=s=>{if(!/^\d{4}-\d{2}-\d{2}$/.test(s||''))return false;let [y,m,d]=s.split('-').map(Number),z=new Date(y,m-1,d);return z.getFullYear()===y&&z.getMonth()===m-1&&z.getDate()===d};
const shift=(s,n)=>{let [y,m,d]=s.split('-').map(Number),z=new Date(y,m-1,d);z.setDate(z.getDate()+n);return day(z)};
const pretty=s=>validDay(s)?new Date(s+'T12:00:00').toLocaleDateString('pt-BR',{day:'2-digit',month:'short',year:'numeric'}):s;
const now=()=>new Date().toISOString(),safeCount=s=>Number.isSafeInteger(Number(s))&&Number(s)>=0&&Number(s)<=1e7;
function blank(){return{version:2,revision:0,projects:[],sessions:[],documents:[],notes:[],annotations:[],trash:[],preferences:{theme:'lavanda',accent:null,dailyWordsGoal:500,readerTheme:'reader-sepia',readerFontSize:19,readerLineHeight:1.75,readerFont:'Georgia,serif',readerMode:'continuous',readerSpeechRate:1,oauthClientId:''}}}
function normalize(raw){if(!raw||typeof raw!=='object'||!Array.isArray(raw.projects)||!Array.isArray(raw.sessions))throw Error('Arquivo de backup inválido');if(raw.version!==1&&raw.version!==2)throw Error('Versão incompatível');const x=blank();for(const k of ['projects','sessions','documents','notes','annotations','trash'])if(Array.isArray(raw[k]))x[k]=raw[k];x.preferences={...x.preferences,...(raw.preferences||{})};x.version=2;x.revision=Math.max(0,Number(raw.revision)||0);if(!palettes[x.preferences.theme])x.preferences.theme='lavanda';if(!['reader-sepia','reader-night','reader-white'].includes(x.preferences.readerTheme))x.preferences.readerTheme='reader-sepia';if(!(Number(x.preferences.readerSpeechRate)>=.6&&Number(x.preferences.readerSpeechRate)<=1.7))x.preferences.readerSpeechRate=1;if(x.projects.some(p=>typeof p.id!=='string'||typeof p.title!=='string')||x.sessions.some(s=>!validDay(s.date)||!['escrita','revisao'].includes(s.kind)))throw Error('Dados do backup inconsistentes');return x}
let data=blank(),saved=true,db=null,dbOpening=true,changedSinceStart=false,storageQueue=Promise.resolve(),writeError='';
try{if(!elVaultActive){const existing=localStorage.getItem(KEY),old=localStorage.getItem(LEGACY);if(existing)data=normalize(JSON.parse(existing));else if(old){data=normalize(JSON.parse(old));localStorage.setItem(KEY,JSON.stringify(data))}}}catch(e){console.warn('Falha ao recuperar dados',e)}
let tab='inicio',view='main',projectId=null,documentId=null,search='',libraryQuery='',noteFilter='todos',month=day().slice(0,7),sessionKind='escrita',chosenColor=colors[0],editingId=null,selectedNoteType='ideia',editorTimer=null,scrollTimer=null,toastTimer=null,readerNotesOpen=false,readerSelection=null,oauthToken=null,oauthExpiry=0,googleFiles=[],cloudLoading=false,selectedImage=null,timerRunningAt=0,timerElapsedMs=0,timerDocumentId=null,timerHandle=null,googleSyncTimers=new Map(),googleSyncBusy=new Set(),googlePollBusy=false;
const project=p=>data.projects.find(x=>x.id===p),doc=d=>data.documents.find(x=>x.id===d),annotationsFor=d=>data.annotations.filter(a=>a.documentId===d),entriesFor=p=>data.notes.filter(n=>!p||n.projectId===p);
let activeNoteId=null,noteMode='read',noteSaveTimer=null,diaryQuery='',diarySort='recentes';
let deferredInstall=null;
let speechChunks=[],speechIndex=0,speechToken=0,speechActive=false,speechDocumentId=null;
function stopSpeech(silent=true){
  speechToken++;speechActive=false;speechChunks=[];speechIndex=0;speechDocumentId=null;
  if('speechSynthesis' in window)try{window.speechSynthesis.cancel()}catch(e){}
  const btn=$('[data-action="reader-speech"]');if(btn){btn.textContent='🔊';btn.title='Ouvir capítulo';btn.setAttribute('aria-label','Ouvir capítulo')}
  if(!silent)flash('Leitura em voz alta interrompida.');
}
function speechSegments(text,limit=180){
  const words=String(text||'').replace(/\s+/g,' ').trim().split(' ').filter(Boolean);const out=[];let current='';
  for(const word of words){if(word.length>limit){if(current){out.push(current);current=''}for(let n=0;n<word.length;n+=limit)out.push(word.slice(n,n+limit));continue}
    if(current&&current.length+word.length+1>limit){out.push(current);current=word}else current+=(current?' ':'')+word}
  if(current)out.push(current);return out;
}
function speakNext(token){
 if(!speechActive||token!==speechToken||speechDocumentId!==documentId||view!=='reader')return;
 if(speechIndex>=speechChunks.length){stopSpeech();flash('Fim da leitura em voz alta.');return}
 const utterance=new SpeechSynthesisUtterance(speechChunks[speechIndex++]);utterance.lang='pt-BR';utterance.rate=Math.min(1.7,Math.max(.6,Number(data.preferences.readerSpeechRate)||1));
 utterance.onend=()=>{if(token===speechToken)speakNext(token)};
 utterance.onerror=event=>{if(token===speechToken){stopSpeech();if(event.error!=='canceled'&&event.error!=='interrupted')flash('A voz do dispositivo interrompeu a leitura.')}};
 try{window.speechSynthesis.speak(utterance)}catch(e){stopSpeech();flash('Não foi possível iniciar a leitura em voz alta.')}
}
function toggleSpeech(){
 if(speechActive){stopSpeech(false);return}
 if(!('speechSynthesis' in window)||typeof SpeechSynthesisUtterance==='undefined'){flash('Este navegador não oferece leitura em voz alta.');return}
 const d=doc(documentId);if(!d)return;const contents=textOf(d.html||'');if(!contents){flash('Este manuscrito não tem texto para ouvir.');return}
 stopSpeech();speechChunks=speechSegments(contents,180);speechIndex=0;speechActive=true;speechDocumentId=d.id;const token=speechToken;
 const btn=$('[data-action="reader-speech"]');if(btn){btn.textContent='■';btn.title='Parar leitura';btn.setAttribute('aria-label','Parar leitura')}
 speakNext(token);flash('Leitura em voz alta iniciada.');
}

window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();deferredInstall=event});
window.addEventListener('appinstalled',()=>{deferredInstall=null;flash('Entrelinhas instalado! 💜')});
function sortedDocs(pid){return data.documents.filter(d=>d.projectId===pid).sort((a,b)=>(Number(a.position??1e9)-Number(b.position??1e9))||((a.createdAt||'').localeCompare(b.createdAt||'')))}
function moveDocument(docId,direction){const d=doc(docId);if(!d||!d.projectId)return;const docs=sortedDocs(d.projectId);const i=docs.findIndex(x=>x.id===docId),j=i+direction;if(i<0||j<0||j>=docs.length)return;[docs[i],docs[j]]=[docs[j],docs[i]];docs.forEach((item,k)=>item.position=k);persist();flash('Ordem dos capítulos atualizada.')}
function createSearchText(html){return textOf(html||'')}
function normalizeSearch(v){return String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('pt-BR')}
function searchMatches(){const needle=normalizeSearch(libraryQuery.trim());if(!needle)return[];let results=[];for(const p of data.projects){if(normalizeSearch([p.title,p.genre,p.blurb].join(' ')).includes(needle))results.push({kind:'projeto',id:p.id,title:p.title,description:p.blurb||p.genre||'Projeto literário',projectTitle:''})}
for(const d of data.documents){const content=createSearchText(d.html);let hay=normalizeSearch(d.title+' '+content),i=hay.indexOf(needle),excerpt=content.slice(Math.max(0,i-d.title.length-45),Math.max(0,i-d.title.length-45)+165);if(i>=0)results.push({kind:'documento',id:d.id,title:d.title,description:excerpt||'Abrir manuscrito',projectTitle:project(d.projectId)?.title||''})}
for(const n of data.notes){let content=[n.title,n.body,...Object.values(n.fields||{}),...(n.tags||[])].join(' · '),i=normalizeSearch(content).indexOf(needle);if(i>=0)results.push({kind:'nota',id:n.id,title:n.title,description:content.slice(Math.max(0,i-35),Math.max(0,i-35)+165),projectTitle:project(n.projectId)?.title||''})}
return results.slice(0,120)}
function searchResultsHTML(){let items=searchMatches();if(!libraryQuery.trim())return '<div class="card empty">Digite uma palavra, título ou nome de personagem. A pesquisa funciona sem internet.</div>';return `<p class="small muted">${items.length} resultado(s)${items.length===120?' (limite de 120)':''}</p>${items.map(x=>`<div class="note-card"><button class="preview" ${x.kind==='projeto'?`data-project="${esc(x.id)}"`:x.kind==='documento'?`data-edit-doc="${esc(x.id)}"`:`data-edit-note="${esc(x.id)}"`}><span class="tag">${x.kind==='documento'?'✒ Manuscrito':x.kind==='nota'?'✦ Planejamento':'▣ Projeto'}</span> <strong>${esc(x.title)}</strong><div class="tiny muted">${esc(x.projectTitle)}</div><div class="small muted" style="margin-top:7px">${esc(x.description)}</div></button></div>`).join('')||'<div class="card empty">Nada encontrado. Experimente outra palavra.</div>'}`}
function librarySearchPage(){return `<h1 class="headline">Encontre suas histórias</h1><p class="sub">Pesquise em todos os projetos, capítulos e registros criativos — mesmo offline.</p><div class="field"><label for="librarySearch">Buscar em tudo</label><input id="librarySearch" type="search" placeholder="Ex.: dragão, Lysandra, capítulo 3…" value="${esc(libraryQuery)}" autocomplete="off"></div><div id="libraryResults">${searchResultsHTML()}</div>`}

// Segurança: backups criptografados e autenticados (AES-256-GCM + PBKDF2 SHA-256).
// A senha nunca é enviada ao servidor e não fica armazenada no Entrelinhas.
const EL_BACKUP_ITERATIONS=310000;
function elBase64(bytes){let block=0x8000,text='';for(let i=0;i<bytes.length;i+=block){text+=String.fromCharCode(...bytes.subarray(i,i+block))}return btoa(text)}
function elUnbase64(text){if(typeof text!=='string'||text.length>50*1024*1024)throw Error('Conteúdo muito grande');const decoded=atob(text),result=new Uint8Array(decoded.length);for(let i=0;i<decoded.length;i++)result[i]=decoded.charCodeAt(i);return result}
async function elDeriveBackupKey(password,salt){const keyMaterial=await crypto.subtle.importKey('raw',new TextEncoder().encode(password),'PBKDF2',false,['deriveKey']);return crypto.subtle.deriveKey({name:'PBKDF2',salt,iterations:EL_BACKUP_ITERATIONS,hash:'SHA-256'},keyMaterial,{name:'AES-GCM',length:256},false,['encrypt','decrypt'])}
// Entrelinhas 2.8: transferência MANUAL criptografada (não é sincronização automática).
// Apenas a área privada appDataFolder da conta Google é usada; nenhuma cópia em texto puro é enviada.
const EL_TRANSFER_NAME='entrelinhas-snapshot-';
async function elTransferEnvelope(){
 if(!globalThis.crypto?.subtle||!globalThis.crypto?.getRandomValues)throw Error('Criptografia indisponível neste navegador.');
 if(elVaultLocked)throw Error('Desbloqueie a Biblioteca Privada antes de gerar a cópia.');
 if(view==='editor')saveDoc(false);
 if(view==='note'&&noteMode==='edit')saveNotePage(false);
 await storageQueue;
 if(!saved)throw Error('O salvamento local não foi confirmado. Não envie uma cópia incompleta.');
 const password=prompt('Defina a senha desta cópia criptografada (mínimo 12 caracteres). Guarde-a fora do Entrelinhas.');
 if(password===null)throw Error('Operação cancelada.');
 if(password.length<12)throw Error('A senha precisa de pelo menos 12 caracteres.');
 const repeat=prompt('Repita a senha da cópia para confirmar.');
 if(repeat!==password)throw Error('As senhas não coincidem.');
 const salt=crypto.getRandomValues(new Uint8Array(16)),iv=crypto.getRandomValues(new Uint8Array(12));
 const key=await elDeriveBackupKey(password,salt);
 const raw=new TextEncoder().encode(JSON.stringify(data));
 try{
  if(raw.byteLength>16*1024*1024)throw Error('Biblioteca acima de 16 MB. Exporte um backup local para esta transferência.');
  const cipher=new Uint8Array(await crypto.subtle.encrypt({name:'AES-GCM',iv},key,raw));
  return {format:'entrelinhas-encrypted-backup',version:1,kdf:'PBKDF2-SHA256',iterations:EL_BACKUP_ITERATIONS,cipher:'AES-256-GCM',salt:elBase64(salt),iv:elBase64(iv),payload:elBase64(cipher)};
 }finally{raw.fill(0)}
}
function elTransferScreen(){
 showDialog(`${modalHead('Transferir biblioteca com segurança')}
 <p class="mini">Envie uma <strong>cópia criptografada</strong> para a área privada de dados do Entrelinhas no Google Drive. Cada envio cria um novo arquivo; nunca substitui uma cópia anterior.</p>
 <p class="mini">É uma <strong>transferência manual</strong>, não sincronização automática. A senha é exigida na restauração e não é transmitida ao Google. Seu nome de arquivo e horário ficam visíveis ao Google.</p>
 <div class="btn-group"><button class="btn" data-action="el-transfer-upload">🔒 Criar cópia na nuvem</button><button class="btn subtle" data-action="el-transfer-list">↓ Recuperar cópia da nuvem</button></div>
 <p class="mini">Para transferir para PC ou celular: no dispositivo A crie a cópia; no B conecte a <strong>mesma conta Google</strong>, baixe o arquivo criptografado e use Ajustes → Restaurar backup. A restauração substitui a biblioteca local e exige confirmação. <strong>Antes, salve um backup do dispositivo B.</strong></p>
 <p class="mini">O acesso exige configuração OAuth Google Cloud e autorização adicional de dados privados do aplicativo (drive.appdata), além de drive.file para documentos.</p>`);
}
async function elTransferUpload(){
 if(!hasGoogle()){alert('Conecte o Google com a permissão de dados privados do aplicativo.');return}
 if(!confirm('Criar uma NOVA cópia criptografada da biblioteca na área privada do seu Google Drive? Nenhum arquivo existente será apagado.'))return;
 try{
  const envelope=await elTransferEnvelope();
  const content=JSON.stringify(envelope);
  const stamp=new Date().toISOString().replace(/[:.]/g,'-');
  const name=EL_TRANSFER_NAME+stamp+'.json';
  const boundary='el_'+Array.from(crypto.getRandomValues(new Uint8Array(12))).map(x=>x.toString(16).padStart(2,'0')).join('');
  const metadata={name,mimeType:'application/json',parents:['appDataFolder'],description:'Cópia cifrada do Entrelinhas; conteúdo protegido com senha'};
  const body='--'+boundary+'\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n'+JSON.stringify(metadata)+'\r\n--'+boundary+'\r\nContent-Type: application/json\r\n\r\n'+content+'\r\n--'+boundary+'--';
  const response=await googleApi('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,size',{method:'POST',headers:{'Content-Type':'multipart/related; boundary='+boundary},body});
  const item=await response.json();
  if(!item.id)throw Error('O Google não confirmou a criação do arquivo.');
  flash('Cópia criptografada criada na área privada do Google Drive.');
  alert('Cópia protegida criada. Guarde a senha: sem ela não será possível restaurar os dados.');
 }catch(e){alert('Não foi possível transferir: '+e.message)}
}
let elTransferFiles=[];
async function elTransferList(){
 if(!hasGoogle()){alert('Conecte sua conta Google primeiro.');return}
 showDialog(`${modalHead('Cópias criptografadas no Google Drive')}<p class="mini">Consultando dados privados do aplicativo…</p>`);
 try{
  const q=encodeURIComponent("name contains 'entrelinhas-snapshot-' and trashed = false");
  const r=await googleApi('https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&fields=nextPageToken,files(id,name,size,createdTime)&pageSize=100&orderBy=createdTime%20desc&q='+q);
  const result=await r.json();
  elTransferFiles=(result.files||[]).filter(f=>typeof f.name==='string'&&f.name.startsWith(EL_TRANSFER_NAME)&&/^[-\w.]+$/.test(f.name));
  showDialog(`${modalHead('Cópias disponíveis')}<p class="mini">Baixar uma cópia <strong>não altera</strong> seus registros. Para restaurar, use Ajustes → Restaurar backup e confirme a substituição depois de fazer backup do aparelho atual.</p>
  ${elTransferFiles.map(f=>`<div class="line row"><span class="grow"><strong>${esc(f.name.replace(EL_TRANSFER_NAME,''))}</strong><span class="mini"> · ${Math.round(Number(f.size||0)/1024)} KB</span></span><button class="btn small-btn" data-transfer-file="${esc(f.id)}">Baixar protegido</button></div>`).join('')||'<p class="mini">Nenhuma cópia encontrada nesta conta.</p>'}
  ${result.nextPageToken?'<p class="mini">Apenas as primeiras 100 cópias são exibidas.</p>':''}`);
 }catch(e){alert('Não foi possível consultar cópias: '+e.message);elTransferScreen()}
}
async function elTransferDownload(id){
 const f=elTransferFiles.find(v=>v.id===id);if(!f)return;
 if(Number(f.size||0)>24*1024*1024){alert('Arquivo muito grande.');return}
 try{
  const r=await googleApi('https://www.googleapis.com/drive/v3/files/'+encodeURIComponent(id)+'?alt=media');
  const blob=await r.blob();if(blob.size>24*1024*1024)throw Error('Cópia ultrapassa o limite de 24 MB.');
  const parsed=JSON.parse(await blob.text());
  if(parsed.format!=='entrelinhas-encrypted-backup'||parsed.version!==1||typeof parsed.payload!=='string')throw Error('Arquivo não está no formato criptografado esperado.');
  download(new Blob([JSON.stringify(parsed)],{type:'application/json'}),f.name);
  flash('Cópia criptografada baixada. Nenhum dado local foi alterado.');
 }catch(e){alert('Falha ao baixar cópia: '+e.message)}
}
async function elBackupEncrypted(){
 if(!crypto?.subtle||!crypto?.getRandomValues){alert('Este navegador não oferece criptografia para backups.');return}
 const password=prompt('Crie uma senha FORTE para o backup (mínimo 12 caracteres). Não será possível recuperar os textos deste arquivo se esquecê-la.');
 if(password===null)return;
 if(password.length<12){alert('A senha precisa ter pelo menos 12 caracteres.');return}
 const confirmPassword=prompt('Repita exatamente a senha de seu backup.');
 if(confirmPassword!==password){alert('As senhas digitadas não coincidem.');return}
 try{
  const salt=crypto.getRandomValues(new Uint8Array(16)),iv=crypto.getRandomValues(new Uint8Array(12));
  const key=await elDeriveBackupKey(password,salt),plain=new TextEncoder().encode(JSON.stringify(data));
  const ciphertext=new Uint8Array(await crypto.subtle.encrypt({name:'AES-GCM',iv},key,plain));plain.fill(0);
  const result={format:'entrelinhas-encrypted-backup',version:1,kdf:'PBKDF2-SHA256',iterations:EL_BACKUP_ITERATIONS,cipher:'AES-256-GCM',salt:elBase64(salt),iv:elBase64(iv),payload:elBase64(ciphertext)};
  download(new Blob([JSON.stringify(result)],{type:'application/json'}),`entrelinhas-protegido-${day()}.json`);
  flash('Backup protegido criado. Guarde a senha em lugar separado.');
 }catch(e){alert('Falha ao proteger o backup: '+e.message)}
}
async function elRestoreProtected(result){
 if(result.version!==1||result.kdf!=='PBKDF2-SHA256'||result.cipher!=='AES-256-GCM'||result.iterations!==EL_BACKUP_ITERATIONS)throw Error('Formato de backup criptografado não reconhecido');
 const password=prompt('Digite a senha deste backup protegido.');if(password===null)throw Error('Restauração cancelada');
 const salt=elUnbase64(result.salt),iv=elUnbase64(result.iv),cipher=elUnbase64(result.payload);
 if(salt.length!==16||iv.length!==12)throw Error('Cabeçalho de backup inválido');
 const key=await elDeriveBackupKey(password,salt);
 let plain;try{plain=new Uint8Array(await crypto.subtle.decrypt({name:'AES-GCM',iv},key,cipher))}catch(e){throw Error('Senha incorreta ou backup alterado')}
 try{return JSON.parse(new TextDecoder().decode(plain))}finally{plain.fill(0)}
}

// Biblioteca Privada: criptografia de todo o estado local; ativação voluntária com verificação de integridade.
function elVaultStore(action,entry,key='current'){
 return openDatabase().then(database=>new Promise((resolve,reject)=>{
  if(!database)return reject(Error('Este navegador não disponibiliza armazenamento protegido.'));
  try{const tx=database.transaction('vault',action==='get'?'readonly':'readwrite');
   const store=tx.objectStore('vault'),req=action==='get'?store.get(key):action==='put'?store.put(entry,key):store.delete(key);
   let result;req.onsuccess=()=>{result=req.result};req.onerror=()=>reject(req.error||Error('Falha no armazenamento privado'));
   tx.oncomplete=()=>resolve(result);tx.onerror=()=>reject(tx.error||Error('Transação do cofre falhou'));
  }catch(e){reject(e)}
 }))
}
async function elVaultWrite(plain,key){
 const iv=crypto.getRandomValues(new Uint8Array(12));
 const cipher=new Uint8Array(await crypto.subtle.encrypt({name:'AES-GCM',iv},key,new TextEncoder().encode(plain)));
 await elVaultStore('put',{format:1,iv:elBase64(iv),cipher:elBase64(cipher)});
}
async function elVaultRead(key){
 const record=await elVaultStore('get');
 if(!record||record.format!==1)throw Error('Biblioteca privada não encontrada. Não desinstale o aplicativo; restaure seu backup.');
 const iv=elUnbase64(record.iv),cipher=elUnbase64(record.cipher);
 if(iv.length!==12)throw Error('Dados do cofre inválidos');
 const bytes=new Uint8Array(await crypto.subtle.decrypt({name:'AES-GCM',iv},key,cipher));
 try{return new TextDecoder().decode(bytes)}finally{bytes.fill(0)}
}
async function elVaultDerive(password,salt){
 const material=await crypto.subtle.importKey('raw',new TextEncoder().encode(password),'PBKDF2',false,['deriveKey']);
 return crypto.subtle.deriveKey({name:'PBKDF2',salt,iterations:EL_BACKUP_ITERATIONS,hash:'SHA-256'},material,{name:'AES-GCM',length:256},false,['encrypt','decrypt'])
}
function elVaultLockScreen(){
 document.body.dataset.theme='lavanda';document.body.classList.remove('fullview');
 const nav=document.getElementById('nav');if(nav)nav.style.display='none';
 const app=document.getElementById('app');if(!app)return;
 app.innerHTML='<main style="max-width:450px;margin:12vh auto 0;padding:22px"><div class="card" style="padding:24px"><div class="brand">✒ entrelinhas</div><h1>🔒 Biblioteca bloqueada</h1><p class="sub">Digite sua senha para acessar seus manuscritos. O Entrelinhas não guarda sua senha e não pode recuperá-la.</p><form id="elVaultUnlockForm"><div class="field"><label for="elVaultPassword">Senha da Biblioteca Privada</label><input id="elVaultPassword" name="pass" type="password" autocomplete="off" minlength="12" required></div><button class="btn block" type="submit">Desbloquear biblioteca</button></form><p class="mini">Se esqueceu a senha, preserve os dados do navegador e use um backup criptografado que você consiga desbloquear.</p><p id="elVaultLockMsg" class="mini" role="status"></p></div></main>';
}
async function elVaultUnlock(pass){
 const msg=document.getElementById('elVaultLockMsg');if(msg)msg.textContent='Verificando senha…';
 try{const meta=await elVaultStore('get',null,'meta');if(!meta||meta.version!==1)throw Error('Metadados da biblioteca não encontrados');
  const salt=elUnbase64(meta.salt);if(salt.length!==16)throw Error('Salt inválido');
  const key=await elVaultDerive(pass,salt);const raw=await elVaultRead(key);
  const recovered=normalize(JSON.parse(raw));data=recovered;elVaultKey=key;elVaultLocked=false;saved=true;writeError='';
  resetUI();tab='inicio';render();el29HandleDeepLink();flash('Biblioteca Privada desbloqueada.');
 }catch(e){if(msg)msg.textContent='Não foi possível desbloquear. Verifique a senha ou o backup.';console.warn('Falha ao desbloquear biblioteca privada:',e.message)}
}
async function elVaultEnable(){
 if(elVaultActive||!crypto?.subtle){alert('Este navegador não suporta esta operação.');return}
 if(!confirm('IMPORTANTE: faça e verifique um backup criptografado antes de ativar. Depois de protegida, a biblioteca só abre com sua senha, que não pode ser recuperada. Continuar?'))return;
 const first=prompt('Crie uma senha FORTE e exclusiva para a biblioteca (mínimo 14 caracteres):');if(first===null)return;
 if(first.length<14){alert('Use pelo menos 14 caracteres.');return}
 const again=prompt('Confirme a senha da biblioteca:');if(first!==again){alert('As senhas não coincidem.');return}
 try{await storageQueue;const database=await openDatabase();if(!database)throw Error('IndexedDB indisponível');
  const existing=await readDatabase(database);if(existing&&(Number(existing.revision)||0)>Number(data.revision||0))data=normalize(existing);
  const expected=JSON.stringify(data),salt=crypto.getRandomValues(new Uint8Array(16));const key=await elVaultDerive(first,salt);
  await elVaultStore('put',{version:1,salt:elBase64(salt)},'meta');await elVaultWrite(expected,key);
  const got=await elVaultRead(key);if(got!==expected)throw Error('A verificação dos dados criptografados falhou');
  // Só sinalizamos o modo privado após validar a leitura do conteúdo integral.
  localStorage.setItem(EL_VAULT_FLAG,'1');elVaultActive=true;elVaultKey=key;elVaultLocked=false;
  localStorage.removeItem(KEY);localStorage.removeItem(LEGACY);
  await new Promise((resolve,reject)=>{const tx=database.transaction('state','readwrite');tx.objectStore('state').delete('current');tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error||Error('Falha ao remover cópia simples'))});
  saved=true;writeError='';render();flash('Biblioteca protegida. Guarde sua senha e um backup externo.');
 }catch(e){alert('A ativação não foi concluída: '+e.message+'. Não remova dados do navegador.');console.error('Ativação da biblioteca privada:',e)}
}
async function elVaultLock(){
 if(!elVaultActive||elVaultLocked)return;
 if(view==='editor')saveDoc(false);if(view==='note'&&noteMode==='edit')saveNotePage(false);
 persist(false);
 try{await storageQueue;if(!saved)throw Error('Salvamento pendente');elVaultKey=null;elVaultLocked=true;data=blank();resetUI();render()}
 catch(e){alert('Não foi possível bloquear com segurança. Faça backup antes: '+e.message)}
}
document.addEventListener('submit',event=>{if(event.target.id!=='elVaultUnlockForm')return;event.preventDefault();const pass=new FormData(event.target).get('pass');elVaultUnlock(String(pass||''))},true);

function persist(shouldRender=true){
 if(elVaultActive){
  if(elVaultLocked||!elVaultKey){saved=false;writeError='Biblioteca bloqueada';return}
  data.revision=(Number(data.revision)||0)+1;changedSinceStart=true;
  const snapshot=JSON.stringify(data),key=elVaultKey;saved=false;writeError='Criptografando alterações';
  storageQueue=storageQueue.then(async()=>{await elVaultWrite(snapshot,key);saved=true;writeError='';const state=$('#editorSave');if(state)state.textContent=displayStatus()}).catch(e=>{saved=false;writeError='Falha ao proteger alterações';console.error('Falha no cofre:',e);flash('Falha no salvamento privado. Exporte um backup protegido.',6500)});
  if(shouldRender)render();return
 }
 data.revision=(Number(data.revision)||0)+1;changedSinceStart=true;
 const snapshot=JSON.stringify(data);let localOK=false;
 try{localStorage.setItem(KEY,snapshot);localOK=true;saved=true;writeError=''}catch(e){saved=false;writeError='O armazenamento simples está cheio';console.warn('Entrelinhas localStorage:',e)}
 storageQueue=storageQueue.then(async()=>{const database=await openDatabase();if(!database){if(!localOK){saved=false;flash('Não foi possível salvar: faça backup e libere espaço.',5500)}return}await writeDatabase(database,JSON.parse(snapshot));saved=true;writeError='';const el=$('#editorSave');if(el)el.textContent=displayStatus()}).catch(e=>{console.warn('Falha no backup IndexedDB',e);if(!localOK){saved=false;writeError='Falha nos dois armazenamentos';flash('Falha no salvamento: exporte um backup agora.',6000)}});
 if(shouldRender)render()
}
function openDatabase(){if(!('indexedDB' in window))return Promise.resolve(null);if(db)return Promise.resolve(db);if(openDatabase.task)return openDatabase.task;openDatabase.task=new Promise(resolve=>{try{const req=indexedDB.open(DB_NAME,2);req.onupgradeneeded=()=>{if(!req.result.objectStoreNames.contains('state'))req.result.createObjectStore('state');if(!req.result.objectStoreNames.contains('vault'))req.result.createObjectStore('vault')};req.onsuccess=()=>{db=req.result;resolve(db)};req.onerror=()=>resolve(null);req.onblocked=()=>resolve(null)}catch(e){resolve(null)}});return openDatabase.task}
function readDatabase(database){return new Promise(resolve=>{try{const tx=database.transaction('state','readonly'),r=tx.objectStore('state').get('current');r.onsuccess=()=>resolve(r.result||null);r.onerror=()=>resolve(null)}catch(e){resolve(null)}})}
function writeDatabase(database,state){return new Promise((resolve,reject)=>{try{const tx=database.transaction('state','readwrite');tx.objectStore('state').put(state,'current');tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error||Error('Erro ao salvar'));tx.onabort=()=>reject(tx.error||Error('Gravação cancelada'))}catch(e){reject(e)}})}
async function startOfflineStorage(){if(elVaultActive){dbOpening=false;return}const database=await openDatabase();dbOpening=false;if(!database)return;const previous=await readDatabase(database);if(previous&&!changedSinceStart){try{if((Number(previous.revision)||0)>=(Number(data.revision)||0)){data=normalize(previous);render()}else await writeDatabase(database,data)}catch(e){console.warn('Não foi possível recuperar IndexedDB',e)}}else if(!previous&&!changedSinceStart){await writeDatabase(database,data)}if(changedSinceStart){/* A fila de gravação já contém as alterações mais novas. */}}

function flash(text,ms=2500){const el=$('#toast');el.textContent=text;el.className='toast visible';clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.className='',ms)}
function resetUI(){if(speechActive)stopSpeech();view='main';activeNoteId=null;documentId=null;readerNotesOpen=false;readerSelection=null}
function activity(){return new Set(data.sessions.filter(s=>Number(s.words)>0||Number(s.minutes)>0).map(s=>s.date))}
function streaks(){let ds=[...activity()].sort(),best=0,chain=0,prev='';for(const d of ds){chain=prev&&shift(prev,1)===d?chain+1:1;best=Math.max(chain,best);prev=d}const act=activity();let d=act.has(day())?day():shift(day(),-1),current=0;while(act.has(d)){current++;d=shift(d,-1)}return{current,best}}
function produced(d,p=null){return data.sessions.filter(s=>s.kind==='escrita'&&(!d||s.date===d)&&(!p||s.projectId===p)).reduce((n,s)=>n+Number(s.words||0),0)}
function minutes(d,p=null){return data.sessions.filter(s=>(!d||s.date===d)&&(!p||s.projectId===p)).reduce((n,s)=>n+Number(s.minutes||0),0)}
function numWords(html){let el=document.createElement('div');el.innerHTML=sanitize(html);let t=el.textContent.trim();return t?t.split(/\s+/u).filter(Boolean).length:0}
function projectWords(p){return Number(p.baseline||0)+produced(null,p.id)}
function pct(a,b){return b>0?Math.min(100,Math.max(0,Number(a)/Number(b)*100)):0}
function progress(a,b){return `<div class="progress"><i style="width:${pct(a,b)}%"></i></div>`}
function displayStatus(){return saved?(elVaultActive?'Protegido neste aparelho':'Salvo neste aparelho'):(elVaultActive?'Salvamento privado pendente • confira seu backup':'Salvamento pendente • confira o backup')}
function nav(){const items=[['inicio','⌂','Início'],['projetos','▣','Projetos'],['escrita','✒','Escrita'],['leitura','◫','Leitura'],['diario','✦','Diário']];$('#nav').innerHTML=items.map(([id,i,t])=>`<button data-tab="${id}" class="${tab===id?'active':''}" ${tab===id?'aria-current="page"':''}><span>${i}</span>${t}</button>`).join('');$('#nav').style.display=view==='main'?'grid':'none'}
function render(){if(elVaultActive&&elVaultLocked){elVaultLockScreen();return}document.body.dataset.theme=data.preferences.theme;document.body.style.setProperty('--accent',data.preferences.accent||palettes[data.preferences.theme].accent);document.body.classList.toggle('fullview',view!=='main');nav();if(view==='editor'){renderEditor();timerPaint();return}if(view==='reader')return renderReader();if(view==='note')return renderNotePage();let pages={inicio:home,projetos:projectsPage,escrita:writingPage,leitura:readingPage,diario:diaryPage,busca:librarySearchPage,estatisticas:statistics,ajustes:settings};$('#app').innerHTML=`<header class="top"><div class="brand">✒ entrelinhas</div><div class="head-actions"><button class="icon-btn" data-tab="busca" aria-label="Buscar em toda a biblioteca" title="Buscar">⌕</button><button class="icon-btn" data-tab="estatisticas" aria-label="Estatísticas" title="Estatísticas">▥</button><button class="icon-btn" data-action="el-ai" aria-label="Assistente de IA" title="Central de IA">✦</button><button class="icon-btn" data-tab="ajustes" aria-label="Ajustes e integrações" title="Ajustes">⚙</button></div></header><main>${(pages[tab]||home)()}</main>`}
function projectTile(p){let w=projectWords(p);return `<button class="project-item" data-project="${esc(p.id)}"><span class="cover" style="background:${esc(colors.includes(p.color)?p.color:colors[0])}"><span>✦</span>${esc(p.title.slice(0,24))}</span><span class="grow"><strong>${esc(p.title)}</strong><div class="small muted" style="margin:6px 0">${esc(p.genre||'Projeto literário')}</div>${progress(w,p.goal||0)}<div class="tiny muted" style="margin-top:7px">${nfmt(w)} de ${nfmt(p.goal||0)} palavras</div></span><span>›</span></button>`}
function documentTile(d){if(d.googleLink?.mode==='external')return elDocsTile(d);const p=project(d.projectId),w=numWords(d.html||'');return `<div class="note-card"><div class="row"><div class="grow"><button class="preview" data-edit-doc="${esc(d.id)}"><strong>${esc(d.title)}</strong><div class="small muted" style="margin-top:5px">${esc(p?.title||'Sem projeto')} · ${nfmt(w)} palavras</div><div class="tiny muted">Salvo em ${pretty((d.updatedAt||d.createdAt||'').slice(0,10))}</div></button></div><div class="btn-group"><button class="btn subtle small-btn" data-edit-doc="${esc(d.id)}">Editar</button><button class="btn small-btn" data-read-doc="${esc(d.id)}">Ler</button><a class="el29-newtab" href="${esc(el29DocumentUrl(d.id))}" target="_blank" rel="noopener noreferrer" title="Abrir este documento em outra aba">↗ Nova aba</a></div></div></div>`}
function noteTile(n){const brief=(n.fields?.resumo||n.fields?.papel||n.fields?.evento||n.body||'').trim();const count=Array.isArray(n.blocks)?n.blocks.length:0;return `<div class="note-card"><div class="row"><div class="grow"><div><span class="tag">${esc(noteTypes[n.type]||'Nota')}</span> ${n.projectId?`<span class="tiny muted">${esc(project(n.projectId)?.title||'Sem projeto')}</span>`:''}</div><button class="preview" data-open-note="${esc(n.id)}"><div style="margin:8px 0 5px"><strong>${esc(n.title||'Sem título')}</strong></div><div class="note-body">${esc(brief.slice(0,250))}${count?' · '+count+' blocos':''}</div><div class="tiny muted" style="margin-top:8px">${esc((n.tags||[]).slice(0,3).map(x=>'#'+x).join('  '))} · ${esc((n.status||'rascunho').replace(/_/g,' '))}</div></button></div><div class="el29-card-actions"><button class="btn subtle small-btn" data-open-note="${esc(n.id)}">Abrir</button><a class="el29-newtab" href="${esc(el29NoteUrl(n.id))}" target="_blank" rel="noopener noreferrer" title="Abrir esta página do Diário em outra aba">↗ Nova aba</a></div></div></div>`}
function sessionTile(s){const p=project(s.projectId);return `<div class="line row"><div class="grow"><strong>${s.kind==='revisao'?'✎ Revisão':'✍ Escrita'} · ${pretty(s.date)}</strong><div class="small muted clip">${esc(p?.title||'Sem projeto')}${s.note?' · '+esc(s.note):''}</div></div><div class="small" style="text-align:right">${s.words?nfmt(s.words)+' pal.':''}${s.minutes?`<div class="muted">${nfmt(s.minutes)} min</div>`:''}<button class="btn subtle small-btn" data-edit-session="${esc(s.id)}">Editar</button></div></div>`}
function home(){const a=activity(),st=streaks(),today=day(),week=Array.from({length:7},(_,i)=>shift(today,i-6)),w=produced(today),mins=minutes(today);return `<h1 class="headline">Sua história continua aqui.</h1><p class="sub">Cada palavra conta. Cada dia também. ✦</p><div class="card"><div class="flex"><div class="stat" style="font-size:25px">🔥</div><div class="grow"><div class="number">${st.current} ${st.current===1?'dia':'dias'}</div><div class="small muted">Sua ofensiva atual</div></div><span class="badge">Recorde: ${st.best}</span></div><div class="week">${week.map(d=>{let date=new Date(d+'T12:00:00'),yes=a.has(d);return `<div class="week-day">${['D','S','T','Q','Q','S','S'][date.getDay()]}<div class="dot ${yes?'active':''} ${d===today?'today':''}">${yes?'✓':date.getDate()}</div></div>`}).join('')}</div><p class="mini" style="text-align:center;margin-bottom:0">Escrita ou tempo de revisão mantêm sua ofensiva.</p></div>
<div class="card"><div class="row"><h2>Atividade de hoje</h2><span class="small good">${a.has(today)?'✓ Dia registrado':'○ Ainda sem registro'}</span></div><div class="grid2"><div class="stat">✍<div class="number">${nfmt(w)}</div><div class="mini">Palavras novas</div></div><div class="stat">◷<div class="number">${nfmt(mins)}</div><div class="mini">Minutos registrados</div></div></div><div class="row small" style="margin:15px 0 8px"><strong>Meta diária</strong><span class="muted">${nfmt(w)} / ${nfmt(data.preferences.dailyWordsGoal)}</span></div>${progress(w,data.preferences.dailyWordsGoal)}</div>
<div class="btn-group"><button class="btn" data-action="new-session">＋ Registrar sessão</button><button class="btn subtle" data-action="new-doc">✒ Escrever agora</button></div><h2 class="section">Meus projetos</h2>${data.projects.slice(0,2).map(projectTile).join('')||`<div class="card empty">Sua biblioteca está esperando sua primeira história. <button class="btn small-btn" data-action="new-project">Criar projeto</button></div>`}
<div class="banner"><div class="row"><div><strong>☁ Google Docs e Drive</strong><p class="mini" style="margin-bottom:0">Importe arquivos pelo celular ou configure a integração com sua conta Google.</p></div><button class="btn subtle small-btn" data-action="google-connect">${hasGoogle()?'Drive':'Conectar'}</button></div></div><div class="btn-group"><button class="btn subtle" data-action="new-note">💡 Nova ideia</button><button class="btn subtle" data-tab="leitura">📖 Ler manuscritos</button></div>${data.sessions.length?`<h2 class="section">Sessões recentes</h2><div class="card">${[...data.sessions].sort((x,y)=>y.date.localeCompare(x.date)).slice(0,3).map(sessionTile).join('')}</div>`:''}`}
function projectsPage(){if(projectId){const p=project(projectId);if(!p){projectId=null;return projectsPage()}let ds=sortedDocs(p.id),ns=entriesFor(p.id);return `<button class="btn subtle small-btn" data-action="projects-back">‹ Biblioteca</button><div class="flex" style="margin:18px 0"><div class="cover" style="width:86px;height:116px;background:${esc(colors.includes(p.color)?p.color:colors[0])}"><span>✦</span>${esc(p.title.slice(0,32))}</div><div class="grow"><h1 class="headline">${esc(p.title)}</h1><div class="small muted">${esc(p.genre||'Projeto')}</div><div class="strong" style="margin:12px 0 5px">${nfmt(projectWords(p))} palavras</div>${progress(projectWords(p),p.goal)}</div></div>${p.blurb?`<div class="card small">${esc(p.blurb)}</div>`:''}<div class="btn-group"><button class="btn" data-action="el-docs-new">✒ Capítulo no Google Docs</button><button class="btn subtle" data-action="el-docs-picker">Vincular existente</button><button class="btn subtle" data-action="new-doc">Documento local</button><button class="btn subtle" data-action="new-note">＋ Planejar</button><button class="btn subtle" data-action="export-project">⇩ Projeto ZIP</button><button class="btn subtle" data-action="project-book-menu">📚 Baixar livro</button><button class="btn subtle" data-edit-project="${esc(p.id)}">Editar</button><button class="btn subtle" data-action="new-session">＋ Sessão</button></div><h2 class="section">Manuscritos (${ds.length})</h2>${ds.map((d,i)=>`<div class="project-doc-row"><div class="grow">${documentTile(d)}</div><div class="move-doc-controls"><button class="btn subtle small-btn" data-move-doc="${esc(d.id)}" data-direction="-1" ${i===0?'disabled':''} aria-label="Mover capítulo para cima">↑</button><button class="btn subtle small-btn" data-move-doc="${esc(d.id)}" data-direction="1" ${i===ds.length-1?'disabled':''} aria-label="Mover capítulo para baixo">↓</button></div></div>`).join('')||'<div class="card empty">Adicione seu primeiro capítulo ou documento.</div>'}<h2 class="section">Planejamento (${ns.length})</h2>${ns.sort((a,b)=>(b.updatedAt||'').localeCompare(a.updatedAt||'')).slice(0,15).map(noteTile).join('')||'<div class="card empty">Crie escaletas, fichas de personagens, cenas e notas.</div>'}`}
return `<h1 class="headline">Sua biblioteca</h1><p class="sub">Organize romances, contos, fanfics e todos os seus universos.</p><button class="btn block" data-action="new-project">＋ Novo projeto</button><div style="height:17px"></div>${data.projects.map(projectTile).join('')||'<div class="card empty">Nenhum projeto ainda. Vamos criar sua primeira história?</div>'}`}
function writingPage(){const ds=[...data.documents].sort((a,b)=>(b.updatedAt||'').localeCompare(a.updatedAt||''));return `<h1 class="headline">Mesa de escrita</h1><p class="sub">Escreva no Google Docs e leia seus capítulos aqui. O editor local continua disponível.</p><div class="btn-group"><button class="btn" data-action="el-docs-new">＋ Criar no Google Docs</button><button class="btn subtle" data-action="el-docs-picker">Vincular Google Docs</button><button class="btn subtle" data-action="new-doc">＋ Documento local</button><button class="btn subtle" data-action="import-document">⇧ Importar arquivo</button></div><div class="banner" style="margin-top:13px"><strong>✒ Editor de texto</strong><p class="mini">Formatação, títulos, listas, tabelas, imagens e exportações. Salve cópias de segurança regularmente.</p></div><h2 class="section">Seus documentos (${ds.length})</h2>${ds.map(documentTile).join('')||'<div class="card empty">Você ainda não criou um documento. Toque em “Novo manuscrito” para começar.</div>'}`}
function readingPage(){let ds=[...data.documents].sort((a,b)=>(b.updatedAt||'').localeCompare(a.updatedAt||''));return `<h1 class="headline">Sua sala de leitura</h1><p class="sub">Leia como em um e-reader, com temas, fonte ajustável, destaques, notas e marcadores.</p><div class="btn-group"><button class="btn" data-action="el-docs-picker">Vincular Google Docs</button><button class="btn subtle" data-action="import-document">Importar arquivo</button><button class="btn subtle" data-tab="ajustes">☷ Preferências</button></div><div class="banner" style="margin-top:13px"><strong>📖 Biblioteca de leitura</strong><p class="mini">Seus manuscritos também podem ser lidos aqui. DOCX, EPUB, TXT e HTML são importados para uma cópia local simplificada.</p></div>${ds.map(d=>`<div class="note-card"><div class="row"><div class="grow"><strong>${esc(d.title)}</strong><div class="small muted">${d.googleLink?.mode==='external'?(d.googleLink.lastWords||0)+' palavras · Google Docs':nfmt(numWords(d.html))+' palavras'} · ${Math.round((d.readingProgress||0)*100)}% lido · ${annotationsFor(d.id).length} marcações</div>${progress((d.readingProgress||0)*100,100)}</div><button class="btn small-btn" data-read-doc="${esc(d.id)}">Ler</button></div></div>`).join('')||'<div class="card empty">Sua estante está vazia. Importe um texto ou crie um manuscrito para começar.</div>'}`}
function diaryPage(){const types=Object.entries(noteTypes), selected=noteFilter==='todos'?null:noteFilter;let ns=[...data.notes].filter(n=>(!selected||n.type===selected)&&(!diaryQuery||[n.title,n.body,project(n.projectId)?.title,...Object.values(n.fields||{}),...(n.tags||[])].join(' ').toLocaleLowerCase('pt-BR').includes(diaryQuery.toLocaleLowerCase('pt-BR'))));if(diarySort==='alfabetica')ns.sort((a,b)=>a.title.localeCompare(b.title,'pt-BR'));else if(diarySort==='cronologica')ns.sort((a,b)=>(a.fields?.quando||a.date||'').localeCompare(b.fields?.quando||b.date||''));else ns.sort((a,b)=>(b.updatedAt||'').localeCompare(a.updatedAt||''));const title=selected?noteTypes[selected]:'Diário & planejamento';const counters=types.map(([key,label])=>`<button class="diary-category ${noteFilter===key?'selected':''}" data-filter="${key}"><span>${esc(label)}</span><small>${data.notes.filter(n=>n.type===key).length}</small></button>`).join('');return `<h1 class="headline">${esc(title)}</h1><p class="sub">${selected?'Organize, consulte e desenvolva suas páginas de '+esc(title.toLocaleLowerCase('pt-BR'))+'.':'Um lugar para guardar ideias, fichas, escaletas, cenas, mundos, pesquisas e sua evolução criativa.'}</p><div class="diary-categories"><button class="diary-category ${noteFilter==='todos'?'selected':''}" data-filter="todos"><span>✦ Tudo</span><small>${data.notes.length}</small></button>${counters}</div><button class="btn block" data-action="new-note">＋ ${selected?'Novo registro de '+esc(title.toLocaleLowerCase('pt-BR')):'Nova página de planejamento'}</button><div class="field"><label for="noteSearch">Pesquisar nesta biblioteca</label><input id="noteSearch" placeholder="Título, personagem, palavra-chave…" value="${esc(diaryQuery)}"></div><div class="row" style="margin:12px 0"><strong class="grow">${ns.length} página(s)</strong><label class="tiny muted" for="diarySort">Ordenar</label><select id="diarySort" class="diary-sort"><option value="recentes" ${diarySort==='recentes'?'selected':''}>Recentes</option><option value="alfabetica" ${diarySort==='alfabetica'?'selected':''}>A–Z</option><option value="cronologica" ${diarySort==='cronologica'?'selected':''}>Cronologia</option></select></div><div id="noteResults">${ns.map(noteTile).join('')||'<div class="card empty">Nenhuma página aqui ainda. Crie a primeira acima.</div>'}</div>`}
function statistics(){let st=streaks(),days=Array.from({length:7},(_,i)=>shift(day(),i-6)),vals=days.map(x=>produced(x)),max=Math.max(1,...vals),a=activity(),[y,m]=month.split('-').map(Number),offset=new Date(y,m-1,1).getDay(),count=new Date(y,m,0).getDate(),cells=[];for(let i=0;i<offset;i++)cells.push('<span></span>');for(let j=1;j<=count;j++){let d=`${month}-${String(j).padStart(2,'0')}`;cells.push(`<span class="${a.has(d)?'on':''}">${j}</span>`)}let label=new Date(y,m-1,1).toLocaleDateString('pt-BR',{month:'long',year:'numeric'});return `<h1 class="headline">Sua evolução</h1><p class="sub">Acompanhe suas conquistas sem perder de vista cada pequeno avanço.</p><div class="grid2"><div class="card"><div class="number">${nfmt(produced(null))}</div><div class="small muted">Palavras produzidas</div></div><div class="card"><div class="number">${nfmt(minutes(null))}</div><div class="small muted">Minutos registrados</div></div><div class="card"><div class="number">${st.best}</div><div class="small muted">Maior ofensiva</div></div><div class="card"><div class="number">${data.sessions.length}</div><div class="small muted">Sessões registradas</div></div></div><div class="card"><h2>Palavras por dia • últimos 7 dias</h2><div class="bar-chart">${vals.map((n,i)=>`<div style="flex:1;text-align:center;font-size:10px;color:var(--muted)"><div>${n||'·'}</div><div style="height:100px;display:flex;align-items:end;background:var(--soft);border-radius:7px"><div class="bar" style="height:${pct(n,max)}%"></div></div><div style="margin-top:4px">${['D','S','T','Q','Q','S','S'][new Date(days[i]+'T12:00:00').getDay()]}</div></div>`).join('')}</div></div><div class="card"><div class="row"><h2>Calendário de atividade</h2><button class="btn subtle small-btn" data-action="month-today">Hoje</button></div><div class="row" style="margin:12px 0"><button class="btn subtle small-btn" data-action="month-prev">‹</button><strong>${label}</strong><button class="btn subtle small-btn" data-action="month-next">›</button></div><div class="cal">${['D','S','T','Q','Q','S','S'].map(d=>`<strong>${d}</strong>`).join('')}${cells.join('')}</div></div><h2 class="section">Histórico de sessões</h2><div class="card">${[...data.sessions].sort((a,b)=>b.date.localeCompare(a.date)).map(sessionTile).join('')||'<div class="empty">Seus registros aparecerão aqui.</div>'}</div>`}
function settings(){const theme=data.preferences.theme;return `<h1 class="headline">Seu Entrelinhas</h1><p class="sub">Personalização, leitura, dados locais e integração com Google.</p><div class="card"><h2>🔒 Biblioteca Privada (experimental)</h2><p class="mini">${elVaultActive?'O armazenamento privado está ativado nesta instalação. Faça backups criptografados regularmente.':'Ative voluntariamente a criptografia local de seus documentos com uma senha forte. Antes, exporte um backup protegido por senha e verifique que consegue restaurá-lo.'}</p><div class="btn-group">${elVaultActive?'<button class="btn" data-action="vault-lock">Bloquear agora</button>':'<button class="btn" data-action="vault-enable">Ativar Biblioteca Privada</button>'}</div><p class="tiny muted">A senha não é recuperável. A criptografia protege os dados armazenados, mas não protege contra código malicioso enquanto a biblioteca estiver desbloqueada. Dados previamente gravados podem permanecer em cópias externas ou backups do navegador.</p></div><div class="banner"><strong>🔐 Segurança em desenvolvimento</strong><p class="mini">Sem Biblioteca Privada ativada, os textos são armazenados sem criptografia própria no navegador. Use o backup protegido por senha e não conecte contas principais até a revisão de segurança ficar completa. A integração Google possui escopo limitado a arquivos autorizados, mas ainda não foi validada em produção.</p></div><div class="card"><h2>🎨 Aparência</h2><div class="grid3">${Object.entries(palettes).map(([k,v])=>`<button class="preview" style="text-align:center" data-theme-pick="${k}"><div class="theme-preview" style="background:${v.bg};outline:${theme===k?'3px solid var(--accent)':'none'};outline-offset:2px"><span style="background:${v.card};border-top:5px solid ${v.accent}"></span></div><div class="small" style="margin-top:8px">${{lavanda:'Lavanda',noturno:'Noturno',papel:'Papel antigo'}[k]}</div></button>`).join('')}</div><div class="field"><label>Cor de destaque</label><div class="swatches">${['#9064AE','#C26D9A','#588DB6','#568C80','#C68053','#B8A35F'].map(c=>`<button class="swatch" style="background:${c}" data-accent="${c}" aria-label="Cor ${c}"></button>`).join('')}<button class="btn subtle small-btn" data-action="reset-accent">Padrão</button></div></div><form id="goalForm"><div class="field"><label>Meta diária de palavras</label><input name="goal" type="number" min="1" max="10000000" required value="${data.preferences.dailyWordsGoal}"></div><button class="btn small-btn">Salvar meta</button></form></div>
<div class="card"><h2>📖 Modo de leitura</h2><div class="field"><label>Tema da página</label><select data-reader-pref="readerTheme"><option value="reader-sepia" ${data.preferences.readerTheme==='reader-sepia'?'selected':''}>Sépia</option><option value="reader-white" ${data.preferences.readerTheme==='reader-white'?'selected':''}>Branco</option><option value="reader-night" ${data.preferences.readerTheme==='reader-night'?'selected':''}>Noturno</option></select></div><div class="field"><label>Fonte</label><select data-reader-pref="readerFont"><option value="Georgia,serif" ${data.preferences.readerFont==='Georgia,serif'?'selected':''}>Clássica (Georgia)</option><option value="Arial,sans-serif" ${data.preferences.readerFont==='Arial,sans-serif'?'selected':''}>Sem serifa (Arial)</option></select></div><div class="field"><label>Tamanho da letra</label><input data-reader-pref="readerFontSize" type="range" min="14" max="32" step="1" value="${data.preferences.readerFontSize}"></div><div class="field"><label>Entrelinhas</label><input data-reader-pref="readerLineHeight" type="range" min="1.3" max="2.5" step="0.1" value="${data.preferences.readerLineHeight}"></div><div class="field"><label>Velocidade de leitura em voz alta</label><select data-reader-pref="readerSpeechRate">${[.75,1,1.25,1.5].map(v=>`<option value="${v}" ${Number(data.preferences.readerSpeechRate||1)===v?'selected':''}>${v}×</option>`).join('')}</select></div><div class="field"><label>Rolar ou páginas</label><select data-reader-pref="readerMode"><option value="continuous" ${data.preferences.readerMode==='continuous'?'selected':''}>Rolagem contínua</option><option value="paged" ${data.preferences.readerMode==='paged'?'selected':''}>Páginas (experimental)</option></select></div></div>
<div class="card"><h2>☁ Google Docs e Drive</h2><p class="mini">A conexão usa OAuth quando você informar um ID de cliente Google e abrir o aplicativo em HTTPS autorizado. A sincronização automática está disponível para documentos simples criados pelo Entrelinhas, após OAuth configurado e autorização. Ainda não foi validada com conta real; documentos com formatação complexa exigem tratamento manual. Abrir este HTML como arquivo no celular não permite OAuth.</p><div class="row"><span class="badge">${hasGoogle()?'✓ Autorizado nesta sessão':'Não conectado'}</span><button class="btn small-btn" data-action="google-connect">${hasGoogle()?'Abrir meus arquivos':'Conectar Google'}</button><button class="btn subtle small-btn" data-action="el-google-disconnect" ${hasGoogle()?'':'disabled'}>Desconectar sessão</button></div><form id="googleConfigForm"><div class="field"><label>ID do cliente OAuth para aplicativo Web (Google Cloud)</label><input name="clientId" value="${esc(data.preferences.oauthClientId||'')}" placeholder="123...apps.googleusercontent.com" autocomplete="off"></div><button class="btn subtle small-btn">Salvar configuração</button></form><div class="btn-group" style="margin-top:10px"><button class="btn subtle small-btn" data-action="import-document">Escolher arquivo do Drive/celular</button><button class="btn subtle small-btn" data-action="google-help">Instruções</button></div><div class="field" style="margin-top:12px"><label>Chave pública restrita da API Google Picker</label><input id="elDocsPickerKey" value="${esc(data.preferences.googlePickerKey||'')}" placeholder="AIza..." autocomplete="off" spellcheck="false"></div><div class="field"><label>Número do projeto Google Cloud</label><input id="elDocsProjectNumber" value="${esc(data.preferences.googleProjectNumber||'')}" placeholder="Ex.: 123456789012" inputmode="numeric"></div><div class="btn-group"><button class="btn" data-action="el-docs-save-config">Salvar configuração do seletor</button><button class="btn subtle" data-action="el-docs-picker">Selecionar Google Docs</button></div><p class="mini">A chave do Picker precisa estar restrita ao domínio do Entrelinhas e à API Google Picker. Não coloque segredos de servidor aqui.</p><p class="mini">Para acessar documentos existentes, o Google precisa autorizar a leitura. Use Google Picker para vincular arquivos existentes; o modo Docs como original não altera seus arquivos pela leitura. A sincronização antiga de texto simples continua separada. Edições simultâneas são bloqueadas até você decidir qual versão manter.</p></div>
<div class="card"><h2>🔒 Transferência entre celular e PC (experimental)</h2><p class="mini">Crie e baixe cópias criptografadas usando a área privada do Google Drive. Somente com sua confirmação; ainda não há sincronização automática nem resolução de conflitos entre aparelhos.</p><button class="btn block" data-action="el-transfer-menu">Gerenciar cópias criptografadas</button></div>
<div class="card"><h2>🔎 Preparação para instalar e conectar Google</h2><p class="mini">Veja a origem exata deste site, status de armazenamento e requisitos pendentes antes de usar seus manuscritos na nuvem.</p><button class="btn block" data-action="deploy-check">Verificar meu Entrelinhas</button></div><div class="card"><h2>💻📱 Instalar no computador ou celular</h2><p class="mini">Instalável como aplicativo web (PWA) quando publicado em HTTPS. Pode funcionar offline após o primeiro acesso, desde que o cache seja instalado corretamente.</p><button class="btn" data-action="install-app">Instalar / Como instalar</button></div><div class="card"><h2>🛟 Backups e segurança</h2><p class="mini">Documentos são salvos automaticamente e há versões de recuperação aproximadamente a cada 10 minutos de edição. Isso não substitui um backup externo. Dados salvos no armazenamento deste navegador, neste aparelho. Apagar dados do navegador ou trocar o arquivo de localização pode perdê-los. Exporte backups com frequência.</p><div class="btn-group"><button class="btn" data-action="backup-encrypted">🔒 Backup protegido por senha</button><button class="btn subtle" data-action="backup">↓ Backup SEM criptografia</button><button class="btn subtle" data-action="restore">↑ Restaurar backup</button><button class="btn subtle" data-action="import-project">↑ Importar projeto ZIP</button><button class="btn subtle" data-action="share-backup">↗ Compartilhar backup</button><button class="btn subtle" data-action="trash-panel">🗑 Lixeira (${(data.trash||[]).length})</button><button class="btn subtle" data-action="storage-panel">▣ Saúde do armazenamento</button></div><p class="mini">${displayStatus()} · ${data.projects.length} projetos, ${data.documents.length} documentos, ${data.notes.length} notas</p></div>`}
// Higienização de HTML em importação, colagem e leitura.
function sanitize(html){
 if(String(html||'').length>8*1024*1024)throw Error('Conteúdo HTML acima do limite permitido');
 const parser=new DOMParser();
 const allow=new Set(['P','BR','DIV','SPAN','B','STRONG','I','EM','U','S','DEL','H1','H2','H3','H4','H5','H6','UL','OL','LI','BLOCKQUOTE','PRE','CODE','HR','A','IMG','TABLE','TBODY','THEAD','TR','TH','TD','SUP','SUB','FONT']);
 // Uma única leitura isolada. O navegador nunca recebe HTML importado diretamente em uma área ativa.
 // Evita HTML ativo e reintroduz apenas atributos seguros a partir do DOM original.
const fresh=parser.parseFromString(`<div id="clean-source">${String(html||'')}</div>`,'text/html').getElementById('clean-source');function cleanNode(node){if(node.nodeType===Node.TEXT_NODE)return document.createTextNode(node.textContent||'');if(node.nodeType!==Node.ELEMENT_NODE)return document.createDocumentFragment();const name=node.tagName;if(['SCRIPT','STYLE','IFRAME','OBJECT','EMBED','SVG','FORM','INPUT','VIDEO','AUDIO','META','LINK','BUTTON'].includes(name))return document.createDocumentFragment();if(!allow.has(name)){const frag=document.createDocumentFragment();for(const child of [...node.childNodes])frag.appendChild(cleanNode(child));return frag}const out=document.createElement(name.toLowerCase());if(name==='HR'&&node.getAttribute('data-el-break')==='page'){out.setAttribute('data-el-break','page')}if(name==='IMG'){const src=node.getAttribute('src')||'';if(/^data:image\/(png|jpeg|webp|gif);base64,[a-zA-Z0-9+/=]+$/i.test(src)&&src.length<=6*1024*1024)out.setAttribute('src',src);else return document.createTextNode('[Imagem externa ou muito grande removida por segurança]');out.setAttribute('alt',(node.getAttribute('alt')||'Imagem').slice(0,150));const w=(node.style.width||node.getAttribute('data-width')||'');if(/^([2-9]\d|100)%$/.test(w))out.style.width=w;if(node.getAttribute('width'))out.style.maxWidth='100%'}if(name==='FONT'){const face=node.getAttribute('face')||'';const n=Number(node.getAttribute('size'));if(Object.keys(WRITING_FONTS).some(x=>x.replaceAll('\"','').split(',')[0]===face))out.style.fontFamily=face;if(Number.isInteger(n)&&n>=1&&n<=7)out.style.fontSize=[10,13,16,18,24,32,42][n-1]+'px'}if(name==='A'){const href=node.getAttribute('href')||'';if(/^https?:\/\//i.test(href)){try{const u=new URL(href);if(!u.username&&!u.password&&['https:','http:'].includes(u.protocol)){out.setAttribute('href',u.href);out.setAttribute('target','_blank');out.setAttribute('rel','noopener noreferrer')}}catch(_){}}else if(/^mailto:[^\s<>]+$/i.test(href)){out.setAttribute('href',href)}}const style=node.getAttribute('style')||'';for(const bit of style.split(';')){let [k,...v]=bit.split(':'),value=v.join(':').trim();k=(k||'').trim().toLowerCase();if(!value)continue;if(['color','background-color'].includes(k)&&/^(#[0-9a-f]{3,8}|rgb\([\d\s,.%]+\)|[a-z]{3,16})$/i.test(value))out.style[k==='color'?'color':'backgroundColor']=value;if(k==='text-align'&&['left','right','center','justify'].includes(value))out.style.textAlign=value;if(name==='IMG'&&k==='float'&&['left','right','none'].includes(value))out.style.float=value;if(name==='IMG'&&k==='margin'&&['0px 12px 12px 0px','0px 0px 12px 12px','12px auto','0px auto'].includes(value))out.style.margin=value;if(k==='font-family'&&Object.keys(WRITING_FONTS).some(font=>font.toLowerCase()===value.toLowerCase()||font.replaceAll('\"','').split(',')[0].toLowerCase()===value.toLowerCase()))out.style.fontFamily=value;if(k==='font-size'&&/^\d{1,2}px$/.test(value)&&Number.parseInt(value)>=10&&Number.parseInt(value)<=72)out.style.fontSize=value;if(k==='line-height'&&/^([1-2](\.\d{1,2})?)$/.test(value)&&Number(value)>=1&&Number(value)<=2.8)out.style.lineHeight=value}for(const child of [...node.childNodes])out.appendChild(cleanNode(child));return out}const out=document.createElement('div');for(const child of [...fresh.childNodes])out.appendChild(cleanNode(child));return out.innerHTML}
function snapshotDocument(d,reason='Versão manual'){
 if(!d)return false;
 if(!Array.isArray(d.versions))d.versions=[];
 const latest=d.versions[d.versions.length-1];
 if(latest&&latest.html===d.html&&latest.title===d.title)return false;
 d.versions.push({id:uid(),time:now(),reason,title:d.title,html:d.html});
 if(d.versions.length>25)d.versions=d.versions.slice(-25);
 return true;
}
function versionsPanel(){
 const d=doc(documentId);if(!d)return;
 showDialog(`${modalHead('Histórico de versões')}<p class="mini">Salve pontos de recuperação antes de mudanças grandes. Até 25 versões por manuscrito, armazenadas neste aparelho e incluídas no backup.</p><button class="btn block" data-action="snapshot-doc">＋ Criar versão agora</button><div class="note-list-scroll" style="margin-top:12px">${(d.versions||[]).slice().reverse().map(v=>`<div class="line row"><div class="grow"><strong>${esc(v.reason||'Versão')}</strong><div class="tiny muted">${esc(new Date(v.time).toLocaleString('pt-BR'))} · ${nfmt(numWords(v.html))} palavras</div></div><button class="btn subtle small-btn" data-restore-version="${esc(v.id)}">Restaurar</button></div>`).join('')||'<div class="empty">Ainda não há versões salvas.</div>'}</div>`);
}
function timerMillis(){return timerElapsedMs+(timerRunningAt?Date.now()-timerRunningAt:0)}
function timerPaint(){const el=$('#timerClock'),btn=$('[data-action="timer-toggle"]'),finish=$('[data-action="timer-finish"]');if(!el)return;let secs=Math.floor(timerMillis()/1000);el.textContent=`${String(Math.floor(secs/3600)).padStart(2,'0')}:${String(Math.floor(secs%3600/60)).padStart(2,'0')}:${String(secs%60).padStart(2,'0')}`;if(btn)btn.textContent=timerRunningAt?'Ⅱ Pausar':timerMillis()>0?'▶ Retomar':'▶ Iniciar';if(finish)finish.disabled=timerMillis()<10000}
function timerPause(){if(timerRunningAt){timerElapsedMs+=Date.now()-timerRunningAt;timerRunningAt=0}clearInterval(timerHandle);timerHandle=null;timerPaint()}
function timerToggle(){if(timerDocumentId&&timerDocumentId!==documentId){timerPause();timerElapsedMs=0}timerDocumentId=documentId;if(timerRunningAt)timerPause();else{timerRunningAt=Date.now();timerHandle=setInterval(timerPaint,1000)}timerPaint()}
function timerFinish(){timerPause();const mins=Math.max(1,Math.ceil(timerElapsedMs/60000));if(!timerElapsedMs)return;timerElapsedMs=0;timerDocumentId=null;timerPaint();const current=doc(documentId);sessionForm(null,{minutes:mins,projectId:current?.projectId||null,note:`Tempo contado no editor: ${mins} min`});}
function setupDoc(d){if(d?.googleLink?.mode==='external'){elDocsEdit(d.id);return}if(timerDocumentId&&timerDocumentId!==d.id)timerPause();documentId=d.id;view='editor';render();setTimeout(()=>$('#writingArea')?.focus(),100)}
function createDocument(title,pid,type='capitulo',html=''){const d={id:uid(),projectId:pid||null,position:data.documents.filter(x=>x.projectId===(pid||null)).length,title:String(title||'Sem título').trim().slice(0,150),kind:type,html:sanitize(html),createdAt:now(),updatedAt:now(),readingProgress:0,googleDocId:null};data.documents.push(d);persist(false);return d}
function saveDoc(announce=false){if(view!=='editor'||!documentId)return;clearTimeout(editorTimer);let d=doc(documentId),area=$('#writingArea'),title=$('#docTitle');if(!d||!area)return;let raw=sanitize(area.innerHTML);if(raw!==d.html||title?.value!==d.title){if(d.html&&Date.now()-(Number(d.lastAutoSnapshotAt)||0)>=10*60*1000){if(snapshotDocument(d,'Recuperação automática'))d.lastAutoSnapshotAt=Date.now()}d.html=raw;d.title=title?.value.trim().slice(0,150)||'Sem título';d.updatedAt=now();persist(false);if(d.googleLink?.mode==='sync')scheduleGoogleSync(d.id)}let status=$('#editorSave');if(status)status.textContent=displayStatus();let word=$('#editorWords');if(word)word.textContent=`${nfmt(numWords(d.html))} palavras`;if(announce)flash(saved?'Documento salvo neste aparelho.':'Falha ao salvar!')}

const WRITING_FONTS={
 'Georgia,serif':'Georgia',
 'Arial,sans-serif':'Arial',
 'Verdana,sans-serif':'Verdana',
 'Tahoma,sans-serif':'Tahoma',
 '"Times New Roman",serif':'Times New Roman',
 '"Trebuchet MS",sans-serif':'Trebuchet MS',
 '"Courier New",monospace':'Courier New',
 'system-ui,sans-serif':'Sistema',
 '"Literata",serif':'Literata · livros',
 '"Lora",serif':'Lora · romances',
 '"Merriweather",serif':'Merriweather',
 '"Libre Baskerville",serif':'Libre Baskerville',
 '"Cormorant Garamond",serif':'Cormorant Garamond',
 '"EB Garamond",serif':'EB Garamond',
 '"Crimson Pro",serif':'Crimson Pro',
 '"Bitter",serif':'Bitter',
 '"Spectral",serif':'Spectral',
 '"Alegreya",serif':'Alegreya',
 '"DM Serif Text",serif':'DM Serif Text',
 '"Playfair Display",serif':'Playfair Display',
 '"Noto Serif",serif':'Noto Serif',
 '"Noto Serif Display",serif':'Noto Serif Display',
 '"Source Serif 4",serif':'Source Serif 4',
 '"PT Serif",serif':'PT Serif',
 '"Roboto Slab",serif':'Roboto Slab',
 '"Montserrat",sans-serif':'Montserrat',
 '"Inter",sans-serif':'Inter',
 '"Nunito",sans-serif':'Nunito',
 '"Poppins",sans-serif':'Poppins',
 '"Open Sans",sans-serif':'Open Sans',
 '"Source Sans 3",sans-serif':'Source Sans 3',
 '"Roboto",sans-serif':'Roboto',
 '"Work Sans",sans-serif':'Work Sans',
 '"Raleway",sans-serif':'Raleway',
 '"Quicksand",sans-serif':'Quicksand',
 '"Manrope",sans-serif':'Manrope',
 '"Josefin Sans",sans-serif':'Josefin Sans',
 '"Fira Code",monospace':'Fira Code',
 '"JetBrains Mono",monospace':'JetBrains Mono',
};

/* Fontes Google opcionais: nenhum manuscrito nem conteúdo de texto entra na URL.
   O navegador consulta Google Fonts apenas após seleção explícita da família. */
const el24FontLoaded=new Set();
function el24FontFamily(css){return String(css||'').match(/^"([^"]+)",(?:serif|sans-serif|monospace)$/)?.[1]||''}
function el24LoadFont(css){
 const family=el24FontFamily(css);if(!family||!WRITING_FONTS[css]||el24FontLoaded.has(family))return;
 if(!navigator.onLine){flash('Fonte disponível quando houver internet. Usando substituta local por enquanto.');return}
 const link=document.createElement('link');link.rel='stylesheet';link.referrerPolicy='no-referrer';
 link.href='https://fonts.googleapis.com/css2?family='+encodeURIComponent(family).replace(/%20/g,'+')+':wght@400;500;600;700&display=swap';
 link.onerror=()=>flash('Não foi possível carregar a fonte. O texto continua salvo.');
 document.head.append(link);el24FontLoaded.add(family)
}
function el24RestoreFonts(){
 const current=view==='editor'?doc(documentId):view==='note'?noteById(activeNoteId):null;
 const font=current?.typography?.font;if(font)el24LoadFont(font)
}

function normalizedType(t){
 const a=t&&typeof t==='object'?t:{};
 return {font:WRITING_FONTS[a.font]?a.font:'Georgia,serif',size:Math.max(12,Math.min(42,Math.round(Number(a.size)||18))),line:Math.max(1.1,Math.min(2.8,Number(a.line)||1.7)),align:['left','center','right','justify'].includes(a.align)?a.align:'left'};
}
function fontOptions(current){return Object.entries(WRITING_FONTS).map(([v,n])=>`<option value="${esc(v)}" ${v===current?'selected':''}>${esc(n)}</option>`).join('')}
function typeControls(item,scope){const t=normalizedType(item?.typography);return `<div class="typo-controls" aria-label="Tipografia da ${scope==='doc'?'escrita':'anotação'}"><label>Fonte <select data-type-pref="font" data-type-scope="${scope}" aria-label="Fonte">${fontOptions(t.font)}</select></label><label>Tamanho <input type="number" min="12" max="42" step="1" data-type-pref="size" data-type-scope="${scope}" value="${t.size}" aria-label="Tamanho da fonte em pixels"></label><label>Linhas <select data-type-pref="line" data-type-scope="${scope}" aria-label="Espaçamento entre linhas">${[1.2,1.4,1.6,1.7,1.8,2,2.2,2.5].map(v=>`<option value="${v}" ${v===t.line?'selected':''}>${v.toFixed(1)}×</option>`).join('')}</select></label><label>Alinhamento <select data-type-pref="align" data-type-scope="${scope}" aria-label="Alinhamento"><option value="left" ${t.align==='left'?'selected':''}>Esquerda</option><option value="center" ${t.align==='center'?'selected':''}>Centro</option><option value="right" ${t.align==='right'?'selected':''}>Direita</option><option value="justify" ${t.align==='justify'?'selected':''}>Justificado</option></select></label><button type="button" class="tool" data-action="apply-selection-typography" title="Aplicar a fonte e o tamanho ao trecho selecionado">Aplicar à seleção</button></div>`}
function typeStyle(item){const t=normalizedType(item?.typography);return `font-family:${t.font};font-size:${t.size}px;line-height:${t.line};text-align:${t.align}`}
function typeItem(scope){return scope==='doc'?doc(documentId):noteById(activeNoteId)}
function refreshTypeStyle(scope){const el=$(scope==='doc'?'#writingArea':'#notePageBody');const item=typeItem(scope);if(el&&item)el.setAttribute('style',typeStyle(item)+';'+elPageCSS(item));if(scope==='note'&&item)document.querySelectorAll('[data-note-extra]').forEach(field=>field.setAttribute('style',typeStyle(item)))}
function setTypePref(el){const scope=el.dataset.typeScope;const item=typeItem(scope);if(!item)return;const key=el.dataset.typePref;if(!['font','size','line','align'].includes(key))return;item.typography=normalizedType({...item.typography,[key]:el.value});el.value=item.typography[key];if(key==='font')el24LoadFont(item.typography.font);refreshTypeStyle(scope);item.updatedAt=now();persist(false);const st=$(scope==='doc'?'#editorSave':'#noteSaveState');if(st)st.textContent='Tipografia salva';}
let savedTextRange=null,savedTextScope=null;
function restoreSelectionFor(scope){const area=$(scope==='doc'?'#writingArea':'#notePageBody');if(!area||!savedTextRange||savedTextScope!==scope)return false;try{if(!area.contains(savedTextRange.commonAncestorContainer))return false;const selection=window.getSelection();selection.removeAllRanges();selection.addRange(savedTextRange.cloneRange());return !selection.isCollapsed}catch(e){return false}}
function applySelectedType(){const scope=view==='editor'?'doc':view==='note'&&noteMode==='edit'?'note':null;if(!scope)return;const area=$(scope==='doc'?'#writingArea':'#notePageBody');if(!area||!restoreSelectionFor(scope)){flash('Selecione primeiro um trecho de texto para formatar.');return}const item=typeItem(scope),t=normalizedType(item?.typography);area.focus();restoreSelectionFor(scope);document.execCommand('fontName',false,t.font.replaceAll('"','').split(',')[0]);document.execCommand('fontSize',false,'7');
 // O comando de tamanho gera tags FONT; convertemos para spans seguros antes de salvar.
 for(const f of area.querySelectorAll('font[size="7"]')){const span=document.createElement('span');span.style.fontSize=t.size+'px';if(f.getAttribute('face'))span.style.fontFamily=f.getAttribute('face');while(f.firstChild)span.appendChild(f.firstChild);f.replaceWith(span)}
 if(scope==='doc')saveDoc(false);else saveNotePage(false);flash('Formatação aplicada ao trecho selecionado.');}


/* Entrelinhas 1.4 — layout de página, réguas e modelos locais; sem credenciais externas. */
const EL_PAGE_DEFAULT={paper:'a4',unit:'mm',top:22,right:22,bottom:22,left:25,first:12.5,paragraph:0,after:4};
function elPage(x){const q={...EL_PAGE_DEFAULT,...(x?.pageLayout||{})};for(const k of ['top','right','bottom','left','first','paragraph','after'])q[k]=Math.max(k==='first'?-15:0,Math.min(65,Number(q[k])||0));q.paper=['a4','a5','letter','screen'].includes(q.paper)?q.paper:'a4';return q}
function elMm(v){return (Number(v)||0)*3.7795275591}
function elPageWidthMm(p){return p.paper==='a5'?148:p.paper==='letter'?216:210}
function elPageCSS(item){const p=elPage(item),w=elPageWidthMm(p),rel=(v)=>(Number(v)*100/w).toFixed(3)+'%';return `--el-top:${elMm(p.top).toFixed(2)}px;--el-right:${elMm(p.right).toFixed(2)}px;--el-bottom:${elMm(p.bottom).toFixed(2)}px;--el-left:${elMm(p.left).toFixed(2)}px;--el-first:${elMm(p.first).toFixed(2)}px;--el-paragraph:${elMm(p.paragraph).toFixed(2)}px;--el-after:${elMm(p.after).toFixed(2)}px;--el-top-responsive:${rel(p.top)};--el-right-responsive:${rel(p.right)};--el-bottom-responsive:${rel(p.bottom)};--el-left-responsive:${rel(p.left)};--el-first-responsive:${rel(p.first)};--el-paragraph-responsive:${rel(p.paragraph)};--el-after-responsive:${rel(p.after)};--el-paper-width:${p.paper==='a5'?'148mm':p.paper==='letter'?'216mm':p.paper==='screen'?'100%':'210mm'}`}

function elPageTarget(){return view==='editor'?doc(documentId):view==='note'?noteById(activeNoteId):null}
function elApplyPage(){const x=elPageTarget();const area=document.getElementById(view==='editor'?'writingArea':'notePageBody');if(area&&x){area.style.cssText=(view==='editor'?typeStyle(x):typeStyle(x))+';'+elPageCSS(x);area.classList.add('el-paper-page')}}
function elRulerMarkup(item){const p=elPage(item);return `<div class="el-ruler-wrap"><span class="el-ruler-label">Réguas · arraste os marcadores ou informe medidas</span><div class="el-ruler" id="elRuler"><span class="el-ruler-scale">0 &nbsp;&nbsp; 1 &nbsp;&nbsp; 2 &nbsp;&nbsp; 3 &nbsp;&nbsp; 4 &nbsp;&nbsp; 5 &nbsp;&nbsp; 6 &nbsp;&nbsp; 7 &nbsp;&nbsp; 8 &nbsp;&nbsp; 9 &nbsp;&nbsp; 10</span><button class="el-ruler-thumb" style="left:${Math.max(4,Math.min(91,p.left/elPageWidthMm(p)*100))}%" data-el-drag="left" title="Margem esquerda" aria-label="Arrastar margem esquerda">◀</button><button class="el-ruler-thumb" style="left:${Math.max(4,Math.min(91,(p.left+p.first)/elPageWidthMm(p)*100))}%" data-el-drag="first" title="Recuo da primeira linha" aria-label="Arrastar recuo da primeira linha">▼</button><button class="el-ruler-thumb" style="left:${Math.max(4,Math.min(91,100-p.right/elPageWidthMm(p)*100))}%" data-el-drag="right" title="Margem direita" aria-label="Arrastar margem direita">▶</button></div><button class="el-ruler-settings" data-action="el-page-settings">⚙ Margens e parágrafos</button></div>`}
function elPageSettings(){const x=elPageTarget();if(!x)return;const p=elPage(x);showDialog(`${modalHead('Configuração de página')}<p class="mini">Medidas em milímetros. Alterações salvas neste documento automaticamente. A régua funciona melhor em telas largas.</p><form id="elPageForm"><div class="field"><label>Formato do papel</label><select name="paper">${[['a4','A4 (210 × 297 mm)'],['a5','A5 (148 × 210 mm)'],['letter','Carta (216 × 279 mm)'],['screen','Tela livre']].map(([k,v])=>`<option value="${k}" ${p.paper===k?'selected':''}>${v}</option>`).join('')}</select></div><div class="el-measure-grid">${[['top','Margem superior'],['bottom','Margem inferior'],['left','Margem esquerda'],['right','Margem direita'],['first','Recuo primeira linha'],['paragraph','Recuo do parágrafo'],['after','Espaço após parágrafo']].map(([k,label])=>`<label>${label}<input name="${k}" type="number" min="${k==='first'?-15:0}" max="65" step="0.5" value="${p[k]}"></label>`).join('')}</div><button class="btn block" type="submit">Aplicar medidas</button></form>`)}
function elStorePage(values){const x=elPageTarget();if(!x)return;let next={...elPage(x)};for(const k of ['top','bottom','left','right','first','paragraph','after'])if(values[k]!==undefined){const value=Number(values[k]);if(!Number.isFinite(value))return alert('Uma das medidas está inválida.');next[k]=value;}if(values.paper)next.paper=values.paper;next=elPage({pageLayout:next});if(next.left+next.right>elPageWidthMm(next)-35)return alert('As margens esquerda e direita deixam pouco espaço para escrever.');x.pageLayout=next;x.updatedAt=now();persist(false);elApplyPage();const ruler=document.getElementById('elRuler');if(ruler){const fresh=document.createElement('div');fresh.innerHTML=elRulerMarkup(x);ruler.parentNode.replaceWith(fresh.firstChild);}closeDialog();flash('Layout de página salvo neste documento.')}
function elTemplates(){const ts=data.preferences.elTemplates;return Array.isArray(ts)?ts:[]}
const EL_STARTERS=[{name:'Página em branco',html:'<p></p>',paper:'a4'},{name:'Capítulo clássico',html:'<h1>Capítulo Um</h1><p>Comece sua história aqui…</p>',paper:'a5'},{name:'Ficha literária livre',html:'<h1>Nome do personagem</h1><h2>Sobre</h2><p></p><h2>Personalidade</h2><p></p><h2>História</h2><p></p>',paper:'a4'},{name:'Escaleta por cenas',html:'<h1>Escaleta</h1><h2>Cena 1</h2><p><b>Objetivo:</b> </p><p><b>Conflito:</b> </p><p><b>Consequência:</b> </p>',paper:'a4'},{name:'Página de diário',html:'<h1>Diário de criação</h1><p><b>Data:</b> </p><p><b>Reflexões:</b> </p>',paper:'a4'}];
function elTemplateMenu(){const x=elPageTarget();if(!x)return;let all=[...EL_STARTERS.map(t=>({...t,stock:true})),...elTemplates().map(t=>({...t,stock:false}))];showDialog(`${modalHead('Modelos de documento')}<p class="mini">Escolha uma página inicial ou um modelo pessoal. O texto existente só será substituído após confirmação, com versão de recuperação.</p><div class="el-template-grid">${all.map((t,i)=>`<button type="button" class="el-template-tile" data-el-template="${i}"><div class="el-template-preview">${sanitize(t.html).replace(/<img\b[^>]*>/gi,'')}</div><strong>${esc(t.name)}</strong><span>${t.stock?'Modelo pronto para editar':'Modelo salvo por você'} · ${t.paper?.toUpperCase()||t.pageLayout?.paper?.toUpperCase()||'A4'}</span></button>`).join('')}</div><div class="divider"></div><button class="btn subtle block" data-action="el-save-template">＋ Salvar página atual como modelo</button>`)}
function elApplyTemplate(i){const x=elPageTarget();if(!x)return;const a=[...EL_STARTERS,...elTemplates()],t=a[i];if(!t)return;if(!confirm(`Aplicar o modelo “${t.name}”? O texto atual será substituído. Faça backup antes.`))return;if(view==='editor'){saveDoc(false);snapshotDocument(x,'Antes de aplicar modelo');x.html=sanitize(t.html);x.pageLayout=t.pageLayout||{...EL_PAGE_DEFAULT,paper:t.paper||'a4'};persist(false);closeDialog();renderEditor()}else{saveNotePage(false);noteSnapshot(x);x.html=sanitize(t.html);x.body='';x.pageLayout=t.pageLayout||{...EL_PAGE_DEFAULT,paper:t.paper||'a4'};persist(false);closeDialog();renderNotePage()}flash('Modelo aplicado. Uma versão anterior foi preservada.')}
function elSaveTemplate(){const x=elPageTarget();if(!x)return;const name=prompt('Nome do seu modelo reutilizável:',(x.title||'Meu modelo')+' — modelo');if(!name?.trim())return;if(view==='editor')saveDoc(false);else saveNotePage(false);const t={id:uid(),name:name.trim().slice(0,70),html:sanitize(x.html||''),pageLayout:elPage(x),createdAt:now()};data.preferences.elTemplates=[...elTemplates(),t].slice(-40);persist(false);elTemplateMenu();flash('Modelo salvo. Disponível em outros documentos e projetos.')}
let elRulerDrag=null;
document.addEventListener('pointerdown',event=>{const thumb=event.target.closest?.('[data-el-drag]');if(!thumb||!document.getElementById('elRuler'))return;elRulerDrag={key:thumb.dataset.elDrag,rect:document.getElementById('elRuler').getBoundingClientRect()};thumb.setPointerCapture?.(event.pointerId);event.preventDefault()});
document.addEventListener('pointerup',event=>{if(!elRulerDrag)return;const {key,rect}=elRulerDrag;elRulerDrag=null;const x=elPageTarget();if(!x)return;const p=elPage(x);let position=Math.max(0,Math.min(1,(event.clientX-rect.left)/Math.max(1,rect.width)));let width=elPageWidthMm(p),mm=Math.round(position*width);if(key==='right')p.right=Math.max(0,Math.min(65,width-mm));else if(key==='left')p.left=Math.max(0,Math.min(65,mm));else if(key==='first')p.first=Math.max(-15,Math.min(65,mm-p.left));elStorePage(p)});
function elStandaloneTimer(){const running=elTimerStart?Date.now()-elTimerStart+elTimerPast:elTimerPast;const sec=Math.floor(running/1000);return [Math.floor(sec/3600),Math.floor(sec%3600/60),sec%60].map(v=>String(v).padStart(2,'0')).join(':')}
let elTimerStart=0,elTimerPast=0,elTimerInterval=null;
function elTimerDialog(){showDialog(`${modalHead('Temporizador livre')}<p class="mini">Cronômetro independente das sessões de escrita. Você pode usar apenas para acompanhar seu tempo, sem alterar suas metas.</p><h2 id="elStandaloneClock" style="text-align:center;font-size:38px;font-variant-numeric:tabular-nums">${elStandaloneTimer()}</h2><div class="btn-group"><button class="btn subtle" data-action="el-timer-toggle">${elTimerStart?'Pausar':'Iniciar / retomar'}</button><button class="btn subtle" data-action="el-timer-reset">Zerar</button></div>`)}
function elTimerPaint(){const node=document.getElementById('elStandaloneClock');if(node)node.textContent=elStandaloneTimer()}
function elToggleTimer(){if(elTimerStart){elTimerPast+=Date.now()-elTimerStart;elTimerStart=0;clearInterval(elTimerInterval)}else{elTimerStart=Date.now();elTimerInterval=setInterval(elTimerPaint,1000)}elTimerDialog()}
function elResetTimer(){elTimerStart=0;elTimerPast=0;clearInterval(elTimerInterval);elTimerDialog()}

function renderEditor(){const d=doc(documentId);if(!d){resetUI();return render()}$('#app').innerHTML=`<div class="editor-shell"><header class="editor-top"><button class="icon-btn" data-action="editor-back" aria-label="Voltar">‹</button><input id="docTitle" class="doc-title" maxlength="150" value="${esc(d.title)}" aria-label="Título do documento"><a class="el29-newtab el29-top-link" href="${esc(el29DocumentUrl(d.id))}" target="_blank" rel="noopener noreferrer" title="Abrir este capítulo em outra aba">↗</a><button class="icon-btn" data-action="el-templates" title="Modelos">▤</button><button class="icon-btn" data-action="el-page-settings" title="Margens, régua e parágrafos">▥</button><button class="btn subtle small-btn" data-action="save-doc">Salvar</button><button class="icon-btn" data-action="export-menu" aria-label="Exportar documento">⇩</button><button class="icon-btn" data-action="google-doc-menu" aria-label="Sincronização Google Docs" title="Google Docs">☁</button><button class="icon-btn" data-action="el-ai" aria-label="Assistente de IA" title="Central de IA">✦</button><button class="icon-btn" data-action="editor-menu" aria-label="Mais ações">⋮</button></header><div class="toolbar" aria-label="Ferramentas de edição"><button class="tool" data-command="bold" title="Negrito"><b>B</b></button><button class="tool" data-command="italic" title="Itálico"><i>I</i></button><button class="tool" data-command="underline" title="Sublinhado"><u>U</u></button><button class="tool" data-command="strikeThrough" title="Tachado"><s>S</s></button><button class="tool" data-block="h1" title="Título">H1</button><button class="tool" data-block="h2" title="Subtítulo">H2</button><button class="tool" data-block="p" title="Parágrafo">¶</button><button class="tool" data-command="insertUnorderedList" title="Lista">☷</button><button class="tool" data-command="insertOrderedList" title="Lista numerada">1.</button><button class="tool" data-command="justifyLeft" title="À esquerda">≡</button><button class="tool" data-command="justifyCenter" title="Centralizar">≣</button><button class="tool" data-command="justifyFull" title="Justificar">☰</button><button class="tool" data-command="outdent" title="Diminuir recuo">⇤</button><button class="tool" data-command="indent" title="Aumentar recuo">⇥</button><button class="tool" data-command="undo" title="Desfazer">↶</button><button class="tool" data-command="redo" title="Refazer">↷</button><button class="tool" data-action="find-replace" title="Localizar e substituir">⌕</button><button class="tool" data-action="add-link" title="Inserir link">🔗</button><button class="tool" data-action="add-image" title="Inserir imagem">▧</button><button class="tool" data-action="add-table" title="Inserir tabela">▦</button><button class="tool" data-command="insertHorizontalRule" title="Divisor">—</button><button class="tool" data-action="format-more" title="Mais formatação">Aa</button></div>${typeControls(d,'doc')}${elRulerMarkup(d)}<section class="writing-box"><article class="paper el-paper-page" id="writingArea" style="${esc(typeStyle(d))};${esc(elPageCSS(d))}" contenteditable="true" role="textbox" aria-multiline="true" spellcheck="true">${sanitize(d.html||'')}</article></section><div class="editor-status"><span id="editorWords">${nfmt(numWords(d.html||''))} palavras</span><span id="editorSave">${displayStatus()}</span><span id="googleSyncStatus">${esc(googleStatus(d))}</span><span id="timerClock" class="timer-clock">00:00:00</span><button class="btn subtle small-btn" data-action="timer-toggle">▶ Iniciar</button><button class="btn subtle small-btn" data-action="timer-finish" disabled>✓ Registrar tempo</button><button class="btn subtle small-btn" data-action="new-session">＋ Sessão manual</button><button class="btn subtle small-btn" data-action="el-timer-dialog">◷ Livre</button></div></div>`}
function renderReader(){if(speechActive&&speechDocumentId!==documentId)stopSpeech();const d=doc(documentId);if(!d){resetUI();return render()}const p=data.preferences;readerNotesOpen=false;readerSelection=null;$('#app').innerHTML=`<div class="reader-shell"><header class="reader-top"><button class="icon-btn" data-action="reader-back" aria-label="Voltar">‹</button><div class="grow clip"><strong>${esc(d.title)}</strong><div class="tiny muted">${esc(project(d.projectId)?.title||'Sua biblioteca')}</div></div><div class="reader-actions"><button class="btn el24-reader-edit" data-action="reader-edit" aria-label="Editar este capítulo">${d.googleLink?.mode==='external'?'✎ Google Docs':'✎ Editar'}</button>${d.googleLink?.mode==='external'?'<button class="btn subtle small-btn" data-action="el-docs-refresh">↻ Atualizar</button><button class="btn subtle small-btn" data-action="el-docs-pdf">PDF</button>':''}<button class="icon-btn" data-action="reader-highlight" aria-label="Destacar seleção" title="Destacar seleção">🖍</button><button class="icon-btn" data-action="reader-add-note" aria-label="Adicionar nota à seleção" title="Adicionar nota">✎</button><button class="icon-btn" data-action="reader-speech" aria-label="Ouvir capítulo" title="Ouvir capítulo">🔊</button><button class="icon-btn" data-action="reader-search" aria-label="Buscar no texto" title="Buscar">⌕</button><button class="icon-btn" data-action="reader-notes" aria-label="Notas do livro" title="Notas">☷</button><button class="icon-btn" data-action="reader-options" aria-label="Ajustar leitura" title="Ajustar">Aa</button></div></header><div id="readerScroll" class="reader-scroll ${p.readerTheme} ${p.readerMode==='paged'?'paged':''}" style="--reader-size:${Number(p.readerFontSize)||19}px;--reader-line:${Number(p.readerLineHeight)||1.75};--reader-font:${p.readerFont==='Arial,sans-serif'?'Arial,sans-serif':'Georgia,serif'}"><article class="reader-content" id="readerText">${sanitize(d.googleLink?.mode==='external'?elDocsReadableHtml(d):(d.html||'<p>Este documento está vazio.</p>'))}</article></div><footer class="reader-bottom"><button class="btn subtle small-btn" data-action="reader-prev" aria-label="Voltar uma página">‹</button><button class="btn subtle small-btn" data-action="reader-bookmark">🔖</button><div class="progress"><i id="readerProgress" style="width:${(d.readingProgress||0)*100}%"></i></div><span id="readerPercent">${Math.round((d.readingProgress||0)*100)}%</span><button class="btn subtle small-btn" data-action="reader-next" aria-label="Avançar uma página">›</button></footer><div id="readerNotesPanel"></div></div>`;applyMarks();$('#readerScroll')?.addEventListener('scroll',readProgress,{passive:true});requestAnimationFrame(()=>{let e=$('#readerScroll');if(!e)return;if(p.readerMode==='paged'){e.scrollLeft=(e.scrollWidth-e.clientWidth)*(d.readingProgress||0)}else e.scrollTop=(e.scrollHeight-e.clientHeight)*(d.readingProgress||0)})}
function readProgress(){if(view!=='reader')return;let e=$('#readerScroll'),d=doc(documentId);if(!e||!d)return;let max=data.preferences.readerMode==='paged'?e.scrollWidth-e.clientWidth:e.scrollHeight-e.clientHeight;let value=data.preferences.readerMode==='paged'?e.scrollLeft:e.scrollTop;d.readingProgress=max>0?Math.max(0,Math.min(1,value/max)):1;$('#readerProgress').style.width=Math.round(d.readingProgress*100)+'%';$('#readerPercent').textContent=Math.round(d.readingProgress*100)+'%';clearTimeout(scrollTimer);scrollTimer=setTimeout(()=>persist(false),600)}
function textOffset(root,container,offset){const r=document.createRange();r.selectNodeContents(root);r.setEnd(container,offset);return r.toString().length}
function readerGetSelection(){let el=$('#readerText'),sel=window.getSelection();if(!el||!sel||sel.isCollapsed||!sel.rangeCount)return null;let r=sel.getRangeAt(0);if(!el.contains(r.commonAncestorContainer))return null;let quote=r.toString().trim();if(!quote)return null;let start=textOffset(el,r.startContainer,r.startOffset),end=textOffset(el,r.endContainer,r.endOffset);return{quote,start,end}}
function applyMarks(){const el=$('#readerText');if(!el)return;let marks=annotationsFor(documentId);if(!marks.length)return;let walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT),nodes=[],node,pos=0;while(node=walker.nextNode()){let t=node.textContent||'';nodes.push({node,start:pos,end:pos+t.length,text:t});pos+=t.length}for(const item of nodes){let intersects=marks.filter(a=>a.start<item.end&&a.end>item.start).sort((a,b)=>a.start-b.start);if(!intersects.length)continue;let b=[0,item.text.length];for(const a of intersects)b.push(Math.max(0,a.start-item.start),Math.min(item.text.length,a.end-item.start));b=[...new Set(b)].sort((a,b)=>a-b);let frag=document.createDocumentFragment();for(let i=0;i<b.length-1;i++){let from=b[i],to=b[i+1],text=item.text.slice(from,to);if(!text)continue;let match=intersects.find(a=>a.start<=item.start+from&&a.end>=item.start+to);if(match){let m=document.createElement('mark');m.className='reader-mark';m.dataset.annotation=match.id;m.textContent=text;frag.appendChild(m)}else frag.appendChild(document.createTextNode(text))}item.node.replaceWith(frag)}}
function saveAnnotation(withNote){const selected=readerGetSelection()||readerSelection;if(!selected){flash('Selecione um trecho do texto primeiro.');return}let note='';if(withNote){const typed=prompt('Sua nota sobre o trecho selecionado:','');if(typed===null)return;note=typed.trim().slice(0,3000)}data.annotations.push({id:uid(),documentId,quote:selected.quote.slice(0,1500),start:selected.start,end:selected.end,note,color:'#F4D777',createdAt:now()});let d=doc(documentId),scroll=$('#readerScroll');if(scroll){let max=data.preferences.readerMode==='paged'?scroll.scrollWidth-scroll.clientWidth:scroll.scrollHeight-scroll.clientHeight;d.readingProgress=max?((data.preferences.readerMode==='paged'?scroll.scrollLeft:scroll.scrollTop)/max):0}persist(false);renderReader();flash(withNote?'Nota salva.':'Trecho destacado.');window.getSelection()?.removeAllRanges()}
function notesPanel(){let panel=$('#readerNotesPanel');if(!panel)return;readerNotesOpen=!readerNotesOpen;if(!readerNotesOpen){panel.innerHTML='';return}let notes=annotationsFor(documentId);panel.innerHTML=`<div class="reader-notes"><div class="row"><strong>Destaques e notas (${notes.length})</strong><button class="btn subtle small-btn" data-action="export-reader-notes">Exportar</button><button class="btn subtle small-btn" data-action="reader-notes">Fechar</button></div>${notes.map(n=>`<div class="line"><button class="preview" data-jump-mark="${esc(n.id)}"><div class="text-quote">${esc(n.quote.slice(0,260))}</div><div class="small">${esc(n.note||'Destaque sem anotação')}</div></button><div class="btn-group" style="margin-top:9px"><button class="btn subtle small-btn" data-edit-annotation="${esc(n.id)}">✎ Nota</button><button class="btn subtle small-btn" data-delete-annotation="${esc(n.id)}">Excluir</button></div></div>`).join('')||'<p class="empty">Selecione um trecho durante a leitura e toque em 🖍 ou ✎.</p>'}</div>`}
function toTrash(type,item){
 if(!item)return;
 if(!Array.isArray(data.trash))data.trash=[];
 const record=JSON.parse(JSON.stringify(item));
 const related=type==='document'?data.annotations.filter(a=>a.documentId===record.id).map(a=>JSON.parse(JSON.stringify(a))):[];
 data.trash.push({id:uid(),type,record,related,deletedAt:now()});
}
function trashPanel(){
 const items=[...(data.trash||[])].reverse();
 showDialog(`${modalHead('Lixeira recuperável')}<p class="mini">Capítulos, notas e sessões excluídos ficam aqui até você esvaziar a lixeira. A lixeira também entra no backup completo.</p><div class="note-list-scroll">${items.map(item=>`<div class="line row"><div class="grow"><strong>${esc(item.record?.title||item.record?.note||('Sessão de '+pretty(item.record?.date||day())))}</strong><div class="tiny muted">${esc({document:'Manuscrito',note:'Nota',session:'Sessão'}[item.type]||item.type)} · Excluído em ${esc(new Date(item.deletedAt).toLocaleDateString('pt-BR'))}</div></div><button class="btn subtle small-btn" data-trash-restore="${esc(item.id)}">Recuperar</button></div>`).join('')||'<p class="empty">Sua lixeira está vazia. ✦</p>'}</div>${items.length?'<button class="btn danger block" data-action="empty-trash">Esvaziar lixeira permanentemente</button>':''}`)
}
function restoreTrash(id){
 const t=(data.trash||[]).find(x=>x.id===id);if(!t)return;
 const row=JSON.parse(JSON.stringify(t.record));
 if(t.type==='document'){
  const old=row.id;if(doc(old))row.id=uid();
  if(row.projectId&&!project(row.projectId))row.projectId=null;
  data.documents.push(row);
  const annotations=(t.related||[]).map(a=>({...a,id:data.annotations.some(x=>x.id===a.id)?uid():a.id,documentId:row.id}));
  data.annotations.push(...annotations);
 }else if(t.type==='note'){
  if(data.notes.some(n=>n.id===row.id))row.id=uid();
  if(row.projectId&&!project(row.projectId))row.projectId=null;
  data.notes.push(row);
 }else if(t.type==='session'){
  if(data.sessions.some(n=>n.id===row.id))row.id=uid();
  if(row.projectId&&!project(row.projectId))row.projectId=null;
  data.sessions.push(row);
 }else return;
 data.trash=data.trash.filter(x=>x.id!==id);
 persist(false);trashPanel();flash('Item restaurado com segurança.');
}
async function storageStatusPanel(){
 const supported=!!navigator.storage,secure=location.protocol==='https:'||location.hostname==='localhost';
 let usage=null,quota=null,persistent=null;
 if(supported){try{const estimate=await navigator.storage.estimate();usage=estimate.usage;quota=estimate.quota;persistent=await navigator.storage.persisted()}catch(e){}}
 const mb=x=>(Number(x)/1048576).toLocaleString('pt-BR',{maximumFractionDigits:1})+' MB';
 showDialog(`${modalHead('Saúde do armazenamento')}<p class="mini">Seus manuscritos permanecem neste navegador e nesta origem. ${secure?'O site está em uma origem adequada para recursos web.':'Arquivos HTML locais podem perder dados ao mudar de endereço ou navegador.'}</p><div class="card"><strong>Espaço aproximado</strong><p class="mini">Usado: ${usage==null?'Não disponível':mb(usage)} · Limite estimado: ${quota==null?'Não disponível':mb(quota)}</p><p class="mini">Proteção adicional contra remoção automática: <strong>${persistent===true?'Ativa':persistent===false?'Não concedida':'Não disponível'}</strong>.</p></div><p class="mini">A proteção persistente depende do navegador e não impede exclusão manual dos dados. Ela NÃO substitui backups externos.</p><div class="btn-group"><button class="btn" data-action="request-persistent-storage" ${!supported?'disabled':''}>Solicitar proteção local</button><button class="btn subtle" data-action="backup">Exportar backup agora</button></div>`)
}
async function requestPersistentStorage(){
 if(!navigator.storage?.persist){flash('O navegador não suporta esta proteção.');return}
 try{const granted=await navigator.storage.persist();await storageStatusPanel();flash(granted?'Proteção de armazenamento concedida.':'O navegador não concedeu a proteção. Exporte backups regularmente.',4400)}catch(e){flash('Não foi possível solicitar a proteção. Faça backups.',4400)}
}
function shareBackup(){
 const filename=`entrelinhas-backup-${day()}.json`;
 const file=new File([JSON.stringify(data,null,2)],filename,{type:'application/json'});
 if(typeof navigator.share==='function'&&navigator.canShare?.({files:[file]})){
  navigator.share({title:'Backup do Entrelinhas',files:[file]}).catch(e=>{if(e.name!=='AbortError')flash('Não foi possível compartilhar. Exporte o backup normalmente.')});
 }else{download(file,filename);flash('Compartilhamento indisponível: backup enviado para Downloads.');}
}
function showDialog(html){const dialog=$('#dialog');dialog.innerHTML=html;if(!dialog.open)dialog.showModal()}
function closeDialog(){if($('#dialog').open)$('#dialog').close()}
function modalHead(title){return `<div class="row" style="margin-bottom:16px"><h2>${esc(title)}</h2><button class="icon-btn" data-action="close-dialog" aria-label="Fechar">×</button></div>`}
function projectForm(p=null){editingId=p?.id||null;chosenColor=colors.includes(p?.color)?p.color:colors[0];showDialog(`${modalHead(p?'Editar projeto':'Novo projeto')}<form id="projectForm"><div class="field"><label>Título do projeto</label><input name="title" required maxlength="160" value="${esc(p?.title||'')}" placeholder="Meu romance de fantasia"></div><div class="field"><label>Gênero</label><input name="genre" maxlength="90" value="${esc(p?.genre||'Fantasia')}"></div><div class="field"><label>Sinopse / resumo</label><textarea name="blurb" maxlength="4000">${esc(p?.blurb||'')}</textarea></div><div class="grid2"><div class="field"><label>Meta total (palavras)</label><input name="goal" type="number" min="0" max="10000000" value="${p?.goal??80000}" required></div><div class="field"><label>Palavras pré-existentes</label><input name="baseline" type="number" min="0" max="10000000" value="${p?.baseline??0}" required></div></div><p class="mini">Progresso do projeto usa as sessões registradas; a contagem atual do editor aparece separadamente para evitar duplicidade.</p><div class="field"><label>Cor da capa</label><div class="swatches">${colors.map(c=>`<button type="button" data-cover="${c}" class="swatch ${c===chosenColor?'active':''}" style="background:${c}" aria-label="Selecionar cor ${c}"></button>`).join('')}</div></div><button class="btn block" type="submit">${p?'Salvar alterações':'Criar projeto'}</button>${p?`<p><button class="btn danger block" type="button" data-delete-project="${esc(p.id)}">Excluir projeto (manter manuscritos)</button></p>`:''}</form>`)}
function sessionForm(s=null,defaults={}){editingId=s?.id||null;sessionKind=s?.kind||'escrita';const pids=data.projects.map(p=>`<option value="${esc(p.id)}" ${s?.projectId===p.id||(!s&&(defaults.projectId||projectId)===p.id)?'selected':''}>${esc(p.title)}</option>`).join('');showDialog(`${modalHead(s?'Editar sessão':'Nova sessão')}<p class="mini">Escrita e revisão contam para sua ofensiva, mesmo sem palavras novas.</p><form id="sessionForm"><div class="chips"><button type="button" class="chip ${sessionKind==='escrita'?'active':''}" data-kind="escrita">✍ Escrita</button><button type="button" class="chip ${sessionKind==='revisao'?'active':''}" data-kind="revisao">✎ Revisão</button></div><div class="field"><label>Projeto</label><select name="projectId"><option value="">Sem projeto</option>${pids}</select></div><div class="field"><label>Data</label><input name="date" type="date" max="${day()}" value="${s?.date||day()}" required></div><div class="grid2"><div class="field"><label>Palavras produzidas</label><input name="words" type="number" min="0" max="10000000" value="${s?.words??0}"></div><div class="field"><label>Minutos</label><input name="minutes" type="number" min="0" max="1440" value="${s?.minutes??defaults.minutes??0}"></div></div><div class="field"><label>Anotações</label><textarea name="note" maxlength="1000">${esc(s?.note||defaults.note||'')}</textarea></div><button class="btn block" type="submit">Salvar sessão</button>${s?`<p><button class="btn danger block" type="button" data-delete-session="${esc(s.id)}">Excluir registro</button></p>`:''}</form>`)}
function documentForm(){showDialog(`${modalHead('Novo manuscrito')}<form id="documentForm"><div class="field"><label>Título do documento ou capítulo</label><input name="title" required maxlength="150" placeholder="Capítulo 1 — O começo"></div><div class="field"><label>Projeto</label><select name="projectId"><option value="">Sem projeto</option>${data.projects.map(p=>`<option value="${esc(p.id)}" ${projectId===p.id?'selected':''}>${esc(p.title)}</option>`).join('')}</select></div><div class="field"><label>Tipo</label><select name="kind"><option value="capitulo">Capítulo</option><option value="cena">Cena</option><option value="manuscrito">Manuscrito completo</option><option value="outro">Outro documento</option></select></div><button class="btn block">Criar e abrir editor</button></form>`)}

function noteById(id){return data.notes.find(n=>n.id===id)}
function notePlain(n){return (n.html?textOf(n.html):String(n.body||''))}
function noteHtml(n){return n.html||'<p>'+esc(n.body||'').replace(/\n/g,'<br>')+'</p>'}
function noteVersions(n){return Array.isArray(n.versions)?n.versions:[]}
function noteSnapshot(n){const versions=noteVersions(n);versions.push({id:uid(),time:now(),title:n.title,body:n.body,html:n.html||'',fields:{...n.fields},tags:[...(n.tags||[])],status:n.status||'rascunho',blocks:structuredClone(noteBlocks(n)),links:[...noteLinks(n)]});n.versions=versions.slice(-15)}
function openNote(id,mode='read'){
 if(!noteById(id))return;
 if(view==='note'&&noteMode==='edit')saveNotePage(false);
 activeNoteId=id;noteMode=mode;view='note';closeDialog();render();scrollTo(0,0);
}
function noteCreateForm(){
 showDialog(`${modalHead('Nova página do diário')}<p class="mini">Crie uma página e continue na área completa de edição. Você poderá acrescentar texto, fichas, detalhes e ler tudo depois.</p><form id="quickNoteForm"><div class="field"><label>Título</label><input name="title" required maxlength="160" placeholder="Nome da personagem, cena ou ideia"></div><div class="field"><label>Categoria</label><select name="type">${Object.entries(noteTypes).map(([k,v])=>`<option value="${k}" ${noteFilter===k?'selected':''}>${esc(v)}</option>`).join('')}</select></div><div class="field"><label>Projeto</label><select name="projectId"><option value="">Geral / sem projeto</option>${data.projects.map(p=>`<option value="${esc(p.id)}" ${projectId===p.id?'selected':''}>${esc(p.title)}</option>`).join('')}</select></div><button class="btn block">Criar e abrir página →</button></form>`)
}
function noteBack(){clearTimeout(noteSaveTimer);if(noteMode==='edit')saveNotePage(false);view='main';activeNoteId=null;noteMode='read';tab='diario';render();scrollTo(0,0)}
function noteLinks(n){return Array.isArray(n.links)?n.links:[]}
function noteBlocks(n){return Array.isArray(n.blocks)?n.blocks:[]}
function noteRelationOptions(n){return data.notes.filter(item=>item.id!==n.id&&(!n.projectId||item.projectId===n.projectId)).map(item=>`<option value="${esc(item.id)}">${esc(noteTypes[item.type]||'Página')} — ${esc(item.title)}</option>`).join('')}
function noteRelationsHTML(n,edit){const linked=noteLinks(n).map(id=>noteById(id)).filter(Boolean);return `<section class="note-section"><h3>🔗 Páginas relacionadas (${linked.length})</h3><p class="mini">Conecte personagens, cenas, lugares, eventos, pesquisas e outras páginas do planejamento.</p>${linked.map(item=>`<div class="note-related"><button class="preview grow" data-open-note="${esc(item.id)}"><strong>${esc(item.title)}</strong><div class="tiny muted">${esc(noteTypes[item.type])}</div></button>${edit?`<button class="btn subtle small-btn" data-note-unlink="${esc(item.id)}" aria-label="Remover vínculo">×</button>`:''}</div>`).join('')||'<p class="mini">Nenhuma página relacionada.</p>'}${edit?`<div class="row"><select id="noteLinkSelect" class="diary-sort grow" aria-label="Vincular página"><option value="">Escolher página...</option>${noteRelationOptions(n)}</select><button class="btn subtle small-btn" data-action="note-link">Vincular</button></div>`:''}</section>`}
function noteBlocksHTML(n,edit){const blocks=noteBlocks(n);if(n.type!=='escaleta')return '';return `<section class="note-section"><div class="row"><h3 class="grow">🧩 Blocos da escaleta (${blocks.length})</h3>${edit?'<button class="btn subtle small-btn" data-action="note-block-add">＋ Bloco</button>':''}</div><p class="mini">Organize os acontecimentos e desenvolva cada bloco antes de transformá-lo em cena.</p>${blocks.map((b,i)=>`<div class="note-block" data-block="${esc(b.id)}"><div class="row"><span class="note-pill">${i+1}</span><strong class="grow">${esc(b.title||'Novo bloco')}</strong>${edit?`<button class="btn subtle small-btn" data-block-up="${esc(b.id)}" ${i===0?'disabled':''} aria-label="Subir bloco">↑</button><button class="btn subtle small-btn" data-block-down="${esc(b.id)}" ${i===blocks.length-1?'disabled':''} aria-label="Descer bloco">↓</button>`:''}</div>${edit?`<div class="note-edit-field"><label>Nome do bloco</label><input data-block-field="title" data-block-id="${esc(b.id)}" maxlength="180" value="${esc(b.title||'')}"></div>${[['summary','Resumo'],['goal','Objetivo'],['conflict','Conflito'],['outcome','Consequência'],['pov','POV'],['place','Local']].map(([key,label])=>`<div class="note-edit-field"><label>${label}</label><textarea data-block-field="${key}" data-block-id="${esc(b.id)}" rows="2" maxlength="3000">${esc(b[key]||'')}</textarea></div>`).join('')}<div class="row"><button class="btn subtle small-btn" data-block-scene="${esc(b.id)}">Transformar em cena</button><button class="btn danger small-btn" data-block-delete="${esc(b.id)}">Excluir bloco</button></div>`:`${[['summary','Resumo'],['goal','Objetivo'],['conflict','Conflito'],['outcome','Consequência'],['pov','POV'],['place','Local']].filter(([k])=>b[k]).map(([k,l])=>`<div class="note-section"><strong>${l}</strong><p class="small" style="white-space:pre-wrap">${esc(b[k])}</p></div>`).join('')}`}</div>`).join('')||'<p class="mini">Adicione blocos para planejar o arco desta escaleta.</p>'}</section>`}
function noteCategoryActions(n,edit){if(edit)return '';const btns=[];if(n.type==='ideia')btns.push('<button class="btn subtle small-btn" data-action="note-convert-scene">Criar cena desta ideia</button>');if(n.type==='cena')btns.push('<button class="btn subtle small-btn" data-action="note-convert-chapter">Criar capítulo desta cena</button>');return btns.length?`<section class="note-section"><h3>Usar no manuscrito</h3><div class="btn-group">${btns.join('')}</div></section>`:''}
function createRelatedNote(source,type,title,fields={}){const n={id:uid(),projectId:source.projectId||null,type,title:title.slice(0,160),date:day(),body:'',html:'',status:'rascunho',fields,tags:[],links:[source.id],blocks:[],versions:[],createdAt:now(),updatedAt:now()};data.notes.push(n);source.links=[...new Set([...noteLinks(source),n.id])];persist(false);return n}
function renderNotePage(){
 const n=noteById(activeNoteId);if(!n){view='main';return render()}
 const isEdit=noteMode==='edit';const statusItems=[['rascunho','Rascunho'],['desenvolvimento','Em desenvolvimento'],['revisao','Em revisão'],['concluido','Concluído']];
 const options=Object.entries(noteTypes).map(([k,v])=>`<option value="${k}" ${k===n.type?'selected':''}>${esc(v)}</option>`).join('');
 const projOptions='<option value="">Geral / sem projeto</option>'+data.projects.map(p=>`<option value="${esc(p.id)}" ${p.id===n.projectId?'selected':''}>${esc(p.title)}</option>`).join('');
 const stamp=pretty((n.updatedAt||n.createdAt||'').slice(0,10));
 let body='';
 if(isEdit){
 body=`<div class="note-sheet"><div class="note-edit-field"><label>Título da página</label><input id="notePageTitle" maxlength="160" value="${esc(n.title)}"></div><div class="note-meta"><div><label for="notePageType">Categoria</label><select id="notePageType">${options}</select></div><div><label for="notePageProject">Projeto</label><select id="notePageProject">${projOptions}</select></div><div><label for="notePageStatus">Situação</label><select id="notePageStatus">${statusItems.map(([v,t])=>`<option value="${v}" ${v===(n.status||'rascunho')?'selected':''}>${t}</option>`).join('')}</select></div><div><label for="notePageDate">Data</label><input id="notePageDate" type="date" value="${esc(validDay(n.date)?n.date:day())}"></div></div><h3>Conteúdo</h3><div class="note-toolbar"><button type="button" data-note-format="undo" title="Desfazer">↶</button><button type="button" data-note-format="redo" title="Refazer">↷</button><button type="button" data-note-format="bold" title="Negrito">B</button><button type="button" data-note-format="italic" title="Itálico"><i>I</i></button><button type="button" data-note-format="underline" title="Sublinhado"><u>U</u></button><button type="button" data-note-format="insertUnorderedList" title="Lista">☷</button><button type="button" data-note-heading="h2" title="Título">H2</button><button type="button" data-note-heading="p" title="Parágrafo">¶</button><button type="button" data-action="note-insert-image" title="Inserir imagem">▧ Imagem</button></div>${typeControls(n,'note')}<div class="el-note-actions"><button class="btn subtle small-btn" data-action="el-page-settings">▥ Margens / parágrafos</button><button class="btn subtle small-btn" data-action="el-templates">▤ Modelos</button><button class="btn subtle small-btn" data-action="el-timer-dialog">◷ Temporizador</button></div>${elRulerMarkup(n)}<div id="notePageBody" class="note-edit-area el-paper-page" style="${esc(typeStyle(n))};${esc(elPageCSS(n))}" contenteditable="true" role="textbox" aria-label="Texto da anotação" aria-multiline="true">${sanitize(noteHtml(n))}</div><div id="noteSaveState" class="note-save-status" aria-live="polite">Salvo neste dispositivo</div><h3>Detalhes de ${esc(noteTypes[n.type]||'anotação')}</h3><div id="notePageExtras">${noteExtraPage(n)}</div>${noteBlocksHTML(n,true)}${noteRelationsHTML(n,true)}<div class="note-edit-field"><label>Etiquetas (separadas por vírgulas)</label><input id="notePageTags" maxlength="400" value="${esc((n.tags||[]).join(', '))}" placeholder="revisar, protagonista, capítulo 2"></div><button class="btn block" data-action="note-save">Salvar alterações</button></div>`;
 }else{
 const fields=Object.entries(n.fields||{}).filter(([k,v])=>String(v||'').trim()).map(([k,v])=>`<section class="note-section"><h3>${esc((noteFields[n.type]||[]).find(x=>x[0]===k)?.[1]||k)}</h3><div style="white-space:pre-wrap;overflow-wrap:anywhere">${esc(v)}</div></section>`).join('');
 body=`<div class="note-sheet"><div class="note-kicker">${esc(noteTypes[n.type]||'Registro de escrita')}</div><h1 class="note-page-title">${esc(n.title)}</h1><button class="el24-inline-edit" type="button" data-action="note-toggle-mode">✎ Editar esta página</button><div>${(n.tags||[]).map(tag=>`<span class="note-pill">#${esc(tag)}</span>`).join('')}</div><div class="note-meta"><div><small>Projeto</small>${esc(project(n.projectId)?.title||'Geral / sem projeto')}</div><div><small>Situação</small>${esc(statusItems.find(x=>x[0]===(n.status||'rascunho'))?.[1]||'Rascunho')}</div><div><small>Data</small>${esc(pretty(n.date||day()))}</div><div><small>Última edição</small>${esc(stamp)}</div></div><section class="note-section"><h3>Conteúdo</h3><div class="${esc(data.preferences.readerTheme)}" ><article class="note-reader-prose" style="--reader-size:${Number(data.preferences.readerFontSize)||19}px;--reader-line:${Number(data.preferences.readerLineHeight)||1.75};--reader-font:${esc(data.preferences.readerFont||'Georgia,serif')}">${sanitize(noteHtml(n))||'<p>Sem texto ainda. Toque em Editar para começar.</p>'}</article></div></section>${fields||''}${noteBlocksHTML(n,false)}${noteRelationsHTML(n,false)}${noteCategoryActions(n,false)}<section class="note-section"><h3>Minhas notas de leitura (${(n.comments||[]).length})</h3>${(n.comments||[]).map((c,i)=>`<div class="note-comment"><div class="tiny muted">${esc(new Date(c.time).toLocaleString('pt-BR'))}</div><div style="white-space:pre-wrap">${esc(c.text)}</div><button class="btn subtle small-btn" data-note-comment-delete="${esc(c.id)}">Excluir</button></div>`).join('')||'<p class="mini">Você ainda não anotou nada durante a leitura.</p>'}<textarea id="noteCommentText" placeholder="Anote uma observação sobre esta página…" rows="3" maxlength="3000"></textarea><button class="btn subtle block" data-action="note-add-comment">＋ Salvar nota de leitura</button></section></div>`
 }
 $('#app').innerHTML=`<div class="note-page"><header class="note-page-top"><button class="btn subtle small-btn" data-action="note-back">‹ ${esc(noteTypes[n.type]||'Diário')}</button><div class="grow"><div class="tiny muted">${esc(noteTypes[n.type]||'Nota')} · ${esc(stamp)}</div><strong>${esc(n.title.slice(0,35))}</strong></div><a class="el29-newtab el29-top-link" href="${esc(el29NoteUrl(n.id))}" target="_blank" rel="noopener noreferrer" aria-label="Abrir esta página em outra aba" title="Abrir em outra aba">↗</a><button class="btn subtle small-btn" data-action="note-reader-settings" ${isEdit?'hidden':''} title="Aparência da leitura">Aa</button><button class="btn small-btn" data-action="note-toggle-mode">${isEdit?'📖 Ler':'✎ Editar'}</button><button class="btn subtle small-btn" data-action="note-more">•••</button></header>${body}</div>`;
}
function noteExtraPage(n){const fieldLabels=new Map(noteFields[n.type]||[]);const sections=noteSections[n.type]||[];return sections.map(([heading,keys])=>`<section class="note-fields-group"><h3>${esc(heading)}</h3>${keys.map(k=>`<div class="note-edit-field"><label for="noteField_${esc(k)}">${esc(fieldLabels.get(k)||k)}</label><textarea id="noteField_${esc(k)}" data-note-extra="${esc(k)}" style="${esc(typeStyle(n))}" rows="2" maxlength="4000">${esc(n.fields?.[k]||'')}</textarea></div>`).join('')}</section>`).join('')||'<p class="mini">Escreva livremente e use as etiquetas para organizar suas ideias.</p>'}
function saveNotePage(message=false){
 const n=noteById(activeNoteId);if(!n||view!=='note'||noteMode!=='edit')return;
 const title=$('#notePageTitle')?.value.trim().slice(0,160);if(!title){if(message)flash('Informe um título antes de salvar.');return}
 const type=$('#notePageType')?.value||n.type;if(!noteTypes[type])return;
 const html=sanitize($('#notePageBody')?.innerHTML||'');const newFields={};for(const [k] of noteFields[type]||[])newFields[k]=($('#noteField_'+k)?.value||n.fields?.[k]||'').slice(0,4000);
 const tags=String($('#notePageTags')?.value||'').split(',').map(x=>x.trim()).filter(Boolean).slice(0,30);
 if(type==='escaleta'){for(const b of noteBlocks(n)){for(const input of document.querySelectorAll('[data-block-id]'))if(input.dataset.blockId===b.id&&input.dataset.blockField)b[input.dataset.blockField]=String(input.value||'').slice(0,3000)}}
 n.title=title;n.type=type;n.projectId=$('#notePageProject')?.value||null;n.status=$('#notePageStatus')?.value||'rascunho';n.date=validDay($('#notePageDate')?.value)?$('#notePageDate').value:n.date;n.fields=newFields;n.tags=tags;n.html=html;n.body=textOf(html).slice(0,60000);n.updatedAt=now();persist(false);
 const state=$('#noteSaveState');if(state)state.textContent='✓ Salvo no dispositivo';if(message)flash('Página salva.');
}
function noteReaderSettings(){
 const p=data.preferences;
 showDialog(`${modalHead('Modo de leitura')}<div class="field"><label>Tema</label><select id="noteReadTheme"><option value="reader-sepia" ${p.readerTheme==='reader-sepia'?'selected':''}>Papel sépia</option><option value="reader-white" ${p.readerTheme==='reader-white'?'selected':''}>Branco</option><option value="reader-night" ${p.readerTheme==='reader-night'?'selected':''}>Noturno</option></select></div><div class="field"><label>Tamanho da fonte</label><input id="noteReadSize" type="range" min="14" max="32" value="${Number(p.readerFontSize)||19}"></div><div class="field"><label>Espaçamento entre linhas</label><input id="noteReadLine" type="range" min="1.3" max="2.5" step="0.1" value="${Number(p.readerLineHeight)||1.75}"></div><div class="field"><label>Fonte</label><select id="noteReadFont"><option value="Georgia,serif" ${p.readerFont==='Georgia,serif'?'selected':''}>Literária</option><option value="Arial,sans-serif" ${p.readerFont==='Arial,sans-serif'?'selected':''}>Moderna</option></select></div><button class="btn block" data-action="note-read-apply">Aplicar à leitura</button>`)
}
function noteMore(){const n=noteById(activeNoteId);if(!n)return;showDialog(`${modalHead('Opções da página')}<div class="btn-group"><button class="btn subtle" data-action="note-export-txt">⇩ Baixar TXT</button><button class="btn subtle" data-action="note-export-html">⇩ Baixar HTML</button><button class="btn subtle" data-action="note-export-pdf">⇩ PDF (imprimir)</button><button class="btn subtle" data-action="note-duplicate">⧉ Duplicar página</button><button class="btn subtle" data-action="note-snapshot">✦ Criar versão</button><button class="btn subtle" data-action="note-versions">↶ Histórico</button><button class="btn danger" data-action="note-delete">Mover para lixeira</button></div><p class="mini">Os dados são salvos neste navegador. Para guardar uma cópia externa, exporte um backup em Ajustes.</p>`)}
function exportNote(fmt){const n=noteById(activeNoteId);if(!n)return;if(noteMode==='edit')saveNotePage(false);const raw=notePlain(n);const additional=Object.entries(n.fields||{}).filter(([,v])=>v).map(([k,v])=>`${(noteFields[n.type]||[]).find(x=>x[0]===k)?.[1]||k}: ${v}`).join('\n\n');const text=`${n.title}\n${noteTypes[n.type]||''} · ${n.date||''}\nProjeto: ${project(n.projectId)?.title||'Geral'}\n\n${raw}\n\n${additional}`;
 if(fmt==='txt')download(new Blob([text],{type:'text/plain;charset=utf-8'}),filename(n.title)+'.txt');else{const html=`<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>${esc(n.title)}</title></head><body><h1>${esc(n.title)}</h1><small>${esc(noteTypes[n.type]||'')} · ${esc(n.date||'')}</small><div>${sanitize(noteHtml(n))}</div>${Object.entries(n.fields||{}).filter(([,v])=>v).map(([k,v])=>`<h3>${esc((noteFields[n.type]||[]).find(x=>x[0]===k)?.[1]||k)}</h3><p>${esc(v).replace(/\n/g,'<br>')}</p>`).join('')}</body></html>`;if(fmt==='html')download(new Blob([html],{type:'text/html;charset=utf-8'}),filename(n.title)+'.html');else{const win=window.open('','_blank');if(win){win.document.write(html);win.document.close();win.focus();setTimeout(()=>win.print(),350)}else flash('Permita pop-ups para imprimir em PDF.')}}}
function noteHistory(){const n=noteById(activeNoteId);if(!n)return;showDialog(`${modalHead('Histórico da página')}<p class="mini">Versões manuais salvas neste dispositivo.</p>${noteVersions(n).slice().reverse().map(v=>`<div class="line row"><div class="grow"><strong>${esc(v.title)}</strong><div class="tiny muted">${esc(new Date(v.time).toLocaleString('pt-BR'))}</div></div><button class="btn subtle small-btn" data-note-restore="${esc(v.id)}">Restaurar</button></div>`).join('')||'<div class="empty">Sem versões manuais ainda.</div>'}`)}

function noteForm(n=null){editingId=n?.id||null;selectedNoteType=n?.type||'ideia';const pid=n?.projectId||projectId||'';showDialog(`${modalHead(n?'Editar registro':'Novo registro')}<form id="noteForm"><div class="field"><label>Tipo de anotação</label><select name="type" id="noteType">${Object.entries(noteTypes).map(([k,v])=>`<option value="${k}" ${selectedNoteType===k?'selected':''}>${esc(v)}</option>`).join('')}</select></div><div class="field"><label>Projeto</label><select name="projectId"><option value="">Geral / sem projeto</option>${data.projects.map(p=>`<option value="${esc(p.id)}" ${pid===p.id?'selected':''}>${esc(p.title)}</option>`).join('')}</select></div><div class="field"><label>Título</label><input name="title" required maxlength="160" value="${esc(n?.title||'')}" placeholder="Uma ideia para o próximo capítulo"></div><div class="field"><label>Data</label><input name="date" type="date" value="${n?.date||day()}"></div><div id="noteExtra">${extraFields(selectedNoteType,n?.fields||{})}</div><div class="field"><label>Texto livre / detalhes</label><textarea name="body" rows="7" maxlength="40000" placeholder="Escreva tudo que desejar, sem limites de criatividade…">${esc(n?.body||'')}</textarea></div><div class="field"><label>Etiquetas (separadas por vírgulas)</label><input name="tags" maxlength="300" value="${esc((n?.tags||[]).join(', '))}" placeholder="mistério, protagonista, inspiração"></div><button class="btn block">Salvar registro</button>${n?`<p><button type="button" class="btn danger block" data-delete-note="${esc(n.id)}">Excluir registro</button></p>`:''}</form>`)}
function extraFields(type,values={}){return (noteFields[type]||[]).map(([k,label])=>`<div class="field"><label>${esc(label)}</label><textarea name="extra_${k}" rows="2" maxlength="4000">${esc(values[k]||'')}</textarea></div>`).join('')}
function projectBookMenu(){const p=project(projectId);if(!p)return;const chapters=sortedDocs(p.id);if(!chapters.length){flash('Adicione capítulos ao projeto para montar seu livro.');return}showDialog(`${modalHead('Exportar livro completo')}<p class="mini"><strong>${esc(p.title)}</strong> · ${chapters.length} capítulo(s) na ordem definida em Projetos. O arquivo reúne o texto atual dos capítulos; notas e fichas continuam no backup ZIP.</p><div class="field"><label for="projectBookFormat">Formato</label><select id="projectBookFormat"><option value="pdf">PDF · impressão do navegador</option><option value="docx">DOCX · Word básico</option><option value="epub">EPUB · leitor digital básico</option><option value="html">HTML · preserva imagens locais</option><option value="txt">TXT · texto simples</option><option value="md">MD · Markdown</option><option value="rtf">RTF · texto simples</option></select></div><button class="btn block" data-action="export-project-book">⇩ Baixar livro completo</button>`)}
function compiledBook(p){const chapters=sortedDocs(p.id);return {title:p.title,html:chapters.map((c,i)=>`<h1>${esc(c.title)}</h1>${sanitize(c.html||'')}`).join('<hr>'),kind:'livro-compilado'}}
async function exportProjectBook(){const p=project(projectId),format=$('#projectBookFormat')?.value;if(!p||!format)return;const book=compiledBook(p);await doExport(format,book)}
function exportCurrentProject(){
 const p=project(projectId);if(!p){flash('Abra um projeto para exportar.');return}
 const docs=data.documents.filter(d=>d.projectId===p.id),notes=data.notes.filter(n=>n.projectId===p.id),sessions=data.sessions.filter(x=>x.projectId===p.id);
 const files=[['LEIA-ME.txt',`Entrelinhas — Exportação de ${p.title}\nData: ${new Date().toLocaleString('pt-BR')}\nContém manuscritos em HTML, notas TXT e dados em JSON.\nSempre mantenha outra cópia do backup completo.\n`],['projeto.json',JSON.stringify({version:2,project:p,documents:docs,notes,sessions,annotations:data.annotations.filter(a=>docs.some(d=>d.id===a.documentId))},null,2)]];
 for(let i=0;i<docs.length;i++){let d=docs[i];files.push([`manuscritos/${String(i+1).padStart(2,'0')}-${filename(d.title)}.html`,`<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>${esc(d.title)}</title></head><body><h1>${esc(d.title)}</h1>${sanitize(d.html)}</body></html>`])}
 for(let i=0;i<notes.length;i++){let n=notes[i];files.push([`planejamento/${String(i+1).padStart(2,'0')}-${filename(n.title)}.txt`,`${noteTypes[n.type]||'Nota'}: ${n.title}\n\n${Object.entries(n.fields||{}).map(([k,v])=>k+': '+v).join('\n')}\n\n${n.body||''}`])}
 download(zipStore(files),`entrelinhas-projeto-${filename(p.title)}.zip`);flash('Projeto exportado. Confira a pasta Downloads.');
}
async function importProjectZip(file){
 if(!file||file.size>30*1024*1024)throw Error('O arquivo de projeto deve ter no máximo 30 MB.');
 const entries=await zipRead(file),get=entries.get('projeto.json');if(!get)throw Error('Não foi encontrado projeto.json neste ZIP. Use um ZIP exportado pelo Entrelinhas.');
 const bytes=await get();if(bytes.length>25*1024*1024)throw Error('O projeto descompactado é grande demais.');
 const raw=JSON.parse(decoder.decode(bytes));if(raw.version!==2||!raw.project||typeof raw.project.title!=='string'||!Array.isArray(raw.documents)||!Array.isArray(raw.notes)||!Array.isArray(raw.sessions)||!Array.isArray(raw.annotations))throw Error('Estrutura do projeto incompatível.');
 if(raw.documents.length>500||raw.notes.length>2000||raw.sessions.length>10000||raw.annotations.length>10000)throw Error('Projeto excede os limites de importação.');
 if(!raw.project.title.trim())throw Error('Projeto sem título.');
 const confirmText=`Importar uma NOVA cópia do projeto “${raw.project.title.slice(0,120)}” com ${raw.documents.length} manuscrito(s) e ${raw.notes.length} ficha(s)? Os dados atuais serão preservados.`;
 if(!confirm(confirmText))return false;
 const newPid=uid(),docMap=new Map(),p={...raw.project,id:newPid,title:raw.project.title.slice(0,160),goal:safeCount(raw.project.goal)?Number(raw.project.goal):0,baseline:safeCount(raw.project.baseline)?Number(raw.project.baseline):0,createdAt:now(),updatedAt:now()};
 if(!colors.includes(p.color))p.color=colors[0];
 const docs=raw.documents.map((d,i)=>{if(!d||typeof d.title!=='string'||typeof d.html!=='string'||d.html.length>8e6)throw Error('Manuscrito do ZIP inválido.');const id=uid();docMap.set(d.id,id);return {...d,id,projectId:newPid,title:d.title.slice(0,150),html:sanitize(d.html),position:i,versions:[],googleDocId:null,lastUploadedGoogleId:null,createdAt:now(),updatedAt:now()}});
 const notes=raw.notes.map(n=>{if(!n||typeof n.title!=='string'||typeof n.body!=='string'||!noteTypes[n.type])throw Error('Ficha do ZIP inválida.');return {...n,id:uid(),projectId:newPid,title:n.title.slice(0,160),body:n.body.slice(0,40000),fields:Object.fromEntries(Object.entries(n.fields||{}).slice(0,25).map(([k,v])=>[String(k).slice(0,80),String(v).slice(0,4000)])),tags:Array.isArray(n.tags)?n.tags.map(t=>String(t).slice(0,70)).slice(0,20):[],createdAt:now(),updatedAt:now()}});
 const sessions=raw.sessions.map(x=>{if(!x||!validDay(x.date)||!['escrita','revisao'].includes(x.kind)||!safeCount(x.words)||!safeCount(x.minutes)||Number(x.minutes)>1440)throw Error('Sessão inválida no ZIP.');return {...x,id:uid(),projectId:newPid,words:Number(x.words),minutes:Number(x.minutes),createdAt:now()}});
 const annotations=raw.annotations.filter(x=>docMap.has(x.documentId)).map(a=>({id:uid(),documentId:docMap.get(a.documentId),quote:String(a.quote||'').slice(0,1500),start:Math.max(0,Number(a.start)||0),end:Math.max(0,Number(a.end)||0),note:String(a.note||'').slice(0,3000),color:'#F4D777',createdAt:now()}));
 data.projects.push(p);data.documents.push(...docs);data.notes.push(...notes);data.sessions.push(...sessions);data.annotations.push(...annotations);
 projectId=newPid;tab='projetos';persist();flash('Projeto importado como cópia independente.');return true;
}
function exportReaderAnnotations(){const d=doc(documentId);if(!d)return;const list=annotationsFor(d.id);const content=`Entrelinhas — Notas de ${d.title}\nExportado em ${new Date().toLocaleString('pt-BR')}\n\n`+list.map((a,i)=>`${i+1}. Trecho: “${a.quote}”\nNota: ${a.note||'(sem nota)'}\n`).join('\n');download(new Blob([content],{type:'text/plain;charset=utf-8'}),`${filename(d.title)}-notas.txt`);flash('Notas exportadas.');}
function exportMenu(){const d=doc(documentId);if(!d)return;const linked=!!(d.googleLink?.id||d.googleDocId);showDialog(`${modalHead('Baixar seu manuscrito')}<p class="mini"><strong>${esc(d.title)}</strong> · Escolha um formato. As conversões locais para Word e EPUB são básicas; o PDF local usa a impressão do navegador.</p><div class="field"><label for="exportFormat">Formato do arquivo</label><select id="exportFormat"><option value="pdf">PDF · imprimir/salvar</option><option value="docx">DOCX · Microsoft Word</option><option value="epub">EPUB · leitor digital</option><option value="html">HTML · mantém imagens embutidas</option><option value="txt">TXT · texto puro</option><option value="md">MD · Markdown básico</option><option value="rtf">RTF · editor de textos básico</option></select></div><button class="btn block" data-action="export-selected">⇩ Baixar no formato escolhido</button>${linked?`<div class="divider"></div><p class="mini">Também é possível baixar o documento do Google usando os conversores oficiais. Isto exporta o conteúdo que estiver <strong>sincronizado na nuvem</strong>, não alterações locais pendentes.</p><button class="btn subtle block" data-action="google-download-menu">Baixar versão do Google Docs…</button>`:''}<div class="divider"></div><button class="btn outline block" data-action="google-doc-menu">☁ Vincular ou sincronizar com Google Docs</button>`)}
function editorMore(){showDialog(`${modalHead('Opções do documento')}<div class="btn-group"><button class="btn subtle" data-action="save-doc">Salvar agora</button><button class="btn subtle" data-action="versions-panel">Versões</button><button class="btn subtle" data-action="el-outline">Estrutura do documento</button><button class="btn subtle" data-action="el-add-page-break">Inserir quebra de página</button><button class="btn subtle" data-action="el-page-settings">Margens e parágrafos</button><button class="btn subtle" data-action="el-templates">Modelos</button><button class="btn subtle" data-action="el-timer-dialog">Temporizador livre</button><button class="btn subtle" data-action="duplicate-doc">Duplicar documento</button><button class="btn subtle" data-action="export-menu">Exportar</button><button class="btn subtle" data-action="google-doc-menu">Google Docs / sincronizar</button></div><div class="divider"></div><p class="mini">Este documento é salvo localmente. Para manter uma cópia fora do celular, exporte-o ou faça um backup completo.</p><div class="btn-group"><button class="btn subtle" data-action="editor-reader">Ler este documento</button><button class="btn danger" data-action="delete-doc">Excluir documento</button></div>`)}
function moreFormatting(){showDialog(`${modalHead('Formatação de texto')}<p class="mini">Selecione o texto no editor antes de aplicar um estilo.</p><div class="grid2"><button class="btn subtle" data-special="blockquote">❝ Citação</button><button class="btn subtle" data-special="code">⌘ Código</button><button class="btn subtle" data-special="color">● Cor do texto</button><button class="btn subtle" data-special="hilite">▧ Marca-texto</button><button class="btn subtle" data-special="clear">✕ Limpar formatação</button><button class="btn subtle" data-special="sup">x² Sobrescrito</button><button class="btn subtle" data-special="sub">x₂ Subscrito</button></div>`)}
function imageOptions(){if(!selectedImage||!selectedImage.isConnected){flash('Toque em uma imagem dentro do texto para editá-la.');return}showDialog(`${modalHead('Editar imagem')}<p class="mini">Alterações de imagem acontecem nesta cópia do documento. Use backup antes de alterações grandes.</p><div class="field"><label>Descrição alternativa da imagem</label><input id="imageAlt" value="${esc(selectedImage.alt||'Imagem')}"></div><div class="field"><label>Largura no manuscrito (%)</label><input id="imageWidth" type="range" min="20" max="100" value="${parseInt(selectedImage.style.width,10)||100}"></div><div class="field"><label>Texto ao redor da imagem</label><select id="imageTextWrap"><option value="block">Acima e abaixo</option><option value="left" ${selectedImage.style.float==='left'?'selected':''}>Texto à direita da imagem</option><option value="right" ${selectedImage.style.float==='right'?'selected':''}>Texto à esquerda da imagem</option></select></div><div class="btn-group"><button class="btn subtle small-btn" data-action="image-rotate">↻ Girar 90°</button><button class="btn subtle small-btn" data-action="image-flip">↔ Espelhar</button><button class="btn subtle small-btn" data-action="image-gray">◐ Preto e branco</button></div><div class="field"><label>Brilho (ajuste permanente)</label><input id="imageBrightness" type="range" min="50" max="150" value="100"></div><div class="btn-group"><button class="btn subtle small-btn" data-action="image-apply-brightness">Aplicar brilho</button><button class="btn danger small-btn" data-action="image-delete">Remover imagem</button></div><div class="field"><label>Tolerância para remover fundo de cor uniforme</label><input id="imageBgTolerance" type="range" min="10" max="110" step="5" value="45"></div><button class="btn subtle block" data-action="image-remove-solid-bg">Remover fundo liso (pelas bordas)</button><p class="mini">Funciona melhor com fundos de uma única cor. O resultado é PNG transparente, salvo no manuscrito. NÃO é remoção de fundo por IA; fundos complexos exigem edição manual ou ferramentas futuras.</p><button class="btn block" data-action="image-save-options" style="margin-top:15px">Concluir edição</button>`)}
async function transformSelectedImage(action,brightness=100){let el=selectedImage;if(!el||!el.isConnected)return;let im=new Image();im.crossOrigin='anonymous';im.src=el.src;try{await new Promise((ok,bad)=>{im.onload=ok;im.onerror=bad});let canvas=document.createElement('canvas'),rotate=action==='rotate',ctx;canvas.width=rotate?im.naturalHeight:im.naturalWidth;canvas.height=rotate?im.naturalWidth:im.naturalHeight;if(canvas.width*canvas.height>12000000)throw Error('Imagem grande demais para edição');ctx=canvas.getContext('2d');if(rotate){ctx.translate(canvas.width,0);ctx.rotate(Math.PI/2)}if(action==='flip'){ctx.translate(canvas.width,0);ctx.scale(-1,1)}if(action==='gray')ctx.filter='grayscale(100%)';if(action==='brightness')ctx.filter=`brightness(${brightness}%)`;ctx.drawImage(im,0,0);snapshotDocument(doc(documentId),'Antes de editar imagem');el.src=canvas.toDataURL('image/png');saveDoc(false);flash('Imagem atualizada.')}catch(err){alert('Não foi possível editar esta imagem: '+err.message)}}
function findReplacePanel(){showDialog(`${modalHead('Localizar e substituir')}<form id="replaceForm"><div class="field"><label>Localizar</label><input name="find" required maxlength="180" placeholder="Texto que deseja encontrar"></div><div class="field"><label>Substituir por</label><input name="replacement" maxlength="200" placeholder="Novo texto (pode ficar vazio)"></div><p class="mini">Substitui texto dentro de cada bloco sem alterar títulos, negrito ou a estrutura. Expressões que atravessam formatações diferentes podem precisar de substituição manual.</p><button class="btn block">Substituir todas as ocorrências</button></form>`)}
function replaceAllInEditor(find,replacement){const area=$('#writingArea');if(!area||!find)return 0;let count=0;const walk=document.createTreeWalker(area,NodeFilter.SHOW_TEXT);let node;const pattern=new RegExp(find.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'gi');while(node=walk.nextNode()){let before=node.textContent||'';node.textContent=before.replace(pattern,()=>{count++;return replacement})}if(count){snapshotDocument(doc(documentId),'Antes de localizar e substituir');saveDoc(false)}return count}
async function removeSolidBackground(){const el=selectedImage;if(!el?.isConnected)return;const tolerance=Number($('#imageBgTolerance')?.value)||45;const img=new Image();img.crossOrigin='anonymous';img.src=el.src;try{await new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=reject});const w=img.naturalWidth,h=img.naturalHeight;if(!w||!h||w*h>1800000)throw Error('Imagem grande demais (limite de 1,8 milhão de pixels).');const cv=document.createElement('canvas');cv.width=w;cv.height=h;const ctx=cv.getContext('2d',{willReadFrequently:true});ctx.drawImage(img,0,0);const src=ctx.getImageData(0,0,w,h),pixels=src.data;const corner=[pixels[0],pixels[1],pixels[2]];let marked=new Uint8Array(w*h),queue=new Int32Array(w*h),head=0,tail=0;function tryPoint(idx){if(marked[idx])return;const p=idx*4,dr=pixels[p]-corner[0],dg=pixels[p+1]-corner[1],db=pixels[p+2]-corner[2];if(Math.sqrt(dr*dr+dg*dg+db*db)>tolerance)return;marked[idx]=1;queue[tail++]=idx}for(let x=0;x<w;x++){tryPoint(x);tryPoint((h-1)*w+x)}for(let y=0;y<h;y++){tryPoint(y*w);tryPoint(y*w+w-1)}while(head<tail){let i=queue[head++],x=i%w,y=(i/w)|0;if(x>0)tryPoint(i-1);if(x<w-1)tryPoint(i+1);if(y>0)tryPoint(i-w);if(y<h-1)tryPoint(i+w)}if(!tail){flash('Nenhum fundo uniforme detectado nas bordas.');return}for(let i=0;i<marked.length;i++)if(marked[i])pixels[i*4+3]=0;ctx.putImageData(src,0,0);snapshotDocument(doc(documentId),'Antes de remover fundo');el.src=cv.toDataURL('image/png');saveDoc(false);flash('Fundo liso removido. Use Versões para restaurar a imagem original.')}catch(e){alert('Não foi possível remover o fundo: '+e.message)}}
function findInReader(){const term=prompt('Buscar no texto:','');if(!term)return;const el=$('#readerText'),full=el.textContent||'',start=full.toLocaleLowerCase().indexOf(term.toLocaleLowerCase());if(start<0){flash('Texto não encontrado.');return}let walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT),node,pos=0,anchor=null;while(node=walker.nextNode()){let len=node.textContent.length;if(pos+len>start){anchor=node;break}pos+=len}if(!anchor)return;let range=document.createRange();range.setStart(anchor,start-pos);range.setEnd(anchor,Math.min(anchor.length,start-pos+term.length));const sel=getSelection();sel.removeAllRanges();sel.addRange(range);anchor.parentElement.scrollIntoView({behavior:'smooth',block:'center'});flash('Primeira ocorrência encontrada.');}
function readerOptions(){let p=data.preferences;showDialog(`${modalHead('Ajustes de leitura')}<div class="field"><label>Tema</label><select data-reader-pref="readerTheme"><option value="reader-sepia" ${p.readerTheme==='reader-sepia'?'selected':''}>Sépia</option><option value="reader-white" ${p.readerTheme==='reader-white'?'selected':''}>Branco</option><option value="reader-night" ${p.readerTheme==='reader-night'?'selected':''}>Noturno</option></select></div><div class="field"><label>Fonte</label><select data-reader-pref="readerFont"><option value="Georgia,serif" ${p.readerFont==='Georgia,serif'?'selected':''}>Clássica</option><option value="Arial,sans-serif" ${p.readerFont==='Arial,sans-serif'?'selected':''}>Sem serifa</option></select></div><div class="field"><label>Tamanho</label><input type="range" min="14" max="32" value="${p.readerFontSize}" data-reader-pref="readerFontSize"></div><div class="field"><label>Entrelinhas</label><input type="range" min="1.3" max="2.5" step="0.1" value="${p.readerLineHeight}" data-reader-pref="readerLineHeight"></div><div class="field"><label>Velocidade da leitura em voz alta</label><select data-reader-pref="readerSpeechRate">${[.75,1,1.25,1.5].map(v=>`<option value="${v}" ${Number(p.readerSpeechRate||1)===v?'selected':''}>${v}×</option>`).join('')}</select></div><div class="field"><label>Modo</label><select data-reader-pref="readerMode"><option value="continuous" ${p.readerMode==='continuous'?'selected':''}>Rolagem</option><option value="paged" ${p.readerMode==='paged'?'selected':''}>Páginas (experimental)</option></select></div><button class="btn block" data-action="reader-options-close">Aplicar e voltar à leitura</button>`)}
// Arquivos: exportar/importar com implementações locais, sem depender de CDN.
function filename(s){return String(s||'entrelinhas').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9-_ ]/gi,'').trim().replace(/\s+/g,'-').slice(0,70)||'entrelinhas'}
function download(blob,name){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.style.display='none';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),12000)}
function textOf(html){const node=document.createElement('div');node.innerHTML=sanitize(html||'');node.querySelectorAll('br').forEach(br=>br.replaceWith('\n'));node.querySelectorAll('p,div,h1,h2,h3,li,blockquote').forEach(el=>el.append(document.createTextNode('\n')));return (node.textContent||'').replace(/\n{3,}/g,'\n\n').trim()}
function xesc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&apos;'}[c]))}
const encoder=new TextEncoder(),decoder=new TextDecoder();
const u16=(v)=>new Uint8Array([v&255,(v>>8)&255]);const u32=v=>new Uint8Array([v&255,(v>>>8)&255,(v>>>16)&255,(v>>>24)&255]);
const join=(parts)=>{let len=parts.reduce((a,x)=>a+x.length,0),out=new Uint8Array(len),off=0;for(const part of parts){out.set(part,off);off+=part.length}return out};
const crcTable=(()=>{let t=[];for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;t[n]=c>>>0}return t})();
function crc32(bytes){let c=0xFFFFFFFF;for(let b of bytes)c=crcTable[(c^b)&255]^(c>>>8);return(c^0xFFFFFFFF)>>>0}
function zipStore(entries){let parts=[],central=[],offset=0,count=0;for(const [name,dataIn] of entries){const file=typeof dataIn==='string'?encoder.encode(dataIn):dataIn,nam=encoder.encode(name),crc=crc32(file),local=join([u32(0x04034b50),u16(20),u16(0),u16(0),u16(0),u16(0),u32(crc),u32(file.length),u32(file.length),u16(nam.length),u16(0),nam,file]);parts.push(local);central.push(join([u32(0x02014b50),u16(20),u16(20),u16(0),u16(0),u16(0),u16(0),u32(crc),u32(file.length),u32(file.length),u16(nam.length),u16(0),u16(0),u16(0),u16(0),u32(0),u32(offset),nam]));offset+=local.length;count++}const cd=join(central);return new Blob([...parts,cd,join([u32(0x06054b50),u16(0),u16(0),u16(count),u16(count),u32(cd.length),u32(offset),u16(0)])],{type:'application/zip'})}
// Limites aplicados *antes* e *durante* a descompactação de entradas não confiáveis.
const EL_ZIP_MAX_ENTRIES=600,EL_ZIP_MAX_ENTRY=12*1024*1024,EL_ZIP_MAX_TOTAL=48*1024*1024;
async function elZipInflateLimited(raw,method,expected){
 if(method===0){if(raw.length!==expected)throw Error('Tamanho ZIP inconsistente');return raw}
 if(method!==8||typeof DecompressionStream==='undefined')throw Error('Compactação ZIP não suportada');
 const reader=new Blob([raw]).stream().pipeThrough(new DecompressionStream('deflate-raw')).getReader();
 const chunks=[];let total=0;
 try{while(true){const {done,value}=await reader.read();if(done)break;total+=value.byteLength;
  if(total>EL_ZIP_MAX_ENTRY||total>expected){await reader.cancel().catch(()=>{});throw Error('Arquivo compactado excede o tamanho declarado');}
  chunks.push(value);
 }}finally{reader.releaseLock()}
 if(total!==expected)throw Error('Tamanho ZIP inconsistente');
 const out=new Uint8Array(total);let offset=0;for(const chunk of chunks){out.set(chunk,offset);offset+=chunk.byteLength}return out;
}
async function zipRead(file){
 if(!file||file.size>30*1024*1024)throw Error('ZIP acima do limite de 30 MB');
 const buffer=await file.arrayBuffer(),view=new DataView(buffer),bytes=new Uint8Array(buffer),entries=new Map();
 const assert=(ok)=>{if(!ok)throw Error('Arquivo ZIP inválido ou truncado')};
 let end=-1;for(let i=bytes.length-22;i>=Math.max(0,bytes.length-65557);i--){if(view.getUint32(i,true)===0x06054b50){end=i;break}}
 assert(end>=0&&end+22<=bytes.length);
 const count=view.getUint16(end+10,true),centralSize=view.getUint32(end+12,true);
 let pos=view.getUint32(end+16,true),totalSize=0;
 assert(count<=EL_ZIP_MAX_ENTRIES&&pos<=bytes.length&&centralSize<=bytes.length-pos&&pos+centralSize<=end);
 for(let j=0;j<count;j++){
  assert(pos+46<=bytes.length&&view.getUint32(pos,true)===0x02014b50);
  const method=view.getUint16(pos+10,true),flags=view.getUint16(pos+8,true),sz=view.getUint32(pos+20,true),uncompressed=view.getUint32(pos+24,true);
  const nameLen=view.getUint16(pos+28,true),extraLen=view.getUint16(pos+30,true),commentLen=view.getUint16(pos+32,true),local=view.getUint32(pos+42,true);
  assert(pos+46+nameLen+extraLen+commentLen<=bytes.length&&local+30<=bytes.length);
  if(flags&1)throw Error('ZIP protegido por senha não é suportado');
  if(method!==0&&method!==8)throw Error('Método ZIP não suportado');
  if(uncompressed>EL_ZIP_MAX_ENTRY||sz>30*1024*1024)throw Error('Entrada ZIP excede o limite');
  totalSize+=uncompressed;if(totalSize>EL_ZIP_MAX_TOTAL)throw Error('Conteúdo ZIP excessivo');
  const name=decoder.decode(bytes.subarray(pos+46,pos+46+nameLen));
  if(!name||name.startsWith('/')||name.includes('\\')||name.split('/').includes('..')||/[\x00-\x1f]/.test(name)||entries.has(name))throw Error('Nome ZIP inseguro ou duplicado');
  assert(view.getUint32(local,true)===0x04034b50);
  const lname=view.getUint16(local+26,true),lextra=view.getUint16(local+28,true),start=local+30+lname+lextra;
  assert(start<=bytes.length&&sz<=bytes.length-start);
  const localName=decoder.decode(bytes.subarray(local+30,local+30+lname));
  if(localName!==name)throw Error('Nomes ZIP inconsistentes');
  const raw=bytes.slice(start,start+sz);
  entries.set(name,()=>elZipInflateLimited(raw,method,uncompressed));
  pos+=46+nameLen+extraLen+commentLen;
 }
 assert(pos===view.getUint32(end+16,true)+centralSize);
 return entries;
}
function dataMedia(html){const root=document.createElement('div');root.innerHTML=sanitize(html||'');const bySrc=new Map();let total=0;for(const img of root.querySelectorAll('img')){const src=img.getAttribute('src')||'';const match=/^data:image\/(png|jpeg|gif);base64,([A-Za-z0-9+/=]+)$/i.exec(src);if(!match||bySrc.has(src))continue;const estimated=Math.floor(match[2].length*0.75);if(estimated>6*1024*1024||total+estimated>20*1024*1024)continue;try{const bin=atob(match[2]);const bytes=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)bytes[i]=bin.charCodeAt(i);const ext=match[1].toLowerCase()==='jpeg'?'jpg':match[1].toLowerCase();const index=bySrc.size+1;const dim=imageDimensions(bytes,ext);const width=Math.max(120,dim[0]),height=Math.max(120,dim[1]);const scale=Math.min(1,500/width,650/height);bySrc.set(src,{index,ext,bytes,mime:ext==='jpg'?'image/jpeg':'image/'+ext,width:Math.round(width*scale),height:Math.round(height*scale),rId:'rId'+(index+1),name:'imagem-'+index+'.'+ext});total+=bytes.length}catch(e){console.warn('Imagem ignorada no DOCX/EPUB',e)}}return bySrc}
function imageDimensions(bytes,ext){if(ext==='png'&&bytes.length>=24){const v=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength);return [v.getUint32(16),v.getUint32(20)]}if(ext==='gif'&&bytes.length>=10)return [bytes[6]+bytes[7]*256,bytes[8]+bytes[9]*256];if(ext==='jpg'){let i=2;while(i+9<bytes.length){if(bytes[i]!==255){i++;continue}const m=bytes[i+1];if([0xC0,0xC1,0xC2,0xC3].includes(m))return [bytes[i+7]*256+bytes[i+8],bytes[i+5]*256+bytes[i+6]];const len=bytes[i+2]*256+bytes[i+3];if(len<2)break;i+=2+len}}return [640,480]}
function wordDrawing(item){if(!item)return '<w:r><w:t>[Imagem: consultar original HTML]</w:t></w:r>';const cx=item.width*9525,cy=item.height*9525;return `<w:r><w:drawing><wp:inline distT="0" distB="0" distL="0" distR="0"><wp:extent cx="${cx}" cy="${cy}"/><wp:docPr id="${item.index}" name="${xesc(item.name)}"/><a:graphic><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:pic><pic:nvPicPr><pic:cNvPr id="${item.index}" name="${xesc(item.name)}"/><pic:cNvPicPr/></pic:nvPicPr><pic:blipFill><a:blip r:embed="${item.rId}"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill><pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${cx}" cy="${cy}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr></pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing></w:r>`}
function inlineRuns(el,fmt={},media=new Map()){if(el.nodeType===Node.TEXT_NODE){const t=el.textContent||'';if(!t)return'';let props=[fmt.b?'<w:b/>':'',fmt.i?'<w:i/>':'',fmt.u?'<w:u w:val="single"/>':'',fmt.s?'<w:strike/>':''].join('');return `<w:r>${props?'<w:rPr>'+props+'</w:rPr>':''}<w:t xml:space="preserve">${xesc(t)}</w:t></w:r>`}if(el.nodeType!==Node.ELEMENT_NODE)return'';let f={...fmt},n=el.tagName;if(['B','STRONG'].includes(n))f.b=true;if(['I','EM'].includes(n))f.i=true;if(n==='U')f.u=true;if(['S','DEL'].includes(n))f.s=true;if(n==='BR')return'<w:r><w:br/></w:r>';if(n==='IMG')return wordDrawing(media.get(el.getAttribute('src')));return[...el.childNodes].map(c=>inlineRuns(c,f,media)).join('')}
function wordXml(html,media=new Map()){const root=document.createElement('div');root.innerHTML=sanitize(html);const blocks=[];function para(el,style='',prefix=''){const ps=style?`<w:pPr><w:pStyle w:val="${style}"/></w:pPr>`:'';blocks.push(`<w:p>${ps}${prefix?`<w:r><w:t>${xesc(prefix)}</w:t></w:r>`:''}${[...el.childNodes].map(c=>inlineRuns(c,{},media)).join('')}</w:p>`)}for(const el of [...root.childNodes]){if(el.nodeType===Node.TEXT_NODE){if(el.textContent.trim())para({childNodes:[el]});continue}if(el.nodeType!==Node.ELEMENT_NODE)continue;if(['UL','OL'].includes(el.tagName)){let i=1;for(const li of el.children)para(li,'',el.tagName==='OL'?`${i++}. `:'• ')}else if(el.tagName==='TABLE'){let rows=[...el.querySelectorAll('tr')].map(tr=>`<w:tr>${[...tr.children].map(cell=>`<w:tc><w:p>${[...cell.childNodes].map(c=>inlineRuns(c,{},media)).join('')}</w:p></w:tc>`).join('')}</w:tr>`).join('');blocks.push(`<w:tbl>${rows}</w:tbl>`)}else if(el.tagName==='HR')blocks.push('<w:p><w:r><w:t>──────────</w:t></w:r></w:p>');else para(el,/^H[1-6]$/.test(el.tagName)?'Heading'+el.tagName.slice(1):'')}return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"><w:body>${blocks.join('')}<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440"/></w:sectPr></w:body></w:document>`}
function docxBlob(d){const media=dataMedia(d.html||''),types=[...new Set([...media.values()].map(x=>x.ext))].map(ext=>`<Default Extension="${ext}" ContentType="${ext==='jpg'?'image/jpeg':'image/'+ext}"/>`).join('');const rels=[...media.values()].map(m=>`<Relationship Id="${m.rId}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/${m.name}"/>`).join('');const entries=[['[Content_Types].xml',`<?xml version="1.0"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/>${types}<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>`],['_rels/.rels','<?xml version="1.0"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>'],['word/_rels/document.xml.rels',`<?xml version="1.0"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${rels}</Relationships>`],['word/document.xml',wordXml(d.html||'',media)]];for(const m of media.values())entries.push(['word/media/'+m.name,m.bytes]);return zipStore(entries)}
function epubBlob(d){const media=dataMedia(d.html||''),root=document.createElement('div');root.innerHTML=sanitize(d.html||'');const allowed=new Set(['P','DIV','SPAN','B','STRONG','I','EM','U','S','DEL','H1','H2','H3','H4','H5','H6','UL','OL','LI','BLOCKQUOTE','PRE','CODE','TABLE','TBODY','THEAD','TR','TD','TH','SUP','SUB']);function serial(node){if(node.nodeType===Node.TEXT_NODE)return xesc(node.textContent);if(node.nodeType!==Node.ELEMENT_NODE)return'';const tag=node.tagName;if(tag==='BR'||tag==='HR')return `<${tag.toLowerCase()}/>`;if(tag==='IMG'){const item=media.get(node.getAttribute('src'));return item?`<img src="images/${item.name}" alt="${xesc(node.getAttribute('alt')||'Imagem')}"/>`:'<span>[Imagem externa não incorporada]</span>'}if(!allowed.has(tag))return [...node.childNodes].map(serial).join('');const body=[...node.childNodes].map(serial).join('');return `<${tag.toLowerCase()}>${body}</${tag.toLowerCase()}>`};const article=[...root.childNodes].map(serial).join('')||'<p></p>';const content=`<?xml version="1.0" encoding="UTF-8"?><html xmlns="http://www.w3.org/1999/xhtml" xml:lang="pt-BR"><head><title>${xesc(d.title)}</title></head><body><h1>${xesc(d.title)}</h1>${article}</body></html>`;const imgManifest=[...media.values()].map(m=>`<item id="image${m.index}" href="images/${m.name}" media-type="${m.mime}"/>`).join('');const opf=`<?xml version="1.0" encoding="UTF-8"?><package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="id"><metadata xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:title>${xesc(d.title)}</dc:title><dc:language>pt-BR</dc:language><dc:identifier id="id">urn:uuid:${uid()}</dc:identifier></metadata><manifest><item id="content" href="text.xhtml" media-type="application/xhtml+xml"/><item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>${imgManifest}</manifest><spine><itemref idref="content"/></spine></package>`;const entries=[['mimetype','application/epub+zip'],['META-INF/container.xml','<?xml version="1.0"?><container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container"><rootfiles><rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/></rootfiles></container>'],['OEBPS/content.opf',opf],['OEBPS/text.xhtml',content],['OEBPS/nav.xhtml','<?xml version="1.0"?><html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops"><head><title>Índice</title></head><body><nav epub:type="toc"><ol><li><a href="text.xhtml">'+xesc(d.title)+'</a></li></ol></nav></body></html>']];for(const m of media.values())entries.push(['OEBPS/images/'+m.name,m.bytes]);return zipStore(entries)}
function markdownOf(html){const root=document.createElement('div');root.innerHTML=sanitize(html);const inline=n=>{if(n.nodeType===Node.TEXT_NODE)return n.textContent||'';if(n.nodeType!==Node.ELEMENT_NODE)return '';let t=[...n.childNodes].map(inline).join('');switch(n.tagName){case 'B':case 'STRONG':return '**'+t+'**';case 'I':case 'EM':return '*'+t+'*';case 'S':case 'DEL':return '~~'+t+'~~';case 'BR':return '\\n';case 'A':return '['+t+']('+((n.getAttribute('href')||'').replace(/[()]/g,''))+')';case 'IMG':return '![Imagem]('+((n.getAttribute('src')||'').startsWith('https:')?n.src:'imagem-local')+')';default:return t}};return [...root.childNodes].map(el=>{if(el.nodeType===Node.TEXT_NODE)return el.textContent;const tag=el.tagName;const t=inline(el);if(/^H[1-6]$/.test(tag))return '#'.repeat(Number(tag.slice(1)))+' '+t;if(tag==='LI')return '- '+t;if(tag==='HR')return '---';return t}).join('\\n\\n').replace(/\\n{4,}/g,'\\n\\n')}
function rtfOf(html){const text=textOf(html),escapeRTF=t=>[...t].map(c=>{const n=c.codePointAt(0);if(c==='\\\\'||c==='{'||c==='}')return '\\\\'+c;if(c==='\\n')return '\\\\par\\n';if(n>127){let signed=n>32767?n-65536:n;return '\\\\u'+signed+'?'}return c}).join('');return '{\\\\rtf1\\\\ansi\\\\deff0{\\\\fonttbl{\\\\f0 Georgia;}}\\\\f0\\\\fs24\\n'+escapeRTF(text)+'}'}
async function doExport(format,source=null){if(!source)saveDoc(false);const d=source||doc(documentId);if(!d)return;let basename=filename(d.title),html=`<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>${esc(d.title)}</title></head><body><h1>${esc(d.title)}</h1>${sanitize(d.html)}</body></html>`;try{if(format==='html')download(new Blob([html],{type:'text/html;charset=utf-8'}),basename+'.html');else if(format==='txt')download(new Blob([textOf(d.html)],{type:'text/plain;charset=utf-8'}),basename+'.txt');else if(format==='md')download(new Blob([markdownOf(d.html)],{type:'text/markdown;charset=utf-8'}),basename+'.md');else if(format==='rtf')download(new Blob([rtfOf(d.html)],{type:'application/rtf'}),basename+'.rtf');else if(format==='docx')download(docxBlob(d),basename+'.docx');else if(format==='epub')download(epubBlob(d),basename+'.epub');else if(format==='pdf'){const old=$('#printRoot');if(old)old.remove();let root=document.createElement('div');root.id='printRoot';root.innerHTML=`<h1>${esc(d.title)}</h1>${sanitize(d.html)}`;document.body.appendChild(root);window.addEventListener('afterprint',()=>root.remove(),{once:true});setTimeout(()=>window.print(),180)}closeDialog();if(format!=='pdf')flash('Arquivo preparado para download.')}catch(e){alert('Falha ao exportar: '+e.message)}}
async function importDocument(file){if(!file)return;if(file.size>20*1024*1024)throw Error('O limite por arquivo é 20 MB');let suffix=(file.name.split('.').pop()||'').toLowerCase(),html='';if(['txt','md'].includes(suffix)){html=(await file.text()).split(/\n\s*\n/).map(p=>`<p>${esc(p).replace(/\n/g,'<br>')}</p>`).join('')}else if(['html','htm'].includes(suffix)){const parsed=new DOMParser().parseFromString(await file.text(),'text/html');html=sanitize(parsed.body.innerHTML)}else if(suffix==='docx'){const entries=await zipRead(file),fn=entries.get('word/document.xml');if(!fn)throw Error('DOCX sem conteúdo de documento');const source=decoder.decode(await fn());if(/<!DOCTYPE|<!ENTITY/i.test(source))throw Error('XML com entidades externas não é permitido');const xml=new DOMParser().parseFromString(source,'application/xml');if(xml.querySelector('parsererror'))throw Error('XML de DOCX malformado');let ps=[...xml.getElementsByTagName('w:p')];html=ps.map(p=>{let runs=[...p.getElementsByTagName('w:r')].map(r=>{let t=[...r.getElementsByTagName('w:t')].map(n=>esc(n.textContent)).join('');if(r.getElementsByTagName('w:b').length)t='<strong>'+t+'</strong>';if(r.getElementsByTagName('w:i').length)t='<em>'+t+'</em>';if(r.getElementsByTagName('w:u').length)t='<u>'+t+'</u>';return t}).join('');const style=p.getElementsByTagName('w:pStyle')[0]?.getAttribute('w:val')||'';return /^Heading[1-3]$/.test(style)?`<h${style.slice(-1)}>${runs}</h${style.slice(-1)}>`:`<p>${runs}</p>`}).join('')}else if(suffix==='epub'){const entries=await zipRead(file),names=[...entries.keys()].filter(n=>/\.xhtml?$/.test(n)&&!/(nav|toc)\.xhtml?$/i.test(n));if(!names.length)throw Error('EPUB sem capítulos legíveis');names.sort();let parts=[];for(const name of names.slice(0,120)){let bytes=await entries.get(name)(),source=decoder.decode(bytes);if(/<!DOCTYPE|<!ENTITY/i.test(source))throw Error('EPUB contém entidades XML não permitidas');const parsed=new DOMParser().parseFromString(source,'application/xhtml+xml');if(parsed.querySelector('parsererror'))throw Error('XHTML de EPUB malformado');let body=parsed.getElementsByTagName('body')[0];if(body)parts.push(sanitize(body.innerHTML||new XMLSerializer().serializeToString(body)))}html=parts.join('<hr>')}else throw Error('Formato não suportado. Use TXT, HTML, DOCX ou EPUB.');let title=file.name.replace(/\.[^.]+$/,'');return createDocument(title,projectId,'importado',html)}
async function imageInput(file){if(!file||!file.type.startsWith('image/'))return;if(file.size>12*1024*1024){flash('Imagem grande demais; use até 12 MB.');return}const url=URL.createObjectURL(file),img=new Image();try{await new Promise((ok,bad)=>{img.onload=ok;img.onerror=bad;img.src=url});const max=1300,scale=Math.min(1,max/Math.max(img.naturalWidth,img.naturalHeight)),canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(img.naturalWidth*scale));canvas.height=Math.max(1,Math.round(img.naturalHeight*scale));canvas.getContext('2d').drawImage(img,0,0,canvas.width,canvas.height);const src=canvas.toDataURL(file.type==='image/png'||file.type==='image/webp'?'image/png':'image/jpeg',.76);$('#writingArea')?.focus();document.execCommand('insertHTML',false,`<img src="${src}" alt="Imagem inserida">`);saveDoc();flash('Imagem inserida. Confira o backup e o espaço disponível.')}catch(e){alert('Não foi possível inserir esta imagem.')}finally{URL.revokeObjectURL(url)}}
// Integração Google opcional: OAuth oficial. Token em memória; nunca guardar senha.
function hasGoogle(){return !!(oauthToken&&Date.now()<oauthExpiry)}
function deployChecklist(){
 const hosted=location.protocol==='https:'||location.hostname==='localhost';
 const sw='serviceWorker' in navigator;
 const origin=location.origin==='null'?'Arquivo local (sem origem HTTPS)':location.origin;
 const isStandalone=window.matchMedia?.('(display-mode: standalone)').matches||navigator.standalone===true;
 const currentGoogle=hasGoogle();
 const label=(ok,title,detail)=>`<div class="line"><strong>${ok?'✓':'○'} ${esc(title)}</strong><div class="mini">${esc(detail)}</div></div>`;
 showDialog(`${modalHead('Diagnóstico de instalação e Google')}
 <p class="mini">Esta tela verifica o ambiente do seu navegador. Não acessa seus documentos Google e não publica o aplicativo.</p>
 <div class="card">${label(hosted,'Origem segura',hosted?'HTTPS/localhost detectado.':'Abra uma versão publicada em HTTPS para instalar e usar o Google.')}
 ${label(sw,'Service Worker',sw?'Compatível com este navegador.':'Este navegador não oferece cache offline por Service Worker.')}
 ${label(isStandalone,'Instalado como aplicativo',isStandalone?'Executando em modo aplicativo.':'Você está no navegador; no Android use ⋮ → Instalar aplicativo após publicar.')}
 ${label(!!data.preferences.oauthClientId,'ID do cliente Google',data.preferences.oauthClientId?'ID configurado neste dispositivo.':'Crie um cliente OAuth Web no Google Cloud e cadastre esta origem.')}
 ${label(currentGoogle,'Autorização Google',currentGoogle?'Sessão Google ativa no navegador.':'Ainda não autorizada ou token expirado.')}
 ${label(saved,'Cópia local',displayStatus())}</div>
 <div class="field"><label>Origem exata para cadastrar em "Origens JavaScript autorizadas"</label><input readonly value="${esc(origin)}" id="deployOrigin" aria-label="Origem HTTPS atual"></div>
 <button class="btn block" data-action="copy-origin" ${!hosted?'disabled':''}>Copiar origem HTTPS</button>
 <button class="btn subtle block" data-action="google-help">Instruções Google</button>
 <p class="mini">Seu arquivo local não vira um APK automaticamente. A instalação PWA exige que os arquivos sejam publicados e abertos pelo Chrome.</p>`);
}
function googleHelp(){showDialog(`${modalHead('Como conectar Google Docs e Drive')}<p class="mini">A conexão exige uma página HTTPS publicada e sua própria configuração do Google Cloud. O arquivo HTML aberto pelo gerenciador de arquivos não pode autenticar via OAuth.</p><ol class="small" style="line-height:1.8"><li>Crie um projeto no <a href="https://console.cloud.google.com/" target="_blank" rel="noopener">Google Cloud Console</a>.</li><li>Ative as APIs <strong>Google Drive</strong> e <strong>Google Docs</strong> e configure a tela de consentimento OAuth.</li><li>Crie um <strong>Cliente OAuth 2.0 para aplicativo Web</strong>. Em “Origens JavaScript autorizadas”, use exatamente a origem da tela <strong>Verificar meu Entrelinhas</strong> (sem caminho, sem barra final).</li><li>Inclua sua conta como usuária de teste, se o app estiver em modo de teste. Autorize as permissões drive.file (documentos selecionados) e drive.appdata (cópias privadas criptografadas).</li><li>Copie o ID de cliente para Ajustes → Google Docs e Drive e toque em “Conectar Google”.</li></ol><p class="mini">A solicitação de leitura do Drive pode exigir revisão/verificação pelo Google se o aplicativo for publicado para outras pessoas. Na versão pessoal, importar pelo seletor de arquivos do Android pode ser mais simples.</p><p><a href="https://developers.google.com/workspace/drive/api/quickstart/js" target="_blank" rel="noopener">Instruções oficiais do Google Drive</a></p><button class="btn block" data-action="close-dialog">Entendi</button>`)}
async function loadGoogle(){if(window.google?.accounts?.oauth2)return;await new Promise((resolve,reject)=>{let script=document.createElement('script');script.src='https://accounts.google.com/gsi/client';script.async=true;script.onload=resolve;script.onerror=()=>reject(Error('Não foi possível carregar a autenticação Google.'));document.head.appendChild(script)})}
async function connectGoogle(){if(!data.preferences.oauthClientId){googleHelp();return}if(!/^https:$/.test(location.protocol)&&location.hostname!=='localhost'){googleHelp();return}if(hasGoogle()){await googleList();return}try{await loadGoogle();if(!confirm('A conexão com Google ainda está em testes de segurança. Recomendamos usar uma conta de testes com documentos fictícios. Continuar?'))return;const client=google.accounts.oauth2.initTokenClient({client_id:data.preferences.oauthClientId,scope:'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.appdata',callback:async result=>{if(result.error||!result.access_token){flash('O Google não autorizou o acesso.');return}oauthToken=result.access_token;oauthExpiry=Date.now()+(Number(result.expires_in||3000)-60)*1000;flash('Conta conectada nesta sessão.');await googleList();googlePoll().catch(console.warn)}});client.requestAccessToken({prompt:'consent'})}catch(e){alert('Falha na conexão Google: '+e.message)}}
async function googleApi(path,options={}){if(!hasGoogle())throw Error('A sessão Google expirou. Conecte novamente.');const url=new URL(path,location.href);if(url.protocol!=='https:'||!['www.googleapis.com','docs.googleapis.com','upload.googleapis.com'].includes(url.hostname)||url.username||url.password)throw Error('Destino de API Google não autorizado');const r=await fetch(url.href,{...options,redirect:'error',credentials:'omit',referrerPolicy:'no-referrer',headers:{...options.headers,Authorization:`Bearer ${oauthToken}`}});if(!r.ok){const err=await r.text();throw Error(`Google (${r.status}): ${err.slice(0,240)}`)}return r}
async function googleList(){if(!hasGoogle()){await connectGoogle();return}showDialog(`${modalHead('Meus arquivos do Google Drive')}<p class="mini">Importar cria uma cópia local, inicialmente apenas para leitura da nuvem. Para sincronizar alterações, crie um novo documento vinculado pelo editor. Seus originais permanecem protegidos.</p><p class="mini">Carregando documentos…</p>`);try{const q=encodeURIComponent("trashed = false and (mimeType = 'application/vnd.google-apps.document' or mimeType = 'text/plain' or mimeType = 'text/html')");let res=await googleApi(`https://www.googleapis.com/drive/v3/files?pageSize=100&fields=nextPageToken,files(id,name,mimeType,webViewLink)&q=${q}&orderBy=modifiedTime%20desc`),body=await res.json();googleFiles=body.files||[];showDialog(`${modalHead('Meus arquivos do Google Drive')}<p class="mini">${googleFiles.length} documento(s) visível(is) nesta consulta. Clique em importar para criar uma cópia local. Nenhum original será alterado.</p><div class="note-list-scroll">${googleFiles.map(f=>`<div class="line row"><div class="grow"><strong>${esc(f.name)}</strong><div class="tiny muted">${f.mimeType==='application/vnd.google-apps.document'?'Google Docs':'Documento'}</div></div><button class="btn small-btn" data-google-import="${esc(f.id)}">Importar</button>${f.webViewLink?`<a href="${esc(f.webViewLink)}" target="_blank" rel="noopener" class="small">Abrir</a>`:''}</div>`).join('')||'<p class="empty">Nenhum arquivo compatível apareceu. Importe um documento do seletor do celular se preferir.</p>'}</div>`)}catch(e){showDialog(`${modalHead('Google Drive')}<p class="empty">${esc(e.message)}</p><button class="btn subtle" data-action="google-connect">Tentar novamente</button>`)}}
async function importGoogle(id){let item=googleFiles.find(f=>f.id===id);if(!item)return;showDialog(`${modalHead('Importando do Google Drive')}<p class="mini">Lendo ${esc(item.name)}…</p>`);try{let url=item.mimeType==='application/vnd.google-apps.document'?`https://www.googleapis.com/drive/v3/files/${encodeURIComponent(id)}/export?mimeType=text%2Fplain`:`https://www.googleapis.com/drive/v3/files/${encodeURIComponent(id)}?alt=media`;let resp=await googleApi(url),t=await resp.text(),html='<p>'+esc(t).replace(/\n\s*\n/g,'</p><p>').replace(/\n/g,'<br>')+'</p>';let d=createDocument(item.name,projectId,'importado',html);d.googleDocId=id;d.googleLink={id,mode:'readonly',status:'somente-leitura'};persist(false);closeDialog();setupDoc(d);flash('Cópia importada. Original preservado.')}catch(e){alert('Importação Google falhou: '+e.message)}}
async function uploadGoogle(){saveDoc(false);const d=doc(documentId);if(!d)return;if(!hasGoogle()){googleHelp();return}if(!confirm('Criar um NOVO documento no Google Drive? O original não será substituído. A formatação avançada pode sofrer alterações.'))return;try{const boundary='entrelinhas_'+Date.now(),metadata={name:d.title,mimeType:'application/vnd.google-apps.document'},body=`--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(metadata)}\r\n--${boundary}\r\nContent-Type: text/html; charset=UTF-8\r\n\r\n${sanitize(d.html)}\r\n--${boundary}--`;const resp=await googleApi('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink',{method:'POST',headers:{'Content-Type':`multipart/related; boundary=${boundary}`},body}),created=await resp.json();closeDialog();if(created.id){d.lastUploadedGoogleId=created.id;persist(false);if(confirm('Cópia criada no Google Drive. Abrir agora no Google Docs?'))window.open('https://docs.google.com/document/d/'+encodeURIComponent(created.id)+'/edit','_blank','noopener')}else flash('Arquivo enviado ao Google Drive.')}catch(e){alert('Envio ao Drive falhou: '+e.message)}}

// Sincronização conservadora: somente texto simples, sempre com checagem de revisão.
// Tokens OAuth permanecem na memória, nunca nos backups.
const GOOGLE_MIME={pdf:['application/pdf','pdf'],docx:['application/vnd.openxmlformats-officedocument.wordprocessingml.document','docx'],epub:['application/epub+zip','epub'],odt:['application/vnd.oasis.opendocument.text','odt'],rtf:['application/rtf','rtf'],txt:['text/plain','txt']};
function plainTextMarkup(html){const el=document.createElement('div');el.innerHTML=sanitize(html||'');return !el.querySelector('img,table,ul,ol,blockquote,pre,code,h1,h2,h3,h4,h5,h6,b,strong,i,em,u,s,del,a,sup,sub,hr,span');}
function htmlFromPlain(text){const clean=String(text||'').replace(/\r\n?/g,'\n');return clean.split(/\n{2,}/).map(block=>'<p>'+esc(block).replace(/\n/g,'<br>')+'</p>').join('')||'<p></p>'}
function googleDocInfo(json){const body=json.body?.content;if(!Array.isArray(body)||Array.isArray(json.tabs)&&json.tabs.length>1)throw Error('Documentos com múltiplas abas não são compatíveis com a sincronização desta versão.');let text='',rich=false;for(const el of body){if(el.table||el.tableOfContents||el.sectionBreak?.sectionStyle) {if(el.table||el.tableOfContents)rich=true;continue}const p=el.paragraph;if(!p)continue;if(p.bullet||p.paragraphStyle?.namedStyleType&&!['NORMAL_TEXT'].includes(p.paragraphStyle.namedStyleType))rich=true;for(const item of p.elements||[]){if(item.inlineObjectElement||item.person||item.richLink)rich=true;const r=item.textRun;if(r){text+=r.content||'';if(r.textStyle&&Object.keys(r.textStyle).length)rich=true}}}return {text:text.replace(/\n$/,''),revision:json.revisionId||'',endIndex:body.at(-1)?.endIndex||2,rich};}
function googleStatus(d){const l=d?.googleLink;if(!l)return 'Não vinculado';if(l.mode==='readonly')return 'Cópia local · original protegido';return ({sincronizado:'☁ Sincronizado',pendente:'◷ Pendente',enviando:'↻ Sincronizando',conflito:'⚠ Conflito — escolha qual versão manter',formato:'⚠ Contém formatação não compatível',offline:'◷ Aguardando conexão',erro:'⚠ Falha na sincronização',autenticacao:'⚠ Reconecte sua conta'})[l.status]||'☁ Vinculado'}
function googleDocumentMenu(){const d=doc(documentId);if(!d)return;const l=d.googleLink;const cloud=hasGoogle();showDialog(`${modalHead('Google Docs · '+d.title)}
<p class="mini">${esc(googleStatus(d))}. A sincronização da versão 0.6 preserva somente <strong>texto simples</strong> e funciona apenas com documentos criados e vinculados por este aplicativo. Seus textos locais são salvos mesmo sem conexão.</p>
${l?`<div class="card"><strong>Documento vinculado</strong><p class="small">${esc(l.id)}</p><a target="_blank" rel="noopener" href="https://docs.google.com/document/d/${encodeURIComponent(l.id)}/edit">Abrir no Google Docs</a></div>`:''}
${!cloud?'<p class="mini">Conta não autorizada nesta sessão. Para ativar a sincronização, conecte o Google em uma página HTTPS autorizada.</p><button class="btn block" data-action="google-connect">Conectar conta Google</button>':''}
<div class="btn-group">
${cloud&&!l?'<button class="btn" data-action="google-create-linked">Criar documento vinculado</button>':''}
${cloud&&l?.mode==='sync'?'<button class="btn" data-action="google-sync-now">Sincronizar agora</button><button class="btn subtle" data-action="google-download-menu">Baixar do Google</button>':''}
${cloud&&l?.mode==='readonly'?'<button class="btn subtle" data-action="google-fetch-readonly">Atualizar cópia do original</button><button class="btn" data-action="google-create-linked">Criar minha própria cópia sincronizável</button>':''}
${['conflito','formato'].includes(l?.status)?'<button class="btn danger" data-action="google-resolve">Resolver diferença</button>':''}
${l?'<button class="btn subtle" data-action="google-unlink">Desvincular deste manuscrito</button>':''}
<button class="btn subtle" data-action="google-help">Como configurar</button>
</div><p class="mini">A cada alteração salva, o Entrelinhas tenta sincronizar após alguns segundos, enquanto estiver aberto e autorizado. Ele também procura atualizações do Docs periodicamente. Nunca substitui edições simultâneas automaticamente.</p>`)}
async function googleGetDocument(id){const r=await googleApi(`https://docs.googleapis.com/v1/documents/${encodeURIComponent(id)}`);return googleDocInfo(await r.json())}
function markGoogle(d,status){if(!d?.googleLink)return;d.googleLink.status=status;persist(false);if(view==='editor'&&documentId===d.id){const el=$('#googleSyncStatus');if(el)el.textContent=googleStatus(d)}}
function scheduleGoogleSync(id){const d=doc(id);if(!d?.googleLink||d.googleLink.mode!=='sync'||d.googleLink.status==='conflito')return;clearTimeout(googleSyncTimers.get(id));markGoogle(d,hasGoogle()?'pendente':'autenticacao');const timer=setTimeout(()=>{googleSyncTimers.delete(id);if(hasGoogle())syncGoogleDocument(id).catch(err=>console.warn('Sync falhou:',err))},6500);googleSyncTimers.set(id,timer)}
async function googleCreateLinked(){if(view==='editor')saveDoc(false);const d=doc(documentId);if(!d)return;if(!hasGoogle()){googleDocumentMenu();return}
if(!plainTextMarkup(d.html)){flash('Este manuscrito possui formatação/imagens. Para não perdê-las, crie uma cópia em texto simples antes de sincronizar.',5800);return}
if(!confirm('Criar um NOVO Google Docs vinculado a este manuscrito? A sincronização desta versão é somente de texto simples. Suas outras cópias no Drive ficarão intactas.'))return;
try{const response=await googleApi('https://docs.googleapis.com/v1/documents',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({title:d.title})});const created=await response.json();if(!created.documentId)throw Error('Google não retornou um ID de documento');const link={id:created.documentId,mode:'sync',baseText:'',revision:'',status:'pendente',createdByEntrelinhas:true};d.googleLink=link;d.googleDocId=created.documentId;persist(false);closeDialog();await syncGoogleDocument(d.id);googleDocumentMenu();flash('Novo documento vinculado ao Entrelinhas.')}catch(e){alert('Não foi possível criar o documento: '+e.message)}
}
async function syncGoogleDocument(id,{manual=false}={}){const d=doc(id),l=d?.googleLink;if(!d||!l||l.mode!=='sync')return;if(googleSyncBusy.has(id))return;if(l.status==='conflito'&&!manual)return;
if(!hasGoogle()){markGoogle(d,'autenticacao');return}if(!navigator.onLine){markGoogle(d,'offline');return}
if(view==='editor'&&documentId===id)saveDoc(false);
googleSyncBusy.add(id);markGoogle(d,'enviando');try{const r=await googleGetDocument(l.id),local=textOf(d.html),base=String(l.baseText??''),remote=r.text,lc=local!==base,rc=remote!==base;
 if((lc&&rc&&local!==remote)||(r.rich&&(lc||rc))){l.conflictRemoteText=remote;l.conflictRemoteRevision=r.revision;markGoogle(d,r.rich?'formato':'conflito');if(manual)googleDocumentMenu();else flash('Há alterações diferentes no Google Docs. Nenhuma versão foi substituída.',6500);return}
 if(rc&&!lc){if(view==='editor'&&documentId===id){saveDoc(false);if(textOf(d.html)!==local){markGoogle(d,'pendente');return}}snapshotDocument(d,'Antes de atualizar do Google Docs');d.html=htmlFromPlain(remote);d.updatedAt=now();l.baseText=remote;l.revision=r.revision;delete l.conflictRemoteText;markGoogle(d,'sincronizado');if(view==='editor'&&documentId===id)renderEditor();if(manual)flash('Atualizações recebidas do Google Docs.');return}
 if(lc&&!rc){if(!plainTextMarkup(d.html)){markGoogle(d,'formato');if(manual)flash('Este manuscrito possui formatação. Exporte em DOCX/HTML ou crie cópia simples.',5500);return}
 const requests=[];if(r.endIndex>2)requests.push({deleteContentRange:{range:{startIndex:1,endIndex:r.endIndex-1}}});if(local)requests.push({insertText:{location:{index:1},text:local}});
 if(requests.length){const body={requests};if(r.revision)body.writeControl={requiredRevisionId:r.revision};await googleApi(`https://docs.googleapis.com/v1/documents/${encodeURIComponent(l.id)}:batchUpdate`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});}
 const confirmed=await googleGetDocument(l.id);if(confirmed.text!==local)throw Error('O Google retornou conteúdo diferente do enviado. Aguardando conferência.');if(view==='editor'&&documentId===id)saveDoc(false);const nextLocal=textOf(d.html);l.baseText=local;l.revision=confirmed.revision;delete l.conflictRemoteText;markGoogle(d,nextLocal===local?'sincronizado':'pendente');if(nextLocal!==local)scheduleGoogleSync(id);if(manual)flash('Alterações enviadas ao Google Docs.');return}
 l.baseText=local;l.revision=r.revision;delete l.conflictRemoteText;markGoogle(d,'sincronizado');if(manual)flash('Tudo sincronizado com Google Docs.');
 }catch(e){markGoogle(d,e.message.includes('(401)')||e.message.includes('(403)')?'autenticacao':'erro');if(manual)alert('Sincronização não concluída. O texto local foi preservado. '+e.message);else console.warn('Sincronização Google:',e.message)}finally{googleSyncBusy.delete(id)}
}
async function googleFetchReadonly(){const d=doc(documentId),l=d?.googleLink;if(!l||!hasGoogle())return;try{const remote=await googleGetDocument(l.id);if(!confirm('Atualizar sua CÓPIA local com o texto do original? A versão atual será guardada no histórico. A formatação complexa do Google não será importada.'))return;snapshotDocument(d,'Antes de atualizar cópia Google');d.html=htmlFromPlain(remote.text);d.updatedAt=now();persist(false);closeDialog();renderEditor();flash('Texto do original atualizado na cópia local.')}catch(e){alert('Não foi possível atualizar: '+e.message)}}
function googleResolve(){const d=doc(documentId),l=d?.googleLink;if(!l||!['conflito','formato'].includes(l.status))return;showDialog(`${modalHead('Conflito entre manuscritos')}<p class="mini">Há diferenças entre a versão local e a versão no Google Docs, ou formatação que a sincronização simples não consegue preservar. Nenhum texto foi substituído automaticamente.</p><div class="btn-group"><button class="btn" data-action="google-keep-both">Manter cópia local e atualizar do Docs</button><button class="btn subtle" data-action="google-keep-local">Manter texto local e substituir texto no Docs (somente texto)</button><button class="btn subtle" data-action="google-cancel-conflict">Cancelar</button></div><p class="mini">A segunda opção pode remover a formatação do documento no Google. Para preservar estilos e imagens, prefira manter duas cópias e revisar manualmente.</p>`)}
async function resolveGoogleConflict(which){const d=doc(documentId),l=d?.googleLink;if(!l||!hasGoogle())return;try{const r=await googleGetDocument(l.id);if(which==='remote'){const copy=createDocument(d.title+' — versão local preservada',d.projectId,d.kind,d.html);snapshotDocument(copy,'Cópia de segurança antes de conflito Google');snapshotDocument(d,'Antes de resolver conflito');d.html=htmlFromPlain(r.text);d.updatedAt=now();l.baseText=r.text;l.revision=r.revision;delete l.conflictRemoteText;markGoogle(d,'sincronizado');closeDialog();renderEditor();flash('Versão local guardada como cópia independente.');return}
 if(!plainTextMarkup(d.html)){flash('Seu manuscrito contém formatação. Duplique uma versão simples antes de enviar.',5500);return}
 if(!confirm('Substituir o TEXTO do documento no Google? A formatação existente no Google pode ser removida. Não é possível desfazer essa operação pelo Entrelinhas.'))return;
 const local=textOf(d.html);const requests=[];if(r.endIndex>2)requests.push({deleteContentRange:{range:{startIndex:1,endIndex:r.endIndex-1}}});if(local)requests.push({insertText:{location:{index:1},text:local}});if(requests.length)await googleApi(`https://docs.googleapis.com/v1/documents/${encodeURIComponent(l.id)}:batchUpdate`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({requests,writeControl:{requiredRevisionId:r.revision}})});const confirmed=await googleGetDocument(l.id);if(confirmed.text!==local)throw Error('O Google não confirmou o mesmo texto');l.baseText=local;l.revision=confirmed.revision;delete l.conflictRemoteText;markGoogle(d,'sincronizado');closeDialog();flash('Conflito resolvido; texto enviado.')}catch(e){markGoogle(d,'conflito');alert('Não foi possível resolver. Seus textos foram preservados. '+e.message)}}
function googleDownloadMenu(){const d=doc(documentId),l=d?.googleLink?.id||d?.googleDocId;if(!l)return;showDialog(`${modalHead('Baixar do Google Docs')}<p class="mini">Formato gerado pelo Google a partir da <strong>versão na nuvem</strong>. Alterações pendentes do Entrelinhas não entram no arquivo até serem sincronizadas.</p><div class="field"><label for="googleExportFormat">Formato</label><select id="googleExportFormat">${Object.keys(GOOGLE_MIME).map(k=>`<option value="${k}">${k.toUpperCase()}</option>`).join('')}</select></div><button class="btn block" data-action="google-download">⇩ Baixar documento do Google</button><button class="btn subtle block" data-action="google-doc-menu">Voltar</button>`)}
async function googleDownload(){const d=doc(documentId),id=d?.googleLink?.id||d?.googleDocId,k=$('#googleExportFormat')?.value;if(!id||!GOOGLE_MIME[k])return;if(!hasGoogle()){flash('Conecte sua conta Google primeiro.');return}const [mime,ext]=GOOGLE_MIME[k];try{const u=`https://www.googleapis.com/drive/v3/files/${encodeURIComponent(id)}/export?mimeType=${encodeURIComponent(mime)}`;const r=await googleApi(u);const blob=await r.blob();download(blob,filename(d.title)+'-google.'+ext);closeDialog();flash('Arquivo Google enviado para download.')}catch(e){alert('Falha na exportação do Google: '+e.message)}}
async function googlePoll(){if(!hasGoogle()||document.hidden||googlePollBusy||!navigator.onLine)return;googlePollBusy=true;try{for(const d of data.documents.filter(x=>x.googleLink?.mode==='sync').slice(0,12)){if(d.googleLink.status==='conflito'||d.googleLink.status==='formato')continue;await syncGoogleDocument(d.id)}}finally{googlePollBusy=false}}
setInterval(()=>googlePoll().catch(e=>console.warn('Google poll:',e)),30000);
window.addEventListener('online',()=>googlePoll().catch(()=>{}));
window.addEventListener('focus',()=>googlePoll().catch(()=>{}));
// Eventos de controles: todos os botões visíveis executam uma ação real ou explicam configuração.
let lastEditorRange=null;
// Segurança: HTML da área de transferência nunca é inserido pelo navegador sem tratamento.
// Editor e Diário mantêm a formatação permitida; outros campos permanecem texto simples.
function elEditableTarget(node){return node?.closest?.('#writingArea[contenteditable="true"], #notePageBody[contenteditable="true"]')||null}
function elInsertSafePaste(target,html,text){
 const clean=html?sanitize(html):'';
 target.focus();
 if(clean){document.execCommand('insertHTML',false,clean)}
 else{document.execCommand('insertText',false,text||'')}
 // Dispara o autosave existente, sem substituir o conteúdo anterior.
 target.dispatchEvent(new Event('input',{bubbles:true}));
}
document.addEventListener('paste',event=>{
 const target=elEditableTarget(event.target);
 if(!target)return;
 event.preventDefault();
 const clip=event.clipboardData;
 try{
  const html=clip?.getData('text/html')||'',text=clip?.getData('text/plain')||'';
  if(html.length>8*1024*1024||text.length>8*1024*1024)throw Error('Texto colado muito grande');
  elInsertSafePaste(target,html,text);
 }catch(err){flash('Colagem recusada por segurança: '+err.message)}
},true);
document.addEventListener('drop',event=>{
 const target=elEditableTarget(event.target);
 if(!target)return;
 event.preventDefault();
 // Evita abrir ou inserir um arquivo externo arrastado diretamente para a área editável.
 if(event.dataTransfer?.files?.length){flash('Para inserir arquivos, use Importar ou Inserir imagem.');return}
 const text=event.dataTransfer?.getData('text/plain')||'';
 if(text.length>8*1024*1024){flash('Texto arrastado muito grande');return}
 try{elInsertSafePaste(target,'',text)}catch(_){flash('Não foi possível inserir o texto arrastado.')}
},true);
document.addEventListener('selectionchange',()=>{const sel=getSelection();if(!sel||!sel.rangeCount)return;const r=sel.getRangeAt(0);if(view==='editor'&&$('#writingArea')?.contains(r.commonAncestorContainer))lastEditorRange=r.cloneRange();if(((view==='editor'&&$('#writingArea')?.contains(r.commonAncestorContainer))||(view==='note'&&noteMode==='edit'&&$('#notePageBody')?.contains(r.commonAncestorContainer)))&&!sel.isCollapsed){savedTextRange=r.cloneRange();savedTextScope=view==='editor'?'doc':'note'}if(view==='reader'){const current=readerGetSelection();if(current)readerSelection=current}});
document.addEventListener('mousedown',e=>{if(e.target.closest('[data-command],[data-block],[data-note-format],[data-note-heading],[data-action=apply-selection-typography]'))e.preventDefault()});
function editorCommand(command,value=null){const area=$('#writingArea');if(!area)return;area.focus();if(lastEditorRange){const sel=getSelection();sel.removeAllRanges();sel.addRange(lastEditorRange)}document.execCommand(command,false,value);saveDoc()}
function backFromReader(){stopSpeech();readProgress();clearTimeout(scrollTimer);persist(false);resetUI();tab='leitura';render()}
function backFromEditor(){timerPause();saveDoc(false);resetUI();tab='escrita';render()}
document.addEventListener('click',event=>{const btn=event.target.closest?.('[data-transfer-file]');if(!btn)return;event.preventDefault();event.stopImmediatePropagation();elTransferDownload(btn.dataset.transferFile);},true);
document.addEventListener('click',event=>{const b=event.target.closest?.('[data-action],[data-el-template]');if(!b)return;const a=b.dataset.action;if(b.dataset.elTemplate!==undefined){event.stopImmediatePropagation();elApplyTemplate(Number(b.dataset.elTemplate));return}if(!['el-page-settings','el-templates','el-save-template','el-timer-dialog','el-timer-toggle','el-timer-reset'].includes(a))return;event.stopImmediatePropagation();if(a==='el-page-settings')elPageSettings();if(a==='el-templates')elTemplateMenu();if(a==='el-save-template')elSaveTemplate();if(a==='el-timer-dialog')elTimerDialog();if(a==='el-timer-toggle')elToggleTimer();if(a==='el-timer-reset')elResetTimer();},true);
document.addEventListener('submit',event=>{if(event.target.id!=='elPageForm')return;event.preventDefault();event.stopImmediatePropagation();elStorePage(Object.fromEntries(new FormData(event.target).entries()))},true);
document.addEventListener('click',async e=>{if(e.target.matches?.('#writingArea img')){selectedImage=e.target;imageOptions();return}let target=e.target.closest('button,[data-export],[data-jump-mark],[data-google-import],[data-restore-version]');if(!target)return;const d=target.dataset;
if(d.tab){if(view==='editor')saveDoc(false);if(view==='reader')readProgress();resetUI();tab=d.tab;projectId=null;render();scrollTo(0,0);return}
if(d.moveDoc){moveDocument(d.moveDoc,Number(d.direction));return}
if(d.project){projectId=d.project;tab='projetos';render();scrollTo(0,0);return}
if(d.trashRestore){restoreTrash(d.trashRestore);return}
if(d.restoreVersion){const current=doc(documentId),v=current?.versions?.find(x=>x.id===d.restoreVersion);if(current&&v&&confirm('Restaurar esta versão? O estado atual será salvo como ponto de recuperação.')){const restored={...v};snapshotDocument(current,'Antes de restaurar versão');current.title=restored.title;current.html=restored.html;current.updatedAt=now();persist(false);closeDialog();renderEditor();flash('Versão recuperada.')}return}
if(d.editDoc){const chosen=doc(d.editDoc);if(chosen)setupDoc(chosen);return}
if(d.readDoc){if(doc(d.readDoc)){stopSpeech();documentId=d.readDoc;view='reader';render()}return}
if(d.openNote){openNote(d.openNote);return}
if(d.editNote){openNote(d.editNote);return}
if(d.noteCommentDelete){const n=noteById(activeNoteId);if(n&&confirm('Excluir esta nota de leitura?')){n.comments=(n.comments||[]).filter(c=>c.id!==d.noteCommentDelete);persist(false);render();}return}
if(d.noteRestore){const n=noteById(activeNoteId),v=noteVersions(n||{}).find(x=>x.id===d.noteRestore);if(n&&v&&confirm('Restaurar esta versão da página?')){noteSnapshot(n);Object.assign(n,{title:v.title,body:v.body,html:v.html,fields:{...v.fields},tags:[...v.tags],status:v.status,blocks:structuredClone(v.blocks||[]),links:[...(v.links||[])],updatedAt:now()});persist(false);closeDialog();noteMode='read';render();flash('Versão restaurada.')}return}
if(d.editProject){projectForm(project(d.editProject));return}
if(d.editSession){sessionForm(data.sessions.find(s=>s.id===d.editSession));return}
if(d.themePick){data.preferences.theme=d.themePick;data.preferences.accent=null;persist();return}
if(d.accent){data.preferences.accent=d.accent;persist();return}
if(d.cover){chosenColor=d.cover;document.querySelectorAll('[data-cover]').forEach(el=>el.classList.toggle('active',el.dataset.cover===chosenColor));return}
if(d.kind){sessionKind=d.kind;document.querySelectorAll('[data-kind]').forEach(el=>el.classList.toggle('active',el.dataset.kind===sessionKind));return}
if(d.filter){noteFilter=d.filter;diaryQuery='';render();return}
if(d.noteUnlink){const n=noteById(activeNoteId);if(n){if(noteMode==='edit')saveNotePage(false);n.links=noteLinks(n).filter(id=>id!==d.noteUnlink);persist(false);render()}return}
if(d.blockUp||d.blockDown){const n=noteById(activeNoteId);if(n){saveNotePage(false);const blocks=noteBlocks(n),i=blocks.findIndex(b=>b.id===(d.blockUp||d.blockDown)),j=i+(d.blockUp?-1:1);if(i>=0&&j>=0&&j<blocks.length){[blocks[i],blocks[j]]=[blocks[j],blocks[i]];n.updatedAt=now();persist(false);render()}}return}
if(d.blockDelete){const n=noteById(activeNoteId);if(n&&confirm('Excluir este bloco da escaleta?')){saveNotePage(false);n.blocks=noteBlocks(n).filter(b=>b.id!==d.blockDelete);persist(false);render()}return}
if(d.blockScene){const n=noteById(activeNoteId);if(n){saveNotePage(false);const b=noteBlocks(n).find(b=>b.id===d.blockScene);if(b){const scene=createRelatedNote(n,'cena',b.title||'Cena da escaleta',{resumo:b.summary||'',objetivo:b.goal||'',obstaculo:b.conflict||'',consequencia:b.outcome||'',pov:b.pov||'',local:b.place||''});openNote(scene.id,'edit');flash('Cena criada e vinculada à escaleta.')}}return}
if(d.action==='apply-selection-typography'){applySelectedType();return}
if(d.noteFormat){const a=$('#notePageBody');a?.focus();document.execCommand(d.noteFormat,false,null);saveNotePage(false);return}
if(d.noteHeading){const a=$('#notePageBody');a?.focus();document.execCommand('formatBlock',false,d.noteHeading);saveNotePage(false);return}
if(d.command){editorCommand(d.command);return}
if(d.block){editorCommand('formatBlock',d.block);return}
if(d.export){await doExport(d.export);return}
if(d.googleImport){await importGoogle(d.googleImport);return}
if(d.jumpMark){readerNotesOpen=false;$('#readerNotesPanel').innerHTML='';const el=$(`#readerText [data-annotation="${CSS.escape(d.jumpMark)}"]`);if(el)el.scrollIntoView({behavior:'smooth',block:'center'});return}
if(d.editAnnotation){const a=data.annotations.find(x=>x.id===d.editAnnotation);if(a){const newNote=prompt('Edite sua anotação:',a.note||'');if(newNote!==null){a.note=newNote.slice(0,3000);persist(false);readerNotesOpen=false;notesPanel()}}return}
if(d.deleteAnnotation){if(confirm('Remover destaque e nota?')){data.annotations=data.annotations.filter(x=>x.id!==d.deleteAnnotation);persist(false);renderReader();readerNotesOpen=false;notesPanel()}return}
switch(d.action){
case 'new-project':projectForm();break;
case 'timer-toggle':timerToggle();break;
case 'timer-finish':timerFinish();break;
case 'export-project':exportCurrentProject();break;
case 'project-book-menu':projectBookMenu();break;
case 'export-project-book':await exportProjectBook();break;
case 'versions-panel':versionsPanel();break;
case 'snapshot-doc':saveDoc(false);if(snapshotDocument(doc(documentId),'Ponto de recuperação manual')){persist(false);flash('Versão salva.')}else flash('Esta versão já está registrada.');versionsPanel();break;
case 'find-replace':findReplacePanel();break;
case 'export-reader-notes':exportReaderAnnotations();break;
case 'image-remove-solid-bg':await removeSolidBackground();break;
case 'new-session':if(view==='editor')saveDoc(false);sessionForm();break;
case 'new-doc':documentForm();break;
case 'new-note':noteCreateForm();break;
case 'note-link':{const n=noteById(activeNoteId),id=$('#noteLinkSelect')?.value;if(n&&id&&noteById(id)&&id!==n.id){if(noteMode==='edit')saveNotePage(false);n.links=[...new Set([...noteLinks(n),id])];persist(false);render();flash('Página vinculada.')}else flash('Escolha uma página para vincular.');break}
case 'note-block-add':{const n=noteById(activeNoteId);if(n?.type==='escaleta'){saveNotePage(false);n.blocks=noteBlocks(n);n.blocks.push({id:uid(),title:'Novo bloco',summary:'',goal:'',conflict:'',outcome:'',pov:'',place:''});persist(false);render();flash('Novo bloco adicionado.')}break}
case 'note-convert-scene':{const n=noteById(activeNoteId);if(n){const created=createRelatedNote(n,'cena',n.title,{resumo:n.fields?.resumo||n.body||''});openNote(created.id,'edit');flash('Cena vinculada criada.')}break}
case 'note-convert-chapter':{const n=noteById(activeNoteId);if(n){const created=createDocument(n.title,n.projectId,'capitulo',sanitize(noteHtml(n)));n.links=noteLinks(n);n.linkedDocumentId=created.id;persist(false);setupDoc(created);flash('Capítulo criado a partir da cena.')}break}

case 'note-back':noteBack();break;
case 'note-toggle-mode':if(noteMode==='edit')saveNotePage(false);noteMode=noteMode==='edit'?'read':'edit';render();break;
case 'note-save':saveNotePage(true);break;
case 'note-reader-settings':noteReaderSettings();break;
case 'note-read-apply':{const p=data.preferences;p.readerTheme=$('#noteReadTheme').value;p.readerFontSize=Number($('#noteReadSize').value);p.readerLineHeight=Number($('#noteReadLine').value);p.readerFont=$('#noteReadFont').value;closeDialog();persist(false);render();break}
case 'note-add-comment':{const n=noteById(activeNoteId),value=String($('#noteCommentText')?.value||'').trim();if(n&&value){n.comments=n.comments||[];n.comments.push({id:uid(),time:now(),text:value.slice(0,3000)});persist(false);render();flash('Nota de leitura salva.')}else flash('Escreva sua observação primeiro.');break}
case 'note-insert-image':$('#noteImageFile').click();break;
case 'note-more':if(noteMode==='edit')saveNotePage(false);noteMore();break;
case 'note-export-txt':exportNote('txt');closeDialog();break;
case 'note-export-html':exportNote('html');closeDialog();break;
case 'note-export-pdf':exportNote('pdf');closeDialog();break;
case 'note-snapshot':{const n=noteById(activeNoteId);if(n){if(noteMode==='edit')saveNotePage(false);noteSnapshot(n);persist(false);flash('Versão da página criada.');noteHistory()}break}
case 'note-versions':noteHistory();break;
case 'note-duplicate':{const n=noteById(activeNoteId);if(n){if(noteMode==='edit')saveNotePage(false);const copy=JSON.parse(JSON.stringify(n));copy.id=uid();copy.title+=' — cópia';copy.createdAt=now();copy.updatedAt=now();copy.versions=[];data.notes.push(copy);persist(false);openNote(copy.id);flash('Página duplicada.')}break}
case 'note-delete':{const n=noteById(activeNoteId);if(n&&confirm('Mover esta página para a lixeira?')){toTrash('note',n);data.notes=data.notes.filter(x=>x.id!==n.id);closeDialog();noteBack();persist();flash('Página enviada à lixeira.')}break}
case 'close-dialog':closeDialog();break;
case 'projects-back':projectId=null;render();break;
case 'reset-accent':data.preferences.accent=null;persist();break;
case 'month-today':month=day().slice(0,7);render();break;
case 'month-prev':{let [y,m]=month.split('-').map(Number);month=day(new Date(y,m-2,1)).slice(0,7);render();break}
case 'month-next':{let [y,m]=month.split('-').map(Number);month=day(new Date(y,m,1)).slice(0,7);render();break}
case 'import-document':$('#importFile').click();break;
case 'vault-enable':await elVaultEnable();break;
case 'vault-lock':await elVaultLock();break;
case 'backup-encrypted':await elBackupEncrypted();break;
case 'backup':if(confirm('ATENÇÃO: qualquer pessoa com acesso a este arquivo poderá ler todos os seus manuscritos. Exportar SEM criptografia mesmo assim?')){download(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),`entrelinhas-backup-${day()}.json`);flash('Backup SEM criptografia criado.');}break;
case 'restore':$('#backupFile').click();break;
case 'import-project':$('#projectZipFile').click();break;
case 'share-backup':shareBackup();break;
case 'trash-panel':trashPanel();break;
case 'storage-panel':await storageStatusPanel();break;
case 'request-persistent-storage':await requestPersistentStorage();break;
case 'empty-trash':if(confirm('Apagar permanentemente todos os itens da lixeira? Esta ação não poderá ser desfeita.')){data.trash=[];persist(false);trashPanel();flash('Lixeira esvaziada.')}break;
case 'el-transfer-menu':elTransferScreen();break;
case 'el-transfer-upload':await elTransferUpload();break;
case 'el-transfer-list':await elTransferList();break;
case 'google-connect':await connectGoogle();break;
case 'el-google-disconnect':{const token=oauthToken;oauthToken=null;oauthExpiry=0;googleFiles=[];elDocsCache.clear();render();
 if(token&&window.google?.accounts?.oauth2?.revoke){
  google.accounts.oauth2.revoke(token,result=>flash(result?.successful?'Sessão encerrada e token revogado no Google.':'Sessão encerrada no Entrelinhas. Confira a revogação na Conta Google.'));
  flash('Sessão encerrada no Entrelinhas. Solicitando revogação ao Google…');
 }else flash('Sessão encerrada aqui. Revogue o acesso também na sua Conta Google.');
 break;}
case 'deploy-check':deployChecklist();break;
case 'copy-origin':{const value=location.origin;try{await navigator.clipboard.writeText(value);flash('Origem HTTPS copiada.')}catch(e){flash('Selecione e copie o endereço mostrado acima.')}break;}
case 'google-help':googleHelp();break;
case 'google-upload':await uploadGoogle();break;
case 'google-doc-menu':googleDocumentMenu();break;
case 'google-create-linked':await googleCreateLinked();break;
case 'google-sync-now':{saveDoc(false);closeDialog();await syncGoogleDocument(documentId,{manual:true});break}
case 'google-fetch-readonly':await googleFetchReadonly();break;
case 'google-resolve':googleResolve();break;
case 'google-keep-both':await resolveGoogleConflict('remote');break;
case 'google-keep-local':await resolveGoogleConflict('local');break;
case 'google-cancel-conflict':closeDialog();break;
case 'google-unlink':{const current=doc(documentId);if(current&&confirm('Desvincular este manuscrito do Google? Seus arquivos locais e o documento original continuarão intactos.')){delete current.googleLink;delete current.googleDocId;persist(false);googleDocumentMenu()}break}
case 'google-download-menu':googleDownloadMenu();break;
case 'google-download':await googleDownload();break;
case 'export-selected':{const format=$('#exportFormat')?.value;if(format)await doExport(format);break}
case 'save-doc':saveDoc(true);closeDialog();break;
case 'duplicate-doc':{saveDoc(false);const original=doc(documentId);if(original){const copy=createDocument(original.title+' — cópia',original.projectId,original.kind,original.html);snapshotDocument(copy,'Cópia de '+original.title);persist(false);closeDialog();setupDoc(copy);flash('Cópia independente criada.')}break}
case 'install-app':{if(deferredInstall){const event=deferredInstall;deferredInstall=null;await event.prompt();}else{showDialog(`${modalHead('Instalar Entrelinhas')}<p>Para instalar, abra o aplicativo hospedado em <strong>HTTPS</strong> no Chrome do Android e use o menu <strong>⋮ → Instalar aplicativo</strong> ou <strong>Adicionar à tela inicial</strong>.</p><p class="mini">Um arquivo HTML aberto em Downloads não pode ser instalado como PWA. O ZIP do projeto inclui os arquivos necessários para publicação em HTTPS.</p><button class="btn block" data-action="close-dialog">Entendi</button>`)}break}

case 'editor-back':backFromEditor();break;
case 'editor-menu':saveDoc(false);editorMore();break;
case 'export-menu':saveDoc(false);exportMenu();break;
case 'editor-reader':{stopSpeech();saveDoc(false);closeDialog();view='reader';render();break}
case 'delete-doc':{const docId=documentId,chosen=doc(docId);if(chosen&&confirm(`Mover "${chosen.title}" e suas marcações para a lixeira? Você poderá restaurar em Ajustes.`)){toTrash('document',chosen);data.documents=data.documents.filter(x=>x.id!==docId);data.annotations=data.annotations.filter(x=>x.documentId!==docId);resetUI();tab='escrita';closeDialog();persist();flash('Manuscrito movido para a lixeira.')}break}
case 'add-link':{let href=prompt('Cole o endereço do link (https://):','https://');if(href&&/^https?:\/\//i.test(href))editorCommand('createLink',href);else if(href)flash('Use um endereço http ou https.');break}
case 'add-image':$('#imageFile').click();break;
case 'image-save-options':{if(selectedImage?.isConnected){selectedImage.alt=($('#imageAlt')?.value||'Imagem').slice(0,150);let width=Number($('#imageWidth')?.value)||100;selectedImage.dataset.width=String(width);selectedImage.style.width=width+'%';const wrap=$('#imageTextWrap')?.value||'block';selectedImage.style.float=wrap==='block'?'none':wrap;selectedImage.style.margin=wrap==='left'?'0px 12px 12px 0px':wrap==='right'?'0px 0px 12px 12px':'12px auto';saveDoc(false)}closeDialog();break}
case 'image-delete':if(selectedImage?.isConnected&&confirm('Remover esta imagem do documento?')){selectedImage.remove();saveDoc(false);closeDialog()}break;
case 'image-rotate':await transformSelectedImage('rotate');break;
case 'image-flip':await transformSelectedImage('flip');break;
case 'image-gray':await transformSelectedImage('gray');break;
case 'image-apply-brightness':await transformSelectedImage('brightness',Number($('#imageBrightness')?.value)||100);break;
case 'add-table':{let rows=Math.min(12,Math.max(1,Number(prompt('Linhas da tabela (1–12):','3'))||0));if(!rows)return;let cols=Math.min(8,Math.max(1,Number(prompt('Colunas da tabela (1–8):','3'))||0));if(!cols)return;let html='<table><tbody>'+Array.from({length:rows},()=>'<tr>'+Array.from({length:cols},()=>'<td>Texto</td>').join('')+'</tr>').join('')+'</tbody></table><p></p>';editorCommand('insertHTML',html);break}
case 'format-more':moreFormatting();break;
case 'reader-edit':{stopSpeech();readProgress();persist(false);view='editor';render();el24RestoreFonts();break}
case 'reader-back':backFromReader();break;
case 'reader-notes':notesPanel();break;
case 'reader-highlight':saveAnnotation(false);break;
case 'reader-add-note':saveAnnotation(true);break;
case 'reader-options':readProgress();readerOptions();break;
case 'reader-search':findInReader();break;
case 'reader-speech':toggleSpeech();break;
case 'reader-options-close':{closeDialog();renderReader();break}
case 'reader-bookmark':readProgress();persist(false);flash(`Marcador salvo: ${Math.round((doc(documentId)?.readingProgress||0)*100)}% do texto.`);break;
case 'reader-next':case 'reader-prev':{let el=$('#readerScroll'),n=d.action==='reader-next'?1:-1;if(el){let config=data.preferences.readerMode==='paged'?{left:n*el.clientWidth*.95}:{top:n*el.clientHeight*.83};el.scrollBy({...config,behavior:'smooth'})}break}
case 'delete-project':break;
}
if(d.special){closeDialog();const cmds={blockquote:()=>editorCommand('formatBlock','blockquote'),code:()=>editorCommand('formatBlock','pre'),color:()=>{let c=prompt('Cor da fonte (ex.: #8a559d):','#9064ae');if(c&&/^#[\da-f]{6}$/i.test(c))editorCommand('foreColor',c)},hilite:()=>{let c=prompt('Cor de realce (ex.: #fff1a8):','#fff1a8');if(c&&/^#[\da-f]{6}$/i.test(c))editorCommand('hiliteColor',c)},clear:()=>editorCommand('removeFormat'),sup:()=>editorCommand('superscript'),sub:()=>editorCommand('subscript')};cmds[d.special]?.()}
if(d.deleteProject){const p=project(d.deleteProject);if(p&&confirm(`Excluir apenas o projeto "${p.title}"? Manuscritos e notas serão mantidos como sem projeto.`)){data.projects=data.projects.filter(x=>x.id!==p.id);for(const item of [...data.documents,...data.sessions,...data.notes])if(item.projectId===p.id)item.projectId=null;projectId=null;closeDialog();persist()}return}
if(d.deleteSession){if(confirm('Mover sessão para a lixeira? A ofensiva será recalculada.')){toTrash('session',data.sessions.find(s=>s.id===d.deleteSession));data.sessions=data.sessions.filter(s=>s.id!==d.deleteSession);closeDialog();persist()}return}
if(d.deleteNote){if(confirm('Mover anotação para a lixeira?')){toTrash('note',data.notes.find(n=>n.id===d.deleteNote));data.notes=data.notes.filter(n=>n.id!==d.deleteNote);closeDialog();persist()}return}
});
document.addEventListener('submit',e=>{e.preventDefault();const f=e.target,v=Object.fromEntries(new FormData(f).entries());
if(f.id==='replaceForm'){const found=String(v.find||'').trim(),replacement=String(v.replacement||'');if(!found){flash('Informe o texto a localizar.');return}closeDialog();const count=replaceAllInEditor(found,replacement);flash(count?`${count} ocorrência(s) substituída(s).`:'Nenhuma ocorrência encontrada.');return}
if(f.id==='projectForm'){if(!String(v.title||'').trim()||!safeCount(v.goal)||!safeCount(v.baseline)){flash('Informe título e números válidos.');return}const old=project(editingId);const p={id:old?.id||uid(),title:String(v.title).trim().slice(0,160),genre:String(v.genre||'').trim().slice(0,90),blurb:String(v.blurb||'').trim().slice(0,4000),goal:Number(v.goal),baseline:Number(v.baseline),color:chosenColor,createdAt:old?.createdAt||now(),updatedAt:now()};data.projects=old?data.projects.map(x=>x.id===p.id?p:x):[...data.projects,p];projectId=p.id;tab='projetos';closeDialog();persist();flash('Projeto salvo.');return}
if(f.id==='sessionForm'){const words=Number(v.words||0),mins=Number(v.minutes||0),date=String(v.date||'');if(!validDay(date)||date>day()||![words,mins].every(Number.isSafeInteger)||words<0||mins<0||words>1e7||mins>1440||!words&&!mins){flash('Informe data, palavras ou minutos válidos.');return}const old=data.sessions.find(s=>s.id===editingId),s={id:old?.id||uid(),projectId:v.projectId||null,kind:sessionKind,date,words,minutes:mins,note:String(v.note||'').trim().slice(0,1000),createdAt:old?.createdAt||now()};data.sessions=old?data.sessions.map(x=>x.id===s.id?s:x):[...data.sessions,s];closeDialog();if(view==='editor'){persist(false);flash('Sessão registrada.')}else{persist();flash('Sessão registrada.')}return}
if(f.id==='documentForm'){const title=String(v.title||'').trim();if(!title){flash('Dê um título ao documento.');return}const newDoc=createDocument(title,v.projectId||null,String(v.kind||'capitulo'));closeDialog();setupDoc(newDoc);flash('Manuscrito criado.');return}
if(f.id==='quickNoteForm'){const title=String(v.title||'').trim(),type=String(v.type||'ideia');if(!title||!noteTypes[type]){flash('Informe título e categoria.');return}const n={id:uid(),projectId:v.projectId||null,type,title:title.slice(0,160),date:day(),body:'',html:'',status:'rascunho',fields:{},tags:[],blocks:[],links:[],versions:[],createdAt:now(),updatedAt:now()};data.notes.push(n);persist(false);openNote(n.id,'edit');flash('Página criada. Continue escrevendo.');return}
if(f.id==='noteForm'){const title=String(v.title||'').trim(),type=String(v.type||'ideia');if(!title||!noteTypes[type]||!validDay(String(v.date||''))){flash('Informe título e data válidos.');return}let fields={};for(const [k] of noteFields[type]||[])fields[k]=String(v['extra_'+k]||'').slice(0,4000);const old=data.notes.find(n=>n.id===editingId),n={id:old?.id||uid(),projectId:v.projectId||null,type,title:title.slice(0,160),date:String(v.date),body:String(v.body||'').slice(0,40000),fields,tags:String(v.tags||'').split(',').map(t=>t.trim()).filter(Boolean).slice(0,20),createdAt:old?.createdAt||now(),updatedAt:now()};data.notes=old?data.notes.map(x=>x.id===n.id?n:x):[...data.notes,n];closeDialog();persist(false);openNote(n.id);flash('Página salva.');return}
if(f.id==='goalForm'){if(!safeCount(v.goal)||Number(v.goal)<1){flash('Meta inválida.');return}data.preferences.dailyWordsGoal=Number(v.goal);persist();flash('Meta atualizada.');return}
if(f.id==='googleConfigForm'){const value=String(v.clientId||'').trim();if(value&&!/^[a-zA-Z0-9.-]+\.apps\.googleusercontent\.com$/.test(value)){flash('Verifique o formato do ID de cliente OAuth.');return}data.preferences.oauthClientId=value;oauthToken=null;persist();flash('Configuração salva (não conectada).');return}
});
document.addEventListener('change',async e=>{let t=e.target;
if(t.dataset?.typePref){setTypePref(t);return}
if(t.id==='notePageType'){if(noteMode==='edit'){saveNotePage(false);render()}return}
if(t.id==='diarySort'){diarySort=t.value;render();return}
if(t.id==='noteType'){selectedNoteType=t.value;$('#noteExtra').innerHTML=extraFields(selectedNoteType);return}
if(t.dataset?.readerPref){const key=t.dataset.readerPref;if(['readerTheme','readerFont','readerMode'].includes(key))data.preferences[key]=t.value;else data.preferences[key]=Number(t.value);persist(false);if(view==='reader'){let reader=$('#readerScroll');if(reader){if(key==='readerTheme')reader.className=`reader-scroll ${data.preferences.readerTheme} ${data.preferences.readerMode==='paged'?'paged':''}`;if(key==='readerFontSize')reader.style.setProperty('--reader-size',Number(t.value)+'px');if(key==='readerLineHeight')reader.style.setProperty('--reader-line',Number(t.value));if(key==='readerFont')reader.style.setProperty('--reader-font',t.value)}}return}
if(t.id==='noteImageFile'){const file=t.files?.[0];t.value='';if(!file)return;if(!['image/png','image/jpeg','image/webp'].includes(file.type)||file.size>1500000){flash('Use PNG, JPEG ou WebP de até 1,5 MB.');return}if(view!=='note'||noteMode!=='edit')return;const reader=new FileReader();reader.onload=()=>{const area=$('#notePageBody');if(!area)return;area.focus();const img=document.createElement('img');img.src=String(reader.result);img.alt=file.name.slice(0,100);img.style.maxWidth='100%';img.style.height='auto';area.appendChild(img);area.appendChild(document.createElement('p'));saveNotePage(true)};reader.readAsDataURL(file);return}
if(t.id==='imageFile'){const file=t.files?.[0];t.value='';if(file)await imageInput(file);return}
if(t.id==='importFile'){const file=t.files?.[0];t.value='';if(!file)return;try{const d=await importDocument(file);setupDoc(d);flash('Documento importado como cópia local.')}catch(err){alert('Não foi possível importar: '+err.message)}return}
if(t.id==='projectZipFile'){const file=t.files?.[0];t.value='';if(!file)return;try{await importProjectZip(file)}catch(err){alert('Não foi possível importar o projeto: '+err.message)}return}
 if(t.id==='backupFile'){const file=t.files?.[0];t.value='';if(!file)return;if(file.size>30*1024*1024){alert('Backup muito grande (limite: 30 MB).');return}try{let raw=JSON.parse(await file.text());if(raw?.format==='entrelinhas-encrypted-backup')raw=await elRestoreProtected(raw);let incoming=normalize(raw);if(confirm(`Substituir dados locais por ${incoming.projects.length} projetos, ${incoming.documents.length} documentos e ${incoming.notes.length} notas? Exporte um backup antes, se necessário.`)){data=incoming;resetUI();tab='inicio';projectId=null;persist();flash('Backup restaurado.')}}catch(err){alert('Falha ao restaurar: '+err.message)}return}
});
document.addEventListener('input',e=>{const t=e.target;if(view==='note'&&noteMode==='edit'&&(t.id?.startsWith('notePage')||t.dataset?.noteExtra||t.dataset?.blockField)){const st=$('#noteSaveState');if(st)st.textContent='Salvando…';clearTimeout(noteSaveTimer);noteSaveTimer=setTimeout(()=>saveNotePage(false),650);return}if(t.id==='librarySearch'){libraryQuery=t.value;const results=$('#libraryResults');if(results)results.innerHTML=searchResultsHTML();return}if(t.id==='writingArea'||t.id==='docTitle'){clearTimeout(editorTimer);editorTimer=setTimeout(()=>saveDoc(false),500);const word=$('#editorWords');if(word&&t.id==='writingArea')word.textContent=`${nfmt(numWords(t.innerHTML))} palavras`;if($('#editorSave'))$('#editorSave').textContent='Editando…';return}
if(t.id==='noteSearch'){diaryQuery=t.value;const position=t.selectionStart;const el=t;const fresh=diaryPage();const old=document.createElement('div');old.innerHTML=fresh;const next=old.querySelector('#noteResults');if(next&&$('#noteResults'))$('#noteResults').innerHTML=next.innerHTML;return}
});
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&elVaultActive&&!elVaultLocked&&elVaultHiddenAt&&Date.now()-elVaultHiddenAt>5*60*1000){elVaultHiddenAt=0;elVaultLock();return}if(document.visibilityState==='hidden'){if(elVaultActive&&!elVaultLocked)elVaultHiddenAt=Date.now();if(speechActive)stopSpeech();if(view==='editor')saveDoc(false);if(view==='reader')readProgress();if(view==='note'&&noteMode==='edit')saveNotePage(false);persist(false)}});
window.addEventListener('beforeunload',()=>{if(view==='editor')saveDoc(false);else if(view==='reader')readProgress();else if(view==='note'&&noteMode==='edit')saveNotePage(false);persist(false)});
// Recuperar dados de edição existentes mesmo se a versão 0.1 estiver no mesmo navegador.

// ===== Entrelinhas v1.2 — grafo e fichas vinculadas =====
let graphFilter='todos',graphProject='',graphCenter=null,graphZoom=1,graphPan={x:0,y:0},graphMode='conexoes',graphLinkFilter='todos',graphDepth=1;
const graphColors={personagem:'#A86F86',cronologia:'#5F8399',cena:'#795A96',escaleta:'#AE765A',mundo:'#617C63',ideia:'#C297A8',pesquisa:'#88789B',diario:'#9C8E77'};
const graphRelNames={pai:'Pai',mae:'Mãe',filho:'Filho(a)',irmao:'Irmão(ã)',conjuge:'Cônjuge',ex:'Ex-cônjuge',avo:'Avô/avó',neto:'Neto(a)',adotivo:'Parentesco adotivo',outro:'Outro vínculo familiar'};
function graphFamily(n){
 const direct=Array.isArray(n.familyLinks)?n.familyLinks:[];
 const reverse={pai:'filho',mae:'filho',filho:'pai',irmao:'irmao',conjuge:'conjuge',ex:'ex',avo:'neto',neto:'avo',adotivo:'adotivo',outro:'outro'};
 const incoming=data.notes.filter(q=>q.id!==n.id&&q.type==='personagem').flatMap(q=>(Array.isArray(q.familyLinks)?q.familyLinks:[]).filter(r=>r.to===n.id).map(r=>({id:r.id,to:q.id,kind:reverse[r.kind]||'outro',incoming:true,source:q.id})));
 return [...direct,...incoming.filter(r=>!direct.some(d=>d.to===r.to&&d.kind===r.kind))];
}
function graphMental(n){return Array.isArray(n.mentalEntries)?n.mentalEntries:[]}
// Vínculos narrativos explícitos são IDs internos, não nomes: renomear não rompe uma ligação.
const storyKindNames={alianca:'Aliança',rivalidade:'Rivalidade',romance:'Romance',amizade:'Amizade',segredo:'Segredo compartilhado',causa:'Causa ou consequência',local:'Acontece em',participacao:'Participação',influencia:'Influência',referencia:'Referência',outro:'Outro vínculo'};
function storyLinks(n){return Array.isArray(n.storyLinks)?n.storyLinks.filter(x=>x&&typeof x.to==='string'):[]}
function storyConnections(n){
 const own=storyLinks(n).filter(x=>noteById(x.to)).map(x=>({...x,source:n.id,incoming:false}));
 const incoming=data.notes.filter(q=>q.id!==n.id).flatMap(q=>storyLinks(q).filter(x=>x.to===n.id).map(x=>({...x,source:q.id,to:q.id,incoming:true})));
 return [...own,...incoming];
}
function storyPanel(n){
 const available=data.notes.filter(q=>q.id!==n.id&&(!n.projectId||q.projectId===n.projectId));
 const list=storyConnections(n).map(x=>{const target=noteById(x.to);if(!target)return '';return `<div class="graph-family-line"><div class="grow"><strong>${esc(target.title)}</strong><div class="mini">${esc(storyKindNames[x.kind]||storyKindNames.outro)}${x.incoming?' · recebido':''}${x.date?' · '+esc(x.date):''}</div>${x.description?`<div class="mini" style="white-space:pre-wrap">${esc(x.description)}</div>`:''}</div><button class="btn subtle small-btn" data-map-open="${esc(target.id)}">Abrir</button><button class="btn subtle small-btn" data-story-remove="${esc(x.id)}" data-story-source="${esc(x.source)}" aria-label="Remover vínculo">×</button></div>`}).join('');
 return `<section class="note-section"><div class="row"><h3 class="grow">🔗 Ligações narrativas</h3><button class="btn subtle small-btn" data-map-open-graph="${esc(n.id)}">Ver rede</button></div><p class="mini">Relacione acontecimentos, personagens, lugares ou ideias. O vínculo também aparece na página de destino. Ninguém é vinculado apenas por mencionar um nome no texto.</p>${list||'<p class="mini">Nenhuma ligação narrativa cadastrada.</p>'}<div class="note-edit-field"><label>Conectar esta página a</label><select id="storyTarget"><option value="">Selecione outra página…</option>${available.map(q=>`<option value="${esc(q.id)}">${esc(q.title)} · ${esc(noteTypes[q.type]||q.type)}</option>`).join('')}</select></div><div class="graph-form-grid"><label>Tipo de ligação<select id="storyKind">${Object.entries(storyKindNames).map(([k,v])=>`<option value="${k}">${esc(v)}</option>`).join('')}</select></label><label>Data narrativa (opcional)<input id="storyDate" type="text" maxlength="60" placeholder="Cap. 4 / Dia 12"></label></div><div class="note-edit-field"><label>Descrição / importância do vínculo</label><textarea id="storyDescription" rows="2" maxlength="1000" placeholder="O que conecta esses dois registros?"></textarea></div><button class="btn subtle small-btn" data-story-add ${available.length?'':'disabled'}>＋ Criar ligação</button></section>`;
}

function graphParticipants(n){return Array.isArray(n.characterIds)?n.characterIds:[]}
function graphEdges(notes){
 const ids=new Set(notes.map(n=>n.id)),out=new Map();
 function add(a,b,type='manual',description=''){if(!ids.has(a)||!ids.has(b)||a===b)return;const pair=[a,b].sort().join('|'),key=pair+'|'+type;out.set(key,{a,b,type,description});}
 notes.forEach(n=>{
  noteLinks(n).forEach(id=>add(n.id,id,'manual'));
  graphParticipants(n).forEach(id=>add(n.id,id,'event'));
  graphFamily(n).forEach(r=>add(n.id,r.to,'family',graphRelNames[r.kind]||'Parentesco'));
  storyLinks(n).forEach(r=>add(n.id,r.to,'story',`${storyKindNames[r.kind]||'Ligação'}${r.description?' — '+r.description:''}`));
 });
 return [...out.values()];
}
function graphNodes(){let notes=data.notes.filter(n=>!graphProject||n.projectId===graphProject);if(graphMode==='familia'){
 const selected=graphCenter&&noteById(graphCenter)?.type==='personagem'?graphCenter:null;
 notes=notes.filter(n=>n.type==='personagem');if(selected){const family=new Set([selected]);notes.forEach(n=>graphFamily(n).forEach(r=>{if(n.id===selected)family.add(r.to);if(r.to===selected)family.add(n.id)}));notes=notes.filter(n=>family.has(n.id));}
 }else if(graphCenter&&noteById(graphCenter)){
  const focus=graphCenter,ns=new Set([focus]);const all=graphEdges(data.notes);
  for(let hop=0;hop<graphDepth;hop++){const growing=new Set(ns);for(const edge of all)if(ns.has(edge.a)||ns.has(edge.b)){growing.add(edge.a);growing.add(edge.b)}for(const id of growing)ns.add(id)}
  // Até dois níveis a partir da página selecionada
  notes=notes.filter(n=>ns.has(n.id));
 }
 if(graphFilter!=='todos'&&graphMode!=='familia')notes=notes.filter(n=>n.type===graphFilter||n.id===graphCenter);
 return notes.slice(0,90);
}
function graphPositions(nodes,edges){
 const W=800,H=600,map=new Map();let n=nodes.length;
 if(graphMode==='familia'&&graphCenter&&nodes.some(x=>x.id===graphCenter)){
  const focus=noteById(graphCenter);const relations=graphFamily(focus);
  const levels={pai:-1,mae:-1,avo:-2,filho:1,neto:2,irmao:0,conjuge:0,ex:0,adotivo:0,outro:0};
  const bands=new Map();
  for(const node of nodes){if(node.id===focus.id)continue;const relation=relations.find(r=>r.to===node.id);const level=levels[relation?.kind]??0;if(!bands.has(level))bands.set(level,[]);bands.get(level).push(node.id)}
  map.set(focus.id,{x:400,y:310});
  for(const [level,ids] of bands){ids.forEach((id,i)=>map.set(id,{x:Math.max(60,Math.min(740,400+(i-(ids.length-1)/2)*165)),y:Math.max(55,Math.min(545,310+level*165))}))}
  return map;
 }
 nodes.forEach((node,i)=>{const angle=2*Math.PI*i/Math.max(n,1)-Math.PI/2;const ring=160+Math.floor(i/22)*85;map.set(node.id,{x:W/2+Math.cos(angle)*ring,y:H/2+Math.sin(angle)*ring})});
 if(graphCenter&&map.has(graphCenter))map.set(graphCenter,{x:W/2,y:H/2});
 for(let k=0;k<55;k++){
  const deltas=new Map(nodes.map(n=>[n.id,{x:0,y:0}]));
  for(let i=0;i<n;i++)for(let j=i+1;j<n;j++){
   const a=map.get(nodes[i].id),b=map.get(nodes[j].id);let dx=a.x-b.x,dy=a.y-b.y,dist2=Math.max(220,dx*dx+dy*dy);let force=4100/dist2,dist=Math.sqrt(dist2);
   deltas.get(nodes[i].id).x+=dx/dist*force;deltas.get(nodes[i].id).y+=dy/dist*force;
   deltas.get(nodes[j].id).x-=dx/dist*force;deltas.get(nodes[j].id).y-=dy/dist*force;
  }
  for(const e of edges){const a=map.get(e.a),b=map.get(e.b);if(!a||!b)continue;const dx=b.x-a.x,dy=b.y-a.y,dist=Math.max(1,Math.hypot(dx,dy)),force=(dist-115)*.012;deltas.get(e.a).x+=dx/dist*force;deltas.get(e.a).y+=dy/dist*force;deltas.get(e.b).x-=dx/dist*force;deltas.get(e.b).y-=dy/dist*force;}
  for(const item of nodes){if(item.id===graphCenter)continue;const p=map.get(item.id),d=deltas.get(item.id);p.x=Math.min(765,Math.max(35,p.x+d.x+(400-p.x)*.001));p.y=Math.min(565,Math.max(35,p.y+d.y+(300-p.y)*.001));}
 }
 return map;
}
function graphHTML(){
 const nodes=graphNodes(),allEdges=graphEdges(nodes),edges=graphLinkFilter==='todos'?allEdges:allEdges.filter(e=>e.type===graphLinkFilter),positions=graphPositions(nodes,allEdges);
 const selected=graphCenter?noteById(graphCenter):null;
 const options='<option value="">Todos os projetos</option>'+data.projects.map(p=>`<option value="${esc(p.id)}" ${graphProject===p.id?'selected':''}>${esc(p.title)}</option>`).join('');
 const types='<option value="todos">Todas as categorias</option>'+Object.entries(noteTypes).map(([type,label])=>`<option value="${type}" ${graphFilter===type?'selected':''}>${esc(label)}</option>`).join('');
 const edgesSVG=edges.map(e=>{const a=positions.get(e.a),b=positions.get(e.b);return `<line class="graph-edge ${e.type==='family'?'family':e.type==='event'?'event':e.type==='story'?'story':''}" x1="${a.x.toFixed(1)}" y1="${a.y.toFixed(1)}" x2="${b.x.toFixed(1)}" y2="${b.y.toFixed(1)}"><title>${esc(e.description||e.type)}</title></line>`}).join('');
 const nodesSVG=nodes.map(n=>{const p=positions.get(n.id),label=n.title.length>23?n.title.slice(0,22)+'…':n.title;return `<g class="graph-node" data-map-open="${esc(n.id)}" tabindex="0" role="button" aria-label="Abrir ${esc(n.title)}" transform="translate(${p.x.toFixed(1)},${p.y.toFixed(1)})"><circle r="${n.id===graphCenter?27:21}" fill="${graphColors[n.type]||'#9064AE'}"></circle><text text-anchor="middle" y="-23">${esc(label)}</text></g>`}).join('');
 return `<div class="note-page"><header class="note-page-top"><button class="btn subtle small-btn" data-map-back>‹ Voltar</button><div class="grow"><strong>✦ Mapa de conexões</strong><div class="tiny muted">Personagens, cenas, eventos e mundos</div></div></header><div class="graph-panel"><h2 style="margin:4px 0 8px">${graphMode==='familia'?'Árvore de famílias':'Seu universo interligado'}</h2><p class="graph-aux">Toque em um ponto para abrir a página. Arraste para navegar e use os botões para aproximar.</p><div class="graph-controls"><button class="btn ${graphMode==='conexoes'?'':'subtle'} small-btn" data-map-mode="conexoes">Rede</button><button class="btn ${graphMode==='familia'?'':'subtle'} small-btn" data-map-mode="familia">Família</button><select id="mapProject" aria-label="Filtrar projeto">${options}</select>${graphMode==='conexoes'?`<select id="mapFilter" aria-label="Filtrar categoria">${types}</select><select id="mapLinkFilter" aria-label="Filtrar tipo de ligação"><option value="todos" ${graphLinkFilter==='todos'?'selected':''}>Todas as ligações</option>${[['manual','Páginas ligadas'],['family','Família'],['event','Participação'],['story','Vínculos narrativos']].map(([id,label])=>`<option value="${id}" ${graphLinkFilter===id?'selected':''}>${label}</option>`).join('')}</select>`:''}</div><div class="graph-controls"><button class="btn subtle small-btn" data-map-zoom="out" aria-label="Diminuir zoom">−</button><span class="mini">${Math.round(graphZoom*100)}%</span><button class="btn subtle small-btn" data-map-zoom="in" aria-label="Aumentar zoom">＋</button><button class="btn subtle small-btn" data-map-reset>Centralizar</button>${graphCenter?`<button class="btn subtle small-btn" data-map-depth="toggle">${graphDepth===1?'Mostrar 2 níveis':'Mostrar 1 nível'}</button><button class="btn subtle small-btn" data-map-all>Ver todas</button>`:''}</div>${nodes.length?`<div class="graph-canvas" id="graphCanvas"><svg viewBox="0 0 800 600" role="group" aria-label="Mapa de conexões interativo"><g id="graphViewport" transform="translate(${graphPan.x} ${graphPan.y}) translate(400 300) scale(${graphZoom}) translate(-400 -300)">${edgesSVG}${nodesSVG}</g></svg></div>`:'<div class="graph-empty">Ainda não há páginas nesta visualização. Crie personagens, acontecimentos e vincule as páginas para formar sua rede.</div>'}<div class="graph-legend" style="margin-top:12px"><span><i class="graph-dot" style="background:#A86F86"></i>Personagem</span><span><i class="graph-dot" style="background:#5F8399"></i>Acontecimento</span><span><i class="graph-dot" style="background:#795A96"></i>Cena</span><span>━━ Família</span><span>┄ Evento</span><span>━━ Relação narrativa</span></div><p class="mini">${nodes.length} páginas · ${edges.length} ligações</p>${selected?`<div class="graph-family-line"><div><strong>${esc(selected.title)}</strong><div class="mini">${esc(noteTypes[selected.type])}</div></div><button class="btn subtle small-btn" data-map-open="${esc(selected.id)}">Abrir ficha</button></div>`:''}</div></div>`;
}
function graphApplyTransform(){const el=$('#graphViewport');if(el)el.setAttribute('transform',`translate(${graphPan.x} ${graphPan.y}) translate(400 300) scale(${graphZoom}) translate(-400 -300)`)}
function openGraph(focus=null,mode='conexoes'){
 if(view==='note'&&noteMode==='edit')saveNotePage(false);
 graphCenter=focus&&noteById(focus)?focus:null;graphMode=mode;graphZoom=1;graphPan={x:0,y:0};view='graph';render();window.scrollTo(0,0);
}
function graphBack(){view='main';tab='diario';render()}
function graphExtraLinks(n){
 const inbound=data.notes.filter(other=>other.id!==n.id&&noteLinks(other).includes(n.id));
 const attached=data.notes.filter(other=>other.id!==n.id&&graphParticipants(other).includes(n.id));
 return `<section class="note-section"><div class="row"><h3 class="grow">✦ Mapa de conexões</h3><button class="btn subtle small-btn" data-map-open-graph="${esc(n.id)}">Ver mapa</button></div><p class="mini">Ligações explícitas, familiares e acontecimentos associados a esta página.</p>${[...new Set([...inbound,...attached].map(x=>x.id))].filter(id=>!noteLinks(n).includes(id)).map(id=>{const q=noteById(id);return q?`<button class="btn subtle small-btn" style="margin:3px" data-map-open="${esc(id)}">${esc(q.title)}</button>`:''}).join('')||'<p class="mini">As ligações recebidas aparecerão aqui.</p>'}</section>`;
}
function graphCharacterPanel(n){if(n.type!=='personagem')return '';
 const family=graphFamily(n).map(r=>{const other=noteById(r.to);if(!other)return '';return `<div class="graph-family-line"><div><strong>${esc(other.title)}</strong><div class="mini">${esc(graphRelNames[r.kind]||'Parente')}</div></div><button class="btn subtle small-btn" data-map-open="${esc(other.id)}">Abrir</button><button class="btn subtle small-btn" data-map-remove-family="${esc(r.id)}" data-map-source="${esc(r.source||n.id)}" aria-label="Excluir vínculo">×</button></div>`}).join('');
 const options=data.notes.filter(x=>x.type==='personagem'&&x.id!==n.id&&(!n.projectId||x.projectId===n.projectId)).map(x=>`<option value="${esc(x.id)}">${esc(x.title)}</option>`).join('');
 const mental=graphMental(n).slice().sort((a,b)=>(b.date||'').localeCompare(a.date||'')).map(e=>`<div class="graph-mental-entry"><div class="row"><strong class="grow">${esc(e.title||'Pensamento')}</strong><button class="btn subtle small-btn" data-map-mental-del="${esc(e.id)}">×</button></div><time>${esc(e.date||'')}</time>${e.mood?` <span class="graph-tag">${esc(e.mood)}</span>`:''}<p style="white-space:pre-wrap">${esc(e.text||'')}</p>${e.eventId&&noteById(e.eventId)?`<button class="btn subtle small-btn" data-map-open="${esc(e.eventId)}">Acontecimento: ${esc(noteById(e.eventId).title)}</button>`:''}</div>`).join('');
 const events=data.notes.filter(e=>e.id!==n.id&&graphParticipants(e).includes(n.id));
 const eventOpts=data.notes.filter(e=>e.id!==n.id&&e.projectId===n.projectId&&(e.type==='cena'||e.type==='cronologia'||e.type==='escaleta')).map(e=>`<option value="${esc(e.id)}">${esc(e.title)}</option>`).join('');
 return `<section class="note-section"><div class="row"><h3 class="grow">🌳 Árvore genealógica</h3><button class="btn subtle small-btn" data-map-open-family="${esc(n.id)}">Ver árvore</button></div>${family||'<p class="mini">Nenhum vínculo familiar cadastrado.</p>'}<div class="graph-form-grid"><select id="familyWho" aria-label="Selecionar familiar"><option value="">Selecionar personagem…</option>${options}</select><select id="familyKind" aria-label="Tipo de parentesco">${Object.entries(graphRelNames).map(([k,v])=>`<option value="${k}">${esc(v)}</option>`).join('')}</select></div><button class="btn subtle small-btn" data-map-family-add>＋ Cadastrar parentesco</button></section><section class="note-section"><h3>🕰️ Acontecimentos vinculados</h3>${events.map(e=>`<button class="btn subtle small-btn" style="margin:4px" data-map-open="${esc(e.id)}">${esc(e.title)}</button>`).join('')||'<p class="mini">Sem acontecimentos vinculados.</p>'}</section><section class="note-section"><h3>🧠 Diário mental</h3><p class="mini">Pensamentos, medos e mudanças emocionais ao longo da história.</p>${mental||'<p class="mini">Nenhuma entrada ainda.</p>'}<div class="note-edit-field"><label>Título</label><input id="mentalTitle" maxlength="120" placeholder="Depois da reunião…"></div><div class="graph-form-grid"><label>Data <input id="mentalDate" type="date" value="${day()}"></label><label>Estado emocional <input id="mentalMood" maxlength="90" placeholder="Ansiedade, esperança…"></label></div><div class="note-edit-field"><label>Pensamentos e conflitos</label><textarea id="mentalText" rows="3" maxlength="5000" placeholder="O que o personagem sente ou acredita?" ></textarea></div><div class="note-edit-field"><label>Acontecimento relacionado (opcional)</label><select id="mentalEvent"><option value="">Sem vínculo</option>${eventOpts}</select></div><button class="btn subtle small-btn" data-map-mental-add>＋ Adicionar entrada</button></section>`;
}
function graphEventPanel(n){if(!['cena','cronologia','escaleta'].includes(n.type))return '';
 const chars=data.notes.filter(x=>x.type==='personagem'&&(!n.projectId||x.projectId===n.projectId));
 return `<section class="note-section"><h3>👥 Personagens envolvidos</h3><p class="mini">Ao marcar um personagem aqui, este acontecimento aparecerá automaticamente na ficha dele e no mapa.</p>${chars.map(c=>`<label style="display:flex;gap:9px;align-items:center;padding:6px"><input type="checkbox" data-map-participant="${esc(c.id)}" ${graphParticipants(n).includes(c.id)?'checked':''}>${esc(c.title)}</label>`).join('')||'<p class="mini">Crie personagens neste projeto para relacioná-los.</p>'}</section>`;
}
const previousDiaryPage=diaryPage;
diaryPage=function(){return previousDiaryPage()+`<div class="graph-panel"><div class="row"><div class="grow"><h3>✦ Mapa de conexões</h3><p class="mini">Explore pessoas, cenas e acontecimentos como uma rede de ideias.</p></div><button class="btn small-btn" data-map-open-graph>Explorar mapa</button></div></div>`};
const previousRender=render;
render=function(){if(view==='graph'){$('#app').innerHTML=graphHTML();return}previousRender();if(view==='note'){
 const n=noteById(activeNoteId);const sheet=$('.note-sheet');if(n&&sheet){sheet.insertAdjacentHTML('beforeend',graphExtraLinks(n)+storyPanel(n)+(n.type==='personagem'?graphCharacterPanel(n):graphEventPanel(n)))}
 }};
// Mapa acessível por toque/clique, sem interceptar as funções anteriores.
document.addEventListener('click',e=>{
 const x=e.target.closest('[data-map-open-graph],[data-map-open-family],[data-map-back],[data-map-mode],[data-map-zoom],[data-map-reset],[data-map-all],[data-map-open],[data-map-depth],[data-map-family-add],[data-map-remove-family],[data-map-mental-add],[data-map-mental-del],[data-story-add],[data-story-remove]');if(!x)return;
 e.preventDefault();e.stopImmediatePropagation();
 const d=x.dataset;
 if(d.mapOpenGraph!==undefined){openGraph(d.mapOpenGraph||null);return}
 if(d.mapOpenFamily!==undefined){openGraph(d.mapOpenFamily||null,'familia');return}
 if(d.mapBack!==undefined){graphBack();return}
 if(d.mapMode){graphMode=d.mapMode;graphZoom=1;graphPan={x:0,y:0};render();return}
 if(d.mapZoom){graphZoom=Math.max(.55,Math.min(2.8,graphZoom*(d.mapZoom==='in'?1.25:.8)));render();return}
 if(d.mapReset!==undefined){graphZoom=1;graphPan={x:0,y:0};render();return}
 if(d.mapDepth!==undefined){graphDepth=graphDepth===1?2:1;render();return}
 if(d.mapAll!==undefined){graphCenter=null;render();return}
 if(d.mapOpen){openNote(d.mapOpen);return}
 const n=noteById(activeNoteId);if(!n)return;
 if(d.mapFamilyAdd!==undefined){const to=$('#familyWho')?.value,kind=$('#familyKind')?.value;if(!to||!noteById(to)||to===n.id){flash('Selecione uma pessoa válida.');return}n.familyLinks=Array.isArray(n.familyLinks)?n.familyLinks:[];if(graphFamily(n).some(r=>r.to===to&&r.kind===kind)){flash('Vínculo já cadastrado.');return}n.familyLinks.push({id:uid(),to,kind});n.updatedAt=now();persist(false);render();flash('Vínculo familiar salvo.');return}
 if(d.mapRemoveFamily){const from=noteById(d.mapSource)||n;from.familyLinks=(Array.isArray(from.familyLinks)?from.familyLinks:[]).filter(r=>r.id!==d.mapRemoveFamily);from.updatedAt=now();persist(false);render();return}
 if(d.storyAdd!==undefined){
  const to=$('#storyTarget')?.value,kind=$('#storyKind')?.value,other=noteById(to);
  if(!other||other.id===n.id||(n.projectId&&other.projectId!==n.projectId)){flash('Selecione outra página do mesmo projeto.');return}
  n.storyLinks=storyLinks(n);
  if(n.storyLinks.some(l=>l.to===to&&l.kind===kind)){flash('Esse tipo de vínculo já existe entre as páginas.');return}
  n.storyLinks.push({id:uid(),to,kind:storyKindNames[kind]?kind:'outro',date:($('#storyDate')?.value||'').trim().slice(0,60),description:($('#storyDescription')?.value||'').trim().slice(0,1000)});
  n.updatedAt=now();persist(false);render();flash('Ligação criada nas duas páginas.');return
 }
 if(d.storyRemove){const source=noteById(d.storySource);if(!source)return;source.storyLinks=storyLinks(source).filter(l=>l.id!==d.storyRemove);source.updatedAt=now();persist(false);render();flash('Ligação removida.');return}
 if(d.mapMentalAdd!==undefined){const t=$('#mentalText')?.value.trim(),title=$('#mentalTitle')?.value.trim();if(!t){flash('Escreva os pensamentos antes de salvar.');return}n.mentalEntries=graphMental(n);n.mentalEntries.push({id:uid(),date:$('#mentalDate')?.value||day(),title:title||'Pensamento',mood:($('#mentalMood')?.value||'').slice(0,90),text:t.slice(0,5000),eventId:$('#mentalEvent')?.value||null});n.updatedAt=now();persist(false);render();flash('Entrada do diário mental salva.');return}
 if(d.mapMentalDel){n.mentalEntries=graphMental(n).filter(i=>i.id!==d.mapMentalDel);n.updatedAt=now();persist(false);render();return}
},true);
document.addEventListener('change',e=>{
 const t=e.target;if(t.id==='mapProject'){graphProject=t.value;graphCenter=null;render();return}if(t.id==='mapFilter'){graphFilter=t.value;render();return}if(t.id==='mapLinkFilter'){graphLinkFilter=t.value;render();return}
 if(t.dataset?.mapParticipant!==undefined){const n=noteById(activeNoteId);if(!n)return;const id=t.dataset.mapParticipant;n.characterIds=graphParticipants(n).filter(x=>x!==id);if(t.checked)n.characterIds.push(id);n.updatedAt=now();persist(false);flash('Personagem '+(t.checked?'vinculado.':'desvinculado.'));return}
},true);
let graphDrag=null;
document.addEventListener('pointerdown',e=>{if(view!=='graph'||!e.target.closest('#graphCanvas')||e.target.closest('.graph-node'))return;graphDrag={x:e.clientX,y:e.clientY,panX:graphPan.x,panY:graphPan.y};e.target.setPointerCapture?.(e.pointerId)},true);
document.addEventListener('pointermove',e=>{if(!graphDrag||view!=='graph')return;const c=$('#graphCanvas');if(!c)return;graphPan.x=graphDrag.panX+(e.clientX-graphDrag.x)*800/c.clientWidth;graphPan.y=graphDrag.panY+(e.clientY-graphDrag.y)*600/c.clientHeight;graphApplyTransform()},true);
document.addEventListener('pointerup',()=>graphDrag=null,true);
document.addEventListener('keydown',e=>{const x=e.target.closest?.('.graph-node');if(x&&(e.key==='Enter'||e.key===' ')){e.preventDefault();openNote(x.dataset.mapOpen)}},true);
// ===== fim do módulo de conexões v1.3 =====

render();startOfflineStorage().then(()=>el29HandleDeepLink()).catch(err=>console.warn('Falha ao iniciar armazenamento offline',err));

/* Entrelinhas 1.5 — melhorias de ergonomia, sem criar repositório paralelo de textos. */
const el15OldRefreshTypeStyle=refreshTypeStyle;
refreshTypeStyle=function(scope){
  el15OldRefreshTypeStyle(scope);
  const x=typeItem(scope),target=document.getElementById(scope==='doc'?'writingArea':'notePageBody');
  if(x&&target){target.style.cssText=typeStyle(x)+';'+elPageCSS(x);target.classList.add('el-paper-page')}
};
function el15ShowPanel(mode,scope){
 const x=scope==='note'?noteById(activeNoteId):doc(documentId);
 if(!x)return;
 const formatting=`<p class="mini">Mais de 35 fontes. Fontes Google são carregadas somente quando você escolhe uma delas; isso faz uma conexão com o Google e exige internet na primeira utilização. Offline, o aplicativo usa uma fonte substituta.</p><div class="el-mobile-details">${typeControls(x,scope)}</div><div class="btn-group"><button class="btn subtle" data-action="el-page-settings">Margens e recuos</button><button class="btn subtle" data-action="el-templates">Modelos</button></div>`;
 const action=(label,attr)=>`<button class="btn subtle small-btn" ${attr}>${label}</button>`;
 let content='';
 if(mode==='format') content=formatting;
 if(mode==='insert')content=`<p class="mini">Selecione o que deseja inserir na página.</p><div class="btn-group">${scope==='doc'?action('Imagem','data-action="add-image"')+action('Tabela','data-action="add-table"')+action('Link','data-action="add-link"')+action('Linha','data-command="insertHorizontalRule"'):action('Imagem','data-action="note-insert-image"')+action('Subtítulo','data-note-heading="h2"')+action('Lista','data-note-format="insertUnorderedList"')}</div>`;
 if(mode==='timer'){
    const clock=document.getElementById('timerClock')?.textContent||'00:00:00';
    content=`<p class="mini">Sessão vinculada ao capítulo atual. Também há um cronômetro livre independente.</p><h2 style="text-align:center;font-variant-numeric:tabular-nums" id="el15Clock">${clock}</h2><div class="btn-group">${action('▶ Iniciar / pausar','data-action="timer-toggle"')}${action('Registrar tempo','data-action="timer-finish"')}${action('Sessão manual','data-action="new-session"')}${action('Livre','data-action="el-timer-dialog"')}</div>`;
 }
 if(mode==='more'&&scope==='doc')content=`<div class="btn-group">${action('Configurar página','data-action="el-page-settings"')}${action('Modelos','data-action="el-templates"')}${action('Exportar','data-action="export-menu"')}${action('Google Docs','data-action="google-doc-menu"')}${action('Versões','data-action="doc-versions"')}${action('Cronômetro','data-el-open="timer"')}${action('Localizar','data-action="find-replace"')}</div><p class="mini">Salvamento local automático. A sincronização com o Google requer autorização e configuração próprias.</p>`;
 if(mode==='more'&&scope==='note')content=`<div class="btn-group">${action('Opções e exportação','data-action="note-more"')}${action('Configuração de página','data-action="el-page-settings"')}${action('Modelos','data-action="el-templates"')}${action('Modo leitura','data-action="note-toggle-mode"')}${action('Histórico','data-action="note-versions"')}</div>`;
 showDialog(`${modalHead(({format:'Formatação',insert:'Inserir',timer:'Temporizador',more:'Ferramentas'})[mode]||'Ferramentas')}${content}`);
}
function el15EnhanceEditor(){
 const shell=document.querySelector('.editor-shell');if(!shell||shell.dataset.el15==='1')return;
 shell.dataset.el15='1';
 const top=shell.querySelector('.editor-top');
 top.querySelectorAll('[data-action="el-templates"],[data-action="el-page-settings"],[data-action="save-doc"],[data-action="export-menu"],[data-action="google-doc-menu"]').forEach(b=>b.classList.add('el-hidden-primary'));
 const last=top.querySelector('[data-action="editor-menu"]');
 if(last){last.insertAdjacentHTML('beforebegin',`<span class="el-top-autosave">Salvo automaticamente</span><button class="el-top-btn" data-command="undo" title="Desfazer" aria-label="Desfazer">↶</button><button class="el-top-btn" data-command="redo" title="Refazer" aria-label="Refazer">↷</button>`)}
 const bottom=document.createElement('nav');bottom.className='el-mobile-bottom';bottom.setAttribute('aria-label','Ferramentas rápidas de escrita');
 bottom.innerHTML=`<button data-command="bold" title="Negrito"><b>B</b></button><button data-command="italic" title="Itálico"><i>I</i></button><button data-command="underline" title="Sublinhado"><u>U</u></button><button data-el-open="format" class="el-primary" title="Mais formatação">Aa</button><button data-el-open="insert" title="Inserir">＋</button><button data-el-open="timer" title="Temporizador">◷</button><button data-el-open="more" title="Ferramentas">⋯</button>`;
 shell.appendChild(bottom);
}
let el15CurrentNote='',el15CurrentTab='documento';
function el15GroupNote(){
 const note=document.querySelector('.note-page'),sheet=note?.querySelector('.note-sheet');if(!sheet||sheet.dataset.el15==='1')return;
 sheet.dataset.el15='1';
 if(activeNoteId!==el15CurrentNote){el15CurrentNote=activeNoteId;el15CurrentTab='documento'}
 const panels={};const nav=document.createElement('nav');nav.className='el-note-tabbar';nav.setAttribute('aria-label','Seções desta página');
 const tabs=[['documento','Documento'],['detalhes','Detalhes'],['conexoes','Conexões'],['notas','Notas']];
 for(const [key,label] of tabs){const b=document.createElement('button');b.type='button';b.dataset.el15Tab=key;b.setAttribute('aria-selected',String(el15CurrentTab===key));b.textContent=label;nav.appendChild(b);const p=document.createElement('section');p.className='el-note-panel'+(el15CurrentTab===key?' is-active':'');p.dataset.el15Panel=key;panels[key]=p;}
 const nodes=[...sheet.children];
 let prevHeading='';
 for(const node of nodes){
  let key='documento';
  if(node.matches('.note-meta,.note-fields-group,.note-block,.note-related,#notePageExtras'))key='detalhes';
  else if(node.matches('.graph-panel')||node.querySelector?.('[data-map-open-graph],[data-map-open-family],[data-story-add],[data-map-family-add],[data-map-mental-add]'))key='conexoes';
  else if(node.matches('.note-section')){
    const label=(node.querySelector('h3')?.textContent||'').toLowerCase();
    if(/notas de leitura|comentário/.test(label))key='notas';
    else if(/relacionad|conex|ligaç|geneal|acontecimento|diário mental|envolvidos/.test(label))key='conexoes';
    else if(/conteúdo/.test(label))key='documento';
    else key='detalhes';
  }
  else if(node.matches('.note-edit-field')){
    const label=node.querySelector('label')?.textContent?.toLowerCase()||'';
    if(/etiqueta/.test(label))key='detalhes';
  }
  else if(node.matches('h3')){
    prevHeading=node.textContent.toLowerCase();
    if(/detalhes/.test(prevHeading))key='detalhes';
    else key='documento';
  }
  else if(node.matches('.note-save-status'))key='documento';
  else if(node.matches('[data-action="note-save"]'))key='detalhes';
  panels[key].appendChild(node);
 }
 sheet.prepend(nav,...Object.values(panels));
 for(const [key,p] of Object.entries(panels))if(!p.children.length){p.innerHTML=`<p class="el-note-empty">${key==='notas'?'Suas observações aparecerão aqui.':key==='conexoes'?'Vincule páginas para construir sua rede narrativa.':'Nenhum detalhe cadastrado ainda.'}</p>`}
 // Documento é protagonista. Metadados e formulários ficam apenas em Detalhes.
 const meta=panels.documento.querySelector(':scope > .note-meta');if(meta)panels.detalhes.prepend(meta);
 const titleField=panels.documento.querySelector('#notePageTitle');
 if(titleField){const wrap=titleField.closest('.note-edit-field');if(wrap){wrap.classList.add('el24-title-wrap');const label=wrap.querySelector('label');if(label)label.textContent='Título';}}
 // Não misture notas de leitura com conteúdo nem com formulários de relações.
 for(const section of [...panels.documento.querySelectorAll(':scope > .note-section')]){
   if(/notas de leitura|comentário/i.test(section.querySelector('h3')?.textContent||''))panels.notas.append(section);
 }
 // Uma linha curta de contexto, em vez de cartões de metadados espalhados.
 if(noteMode==='read'){
   const n=noteById(activeNoteId);
   const context=document.createElement('div');context.className='el24-note-context';
   context.textContent=[project(n?.projectId)?.title||'Sem projeto',n?.status==='concluido'?'Concluído':n?.status==='revisao'?'Em revisão':n?.status==='desenvolvimento'?'Em desenvolvimento':'Rascunho'].join(' · ');
   const head=panels.documento.querySelector('.note-page-title');if(head)head.insertAdjacentElement('afterend',context)
 }
 for(const [key,label] of [['detalhes','Informações da página'],['conexoes','Vínculos e relações'],['notas','Anotações de leitura']]){
   const h=document.createElement('h2');h.className='el24-panel-title';h.textContent=label;panels[key].prepend(h)
 }
 if(noteMode==='edit'){
  const bottom=document.createElement('nav');bottom.className='el-mobile-bottom';bottom.innerHTML=`<button data-note-format="bold"><b>B</b></button><button data-note-format="italic"><i>I</i></button><button data-note-format="underline"><u>U</u></button><button class="el-primary" data-el-open="format">Aa</button><button data-el-open="insert">＋</button><button data-el-open="more">⋯</button>`;
  note.appendChild(bottom);
 }
}
const el15OldRenderEditor=renderEditor;
renderEditor=function(){el15OldRenderEditor();el15EnhanceEditor();el24RestoreFonts()};
const el15OldRenderNotePage=renderNotePage;
renderNotePage=function(){el15OldRenderNotePage();el15GroupNote();el24RestoreFonts()};
const el15OldRender=render;
render=function(){el15OldRender();if(view==='editor')el15EnhanceEditor();if(view==='note')el15GroupNote()};
document.addEventListener('click',event=>{
 const tab=event.target.closest('[data-el15-tab]');
 if(tab){event.preventDefault();event.stopImmediatePropagation();el15CurrentTab=tab.dataset.el15Tab;document.querySelectorAll('[data-el15-panel]').forEach(x=>x.classList.toggle('is-active',x.dataset.el15Panel===el15CurrentTab));document.querySelectorAll('[data-el15-tab]').forEach(x=>x.setAttribute('aria-selected',String(x.dataset.el15Tab===el15CurrentTab)));return}
 const open=event.target.closest('[data-el-open]');
 if(open){event.preventDefault();event.stopImmediatePropagation();el15ShowPanel(open.dataset.elOpen,view==='note'?'note':'doc');return}
},true);
const el15OldTimerPaint=timerPaint;
timerPaint=function(){el15OldTimerPaint();const clock=document.getElementById('el15Clock');if(clock)clock.textContent=document.getElementById('timerClock')?.textContent||'00:00:00'};


/* Estrutura do documento — títulos por ordem, incluindo fichas e capítulos.
   Mantém os próprios documentos sem recriar/mover conteúdo. */
function elActiveTextArea(){return view==='editor'?document.getElementById('writingArea'):view==='note'?document.getElementById('notePageBody'):null}
function elOutline(){const area=elActiveTextArea();if(!area){flash('Abra um documento para ver a estrutura.');return}
 const headings=[...area.querySelectorAll('h1,h2,h3,h4,h5,h6')].filter(e=>e.textContent.trim());
 showDialog(`${modalHead('Estrutura do documento')}<p class="mini">Toque em um título para ir até ele. Os títulos são definidos pelas ferramentas de formatação.</p><div class="el-outline-list">${headings.length?headings.map((e,i)=>`<button type="button" class="el-outline-item" data-el-outline-jump="${i}" data-level="${Math.min(3,Number(e.tagName.slice(1)))}"><small>${e.tagName}</small><span>${esc(e.textContent.trim().slice(0,150))}</span>›</button>`).join(''):'<p class="muted">Nenhum título ainda. Selecione um trecho e aplique H1, H2 ou H3 para organizar seu texto.</p>'}</div>`);
}
function elPageBreak(){const area=elActiveTextArea();if(!area)return;closeDialog();area.focus();
 // O marcador é tratado como elemento seguro pelo sanitizador e força nova página na impressão.
 const selection=window.getSelection();let range=selection&&selection.rangeCount?selection.getRangeAt(0):null;
 if(range&&!area.contains(range.commonAncestorContainer))range=null;
 const hr=document.createElement('hr');hr.setAttribute('data-el-break','page');hr.className='el-page-break';
 if(range){range.deleteContents();range.insertNode(hr);range.setStartAfter(hr);range.collapse(true);selection.removeAllRanges();selection.addRange(range)}else area.append(hr);
 if(view==='editor')saveDoc(false);else saveNotePage(false);
 flash('Quebra de página inserida. Ela será respeitada ao imprimir ou salvar em PDF pelo navegador.');
}
// Classes de quebra ficam no HTML ao vivo; em reaberturas restaurar a marcação visual.
function elRestoreBreaks(){document.querySelectorAll('hr[data-el-break="page"]').forEach(e=>e.classList.add('el-page-break'))}
// Execução em captura evita que os comandos sejam confundidos com a navegação principal.
document.addEventListener('click',event=>{const b=event.target.closest?.('[data-action="el-outline"],[data-action="el-add-page-break"],[data-el-outline-jump]');if(!b)return;
 event.preventDefault();event.stopImmediatePropagation();
 if(b.hasAttribute('data-el-outline-jump')){const i=Number(b.dataset.elOutlineJump);closeDialog();const e=[...(elActiveTextArea()?.querySelectorAll('h1,h2,h3,h4,h5,h6')||[])].filter(x=>x.textContent.trim())[i];if(e){e.scrollIntoView({behavior:'smooth',block:'center'});if(view==='editor'||noteMode==='edit'){const r=document.createRange();r.selectNodeContents(e);r.collapse(false);const sel=window.getSelection();sel.removeAllRanges();sel.addRange(r)}}return}
 if(b.dataset.action==='el-outline')elOutline();else elPageBreak();
},true);
const elRestoreObserver=new MutationObserver(()=>elRestoreBreaks());
window.addEventListener('load',()=>{const app=document.getElementById('app');if(app)elRestoreObserver.observe(app,{subtree:true,childList:true})});


// Central de IA — o usuário escolhe e confirma exatamente o conteúdo compartilhado.
// Nunca guardar credenciais dos provedores no GitHub ou no localStorage.
const elAiProviders={openai:{name:'ChatGPT / OpenAI',url:'https://chatgpt.com/'},gemini:{name:'Gemini',url:'https://gemini.google.com/'},claude:{name:'Claude',url:'https://claude.ai/'},grok:{name:'Grok',url:'https://grok.com/'}};
let elAiProvider='openai',elAiText='',elAiSelection=false,elAiGateway='',elAiSessionKey='';
const elAiTasks={review:'Revise o texto, corrigindo ortografia e clareza, sem alterar a voz narrativa. Apresente sugestões e explique mudanças importantes.',coherence:'Analise a coerência dos acontecimentos, a continuidade, a motivação dos personagens e possíveis contradições. Não invente informações.',brainstorm:'Sugira cinco caminhos narrativos distintos, preservando o tom e os fatos do trecho.',summary:'Resuma o trecho mantendo personagens, acontecimentos e elementos relevantes.',style:'Analise ritmo, repetição, pontuação e escolhas estilísticas sem reescrever automaticamente.'};
function elAiCurrentText(){
 const selection=String(window.getSelection?.()?.toString()||'').trim();if(selection)return {text:selection,selected:true};
 const d=typeof doc==='function'&&documentId?doc(documentId):null;
 if(view==='editor'&&d){const area=document.querySelector('#writingArea');return {text:(area?.innerText||new DOMParser().parseFromString(d.html||'','text/html').body.textContent||'').trim(),selected:false}}
 if(view==='note'&&activeNoteId){const n=noteById(activeNoteId);const text=(document.querySelector('#noteWritingArea')?.innerText||new DOMParser().parseFromString(n?.body||n?.html||'','text/html').body.textContent||'').trim();return {text,selected:false}}
 return {text:'',selected:false};
}
function elAiModal(){
 const current=elAiCurrentText();elAiText=current.selected?current.text:'';elAiSelection=current.selected;
 showDialog(`${modalHead('✦ Central de IA')}<div class="el-ai-panel"><p class="sub">Use ChatGPT, Gemini, Claude ou Grok como assistentes de escrita. Você decide o que compartilhar.</p>
 <div class="el-ai-grid">${Object.entries(elAiProviders).map(([key,p])=>`<button type="button" data-el-ai-provider="${key}" aria-pressed="${key===elAiProvider}">${esc(p.name)}<span class="el-ai-desc">Selecionar assistente</span></button>`).join('')}</div>
 <div class="field"><label for="elAiTask">O que deseja fazer?</label><select id="elAiTask">${Object.entries(elAiTasks).map(([k,v])=>`<option value="${k}">${({review:'Revisar texto',coherence:'Analisar coerência',brainstorm:'Criar possibilidades',summary:'Resumir',style:'Analisar estilo'})[k]}</option>`).join('')}</select></div>
 <div class="field"><label for="elAiInstructions">Instruções adicionais (opcional)</label><textarea id="elAiInstructions" placeholder="Ex.: mantenha meu estilo e não reescreva diálogos sem consultar..."></textarea></div>
 <div class="field"><label for="elAiText">Trecho enviado (revise antes de compartilhar)</label><textarea id="elAiText" rows="6" placeholder="Cole aqui um trecho ou selecione texto no editor antes de abrir a central.">${esc(elAiText)}</textarea></div>
 ${current.text&&!current.selected?`<button class="btn subtle small-btn" type="button" data-action="el-ai-use-current">Usar texto aberto (${current.text.length} caracteres)</button>`:''}
 <p class="el-ai-warning">🔒 Nenhum conteúdo é enviado automaticamente. Para usar a API, configure um servidor protegido; nunca insira chaves da OpenAI, Google, Anthropic ou xAI nesta página.</p>
 <details><summary>Conexão avançada (API privada)</summary><p class="small muted">Use apenas o endereço HTTPS de um servidor seu, com chave de acesso temporária. Não configure provedores diretamente no GitHub Pages.</p>
 <label>Endereço HTTPS do seu servidor</label><input id="elAiEndpoint" type="url" placeholder="https://seu-servidor.workers.dev/ai" value="${esc(elAiGateway)}">
 <label>Chave de acesso ao seu servidor (não é chave de API)</label><input id="elAiAccess" type="password" autocomplete="off" placeholder="Chave privada do gateway"></details>
 <div class="el-ai-actions"><button class="btn subtle small-btn" data-action="el-ai-copy" type="button">Copiar solicitação</button><button class="btn subtle small-btn" data-action="el-ai-open" type="button">Abrir assistente</button><button class="btn small-btn" data-action="el-ai-send" type="button">Enviar pela API configurada</button></div><div id="elAiResponse" role="status" aria-live="polite"></div></div>`);
}
function elAiPrompt(){const input=document.getElementById('elAiText')?.value?.trim()||'';const instructions=document.getElementById('elAiInstructions')?.value?.trim()||'';const task=elAiTasks[document.getElementById('elAiTask')?.value]||elAiTasks.review;return `${task}\n${instructions?'Instruções adicionais: '+instructions+'\n':''}\nTRECHO FORNECIDO PELO AUTOR:\n${input||'[Insira o trecho aqui]'}`}
async function elAiSend(){const response=document.getElementById('elAiResponse');if(response)response.textContent='Envio automático desativado por segurança. Use Copiar solicitação e abra o assistente. A conexão direta exigirá servidor autenticado e auditado.';}
document.addEventListener('click',e=>{const el=e.target.closest?.('[data-action="el-ai"],[data-action^="el-ai-"],[data-el-ai-provider]');if(!el)return;
 const a=el.dataset.action;if(el.dataset.elAiProvider){e.preventDefault();e.stopImmediatePropagation();elAiProvider=el.dataset.elAiProvider;document.querySelectorAll('[data-el-ai-provider]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.elAiProvider===elAiProvider)));return}
 if(!a)return;e.preventDefault();e.stopImmediatePropagation();if(a==='el-ai'){elAiModal();return}
 if(a==='el-ai-use-current'){const data=elAiCurrentText();document.getElementById('elAiText').value=data.text.slice(0,25000);return}
 if(a==='el-ai-copy'){navigator.clipboard?.writeText(elAiPrompt()).then(()=>{document.getElementById('elAiResponse').textContent='Solicitação copiada.'}).catch(()=>{document.getElementById('elAiResponse').textContent='Não foi possível copiar automaticamente.'});return}
 if(a==='el-ai-open'){window.open(elAiProviders[elAiProvider].url,'_blank','noopener,noreferrer');return}
 if(a==='el-ai-send'){void elAiSend();return}
 if(a==='el-ai-copy-result'){navigator.clipboard?.writeText(document.querySelector('.el-ai-result')?.textContent||'').then(()=>{document.getElementById('elAiResponse').append(' Resposta copiada.')});return}
},true);


/* Entrelinhas 2.6 — Google Docs como editor original.
   Arquivos externos NÃO entram na sincronização de escrita local e os textos são
   mantidos somente em memória enquanto a sessão de leitura está aberta. */
const elDocsCache=new Map();
const elDocsValidId=id=>typeof id==='string'&&/^[a-zA-Z0-9_-]{10,160}$/.test(id);
const elDocsLink=d=>d?.googleLink?.mode==='external'&&elDocsValidId(d.googleLink.id);
const elDocsUrl=id=>'https://docs.google.com/document/d/'+encodeURIComponent(id)+'/edit';
const elDocsReadableHtml=d=>elDocsCache.get(d.googleLink?.id)?.html||'<p class="el-docs-unloaded">Documento no Google Docs. Toque em <strong>Atualizar</strong> para carregar a leitura, após autorizar sua conta.</p>';
function elDocsTile(d){const words=elDocsCache.get(d.googleLink?.id)?.words??d.googleLink?.lastWords??'—';const p=project(d.projectId);return `<div class="note-card el-docs-row"><div class="row"><div class="grow"><button class="preview" data-read-doc="${esc(d.id)}"><span class="el-docs-pill">Google Docs</span><strong>${esc(d.title)}</strong><div class="small muted">${esc(p?.title||'Sem projeto')} · ${words==='—'?'Contagem pendente':nfmt(words)+' palavras'}</div><div class="tiny muted">Original armazenado no Google · cópia de leitura temporária</div></button></div><div class="btn-group"><button class="btn subtle small-btn" data-read-doc="${esc(d.id)}">Ler</button><button class="btn small-btn" data-action="el-docs-edit" data-el-doc-id="${esc(d.id)}">Editar no Docs</button><a class="el29-newtab" href="${esc(el29DocumentUrl(d.id))}" target="_blank" rel="noopener noreferrer" title="Abrir leitura em outra aba">↗ Nova aba</a></div></div></div>`}
function elDocsEdit(id){const d=doc(id);if(!elDocsLink(d)){flash('Este capítulo não está vinculado a um Google Docs.');return}const a=document.createElement('a');a.href=elDocsUrl(d.googleLink.id);a.target='_blank';a.rel='noopener noreferrer';a.click();}
function elDocsOpenReader(id){const d=doc(id);if(!elDocsLink(d))return;
 const prior=el24Route();documentId=id;view='reader';render();
 try{if(el24RouteSignature(prior)!==el24RouteSignature(el24Route())){history.replaceState({...history.state,[EL24_ROUTE_MARK]:prior},'',location.href);history.pushState({[EL24_ROUTE_MARK]:el24Route()},'',location.href);el24RouteStack++}}catch(e){console.warn('Histórico da leitura:',e)}
 if(hasGoogle())elDocsRefresh(id);
}
async function elDocsAuth(){
 if(hasGoogle())return true;
 const clientId=data.preferences.oauthClientId;
 if(!clientId){googleHelp();return false}
 if(location.protocol!=='https:'&&location.hostname!=='localhost'){flash('A conexão Google exige HTTPS.');return false}
 if(!confirm('Para abrir arquivos escolhidos, o Entrelinhas solicitará acesso somente aos arquivos autorizados (drive.file). Use uma conta de testes até validarmos a integração no seu Android. Continuar?'))return false;
 try{
  await loadGoogle();
  return await new Promise((resolve,reject)=>{
   let finished=false;const tokenClient=google.accounts.oauth2.initTokenClient({client_id:clientId,scope:'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.appdata',callback:(r)=>{
    if(finished)return;finished=true;
    if(!r||r.error||!r.access_token){reject(Error(r?.error||'Acesso não autorizado'));return}
    oauthToken=r.access_token;oauthExpiry=Date.now()+Math.max(60,Number(r.expires_in||3000)-60)*1000;resolve(true);
   },error_callback:()=>{if(!finished){finished=true;reject(Error('A janela de autorização foi fechada ou bloqueada'))}}});
   tokenClient.requestAccessToken({prompt:'consent'});
  });
 }catch(e){alert('Não foi possível conectar ao Google: '+e.message);return false}
}
function elDocsRegister(id,title,pid){
 if(!elDocsValidId(id))throw Error('Identificador Google Docs inválido');
 const existing=data.documents.find(d=>d.googleLink?.mode==='external'&&d.googleLink.id===id);
 if(existing){flash('Esse Google Docs já está na biblioteca.');return existing}
 const d=createDocument(title||'Documento Google',pid,'capitulo','');
 d.googleLink={id,mode:'external',status:'vinculado',lastWords:0};d.googleDocId=id;
 persist(false);return d;
}
async function elDocsCreate(){
 const name=prompt('Título do novo documento no Google Docs:','Novo capítulo');if(name===null)return;
 const title=name.trim().slice(0,140);if(!title){flash('Digite um título para continuar.');return}
 if(!await elDocsAuth())return;
 try{
  const res=await googleApi('https://docs.googleapis.com/v1/documents',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({title})});
  const created=await res.json();if(!elDocsValidId(created.documentId))throw Error('Google não retornou um documento válido');
  const d=elDocsRegister(created.documentId,title,projectId||null);
  render();showDialog(`${modalHead('Documento criado no Google Docs')}<p class="mini">O capítulo <strong>${esc(d.title)}</strong> está na sua biblioteca. O Google Docs é o original: todas as alterações devem ser feitas por lá.</p><a class="btn block" href="${esc(elDocsUrl(d.googleLink.id))}" target="_blank" rel="noopener noreferrer">✎ Abrir para escrever no Google Docs</a><button class="btn subtle block" data-action="close-dialog">Continuar no Entrelinhas</button>`);
 }catch(e){alert('Falha ao criar Google Docs: '+e.message)}
}
function elDocsLoadPicker(){return new Promise((resolve,reject)=>{
 if(window.google?.picker?.PickerBuilder){resolve();return}
 const start=()=>{try{gapi.load('picker',{callback:resolve,onerror:()=>reject(Error('Google Picker indisponível'))})}catch(e){reject(e)}};
 if(window.gapi){start();return}
 const sc=document.createElement('script');sc.src='https://apis.google.com/js/api.js';sc.async=true;sc.onload=start;sc.onerror=()=>reject(Error('Não foi possível carregar o seletor Google'));document.head.appendChild(sc);
})}
async function elDocsPick(){
 if(!await elDocsAuth())return;
 const apiKey=(data.preferences.googlePickerKey||'').trim(),appId=(data.preferences.googleProjectNumber||'').trim();
 if(!/^AIza[\w-]{25,100}$/.test(apiKey)||!/^\d{6,20}$/.test(appId)){
  alert('Configure nas Preferências a chave pública restrita do Google Picker e o número do projeto Google Cloud.');tab='ajustes';view='main';render();return;
 }
 try{await elDocsLoadPicker();
  const googlePicker=google.picker;
  const viewDocs=new googlePicker.DocsView(googlePicker.ViewId.DOCS).setMimeTypes('application/vnd.google-apps.document').setIncludeFolders(false);
  const picker=new googlePicker.PickerBuilder().addView(viewDocs).setOAuthToken(oauthToken).setDeveloperKey(apiKey).setAppId(appId).setOrigin(location.origin)
   .setTitle('Escolha um Google Docs para vincular').setCallback(async result=>{
     if(result.action!==googlePicker.Action.PICKED)return;
     const file=result.docs?.[0];if(!elDocsValidId(file?.id)){alert('Arquivo não compatível. Selecione um documento Google Docs.');return}
     try{
      const r=await googleApi('https://www.googleapis.com/drive/v3/files/'+encodeURIComponent(file.id)+'?fields=id,name,mimeType');const meta=await r.json();
      if(meta.mimeType!=='application/vnd.google-apps.document')throw Error('O arquivo escolhido não é Google Docs');
      const d=elDocsRegister(meta.id,meta.name,projectId||null);render();flash('Documento vinculado, sem alterar o original.');
      if(confirm('Abrir este documento no leitor do Entrelinhas agora?'))elDocsOpenReader(d.id);
     }catch(e){alert('Falha ao vincular: '+e.message)}
   }).build();picker.setVisible(true);
 }catch(e){alert('Não foi possível abrir Google Picker: '+e.message)}
}
async function elDocsRefresh(id=documentId){
 const d=doc(id);if(!elDocsLink(d))return;if(!await elDocsAuth())return;
 const indicator=document.querySelector('#readerText');if(indicator&&documentId===id)indicator.innerHTML='<p class="el-docs-unloaded">Atualizando o texto do Google Docs…</p>';
 try{
  // HTML is a reading representation, not an editable source of truth.
  const r=await googleApi('https://www.googleapis.com/drive/v3/files/'+encodeURIComponent(d.googleLink.id)+'/export?mimeType=text%2Fhtml');
  const type=r.headers.get('content-type')||'';const body=await r.text();if(body.length>8*1024*1024)throw Error('Documento muito grande para este modo de leitura');
  const safe=sanitize(body);
  const content=safe.trim()?safe:'<p>Este documento ainda não contém texto.</p>';
  const words=numWords(content);
  elDocsCache.set(d.googleLink.id,{html:content,words,loadedAt:Date.now()});
  d.googleLink.lastWords=words;d.googleLink.lastChecked=now();persist(false);
  if(view==='reader'&&documentId===id){renderReader();flash('Leitura atualizada a partir do Google Docs.')}else render();
 }catch(e){
  // Do not overwrite an older in-memory version or local documents on failure.
  if(view==='reader'&&documentId===id)renderReader();
  alert('Não foi possível atualizar a leitura. O original permanece no Google Docs. '+e.message);
 }
}
async function elDocsPdf(){
 const d=doc(documentId);if(!elDocsLink(d)||!await elDocsAuth())return;
 try{const r=await googleApi('https://www.googleapis.com/drive/v3/files/'+encodeURIComponent(d.googleLink.id)+'/export?mimeType=application%2Fpdf');const blob=await r.blob();if(blob.size>30*1024*1024)throw Error('PDF muito grande');download(blob,filename(d.title||'documento')+'-google.pdf')}
 catch(e){alert('Não foi possível baixar PDF: '+e.message)}
}
function elDocsSaveConfig(){
 const key=document.getElementById('elDocsPickerKey')?.value.trim()||'',project=document.getElementById('elDocsProjectNumber')?.value.trim()||'';
 if(key&&!/^AIza[\w-]{25,100}$/.test(key)){flash('Formato da chave Google Picker inválido.');return}
 if(project&&!/^\d{6,20}$/.test(project)){flash('O número do projeto deve conter somente dígitos.');return}
 data.preferences.googlePickerKey=key;data.preferences.googleProjectNumber=project;persist(false);flash('Configuração do Google Picker salva neste dispositivo.');
}
// Capture only the new actions, leaving all existing authoring and navigation intact.
document.addEventListener('click',e=>{
 const target=e.target.closest?.('[data-action="el-docs-new"],[data-action="el-docs-picker"],[data-action="el-docs-save-config"],[data-action="el-docs-edit"],[data-action="el-docs-refresh"],[data-action="el-docs-pdf"],[data-read-doc],[data-edit-doc],[data-action="reader-edit"]');
 if(!target)return;
 const action=target.dataset.action;
 const chosen=target.dataset.readDoc||target.dataset.editDoc||documentId;
 const external=doc(chosen)?.googleLink?.mode==='external';
 if(!['el-docs-new','el-docs-picker','el-docs-save-config','el-docs-edit','el-docs-refresh','el-docs-pdf'].includes(action)&&!external)return;
 e.preventDefault();e.stopImmediatePropagation();
 if(action==='el-docs-new')elDocsCreate();else if(action==='el-docs-picker')elDocsPick();
 else if(action==='el-docs-save-config')elDocsSaveConfig();
 else if(action==='el-docs-edit'||action==='reader-edit'||target.dataset.editDoc)elDocsEdit(target.dataset.elDocId||chosen);
 else if(action==='el-docs-refresh')elDocsRefresh();else if(action==='el-docs-pdf')elDocsPdf();
 else if(target.dataset.readDoc)elDocsOpenReader(chosen);
},true);

document.addEventListener('visibilitychange',()=>{if(document.hidden)elDocsCache.clear()});
/* v2.9 — links locais de leitura, sem serializar manuscritos no endereço. */
function el29DocumentUrl(id){const u=new URL(location.pathname,location.origin);u.searchParams.set('el_view','reader');u.searchParams.set('el_id',id);return u.href}
function el29NoteUrl(id){const u=new URL(location.pathname,location.origin);u.searchParams.set('el_view','note');u.searchParams.set('el_id',id);return u.href}
let el29DeepLinked=false;
function el29HandleDeepLink(){
 if(el29DeepLinked||elVaultLocked)return;
 const query=new URLSearchParams(location.search),kind=query.get('el_view'),id=query.get('el_id');
 if(!['reader','note'].includes(kind)||!id||id.length>120)return;
 const obj=kind==='reader'?doc(id):noteById(id);
 // Biblioteca local de outra instalação pode não conter o documento. Nenhum dado é enviado entre dispositivos.
 if(!obj){if(!dbOpening){el29DeepLinked=true;flash('Documento não encontrado nesta biblioteca. Abra a versão deste dispositivo ou importe um backup.')}return}
 el29DeepLinked=true;stopSpeech();closeDialog();
 if(kind==='note'){activeNoteId=id;view='note';noteMode='read';tab='diario'}
 else{documentId=id;view='reader';tab='leitura'}
 render();
 try{history.replaceState({...history.state,[EL24_ROUTE_MARK]:el24Route()},'',location.href)}catch(_){}
}
// Backspace navega apenas fora de qualquer campo editável — nunca apaga texto nem sai do app ao digitar.
document.addEventListener('keydown',e=>{
 if(e.key!=='Backspace'||e.repeat||e.isComposing||e.ctrlKey||e.metaKey||e.altKey||e.shiftKey||elVaultLocked||e.defaultPrevented)return;
 if(e.target?.closest?.('input,textarea,select,[contenteditable], [role="textbox"]'))return;
 if(document.querySelector('dialog[open]'))return;
 const route=el24Route();if(route.view==='main'&&route.tab==='inicio')return;
 e.preventDefault();
 if(el24RouteStack>0){history.back();return}
 if(route.view==='editor'){backFromEditor();return}
 if(route.view==='reader'){backFromReader();return}
 if(route.view==='note'){noteBack();return}
 resetUI();tab='inicio';render();
},true);

/* Navegação integrada ao histórico do Android/PWA. Nunca grava textos no histórico. */
const EL24_ROUTE_MARK='entrelinhas-route-v24';
let el24RestoringRoute=false,el24RouteStack=0;
function el24Route(){return {tab,view,projectId,documentId,activeNoteId,noteMode}}
function el24RouteSignature(x){return [x.tab,x.view,x.projectId,x.documentId,x.activeNoteId,x.noteMode].join('|')}
function el24SaveCurrent(){if(view==='editor')saveDoc(false);else if(view==='reader')readProgress();else if(view==='note'&&noteMode==='edit')saveNotePage(false)}
function el24SetRoute(route){
 if(!route||elVaultLocked)return;
 el24RestoringRoute=true;
 try{el24SaveCurrent();stopSpeech();closeDialog();
  tab=route.tab||'inicio';view=route.view||'main';projectId=route.projectId||null;
  documentId=route.documentId||null;activeNoteId=route.activeNoteId||null;noteMode=route.noteMode||'read';
  if(view==='editor'||view==='reader'){if(!doc(documentId))view='main'}
  if(view==='note'&&!noteById(activeNoteId))view='main';
  render();el24RestoreFonts();window.scrollTo(0,0)
 }finally{el24RestoringRoute=false}
}
try{history.replaceState({...history.state,[EL24_ROUTE_MARK]:el24Route()},'',location.href)}catch(e){console.warn('Histórico não disponível',e)}
window.addEventListener('popstate',e=>{
 const previous=e.state?.[EL24_ROUTE_MARK];if(!previous)return;
 if(el24RouteStack>0)el24RouteStack--;
 el24SetRoute(previous)
});
// Executar após os manipuladores originais. Não cria entradas de histórico para diálogos ou digitação.
document.addEventListener('click',e=>{
 if(el24RestoringRoute||elVaultLocked)return;
 const target=e.target.closest?.('button,[data-open-note],[data-project],[data-tab],[data-action]');if(!target||target.matches('[data-action="editor-back"],[data-action="reader-back"],[data-action="note-back"]'))return;
 const prior=el24Route(),before=el24RouteSignature(prior);
 setTimeout(()=>{
  if(el24RestoringRoute||elVaultLocked)return;
  const next=el24Route();if(el24RouteSignature(next)===before)return;
  try{history.replaceState({...history.state,[EL24_ROUTE_MARK]:prior},'',location.href);
      history.pushState({[EL24_ROUTE_MARK]:next},'',location.href);el24RouteStack++}
  catch(e){console.warn('Não foi possível registrar navegação',e)}
 },0)
},true);

document.addEventListener('click',event=>{
 const btn=event.target.closest?.('[data-action="editor-back"],[data-action="reader-back"],[data-action="note-back"]');
 if(!btn||el24RouteStack===0)return;
 event.preventDefault();event.stopImmediatePropagation();history.back()
},true);

// Botão contextual somente na página de notas, sem alterar seu layout principal.
const elAiNotesObserver=new MutationObserver(()=>{if(view!=='note')return;const top=document.querySelector('#app .note-top, #app .note-page-header, #app .editor-top, #app .note-toolbar');if(top&&!top.querySelector('[data-action="el-ai"]')){const button=document.createElement('button');button.className='icon-btn';button.setAttribute('data-action','el-ai');button.setAttribute('aria-label','Central de IA');button.title='Central de IA';button.textContent='✦';top.append(button)}});
const elAiApp=document.getElementById('app');if(elAiApp)elAiNotesObserver.observe(elAiApp,{childList:true,subtree:true});


// v2.7 — atalhos seguros para a versão desktop. Não interferem na digitação.
document.addEventListener('keydown', event=>{
 if(elVaultLocked || event.isComposing || event.altKey && !event.ctrlKey && !event.metaKey) return;
 const cmd=event.ctrlKey||event.metaKey;
 const element=event.target;
 const typing=!!element?.closest?.('input,textarea,select,[contenteditable="true"]');
 if(cmd && !event.altKey && event.key.toLowerCase()==='s'){
  event.preventDefault();
  if(view==='editor')saveDoc(true);
  else if(view==='note'&&noteMode==='edit')saveNotePage(false);
  else flash('Seus registros são salvos automaticamente neste aparelho.');
  return;
 }
 if(event.key==='Escape'&&document.getElementById('dialog')?.open){closeDialog();return}
 if(typing||!cmd||!event.altKey||event.shiftKey||view!=='main')return;
 const destinations={'1':'inicio','2':'projetos','3':'escrita','4':'leitura','5':'diario'};
 const destination=destinations[event.key];
 if(!destination)return;
 event.preventDefault();
 document.querySelector('#nav [data-tab="'+destination+'"]')?.click();
});

})();

