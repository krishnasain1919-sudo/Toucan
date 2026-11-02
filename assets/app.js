(()=>{
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine=matchMedia('(pointer:fine)').matches;
const fmt=n=>n.toLocaleString('en-IN');
const navMenu=$('.nav-mobile-btn'),primaryNav=$('#primary-nav');
const closeNav=()=>{primaryNav.classList.remove('mobile-open');navMenu.setAttribute('aria-expanded','false');navMenu.setAttribute('aria-label','Open navigation menu')};
navMenu.addEventListener('click',()=>{const open=navMenu.getAttribute('aria-expanded')!=='true';primaryNav.classList.toggle('mobile-open',open);navMenu.setAttribute('aria-expanded',String(open));navMenu.setAttribute('aria-label',open?'Close navigation menu':'Open navigation menu')});
primaryNav.addEventListener('click',e=>{if(e.target.closest('a'))closeNav()});
primaryNav.addEventListener('click',e=>{
 const action=e.target.closest('[data-nav-action]');
 if(!action)return;
 closeNav();
 if(action.dataset.navAction==='search')$('#kbtn').click();
 if(action.dataset.navAction==='login')$('#loginbtn').click();
});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeNav()});
addEventListener('resize',()=>{if(innerWidth>960)closeNav()});
// Kinetic headline
$$('[data-split]').forEach(el=>{const t=el.textContent.trim().split(' ');el.setAttribute('aria-label',t.join(' '));el.innerHTML=t.map((w,i)=>`<span class="w" aria-hidden="true"><span style="--i:${i}">${w}</span></span>`).join(' ');});
// Reveal + count-up + timeline on view
const countUp=el=>{const to=+el.dataset.count,d=+(el.dataset.dec||0);if(reduced){el.textContent=d?to.toFixed(d):fmt(to);return}const t0=performance.now();(function f(t){const p=Math.min((t-t0)/1400,1),v=to*(1-Math.pow(1-p,3));el.textContent=d?v.toFixed(d):fmt(Math.round(v));if(p<1)requestAnimationFrame(f)})(t0)};
const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;e.target.classList.add('in');io.unobserve(e.target);
 if(e.target.id==='dash')setTimeout(()=>{e.target.classList.remove('loading');$$('[data-count]',e.target).forEach(countUp)},reduced?0:1100);}),{threshold:.15});
$$('.reveal').forEach(el=>io.observe(el));
// Scroll: progress bar, parallax, timeline scrub
const bar=$('#progress'),tl=$('#timeline'),lis=$$('li',tl),layers=$$('.layers i');
let tick=false;const onScroll=()=>{tick=false;const h=document.documentElement,y=scrollY;
 bar.style.transform=`scaleX(${y/Math.max(1,h.scrollHeight-innerHeight)})`;
 const r=tl.getBoundingClientRect(),p=Math.min(1,Math.max(0,(innerHeight*.8-r.top)/(innerHeight*.5)));tl.style.setProperty('--p',p);lis.forEach((li,i)=>li.classList.toggle('on',p>=i/(lis.length-1)-.01&&p>0));
 if(!reduced)layers.forEach(l=>l.style.transform=`translateY(${y*l.dataset.speed}px)`)};
