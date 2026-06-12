import React, { useEffect, useState, useRef } from 'react';

const AIAssistant = ({ selectedBody, setSelectedBody }) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      speak("Voice Control online. Say the name of a planet or celestial body to initiate warp sequence.");
    }, 2000);

    // Initialize Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const lastResultIndex = event.results.length - 1;
        const transcript = event.results[lastResultIndex][0].transcript.toLowerCase();
        console.log("Heard:", transcript);

        const bodies = ['sun', 'mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto', 'black hole'];
        for (let body of bodies) {
          if (transcript.includes(body)) {
            let targetName = body.charAt(0).toUpperCase() + body.slice(1);
            if (body === 'black hole') targetName = 'Black Hole';
            speak(`Initiating warp sequence to ${targetName}.`);
            setSelectedBody(targetName);
            break;
          }
        }
      };

      recognition.onerror = (e) => console.error("Speech Recognition Error:", e);
      recognitionRef.current = recognition;
    }
  }, [setSelectedBody]);

  useEffect(() => {
    if (!selectedBody) return;
    
    let message = "";
    switch(selectedBody) {
      case 'Sun': 
        message = "The Sun. A massive G-type main-sequence star located at the center of the Solar System. It accounts for 99.86 percent of the total mass of the Solar System. Its core temperature reaches a staggering 15 million degrees Celsius, where nuclear fusion converts hydrogen into helium, releasing the immense energy that sustains life on Earth."; 
        break;
      case 'Mercury': 
        message = "Mercury. The smallest planet in the Solar System and the closest to the Sun. It lacks any substantial atmosphere to retain heat, resulting in the most extreme temperature fluctuations in the solar system, ranging from 430 degrees Celsius during the day to minus 180 degrees Celsius at night. Its surface is heavily cratered, resembling Earth's Moon."; 
        break;
      case 'Venus': 
        message = "Venus. Often called Earth's twin due to its similar size and mass. However, it is a hellish world with a crushing carbon dioxide atmosphere and clouds of sulfuric acid. The extreme greenhouse effect makes it the hottest planet in our solar system, with surface temperatures hot enough to melt lead."; 
        break;
      case 'Earth': 
        message = "Earth. Our home world. It is the only astronomical object known to harbor life. Approximately 71 percent of Earth's surface is covered by liquid water oceans. The atmosphere, composed primarily of nitrogen and oxygen, protects the surface from meteoroids and radiation while regulating the climate."; 
        break;
      case 'Mars': 
        message = "Mars. The Red Planet. It appears red due to iron oxide, or rust, on its surface. Mars is home to Olympus Mons, the tallest volcano in the solar system, and Valles Marineris, one of the largest canyons. We have deployed multiple rovers here to search for signs of ancient microbial life in its dry lake beds."; 
        break;
      case 'Jupiter': 
        message = "Jupiter. The largest planet in the solar system. It is a gas giant primarily composed of hydrogen and helium. Its most famous feature is the Great Red Spot, an ancient anticyclonic storm larger than Earth itself. Jupiter also possesses an incredibly strong magnetic field and dozens of moons, including Europa, which may harbor a subsurface ocean."; 
        break;
      case 'Saturn': 
        message = "Saturn. The sixth planet from the Sun, instantly recognizable by its magnificent ring system made mostly of ice particles with a smaller amount of rocky debris and dust. It is a gas giant with an average density so incredibly low that it could float in water if a bathtub large enough existed."; 
        break;
      case 'Uranus': 
        message = "Uranus. An ice giant with a pale cyan hue caused by methane in its atmosphere. Uniquely, Uranus rotates on its side, an extreme axial tilt likely caused by a massive collision early in the solar system's history. It features the coldest planetary atmosphere in the solar system."; 
        break;
      case 'Neptune': 
        message = "Neptune. The eighth and farthest known planet from the Sun. It is an ice giant characterized by a deep azure color. Neptune experiences the strongest winds in the solar system, with supersonic storms reaching speeds of over 2000 kilometers per hour. It was the first planet located through mathematical predictions rather than empirical observation."; 
        break;
      case 'Pluto (Dwarf Planet)':
      case 'Pluto':
        message = "Pluto. A prominent dwarf planet located in the Kuiper belt. Once considered the ninth planet, it features a complex geology with massive glaciers made of nitrogen ice and towering mountains made of solid water ice. Its largest moon, Charon, is so large that the two bodies orbit a common center of mass outside of Pluto.";
        break;
      case 'Black Hole':
        message = "A Supermassive Black Hole. An astronomical region of spacetime where gravity is so intense that nothing, not even light, can escape from it. You are currently observing the glowing accretion disk of superheated plasma spiraling into the event horizon at a fraction of the speed of light. The immense gravity causes severe gravitational lensing, warping the light of stars behind it.";
        break;
      default: 
        message = `Analyzing data for ${selectedBody}.`;
    }
    
    speak(message);
  }, [selectedBody]);

  const speak = (text) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 0.8;
    // Attempt to use a natural sounding voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.lang === 'en-US' && v.name.includes('Google'));
    if (preferredVoice) utterance.voice = preferredVoice;
    
    window.speechSynthesis.speak(utterance);
  };

  const toggleMic = () => {
    if (!recognitionRef.current) return alert("Speech recognition not supported in this browser.");
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <div style={{ position: 'absolute', bottom: '40px', left: '280px', zIndex: 100 }}>
      <button 
        onClick={toggleMic}
        style={{
          background: isListening ? 'rgba(255, 0, 50, 0.3)' : 'rgba(0, 255, 204, 0.1)',
          border: `1px solid ${isListening ? '#ff0033' : '#00ffcc'}`,
          color: isListening ? '#ff0033' : '#00ffcc',
          padding: '10px 20px',
          borderRadius: '20px',
          cursor: 'pointer',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}
      >
        <div style={{ 
          width: '10px', 
          height: '10px', 
          borderRadius: '50%', 
          background: 'currentColor',
          boxShadow: isListening ? '0 0 10px currentColor' : 'none',
          animation: isListening ? 'pulse 1s infinite' : 'none'
        }}></div>
        {isListening ? 'LISTENING... (SAY A PLANET NAME)' : 'ENABLE VOICE CONTROL'}
      </button>
    </div>
  );
};

export default AIAssistant;
