export type Language = { code: string; name: string };

export type PersonalityAttribute = {
  name: string;
  definition: string;
  color: string; // RGB string like "rgb(0, 112, 192)"
};

export type AssessmentInstructions = {
  instructionsText: string;
  scale: string[];
  resetButton: string;
  nextButton: string;
};

export type AssessmentResultText = {
  heading: string;
  primaryText: string;
  secondaryText: string;
  attributes: PersonalityAttribute[];
  descriptionText: string;
  button: string;
};

export type IntroductoryText = {
  language: string;
  heading: string;
  introduction: string;
  button: string;
};

export type Word = {
  id: number;
  word: string;
  leadershipTypeId: number;
  rank: number | null;
};

export type WordGroup = {
  set: number;
  words: Word[];
};

export type WordGroupData = {
  wordGroups: WordGroup[];
};