addEventListener('scroll',()=>{if(!tick){tick=true;requestAnimationFrame(onScroll)}},{passive:true});onScroll();
// Magnetic buttons, ripple, 3D tilt
if(fine&&!reduced){
 $$('.magnetic').forEach(b=>{b.addEventListener('pointermove',e=>{const r=b.getBoundingClientRect();b.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.2}px,${(e.clientY-r.top-r.height/2)*.3}px)`});b.addEventListener('pointerleave',()=>b.style.transform='')});
 $$('.tilt').forEach(c=>{c.addEventListener('pointermove',e=>{const r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;c.style.setProperty('--mx',e.clientX-r.left+'px');c.style.setProperty('--my',e.clientY-r.top+'px');c.style.transform=`perspective(700px) rotateY(${x*10}deg) rotateX(${-y*10}deg) translateY(-4px)`});c.addEventListener('pointerleave',()=>c.style.transform='')});
 const st=$('.stage'),stack=$('.atm-cards-stack'),cd=$('#card3d');
 if(cd){const face=$('.face',cd);st.addEventListener('pointermove',e=>{const r=st.getBoundingClientRect(),c=cd.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5,lx=Math.max(0,Math.min(100,(e.clientX-c.left)/c.width*100)),ly=Math.max(0,Math.min(100,(e.clientY-c.top)/c.height*100));cd.classList.add('is-hover');face.style.setProperty('--light-x',lx+'%');face.style.setProperty('--light-y',ly+'%');cd.style.transform=`rotateY(${x*35}deg) rotateX(${-y*28}deg) scale3d(1.025,1.025,1.025)`});st.addEventListener('pointerleave',()=>{cd.style.transform='';cd.classList.remove('is-hover');face.style.setProperty('--light-x','50%');face.style.setProperty('--light-y','50%')});}
 else if(st&&stack){
  st.addEventListener('pointermove',e=>{const r=st.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;stack.style.transform=`perspective(2000px) rotateY(${x*8}deg) rotateX(${-y*6}deg) scale(var(--stack-scale,1))`});
  st.addEventListener('pointerleave',()=>{stack.style.transform=''});
 }
}
document.addEventListener('click',e=>{const b=e.target.closest('.btn');if(!b||reduced)return;const r=b.getBoundingClientRect(),s=document.createElement('span');s.className='rip';const d=Math.max(r.width,r.height);s.style.cssText=`width:${d}px;height:${d}px;left:${e.clientX-r.left-d/2}px;top:${e.clientY-r.top-d/2}px`;b.appendChild(s);setTimeout(()=>s.remove(),650)});
// Toast
const toast=$('#toast');let tt;const say=m=>{toast.textContent=m;toast.classList.add('show');clearTimeout(tt);tt=setTimeout(()=>toast.classList.remove('show'),2600)};
$$('[data-go]').forEach(b=>b.addEventListener('click',()=>$(b.dataset.go).scrollIntoView({behavior:reduced?'auto':'smooth'})));
$$('[data-toast]').forEach(b=>b.addEventListener('click',()=>say(b.dataset.toast)));
// Particle network (paused offscreen/hidden; static when reduced motion)
const cv=$('#net'),cx=cv.getContext('2d');let W,H,pts=[],run=false,vis=true;const dpr=Math.min(devicePixelRatio||1,2),mouse={x:-999,y:-999};
const size=()=>{const r=cv.getBoundingClientRect();W=r.width;H=r.height;cv.width=W*dpr;cv.height=H*dpr;cx.setTransform(dpr,0,0,dpr,0,0);const n=Math.round(Math.min(70,W*H/16000));pts=Array.from({length:n},()=>({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.35,vy:(Math.random()-.5)*.35}))};
const draw=()=>{cx.clearRect(0,0,W,H);for(const p of pts){if(!reduced){p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>W)p.vx*=-1;if(p.y<0||p.y>H)p.vy*=-1;const dx=p.x-mouse.x,dy=p.y-mouse.y,d=Math.hypot(dx,dy);if(d>0&&d<90){p.x+=dx/d*1.5;p.y+=dy/d*1.5}}}
 for(let i=0;i<pts.length;i++){const a=pts[i];cx.fillStyle='rgba(40,85,197,.5)';cx.beginPath();cx.arc(a.x,a.y,2,0,6.3);cx.fill();for(let j=i+1;j<pts.length;j++){const b=pts[j],d=Math.hypot(a.x-b.x,a.y-b.y);if(d<120){cx.strokeStyle=`rgba(40,85,197,${.18*(1-d/120)})`;cx.beginPath();cx.moveTo(a.x,a.y);cx.lineTo(b.x,b.y);cx.stroke()}}}
 };
let raf=0;const loop=()=>{raf=0;draw();go()};const go=()=>{if(!raf&&vis&&!reduced)raf=requestAnimationFrame(loop)};size();draw();
new IntersectionObserver(e=>{vis=e[0].isIntersecting;go()}).observe(cv);document.addEventListener('visibilitychange',()=>{vis=!document.hidden;go()});
addEventListener('resize',()=>{size();draw()});cv.parentElement.addEventListener('pointermove',e=>{const r=cv.getBoundingClientRect();mouse.x=e.clientX-r.left;mouse.y=e.clientY-r.top});cv.parentElement.addEventListener('pointerleave',()=>{mouse.x=mouse.y=-999});go();
// Dashboard chart, tabs, live rows
const data={a:[30,42,38,55,50,68,74,70,88,95],b:[20,28,40,35,52,60,58,76,82,100]};
const plot=k=>{const v=data[k],s=400/(v.length-1),pt=v.map((y,i)=>[i*s,115-y*1.05]);const l=pt.map((p,i)=>(i?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' ');$('#line').setAttribute('d',l);$('#line-glow').setAttribute('d',l);$('#area').setAttribute('d',l+' L400 120 L0 120Z')};plot('a');
const tabs=$$('.tabs button'),ind=$('.ind');const place=b=>{ind.style.width=b.offsetWidth+'px';ind.style.transform=`translateX(${b.offsetLeft-4}px)`};place(tabs[0]);addEventListener('load',()=>place($('.tabs [aria-selected=true]')));
tabs.forEach(b=>b.addEventListener('click',()=>{tabs.forEach(t=>t.setAttribute('aria-selected',t===b));place(b);const paths=$$('#line,#line-glow');paths.forEach(p=>p.style.animation='none');plot(b.dataset.p);void $('#line').getBoundingClientRect();paths.forEach(p=>p.style.animation=reduced?'none':'draw 1.2s var(--e) forwards')}));
const rows=$('#rows'),names=['Aarav S.','Meera K.','Rohan P.','Isha D.','Kabir N.'],mth=['UPI','Card','Net banking','Wallet'];
const addRow=()=>{const ok=Math.random()>.15,li=document.createElement('li');li.innerHTML=`<span>${names[Math.random()*5|0]} · ${mth[Math.random()*4|0]}</span><span>₹${fmt(Math.round(200+Math.random()*4800))}</span><span class="badge ${ok?'ok':'bad'}">${ok?'✓ Paid':'✕ Failed'}</span>`;rows.prepend(li);while(rows.children.length>4)rows.lastChild.remove()};
for(let i=0;i<3;i++)addRow();if(!reduced)setInterval(()=>{if(!document.hidden)addRow()},3500);
// Checkout demo: idle → processing → success | failed → retry
const form=$('#payform'),st=$('#status'),mk=(c,d)=>`<svg class="mark" viewBox="0 0 72 72" aria-hidden="true"><circle class="${c}" cx="36" cy="36" r="32" pathLength="1"/><path class="${c}" d="${d}" pathLength="1"/></svg>`;
const processing=()=>{st.dataset.state='processing';st.innerHTML='<div><div class="spin" aria-hidden="true"></div><h3>Processing payment…</h3><p>Please don’t close this page.</p></div>'};
let busy=false;const pay=ok=>{if(busy)return;if(mErr())return;busy=true;processing();$('#pay').disabled=true;setTimeout(()=>{busy=false;$('#pay').disabled=false;
 if(ok){st.dataset.state='success';st.innerHTML=`<div>${mk('ok-m','M22 37l10 10 18-22')}<h3>Payment successful</h3><p>₹2,499 paid · Receipt sent to your email.</p></div>`}
 else{st.dataset.state='error';st.innerHTML=`<div>${mk('err-m','M24 24l24 24M48 24L24 48')}<h3>Payment failed</h3><p>Your bank declined the payment. No money was taken.</p><button class="btn btn-primary" id="retry" type="button">Try again</button></div>`;st.classList.remove('shake');void st.offsetWidth;if(!reduced)st.classList.add('shake');$('#retry').addEventListener('click',()=>pay(true))}},reduced?300:1700)};
form.addEventListener('submit',e=>{e.preventDefault();pay(true)});$('#fail').addEventListener('click',()=>pay(false));
$('#cn').addEventListener('input',e=>{e.target.value=e.target.value.replace(/\D/g,'').slice(0,16).replace(/(.{4})/g,'$1 ').trim()});

if(reduced)$$('.flow svg,#chart').forEach(s=>s.pauseAnimations());
// Fee calculator
const tween=(el,to)=>{cancelAnimationFrame(el._r);const f=el._c||0,t0=performance.now(),show=v=>el.textContent='₹'+v.toLocaleString('en-IN',{minimumFractionDigits:2,maximumFractionDigits:2});if(reduced){el._c=to;show(to);return}(function s(t){const p=Math.min((t-t0)/350,1);el._c=f+(to-f)*p;show(el._c);if(p<1)el._r=requestAnimationFrame(s)})(t0)};
let rate=.4;const amt=$('#amt'),calc=()=>{const a=+amt.value,fee=a*rate/100,gst=fee*.18;$('#amtv').textContent='₹'+fmt(a);tween($('#rf'),fee);tween($('#rg'),gst);tween($('#rn'),a-fee-gst)};
amt.addEventListener('input',calc);$$('#seg button').forEach(b=>b.addEventListener('click',()=>{$$('#seg button').forEach(x=>x.setAttribute('aria-checked',x===b));rate=+b.dataset.r;calc()}));calc();
// Code tabs with typewriter + copy
const snip={curl:`curl https://api.toucan.example/v1/orders \\\n  -u test_key: \\\n  -d amount=249900 \\\n  -d currency=INR \\\n  -d receipt=order_1042`,node:`const order = await toucan.orders.create({\n  amount: 249900, // in paise\n  currency: 'INR',\n  receipt: 'order_1042',\n});\nconsole.log(order.status); // "created"`};
let lang='curl',tw;const code=$('#code'),showCode=()=>{clearInterval(tw);const s=snip[lang];if(reduced){code.textContent=s;return}let i=0;tw=setInterval(()=>{i+=3;code.textContent=s.slice(0,i);if(i>=s.length){code.textContent=s;clearInterval(tw)}},16)};
$$('.tabs2 button').forEach(b=>b.addEventListener('click',()=>{lang=b.dataset.l;$$('.tabs2 button').forEach(x=>x.setAttribute('aria-selected',x===b));showCode()}));showCode();
$('#copy').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(snip[lang]);say('Copied to clipboard')}catch(_){say('Copy is blocked here. Select the code and press Ctrl+C.')}});
// Command palette (Ctrl/Cmd+K)
const pal=$('#pal'),pq=$('#pq'),pl=$('#pl'),items=[
  ['Products & Solutions Overview','#products'],
  ['Industry Solutions (SaaS, E-com, Marketplaces)','#solutions'],
  ['Payment timeline story','#story'],
  ['Dashboard preview','#dashboard'],
  ['Transparent fee calculator & plans','#pricing'],
  ['Developers API quickstart','#developers'],
  ['Payment links & QR collector','#links'],
  ['Checkout experience demo','#checkout'],
  ['Security & RBI compliance directives','#security'],
  ['Frequently asked questions (FAQ)','#faq'],
  ['About Toucan & Company Suite','#about'],
  ['Ask Flow AI Assistant', '#about'],
  ['Merchant Console: Overview','#platform-overview'],
  ['Merchant Console: Transactions & Disputes','#platform-transactions'],
  ['Merchant Console: Customers & Mandates','#platform-customers'],
  ['Merchant Console: Checkout Simulator (3DS)','#platform-checkout'],
  ['Merchant Console: Payment Links Manager','#platform-links'],
  ['Merchant Console: No-Code Page Builder','#platform-page-builder'],
  ['Merchant Console: Subscriptions & MRR','#platform-subscriptions'],
  ['Merchant Console: GST Invoicing Portal','#platform-invoices'],
  ['Merchant Console: Settlements & Ledger','#platform-settlements'],
  ['Merchant Console: Direct Payouts (IMPS)','#platform-payouts'],
  ['Merchant Console: Marketplace Splits','#platform-marketplace'],
  ['Merchant Console: Developer API Console','#platform-developers'],
  ['Merchant Console: Webhooks & Replay','#platform-webhooks'],
  ['Merchant Console: Sandbox Simulator','#platform-sandbox'],
  ['Merchant Console: Risk & Fraud Review','#platform-risk'],
  ['Merchant Console: Settings & RBAC','#platform-settings'],
  ['Merchant Console: Super-Admin Console','#platform-super-admin'],
  ['Merchant Console: Onboarding & KYC','#platform-onboarding'],
  ['Frontend Scope & Estimation Guide (PDF Model)','#platform-estimator']
];let last;
const render=()=>{const q=pq.value.toLowerCase();pl.innerHTML=items.filter(i=>i[0].toLowerCase().includes(q)).map(i=>`<li><button type="button" data-t="${i[1]}">${i[0]}</button></li>`).join('')||'<li class="none">No matches. Try “fee”, “transactions”, or “estimator”.</li>'};
const open=()=>{if(!au.hidden)return;last=document.activeElement;pal.hidden=false;pq.value='';render();pq.focus()},close=()=>{pal.hidden=true;if(last)last.focus()};
$('#kbtn').addEventListener('click',open);pq.addEventListener('input',render);
pal.addEventListener('click',e=>{
  const b=e.target.closest('button[data-t]');
  if(b){
    const t=b.dataset.t;
    close();
    if(t.startsWith('#platform')){
      const tab=t.replace('#platform-','').replace('#platform','')||'overview';
      const app = window.toucanApp || window.payflowApp;
      if(app){
        app.setView('platform');
        app.setTab(tab);
      }
    } else {
      const targetEl=$(t);
      if(targetEl) targetEl.scrollIntoView({behavior:reduced?'auto':'smooth'});
    }
  }else if(e.target===pal)close()
});
addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();pal.hidden?open():close();return}
 if(pal.hidden)return;if(e.key==='Escape'){close();return}
 const bs=$$('button[data-t]',pal),i=bs.indexOf(document.activeElement);
 if(e.key==='ArrowDown'){e.preventDefault();(bs[i+1]||bs[0])?.focus()}else if(e.key==='ArrowUp'){e.preventDefault();(i>0?bs[i-1]:pq).focus()}
 else if(e.key==='Enter'&&document.activeElement===pq&&bs[0])bs[0].click();
 else if(e.key==='Tab'){const f=[pq,...bs],k=f.indexOf(document.activeElement);e.preventDefault();f[e.shiftKey?(k<=0?f.length-1:k-1):(k+1)%f.length].focus()}});
