// 🎤 TALKING TOM VOICE SYSTEM
// Record user voice, pitch shift, play back with Buddy animation sync

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface VoiceRecorderProps {
  onPlayback?: () => void;
}

export function BuddyVoiceRecorder({ onPlayback }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecording, setHasRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [buddyMessage, setBuddyMessage] = useState("Click the mic to record your voice!");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<number | null>(null);

  // Buddy's funny responses
  const funnyResponses = [
    "Hehe! I sound funny!",
    "That's hilarious!",
    "Do I really sound like that?",
    "Let's do it again!",
    "You're so silly!",
    "I love your voice!",
    "That tickles my ears!",
    "Can we record more?",
  ];

  const jokes = [
    "Why did the bear bring a ladder? To reach the honey!",
    "What's a bear's favorite pasta? Fettucce-grr!",
    "How do bears stay cool? Bear conditioning!",
    "What do you call a bear with no teeth? A gummy bear!",
    "Why don't bears wear shoes? They have bear feet!",
  ];

  useEffect(() => {
    // Initialize audio context
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      setBuddyMessage("I'm listening! 👂");

      // Recording timer (max 10 seconds)
      timerRef.current = window.setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= 10) {
            stopRecording();
            return 10;
          }
          return prev + 1;
        });
      }, 1000);

    } catch (error) {
      console.error('Error accessing microphone:', error);
      setBuddyMessage("Oops! I can't hear you. Check microphone permissions!");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setHasRecording(true);
      setBuddyMessage("Got it! Let me play it back in my voice!");
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const playRecording = async () => {
    if (!hasRecording || audioChunksRef.current.length === 0) return;

    setIsPlaying(true);
    setBuddyMessage(funnyResponses[Math.floor(Math.random() * funnyResponses.length)]);
    
    if (onPlayback) onPlayback();

    try {
      // Create audio blob
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      const arrayBuffer = await audioBlob.arrayBuffer();
      
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const audioContext = audioContextRef.current;
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

      // Create source
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;

      // PITCH SHIFT (Talking Tom effect!)
      // Increase playback rate to 1.7x for chipmunk voice
      source.playbackRate.value = 1.7;

      // Add some reverb for fun
      const convolver = audioContext.createConvolver();
      const impulseLength = audioContext.sampleRate * 0.5;
      const impulse = audioContext.createBuffer(2, impulseLength, audioContext.sampleRate);
      for (let channel = 0; channel < impulse.numberOfChannels; channel++) {
        const channelData = impulse.getChannelData(channel);
        for (let i = 0; i < impulseLength; i++) {
          channelData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (impulseLength * 0.3));
        }
      }
      convolver.buffer = impulse;

      // Connect audio graph
      const dryGain = audioContext.createGain();
      const wetGain = audioContext.createGain();
      dryGain.gain.value = 0.8;
      wetGain.gain.value = 0.2;

      source.connect(dryGain);
      source.connect(convolver);
      convolver.connect(wetGain);
      
      dryGain.connect(audioContext.destination);
      wetGain.connect(audioContext.destination);

      // Play
      source.start(0);
      
      source.onended = () => {
        setIsPlaying(false);
        setBuddyMessage("That was fun! Want to record again?");
      };

    } catch (error) {
      console.error('Error playing recording:', error);
      setIsPlaying(false);
      setBuddyMessage("Oops! Something went wrong playing that back.");
    }
  };

  const clearRecording = () => {
    audioChunksRef.current = [];
    setHasRecording(false);
    setRecordingTime(0);
    setBuddyMessage("Click the mic to record your voice!");
  };

  const tellJoke = () => {
    const joke = jokes[Math.floor(Math.random() * jokes.length)];
    setBuddyMessage(joke);
    
    // Use speech synthesis for joke
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(joke);
      utterance.pitch = 1.3;
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl p-8 shadow-2xl max-w-2xl mx-auto"
    >
      {/* Buddy's Speech Bubble */}
      <motion.div
        key={buddyMessage}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl p-6 mb-8 shadow-lg relative"
      >
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[20px] border-t-white"></div>
        <p className="text-2xl text-gray-800 text-center font-medium leading-relaxed">
          {buddyMessage}
        </p>
      </motion.div>

      {/* Recording Controls */}
      <div className="flex flex-col items-center gap-6">
        
        {/* Main Action Button */}
        <div className="relative">
          <AnimatePresence>
            {isRecording && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute inset-0 -m-4"
              >
                <div className="w-full h-full rounded-full bg-red-500 opacity-20 animate-ping"></div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            onClick={isRecording ? stopRecording : startRecording}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isPlaying}
            className={`w-32 h-32 rounded-full shadow-2xl transition-all flex items-center justify-center ${
              isRecording
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-gradient-to-br from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
            } disabled:opacity-50`}
          >
            {isRecording ? (
              <div className="text-6xl">⏹️</div>
            ) : (
              <div className="text-6xl">🎤</div>
            )}
          </motion.button>
        </div>

        {/* Recording Timer */}
        {isRecording && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-3xl font-bold text-red-600"
          >
            {recordingTime}s / 10s
          </motion.div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 flex-wrap justify-center">
          
          {/* Play Button */}
          {hasRecording && !isRecording && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              onClick={playRecording}
              disabled={isPlaying}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white text-2xl font-bold rounded-2xl shadow-lg disabled:opacity-50 flex items-center gap-3"
            >
              {isPlaying ? (
                <>🔊 Playing...</>
              ) : (
                <>▶️ Play in Buddy's Voice</>
              )}
            </motion.button>
          )}

          {/* Clear Button */}
          {hasRecording && !isRecording && !isPlaying && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              onClick={clearRecording}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white text-2xl font-bold rounded-2xl shadow-lg"
            >
              🗑️ Clear
            </motion.button>
          )}

          {/* Joke Button */}
          {!isRecording && !isPlaying && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              onClick={tellJoke}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white text-2xl font-bold rounded-2xl shadow-lg"
            >
              😂 Tell Me a Joke!
            </motion.button>
          )}
        </div>

        {/* Instructions */}
        <div className="text-center text-gray-600 mt-4">
          <p className="text-lg">
            🎙️ Record your voice, and I'll repeat it in a silly voice!
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// Hook for easy integration
export function useVoiceRecording() {
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported(
      'mediaDevices' in navigator &&
      'getUserMedia' in navigator.mediaDevices &&
      'AudioContext' in window
    );
  }, []);

  return { isSupported };
}
