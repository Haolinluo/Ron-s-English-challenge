export enum Difficulty {
  Beginner = "初级",
  Intermediate = "中级",
  Advanced = "高级",
}

export enum GrammarPoint {
  NonFinite = "非谓语动词",
  AttributiveClause = "定语从句",
  AdverbialClause = "状语从句",
  NounClause = "名词性从句",
  Conjunction = "连词",
  Tense = "时态语态",
  AbsoluteConstruction = "独立主格",
}

export interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Explanation {
  correctAnswer: string;
  rule: string;
  example: string;
  commonMistake: string;
}

export interface Question {
  id: number;
  sentence: string; // Use "____" for blanks
  options: Option[];
  explanation: Explanation;
  difficulty: Difficulty;
  category: GrammarPoint;
  reviewLink?: string;
}