addEventListener('resize',()=>place($('.tabs [aria-selected=true]')));

const esc=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const jump=t=>$(t).scrollIntoView({behavior:reduced?'auto':'smooth'});
// Decorative QR-style pattern (not a real, scannable code)
const qr=(cv,seed)=>{const n=25,s=cv.width/n,c=cv.getContext('2d');let h=0;for(const ch of seed)h=(h*31+ch.charCodeAt(0))>>>0;const rnd=()=>(h=(h*1664525+1013904223)>>>0)/4294967296;c.fillStyle='#fff';c.fillRect(0,0,cv.width,cv.height);c.fillStyle='#172033';for(let y=0;y<n;y++)for(let x=0;x<n;x++){const f=(x<7||x>n-8)&&(y<7||y>n-8)&&!(x>n-8&&y>n-8);let on;if(f){const lx=x<7?x:x-(n-7),ly=y<7?y:y-(n-7);on=lx===0||lx===6||ly===0||ly===6||(lx>1&&lx<5&&ly>1&&ly<5)}else on=rnd()>.52;if(on)c.fillRect(x*s,y*s,s,s)}};
qr($('#upiqr'),'toucan-upi-demo');
// Product suite explorer (Enhanced with 3D Visual Stage & Hover Physics)
const pIcons = [
  `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="3"/><line x1="2" y1="10" x2="22" y2="10"/><circle cx="7" cy="15" r="1"/></svg>`,
  `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`,
  `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>`,
  `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="4" height="4"/><rect x="18" y="18" width="3" height="3"/></svg>`,
  `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 2v6h-6"/><path d="M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/><circle cx="12" cy="12" r="3"/></svg>`,
  `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`,
  `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><circle cx="12" cy="16" r="2"/></svg>`,
  `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="6" height="12" rx="1"/><rect x="16" y="2" width="6" height="8" rx="1"/><rect x="16" y="14" width="6" height="8" rx="1"/><path d="M8 12h4m-2-2l2 2-2 2"/></svg>`
];

