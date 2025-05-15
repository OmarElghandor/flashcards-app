import { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

export default function Home() {
  const [page, setPage] = useState("conversation");
  const [conversation, setConversation] = useState({ conversation: [] });
  const [savedConversations, setSavedConversations] = useState([]);
  const [flashcards, setFlashcards] = useState([]);
  const [flashcardStates, setFlashcardStates] = useState({});
  const [conversationInput, setConversationInput] = useState("");
  const [flashcardInput, setFlashcardInput] = useState([]);
  const [savedFlashcards, setSavedFlashcards] = useState([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSavedConversations(JSON.parse(localStorage.getItem("savedConversations") || "[]"));
      setFlashcardStates(JSON.parse(localStorage.getItem("flashcardStates") || "{}"));
      setSavedFlashcards(JSON.parse(localStorage.getItem("savedFlashcards") || "[]"));
    }
  }, []);

  const speak = async (text) => {
    try {
      const response = await axios.post(
        `https://texttospeech.googleapis.com/v1/text:synthesize?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`,
        {
          input: { text },
          voice: { languageCode: 'pt-PT', name: 'pt-PT-Standard-A' },
          audioConfig: { audioEncoding: 'MP3' }
        }
      );
      const audio = new Audio(`data:audio/mp3;base64,${response.data.audioContent}`);
      audio.play();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4">
      <nav className="flex gap-4 mb-4">
        <button onClick={() => setPage("conversation")}>Conversation</button>
        <button onClick={() => setPage("flashcards")}>Flashcards</button>
        <button onClick={() => setPage("saved")}>Saved</button>
        <button onClick={() => window.location.href='/lesson-generator'}>AI Lessons</button>
      </nav>
      <p>Demo content. Replace with full conversation + flashcards + saved code.</p>
    </div>
  );
}