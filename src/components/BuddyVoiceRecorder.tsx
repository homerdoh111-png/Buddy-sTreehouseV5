import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef } from 'react';

export default function BuddyVoiceRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);

      // Auto-stop after 10 seconds
      setTimeout(() => {
        if (mediaRecorder.state === 'recording') {
          mediaRecorder.stop();
          setIsRecording(false);
        }
      }, 10000);
    } catch {
      alert('Please allow microphone access to use the voice recorder!');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const playRecording = () => {
    if (audioUrl) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      audio.onended = () => setIsPlaying(false);
      audio.play();
      setIsPlaying(true);
    }
  };

  const deleteRecording = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioUrl(null);
    setIsPlaying(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl max-w-sm mx-auto"
    >
      <h3 className="font-buddy text-xl text-treehouse-bark text-center mb-4">
        🎤 Buddy's Voice Recorder
      </h3>
      <p className="font-body text-sm text-gray-600 text-center mb-4">
        Record your voice and hear it played back!
      </p>

      <div className="flex justify-center gap-3">
        {!isRecording && !audioUrl && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startRecording}
            className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-buddy rounded-full shadow-lg flex items-center gap-2"
          >
            <span className="text-xl">🎙️</span> Record
          </motion.button>
        )}

        <AnimatePresence>
          {isRecording && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              whileTap={{ scale: 0.95 }}
              onClick={stopRecording}
              className="px-6 py-3 bg-gray-700 text-white font-buddy rounded-full shadow-lg flex items-center gap-2"
            >
              <motion.span
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="inline-block w-3 h-3 bg-red-500 rounded-full"
              />
              Stop
            </motion.button>
          )}
        </AnimatePresence>

        {audioUrl && !isRecording && (
          <>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={playRecording}
              disabled={isPlaying}
              className="px-5 py-3 bg-treehouse-green hover:bg-green-600 text-white font-buddy rounded-full shadow-lg disabled:opacity-50"
            >
              {isPlaying ? '🔊 Playing...' : '▶️ Play'}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startRecording}
              className="px-5 py-3 bg-blue-500 hover:bg-blue-600 text-white font-buddy rounded-full shadow-lg"
            >
              🔄 New
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={deleteRecording}
              className="px-5 py-3 bg-red-400 hover:bg-red-500 text-white font-buddy rounded-full shadow-lg"
            >
              🗑️
            </motion.button>
          </>
        )}
      </div>

      {isRecording && (
        <motion.div
          className="mt-4 flex justify-center gap-1"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="w-2 bg-red-500 rounded-full"
              animate={{ height: [8, 24, 8] }}
              transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
            />
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