const P=[
  ['Payment Gateway','Accept cards, UPI, net banking and wallets on your website and app with one integration.',['Multiple payment modes at checkout','Smart retries when a payment fails','Saved cards using tokenisation','Instant and partial refunds'],'#checkout','Try checkout','TOUCAN ONLINE CHECKOUT'],
  ['Payment Links','Send a link by email, SMS or chat and get paid without a website.',['Reminders for unpaid links','Partial payments','UPI-only links','Bulk creation from a spreadsheet'],'#links','Create a link','NO-CODE PAYMENT LINKS'],
  ['Payment Pages','Launch a branded page for products, events or donations with no code.',['Ready-made templates','Your logo, colours and custom fields','Page-level conversion stats','Publish, pause or duplicate'],'#links','See link tools','HOSTED CUSTOM STOREFRONT'],
  ['QR Codes','Show one QR code at the counter or on an invoice and accept any UPI app.',['Fixed and per-order codes','Instant payment confirmation','Reconciled with your settlements','Printable stands and stickers'],'#links','Generate a code','OMNICHANNEL DYNAMIC UPI'],
  ['Subscriptions','Bill customers on a schedule with trials, proration and automatic retries.',['Plans, add-ons and coupons','Pause, resume and upgrade','Recurring UPI and card mandates','Retries for failed renewals'],'#dashboard','See analytics','RECURRING BILLING ENGINE'],
  ['Invoices','Send GST-ready invoices with a pay button and automatic reminders.',['Line items, taxes and due dates','PDF download','Payment status in real time','Customer billing portal'],'#pricing','Check fees','GST-COMPLIANT INVOICING'],
  ['POS','Take card and UPI payments in your store, tracked in the same dashboard.',['Card, UPI and EMI at the counter','Daily sales and settlement view','Staff roles and permissions','Receipts by SMS or email'],'#dashboard','View dashboard','SMART COUNTERTOP TERMINAL'],
  ['Payouts and payroll','Pay vendors, refund customers and run payroll from one account.',['Vendor and bulk payouts','Payout links for people without bank details','Maker-checker approvals','Tax and compliance payments'],'#developers','See the API','INSTANT TREASURY DISBURSAL']
];

