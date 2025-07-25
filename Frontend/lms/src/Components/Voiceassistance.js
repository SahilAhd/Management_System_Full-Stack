// LMS/frontend/src/components/VoiceAssistant.js
import React, { useEffect, useCallback, useState, useRef } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { useSpeechSynthesis } from "../hooks/useSpeechsynthesis";
import { getAiResponse } from "../api/chatApi";

export default function VoiceAssistant() {
  console.log("--- VOICEASSISTANT COMPONENT: Final Continuous Listening Version ACTIVE ---"); // <--- CONFIRM THIS VERSION IS RUNNING

  const {
    transcript,
    resetTranscript,
    browserSupportsSpeechRecognition,
    finalTranscript,
    listening, // True if microphone is active
    browserSupportsContinuousListening,
    isMicrophoneAvailable,
  } = useSpeechRecognition();

  const [isProcessing, setIsProcessing] = useState(false); // AI is thinking/API call active
  const [conversationHistory, setConversationHistory] = useState([]);
  const { speak, speaking } = useSpeechSynthesis(); // AI is speaking
  const conversationLogRef = useRef(null);

  // --- REMOVED: isContinuousModeActiveRef - not needed with simplified continuous logic ---
  // const isContinuousModeActiveRef = useRef(false);
  // useEffect(() => {
  //     isContinuousModeActiveRef.current = listening;
  // }, [listening]);

  // --- REMOVED: recognitionInstanceRef - not needed without direct event listeners ---
  // const recognitionInstanceRef = useRef(null);


  useEffect(() => {
    if (conversationLogRef.current) {
      conversationLogRef.current.scrollTop = conversationLogRef.current.scrollHeight;
    }
  }, [conversationHistory]);


  // --- Speech Recognition Control Handlers ---

  const startListeningHandler = useCallback(() => {
    console.log("startListeningHandler called. Checking conditions...");
    if (!browserSupportsSpeechRecognition) { // <--- Correctly uses boolean from hook
      alert("Your browser does not support Speech Recognition. Please use Chrome or Edge for this feature.");
      return;
    }
    if (!browserSupportsContinuousListening) { // <--- Correctly uses boolean from hook
      alert("Your browser does not fully support continuous listening. The microphone might turn off after a short pause. You may need to click 'Talk to LMS' again.");
    }
    if (!isMicrophoneAvailable) { // <--- Correctly uses boolean from hook
      alert("Microphone is not available or not granted permission. Please check your system and browser settings.");
      return;
    }
    // Prevent starting if already processing or speaking (good UX)
    if (isProcessing || speaking) {
        console.log("startListeningHandler: Blocked by isProcessing or speaking state. Ignoring click.");
        return;
    }

    console.log("startListeningHandler: Attempting to start listening continuously...");
    resetTranscript(); // Clear any previous transcript for a fresh start
    SpeechRecognition.startListening({
      continuous: true, // Keep it continuous
      interimResults: true,
      lang: 'en-US'
    });
    console.log("Listening initiated. Hook's 'listening' state should soon become true.");

    // --- REMOVED ALL DIRECT event listener attachments here ---
    // The `useSpeechRecognition` hook manages these internally.

  }, [browserSupportsSpeechRecognition, isProcessing, speaking, resetTranscript, browserSupportsContinuousListening, isMicrophoneAvailable]);


  const stopListeningHandler = useCallback(() => {
    console.log("stopListeningHandler called. Attempting to stop listening...");
    SpeechRecognition.stopListening();
    console.log("Listening stopped via button click. Hook's 'listening' state should become false.");

    // --- REMOVED DIRECT LISTENER CLEANUP ---
    // Not needed as we removed the attachments.
  }, []);


  const processUserVoiceCommand = useCallback(async (command) => {
    console.log("processUserVoiceCommand called for command:", command);
    if (!command.trim()) {
        console.log("processUserVoiceCommand: Command is empty or only whitespace, not processing.");
        return;
    }
    // This guard prevents processing new commands while a previous one is active.
    // 'speaking' is checked to prevent processing while AI is talking.
    if (isProcessing || speaking) {
        console.log("processUserVoiceCommand: Blocked by isProcessing or speaking state. Current command will be ignored.", {isProcessing, speaking});
        return;
    }

    setIsProcessing(true); // Set processing flag (button will show "Processing...")

    // --- CRITICAL CHANGE: DO NOT MANUALLY STOP LISTENING HERE ---
    // In 'continuous: true' mode, react-speech-recognition manages the mic.
    // We rely on the 'disabled' prop of the button and guards above to prevent re-triggers.
    console.log("processUserVoiceCommand: Mic theoretically remains active throughout AI processing/speaking.");
    // SpeechRecognition.stopListening(); // <--- THIS LINE IS REMOVED
    // END CRITICAL CHANGE

    setConversationHistory(prev => [...prev, { role: 'user', text: command }]);

    try {
      const historyForGemini = conversationHistory.map(entry => ({ role: entry.role, text: entry.text }));
      const aiResponseText = await getAiResponse(command, historyForGemini);
      setConversationHistory(prev => [...prev, { role: 'model', text: aiResponseText }]);

      speak(aiResponseText, () => {
        // Callback after AI finishes speaking
        console.log("AI speech finished. Resetting processing state.");
        setIsProcessing(false); // Reset processing state. Button should go back to "Listening" or "Talk to LMS"

        // --- NO MANUAL RESTART HERE EITHER ---
        // With 'continuous: true', react-speech-recognition is supposed to automatically manage mic re-engagement
        // after the system's TTS finishes. If it doesn't, it's an underlying browser issue.
        console.log("No manual restart needed. SpeechRecognition should auto-resume if 'continuous' is truly supported and mic remains active.");
      });

    } catch (error) {
      console.error("Error processing voice command (API/Network):", error);
      const errorMessage = `Sorry, I'm having trouble with that request. ${error.message}`;
      setConversationHistory(prev => [...prev, { role: 'model', text: errorMessage }]);
      speak(errorMessage, () => {
        setIsProcessing(false); // Reset processing even on error
      });
    }
  }, [isProcessing, speaking, conversationHistory, speak, setConversationHistory]);


  useEffect(() => {
    // This useEffect listens for changes in `finalTranscript`.
    // It should only trigger `processUserVoiceCommand` under specific conditions.

    console.log("useEffect for finalTranscript triggered. Current states (on render):", { finalTranscript, isProcessing, speaking, listening });

    // Condition to process:
    // 1. `finalTranscript` exists and is not just whitespace.
    // 2. Not already `isProcessing` (prevents double-processing if previous command is still being handled).
    // 3. Not `speaking` (prevents processing AI's own speech or user talking over AI).
    // 4. `listening` is true (ensures the microphone is actively picking up sound *when* `finalTranscript` was generated).
    if (finalTranscript && finalTranscript.trim().length > 0 && !isProcessing && !speaking && listening) {
      console.log("Condition met to process finalTranscript:", finalTranscript);
      processUserVoiceCommand(finalTranscript);
      // Do NOT resetTranscript() here with continuous:true. The library manages appending new speech.
    } else {
        // More precise logging for why the condition was NOT met (for debugging)
        if (!finalTranscript || finalTranscript.trim().length === 0) {
            // This case is fine; no new speech yet or just blank.
        } else if (isProcessing) {
            console.log("Final transcript available but blocked: AI is currently processing previous request.");
        } else if (speaking) {
            console.log("Final transcript available but blocked: AI is currently speaking.");
        } else if (!listening) {
            console.log("Final transcript available but blocked: Microphone is not active ('listening' is false).");
        }
    }
  }, [finalTranscript, isProcessing, speaking, listening, processUserVoiceCommand]);


  // --- Browser Compatibility Checks ---
  if (!browserSupportsSpeechRecognition) {
    return (
      <p className="text-red-500 mt-4">
        Speech recognition is not supported in this browser. Please use Chrome or Edge.
      </p>
    );
  }
  if (!isMicrophoneAvailable) {
    return (
        <p className="text-red-500 mt-4">
            Microphone not found or permission denied. Please enable microphone access for this site in your browser settings.
        </p>
    );
  }

  // --- Render UI ---
  return (
    <div className="mt-4 text-center">
      {/* Main button to start/stop listening */}
      <button
        onClick={listening ? stopListeningHandler : startListeningHandler}
        className={`${
          listening ? 'bg-red-600' : 'bg-blue-600'
        } text-white px-4 py-2 rounded-md hover:opacity-90`}
        disabled={isProcessing || speaking} // Disable button when processing AI response or AI is speaking
      >
        {listening
          ? "🛑 Stop Listening" // Button text when microphone is active
          : isProcessing
            ? "Processing..." // Button text when AI is thinking
            : speaking
              ? "Speaking..." // Button text when AI is talking
              : "🎙️ Talk to LMS"} {/* Default button text */}
      </button>

      {/* Visual feedback for the user */}
      {listening && !isProcessing && !speaking && ( // Show "Listening..." only when mic is truly active and not busy
        <p className="text-green-500 mt-2">Listening...</p>
      )}
      {transcript && !finalTranscript && ( // Show interim results (what browser thinks user is saying)
        <p className="text-gray-500 mt-2">You are saying: "{transcript}"</p>
      )}

      {/* Conversation History Display Area */}
      <div
        ref={conversationLogRef}
        className="conversation-log mt-4 p-4 border border-gray-300 rounded-lg shadow-md bg-white max-h-80 overflow-y-auto text-left"
        style={{ minHeight: '100px' }}
      >
        {conversationHistory.length === 0 ? (
          <p className="text-gray-500">Click "🎙️ Talk to LMS" and ask me anything!</p>
        ) : (
          conversationHistory.map((entry, index) => (
            <div key={index} className={`mb-2 ${entry.role === 'user' ? 'text-right' : 'text-left'}`}>
              <span className={`inline-block p-2 rounded-lg ${
                entry.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
              }`}>
                <strong>{entry.role === 'user' ? 'You' : 'Assistant'}:</strong> {entry.text}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}