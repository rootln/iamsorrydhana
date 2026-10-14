/*
 * WHERE HEAVEN BEGINS — for Lipi, by Niraj
 * All effects are local and dependency-free: CSS 3D gate scrub + WebGL 1.0
 * luminance-biased fractal-noise morph inspired by the user's reference.
 */
'use strict';
const $ = (q) => document.querySelector(q);
const clamp = (v, a=0, b=1) => Math.max(a, Math.min(b, v));
const smooth = (a,b,v) => { const t=clamp((v-a)/(b-a)); return t*t*(3-2*t); };
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const PHOTOS = [
  {src:'https://res.cloudinary.com/dxrqlmgcz/image/upload/f_auto,q_auto/v1782211354/IMG_7693_k8hg0e.heic', raw:'https://res.cloudinary.com/dxrqlmgcz/image/upload/v1782211354/IMG_7693_k8hg0e.heic',fallback:'assets/us-heer.jpg',title:'A picture, a thousand feelings.',story:'I could collect a thousand beautiful moments. Somehow, they would all bring me back to you.',whisper:'the best part of every day is you.',chapter:'CHAPTER ONE',alt:'One of our treasured moments'},
  {src:'https://res.cloudinary.com/dxrqlmgcz/image/upload/v1782211354/3d83fbc2-a047-4d48-ab1a-f4209ee45a0e_b4gck3.jpg',fallback:'assets/us-heer.jpg',title:'Right where I belong.',story:'Even in the most ordinary corners of the world, standing beside you feels like being exactly where I should be.',whisper:'home has always felt like you.',chapter:'CHAPTER TWO',alt:'Niraj and Lipi standing together'},
  {src:'https://res.cloudinary.com/dxrqlmgcz/image/upload/v1782211353/cf705940-f075-4378-bb84-054ef62160ad_rv6mb8.jpg',fallback:'assets/us-heer.jpg',title:'Where everything blooms.',story:'There were flowers all around us that day. And still, the loveliest part of the picture was you.',whisper:'you make the ordinary magical.',chapter:'CHAPTER THREE',alt:'Niraj and Lipi surrounded by flowers'},
  {src:'https://res.cloudinary.com/dxrqlmgcz/image/upload/v1782211353/cecb12e5-1a46-4ad3-a7cc-d7fac9a0249a_gauafo.jpg',fallback:'assets/us-birthday.jpg',title:'Even without colour.',story:'Some memories don’t need a perfect frame, perfect lighting, or even colour. Just us, close enough to feel like home.',whisper:'some moments are warm forever.',chapter:'CHAPTER FOUR',alt:'A happy black-and-white candid photo of us'},
  {src:'https://res.cloudinary.com/dxrqlmgcz/image/upload/v1782152340/29184555-388b-4319-9d90-50a1f7bf9f5e_pkj5ji.jpg',fallback:'assets/us-birthday.jpg',title:'That kind of hug.',story:'If I could bottle one feeling for your difficult days, it would be this: being held close, and knowing you aren’t alone.',whisper:'I want to be your safe place.',chapter:'CHAPTER FIVE',alt:'Niraj hugging Lipi in her red dress'},
  {src:'https://res.cloudinary.com/dxrqlmgcz/image/upload/v1782151973/IMG_5325_cqr2z2.jpg',fallback:'assets/us-birthday.jpg',title:'Our beautiful chaos.',story:'The cake, our silly faces, and a moment we could never have planned. These are the memories I love the most.',whisper:'even our chaos makes me smile.',chapter:'CHAPTER SIX',alt:'A funny shared birthday moment with a cake'},
  {src:'https://res.cloudinary.com/dxrqlmgcz/image/upload/v1782152194/IMG_6678_e3epxq.jpg',fallback:'assets/us-heer.jpg',title:'A little wind. A lot of us.',story:'A quick selfie, your shy smile, and one more ordinary day turned into something I want to keep forever.',whisper:'every little moment counts.',chapter:'CHAPTER SEVEN',alt:'Niraj and Lipi in an outdoor selfie'},
  {src:'https://res.cloudinary.com/dxrqlmgcz/image/upload/v1782150502/IMG_20220722_185450_664_uwehll.jpg',fallback:'assets/us-heer.jpg',title:'The earlier chapters.',story:'Look how far our story has travelled. I wish I could tell those two people just how precious these memories would become.',whisper:'from then, to now, to always.',chapter:'CHAPTER EIGHT',alt:'An older smiling selfie of Niraj and Lipi'},
  {src:'https://res.cloudinary.com/dxrqlmgcz/image/upload/v1782152221/IMG_6603_kohdxl.jpg',fallback:'assets/us-birthday.jpg',title:'My favourite reflection.',story:'A mirror can capture our faces, but never all the ways you’ve made my life softer, kinder, and more beautiful.',whisper:'my favourite view is us.',chapter:'CHAPTER NINE',alt:'Niraj and Lipi taking a mirror photograph'}
];