const getVisualHtml = i => {
  switch (i) {
    case 0:
      return `
        <div class="vis-scene vis-gateway">
          <div class="vis-card3d-wrap">
            <div class="vis-card3d">
              <div class="vis-card-shimmer"></div>
              <div class="vis-card-top">
                <div class="vis-chip"><div class="vis-chip-lines"></div></div>
                <div class="vis-contactless">
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M8.5 16.5a5 5 0 0 1 0-7"/><path d="M12 19a8.5 8.5 0 0 1 0-12"/><path d="M15.5 21.5a12 12 0 0 1 0-17"/></svg>
                </div>
                <div class="vis-card-logo">TOUCAN</div>
              </div>
              <div class="vis-card-num"><span>4532</span><span>8901</span><span>6543</span><span>8421</span></div>
              <div class="vis-card-bottom">
                <div><div class="vis-card-label">CARDHOLDER</div><div class="vis-card-val">ENTERPRISE MERCHANT</div></div>
                <div><div class="vis-card-label">EXPIRES</div><div class="vis-card-val">08/29</div></div>
                <div class="vis-card-network"><span class="net-circle red"></span><span class="net-circle orange"></span></div>
              </div>
            </div>
          </div>
          <div class="vis-satellite sat-1"><span class="sat-dot sat-dot-green"></span><span><strong>UPI Intent</strong> · 0% failure</span></div>
          <div class="vis-satellite sat-2"><svg viewBox="0 0 16 16" width="14" height="14" fill="#2855C5"><path d="M8 0L1.5 3v5c0 4.2 2.8 8.1 6.5 9 3.7-.9 6.5-4.8 6.5-9V3L8 0zm2.5 6.2l-3.3 3.3c-.2.2-.5.2-.7 0L5 8c-.2-.2-.2-.5 0-.7.2-.2.5-.2.7 0l1.1 1.1 2.9-2.9c.2-.2.5-.2.7 0 .2.2.2.5 0 .7z"/></svg><span>Smart Auto-Retry <strong>99.98%</strong></span></div>
          <div class="vis-satellite sat-3"><span class="sat-tag">TOKENISED</span><span>RBI &amp; PCI-DSS L1</span></div>
        </div>`;
    case 1:
      return `
        <div class="vis-scene vis-links">
          <div class="vis-phone-wrap">
            <div class="vis-phone">
              <div class="vis-phone-notch"></div>
              <div class="vis-phone-screen">
                <div class="vis-link-head">
                  <div class="vis-link-avatar">☕</div>
                  <div><div class="vis-link-biz">Kaveri Coffee Roasters</div><div class="vis-link-sub">Order #KV-8921</div></div>
                </div>
                <div class="vis-link-amt">₹2,499.00</div>
                <div class="vis-link-pill">Expires in 24 hours</div>
                <div class="vis-link-methods"><span>GPay</span><span>PhonePe</span><span>Cards</span></div>
                <div class="vis-link-btn">Pay ₹2,499 Now →</div>
              </div>
            </div>
          </div>
          <div class="vis-satellite sat-links-1"><span class="sat-dot sat-dot-green"></span><span>Dispatched via <strong>WhatsApp &amp; SMS</strong></span></div>
          <div class="vis-satellite sat-links-2"><span>⚡</span><span>Generated in <strong>1.2s</strong></span></div>
        </div>`;
    case 2:
      return `
        <div class="vis-scene vis-pages">
          <div class="vis-browser-wrap">
            <div class="vis-browser">
              <div class="vis-browser-bar">
                <div class="vis-dots"><span></span><span></span><span></span></div>
                <div class="vis-url">toucan.store/summit-pass</div>
              </div>
              <div class="vis-browser-body">
                <div class="vis-store-hero">
                  <div class="vis-store-badge">SUMMIT 2026</div>
                  <div class="vis-store-title">Developer All-Access Pass</div>
                  <div class="vis-store-price">₹4,999 <s>₹6,999</s></div>
                </div>
                <div class="vis-store-field">Buyer: Priya Sharma</div>
                <div class="vis-store-cta">Proceed to Instant Checkout</div>
              </div>
            </div>
          </div>
          <div class="vis-satellite sat-pages-1"><span style="color:#10B981;font-weight:800;">▲</span><span><strong>+38% Conversion</strong> Boost</span></div>
          <div class="vis-satellite sat-pages-2"><span class="sat-badge">ZERO-CODE</span><span>Branded Custom Store</span></div>
        </div>`;
    case 3:
      return `
        <div class="vis-scene vis-qr">
          <div class="vis-stand-wrap">
            <div class="vis-stand-card">
              <div class="vis-stand-brand">
                <div class="vis-stand-logo">TOUCAN UPI</div>
                <div class="vis-stand-sound">🔊 SOUNDBOX ACTIVE</div>
              </div>
              <div class="vis-qr-box">
                <canvas id="suite-qr-cv" width="140" height="140"></canvas>
                <div class="vis-qr-laser"></div>
                <div class="vis-qr-corners"></div>
              </div>
              <div class="vis-stand-logos"><span>GPay</span><span>PhonePe</span><span>Paytm</span><span>BHIM</span></div>
            </div>
            <div class="vis-stand-base"></div>
          </div>
          <div class="vis-satellite sat-qr-1"><span class="sat-dot sat-dot-green"></span><span>Instant Audio Alert: <strong>₹850 Received</strong></span></div>
          <div class="vis-satellite sat-qr-2"><span class="sat-badge">ZERO MDR</span><span>Accept Any UPI App</span></div>
        </div>`;
    case 4:
      return `
        <div class="vis-scene vis-subs">
          <div class="vis-subs-orbit">
            <div class="vis-orbit-ring ring-1"></div>
            <div class="vis-orbit-ring ring-2"></div>
            <div class="vis-orbit-node node-1">₹</div>
          </div>
          <div class="vis-subs-card">
            <div class="vis-subs-badge">ACTIVE RECURRING MANDATE</div>
            <div class="vis-subs-plan">Pro Enterprise SaaS</div>
            <div class="vis-subs-cost">₹12,499 <span>/ month</span></div>
            <div class="vis-subs-progress"><div class="vis-prog-bar" style="width:78%"></div></div>
            <div class="vis-subs-meta"><span>Cycle: 28 of 30 days</span><span class="vis-ok-pill">Auto-Renew: ON</span></div>
          </div>
          <div class="vis-satellite sat-subs-1"><span>🛡️</span><span>Smart Dunning: <strong>-42% Churn</strong></span></div>
          <div class="vis-satellite sat-subs-2"><span class="sat-badge">RBI Compliant</span><span>UPI &amp; Card e-Mandates</span></div>
        </div>`;
    case 5:
      return `
        <div class="vis-scene vis-invoice">
          <div class="vis-invoice-doc">
            <div class="vis-inv-header">
              <div><div class="vis-inv-title">TAX INVOICE</div><div class="vis-inv-num">#PF-2026-0941</div></div>
              <div class="vis-inv-gst">GSTIN VERIFIED ✓</div>
            </div>
            <div class="vis-inv-table">
              <div class="vis-inv-row"><span>Cloud Infrastructure API</span><strong>₹45,000</strong></div>
              <div class="vis-inv-row"><span>GST @ 18% (CGST + SGST)</span><strong>₹8,100</strong></div>
              <div class="vis-inv-total"><span>Total Settled</span><strong>₹53,100</strong></div>
            </div>
            <div class="vis-inv-stamp"><span>PAID IN FULL</span><small>VERIFIED · 28 OCT</small></div>
          </div>
          <div class="vis-satellite sat-inv-1"><span>⚡</span><span>Automated <strong>WhatsApp Reminders</strong></span></div>
          <div class="vis-satellite sat-inv-2"><span class="sat-badge">PDF READY</span><span>Instant IRN &amp; QR Code</span></div>
        </div>`;
    case 6:
      return `
        <div class="vis-scene vis-pos">
          <div class="vis-pos-device">
            <div class="vis-pos-screen">
              <div class="vis-pos-status">● CONNECTED · 5G</div>
              <div class="vis-pos-amt">₹1,850.00</div>
              <div class="vis-pos-prompt">Tap, Dip or Swipe Card</div>
              <div class="vis-pos-nfc"><span></span><span></span><span></span></div>
            </div>
            <div class="vis-pos-keypad"><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span><span>9</span></div>
          </div>
          <div class="vis-pos-tapcard">
            <div class="vis-tc-chip"></div>
            <div class="vis-tc-num">•••• 4120</div>
            <div class="vis-tc-brand">RuPay</div>
          </div>
          <div class="vis-satellite sat-pos-1"><span class="sat-dot sat-dot-green"></span><span>T+0 <strong>Same-Day Settlement</strong></span></div>
          <div class="vis-satellite sat-pos-2"><span>🧾</span><span>Digital SMS &amp; Print Slips</span></div>
        </div>`;
    case 7:
    default:
      return `
        <div class="vis-scene vis-payouts">
          <div class="vis-payout-hub">
            <div class="vis-hub-center">
              <div class="vis-hub-core"><span>TOUCAN</span><strong>VAULT</strong></div>
              <div class="vis-hub-pulse"></div>
            </div>
            <div class="vis-hub-nodes">
              <div class="vis-hub-node node-vendor"><div class="vis-hn-title">Vendor Payouts</div><div class="vis-hn-val">₹4,80,000</div><div class="vis-hn-sub">IMPS · Instant</div></div>
              <div class="vis-hub-node node-refund"><div class="vis-hn-title">Customer Refund</div><div class="vis-hn-val">₹2,499</div><div class="vis-hn-sub">T+0 Source Acct</div></div>
              <div class="vis-hub-node node-salary"><div class="vis-hn-title">Payroll Batch</div><div class="vis-hn-val">₹18,50,000</div><div class="vis-hn-sub">142 Employees</div></div>
            </div>
          </div>
          <div class="vis-satellite sat-pay-1"><span>🔒</span><span><strong>Maker-Checker</strong> Approvals</span></div>
          <div class="vis-satellite sat-pay-2"><span class="sat-badge">24×7×365</span><span>Zero-Downtime Bulk Routing</span></div>
        </div>`;
  }
};

