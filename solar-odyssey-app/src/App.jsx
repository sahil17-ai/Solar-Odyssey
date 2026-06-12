import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars, OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import SolarSystem from './components/SolarSystem';
import Sidebar from './components/Sidebar';
import BottomPanels from './components/BottomPanels';
import AIAssistant from './components/AIAssistant';
import TimeControl from './components/TimeControl';
import SpaceDust from './components/SpaceDust';
import Spaceship from './components/Spaceship';
import MarsSurface from './components/MarsSurface';
import CinematicIntro from './components/CinematicIntro';
import IntroSequence from './components/IntroSequence';

function App() {
  const [selectedBody, setSelectedBody] = useState(null);
  const [timeScale, setTimeScale] = useState(1);
  const [audioMuted, setAudioMuted] = useState(true);
  const [isFlightMode, setIsFlightMode] = useState(false);
  const [isMarsLanding, setIsMarsLanding] = useState(false);
  const [isIntroRunning, setIsIntroRunning] = useState(true);

  return (
    <>
      <div className="canvas-container">
        <Canvas 
          shadows
          gl={{ logarithmicDepthBuffer: true, antialias: true }}
          camera={{ position: [0, 600, 1000], fov: 45 }}
        >
          <color attach="background" args={['#000000']} />
          <ambientLight intensity={0.8} />
          
          {!isMarsLanding && (
            <>
              <SpaceDust timeScale={timeScale} />
              <Stars radius={2000} depth={1000} count={15000} factor={8} saturation={0.5} fade speed={0.2} />
              <SolarSystem selectedBody={selectedBody} setSelectedBody={setSelectedBody} timeScale={timeScale} isFlightMode={isFlightMode} />
              <Spaceship isActive={isFlightMode} />
            </>
          )}

          {isIntroRunning && <CinematicIntro onComplete={() => setIsIntroRunning(false)} />}

          <MarsSurface isActive={isMarsLanding} onClose={() => setIsMarsLanding(false)} />
          
          <EffectComposer disableNormalPass>
            <Bloom luminanceThreshold={0.5} mipmapBlur intensity={2.0} />
            <Noise opacity={0.05} blendFunction={BlendFunction.OVERLAY} />
            <Vignette offset={0.1} darkness={0.7} />
            <ChromaticAberration offset={[0.0005, 0.0005]} />
          </EffectComposer>

          {(!isFlightMode && !isMarsLanding && !isIntroRunning) && (
            <OrbitControls makeDefault enablePan={true} enableZoom={true} enableRotate={true} maxDistance={5000} />
          )}
        </Canvas>
      </div>
      
      <audio 
        src="https://cdn.pixabay.com/download/audio/2022/02/10/audio_51cbfa7a26.mp3?filename=deep-space-114421.mp3" 
        autoPlay 
        loop 
        muted={audioMuted} 
      />

      {isIntroRunning && <IntroSequence onSkip={() => setIsIntroRunning(false)} />}

      <div className="dashboard-container" style={{ display: isIntroRunning ? 'none' : 'flex' }}>
        {!isMarsLanding && <TimeControl timeScale={timeScale} setTimeScale={setTimeScale} />}
        
        <Sidebar 
          selectedBody={selectedBody} 
          setSelectedBody={setSelectedBody} 
          audioMuted={audioMuted} 
          setAudioMuted={setAudioMuted}
          isFlightMode={isFlightMode}
          setIsFlightMode={setIsFlightMode}
          isMarsLanding={isMarsLanding}
          setIsMarsLanding={setIsMarsLanding}
        />
        
        {(selectedBody && !isMarsLanding && !isFlightMode) && (
          <BottomPanels selectedBody={selectedBody} />
        )}
      </div>

      {!isIntroRunning && <AIAssistant selectedBody={selectedBody} />}
    </>
  );
}

export default App;