function initIntro(){
  const section=$('#beginning'),stage=$('#portalStage'),prompt=$('#scrollPrompt');
  const title=$('.portal-title'),reveal=$('.reveal-title'),architecture=$('.portal-architecture'),sky=$('.night-sky'),world=$('.meadow-world'),burst=$('.light-burst'),petals=$('#petals');
  for(let i=0;i<74;i++){
    const star=document.createElement('i');let x=(i*37.13+Math.sin(i*19)*25+100)%100;let y=(i*31.87+Math.cos(i*12)*25+100)%100;
    star.style.cssText=`left:${x}%;top:${y}%;--star-opacity:${.12+(i%7)*.1};--star-speed:${3+(i%6)}s;animation-delay:${-i*.39}s`;
    if(i%11===0)star.className='bright';$('#stars').appendChild(star);
  }
  for(let i=0;i<29;i++){
    const p=document.createElement('i');p.className='float-petal';p.style.cssText=`left:${(i*51.71)%100}%;top:${(i*29.7)%100-45}%;--t:${7+i%8}s;--delay:${-(i%11)}s;--o:${.15+(i%5)*.11};transform:scale(${.7+i%4*.2})`;petals.appendChild(p);
  }
  function paint(){
    const dist=section.offsetHeight-window.innerHeight;
    const r=section.getBoundingClientRect();
    const p=clamp(-r.top/Math.max(1,dist));
    const open=smooth(.07,.76,p),arrive=smooth(.62,.93,p);
    stage.style.setProperty('--opening',open.toFixed(4));stage.style.setProperty('--arrived',arrive.toFixed(4));
    $('.left-door').style.transform=`rotateY(${-117*open}deg)`;
    $('.right-door').style.transform=`rotateY(${117*open}deg)`;
    $('.door-center-jewel').style.opacity=String(clamp(1-open*4));
    architecture.style.transform=`translate(-50%,-44%) scale(${1-open*.08+arrive*.12})`;
    architecture.style.opacity=String(clamp(1-smooth(.70,.94,p)));
    title.style.opacity=String(clamp(1-smooth(.045,.28,p)));
    title.style.transform=`translateX(-50%) translateY(${-38*smooth(.04,.3,p)}px)`;
    world.style.clipPath=`inset(${(23*(1-open)).toFixed(2)}% ${(32*(1-open)).toFixed(2)}% round ${Math.round(43*(1-open))}% ${Math.round(43*(1-open))}% 1% 1%)`;
    world.style.opacity=String(.13+open*.87);
    world.style.transform=`scale(${(1.15-open*.15+arrive*.075).toFixed(3)})`;
    sky.style.opacity=String(1-arrive);
    burst.style.opacity=String(smooth(.13,.49,p)*.9*(1-smooth(.60,.95,p)));
    reveal.style.opacity=String(smooth(.72,.96,p));
    reveal.style.transform=`translateX(-50%) translateY(${20*(1-arrive)}px)`;
    reveal.style.pointerEvents=arrive>.6?'auto':'none';reveal.classList.toggle('is-visible',arrive>.78);
    prompt.style.opacity=String(clamp(1-smooth(.025,.13,p)));prompt.style.pointerEvents=p<.1?'auto':'none';
    $('#heroProgress').style.width=(p*100).toFixed(1)+'%';
    petals.style.opacity=String(smooth(.38,.85,p)*.84);
  }
  let ticking=false;
  window.addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(()=>{paint();ticking=false;});}},{passive:true});
  window.addEventListener('resize',paint,{passive:true});paint();
  prompt.addEventListener('click',()=>{const target=section.offsetTop+(section.offsetHeight-window.innerHeight)*.97;window.scrollTo({top:target,behavior:reducedMotion?'instant':'smooth'});});
}