const sl=$('#slist'),sp=$('#spanel');
sl.innerHTML=P.map((p,i)=>`
  <button type="button" role="tab" aria-selected="${i===0}" data-i="${i}" class="slist-tab-btn">
    <span class="slist-icon" aria-hidden="true">${pIcons[i] || ''}</span>
    <span class="slist-title">${p[0]}</span>
    <span class="slist-arrow" aria-hidden="true">
      <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="6 3 11 8 6 13"/></svg>
    </span>
  </button>
`).join('');

const showP=i=>{
  const p=P[i];
  $$('#slist button').forEach((b,k)=>b.setAttribute('aria-selected',k===i));
  sp.innerHTML=`
    <div class="spanel-content">
      <div class="spanel-badge"><span class="spanel-badge-dot"></span>${p[5]}</div>
      <h3>${p[0]}</h3>
      <p>${p[1]}</p>
      <ul class="spanel-features">
        ${p[2].map(f=>`
          <li>
            <span class="feat-icon" aria-hidden="true">
              <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 8.5 6.5 12 13 4.5"/>
              </svg>
            </span>
            <span>${f}</span>
          </li>
        `).join('')}
      </ul>
      <div class="spanel-actions">
        <button class="btn btn-primary spanel-cta-btn" type="button" data-go="${p[3]}">
          <span>${p[4]}</span>
          <svg class="cta-arrow" viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="3" y1="8" x2="13" y2="8"/>
            <polyline points="9 4 13 8 9 12"/>
          </svg>
        </button>
        <span class="spanel-guarantee">
          <svg viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="#0E7A4F" stroke-width="2">
            <path d="M8 1.5l5.5 2.5v4.5c0 3.5-2.5 6-5.5 7-3-1-5.5-3.5-5.5-7V4z"/>
            <path d="M5.5 8l2 2 3.5-3.5"/>
          </svg>
          Instant Setup · RBI &amp; PCI-DSS
        </span>
      </div>
    </div>
    <div class="spanel-stage" data-product="${i}">
      <div class="stage-scene" id="suite-stage-scene">
        ${getVisualHtml(i)}
      </div>
    </div>
  `;

  // If QR visual is active, render realistic QR canvas
  if (i === 3) {
    const cv = $('#suite-qr-cv');
    if (cv) qr(cv, 'toucan-suite-qr-demo');
  }

  sp.classList.remove('swap');
  void sp.offsetWidth;
  if(!reduced)sp.classList.add('swap');
};

sl.addEventListener('click',e=>{const b=e.target.closest('button');if(b)showP(+b.dataset.i)});
sl.addEventListener('keydown',e=>{if(e.key!=='ArrowDown'&&e.key!=='ArrowUp')return;e.preventDefault();const bs=$$('button',sl),i=bs.indexOf(document.activeElement),k=(i+(e.key==='ArrowDown'?1:-1)+bs.length)%bs.length;bs[k].focus();showP(k)});
sp.addEventListener('click',e=>{const b=e.target.closest('[data-go]');if(b)jump(b.dataset.go)});
showP(0);

