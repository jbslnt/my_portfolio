const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('theme');
const systemPrefersDark = matchMedia('(prefers-color-scheme: dark)').matches;

function setTheme(theme) {
  const isDark = theme === 'dark';
  document.documentElement.dataset.theme = theme;
  themeToggle.setAttribute('aria-pressed', String(isDark));
  themeToggle.textContent = isDark ? 'Switch to light mode' : 'Switch to dark mode';
}

setTheme(savedTheme === 'dark' || savedTheme === 'light'
  ? savedTheme
  : systemPrefersDark ? 'dark' : 'light');

themeToggle.addEventListener('click', () => {
  const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  setTheme(nextTheme);
  localStorage.setItem('theme', nextTheme);
});

document.getElementById('yr').textContent = new Date().getFullYear();

// Pixel fish
const map = [
 "....xxxx..x.",
 "..xxxxxxxxxx",
 "xxxxxoxxxxxx",
 "..xxxxxxxxxx",
 "....xxxx..x."];
function fish(color){
  let r='';
  map.forEach((row,y)=>[...row].forEach((c,x)=>{
    if(c!=='.') r+=`<rect x="${x}" y="${y}" width="1" height="1" fill="${c==='o'?'#fff':color}"/>`;
  }));
  return `<svg viewBox="0 0 12 5" shape-rendering="crispEdges" style="transform:scaleX(-1);display:block">${r}</svg>`;
}

// Fish and bubbles for both the landing screen and the hero
function fillSea(sea){
  [['#e5457f',12,14,'8%'],['#9d8cf0',9,22,'38%'],['#e5457f',7,18,'62%'],['#9d8cf0',11,26,'20%']].forEach(([col,dur,size,top],i)=>{
    const d=document.createElement('div');
    d.className='fish';
    d.style.cssText=`top:${top};width:${size*4}px;animation-duration:${dur*3}s;animation-delay:-${i*7}s`;
    d.innerHTML=fish(col);
    sea.appendChild(d);
  });
  for(let i=0;i<9;i++){
    const b=document.createElement('span');
    const s=8+Math.random()*16;
    b.className='bubble';
    b.style.cssText=`width:${s}px;height:${s}px;left:${Math.random()*96}%;bottom:${Math.random()*20}%;animation-duration:${9+Math.random()*10}s;animation-delay:-${Math.random()*12}s`;
    sea.appendChild(b);
  }
}
['sea', 'sea2'].forEach(id => {
  const sea = document.getElementById(id);
  if (sea) fillSea(sea);
});

// Landing screen
const landing = document.getElementById('landing');
const introSeenKey = 'portfolioIntroSeen';
const introWasSeen = sessionStorage.getItem(introSeenKey) === 'true';

function enterSite(){
  sessionStorage.setItem(introSeenKey, 'true');
  landing.classList.add('leaving');
  document.documentElement.classList.remove('locked');
  window.scrollTo(0,0);
  setTimeout(() => landing.remove(), 650);
}
document.getElementById('enter')?.addEventListener('click', enterSite);
document.getElementById('skipIntro')?.addEventListener('click', enterSite);
if ((location.hash || introWasSeen) && landing) {
  sessionStorage.setItem(introSeenKey, 'true');
  landing.remove();
}
else if (landing) { document.documentElement.classList.add('locked'); }

// Loading bar
if (landing?.isConnected) {
  const fillEl = document.getElementById('loaderFill'),
        barEl = document.getElementById('loader'),
        txtEl = document.getElementById('loaderText'),
        enterBtn = document.getElementById('enter');
  let pct = 0;
  function setPct(p){
    fillEl.style.width = p + '%';
    barEl.setAttribute('aria-valuenow', p);
    txtEl.textContent = p < 100 ? 'Loading... ' + p + '%' : 'Ready!';
  }
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    setPct(100); enterBtn.disabled = false;
  } else {
    const timer = setInterval(() => {
      pct = Math.min(100, pct + Math.ceil(Math.random() * 6));
      setPct(pct);
      if (pct >= 100) { clearInterval(timer); enterBtn.disabled = false; enterBtn.focus(); }
    }, 90);
  }
}

// Certificate viewer
const CERT_SRC = "images/certificate1.png";
const dlg = document.getElementById('certDialog'), body = document.getElementById('certBody');
const certBtn = document.getElementById('certBtn'), certClose = document.getElementById('certClose');
if (dlg && body && certBtn && certClose) {
  certBtn.addEventListener('click', () => {
    body.innerHTML = CERT_SRC
      ? '<img alt="Responsive Web Design certificate from freeCodeCamp" src="' + CERT_SRC + '">'
      : '<p class="empty">Certificate image coming soon.</p>';
    dlg.showModal();
  });
  certClose.addEventListener('click', () => dlg.close());
  dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
}


// Highlight the nav link for the section in view
const navLinks = [...document.querySelectorAll('.nav a[href^="#"]')];
const spy = new IntersectionObserver(entries => entries.forEach(e => {
  if (e.isIntersecting) navLinks.forEach(l => l.classList.toggle('active', l.hash === '#' + e.target.id));
}), { rootMargin: '-45% 0px -50% 0px' });
navLinks.forEach(l => { const sec = document.querySelector(l.hash); if (sec) spy.observe(sec); });
