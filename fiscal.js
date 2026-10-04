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
  fiscalIndex=0;fiscalScore=0;fiscalAccusations=0;renderFiscal();
}
function fiscalFrame(label,progress){
  $('stageLabel').textContent=label;
  $('confidence').textContent='ACERTOS: '+fiscalScore+' · CONVICÇÃO: 100%';
  $('progress').style.width=progress+'%';
  $('windowTitle').textContent='fiscal-do-reddit.exe';
}
function fiscalFocus(){const h=$('content').querySelector('h2');h.tabIndex=-1;h.focus({preventScroll:true});}
function renderFiscal(){
  fiscalAnswered=false;
  fiscalFrame('CASO '+String(fiscalIndex+1).padStart(2,'0')+' / 10',fiscalIndex*10);
  $('content').innerHTML='<div class="eyebrow">DEPARTAMENTO DE PALPITES NÃO SOLICITADOS</div><h2>Isso tem cara de IA?</h2><p class="sub">Você foi contratado para fiscalizar o Reddit. Julgue o texto: pessoa, IA ou texto humano adaptado por IA? Há comentários fictícios e trechos de livros antigos no arquivo.</p><div class="fiscal-tools"><button class="quiet" id="dashTool">Detector de travessão</button><button class="quiet" id="typoTool">Medidor de erros</button></div><div class="reddit-comment"><div class="chat-label">TEXTO SOB INVESTIGAÇÃO</div><blockquote id="suspectText"></blockquote></div><div class="fiscal-choices"><button class="choice" data-origin="human">Foi humano</button><button class="choice" data-origin="ai">Foi IA</button><button class="choice" data-origin="mixed">Humano + IA</button></div><div id="verdict" aria-live="polite"></div><p class="case-note">Humanos: trechos de obras de domínio público. IA: exemplos gerados. Humano + IA: adaptações desses trechos. A fonte aparece após o palpite. Não é um detector real.</p>';
  $('suspectText').textContent=fiscalDeck[fiscalIndex].text;
  $('dashTool').onclick=()=>toast('Tem pontuação. Estamos acionando as autoridades.');
  $('typoTool').onclick=()=>toast('IA também escreve errado. Ferramenta inútil desbloqueada.');
  $('content').querySelectorAll('[data-origin]').forEach(b=>b.onclick=()=>judgeFiscal(b.dataset.origin));
  fiscalFocus();
}
function judgeFiscal(guess){
  if(fiscalAnswered)return;fiscalAnswered=true;
  const item=fiscalDeck[fiscalIndex],correct=guess===item.origin;
  if(correct)fiscalScore++;
  if(guess==='ai'&&item.origin==='human')fiscalAccusations++;
  $('content').querySelectorAll('[data-origin]').forEach(b=>{b.disabled=true;b.classList.toggle('correct-origin',b.dataset.origin===item.origin);});
  fiscalFrame('CASO '+String(fiscalIndex+1).padStart(2,'0')+' / 10',(fiscalIndex+1)*10);
  $('verdict').innerHTML='<div class="result"><strong id="verdictTitle"></strong><p id="originNote"></p><span id="promotion"></span></div><div class="row"><button class="primary" id="nextCase">'+(fiscalIndex===9?'Receber meu certificado':'Próximo suspeito →')+'</button><button class="secondary" id="dispute">Discordo do resultado</button></div>';
  $('verdictTitle').textContent=(correct?'Acertou! ':'Errou com autoridade. ')+'Origem: '+originLabels[item.origin]+'.';
  $('originNote').textContent=item.note;
  if(item.source){const link=document.createElement('a');link.href=item.source;link.target='_blank';link.rel='noopener noreferrer';link.textContent='Consultar texto original ↗';link.className='source-link';$('originNote').append(document.createElement('br'),link);}
  $('promotion').textContent=correct?'Seu feeling acertou este caso. Sem garantia para o próximo.':(guess==='ai'&&item.origin==='human'?'Você acusou um humano. Promoção por excesso de convicção.':'Promovido a supervisor de suspeitas. O departamento valoriza confiança.');
  $('dispute').onclick=()=>toast('Sua intuição será encaminhada para substituir o registro de autoria.');
  $('nextCase').onclick=()=>{fiscalIndex++;if(fiscalIndex===10)finishFiscal();else renderFiscal();};
  beep();$('nextCase').focus({preventScroll:true});
}
function finishFiscal(){
  fiscalFrame('FISCALIZAÇÃO CONCLUÍDA',100);
  $('content').innerHTML='<div class="certificate"><div class="eyebrow">INSTITUTO É SÓ PEDIR PRA IA</div><h2>Fiscal de IA</h2><p>Especialista em reconhecer ChatGPT pelo feeling.</p><div class="stamp">CONVICÇÃO MÁXIMA</div><p class="fiscal-score" id="fiscalScore"></p><p id="accusations"></p></div><p class="final-quote">Seu palpite virou um laudo.<br><span class="lime">A evidência ainda está em análise.</span></p><p class="sub">Este placar vale só para estes 10 exemplos. Não mede sua capacidade de detectar IA em qualquer texto. Uma pessoa pode escrever bem; uma IA pode errar; uma ideia humana pode receber ajuda na redação.</p><div class="row center"><button class="primary" id="retryFiscal">Fiscalizar de novo</button><button class="secondary" id="tryDev">Experimentar É Só Pedir pra IA</button><button class="secondary" id="shareFiscal">Compartilhar meu placar</button></div>';
  $('fiscalScore').textContent=fiscalScore+' de 10 acertos. Confiança: 100%.';
  $('accusations').textContent='Humanos acusados de serem IA: '+fiscalAccusations+'.';
  $('retryFiscal').onclick=startFiscal;
  $('tryDev').onclick=()=>navigateStory('dev-em-30-segundos');
  $('shareFiscal').onclick=async()=>{
    const url=new URL(location.href);url.hash='fiscal-de-ia';
    const text='Acertei '+fiscalScore+' de 10 no Fiscal de IA. Minha confiança continua em 100%. '+url.href;
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