// Interactive 3D Card Hover & Tilt Physics for the Suite Container
const suiteCard = $('.suite');
if (suiteCard && fine && !reduced) {
  suiteCard.addEventListener('pointermove', e => {
    const r = suiteCard.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    const tiltX = (x - 0.5) * 6; // deg
    const tiltY = (y - 0.5) * -5; // deg
    suiteCard.style.setProperty('--suite-mx', `${(x * 100).toFixed(1)}%`);
    suiteCard.style.setProperty('--suite-my', `${(y * 100).toFixed(1)}%`);
    suiteCard.style.transform = `perspective(1400px) rotateX(${tiltY}deg) rotateY(${tiltX}deg) translateY(-4px)`;
    
    const stageScene = $('#suite-stage-scene');
    if (stageScene) {
      stageScene.style.transform = `rotateY(${tiltX * 1.5}deg) rotateX(${tiltY * 1.5}deg)`;
    }
  });

  suiteCard.addEventListener('pointerleave', () => {
    suiteCard.style.transform = '';
    suiteCard.style.setProperty('--suite-mx', '50%');
    suiteCard.style.setProperty('--suite-my', '20%');
    const stageScene = $('#suite-stage-scene');
    if (stageScene) stageScene.style.transform = '';
  });
}
// Payment link generator
$('#lform').addEventListener('submit',e=>{e.preventDefault();const a=parseFloat($('#lamt').value.replace(/,/g,'')),out=$('#lres'),f=$('#lamt');if(!(a>=1&&a<=1000000)){f.setAttribute('aria-invalid','true');out.innerHTML='<p>Enter an amount between ₹1 and ₹10,00,000.</p>';f.focus();return}f.removeAttribute('aria-invalid');
 const id=Math.random().toString(36).slice(2,9),url='https://pay.toucan.example/l/'+id;out.innerHTML=`<div class="lc"><div class="qr-visual"><canvas id="lqr" width="150" height="150" role="img" aria-label="Sample QR code, not scannable"></canvas><span class="qr-scan" aria-hidden="true"></span><span class="qr-corners" aria-hidden="true"></span><span class="qr-tag" aria-hidden="true">DEMO</span></div><div><b>₹${fmt(a)}</b> · ${esc($('#ldesc').value)}<code>${url}</code><small>${$('#lpart').checked?'Partial payments on · ':''}${$('#lupi').checked?'UPI only · ':''}Expires in ${$('#lexp').value} · Sample link and QR, not live</small><button class="btn btn-ghost" id="lcopy" type="button">Copy link</button></div></div>`;qr($('#lqr'),id);
 $('#lcopy').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(url);say('Link copied')}catch(_){say('Copy is blocked here. Select the link manually.')}})});
// Checkout methods
let curM='card';
$$('#methods button').forEach(b=>b.addEventListener('click',()=>{curM=b.dataset.m;$$('#methods button').forEach(x=>x.setAttribute('aria-checked',x===b));$$('[data-pane]').forEach(p=>p.hidden=p.dataset.pane!==curM);st.dataset.state='idle';st.innerHTML='<p class="idle">Choose how you want to pay. No real payment data is used.</p>'}));
$$('#wal button').forEach(b=>b.addEventListener('click',()=>$$('#wal button').forEach(x=>x.setAttribute('aria-checked',x===b))));
const mErr=()=>{$$('#payform [aria-invalid]').forEach(x=>x.removeAttribute('aria-invalid'));let el,msg='';
 if(curM==='card'){el=$('#cn');if(el.value.replace(/\D/g,'').length<16)msg='Enter a 16-digit card number to continue.'}
 else if(curM==='upi'){el=$('#upi');if(!/^[\w.\-]{2,}@[a-z]{2,}$/i.test(el.value.trim()))msg='Enter a valid UPI ID, like name@bank.'}
 else if(curM==='nb'){el=$('#bank');if(!el.value)msg='Choose your bank to continue.'}
 else if(!$('#wal [aria-checked=true]')){el=$('#wal button');msg='Choose a wallet to continue.'}
 if(msg){el.setAttribute('aria-invalid','true');el.classList.remove('shake');void el.offsetWidth;if(!reduced)el.classList.add('shake');st.innerHTML='<p>'+msg+'</p>';el.focus()}return msg};
// Login / sign-up (front-end demo only: nothing is stored or sent)
const au=$('#auth'),af=$('#aform'),aer=$('#aerr'),lb=$('#loginbtn'),h2=$('#dashboard h2'),h2t=h2.textContent;let mode='in',user=null,aLast;
const setMode=m=>{mode=m;const up=m==='up',rs=m==='reset';if(!up)$('#acpw').value='';$('#atitle').textContent=up?'Create your account':rs?'Reset your password':'Welcome back';$('#authintro').textContent=up?'Set up your Toucan account in a few steps.':rs?'Enter your email and we’ll help you reset your password.':'Sign in to continue to your account.';$$('[data-up]',af).forEach(x=>x.hidden=!up);$('#apwl').hidden=rs;$('#asub').textContent=up?'Create account':rs?'Send reset link':'Sign in';$('#aforgot').textContent=rs?'Back to sign in':'Forgot password?';$('#aforgot').hidden=up;$('#atabs').hidden=rs;$$('#atabs button').forEach(b=>b.setAttribute('aria-selected',b.dataset.a===m));$('#apw').autocomplete=up?'new-password':'current-password';aer.textContent='';aer.className='err';$$('input',af).forEach(i=>i.removeAttribute('aria-invalid'))};
const openAuth=m=>{aLast=document.activeElement;setMode(m);au.hidden=false;(m==='up'?$('#abiz'):$('#aem')).focus()},closeAuth=()=>{au.hidden=true;if(aLast)aLast.focus()};
$$('[data-auth]').forEach(b=>b.addEventListener('click',()=>{
 if(b.classList.contains('nav-cta')){
  const env=$('#mode-env-select');
  if(env&&env.value!=='test'){env.value='test';env.dispatchEvent(new Event('change',{bubbles:true}))}
 }
 openAuth(b.dataset.auth)
}));
lb.addEventListener('click',()=>{if(user){user=null;lb.textContent='Log in';h2.textContent=h2t;say('Signed out')}else openAuth('in')});
$('#aclose').addEventListener('click',closeAuth);au.addEventListener('click',e=>{if(e.target===au)closeAuth()});
$('#atabs').addEventListener('click',e=>{const b=e.target.closest('button');if(b)setMode(b.dataset.a)});
$('#aforgot').addEventListener('click',()=>setMode(mode==='reset'?'in':'reset'));
$('#apeek').addEventListener('click',e=>{const p=$('#apw'),s=p.type==='password';p.type=s?'text':'password';e.target.textContent=s?'Hide':'Show';e.target.setAttribute('aria-label',s?'Hide password':'Show password')});
$('#apw').addEventListener('input',e=>{if(mode!=='up')return;const v=e.target.value,s=(v.length>=8)+/\d/.test(v)+/[A-Z]/.test(v)+/[^\w]/.test(v);$('#ameter').textContent='Password strength: '+(s<=1?'Weak':s<=2?'Okay':'Strong')});
af.addEventListener('submit',e=>{e.preventDefault();const em=$('#aem').value.trim(),pw=$('#apw').value,biz=$('#abiz').value.trim(),emailPattern=/^[^\s@.]+(?:\.[^\s@.]+)*@[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)+$/,fail=(m,el)=>{aer.textContent=m;el.setAttribute('aria-invalid','true');el.focus()};$$('input',af).forEach(i=>i.removeAttribute('aria-invalid'));
 if(mode==='up'&&(!biz||biz.length>100))return fail('Enter a business name (up to 100 characters).',$('#abiz'));
 if(em.length>254||!emailPattern.test(em))return fail('Enter a valid email address.',$('#aem'));
 if(mode==='reset'){aer.className='err ok';aer.textContent='If an account exists for this email, a reset link is on its way. (Demo: nothing was sent.)';return}
 if(pw.length<8||(mode==='up'&&!/\d/.test(pw)))return fail(mode==='up'?'Use at least 8 characters including a number.':'Enter your password (8+ characters).',$('#apw'));
 if(mode==='up'&&pw!==$('#acpw').value)return fail('Passwords do not match.',$('#acpw'));
 const sb=$('#asub'),up=mode==='up';sb.disabled=true;sb.textContent=up?'Creating account…':'Signing in…';
 setTimeout(()=>{sb.disabled=false;user={name:up?$('#abiz').value.trim():em.split('@')[0]};$('#apw').value='';$('#acpw').value='';closeAuth();lb.textContent='Log out ('+user.name.slice(0,12)+')';h2.textContent='Welcome back, '+user.name;say(up?'Account created (demo)':'Signed in (demo)');const app=window.toucanApp||window.payflowApp;if(app){app.setView('platform');app.setTab('overview');}else{jump('#dashboard');}},reduced?200:900)});
