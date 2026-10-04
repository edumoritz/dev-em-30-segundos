// Humanos: trechos de domínio público, com fonte. Mistos: adaptações por IA.
// Gerados: exemplos criados por IA. A ordem muda; a origem não.
const fiscalCases = [
  {
    "text": "Dom Casmurro, domingo vou jantar com você.",
    "origin": "human",
    "note": "Bilhete ficcional escrito por Machado de Assis em Dom Casmurro, capítulo I. Texto anterior à IA generativa.",
    "source": "https://pt.wikisource.org/wiki/Dom_Casmurro/I"
  },
  {
    "text": "Ha livros que apenas terão isso dos seus autores; alguns nem tanto.",
    "origin": "human",
    "note": "Machado de Assis, Dom Casmurro, capítulo I. Grafia da edição de 1899 preservada.",
    "source": "https://pt.wikisource.org/wiki/Dom_Casmurro/I"
  },
  {
    "text": "Pois sim, mas eu queria ver.",
    "origin": "human",
    "note": "Fala escrita por Machado de Assis em Dom Casmurro, capítulo CX. Uma frase curta também tem autoria documentada.",
    "source": "https://pt.wikisource.org/wiki/Dom_Casmurro/CX"
  },
  {
    "text": "Ia dizer religioso, risquei a palavra, mas aqui a ponho outra vez",
    "origin": "human",
    "note": "Trecho de Machado de Assis em Dom Casmurro, capítulo CX. Até um escritor humano revisava as próprias palavras.",
    "source": "https://pt.wikisource.org/wiki/Dom_Casmurro/CX"
  },
  {
    "text": "O detector acusou minha lista de compras. Agora o tomate precisa provar que nasceu na horta.",
    "origin": "ai",
    "note": "Piada inteiramente gerada por IA para este jogo."
  },
  {
    "text": "mano fui corrigir uma vírgula e perdi meu certificado de ser humano kkk",
    "origin": "ai",
    "note": "Exemplo gerado por IA com gíria e erros intencionais. Escrita informal não comprova autoria humana."
  },
  {
    "text": "Há opiniões que apenas terão isso dos seus donos; algumas nem tanto.",
    "origin": "ai",
    "note": "Frase criada por IA imitando um registro literário. Tom antigo também pode ser gerado."
  },
  {
    "text": "Dom Casmurro, vou almoçar aí no domingo. Deixa um lugar pra mim.",
    "origin": "mixed",
    "note": "IA adaptou o bilhete humano “Dom Casmurro, domingo vou jantar com você”, de Machado de Assis, mudando refeição e tom.",
    "source": "https://pt.wikisource.org/wiki/Dom_Casmurro/I"
  },
  {
    "text": "Tá, eu entendi. Mas ainda queria ver com meus próprios olhos.",
    "origin": "mixed",
    "note": "IA reformulou a fala humana “Pois sim, mas eu queria ver”, de Dom Casmurro, capítulo CX.",
    "source": "https://pt.wikisource.org/wiki/Dom_Casmurro/CX"
  },
  {
    "text": "Eu ia escrever “religioso”, apaguei e depois coloquei de novo.",
    "origin": "mixed",
    "note": "IA reformulou um trecho humano do capítulo CX de Dom Casmurro. A origem da ideia e a redação final são diferentes.",
    "source": "https://pt.wikisource.org/wiki/Dom_Casmurro/CX"
  }
];
let fiscalDeck=[], fiscalIndex=0, fiscalScore=0, fiscalAccusations=0, fiscalAnswered=false;
const originLabels={human:'Humano',ai:'IA',mixed:'Humano + IA'};
function navigateStory(story){
  const hash=story?'#'+story:'';
  if(location.hash===hash)openStory();else location.hash=hash;
}
function openStory(){
  clearTimers();clearTimeout(toastTimer);$('toast').classList.remove('show');
  const story=location.hash.slice(1);
  $('intro').hidden=story==='fiscal-de-ia'||story==='dev-em-30-segundos';
  $('game').hidden=!$('intro').hidden;
  if(story==='dev-em-30-segundos'){
    escapes=0;requests=0;bonus=0;render(1);
  }else if(story==='fiscal-de-ia'){
    startFiscal();
  }else{
    stage=0;$('intro').querySelector('h1').tabIndex=-1;$('intro').querySelector('h1').focus({preventScroll:true});
  }
  window.scrollTo(0,0);
}
function startFiscal(){
  fiscalDeck=fiscalCases.slice();
  for(let i=fiscalDeck.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[fiscalDeck[i],fiscalDeck[j]]=[fiscalDeck[j],fiscalDeck[i]];}
  fiscalIndex=0;fiscalScore=0;fiscalAccusations=0;
  fiscalFrame('CONTRATAÇÃO APROVADA',0);
  $('content').innerHTML='<div class="eyebrow">DEPARTAMENTO DE PALPITES NÃO SOLICITADOS</div><h2>Seu currículo nos impressionou.</h2><div class="fiscal-supervisor"><span class="chat-label">SUPERVISOR · SR. CERTEZA</span><p>Você identificou um travessão num comentário. É esse tipo de investigação que procuramos.</p></div><p class="sub">Seu primeiro plantão tem 10 textos. Dê o veredito: humano, IA ou humano + IA. Aqui, até um palpite pode render uma promoção.</p><button class="primary" id="beginFiscal">Assumir meu cargo →</button><p class="case-note">O arquivo mistura trechos de livros e comentários fictícios, com origem registrada. As ferramentas são zoeira. A fonte aparece depois do palpite.</p>';
  $('beginFiscal').onclick=()=>{beep();renderFiscal();};
  fiscalFocus();
}
function fiscalFrame(label,progress){
  $('stageLabel').textContent=label;
  $('confidence').textContent='ACERTOS: '+fiscalScore+' · '+fiscalRank().toUpperCase();
  $('progress').style.width=progress+'%';
  $('windowTitle').textContent='fiscal-do-reddit.exe';
}
function fiscalFocus(){const h=$('content').querySelector('h2');h.tabIndex=-1;h.focus({preventScroll:true});}
function fiscalRank(){
  return fiscalIndex<3?'Fiscal estagiário':fiscalIndex<7?'Supervisor de suspeitas':'Chefe da fiscalização';
}
function fiscalSupervisor(){
  if(fiscalIndex===0)return 'Primeiro plantão. Se o texto estiver bem escrito, mantenha a calma. Isso ainda é permitido.';
  if(fiscalIndex===3)return 'Promoção aprovada. Agora você tem ferramentas novas e a mesma quantidade de evidências.';
  if(fiscalIndex===7)return 'Você chegou à chefia. Nossa meta é reduzir IA. Por enquanto, só reduzimos os comentários.';
  return '';
}
function renderFiscal(){
  fiscalAnswered=false;
  fiscalFrame('CASO '+String(fiscalIndex+1).padStart(2,'0')+' / 10',fiscalIndex*10);
  const supervisor=fiscalSupervisor();
  $('content').innerHTML=`<div class="eyebrow">DEPARTAMENTO DE PALPITES NÃO SOLICITADOS</div><h2>${fiscalIndex===3?'Parabéns, supervisor.':fiscalIndex===7?'A chefia é sua.':'Isso tem cara de IA?'}</h2>${supervisor?'<div class="fiscal-supervisor"><span class="chat-label">SUPERVISOR · SR. CERTEZA</span><p>'+supervisor+'</p></div>':''}<div class="fiscal-tools" ${fiscalIndex<3?'hidden':''}>${fiscalIndex>=3?'<button class="quiet" id="commaTool">Detector de vírgula</button><button class="quiet" id="thereforeTool">Farejador de “portanto”</button>':''}${fiscalIndex>=7?'<button class="quiet" id="politeTool">Medidor de educação</button>':''}</div><div class="reddit-comment"><div class="chat-label">TEXTO SOB INVESTIGAÇÃO</div><blockquote id="suspectText"></blockquote></div><div class="fiscal-choices"><button class="choice" data-origin="human">Foi humano</button><button class="choice" data-origin="ai">Foi IA</button><button class="choice" data-origin="mixed">Humano + IA</button></div><div id="verdict" aria-live="polite"></div><p class="case-note">Humanos: trechos de domínio público. IA: exemplos gerados. Humano + IA: adaptações desses trechos. A fonte aparece após o palpite.</p>`;
  $('suspectText').textContent=fiscalDeck[fiscalIndex].text;
  if($('commaTool'))$('commaTool').onclick=()=>toast('Vírgula encontrada. O ensino fundamental será investigado.');
  if($('thereforeTool'))$('thereforeTool').onclick=()=>toast('Se escreveu “portanto”, já temos motivo para abrir uma pasta.');
  if($('politeTool'))$('politeTool').onclick=()=>toast('Agradeceu pela resposta. Gentileza acima do limite permitido.');
  $('content').querySelectorAll('[data-origin]').forEach(b=>b.onclick=()=>judgeFiscal(b.dataset.origin));
  fiscalFocus();
}
function fiscalReaction(correct,guess,origin){
  if(correct)return 'Seu feeling acertou. A chefia vai chamar isso de método.';
  if(guess==='ai'&&origin==='mixed')return 'O pensamento era humano. A vírgula veio de uma consultoria externa.';
  if(guess==='ai'&&origin==='human')return 'Acusou um humano. O departamento chama isso de iniciativa.';
  return 'O palpite não resistiu à primeira evidência. Sua promoção continua de pé.';
}
function judgeFiscal(guess){
  if(fiscalAnswered||!Object.hasOwn(originLabels,guess))return;
  fiscalAnswered=true;
  const item=fiscalDeck[fiscalIndex],correct=guess===item.origin;
  if(correct)fiscalScore++;
  if(guess==='ai'&&item.origin==='human')fiscalAccusations++;
  $('content').querySelectorAll('[data-origin]').forEach(b=>{b.disabled=true;b.classList.toggle('correct-origin',b.dataset.origin===item.origin);});
  fiscalFrame('CASO '+String(fiscalIndex+1).padStart(2,'0')+' / 10',(fiscalIndex+1)*10);
  $('verdict').innerHTML='<div class="result"><strong id="verdictTitle"></strong><p id="originNote"></p><span id="promotion"></span></div><div class="row"><button class="primary" id="nextCase">'+(fiscalIndex===9?'Receber meu certificado':fiscalIndex===2?'Aceitar promoção →':fiscalIndex===6?'Assumir a chefia →':'Próximo suspeito →')+'</button><button class="secondary" id="dispute">Discordo do resultado</button></div>';
  $('verdictTitle').textContent=(correct?'Acertou! ':'Palpite rejeitado. ')+'Origem: '+originLabels[item.origin]+'.';
  $('originNote').textContent=item.note;
  if(item.source){const link=document.createElement('a');link.href=item.source;link.target='_blank';link.rel='noopener noreferrer';link.textContent='Consultar texto original ↗';link.className='source-link';$('originNote').append(document.createElement('br'),link);}
  $('promotion').textContent=fiscalReaction(correct,guess,item.origin);
  $('dispute').onclick=()=>toast('Sua intuição será encaminhada para substituir o registro de autoria.');
  let advanced=false;
  $('nextCase').onclick=()=>{if(advanced)return;advanced=true;fiscalIndex++;if(fiscalIndex===10)finishFiscal();else renderFiscal();};
  beep();$('nextCase').focus({preventScroll:true});
}
function fiscalCertificate(){
  if(fiscalScore<=3)return {title:'Diretor de acusações sem provas',note:'Poucos acertos, carreira meteórica. A diretoria precisa de você.'};
  if(fiscalAccusations>=2)return {title:'Caçador de humanos suspeitos',note:'Você encontrou IA onde havia gente. O departamento chama isso de iniciativa.'};
  if(fiscalScore>=8)return {title:'Fiscal com evidências',note:'Você investigou antes de acusar. O departamento ainda não sabe como lidar com isso.'};
  return {title:'Especialista em feeling',note:'Seu palpite virou um laudo. A evidência ainda está em análise.'};
}
function finishFiscal(){
  // Reuse the original Pix section and its handlers, including clipboard fallback.
  renderOriginalStory(4);
  const pixSupport=$('content').querySelector('.pix-support');
  const certificate=fiscalCertificate();
  fiscalFrame('FISCALIZAÇÃO CONCLUÍDA',100);
  $('content').innerHTML='<div class="certificate"><div class="eyebrow">INSTITUTO É SÓ PEDIR PRA IA</div><h2>Fiscal de IA</h2><p id="fiscalTitle"></p><div class="stamp">CARREIRA METEÓRICA</div><p class="fiscal-score" id="fiscalScore"></p><p id="accusations"></p></div><p class="final-quote" id="careerNote"></p><p class="sub">Este placar vale só para estes 10 exemplos. Não mede sua capacidade de detectar IA em qualquer texto. Uma pessoa pode escrever bem; uma IA pode errar; uma ideia humana pode receber ajuda na redação.</p><div class="row center"><button class="primary" id="retryFiscal">Fiscalizar de novo</button><button class="secondary" id="tryDev">Experimentar É Só Pedir pra IA</button><button class="secondary" id="shareFiscal">Compartilhar meu placar</button></div>';
  $('content').insertBefore(pixSupport,$('content').querySelector('.row.center'));
  $('fiscalTitle').textContent=certificate.title;
  $('careerNote').textContent=certificate.note;
  $('fiscalScore').textContent=fiscalScore+' de 10 acertos.';
  pixSupport.querySelector('h3').textContent='Contribua com o departamento.';
  pixSupport.querySelector('p').textContent='Nosso detector custa R$ 0 e continua acima do orçamento. Se a fiscalização rendeu uma risada, o Pix é opcional.';
  $('accusations').textContent='Humanos acusados de serem IA: '+fiscalAccusations+'.';
  $('retryFiscal').onclick=startFiscal;
  $('tryDev').onclick=()=>navigateStory('dev-em-30-segundos');
  $('shareFiscal').onclick=async()=>{
    const url=new URL(location.href);url.hash='fiscal-de-ia';
    const text='Virei '+certificate.title+' no Fiscal de IA: '+fiscalScore+'/10 acertos. '+url.href;
    try{await navigator.clipboard.writeText(text);toast('Placar e link copiados!');}catch{toast('Copie o link da barra de endereço para compartilhar.');}
  };
  fiscalFocus();
}
// Extend the original story without rewriting its Pix implementation.
$('start').onclick=()=>{beep();navigateStory('dev-em-30-segundos');};
$('startFiscal').onclick=()=>{beep();navigateStory('fiscal-de-ia');};
$('restart').onclick=()=>navigateStory('');
const renderOriginalStory=render;
render=function(n){
  renderOriginalStory(n);
  if(n===4){const button=document.createElement('button');button.id='otherStory';button.className='secondary';button.textContent='Experimentar Fiscal de IA';button.onclick=()=>navigateStory('fiscal-de-ia');$('content').querySelector('.row.center').append(button);}
};
window.addEventListener('hashchange',openStory);
openStory();
