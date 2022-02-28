export interface QuestionAnimals {
  // todo egen info: endret id til ikke-optional, for POST req
  id: number;
  question: string;
  description?: string | null;
  explanation?: string | null;
  tip?: string | null;
  tags?: {
    name: string;
  }[];
  multiple_correct_answers?: "true" | "false";
  difficulty?: string;
  category?: string;
  // answers er enten string eller null
  answers: Record<string, string | null>;
  // correct answers er string, og er enten "true" eller "false"
  correct_answers: Record<string, "true" | "false">;
}

export function randomQuestion(): QuestionAnimals {
  return Questions[Math.trunc(Math.random() * Questions.length)];
}

export function isCorrectAnswer(
  question: QuestionAnimals | undefined,
  answer: string
) {
  return question?.correct_answers[answer + "_correct"] === "true";
}

// Generated from https://quizapi.io/api/v1/questions?category=code&limit=10&tags=JavaScript
// You need to create an API key at https://quizapi.io/ to generate your own questions
export const Questions: QuestionAnimals[] = [
  {
    id: 974,
    question:
      "A carnivorous animal eats flesh, what does a nucivorous animal eat?",
    description: null,
    answers: {
      answer_a: "Nothing",
      answer_b: "Fruit",
      answer_c: "Seaweed",
      answer_d: "Nuts",
    },
    multiple_correct_answers: "false",
    correct_answers: {
      answer_a_correct: "false",
      answer_b_correct: "false",
      answer_c_correct: "false",
      answer_d_correct: "true",
    },
    explanation: null,
    tip: null,
    tags: [{ name: "Animals" }],
    category: "Animal",
    difficulty: "Medium",
  },
  {
    id: 976,
    question: "What color is a polar bear's skin?",
    description: null,
    answers: {
      answer_a: "White",
      answer_b: "Pink",
      answer_c: "Black",
      answer_d: "Green",
    },
    multiple_correct_answers: "false",
    correct_answers: {
      answer_a_correct: "false",
      answer_b_correct: "false",
      answer_c_correct: "true",
      answer_d_correct: "false",
    },
    explanation: null,
    tip: null,
    tags: [{ name: "Animals" }],
    category: "Animal",
    difficulty: "Medium",
  },
  {
    id: 995,
    question: "Cashmere is the wool from which kind of animal?",
    description: null,
    answers: {
      answer_a: "Goat",
      answer_b: "Camel",
      answer_c: "Sheep",
      answer_d: "Llama",
    },
    multiple_correct_answers: "false",
    correct_answers: {
      answer_a_correct: "true",
      answer_b_correct: "false",
      answer_c_correct: "false",
      answer_d_correct: "false",
    },
    explanation: null,
    tip: null,
    tags: [{ name: "Animals" }],
    category: "Animal",
    difficulty: "Medium",
  },
  {
    id: 986,
    question: "What is the fastest animal?",
    description: null,
    answers: {
      answer_a: "Golden Eagle",
      answer_b: "Cheetah",
      answer_c: "Horsefly",
      answer_d: "Peregrine Falcon",
    },
    multiple_correct_answers: "false",
    correct_answers: {
      answer_a_correct: "false",
      answer_b_correct: "false",
      answer_c_correct: "false",
      answer_d_correct: "true",
    },
    explanation: null,
    tip: null,
    tags: [{ name: "Animals" }],
    category: "Animal",
    difficulty: "Medium",
  },
  {
    id: 988,
    question:
      "What is the name for a male bee that comes from an unfertilized egg?",
    description: null,
    answers: {
      answer_a: "Soldier",
      answer_b: "Drone",
      answer_c: "Worker",
      answer_d: "Male",
    },
    multiple_correct_answers: "false",
    correct_answers: {
      answer_a_correct: "false",
      answer_b_correct: "true",
      answer_c_correct: "false",
      answer_d_correct: "false",
    },
    explanation: null,
    tip: null,
    tags: [{ name: "Animals" }],
    category: "Animal",
    difficulty: "Medium",
  },
  {
    id: 989,
    question: "What is the world's longest venomous snake?",
    description: null,
    answers: {
      answer_a: "King Cobra",
      answer_b: "Green Anaconda",
      answer_c: "Inland Taipan",
      answer_d: "Yellow Bellied Sea Snake",
    },
    multiple_correct_answers: "false",
    correct_answers: {
      answer_a_correct: "true",
      answer_b_correct: "false",
      answer_c_correct: "false",
      answer_d_correct: "false",
    },
    explanation: null,
    tip: null,
    tags: [{ name: "Animals" }],
    category: "Animal",
    difficulty: "Medium",
  },
  {
    id: 981,
    question:
      "What dog bread is one of the oldest breeds of dog and has flourished since before 400 BCE.",
    description: null,
    answers: {
      answer_a: "Pugs",
      answer_b: "Bulldogs",
      answer_c: "Boxers",
      answer_d: "Chihuahua",
    },
    multiple_correct_answers: "false",
    correct_answers: {
      answer_a_correct: "true",
      answer_b_correct: "false",
      answer_c_correct: "false",
      answer_d_correct: "false",
    },
    explanation: null,
    tip: null,
    tags: [{ name: "Animals" }],
    category: "Animal",
    difficulty: "Medium",
  },
  {
    id: 984,
    question: "Which of these species is NOT extinct?",
    description: null,
    answers: {
      answer_a: "Japanese sea lion",
      answer_b: "Tasmanian tiger",
      answer_c: "Saudi gazelle",
      answer_d: "Komodo Dragon",
    },
    multiple_correct_answers: "false",
    correct_answers: {
      answer_a_correct: "false",
      answer_b_correct: "false",
      answer_c_correct: "false",
      answer_d_correct: "true",
    },
    explanation: null,
    tip: null,
    tags: [{ name: "Animals" }],
    category: "Animal",
    difficulty: "Medium",
  },
];
