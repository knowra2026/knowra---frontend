export const IMPORTANT_QUESTIONS = {
  "engineering-physics": [
    "https://drive.google.com/file/d/1vZd7M4PSNurr3ztjKSQ0BY68C7U4BHMB/view?usp=sharing",
    "https://drive.google.com/file/d/1vZd7M4PSNurr3ztjKSQ0BY68C7U4BHMB/view?usp=sharing",
    "https://drive.google.com/file/d/1vZd7M4PSNurr3ztjKSQ0BY68C7U4BHMB/view?usp=sharing"
  ],
  "linear-algebra-and-calculus": [
    "https://drive.google.com/file/d/1vZd7M4PSNurr3ztjKSQ0BY68C7U4BHMB/view?usp=sharing",
    "https://drive.google.com/file/d/1vZd7M4PSNurr3ztjKSQ0BY68C7U4BHMB/view?usp=sharing",
    "https://drive.google.com/file/d/1vZd7M4PSNurr3ztjKSQ0BY68C7U4BHMB/view?usp=sharing"
  ],
  "basic-electrical-and-electronics-engineering": [
    "https://drive.google.com/file/d/1vZd7M4PSNurr3ztjKSQ0BY68C7U4BHMB/view?usp=sharing",
    "https://drive.google.com/file/d/1vZd7M4PSNurr3ztjKSQ0BY68C7U4BHMB/view?usp=sharing",
    "https://drive.google.com/file/d/1vZd7M4PSNurr3ztjKSQ0BY68C7U4BHMB/view?usp=sharing"
  ],
  "introduction-to-programming": [
    "https://drive.google.com/file/d/1vZd7M4PSNurr3ztjKSQ0BY68C7U4BHMB/view?usp=sharing",
    "https://drive.google.com/file/d/1vZd7M4PSNurr3ztjKSQ0BY68C7U4BHMB/view?usp=sharing",
    "https://drive.google.com/file/d/1vZd7M4PSNurr3ztjKSQ0BY68C7U4BHMB/view?usp=sharing"
  ],
  "engineering-graphics": [
    "https://drive.google.com/file/d/1vZd7M4PSNurr3ztjKSQ0BY68C7U4BHMB/view?usp=sharing",
    "https://drive.google.com/file/d/1vZd7M4PSNurr3ztjKSQ0BY68C7U4BHMB/view?usp=sharing",
    "https://drive.google.com/file/d/1vZd7M4PSNurr3ztjKSQ0BY68C7U4BHMB/view?usp=sharing"
  ]
};

export const getImportantQuestions = (subjectId) => {
  return IMPORTANT_QUESTIONS[subjectId] || [];
};
