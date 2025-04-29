import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function ConversationPage() {
  const router = useRouter();
  const [conversation, setConversation] = useState(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const { id } = router.query;
    if (!id) return;
    const saved = JSON.parse(localStorage.getItem('savedConversations') || '[]');
    const found = saved.find(c => c.id === id);
    if (found) setConversation(found.conversation);
  }, [router.query]);

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-PT';
    speechSynthesis.speak(utterance);
  };

  if (!conversation) return <p className="p-4">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Conversation</h1>
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
    </div>
  );
}
