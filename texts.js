function getQueryParam(name) {
  let match = location.search.match(new RegExp("[?&]"+name+"=([^&]*)"));
  return match && decodeURIComponent(match[1]);
}

let manifestUrl = "fetchfiles-reading-texts.json"; // path to your manifest file
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
      <div class="title">${data.title||''}</div>
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