addEventListener('keydown',e=>{if(au.hidden)return;if(e.key==='Escape'){closeAuth();return}if(e.key==='Tab'){const f=$$('button,input,select',au).filter(x=>!x.closest('[hidden]')&&!x.disabled),k=f.indexOf(document.activeElement);e.preventDefault();f[e.shiftKey?(k<=0?f.length-1:k-1):(k+1)%f.length].focus()}});
const openAuthFromHash=()=>{if(location.hash==='#signup')openAuth('up');else if(location.hash==='#login')openAuth('in')};
openAuthFromHash();addEventListener('hashchange',openAuthFromHash);

// Demo Booking & Legal Modals
const showModalCustom=(title,htmlContent)=>{
  const modal=$('#app-modal-overlay'),box=$('#app-modal-box');
  if(!modal||!box)return;
  box.innerHTML=`<div class="app-modal-header"><h3>${title}</h3><button class="app-modal-close" onclick="(window.toucanApp||window.payflowApp)?.closeModal()">✕</button></div><div class="app-modal-body">${htmlContent}</div><div class="app-modal-footer"><button class="btn btn-primary" onclick="(window.toucanApp||window.payflowApp)?.closeModal()">Close</button></div>`;
  modal.hidden=false;
};

$('#btn-book-demo-cta')?.addEventListener('click',()=>{
  showModalCustom('Schedule a Tailored Product Walkthrough',`
    <p style="font-size:0.9rem; color:var(--muted); margin-top:0;">Connect with our solutions engineering team to review volume pricing, multi-region routing, and custom migration support.</p>
    <div style="display:flex; flex-direction:column; gap:12px;">
      <div><label style="font-size:0.85rem; font-weight:600;">Work Email</label><input type="email" value="executive@enterprise.com" style="width:100%; margin-top:4px;"></div>
      <div><label style="font-size:0.85rem; font-weight:600;">Estimated Monthly Payment Volume</label>
        <select style="width:100%; margin-top:4px;">
          <option>₹10 Lakh – ₹50 Lakh</option>
          <option>₹50 Lakh – ₹2 Crore</option>
          <option selected>₹2 Crore – ₹10 Crore+</option>
        </select>
      </div>
      <div><label style="font-size:0.85rem; font-weight:600;">Preferred Date & Time</label><input type="datetime-local" style="width:100%; margin-top:4px;"></div>
      <button class="btn btn-primary" style="margin-top:8px; padding:12px;" onclick="(window.toucanApp||window.payflowApp)?.notify('Demo booking confirmed! Calendar invite dispatched.'); (window.toucanApp||window.payflowApp)?.closeModal();">Confirm Demo Schedule</button>
    </div>
  `);
});

$('#btn-contact-sales-plan')?.addEventListener('click',()=>{
  $('#btn-book-demo-cta')?.click();
});

$('#foot-terms-link')?.addEventListener('click',e=>{
  e.preventDefault();
  showModalCustom('Terms of Service',`
    <p style="font-size:0.88rem; line-height:1.6; color:var(--text);"><strong>1. Scope of Service:</strong> Toucan provides front-end payment processing interfaces, checkout experiences, API SDKs, and merchant financial reporting in collaboration with licensed RBI Payment Aggregators.</p>
    <p style="font-size:0.88rem; line-height:1.6; color:var(--muted);"><strong>2. Data Protection:</strong> All cardholder data is tokenized pursuant to PCI-DSS Level 1 specifications. Raw CVV/PAN credentials are never stored on client machines.</p>
    <p style="font-size:0.88rem; line-height:1.6; color:var(--muted);"><strong>3. Settlements & Fees:</strong> Standard settlement cycles adhere to T+1/T+2 clearing schedules. Payouts are routed directly to verified nodal accounts.</p>
  `);
});

$('#foot-privacy-link')?.addEventListener('click',e=>{
  e.preventDefault();
  showModalCustom('Privacy & Cookie Policy',`
    <p style="font-size:0.88rem; line-height:1.6; color:var(--text);"><strong>Privacy Commitment:</strong> We respect your data confidentiality. Toucan complies with global privacy benchmarks and Indian Digital Personal Data Protection (DPDP) standards.</p>
    <p style="font-size:0.88rem; line-height:1.6; color:var(--muted);">We only process information essential to authenticate sessions, detect fraudulent attempts, and execute requested transactions.</p>
  `);
});
})();
