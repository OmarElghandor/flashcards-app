import { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';

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
  ...
}