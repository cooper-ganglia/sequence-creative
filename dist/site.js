const menuButton=document.querySelector('.menu-toggle');
const navLinks=document.querySelector('.nav-links');
if(menuButton&&navLinks){menuButton.addEventListener('click',()=>{const open=navLinks.classList.toggle('open');menuButton.setAttribute('aria-expanded',String(open));menuButton.textContent=open?'×':'☰'});}

// Sample projects: replace titles, credits, stills, and video URLs when real work is ready.
const projects={
  'after-the-noise':{title:'After the Noise',type:'Music Video',subject:'Concept / artist to come',year:'Sample',image:'assets/music-video.webp',description:'An intimate performance-led visual built around one voice, one room, and the space between notes.'},
  'in-the-room':{title:'In the Room',type:'Live Session',subject:'Concept / artist to come',year:'Sample',image:'assets/live-session.webp',description:'A close-up look at the energy that only happens when a song is played live.'},
  'hands-at-work':{title:'Hands at Work',type:'Documentary',subject:'Concept / subject to come',year:'Sample',image:'assets/documentary.webp',description:'A quiet portrait of craft, patience, and the people behind the work.'},
  'the-long-way-home':{title:'The Long Way Home',type:'Short Film',subject:'Concept / collaborators to come',year:'Sample',image:'assets/documentary.webp',description:'A character-led short film concept told through light, place, and small decisions.'},
  'made-to-move':{title:'Made to Move',type:'Branded Content',subject:'Concept / brand to come',year:'Sample',image:'assets/music-video.webp',description:'A cinematic brand piece with rhythm, texture, and a point of view.'}
};
const detail=document.querySelector('[data-project-detail]');
if(detail){const key=new URLSearchParams(location.search).get('project')||'after-the-noise';const p=projects[key]||projects['after-the-noise'];document.title=`${p.title} — Sequence Creative`;document.querySelector('meta[name="description"]').content=`${p.type} sample project from Sequence Creative. ${p.description}`;document.querySelector('meta[property="og:title"]').content=`${p.title} — Sequence Creative`;document.querySelector('meta[property="og:description"]').content=p.description;for(const [selector,value] of [['[data-title]',p.title],['[data-type]',p.type],['[data-subject]',p.subject],['[data-year]',p.year],['[data-description]',p.description]]){document.querySelectorAll(selector).forEach(el=>el.textContent=value)}const hero=document.querySelector('[data-hero-image]');hero.src=p.image;hero.alt=`Concept still for ${p.title}`;document.querySelector('[data-gallery-image]').src=p.image;document.querySelectorAll('.project-card').forEach(card=>{if(card.getAttribute('href')?.includes(`project=${key}`))card.remove()});}

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
