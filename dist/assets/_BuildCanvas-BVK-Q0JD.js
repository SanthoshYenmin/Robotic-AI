import{A as N,V as ee,Q as te,a as re,M as A,b as L,c as ne,S as ie,r as h,u as F,W as z,P as ae,d as se,e as oe,C as le,f as E,g as U,_ as ue,h as V,R as ce,i as fe,j as a,E as ve,k as Q,D as me,B as de,l as xe,m as H,n as pe}from"./index-CZxgTHA4.js";function Z(n,r,e={}){const t=new L,i=new ne,l=new L,c=new A,d=new A,v=new A;e.preserveMatrix=e.preserveMatrix!==void 0?e.preserveMatrix:!0,e.preservePosition=e.preservePosition!==void 0?e.preservePosition:!0,e.preserveHipPosition=e.preserveHipPosition!==void 0?e.preserveHipPosition:!1,e.useTargetMatrix=e.useTargetMatrix!==void 0?e.useTargetMatrix:!1,e.hip=e.hip!==void 0?e.hip:"hip",e.names=e.names||{};const g=r.isObject3D?r.skeleton.bones:P(r),x=n.isObject3D?n.skeleton.bones:P(n);let p,s,u,y,f;if(n.isObject3D?n.skeleton.pose():(e.useTargetMatrix=!0,e.preserveMatrix=!1),e.preservePosition){f=[];for(let o=0;o<x.length;o++)f.push(x[o].position.clone())}if(e.preserveMatrix){n.updateMatrixWorld(),n.matrixWorld.identity();for(let o=0;o<n.children.length;++o)n.children[o].updateMatrixWorld(!0)}if(e.offsets){p=[];for(let o=0;o<x.length;++o)s=x[o],u=e.names[s.name]||s.name,e.offsets[u]&&(s.matrix.multiply(e.offsets[u]),s.matrix.decompose(s.position,s.quaternion,s.scale),s.updateMatrixWorld()),p.push(s.matrixWorld.clone())}for(let o=0;o<x.length;++o){if(s=x[o],u=e.names[s.name]||s.name,y=K(u,g),v.copy(s.matrixWorld),y){if(y.updateMatrixWorld(),e.useTargetMatrix?d.copy(y.matrixWorld):(d.copy(n.matrixWorld).invert(),d.multiply(y.matrixWorld)),l.setFromMatrixScale(d),d.scale(l.set(1/l.x,1/l.y,1/l.z)),v.makeRotationFromQuaternion(i.setFromRotationMatrix(d)),n.isObject3D){const m=x.indexOf(s),b=p?p[m]:c.copy(n.skeleton.boneInverses[m]).invert();v.multiply(b)}v.copyPosition(d)}s.parent&&s.parent.isBone?(s.matrix.copy(s.parent.matrixWorld).invert(),s.matrix.multiply(v)):s.matrix.copy(v),e.preserveHipPosition&&u===e.hip&&s.matrix.setPosition(t.set(0,s.position.y,0)),s.matrix.decompose(s.position,s.quaternion,s.scale),s.updateMatrixWorld()}if(e.preservePosition)for(let o=0;o<x.length;++o)s=x[o],u=e.names[s.name]||s.name,u!==e.hip&&s.position.copy(f[o]);e.preserveMatrix&&n.updateMatrixWorld(!0)}function he(n,r,e,t={}){t.useFirstFramePosition=t.useFirstFramePosition!==void 0?t.useFirstFramePosition:!1,t.fps=t.fps!==void 0?t.fps:30,t.names=t.names||[],r.isObject3D||(r=Me(r));const i=Math.round(e.duration*(t.fps/1e3)*1e3),l=1/t.fps,c=[],d=new N(r),v=P(n.skeleton),g=[];let x,p,s,u,y;d.clipAction(e).play(),d.update(0),r.updateMatrixWorld();for(let f=0;f<i;++f){const o=f*l;Z(n,r,t);for(let m=0;m<v.length;++m)y=t.names[v[m].name]||v[m].name,s=K(y,r.skeleton),s&&(p=v[m],u=g[m]=g[m]||{bone:p},t.hip===y&&(u.pos||(u.pos={times:new Float32Array(i),values:new Float32Array(i*3)}),t.useFirstFramePosition&&(f===0&&(x=p.position.clone()),p.position.sub(x)),u.pos.times[f]=o,p.position.toArray(u.pos.values,f*3)),u.quat||(u.quat={times:new Float32Array(i),values:new Float32Array(i*4)}),u.quat.times[f]=o,p.quaternion.toArray(u.quat.values,f*4));d.update(l),r.updateMatrixWorld()}for(let f=0;f<g.length;++f)u=g[f],u&&(u.pos&&c.push(new ee(".bones["+u.bone.name+"].position",u.pos.times,u.pos.values)),c.push(new te(".bones["+u.bone.name+"].quaternion",u.quat.times,u.quat.values)));return d.uncacheAction(e),new re(e.name,-1,c)}function ye(n){const r=new Map,e=new Map,t=n.clone();return J(n,t,function(i,l){r.set(l,i),e.set(i,l)}),t.traverse(function(i){if(!i.isSkinnedMesh)return;const l=i,c=r.get(i),d=c.skeleton.bones;l.skeleton=c.skeleton.clone(),l.bindMatrix.copy(c.bindMatrix),l.skeleton.bones=d.map(function(v){return e.get(v)}),l.bind(l.skeleton,l.bindMatrix)}),t}function K(n,r){for(let e=0,t=P(r);e<t.length;e++)if(n===t[e].name)return t[e]}function P(n){return Array.isArray(n)?n:n.bones}function Me(n){const r=new ie(n.bones[0]);return r.skeleton=n,r}function J(n,r,e){e(n,r);for(let t=0;t<n.children.length;t++)J(n.children[t],r.children[t],e)}const ge={retarget:Z,retargetClip:he,clone:ye},be={uniforms:{tDiffuse:{value:null},h:{value:1/512}},vertexShader:`
      varying vec2 vUv;

      void main() {

        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

      }
  `,fragmentShader:`
    uniform sampler2D tDiffuse;
    uniform float h;

    varying vec2 vUv;

    void main() {

    	vec4 sum = vec4( 0.0 );

    	sum += texture2D( tDiffuse, vec2( vUv.x - 4.0 * h, vUv.y ) ) * 0.051;
    	sum += texture2D( tDiffuse, vec2( vUv.x - 3.0 * h, vUv.y ) ) * 0.0918;
    	sum += texture2D( tDiffuse, vec2( vUv.x - 2.0 * h, vUv.y ) ) * 0.12245;
    	sum += texture2D( tDiffuse, vec2( vUv.x - 1.0 * h, vUv.y ) ) * 0.1531;
    	sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y ) ) * 0.1633;
    	sum += texture2D( tDiffuse, vec2( vUv.x + 1.0 * h, vUv.y ) ) * 0.1531;
    	sum += texture2D( tDiffuse, vec2( vUv.x + 2.0 * h, vUv.y ) ) * 0.12245;
    	sum += texture2D( tDiffuse, vec2( vUv.x + 3.0 * h, vUv.y ) ) * 0.0918;
    	sum += texture2D( tDiffuse, vec2( vUv.x + 4.0 * h, vUv.y ) ) * 0.051;

    	gl_FragColor = sum;

    }
  `},je={uniforms:{tDiffuse:{value:null},v:{value:1/512}},vertexShader:`
    varying vec2 vUv;

    void main() {

      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

    }
  `,fragmentShader:`

  uniform sampler2D tDiffuse;
  uniform float v;

  varying vec2 vUv;

  void main() {

    vec4 sum = vec4( 0.0 );

    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 4.0 * v ) ) * 0.051;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 3.0 * v ) ) * 0.0918;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 2.0 * v ) ) * 0.12245;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 1.0 * v ) ) * 0.1531;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y ) ) * 0.1633;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 1.0 * v ) ) * 0.1531;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 2.0 * v ) ) * 0.12245;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 3.0 * v ) ) * 0.0918;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 4.0 * v ) ) * 0.051;

    gl_FragColor = sum;

  }
  `},De=h.forwardRef(({scale:n=10,frames:r=1/0,opacity:e=1,width:t=1,height:i=1,blur:l=1,near:c=0,far:d=10,resolution:v=512,smooth:g=!0,color:x="#000000",depthWrite:p=!1,renderOrder:s,...u},y)=>{const f=h.useRef(null),o=F(M=>M.scene),m=F(M=>M.gl),b=h.useRef(null);t=t*(Array.isArray(n)?n[0]:n||1),i=i*(Array.isArray(n)?n[1]:n||1);const[k,X,Y,j,B,T,S]=h.useMemo(()=>{const M=new z(v,v),_=new z(v,v);_.texture.generateMipmaps=M.texture.generateMipmaps=!1;const I=new ae(t,i).rotateX(Math.PI/2),$=new se(I),w=new oe;w.depthTest=w.depthWrite=!1,w.onBeforeCompile=D=>{D.uniforms={...D.uniforms,ucolor:{value:new le(x)}},D.fragmentShader=D.fragmentShader.replace("void main() {",`uniform vec3 ucolor;
           void main() {
          `),D.fragmentShader=D.fragmentShader.replace("vec4( vec3( 1.0 - fragCoordZ ), opacity );","vec4( ucolor * fragCoordZ * 2.0, ( 1.0 - fragCoordZ ) * 1.0 );")};const q=new E(be),G=new E(je);return G.depthTest=q.depthTest=!1,[M,I,w,$,q,G,_]},[v,t,i,n,x]),W=M=>{j.visible=!0,j.material=B,B.uniforms.tDiffuse.value=k.texture,B.uniforms.h.value=M*1/256,m.setRenderTarget(S),m.render(j,b.current),j.material=T,T.uniforms.tDiffuse.value=S.texture,T.uniforms.v.value=M*1/256,m.setRenderTarget(k),m.render(j,b.current),j.visible=!1};let R=0,C,O;return U(()=>{b.current&&(r===1/0||R<r)&&(R++,C=o.background,O=o.overrideMaterial,f.current.visible=!1,o.background=null,o.overrideMaterial=Y,m.setRenderTarget(k),m.render(o,b.current),W(l),g&&W(l*.4),m.setRenderTarget(null),f.current.visible=!0,o.overrideMaterial=O,o.background=C)}),h.useImperativeHandle(y,()=>f.current,[]),h.createElement("group",ue({"rotation-x":Math.PI/2},u,{ref:f}),h.createElement("mesh",{renderOrder:s,geometry:X,scale:[1,-1,1],rotation:[-Math.PI/2,0,0]},h.createElement("meshBasicMaterial",{transparent:!0,map:k.texture,opacity:e,depthWrite:p})),h.createElement("orthographicCamera",{ref:b,args:[-t/2,t/2,i/2,-i/2,c,d]}))});function Ue(n){const{scene:r}=V("/models/robot.glb"),e=ce.useMemo(()=>ge.clone(r),[r]),{nodes:t,materials:i}=fe(e);return a.jsx("group",{...n,dispose:null,children:a.jsx("group",{scale:.01,children:a.jsxs("group",{position:[0,87.468,0],rotation:[-Math.PI/2,0,0],scale:51.68,children:[a.jsx("primitive",{object:t._rootJoint}),a.jsx("skinnedMesh",{geometry:t.Object_7.geometry,material:i["Material.001"],skeleton:t.Object_7.skeleton}),a.jsx("skinnedMesh",{geometry:t.Object_9.geometry,material:i["Material.004"],skeleton:t.Object_9.skeleton}),a.jsx("skinnedMesh",{geometry:t.Object_11.geometry,material:i["Material.003"],skeleton:t.Object_11.skeleton}),a.jsx("skinnedMesh",{geometry:t.Object_13.geometry,material:i["Material.002"],skeleton:t.Object_13.skeleton})]})})})}V.preload("/models/robot.glb");function ke({progressRef:n}){const{camera:r}=F();return U(()=>{const e=n.current.value;let t=0,i=.5,l=16;if(e<=1)t=Math.sin(e*.5)*5,i=1+e*1.5,l=16-e*3;else if(e<=2.5){const c=(e-1)*1.5;t=Math.sin(.5+c)*8,i=2.5-(e-1)*.5,l=13-(e-1)*2}else if(e<=3.5){const c=e-2.5;t=Math.sin(.5+1.5*1.5)*8*(1-c)+2*c,i=1.75-c*.75,l=10-c*3}else{const c=Math.min(1,(e-3.5)*2);t=2*(1-c)+0,i=1-c*1.8,l=7-c*3.5}r.position.x+=(t-r.position.x)*.03,r.position.y+=(i-r.position.y)*.03,r.position.z+=(l-r.position.z)*.03,r.lookAt(0,.5,0)}),null}function we(){return a.jsxs("group",{children:[a.jsxs("mesh",{rotation:[-Math.PI/2,0,0],position:[0,-3.5,0],children:[a.jsx("planeGeometry",{args:[60,60,40,40]}),a.jsx("meshBasicMaterial",{color:"#00f0ff",wireframe:!0,transparent:!0,opacity:.06})]}),a.jsxs("mesh",{rotation:[-Math.PI/2,0,0],position:[0,-3.49,0],children:[a.jsx("circleGeometry",{args:[4,32]}),a.jsx("meshBasicMaterial",{color:"#00f0ff",transparent:!0,opacity:.05})]})]})}function Pe({progressRef:n}){const r=h.useRef(null);return U(e=>{const t=n.current.value;if(r.current){r.current.position.y=-2+Math.sin(e.clock.elapsedTime*1.5)*4;const i=t>1.5&&t<3.8?.6:0,l=r.current.material;l.opacity+=(i-l.opacity)*.1,r.current.rotation.z+=.02}}),a.jsxs("mesh",{ref:r,rotation:[-Math.PI/2,0,0],children:[a.jsx("ringGeometry",{args:[2.5,2.6,64]}),a.jsx("meshBasicMaterial",{color:"#00ff88",side:me,transparent:!0,opacity:0,blending:Q})]})}function Be(){const r=new Float32Array(450);for(let i=0;i<150;i++)r[i*3]=(Math.random()-.5)*25,r[i*3+1]=(Math.random()-.5)*15,r[i*3+2]=(Math.random()-.5)*25;const e=new de;e.setAttribute("position",new xe(r,3));const t=h.useRef(null);return U(i=>{t.current&&(t.current.rotation.y=i.clock.elapsedTime*.01)}),a.jsx("points",{ref:t,geometry:e,children:a.jsx("pointsMaterial",{color:"#00f0ff",size:.06,transparent:!0,opacity:.4,blending:Q})})}function Te({progressRef:n}){const r=h.useRef(null);return U((e,t)=>{const i=n.current.value;r.current&&(r.current.position.y=-1.5+Math.sin(e.clock.elapsedTime*1.5)*.08,i>3.5?r.current.rotation.y=H.lerp(r.current.rotation.y,Math.sin(e.clock.elapsedTime*.5)*.3,.05):r.current.rotation.y=H.lerp(r.current.rotation.y,0,.05))}),a.jsxs("group",{ref:r,position:[0,-1.5,0],children:[a.jsx(Ue,{rotation:[Math.PI/2,0,0]}),a.jsx(De,{resolution:512,scale:10,blur:2,opacity:.5,far:5,color:"#000000"}),a.jsx("pointLight",{color:"#00f0ff",intensity:3,distance:4,position:[0,1.5,1]})]})}function Ae({progressRef:n}){return a.jsxs(a.Fragment,{children:[a.jsx("ambientLight",{intensity:.3,color:"#051020"}),a.jsx("directionalLight",{position:[5,10,5],intensity:.4,color:"#ffffff",castShadow:!0}),a.jsx("pointLight",{position:[-8,5,2],intensity:1.2,color:"#00f0ff"}),a.jsx("pointLight",{position:[8,-5,-2],intensity:.8,color:"#00ff88"}),a.jsx(ve,{preset:"studio",blur:.5}),a.jsx(we,{}),a.jsx(Pe,{progressRef:n}),a.jsx(Be,{}),a.jsx(ke,{progressRef:n}),a.jsx(Te,{progressRef:n})]})}function Se({progressRef:n}){return a.jsx(pe,{camera:{position:[0,.5,10],fov:50},gl:{alpha:!0,antialias:!0},children:a.jsx(Ae,{progressRef:n})})}export{Se as default};
