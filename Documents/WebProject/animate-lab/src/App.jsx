import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import { LogIn, Play, Pause, LogOut, Info, X } from 'lucide-react';

// --- CONFIG: Rokoko FBX files with Thai dance information ---
const ROKOKO_ANIMATIONS = [
  { 
    name: 'ท่าพรหมสี่หน้า', 
    url: import.meta.env.BASE_URL + 'animations/cut1.fbx', 
    thumb: import.meta.env.BASE_URL + '/thumbnails/phrom.jpg',
    info: {
      title: 'ท่าพรหมสี่หน้า (Phrom Si Na - Four-Faced Brahma)',
      origin: 'ต้นกำเนิดจากพระพรหม เทพเจ้าแห่งการสร้างสรรค์ในศาสนาฮินดู',
      description: 'ท่ารำที่สื่อถึงความศักดิ์สิทธิ์และความเมตตาของพระพรหม นิยมใช้ในพิธีบูชาและพิธีเปิด ท่วงท่าสง่าและช้า เหมาะสำหรับแสดงความเคารพ',
      significance: 'ใช้ในพิธีกรรมศักดิ์สิทธิ์และการแสดงนาฏศิลป์ไทยชั้นสูง แสดงถึงความเคารพต่อเทพเจ้าและความสมบูรณ์แบบของจักรวาล'
    }
  },
  { 
    name: 'ท่าสอดสร้อยมาลา', 
    url: import.meta.env.BASE_URL + '/animations/cut2.fbx', 
    thumb: import.meta.env.BASE_URL + '/thumbnails/sotsoi.jpg',
    info: {
      title: 'ท่าสอดสร้อยมาลา (Sot Soi Mala - Threading the Garland)',
      origin: 'มาจากการประดิษฐ์มาลัยดอกไม้ซึ่งเป็นศิลปะไทยโบราณ',
      description: 'ท่ารำเลียนแบบการร้อยมาลัย แสดงความอ่อนช้อยและประณีต มักพบในการรำรำวงหรือการแสดงที่เน้นความละเมียดละไม',
      significance: 'สะท้อนวิถีชีวิตไทยและความเป็นหญิงที่อ่อนช้อย แสดงถึงความละเอียดอ่อนและความงามตามธรรมชาติ'
    }
  },
  { 
    name: 'ท่าเฉิดฉิน', 
    url: import.meta.env.BASE_URL + '/animations/cut3.fbx', 
    thumb: import.meta.env.BASE_URL + '/thumbnails/sotsoi.jpg',
    info: {
      title: 'ท่าเฉิดฉิน (Choet Chin - Sparkling Brilliance)',
      origin: 'ได้รับแรงบันดาลใจจากแสงแวววาวของเครื่องประดับและทองคำ',
      description: 'ท่าที่เน้นความเปล่งประกายและความสง่างาม โฟกัสที่เส้นแขนและการจัดวางศีรษะ เหมาะกับการแสดงที่ต้องการความหรูหราและคล่องแคล่ว',
      significance: 'แสดงถึงความมั่งคั่ง ความสง่างาม และความเป็นเลิศของศิลปะการแสดงไทย'
    }
  },
  { 
    name: 'ท่ากวางเดินดง', 
    url: import.meta.env.BASE_URL + '/animations/cut4.fbx', 
    thumb: import.meta.env.BASE_URL + '/thumbnails/sotsoi.jpg',
    info: {
      title: 'ท่ากวางเดินดง (Kwang Doen Dong - Deer Walking in Forest)',
      origin: 'ได้แรงบันดาลใจจากธรรมชาติและสัตว์ป่าในวรรณคดีไทย',
      description: 'ท่าที่เลียนแบบการเดินของกวาง ให้ความรู้สึกสง่างามและเป็นธรรมชาติ เหมาะกับการสื่อถึงความกลมกลืนกับธรรมชาติ',
      significance: 'แสดงถึงความเชื่อมโยงระหว่างมนุษย์กับธรรมชาติ และความงามของสัตว์ป่าในวัฒนธรรมไทย'
    }
  }, 
  { 
    name: 'ท่าแขกเต้า', 
    url: import.meta.env.BASE_URL + '/animations/cut5.fbx', 
    thumb: import.meta.env.BASE_URL + '/thumbnails/sotsoi.jpg',
    info: {
      title: 'ท่าแขกเต้า (Khaek Tao)',
      origin: 'ท่ารำที่ประกอบด้วยสองจังหวะสลับซ้าย–ขวา แสดงความเป็นมิตรและจังหวะโต้ตอบของร่างกายส่วนบน',
      description: 'ท่าแขกเต้าเป็นท่ารำที่อ่อนช้อยและประณีต สื่อถึงความอ่อนโยน และความประสานของการเคลื่อนไหวระหว่างสองด้านของร่างกาย',
      significance: 'แสดงถึงความเชื่อมโยงระหว่างมนุษย์กับธรรมชาติ และความงามของสัตว์ป่าในวัฒนธรรมไทย'
    }
  }
];

