import { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

const defaultConversation = {
  conversation: [
    { speaker: "Customer", portuguese: "Bom dia!", english: "Good morning!" }
  ]
};

const defaultFlashcards = [
  {
    verb: "ser",
    translation: "to be",
    example_pt: "Eu sou estudante.",
    example_en: "I am a student."
  }
];

export default function Home() {
  const [page, setPage] = useState("conversation");
  const [conversation, setConversation] = useState(defaultConversation);
  const [savedConversations, setSavedConversations] = useState([]);
  const [flashcards, setFlashcards] = useState(defaultFlashcards);
  const [flashcardStates, setFlashcardStates] = useState({});
  const [conversationInput, setConversationInput] = useState("");
  const [flashcardInput, setFlashcardInput] = useState("");
  const [savedFlashcards, setSavedFlashcards] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("savedConversations");
    const flashState = localStorage.getItem("flashcardStates");
    const savedFlash = localStorage.getItem("savedFlashcards");
    if (saved) setSavedConversations(JSON.parse(saved));
    if (flashState) setFlashcardStates(JSON.parse(flashState));
    if (savedFlash) setSavedFlashcards(JSON.parse(savedFlash));
  }, []);

  const speak = async (text) => {
    try {
      const response = await axios.post(
        'https://texttospeech.googleapis.com/v1/text:synthesize?key=AIzaSyB3Gy3ERt0kH2VfcQM0vY4anhKUn4nnTmU',
        {
          input: { text },
          voice: {
            languageCode: 'pt-PT',
            name: 'pt-PT-Standard-A'
          },
          audioConfig: { audioEncoding: 'MP3' }
        }
      );
      const audioContent = response.data.audioContent;
      const audio = new Audio(`data:audio/mp3;base64,${audioContent}`);
      audio.play();
    } catch (err) {
      console.error('Error using Google TTS:', err);
      alert('Failed to fetch audio from Google TTS.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <nav className="flex gap-4 border-b mb-4 pb-2">
        <button onClick={() => setPage("conversation")}>Conversation</button>
        <button onClick={() => setPage("flashcards")}>Flashcards</button>
        <button onClick={() => setPage("saved")}>Saved Conversations</button>
      </nav>

      {page === "conversation" && (
        <div>
          <textarea
            className="w-full p-2 border rounded mb-2"
            rows="6"
            placeholder="Paste conversation JSON here"
            value={conversationInput}
            onChange={(e) => setConversationInput(e.target.value)}
          ></textarea>
          <button className="mb-2 bg-blue-500 text-white px-4 py-2 rounded" onClick={() => {
            try {
              const parsed = JSON.parse(conversationInput);
              setConversation(parsed);
            } catch (e) {
              alert("Invalid JSON");
            }
          }}>
            Load Conversation JSON
          </button>
          <div className="space-y-4">
            {conversation.conversation.map((msg, idx) => (
              <div key={idx} className={`flex ${idx % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                <div className="bg-white p-3 rounded-lg shadow max-w-md">
                  <p className="font-bold">{msg.speaker}</p>
                  <p>{msg.portuguese} <button onClick={() => speak(msg.portuguese)}>🔊</button></p>
                  <p className="text-sm text-gray-500">{msg.english}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded" onClick={() => {
            const title = prompt("Enter a title for this conversation:");
            if (!title) return;
            const newConvos = [...savedConversations, { id: uuidv4(), title, conversation, conversationInput }];
            setSavedConversations(newConvos);
            localStorage.setItem("savedConversations", JSON.stringify(newConvos));
          }}>
            Save This Conversation
          </button>
        </div>
      )}

      {page === "saved" && (
        <div>
          <h2 className="text-xl mb-2">Saved Conversations</h2>
          <ul className="space-y-2 mb-6">
            {savedConversations.sort((a, b) => a.id.localeCompare(b.id)).map((conv) => (
              <li key={conv.id} className="flex justify-between items-center bg-white p-3 rounded shadow">
                <span>{conv.title}</span>
                <div className="space-x-2">
                  <button
                    className="bg-green-500 text-white px-2 py-1 rounded"
                    onClick={() => {
                      setConversation(conv.conversation);
                      setConversationInput(conv.conversationInput || "");
                      setPage("conversation");
                    }}
                  >
                    View
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    onClick={() => {
                      const updated = savedConversations.filter(c => c.id !== conv.id);
                      setSavedConversations(updated);
                      localStorage.setItem("savedConversations", JSON.stringify(updated));
                    }}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
