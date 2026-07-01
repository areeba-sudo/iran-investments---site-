// Ported verbatim from iran_investments_with_globe.html (initWhy3D)
export function initWhy3D(){
  if(typeof THREE==='undefined') return;
  const container=document.getElementById('why3d');
  if(!container) return;
  const W=container.offsetWidth||window.innerWidth*0.55;
  const H=container.offsetHeight||600;
  const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true});
  renderer.setSize(W,H);renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));renderer.setClearColor(0,0);
  renderer.domElement.style.cssText='width:100%;height:100%;display:block;';
  container.appendChild(renderer.domElement);
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(45,W/H,0.1,50);
  camera.position.z=6;
  const g=new THREE.Group();scene.add(g);
  g.add(new THREE.Mesh(new THREE.IcosahedronGeometry(2.2,2),new THREE.MeshBasicMaterial({color:0x3d0d6b,wireframe:true,transparent:true,opacity:0.45})));
  const inner=new THREE.Mesh(new THREE.OctahedronGeometry(1.2,0),new THREE.MeshBasicMaterial({color:0xeb5e3e,wireframe:true,transparent:true,opacity:0.55}));
  g.add(inner);
  g.add(new THREE.Mesh(new THREE.IcosahedronGeometry(0.5,1),new THREE.MeshBasicMaterial({color:0xbdd5a6,wireframe:true,transparent:true,opacity:0.7})));
  const t2=new THREE.Mesh(new THREE.TorusGeometry(2.8,0.018,8,64),new THREE.MeshBasicMaterial({color:0xbdd5a6,transparent:true,opacity:0.18}));
  t2.rotation.x=Math.PI/4;g.add(t2);
  let tf=0;
  (function anim(){
    tf+=0.005;
    g.rotation.y=tf*0.3;g.rotation.x=Math.sin(tf*0.2)*0.12;
    inner.rotation.x=tf*0.6;inner.rotation.z=tf*0.4;
    t2.rotation.z=tf*0.15;
    renderer.render(scene,camera);requestAnimationFrame(anim);
  })();
}
