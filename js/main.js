(function(){'use strict';
const nav=document.getElementById('nav');
const navLinks=document.querySelectorAll('.nav-links a');
const sections=document.querySelectorAll('section[id]');
function onScroll(){
  nav.classList.toggle('scrolled',window.scrollY>40);
  let active='';
  sections.forEach(s=>{if(window.scrollY>=s.offsetTop-120)active=s.id;});
  navLinks.forEach(a=>{a.classList.toggle('active',a.getAttribute('href')==='#'+active);});
  const overlay=document.querySelector('.hero-bg-overlay');
  if(overlay&&window.scrollY<window.innerHeight){overlay.style.transform=`translateY(${window.scrollY*0.25}px)`;}
}
window.addEventListener('scroll',onScroll,{passive:true});
onScroll();
const revealEls=document.querySelectorAll('.reveal');
if('IntersectionObserver' in window){
  const obs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');obs.unobserve(e.target);}});},{threshold:0.1,rootMargin:'0px 0px -40px 0px'});
  revealEls.forEach(el=>obs.observe(el));
}else{revealEls.forEach(el=>el.classList.add('in'));}
window.addEventListener('load',()=>{
  document.querySelectorAll('.hero-text .reveal').forEach((el,i)=>{
    el.style.opacity='0';el.style.transform='translateY(20px)';
    el.style.transition=`opacity 0.8s cubic-bezier(0.16,1,0.3,1) ${i*0.12+0.15}s,transform 0.8s cubic-bezier(0.16,1,0.3,1) ${i*0.12+0.15}s`;
    requestAnimationFrame(()=>requestAnimationFrame(()=>{el.style.opacity='1';el.style.transform='translateY(0)';}));
  });
  const photoCol=document.querySelector('.hero-photo-col');
  if(photoCol){photoCol.style.opacity='0';photoCol.style.transition='opacity 1.2s cubic-bezier(0.16,1,0.3,1) 0.4s';requestAnimationFrame(()=>requestAnimationFrame(()=>{photoCol.style.opacity='1';}));}
});
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    const id=a.getAttribute('href').slice(1);
    const target=document.getElementById(id);
    if(target){e.preventDefault();window.scrollTo({top:target.offsetTop-72,behavior:'smooth'});}
  });
});
const tabBtns=document.querySelectorAll('.track-tab');
const panels=document.querySelectorAll('.track-panel');
tabBtns.forEach(btn=>{
  btn.addEventListener('click',()=>{
    const target=btn.dataset.panel;
    tabBtns.forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    panels.forEach(p=>{p.classList.toggle('active',p.id==='panel-'+target);});
  });
});
if('IntersectionObserver' in window){
  const statEls=document.querySelectorAll('.stat-num[data-target]');
  const counterObs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(!e.isIntersecting)return;
      const el=e.target,end=parseFloat(el.dataset.target),prefix=el.dataset.prefix||'',suffix=el.dataset.suffix||'',start=performance.now(),dur=1600;
      function step(now){const p=Math.min((now-start)/dur,1),ease=1-Math.pow(1-p,3);el.textContent=prefix+Math.round(end*ease)+suffix;if(p<1)requestAnimationFrame(step);}
      requestAnimationFrame(step);counterObs.unobserve(el);
    });
  },{threshold:0.5});
  statEls.forEach(el=>counterObs.observe(el));
}
const toggle=document.querySelector('.nav-toggle'),mobileNav=document.querySelector('.mobile-nav'),closeBtn=document.querySelector('.mobile-nav-close');
if(toggle&&mobileNav){
  toggle.addEventListener('click',()=>{mobileNav.classList.add('open');document.body.style.overflow='hidden';});
  const closeFn=()=>{mobileNav.classList.remove('open');document.body.style.overflow='';};
  closeBtn?.addEventListener('click',closeFn);
  mobileNav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeFn));
}
document.querySelectorAll('.tl-item').forEach(item=>{item.setAttribute('tabindex','0');});
})();