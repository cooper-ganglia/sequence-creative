const menuButton=document.querySelector('.menu-toggle');
const navLinks=document.querySelector('.nav-links');
if(menuButton&&navLinks){menuButton.addEventListener('click',()=>{const open=navLinks.classList.toggle('open');menuButton.setAttribute('aria-expanded',String(open));menuButton.textContent=open?'×':'☰'});}

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
