(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,84501,e=>{"use strict";var t=e.i(34034),n=e.i(92454);function r(e,t,n,r){let a=Math.max(t,n),o=new Float64Array(a),i=new Float64Array(a),l=new Int32Array(a),s=new Float64Array(a+1),c=new Float64Array(t*n);function u(e){let t=0;l[0]=0,s[0]=-1/0,s[1]=1/0;for(let n=1;n<e;n++){let e=(o[n]+n*n-(o[l[t]]+l[t]*l[t]))/(2*n-2*l[t]);for(;e<=s[t];)t--,e=(o[n]+n*n-(o[l[t]]+l[t]*l[t]))/(2*n-2*l[t]);l[++t]=n,s[t]=e,s[t+1]=1/0}t=0;for(let n=0;n<e;n++){for(;s[t+1]<n;)t++;i[n]=(n-l[t])**2+o[l[t]]}}for(let a=0;a<t;a++){for(let i=0;i<n;i++)o[i]=1e12*(!!e[i*t+a]!==r);u(n);for(let e=0;e<n;e++)c[e*t+a]=i[e]}for(let e=0;e<n;e++){for(let n=0;n<t;n++)o[n]=c[e*t+n];u(t);for(let n=0;n<t;n++)c[e*t+n]=Math.sqrt(i[n])}return c}let a="varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}",o=`
varying vec2 vUv;
uniform sampler2D uState;
uniform vec2 uTexel,uPointer;
uniform float uImpulse,uAspect;
void main(){
 vec2 s=texture2D(uState,vUv).rg;
 float lap=texture2D(uState,vUv+vec2(uTexel.x,0.)).r+texture2D(uState,vUv-vec2(uTexel.x,0.)).r+texture2D(uState,vUv+vec2(0.,uTexel.y)).r+texture2D(uState,vUv-vec2(0.,uTexel.y)).r-4.*s.r;
 float impulse=exp(-dot((vUv-uPointer)*vec2(uAspect,1.),(vUv-uPointer)*vec2(uAspect,1.))*900.)*uImpulse;
 float velocity=(s.g+lap*.22)*.972;
 float height=(s.r+velocity+impulse)*.994;
 float edge=smoothstep(0.,.03,min(min(vUv.x,1.-vUv.x),min(vUv.y,1.-vUv.y)));
 gl_FragColor=vec4(clamp(height,-.5,.5)*edge,velocity*edge,0.,1.);
}`,i=`
precision highp float;
varying vec2 vUv;
uniform sampler2D uDistance,uWave,uSentence;
uniform vec3 uWeights;
uniform vec2 uPointer,uResolution;
uniform float uAspect,uTime,uBend,uPulse;
const vec3 blue=vec3(0.,.549,.439);
const vec3 silver=vec3(.949,.957,.945);
float wordScale(){return min(uAspect*1.94,4.5);}
float sdf(vec2 p){
 vec2 size=vec2(wordScale(),wordScale()*.5);vec2 uv=p/size+.5;
 vec2 outside=max(abs(uv-.5)-.5,0.);
 return texture2D(uDistance,clamp(uv,.001,.999)).r*size.y+length(outside*size);
}
float wave(vec2 p){return texture2D(uWave,p/vec2(uAspect*2.,2.)+.5).r;}
vec2 bend(vec2 p){
 float w=wave(p);float radius=length(p-vec2(.1,0.));
 p.y+=sin(p.x*2.4+uTime*.3)*(.016+uBend*.075)*(uWeights.x+uWeights.z*.5);
 p+=normalize(p+vec2(.0001))*(w*.65+uBend*sin(radius*7.)*.065);
 return p;
}
float map(vec3 p){
 vec2 xy=bend(p.xy);float d=sdf(xy);
 float h=.10+.025*sin(xy.x*3.+xy.y*5.)*uWeights.x;
 vec2 q=vec2(d+.035,abs(p.z)-h);
 return min(max(q.x,q.y),0.)+length(max(q,0.))-.035;
}
vec3 normal(vec3 p){const float e=.011;return normalize(vec3(map(p+vec3(e,0,0))-map(p-vec3(e,0,0)),map(p+vec3(0,e,0))-map(p-vec3(0,e,0)),map(p+vec3(0,0,e))-map(p-vec3(0,0,e))));}
float line(float x,float scale){float q=x*scale;float fw=max(fwidth(q),.025);return 1.-smoothstep(.12,.12+fw,abs(fract(q)-.5));}
vec2 coordinates(vec2 p){
 // Three spatial grammars: river contours, a rectilinear vault, banking airflow.
 float coast=exp(-p.x*p.x*.3-p.y*p.y*1.8)*.6;
 vec2 river=vec2(p.x+.12*sin(p.y*3.),p.y+sin(p.x*1.65+p.y*.45)*.24+coast*.72);
 vec2 vault=vec2(atan(p.y,p.x)/6.283,log(max(.14,max(abs(p.x)*.55,abs(p.y))))*.58);
 vec2 air=vec2(p.x*.78-p.y*.3,p.y*.8+p.x*.28+sin(p.x*.7+p.y*.4)*.32+coast*.45);
 return river*uWeights.x+vault*uWeights.y+air*uWeights.z;
}
vec3 environment(vec3 r){
 float strip=pow(max(0.,1.-abs(r.y-.55)),28.);
 float strip2=pow(max(0.,1.-abs(r.x*.72+r.y*.34+.3)),55.);
 float horizon=smoothstep(-.28,.3,r.y);
 return mix(vec3(.005,.045,.035),vec3(.15,.62,.52),horizon)+vec3(.94,.98,1.)*(strip*1.6+strip2*.8);
}
vec3 landscape(vec2 p){
 p=bend(p);vec2 q=coordinates(p);float edge=exp(-max(0.,sdf(p))*.68);
 float relief=line(q.y,38.)*.56+line(q.y,114.)*.07;
 float engraved=texture2D(uSentence,vec2(fract(q.x*.53+floor(q.y*15.)*.125),fract(q.y*15.))).a;
 float shading=.18+.6*pow(.5+.5*sin(q.y*8.-q.x*.7),3.);
 vec3 col=blue*(.46+shading*.5);
 col=mix(col,silver,relief*(.16+edge*.2));
 col=mix(col,silver,engraved*.22*(.38+edge*.62));
 float crest=pow(max(0.,sin(q.y*6.5+q.x*.3)),20.)*.1;
 return col+crest;
}
void main(){
 vec2 screen=(vUv-.5)*vec2(uAspect*2.,2.);screen.y-=.05;
 vec3 ro=vec3(uPointer*.12,3.);vec3 rd=normalize(vec3(screen-ro.xy,-3.));
 vec3 color=landscape(screen);
 // Only march rays crossing the tight bounds of the typographic volume.
 float t=(ro.z-.18)/-rd.z;vec3 p=ro+rd*t;
 bool hit=false;
 if(abs(p.x)<wordScale()*.53&&abs(p.y)<wordScale()*.27){
  for(int i=0;i<64;i++){p=ro+rd*t;float d=map(p);if(d<.0014){hit=true;break;}t+=max(.0008,d*.62);if(p.z<-.22)break;}
 }
 if(hit){
  vec3 n=normal(p);float w=wave(p.xy);n=normalize(n+vec3(sin(p.x*2.5+p.y*3.)*.07,sin(p.y*3.-p.x)*.09,0.)*(uWeights.x+uWeights.z*.5));
  vec3 reflection=environment(reflect(rd,n));float fresnel=pow(1.-max(0.,dot(-rd,n)),3.);
  vec2 refracted=p.xy-n.xy*.16-vec2(w*.08);
  vec3 under=landscape(refracted);
  color=mix(reflection,under,.055+.1*uWeights.z)+silver*.13;
  color=mix(color,silver,fresnel*.42);
  float rim=pow(max(0.,dot(n,normalize(vec3(-.6,.8,1.)))),14.);color+=silver*rim*.26;
 }else{
  float d=sdf(bend(screen+vec2(-.03,.04)));
  color*=1.-exp(-max(.0,d)*17.)*.34*smoothstep(-.05,0.,d);
 }
 float vertical=smoothstep(0.,.12,vUv.y)*smoothstep(0.,.12,1.-vUv.y);
 color=mix(blue,color,vertical);
 // A short, broad wave passes through the field when a sentence changes.
 float front=exp(-pow((screen.x+uAspect-uPulse*uAspect*2.5)*3.,2.))*(1.-uPulse)*.1;
 color+=silver*front;
 gl_FragColor=vec4(color,1.);
}`;async function l(e,l,s,c,u,v){let d,p;try{d=new t.WebGLRenderer({alpha:!1,antialias:!1,powerPreference:"high-performance"})}catch{return}let m=d.getContext(),f=m.getExtension("WEBGL_debug_renderer_info"),h=f&&/SwiftShader|llvmpipe/i.test(String(m.getParameter(f.UNMASKED_RENDERER_WEBGL)));if(!m.getExtension("EXT_color_buffer_float")||h&&"live"!==new URLSearchParams(location.search).get("world"))return void d.dispose();d.setPixelRatio(h?.65:Math.min(devicePixelRatio,1.5)),d.setClearColor(35952,1);let x=new n.Scene,g=new n.Camera,w=new n.PlaneGeometry(2,2),y=document.createElement("canvas");y.width=1024,y.height=64;let b=y.getContext("2d"),A=new n.CanvasTexture(y);A.wrapS=A.wrapT=n.RepeatWrapping,A.minFilter=n.LinearFilter;let S=[0,0,0];S[l.world]=1;let T={uDistance:{value:null},uWave:{value:null},uSentence:{value:A},uWeights:{value:new n.Vector3(...S)},uPointer:{value:new n.Vector2},uAspect:{value:1},uResolution:{value:new n.Vector2},uTime:{value:0},uBend:{value:l.bend??0},uPulse:{value:1}},L=new n.ShaderMaterial({vertexShader:a,fragmentShader:i,uniforms:T,depthTest:!1,depthWrite:!1});x.add(new n.Mesh(w,L));let E=h?128:256,F={type:n.HalfFloatType,format:n.RGBAFormat,minFilter:n.LinearFilter,magFilter:n.LinearFilter,depthBuffer:!1,stencilBuffer:!1},R=new n.WebGLRenderTarget(E,E,F),U=R.clone(),C={uState:{value:R.texture},uTexel:{value:new n.Vector2(1/E,1/E)},uPointer:{value:new n.Vector2(.5,.5)},uImpulse:{value:0},uAspect:{value:1}},P=new n.ShaderMaterial({vertexShader:a,fragmentShader:o,uniforms:C,depthTest:!1,depthWrite:!1}),W=new n.Scene;W.add(new n.Mesh(w,P));let B=d.getClearColor(new n.Color);for(let e of(d.setClearColor(0,0),[R,U]))d.setRenderTarget(e),d.clear();d.setRenderTarget(null),d.setClearColor(B,1);let D=l,q=!1,z=!1,M=0,_=0,G=0,I=0,O=performance.now(),V=0,k=0,H=l.bend??0,K=0,X=0,N=0,Y=0,j=0,$=1,J=!1,Q=d.domElement;function Z(e){if(e){p?.dispose();let e=function(e,t=2048,n=1024){let a=document.createElement("canvas");a.width=t,a.height=n;let o=a.getContext("2d",{willReadFrequently:!0});o.font='400 840px "ABC Diatype"';let i=Math.min(840,1800/Math.max(1,o.measureText(e).width)*840);o.font=`400 ${i}px "ABC Diatype"`,o.textAlign="center",o.textBaseline="alphabetic";let l=o.measureText(e),s=l.actualBoundingBoxAscent,c=l.actualBoundingBoxDescent;o.fillText(e,t/2,n/2+(s-c)/2);let u=o.getImageData(0,0,t,n).data,v=new Uint8Array(t*n);for(let e=0;e<v.length;e++)v[e]=+(u[4*e+3]>127);let d=r(v,t,n,!0),p=r(v,t,n,!1),m=new Float32Array(t*n);for(let e=0;e<n;e++)for(let r=0;r<t;r++){let a=e*t+r;m[(n-1-e)*t+r]=(d[a]-p[a])/n}return{data:m,width:t,height:n}}(D.word);(p=new n.DataTexture(e.data,e.width,e.height,n.RedFormat,n.FloatType)).minFilter=p.magFilter=n.LinearFilter,p.needsUpdate=!0,T.uDistance.value=p}b.clearRect(0,0,1024,64),b.fillStyle="#f2f4f1",b.textAlign="center",b.textBaseline="middle",b.font='400 32px "ABC Diatype"',b.fillText(D.sentence,512,32),A.needsUpdate=!0}function ee(e){if(M=0,z||!q||document.hidden)return;let t=Math.min(.1,Math.max(.001,(e-O)/1e3));O=e;let n=s?1-Math.exp(-(3.5*t)):1,r=!1;for(let e=0;e<3;e++){let t=+(e===D.world);S[e]+=(t-S[e])*n,Math.abs(S[e]-t)>8e-4?r=!0:S[e]=t}if(H+=((D.bend??0)-H)*n,N+=(K-N)*n,Y+=(X-Y)*n,T.uWeights.value.set(S[0],S[1],S[2]),T.uBend.value=H,T.uPointer.value.set(N,Y),s){k+=t;let e=0;for(;k>=1/60&&e<3;){C.uState.value=R.texture,C.uImpulse.value=j,d.setRenderTarget(U),d.render(W,g);let t=R;R=U,U=t,j=0,k-=1/60,e++}T.uTime.value+=t,T.uPulse.value=$=Math.min(1,$+.62*t)}else T.uPulse.value=1;T.uWave.value=R.texture,d.setRenderTarget(null),d.render(x,g),!m.isContextLost()&&(1==++G&&v(),s&&(r||e<V||Math.abs(H-(D.bend??0))>.001||Math.abs(N-K)>.001||Math.abs(Y-X)>.001)&&(M=requestAnimationFrame(ee)))}function et(){let t=e.getBoundingClientRect();return t.width>0&&t.height>0&&t.bottom>0&&t.top<innerHeight&&t.right>0&&t.left<innerWidth}function en(e=0){!z&&(q=et(),V=Math.max(V,performance.now()+e),M||!q||document.hidden||(O=performance.now(),M=requestAnimationFrame(ee)))}function er(){_=0,z||(et()?q||en():(q=!1,cancelAnimationFrame(M),M=0))}function ea(){_||z||(_=requestAnimationFrame(er))}function eo(){let t=e.clientWidth,n=e.clientHeight;t&&n&&(d.setSize(t,n),T.uAspect.value=C.uAspect.value=t/n,T.uResolution.value.set(t,n),en())}function ei(e,t,n){C.uPointer.value.set(e,t),j=Math.min(.38,j+n),I++,en(2600)}Q.setAttribute("aria-hidden","true"),Q.dataset.languageSurface="refractive";let el=e=>{if(!s||0!==e.button)return;J=!0,Q.setPointerCapture(e.pointerId);let t=Q.getBoundingClientRect();ei((e.clientX-t.left)/t.width,1-(e.clientY-t.top)/t.height,.14)},es=e=>{if(!s||"touch"===e.pointerType&&!J)return;let t=Q.getBoundingClientRect(),n=(e.clientX-t.left)/t.width,r=1-(e.clientY-t.top)/t.height;K=n-.5,X=r-.5,ei(n,r,J?.27:.055)},ec=()=>{J=!1},eu=()=>{J=!1,K=X=0,en()},ev=()=>{document.hidden?(cancelAnimationFrame(M),M=0):en()},ed=e=>{e.preventDefault(),eh(),u()},ep=new ResizeObserver(eo),em=new IntersectionObserver(ea),ef={capture:()=>(d.setRenderTarget(null),d.render(x,g),Q.toDataURL("image/png")),state:()=>({world:D.world,weights:[...S],frames:G,visible:q,samples:2097152,bend:H,impulses:I,renderer:"WebGL2 / signed-distance type + GPU wave field"})};function eh(){z||(z=!0,cancelAnimationFrame(M),cancelAnimationFrame(_),ep.disconnect(),em.disconnect(),Q.removeEventListener("pointerdown",el),Q.removeEventListener("pointermove",es),Q.removeEventListener("pointerup",ec),Q.removeEventListener("pointercancel",ec),Q.removeEventListener("lostpointercapture",ec),Q.removeEventListener("pointerleave",eu),Q.removeEventListener("webglcontextlost",ed),document.removeEventListener("visibilitychange",ev),window.removeEventListener("scroll",ea),window.removeEventListener("pageshow",ev),w.dispose(),L.dispose(),P.dispose(),A.dispose(),p?.dispose(),R.dispose(),U.dispose(),d.dispose(),Q.remove(),window.__language===ef&&delete window.__language)}return(await document.fonts.ready,c.aborted)?void eh():(Z(!0),e.append(Q),ep.observe(e),em.observe(e),Q.addEventListener("pointerdown",el),Q.addEventListener("pointermove",es),Q.addEventListener("pointerup",ec),Q.addEventListener("pointercancel",ec),Q.addEventListener("lostpointercapture",ec),Q.addEventListener("pointerleave",eu),Q.addEventListener("webglcontextlost",ed),document.addEventListener("visibilitychange",ev),window.addEventListener("scroll",ea,{passive:!0}),window.addEventListener("pageshow",ev),window.__language=ef,eo(),{change:function(e){let t=e.word!==D.word,n=e.sentence!==D.sentence,r=e.world!==D.world,a=e.bend!==D.bend;D=e,(t||n)&&Z(t),r&&($=0,ei(.16,.5,.12)),a&&s&&ei(.5,.5,.16),en()},dispose:eh})}e.s(["bootLanguage",0,l],84501)}]);

//# sourceMappingURL=1d-kamnzib4_p.js.map