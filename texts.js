<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Cohesive Dynamic Quiz Example</title>
  <link href="https://fonts.googleapis.com/css?family=Inter:400,500|Montserrat:400,500,700&display=swap" rel="stylesheet">
  <style>
    body {
      background: linear-gradient(135deg,#2c5aa0 0%,#f5a9ba 100%);
      font-family: 'Inter', 'Montserrat', Arial, sans-serif;
      margin:0;
    }
    .container {
      max-width: 720px;
      margin:0 auto;
      padding:20px 1vw 60px 1vw;
    }
    h1 {
      text-align: center;
      color: #fff;
      font-size:2.22rem;
      letter-spacing: 0.04em;
      font-family: 'Montserrat', 'Inter', 'Segoe UI', Arial, sans-serif;
    }
    .card {
      background: linear-gradient(135deg,rgba(44,90,160,0.28) 0%,rgba(245,169,186,0.28) 100%);
      backdrop-filter: blur(13px) saturate(1.2);
      border: 1.5px solid rgba(255,255,255,0.14);
      border-radius: 14px;
      box-shadow: 0 10px 26px -8px rgba(44,90,160,0.08), 0 1.5px 3px #eee6;
      padding:14px 8px 16px 10px;
      margin-bottom: 17px;
      transition: background .22s, box-shadow .22s;
    }
    .text-box {
      margin-bottom: 13px;
      color: #222;
      line-height: 1.41;
      font-size: 0.94rem;
    }
    .question-title {
      font-size: 0.87rem;
      margin-bottom: 7px;
      color: #2442b0;
      font-weight: 500;
    }
    .choices {
      display: flex;
      flex-direction: column;
      gap: 0;
      margin-bottom: 2px;
    }
    .choice {
      background: linear-gradient(120deg, rgba(44,90,160,0.23) 0%, rgba(245,169,186,0.20) 100%);
      font-size: 0.78rem;
      font-family: 'Inter', 'Montserrat', Arial, sans-serif;
      font-weight: 500;
      padding: 5px 10px;
      min-height: 22px;
      border-radius: 8px;
      border-left: 5px solid #FFA066;
      color: #222b2c;
      margin-bottom: 2px;
      box-shadow: 0 2px 9px -2px rgba(44,90,160,0.09);
      cursor:pointer;
      transition: background .2s, color .2s, border-left-color .14s;
      position: relative;
      overflow: hidden;
      backdrop-filter: blur(8px) saturate(1.25);
      line-height: 1.16;
      white-space: normal;
      word-break: break-word;
    }
    .choice.selected, .choice:active {
      background: linear-gradient(90deg, #eaffba 0%, #bfff00 90%);
      color: #274604;
      border-left-color: #bfff00;
      font-weight: 600;
      box-shadow: 0 4px 14px -2px #bfff0040;
    }
    .choice:hover {
      background: rgba(255,255,255,0.23);
      color: #784621;
    }
    .choice::before {
      content: '';
      position: absolute;
      left: 0; top: 0; bottom: 0;
      width: 5px;
      background: linear-gradient(200deg, #FFA066 30%, #e96443 100%);
      border-radius: 6px 0 0 6px;
      z-index: 2;
      transition: background .17s;
    }
    .highlighted {
      background: #daff47;
      color: #16390e;
      border-radius: 2px;
      padding: 0 2px;
      font-weight: 600;
    }
    .feedback {
      margin-top: 2px;
      font-size: 0.91em;
      color: #c72c2c;
      min-height: 10px;
    }
    .card-actions {
      margin-top: 3px;
      display: flex;
      gap: 7px;
    }
    .card-btn {
      background: #bfff00;
      color: #214e19;
      border: none;
      border-radius: 8px;
      font-size: 0.86em;
      padding: 6px 11px;
      cursor: pointer;
      box-shadow: 0 0.5px 2px #ddeedd;
      transition: background 0.13s;
      font-family: inherit;
    }
    .card-btn:active {
      background: #c8fa5e;
    }
    .card-btn:disabled {
      background: #cdecce;
      cursor: default;
      opacity: 0.7;
    }
    .footer {
      background: #222;
      color:#fff;
      font-weight:600;
      max-width:670px;
      margin:0 auto;
      padding:7px 7vw 7px 9px;
      text-align:center;
      font-size:1.01rem;
      position:fixed;
      left:50%;
      bottom:0;
      transform:translateX(-50%);
      width:97vw;
      border-radius: 12px 12px 0 0;
      z-index:15;
      display:flex;
      align-items:center;
      justify-content:center;
    }
    .footer-btn {
      background: none;
      color:#fff;
      border:none;
      font-size:0.94rem;
      font-weight:600;
      margin-left:10px;
      margin-right:4px;
      cursor:pointer;
      display:flex;
      align-items:center;
    }
    .footer-btn .arrow { font-size:1.08em; margin-right:7px; }
    @media (max-width:700px){
      .container { padding: 5px 2vw 35px 2vw; }
      .choice { font-size: 0.67rem; padding: 2px 6px 2px 5px; }
    }
    @media (max-width:480px){
      .container { font-size:0.91em; margin-top:8px; }
      h1{ font-size:1.08em; }
      .choice { font-size: 0.67rem; padding: 2px 6px 2px 5px; }
    }
  </style>
</head>
<body>
  <!-- Main quiz container where dynamic content loads -->
  <div id="app">
    <div style="text-align:center; color:#2442b0; margin-top:50px;">Loading quiz...</div>
  </div>
  <script>
    function getQueryParam(name) {
      let match = location.search.match(new RegExp("[?&]"+name+"=([^&]*)"));
      return match && decodeURIComponent(match[4]);
    }
    let manifestUrl = "fetchfiles-reading-texts.json";
    let passageData = {};
    let testId = getQueryParam('test');
    fetch(manifestUrl)
      .then(r=>r.json())
      .then(data=>{
        let manifest = data.find(item=>item.id===testId);
        if (!manifest) { document.getElementById('app').innerHTML = "<p>Test not found.</p>"; return;}
        return fetch(manifest.file).then(r=>r.json());
      })
      .then(data=>{
        if (!data) return;
        passageData = data;
        renderCards(passageData);
      });

    function renderCards(data) {
      let html = `
        <div class="container">
          <h1>${data.title||''}</h1>
          <div class="subtitle">${data.subtitle||''}</div>
          <div class="divider"></div>
          ${data.cards.map((card,i)=>`
          <div class="card" data-idx="${i}">
            <div class="text-box">
              ${card.text.replace(card.highlight, `<span id="ref-${i}">${card.highlight}</span>`)}
            </div>
            <div class="question-title">${card.question}</div>
            <div class="choices">
              ${card.choices.map((c,j)=>`
                <div class="choice" data-answer="${String.fromCharCode(65+j)}">${String.fromCharCode(65+j)}. ${c}</div>
              `).join("")}
            </div>
            <div class="feedback" id="feedback-${i}"></div>
            <div class="card-actions">
              <button class="card-btn" onclick="showAnswer(${i})">Show</button>
              <button class="card-btn" onclick="repeatQ(${i})">Repeat</button>
              ${i < data.cards.length-1 ? `<button class="card-btn" onclick="nextQ(${i})">Next</button>` : ""}
            </div>
          </div>
          `).join("")}
          <div class="footer" id="score-area">
            <span style="margin-right:12px;">Score: <span id="score">0</span> / ${data.cards.length}</span>
            <button class="footer-btn" onclick="window.location.href='index.html'"><span class="arrow">←</span> RETURN</button>
          </div>
        </div>
        <script>
          const correctAnswers = [${data.cards.map((card)=>`"${String.fromCharCode(65+(card.answer || 0))}"`).join(",")}];
          let scores = Array(${data.cards.length}).fill(0), answered = Array(${data.cards.length}).fill(false);
          document.querySelectorAll('.card').forEach((card,idx) => {
            card.querySelectorAll('.choice').forEach(choice => {
              choice.onclick = () => {
                if (answered[idx]) return;
                card.querySelectorAll('.choice').forEach(c => c.classList.remove('selected'));
                choice.classList.add('selected');
                let val = choice.getAttribute('data-answer');
                let ref = document.getElementById('ref-'+idx);
                let fb = document.getElementById('feedback-'+idx);
                if (val === correctAnswers[idx]) {
                  fb.textContent = "";
                  if (ref) ref.classList.add('highlighted');
                  scores[idx]=1;
                } else {
                  fb.textContent = "There is no reference in the text.";
                  if (ref) ref.classList.remove('highlighted');
                  scores[idx]=0;
                }
                answered[idx]=true;
                document.getElementById('score').textContent=scores.reduce((a,b)=>a+b,0);
              };
            });
          });
          window.showAnswer = function(idx) {
            let card = document.querySelector('.card[data-idx="'+idx+'"]');
            let correct = correctAnswers[idx];
            card.querySelectorAll('.choice').forEach(c => {
              if (c.getAttribute('data-answer')===correct) c.classList.add('selected');
            });
            let ref = document.getElementById('ref-'+idx);
            if (ref) ref.classList.add('highlighted');
            document.getElementById('feedback-'+idx).textContent = '';
            scores[idx]=1; answered[idx]=true;
            document.getElementById('score').textContent=scores.reduce((a,b)=>a+b,0);
          };
          window.repeatQ = function(idx) {
            answered[idx]=false; scores[idx]=0;
            let card = document.querySelector('.card[data-idx="'+idx+'"]');
            let ref = document.getElementById('ref-'+idx);
            if (ref) ref.classList.remove('highlighted');
            document.getElementById('feedback-'+idx).textContent = '';
            card.querySelectorAll('.choice').forEach(c => c.classList.remove('selected'));
            document.getElementById('score').textContent=scores.reduce((a,b)=>a+b,0);
          };
          window.nextQ = function(idx) {
            let nextCard = document.querySelector('.card[data-idx="'+(idx+1)+'"]');
            if(nextCard) nextCard.scrollIntoView({behavior:'smooth',block:'start'});
          };
        <\/script>
      `;
      document.getElementById('app').innerHTML = html;
    }
  </script>
</body>
</html>