/* Full-screen noise-dissolve adapted from the supplied morph-gallery reference.
   Bright parts of the incoming image reveal first; both frames drift under a
   fractional Brownian motion mask. Fallback photographs remain visible if the
   user's device blocks WebGL or Cloudinary's CORS response. */
const vertexSource=`attribute vec2 a_position; varying vec2 v_uv; void main(){v_uv=a_position*.5+.5;gl_Position=vec4(a_position,0.,1.);}`;
const fragmentSource=`
precision highp float;
uniform sampler2D u_from,u_to;
uniform vec2 u_resolution;
uniform float u_progress,u_fromAspect,u_toAspect,u_scale,u_direction,u_edge,u_drift;
varying vec2 v_uv;
vec3 permute(vec3 x){return mod(((x*34.)+1.)*x,289.);}
float snoise(vec2 v){
 const vec4 C=vec4(.211324865405187,.366025403784439,-.577350269189626,.024390243902439);
 vec2 i=floor(v+dot(v,C.yy));vec2 x0=v-i+dot(i,C.xx);
 vec2 i1=(x0.x>x0.y)?vec2(1.,0.):vec2(0.,1.);
 vec4 x12=x0.xyxy+C.xxzz;x12.xy-=i1;i=mod(i,289.);
 vec3 p=permute(permute(i.y+vec3(0.,i1.y,1.))+i.x+vec3(0.,i1.x,1.));
 vec3 m=max(.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.);
 m=m*m;m=m*m;vec3 x=2.*fract(p*C.www)-1.;vec3 h=abs(x)-.5;vec3 ox=floor(x+.5);vec3 a0=x-ox;
 m*=1.79284291400159-.85373472095314*(a0*a0+h*h);
 vec3 g;g.x=a0.x*x0.x+h.x*x0.y;g.yz=a0.yz*x12.xz+h.yz*x12.yw;
 return 130.*dot(m,g);
}
float fbm(vec2 v){float val=0.,amp=.5;for(int i=0;i<5;i++){val+=amp*snoise(v);v*=2.;amp*=.5;}return val;}
vec2 mirrorUV(vec2 uv){return 1.-abs(1.-mod(uv,2.));}
vec2 cover(vec2 uv,float imgAspect){float a=u_resolution.x/u_resolution.y;vec2 s=(a>imgAspect)?vec2(1.,imgAspect/a):vec2(a/imgAspect,1.);return mirrorUV((uv-.5)*s+.5);}
void main(){
 float adjusted=u_progress*(1.+2.*u_edge)-u_edge;
 float noise=fbm(v_uv*u_scale+vec2(0.,u_progress*u_direction))*.5+.5;
 noise=smoothstep(0.,2.,length(texture2D(u_to,cover(v_uv,u_toAspect)).rgb)+noise);
 float mixFactor=1.-smoothstep(adjusted-u_edge,adjusted+u_edge,noise);
 vec2 fromUV=cover(v_uv+vec2(0.,noise*u_progress*u_drift*u_direction),u_fromAspect);
 vec2 toUV=cover(v_uv+vec2(0.,noise*(1.-u_progress)*(-.5)*u_drift*u_direction),u_toAspect);
 gl_FragColor=mix(texture2D(u_from,fromUV),texture2D(u_to,toUV),mixFactor);
}`;
function makeProgram(gl){
 const compile=(type,src)=>{const sh=gl.createShader(type);gl.shaderSource(sh,src);gl.compileShader(sh);if(!gl.getShaderParameter(sh,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(sh)||'shader error');return sh;};
 const vert=compile(gl.VERTEX_SHADER,vertexSource),frag=compile(gl.FRAGMENT_SHADER,fragmentSource);const prog=gl.createProgram();gl.attachShader(prog,vert);gl.attachShader(prog,frag);gl.linkProgram(prog);gl.deleteShader(vert);gl.deleteShader(frag);if(!gl.getProgramParameter(prog,gl.LINK_STATUS))throw new Error('WebGL link failed');return prog;
}
const loadImage=(src)=>new Promise((resolve,reject)=>{let img=new Image();img.crossOrigin='anonymous';img.onload=()=>resolve(img);img.onerror=()=>reject(new Error('image unavailable'));img.src=src;});
async function loadWithFallback(item){try{return await loadImage(item.src);}catch{if(item.raw){try{return await loadImage(item.raw);}catch{}}return await loadImage(item.fallback);}}
function startShader(onShow, initialIndex=0){
 const canvas=$('#morphCanvas');let gl;
 try{gl=canvas.getContext('webgl',{alpha:false,antialias:false,preserveDrawingBuffer:false})||canvas.getContext('experimental-webgl');if(!gl)throw Error('No WebGL');}
 catch(err){console.warn('Gallery is using the accessible image fallback.');return ()=>{};}
 let program,buffer,locations={};const textures=new Array(PHOTOS.length).fill(null),aspects=new Array(PHOTOS.length).fill(1);
 let from=initialIndex,to=initialIndex,startTime=0,transitionDuration=1450,raf=0,running=true;let loaded=false;let lastDrawn=-1;
 let shaderIsVisible=true;const shaderVisibility=new IntersectionObserver(entries=>{shaderIsVisible=entries[0]?.isIntersecting??false;},{rootMargin:'180px'});shaderVisibility.observe(canvas);
 const quad=new Float32Array([-1,-1,1,-1,-1,1,1,1]);
 try{
   program=makeProgram(gl);gl.useProgram(program);buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,quad,gl.STATIC_DRAW);const pos=gl.getAttribLocation(program,'a_position');gl.enableVertexAttribArray(pos);gl.vertexAttribPointer(pos,2,gl.FLOAT,false,0,0);
   for(const name of ['from','to','resolution','progress','fromAspect','toAspect','scale','direction','edge','drift'])locations[name]=gl.getUniformLocation(program,'u_'+name);
   gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);
 }catch(err){console.warn('Gallery shader unavailable:',err);return ()=>{};}
 const upload=(index,img)=>{const tex=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,tex);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,img);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);textures[index]=tex;aspects[index]=img.naturalWidth/Math.max(1,img.naturalHeight);};
 let loadedCount=0;
 PHOTOS.forEach((item,index)=>loadWithFallback(item).then(img=>{if(!running)return;try{upload(index,img);loadedCount++;if(!loaded && textures[initialIndex]){loaded=true;canvas.classList.add('ready');onShow();} }catch(e){console.warn('Photo texture unavailable',index,e);}}).catch(()=>console.warn('Photo '+(index+1)+' did not load')));
 const resize=()=>{const dpr=Math.min(1.6,window.devicePixelRatio||1);let w=Math.round(canvas.clientWidth*dpr),h=Math.round(canvas.clientHeight*dpr);if(w&&h&&(canvas.width!==w||canvas.height!==h)){canvas.width=w;canvas.height=h;gl.viewport(0,0,w,h);}};
 window.addEventListener('resize',resize,{passive:true});resize();
 const draw=(now)=>{
   if(!running)return;
   if(!shaderIsVisible){raf=requestAnimationFrame(draw);return;}
   resize();
   let ftex=textures[from]||textures.find(Boolean),ttex=textures[to]||textures.find(Boolean);
   if(ftex&&ttex){
     const p=reducedMotion?1:clamp((now-startTime)/transitionDuration);
     const eased=p<.5?16*p*p*p*p*p:1-Math.pow(-2*p+2,5)/2;
     gl.useProgram(program);gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,ftex);gl.uniform1i(locations.from,0);
     gl.activeTexture(gl.TEXTURE1);gl.bindTexture(gl.TEXTURE_2D,ttex);gl.uniform1i(locations.to,1);
     gl.uniform2f(locations.resolution,canvas.width,canvas.height);gl.uniform1f(locations.progress,eased);
     gl.uniform1f(locations.fromAspect,aspects[from]);gl.uniform1f(locations.toAspect,aspects[to]);gl.uniform1f(locations.scale,3.45);gl.uniform1f(locations.direction,1);gl.uniform1f(locations.edge,.16);gl.uniform1f(locations.drift,.32);
     gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
   }
   raf=requestAnimationFrame(draw);
 };
 raf=requestAnimationFrame(draw);
 const handler=(next,prev)=>{if(!running)return;from=prev;to=next;startTime=performance.now();};
 return handler;
}
function initGallery(){
 let index=0;let shaderChange=()=>{};
 const fallback=$('#galleryFallback'),rail=$('#thumbRail'),copy=$('#memoryTextBody'),canvas=$('#morphCanvas');
 PHOTOS.forEach((m,i)=>{
  const img=document.createElement('img');img.src=m.src;img.alt=m.alt;img.loading=i===0?'eager':'lazy';img.decoding='async';img.addEventListener('error',()=>{if(!img.dataset.rawtried&&m.raw){img.dataset.rawtried='1';img.src=m.raw;}else if(img.dataset.fallback!=='1'){img.dataset.fallback='1';img.src=m.fallback;}});if(!i)img.classList.add('active');fallback.appendChild(img);
  const button=document.createElement('button');button.type='button';button.className='thumb'+(i===0?' current':'');button.setAttribute('aria-label','View memory '+(i+1)+': '+m.title);button.setAttribute('aria-pressed',i===0?'true':'false');button.innerHTML='<img alt="" loading="lazy">';const thumbImg=button.querySelector('img');thumbImg.src=m.src;thumbImg.onerror=()=>{if(!thumbImg.dataset.rawtried&&m.raw){thumbImg.dataset.rawtried='1';thumbImg.src=m.raw;}else{thumbImg.onerror=null;thumbImg.src=m.fallback;}};button.addEventListener('click',()=>go(i));rail.appendChild(button);
 });
 function go(next){
  const previous=index;index=(next+PHOTOS.length)%PHOTOS.length;if(previous===index)return;
  $('#chapterLabel').textContent=PHOTOS[index].chapter;$('#memoryNumber').textContent=String(index+1).padStart(2,'0');$('#navIndex').textContent=String(index+1).padStart(2,'0');
  $('#memoryTitle').textContent=PHOTOS[index].title;$('#memoryDescription').textContent=PHOTOS[index].story;$('#memoryWhisper').textContent=PHOTOS[index].whisper;
  copy.classList.remove('animate-in');void copy.offsetWidth;copy.classList.add('animate-in');
  const visual=$('.memory-visual');
  visual.classList.remove('photo-changing');void visual.offsetWidth;visual.classList.add('photo-changing');
  const chapter=$('.chapter-label'),number=$('.memory-number'),whisper=$('.memory-whisper');
  [chapter,number,whisper].forEach((el,i)=>{el.classList.remove('text-changing');void el.offsetWidth;el.style.setProperty('--in-delay',`${i*110}ms`);el.classList.add('text-changing');});
  window.clearTimeout(go.motionTimer);go.motionTimer=window.setTimeout(()=>visual.classList.remove('photo-changing'),1680);
  [...fallback.children].forEach((el,i)=>el.classList.toggle('active',i===index));
  [...rail.children].forEach((el,i)=>{el.classList.toggle('current',i===index);el.setAttribute('aria-pressed',String(i===index));});
  rail.children[index].scrollIntoView({behavior:reducedMotion?'instant':'smooth',block:'nearest',inline:'nearest'});
  shaderChange(index,previous);
 }
 $('#prevPhoto').addEventListener('click',()=>go(index-1));$('#nextPhoto').addEventListener('click',()=>go(index+1));
 const stage=$('#imageStage');let downX=null,downY=null;
 stage.addEventListener('pointerdown',e=>{downX=e.clientX;downY=e.clientY;});stage.addEventListener('pointerup',e=>{if(downX==null)return;const dx=e.clientX-downX,dy=e.clientY-downY;if(Math.abs(dx)>40&&Math.abs(dx)>Math.abs(dy)*1.4)go(index+(dx<0?1:-1));downX=null;});
 stage.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();go(index+1);}if(e.key==='ArrowLeft'){e.preventDefault();go(index-1);}});
 // Start the optional WebGL enhancement when the gallery is near viewport.
 let initialized=false;const observer=new IntersectionObserver((entries)=>{if(entries[0].isIntersecting&&!initialized){initialized=true;shaderChange=startShader(()=>{$('#imagePlaceholder').style.display='none';}, index);observer.disconnect();}},{rootMargin:'300px'});observer.observe(stage);
}
function initExtras(){
 const progress=$('#pageProgress'),header=$('#siteHeader');let ticking=false;
 const paint=()=>{const max=document.documentElement.scrollHeight-window.innerHeight;progress.style.width=(100*clamp(window.scrollY/Math.max(1,max))).toFixed(2)+'%';header.classList.toggle('scrolled',window.scrollY>document.querySelector('#beginning').offsetHeight-window.innerHeight*.5);ticking=false;};
 window.addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(paint);}},{passive:true});paint();
 const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}})},{threshold:.10});document.querySelectorAll('.reveal-on-scroll').forEach(el=>observer.observe(el));
 if(!reducedMotion&&window.matchMedia('(pointer:fine)').matches){const cursor=$('#cursorGlow');window.addEventListener('mousemove',e=>{cursor.style.left=e.clientX+'px';cursor.style.top=e.clientY+'px';cursor.style.opacity='.75';},{passive:true});}
 $('#hugButton').addEventListener('click',(e)=>{
  const rect=e.currentTarget.getBoundingClientRect();const x=rect.left+rect.width/2,y=rect.top+rect.height/2;
  $('#hugMessage').textContent='The biggest, warmest hug is waiting for you, whenever you want it. ♡';
  const symbols=['♥','♡','❀','✿','✧'];
  for(let i=0;i<(reducedMotion?4:26);i++){const el=document.createElement('span');el.className='hug-burst';el.textContent=symbols[i%symbols.length];let dx=((i*73.3)%360)-180,dy=-(80+((i*43)%240));el.style.cssText=`--x:${x}px;--y:${y}px;--dx:${dx}px;--dy:${dy}px;--size:${12+i%4*7}px;--duration:${1.7+(i%7)*.21}s;color:${i%2?'#a66b77':'#cb9e8e'};`;document.body.appendChild(el);setTimeout(()=>el.remove(),3200);}
 });
 // Keep in-document hash links accessible with the native browser behavior.
}
/* Motion direction: staggered word masks, parallax, scroll choreography and photo light sweeps. */
function initMotion(){
  const kineticSelectors=['.intro-text h2','.bridge-section h2','.letter-paper h2','.ending-inner h2','.infinity-invite h2','.reveal-title h2'];
  const headings=document.querySelectorAll(kineticSelectors.join(','));
  headings.forEach(head=>{
    const walker=document.createTreeWalker(head,NodeFilter.SHOW_TEXT);
    const nodes=[];let n;while((n=walker.nextNode()))nodes.push(n);
    let count=0;
    nodes.forEach(node=>{
      const fragments=node.textContent.match(/\S+|\s+/g)||[];
      if(!fragments.some(s=>s.trim()))return;
      const wrap=document.createDocumentFragment();
      fragments.forEach(part=>{
        if(!part.trim()){wrap.appendChild(document.createTextNode(part));return;}
        const windowSpan=document.createElement('span');windowSpan.className='kinetic-window';
        const word=document.createElement('span');word.className='kinetic-word';
        word.style.setProperty('--word-delay',Math.min(count++,22)*64+'ms');word.textContent=part;
        windowSpan.appendChild(word);wrap.appendChild(windowSpan);
      });
      node.parentNode.replaceChild(wrap,node);
    });
    head.classList.add('kinetic-headline');
  });
  // Motion unfolds in layers: labels → headline words → body text → small ornament.
  const targetSelectors=[
    '.section-kicker','.intro-text p','.intro-scroll-cue',
    '.chapter-label','.memory-number','.memory-whisper','.memory-navigation','.memory-divider',
    '.bridge-flower','.bridge-section p',
    '.letter-eyebrow','.letter-aside p','.rose-art','.paper-topline','.paper-decoration',
    '.letter-text p','.signature-area','.seal-line',
    '.ending-inner > p','.hug-button','.infinity-invite > p','.infinity-open','.infinity-hint'
  ];
  document.querySelectorAll(targetSelectors.join(',')).forEach((el,i)=>{
    el.classList.add('motion-child');
    const localIndex=Array.from(el.parentNode.children).indexOf(el);
    el.style.setProperty('--motion-delay', Math.min(localIndex*115,620)+'ms');
  });
  // If a section is already in view at load, show it immediately; intersection handles later sections.
  const revealObserver=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(!e.isIntersecting)return;
      e.target.classList.add('motion-visible','is-visible');
      revealObserver.unobserve(e.target);
    });
  },{threshold:.10,rootMargin:'0px 0px -3% 0px'});
  const revealTargets=['.intro-text','.bridge-section','.memory-copy','.memory-visual','.letter-aside','.letter-paper','.ending-inner','.infinity-invite'];
  document.querySelectorAll(revealTargets.join(',')).forEach(el=>revealObserver.observe(el));
  if(!reducedMotion){
    // Camera depth on large screens; never fight swiping on touch screens.
    if(window.matchMedia('(pointer:fine) and (min-width:850px)').matches){
      const stage=$('#imageStage');
      stage.addEventListener('pointermove',e=>{
        const r=stage.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
        stage.style.setProperty('--pointerX',`${(x*3.5).toFixed(2)}deg`);
        stage.style.setProperty('--pointerY',`${(-y*2.5).toFixed(2)}deg`);
        stage.style.setProperty('--glowX',`${((x+.5)*100).toFixed(1)}%`);
        stage.style.setProperty('--glowY',`${((y+.5)*100).toFixed(1)}%`);
      },{passive:true});
      stage.addEventListener('pointerleave',()=>{stage.style.setProperty('--pointerX','0deg');stage.style.setProperty('--pointerY','0deg');});
    }
    const parallaxNodes=[['.intro-text',.20],['.bridge-section',.13],['.letter-section',.12],['.ending-section',.15],['.infinity-section',.11]];
    const targets=parallaxNodes.map(([name,f])=>[document.querySelector(name),f]).filter(e=>e[0]);
    let scrollQueued=false;
    function onParallax(){
      const mid=window.innerHeight/2;
      for(const [el,f] of targets){const rect=el.getBoundingClientRect();const delta=clamp((rect.top+rect.height/2-mid)/Math.max(window.innerHeight,500),-1.6,1.6);el.style.setProperty('--motion-parallax',`${(delta*f*90).toFixed(2)}px`);}
      scrollQueued=false;
    }
    window.addEventListener('scroll',()=>{if(!scrollQueued){scrollQueued=true;requestAnimationFrame(onParallax);}},{passive:true});
    window.addEventListener('resize',onParallax,{passive:true});onParallax();
  }
}