// Main App Component
export default function RokokoViewerApp() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  return (
    <div className="min-h-screen bg-gray-900">
      {!isLoggedIn ? (
        <LoginPage onLogin={(user) => {
          setUsername(user);
          setIsLoggedIn(true);
        }} />
      ) : (
        <ViewerPage username={username} onLogout={() => setIsLoggedIn(false)} />
      )}
    </div>
  );
}

// Login Page Component
function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    if (email && password) onLogin(email);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-md border border-gray-700">
        <h1 className="text-3xl font-bold text-white text-center mb-2">SITA</h1>
        <p className="text-gray-400 text-center mb-8">THAI HERITAGE ANIMATION</p>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter your password"
            />
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition duration-200 flex items-center justify-center gap-2"
          >
            <LogIn size={20} />
            Sign In
          </button>
        </div>

        <p className="text-gray-400 text-center mt-6 text-sm">Use any credentials to login</p>
      </div>
    </div>
  );
}

// Viewer Page
function ViewerPage({ username, onLogout }) {
  const [selectedAnimation, setSelectedAnimation] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [modelInfo, setModelInfo] = useState({ vertices: 0, animations: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  // Only keep brightness (exposure)
  const [exposure, setExposure] = useState(1.0); // default exposure

  const viewerRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    viewerRef.current = new RokokoViewerEngine(canvasRef.current, {
      onModelLoad: (info) => setModelInfo(info),
      onAnimationChange: (playing) => setIsPlaying(playing),
      onLoadingChange: (loading) => setIsLoading(loading)
    });

    // initial exposure
    viewerRef.current.setExposure(exposure);

    return () => {
      if (viewerRef.current) viewerRef.current.dispose();
    };
  }, []); // run once

  // sync exposure when slider changes
  useEffect(() => {
    if (viewerRef.current) viewerRef.current.setExposure(exposure);
  }, [exposure]);

  const handleSelectAnimation = async (anim) => {
    if (isLoading) return;
    
    setSelectedAnimation(anim);
    setIsLoading(true);
    setShowInfo(false);
    
    try {
      await viewerRef.current.loadCompleteFBX(anim.url);
      setIsPlaying(true);
    } catch (err) {
      console.error('Failed to load FBX:', err);
      alert('Failed to load animation: ' + (err.message || err));
      setSelectedAnimation(null);
      setIsPlaying(false);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePlayPause = () => {
    if (viewerRef.current && selectedAnimation) {
      viewerRef.current.toggleAnimation();
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Thai Heritage Dance Viewer</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-300">{username}</span>
          <button onClick={onLogout} className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition">
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* LEFT SIDEBAR: Animation List */}
        <aside className="w-2/5 bg-gray-800 border-r border-gray-700 flex flex-col overflow-y-auto">
          <div className="p-4 border-b border-gray-700">
            <h2 className="text-lg font-semibold text-white mb-3">Thai Heritage Animations</h2>
            <p className="text-sm text-gray-400 mb-4">Click to load animation</p>

            <div className="grid grid-cols-1 gap-3">
              {ROKOKO_ANIMATIONS.map((anim) => (
                <AnimCard
                  key={anim.name}
                  anim={anim}
                  selected={selectedAnimation?.name === anim.name}
                  onSelect={() => handleSelectAnimation(anim)}
                  disabled={isLoading}
                />
              ))}
            </div>
          </div>
        </aside>

        {/* RIGHT: 3D VIEW (simplified toolbar — only brightness kept) */}
        <main className="flex-1 flex flex-col bg-gray-900 relative">
          <div className="bg-gray-800 border-b border-gray-700 px-6 py-3 flex items-center gap-4">
            <button
              onClick={togglePlayPause}
              disabled={!selectedAnimation || isLoading}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                selectedAnimation && !isLoading
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} />}
              {isPlaying ? 'Pause' : 'Play'}
            </button>

            <button
              onClick={() => setShowInfo(!showInfo)}
              disabled={!selectedAnimation || isLoading}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                selectedAnimation && !isLoading
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Info size={18} />
              Info
            </button>

            {/* Brightness slider (kept) */}
            <div className="ml-4 flex items-center gap-3">
              <label className="text-xs text-gray-300">Brightness</label>
              <input
                type="range"
                min="0.3"
                max="2.0"
                step="0.05"
                value={exposure}
                onChange={(e) => setExposure(parseFloat(e.target.value))}
                className="w-40"
                aria-label="Brightness"
              />
            </div>

            {isLoading && (
              <span className="text-yellow-400">Loading...</span>
            )}

            {selectedAnimation && !isLoading && (
              <span className="text-gray-300">
                Current: <span className="text-purple-400 font-medium">{selectedAnimation.name}</span>
              </span>
            )}

            {modelInfo.vertices > 0 && (
              <span className="text-gray-400 text-sm ml-auto">
                {modelInfo.vertices.toLocaleString()} vertices
              </span>
            )}
          </div>

          <div className="flex-1 relative">
            <div ref={canvasRef} className="w-full h-full" />
            
            {!selectedAnimation && !isLoading && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <div className="text-gray-600 text-6xl mb-4">🎭</div>
                  <p className="text-gray-500 text-lg">Select an animation to begin</p>
                </div>
              </div>
            )}

            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-gray-900 bg-opacity-50">
                <div className="text-center">
                  <div className="animate-spin text-purple-500 text-6xl mb-4">⚙️</div>
                  <p className="text-gray-300 text-lg">Loading animation...</p>
                </div>
              </div>
            )}

            {/* Info Panel */}
            {showInfo && selectedAnimation && (
              <div className="absolute top-4 right-4 bg-gray-800 bg-opacity-95 rounded-lg shadow-2xl border border-gray-700 max-w-md max-h-[80vh] overflow-y-auto">
                <div className="sticky top-0 bg-gray-800 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">Dance Information</h3>
                  <button 
                    onClick={() => setShowInfo(false)}
                    className="text-gray-400 hover:text-white transition"
                  >
                    <X size={24} />
                  </button>
                </div>
                
                <div className="p-6 space-y-4">
                  <div>
                    <h4 className="text-lg font-semibold text-purple-400 mb-2">
                      {selectedAnimation.info.title}
                    </h4>
                  </div>

                  <div>
                    <h5 className="text-sm font-semibold text-gray-300 mb-1">Origin (ต้นกำเนิด)</h5>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {selectedAnimation.info.origin}
                    </p>
                  </div>

                  <div>
                    <h5 className="text-sm font-semibold text-gray-300 mb-1">Description (รายละเอียด)</h5>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {selectedAnimation.info.description}
                    </p>
                  </div>

                  <div>
                    <h5 className="text-sm font-semibold text-gray-300 mb-1">Significance (ความสำคัญ)</h5>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {selectedAnimation.info.significance}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

// Animation Card Component
function AnimCard({ anim, selected, onSelect, disabled }) {
  const [imgError, setImgError] = useState(false);

  return (
    <button 
      onClick={onSelect} 
      disabled={disabled}
      className={`rounded-lg p-3 text-left transition transform ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02]'
      } ${selected ? 'ring-2 ring-purple-500 bg-gray-750' : 'bg-gray-700'}`}
    >
      <div className="flex gap-3">
        <div className="w-24 h-24 bg-gray-600 rounded-md overflow-hidden flex-shrink-0 flex items-center justify-center">
          {!imgError && anim.thumb ? (
            <img
              src={anim.thumb}
              alt={`${anim.name} thumbnail`}
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="text-gray-400 text-xs">No Image</div>
          )}
        </div>
        <div className="flex-1 flex flex-col justify-center">
          <div className="text-base text-gray-100 font-medium mb-1">
            {anim.name}
          </div>
          <div className="text-xs text-gray-400">
            {anim.info.title.split(' - ')[1] || 'Thai Heritage Dance'}
          </div>
        </div>
      </div>
    </button>
  );
}

// Rokoko Viewer Engine (improved lighting, exposure control, ground plane)
class RokokoViewerEngine {
  constructor(container, callbacks) {
    this.container = container;
    this.callbacks = callbacks;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.mixer = null;
    this.clock = new THREE.Clock();
    this.currentModel = null;
    this.currentAction = null;
    this.isPlaying = false;

    // lighting references
    this.keyLight = null;
    this.rimLight = null;
    this.hemiLight = null;
    this.ground = null;

    this.init();
    this.animate();
  }

  init() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x1a1a1a);

    this.camera = new THREE.PerspectiveCamera(
      45,
      (this.container?.clientWidth || window.innerWidth) / (this.container?.clientHeight || window.innerHeight),
      0.1,
      1000
    );
    this.camera.position.set(5, 5, 5);

    // Renderer with better tone mapping and preserve drawing buffer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    if (this.container) {
      this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
      this.container.appendChild(this.renderer.domElement);
    }
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = true;

    // Use ACESFilmic for smoother HDR-like rolloff
    if (THREE.ACESFilmicToneMapping) {
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 1.0;
    }

    if (THREE.SRGBColorSpace) {
      this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    }

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;

    // Improved lighting setup
    this.hemiLight = new THREE.HemisphereLight(0xddeeff, 0x444455, 0.7); // sky, ground, intensity
    this.scene.add(this.hemiLight);

    this.keyLight = new THREE.DirectionalLight(0xffffff, 1.6);
    this.keyLight.position.set(5, 8, 5);
    this.keyLight.castShadow = true;
    this.keyLight.shadow.mapSize.set(2048, 2048);
    this.keyLight.shadow.camera.left = -10;
    this.keyLight.shadow.camera.right = 10;
    this.keyLight.shadow.camera.top = 10;
    this.keyLight.shadow.camera.bottom = -10;
    this.scene.add(this.keyLight);

    // rim light to separate model from background
    this.rimLight = new THREE.DirectionalLight(0xffeedd, 0.9);
    this.rimLight.position.set(-6, 4, -6);
    this.scene.add(this.rimLight);

    // subtle fill
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.6);
    fillLight.position.set(-3, 2, 4);
    this.scene.add(fillLight);

    // Ground plane to catch light and provide visual reference
    const groundGeo = new THREE.PlaneGeometry(50, 50);
    const groundMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.85, metalness: 0.05 });
    this.ground = new THREE.Mesh(groundGeo, groundMat);
    this.ground.rotation.x = -Math.PI / 2;
    this.ground.position.y = -0.001;
    this.ground.receiveShadow = true;
    this.scene.add(this.ground);

    const gridHelper = new THREE.GridHelper(20, 20, 0x444444, 0x222222);
    this.scene.add(gridHelper);

    this.onWindowResizeBound = () => this.onWindowResize();
    window.addEventListener('resize', this.onWindowResizeBound);
  }

  // public: set exposure for renderer (brightness)
  setExposure(value) {
    if (this.renderer) {
      // toneMappingExposure exists on renderer
      this.renderer.toneMappingExposure = value;
    }
  }

  // public: set lighting presets (bright | balanced | cinematic)
  // kept for possible future use (not called in current UI)
  setLightingPreset(name) {
    if (!this.keyLight || !this.rimLight || !this.hemiLight) return;
    switch (name) {
      case 'bright':
        this.keyLight.intensity = 2.2;
        this.rimLight.intensity = 1.2;
        this.hemiLight.intensity = 0.9;
        this.ground.material.roughness = 0.9;
        break;
      case 'cinematic':
        this.keyLight.intensity = 1.1;
        this.rimLight.intensity = 1.1;
        this.hemiLight.intensity = 0.45;
        this.ground.material.roughness = 0.7;
        break;
      case 'balanced':
      default:
        this.keyLight.intensity = 1.6;
        this.rimLight.intensity = 0.9;
        this.hemiLight.intensity = 0.7;
        this.ground.material.roughness = 0.85;
        break;
    }
  }

  // kept for possible future use
  setBackgroundColor(hex) {
    if (this.scene) {
      try {
        this.scene.background = new THREE.Color(hex);
      } catch (e) {
        // ignore invalid colors
      }
    }
  }

  loadCompleteFBX(url) {
    this.callbacks.onLoadingChange(true);
    
    return new Promise((resolve, reject) => {
      const loader = new FBXLoader();
      const basePath = url.substring(0, url.lastIndexOf('/') + 1);
      loader.setResourcePath(basePath);
      
      loader.load(
        url,
        (object) => {
          try {
            if (this.currentModel) {
              this.scene.remove(this.currentModel);
            }
            
            if (this.mixer) {
              this.mixer.stopAllAction();
              this.mixer = null;
              this.currentAction = null;
            }

            const textureLoader = new THREE.TextureLoader();
            textureLoader.setPath(basePath);
            
            object.traverse((child) => {
              if (child.isMesh || child.isSkinnedMesh) {
                if (child.material) {
                  if (Array.isArray(child.material)) {
                    child.material = child.material.map(mat => this.fixMaterial(mat, textureLoader, basePath));
                  } else {
                    child.material = this.fixMaterial(child.material, textureLoader, basePath);
                  }
                } else {
                  child.material = new THREE.MeshStandardMaterial({ 
                    color: 0xcccccc,
                    roughness: 0.7, 
                    metalness: 0.1 
                  });
                }
                child.castShadow = true;
                child.receiveShadow = true;
              }
            });

            this.currentModel = object;
            this.centerAndScaleModel(object);
            this.scene.add(object);

            if (object.animations && object.animations.length > 0) {
              this.mixer = new THREE.AnimationMixer(object);
              const clip = object.animations[0];
              this.currentAction = this.mixer.clipAction(clip);
              this.currentAction.setLoop(THREE.LoopRepeat);
              this.currentAction.reset();
              this.currentAction.play();
              this.isPlaying = true;
              this.mixer.timeScale = 1;
            }

            let vertexCount = 0;
            object.traverse((child) => {
              if (child.isMesh && child.geometry?.attributes?.position) {
                vertexCount += child.geometry.attributes.position.count;
              }
            });

            this.callbacks.onModelLoad({ 
              vertices: vertexCount, 
              animations: object.animations?.length || 0 
            });
            
            this.callbacks.onAnimationChange(this.isPlaying);
            this.callbacks.onLoadingChange(false);
            resolve(object);
          } catch (err) {
            this.callbacks.onLoadingChange(false);
            reject(err);
          }
        },
        (xhr) => {
          if (xhr.lengthComputable) {
            const percentComplete = (xhr.loaded / xhr.total) * 100;
            console.log(`Loading: ${percentComplete.toFixed(0)}%`);
          }
        },
        (err) => {
          this.callbacks.onLoadingChange(false);
          reject(err);
        }
      );
    });
  }

  toggleAnimation() {
    if (!this.mixer || !this.currentAction) return;
    
    this.isPlaying = !this.isPlaying;
    
    if (this.isPlaying) {
      this.currentAction.paused = false;
      this.mixer.timeScale = 1;
    } else {
      this.currentAction.paused = true;
      this.mixer.timeScale = 0;
    }
    
    this.callbacks.onAnimationChange(this.isPlaying);
  }

  fixMaterial(material, textureLoader, basePath) {
    if (material.isMeshLambertMaterial || material.isMeshPhongMaterial) {
      const color = material.color ? material.color.clone() : new THREE.Color(0xcccccc);
      const newMaterial = new THREE.MeshStandardMaterial({ 
        color: color,
        roughness: 0.7, 
        metalness: 0.1,
        side: THREE.DoubleSide
      });
      
      if (material.map) {
        newMaterial.map = material.map;
        newMaterial.map.colorSpace = THREE.SRGBColorSpace;
        newMaterial.needsUpdate = true;
      }
      
      return newMaterial;
    }
    
    if (material.isMeshStandardMaterial) {
      material.side = THREE.DoubleSide;
      if (material.map) {
        material.map.colorSpace = THREE.SRGBColorSpace;
      }
      material.needsUpdate = true;
    }
    
    return material;
  }

  centerAndScaleModel(object) {
    const box = new THREE.Box3().setFromObject(object);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const scale = 3 / maxDim;
    object.scale.multiplyScalar(scale);

    box.setFromObject(object);
    const center = box.getCenter(new THREE.Vector3());

    object.position.x = -center.x;
    object.position.z = -center.z;
    object.position.y = -box.min.y;

    const distance = 3 * 2.5;
    this.camera.position.set(distance, distance, distance);
    this.controls.target.set(0, size.y * scale / 2, 0);
    this.controls.update();
  }

  onWindowResize() {
    if (!this.container) return;
    this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    const delta = this.clock.getDelta();
    
    if (this.mixer && this.isPlaying) {
      this.mixer.update(delta);
    }
    
    if (this.controls) this.controls.update();
    if (this.renderer && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  dispose() {
    if (this.mixer) {
      try { 
        this.mixer.stopAllAction(); 
      } catch (e) {}
    }
    if (this.renderer) {
      this.renderer.dispose();
      if (this.container && this.renderer.domElement) {
        this.container.removeChild(this.renderer.domElement);
      }
    }
    window.removeEventListener('resize', this.onWindowResizeBound);
  }
}
