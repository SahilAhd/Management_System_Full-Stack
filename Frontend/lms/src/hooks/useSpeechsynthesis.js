// LMS/frontend/src/hooks/useSpeechSynthesis.js
import { useState, useEffect, useCallback, useRef } from 'react';

export const useSpeechSynthesis = () => {
  const [speaking, setSpeaking] = useState(false); // State to track if speech is active
  const [voices, setVoices] = useState([]); // Available voices on the user's system
  const synthRef = useRef(window.speechSynthesis); // Reference to the SpeechSynthesis API

  useEffect(() => {
    // Function to populate the list of available voices
    const populateVoices = () => {
      setVoices(synthRef.current.getVoices());
    };

    // Event listener for when voices are loaded/changed in the browser
    if (synthRef.current.onvoiceschanged !== undefined) {
      synthRef.current.onvoiceschanged = populateVoices;
    }
    populateVoices(); // Call once initially to get voices that might already be loaded

    // Cleanup function for the effect
    return () => {
      if (synthRef.current.onvoiceschanged !== undefined) {
        synthRef.current.onvoiceschanged = null; // Remove the event listener
      }
    };
  }, []); // Empty dependency array means this effect runs once on mount

  // Function to speak the given text
  const speak = useCallback((text, voiceName = 'Google US English', onEndCallback) => {
    if (!text || speaking) return; // Don't speak if no text or already speaking

    const utterance = new SpeechSynthesisUtterance(text); // Create a new utterance object
    // Try to find a specific voice, otherwise use browser default
    const selectedVoice = voices.find(voice => voice.name === voiceName);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    } else {
      console.warn(`Voice "${voiceName}" not found, using default.`);
    }

    // Set event handlers for the utterance
    utterance.onstart = () => setSpeaking(true); // Set speaking state when speech starts
    utterance.onend = () => {
      setSpeaking(false); // Clear speaking state when speech ends
      if (onEndCallback) onEndCallback(); // Call the provided callback if any
    };
    utterance.onerror = (event) => {
      console.error('SpeechSynthesis Utterance Error:', event.error);
      setSpeaking(false); // Clear speaking state on error
      if (onEndCallback) onEndCallback(); // Call callback even on error to reset state
    };

    synthRef.current.speak(utterance); // Start speaking
  }, [speaking, voices]); // Dependencies for useCallback: re-create `speak` if `speaking` or `voices` change

  // Function to stop current speech
  const stop = useCallback(() => {
    if (synthRef.current.speaking) {
      synthRef.current.cancel(); // Stop all speech synthesis
      setSpeaking(false);
    }
  }, []);

  return { speak, stop, speaking, voices }; // Return control functions and states
};