// Example: AI-based lesson generation using OpenAI's API and JSON lesson schema
import { useState } from 'react';
import axios from 'axios';

export default function LessonGenerator() {
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateLesson = async () => {
    setLoading(true);
    try {
      const response = await axios.post("https://api.openai.com/v1/chat/completions", {
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a Portuguese teacher that outputs structured JSON lessons."
          },
          {
            role: "user",
            content: `Create a beginner Portuguese lesson that teaches greetings. Include:
  - title
  - 3 vocabulary items with Portuguese and English
  - a simple 3-line dialogue (pt + en)
  - a quiz with 1 multiple choice question (question, options, correct answer)`
          }
        ],
        temperature: 0.7
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      const raw = response.data.choices[0].message.content;
      const jsonStart = raw.indexOf('{');
      const json = JSON.parse(raw.slice(jsonStart));
      setLesson(json);
    } catch (err) {
      console.error("Failed to fetch lesson:", err);
      alert("Error generating lesson.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <button
        onClick={generateLesson}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        {loading ? "Generating..." : "Generate Lesson"}
      </button>

      {lesson && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">{lesson.title}</h2>

          <div>
            <h3 className="font-semibold">Vocabulary</h3>
            <ul className="list-disc pl-5">
              {lesson.vocab.map((word, idx) => (
                <li key={idx}>{word.pt} – {word.en}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold">Dialogue</h3>
            <ul className="space-y-1">
              {lesson.dialogue.map((line, idx) => (
                <li key={idx}><strong>{line.speaker}:</strong> {line.pt} ({line.en})</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold">Quiz</h3>
            <p>{lesson.quiz[0].question}</p>
            <ul className="list-disc pl-5">
              {lesson.quiz[0].choices.map((choice, i) => (
                <li key={i}>{choice}</li>
              ))}
            </ul>
            <p className="text-green-600 font-bold">Answer: {lesson.quiz[0].answer}</p>
          </div>
        </div>
      )}
    </div>
  );
}