const menuButton=document.querySelector('.menu-toggle');
const navLinks=document.querySelector('.nav-links');
if(menuButton&&navLinks){menuButton.addEventListener('click',()=>{const open=navLinks.classList.toggle('open');menuButton.setAttribute('aria-expanded',String(open));menuButton.textContent=open?'×':'☰'});}

const projects={
  'we-are-the-light':{title:'We Are the Light',type:'Music Video',subject:'Summit 17',year:'Details coming soon',credits:'Details coming soon',image:'assets/we-are-the-light.webp',description:'A music video for Summit 17.',note:'More details and credits for “We Are the Light” are coming soon.'},
  'my-story':{title:'My Story',type:'Live Session',subject:'Nigel Williams',year:'Details coming soon',credits:'Details coming soon',image:'assets/my-story.webp',description:'A live session with Nigel Williams.',note:'More details and credits for this live session are coming soon.'},
  'wellnews':{title:'WellNews',type:'Television',subject:'WellNews health show',year:'Details coming soon',credits:'Details coming soon',image:'assets/wellnews.webp',description:'A health television show produced by Sequence Creative.',note:'More details about our work on WellNews are coming soon.'},
  'avengers-endgame':{title:'Avengers: Endgame',type:'Joke Placeholder',subject:'Not a Sequence project',year:'Not applicable',credits:'We did not work on this film',image:'assets/avengers-placeholder.webp',description:'Just kidding. We did not make Avengers: Endgame; this card is a temporary placeholder.',note:'We did not work on Avengers: Endgame. This is a joke placeholder until the fourth project is chosen.'}
};
const detail=document.querySelector('[data-project-detail]');
if(detail){
  const key=new URLSearchParams(location.search).get('project')||'we-are-the-light';
  const p=projects[key]||projects['we-are-the-light'];
  document.title=`${p.title} — Sequence Creative`;
  document.querySelector('meta[name="description"]').content=p.description;
  document.querySelector('meta[property="og:title"]').content=`${p.title} — Sequence Creative`;
  document.querySelector('meta[property="og:description"]').content=p.description;
  for(const [selector,value] of [['[data-title]',p.title],['[data-type]',p.type],['[data-subject]',p.subject],['[data-year]',p.year],['[data-credits]',p.credits],['[data-description]',p.description],['[data-project-note]',p.note]]){
    document.querySelectorAll(selector).forEach(el=>el.textContent=value);
  }
  const hero=document.querySelector('[data-hero-image]');
  hero.src=p.image;
  hero.alt=`${p.title} project image${key==='avengers-endgame'?' used as a joke placeholder':''}`;
  document.querySelectorAll('.project-card').forEach(card=>{if(card.getAttribute('href')?.includes(`project=${key}`))card.remove();});
}

const motionOK=window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)').matches;
if(motionOK){
  document.querySelectorAll('.project-card').forEach(card=>{
    let frame=0;
    card.addEventListener('pointermove',event=>{
      cancelAnimationFrame(frame);
      const box=card.getBoundingClientRect();
      const x=(event.clientX-box.left)/box.width;
      const y=(event.clientY-box.top)/box.height;
      frame=requestAnimationFrame(()=>{
        card.style.setProperty('--tilt-x',`${((.5-y)*5).toFixed(2)}deg`);
        card.style.setProperty('--tilt-y',`${((x-.5)*5).toFixed(2)}deg`);
        card.style.setProperty('--image-x',`${((x-.5)*-9).toFixed(1)}px`);
        card.style.setProperty('--image-y',`${((y-.5)*-9).toFixed(1)}px`);
      });
    });
    card.addEventListener('pointerleave',()=>{
      cancelAnimationFrame(frame);
      for(const name of ['--tilt-x','--tilt-y','--image-x','--image-y'])card.style.removeProperty(name);
    });
  });

}
if(window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)').matches){
  document.querySelectorAll('.hero-bar').forEach(bar=>{
    let position=0,velocity=0,target=0,frame=0,last=0;
    const animate=time=>{
      const step=Math.min((time-last)/16.67||1,2);
      last=time;
      velocity+=(target-position)*.065*step;
      velocity*=Math.pow(.83,step);
      position+=velocity*step;
      bar.style.setProperty('--lift',`${position.toFixed(2)}px`);
      if(Math.abs(target-position)>.03||Math.abs(velocity)>.03){frame=requestAnimationFrame(animate);}
      else{bar.style.setProperty('--lift',`${target}px`);frame=0;}
    };
    const setTarget=value=>{target=value;if(!frame){last=0;frame=requestAnimationFrame(animate);}};
    bar.addEventListener('pointerenter',()=>setTarget(-12));
    bar.addEventListener('pointerleave',()=>setTarget(0));
  });
}

if('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  const revealItems=document.querySelectorAll('.section-heading,.service,.manifesto-layout,.project-card');
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}});
  },{threshold:.08,rootMargin:'0px 0px 80px 0px'});
  revealItems.forEach(item=>{item.classList.add('motion-reveal');observer.observe(item);});
}

const form=document.querySelector('[data-inquiry-form]');
if(form){form.addEventListener('submit',event=>{event.preventDefault();const data=new FormData(form);const subject=`Project inquiry: ${data.get('projectType')||'New project'}`;const body=[`Name: ${data.get('name')}`,`Email: ${data.get('email')}`,`Company / artist / organization: ${data.get('organization')||'—'}`,`Project type: ${data.get('projectType')}`,`Budget: ${data.get('budget')||'Not specified'}`,`Target date: ${data.get('date')||'Not specified'}`,'',String(data.get('details')||'')].join('\n');const url=new URL('https://mail.google.com/mail/');url.search=new URLSearchParams({view:'cm',fs:'1',to:'hello@sequencecreative.com',su:subject,body}).toString();window.open(url.toString(),'_blank','noopener,noreferrer');form.querySelector('.form-status').textContent='Gmail should open in a new tab with your project details. Review the draft before sending.';});}
