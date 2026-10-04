// Humanos: trechos de domínio público, com fonte. Mistos: adaptações por IA.
// Gerados: exemplos criados por IA. A ordem muda; a origem não.
const fiscalCases = [
  {
    "text": "Se embaraçar, você desembaraça depois.",
    "origin": "human",
    "reveal": "O famoso “faz aí, depois a gente arruma” já existia em 1899. O cliente só mudou de roupa.",
    "note": "Fala de Bentinho em Dom Casmurro, capítulo XXXII, de Machado de Assis. Trecho humano, sem reformulação.",
    "source": "https://pt.wikisource.org/wiki/Dom_Casmurro/XXXII"
  },
  {
    "text": "Matamos o tempo; o tempo nos enterra.",
    "origin": "human",
    "reveal": "Parece uma legenda dramática gerada em dois segundos. Machado escreveu antes de existir Wi-Fi.",
    "note": "Machado de Assis, Memórias Póstumas de Brás Cubas, capítulo CXIX. Trecho humano, sem reformulação.",
    "source": "https://pt.wikisource.org/wiki/Memórias_Póstumas_de_Brás_Cubas/CXIX"
  },
  {
    "text": "Medo de apanhar, de ser preso, de brigar, de andar, de trabalhar...",
    "origin": "human",
    "reveal": "Até o medo de trabalhar tem autoria documentada. O RH preferiu não comentar.",
    "note": "Fala de Capitu em Dom Casmurro, capítulo XLIII, de Machado de Assis. Trecho humano, sem reformulação.",
    "source": "https://pt.wikisource.org/wiki/Dom_Casmurro/XLIII"
  },
  {
    "text": "Ia dizer religioso, risquei a palavra, mas aqui a ponho outra vez",
    "origin": "human",
    "reveal": "Até os humanos corrigem o que escrevem. Machado apagou, pensou e colocou de volta. Continuou humano.",
    "note": "Trecho de Machado de Assis em Dom Casmurro, capítulo CX. Mantido do arquivo original.",
    "source": "https://pt.wikisource.org/wiki/Dom_Casmurro/CX"
  },
  {
    "text": "Corrigi os erros do comentário e agora parece que perdi minha identidade.",
    "origin": "ai",
    "reveal": "Aparentemente, seu certificado de humanidade dependia de escrever “concerteza”.",
    "note": "Comentário fictício inteiramente criado por IA para este jogo."
  },
  {
    "text": "Obrigado por explicar. Continuo discordando, mas agora com mais informação.",
    "origin": "ai",
    "reveal": "Discordou sem xingar. O departamento considera esse comportamento suspeito.",
    "note": "Comentário fictício inteiramente criado por IA para este jogo. Educação, por si só, não identifica autoria."
  },
  {
    "text": "Li só o título, mas já tenho uma opinião bastante formada.",
    "origin": "ai",
    "reveal": "Qualificação suficiente para assumir a chefia. A IA também sabe simular um especialista de comentários.",
    "note": "Comentário fictício inteiramente criado por IA para este jogo."
  },
  {
    "text": "Confia em você, mas não precisa achar que todo mundo está errado.",
    "origin": "mixed",
    "reveal": "O conselho é humano. A IA só tirou a roupa de 1881. A autoestima veio sem atualização.",
    "note": "IA reformulou “Crê em ti; mas nem sempre duvides dos outros.”, de Machado de Assis, em Memórias Póstumas de Brás Cubas, capítulo CXIX.",
    "source": "https://pt.wikisource.org/wiki/Memórias_Póstumas_de_Brás_Cubas/CXIX"
  },
  {
    "text": "Eu quase não apareço. Quando apareço, prefiro ficar quieto.",
    "origin": "mixed",
    "reveal": "A introversão era humana. A IA só ajudou a explicar por que a pessoa sumiu do grupo.",
    "note": "IA reformulou “Em verdade, pouco appareço e menos falo.”, de Machado de Assis, em Dom Casmurro, capítulo II.",
    "source": "https://pt.wikisource.org/wiki/Dom_Casmurro/II"
  },
  {
    "text": "Se for pra falar “vamos embora”, fala logo. Desse jeito eu não entendi nada.",
    "origin": "mixed",
    "reveal": "A dificuldade de entender indireta veio de um humano. A IA deixou a reclamação mais direta.",
    "note": "Adaptação por IA do trecho “Se ela tem dito simplesmente: ‘Vamos embora!’ pode ser que eu obedecesse ou não; em todo caso, entenderia.”, de Dom Casmurro, capítulo XLIII. A adaptação muda a narração para uma reclamação.",
    "source": "https://pt.wikisource.org/wiki/Dom_Casmurro/XLIII"
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
  $('content').innerHTML=`<div class="eyebrow">DEPARTAMENTO DE PALPITES NÃO SOLICITADOS</div><h2>${fiscalIndex===3?'Parabéns, supervisor.':fiscalIndex===7?'A chefia é sua.':'Isso tem cara de IA?'}</h2>${supervisor?'<div class="fiscal-supervisor"><span class="chat-label">SUPERVISOR · SR. CERTEZA</span><p>'+supervisor+'</p></div>':''}<div class="fiscal-tools" ${fiscalIndex<3?'hidden':''}>${fiscalIndex>=3?'<button class="quiet" id="commaTool">Detector de vírgula</button><button class="quiet" id="thereforeTool">Farejador de “portanto”</button>':''}${fiscalIndex>=7?'<button class="quiet" id="politeTool">Medidor de educação</button>':''}</div><div class="reddit-comment"><div class="chat-label fiscal-case-header"><span>TEXTO SOB INVESTIGAÇÃO</span><span id="questionCounter" class="fiscal-counter" aria-label="Pergunta ${fiscalIndex+1} de ${fiscalDeck.length}">${fiscalIndex+1}/${fiscalDeck.length}</span></div><blockquote id="suspectText"></blockquote></div><div class="fiscal-choices"><button class="choice" data-origin="human">Foi humano</button><button class="choice" data-origin="ai">Foi IA</button><button class="choice" data-origin="mixed">Humano + IA</button></div><div id="verdict" aria-live="polite"></div><p class="case-note">Humanos: trechos de domínio público. IA: exemplos gerados. Humano + IA: adaptações desses trechos. A fonte aparece após o palpite.</p>`;
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
  $('verdict').innerHTML='<div class="result"><strong id="verdictTitle"></strong><p id="caseReveal"></p><p id="originNote"></p><span id="promotion"></span></div><div class="row"><button class="primary" id="nextCase">'+(fiscalIndex===9?'Receber meu certificado':fiscalIndex===2?'Aceitar promoção →':fiscalIndex===6?'Assumir a chefia →':'Próximo suspeito →')+'</button><button class="secondary" id="dispute">Discordo do resultado</button></div>';
  $('verdictTitle').textContent=(correct?'Acertou! ':'Palpite rejeitado. ')+'Origem: '+originLabels[item.origin]+'.';
  $('caseReveal').textContent=item.reveal;
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