/* Love without an endpoint: dynamically extends on demand. We recycle old cards
   to keep memory usage bounded even after hundreds of scrolls. */
function initInfinity(){
 const section=$('#forever'),button=$('#infinityButton'),world=$('#infinityWorld'),stream=$('#infinityStream'),sentinel=$('#infinitySentinel'),close=$('#infinityClose');
 let active=false, cardsCreated=0, busy=false;
 let observer=null;
 const notes=[
  ['❤️','A little more than yesterday.','And somehow, less than tomorrow.'],
  ['♡','More than every star in the sky.','Even the ones we haven’t discovered yet.'],
  ['💕','More than all our silly little jokes.','And I never want to stop making you laugh.'],
  ['💗','More than all the flowers in this meadow.','You will always be my favourite bloom.'],
  ['💞','More than every “good morning”.','And every sleepy “good night”.'],
  ['❤️','More than I could ever put into words.','But I’ll keep showing you anyway.'],
  ['💖','More than a thousand photographs.','Because the best memories are still ahead of us.'],
  ['💘','More than every ordinary Tuesday.','You make even those feel special.'],
  ['💓','More than all the miles between us.','No distance makes you less important.'],
  ['❤️','More than all the pages in the world.','No final chapter. Not for us.'],
  ['💗','More than all the sunrises to come.','I want to be someone you can count on.'],
  ['♡','More than an endless scroll can explain.','You deserve to feel loved, not just hear it.']
 ];
 const makeCard=(i)=>{
   const [symbol,title,sub]=notes[i%notes.length];
   const card=document.createElement('article');card.className='infinity-card';
   const scale=[.8,1.08,.98,1.2,.95][i%5];
   card.style.setProperty('--card-scale',String(scale));card.style.setProperty('--card-tilt',((i%2?1:-1)*(2+i%3))+'deg');
   card.style.setProperty('--card-delay',String((i%4)*.08)+'s');
   const indexText=String(i+1).padStart(3,'0');
   card.innerHTML=`<span class="infinity-card-number">LOVE NOTE ${indexText} <span>✧</span> FOREVER</span><div class="infinity-card-heart" aria-hidden="true">${symbol}</div><h4>${title}</h4><p>${sub}</p><div class="infinity-card-tail" aria-hidden="true">↓</div>`;
   return card;
 };
 const cardObserver=new IntersectionObserver(entries=>{
   entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('seen');cardObserver.unobserve(e.target);}});
 },{threshold:.14,rootMargin:'0px 0px -5% 0px'});
 function appendBatch(){
   if(!active||busy)return;
   busy=true;
   const frag=document.createDocumentFragment(),fresh=[];
   for(let k=0;k<7;k++){const card=makeCard(cardsCreated++);frag.appendChild(card);fresh.push(card);}
   stream.appendChild(frag);fresh.forEach(card=>cardObserver.observe(card));
   const count=$('#infinityCounter');count.textContent=`${cardsCreated}+ little ways to say I love you · ∞ to go`;
   // Bound the DOM to 42 cards; hold the reader's position when older cards retire.
   if(stream.children.length>42){
     let removed=0;
     for(let k=0;k<7;k++){
       const first=stream.firstElementChild;if(!first)break;
       const before=first.getBoundingClientRect().top;
       const next=first.nextElementSibling;
       cardObserver.unobserve(first);first.remove();
       removed+= next?next.getBoundingClientRect().top-before : first.offsetHeight;
     }
     if(removed>0)window.scrollBy({top:-removed,behavior:'instant'});
   }
   busy=false;
 }
 button.addEventListener('click',()=>{
   if(active)return;
   active=true;world.hidden=false;section.classList.add('infinity-opened');
   button.setAttribute('aria-expanded','true');
   appendBatch();appendBatch();
   observer=new IntersectionObserver(es=>{
     if(es.some(e=>e.isIntersecting))appendBatch();
   },{rootMargin:'1100px 0px 1100px 0px',threshold:0});
   observer.observe(sentinel);
   const location=$('#infinityStart');
   requestAnimationFrame(()=>{location.scrollIntoView({behavior:reducedMotion?'instant':'smooth',block:'start'});});
 });
 close.addEventListener('click',()=>{
   active=false;if(observer){observer.disconnect();observer=null;}
   section.classList.remove('infinity-opened');
   button.setAttribute('aria-expanded','false');
   world.hidden=true;cardObserver.disconnect();stream.replaceChildren();cardsCreated=0;
   button.scrollIntoView({behavior:reducedMotion?'instant':'smooth',block:'center'});
   button.focus({preventScroll:true});
 });
}
function boot(){initIntro();initGallery();initExtras();initMotion();initInfinity();document.body.classList.add('site-ready');requestAnimationFrame(()=>setTimeout(()=>$('#loading').classList.add('hidden'),200));}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
