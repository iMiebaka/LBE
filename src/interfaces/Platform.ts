interface ITAddQuestionData {
    title: string;
    description: string;
    instructions: string;
    duration: number;
    difficulty: string;
    categories: string;
    questions: ITQuestionData[];
}

interface ITSubmitQuestion {
    title: string;
    description: string;
    instructions: string;
    duration: number;
    difficulty: string;
    categories: string;
    questions: ITSubmittedQuestionData[];
}

interface ITSubmittedQuestionData {
    _id: string;
    quiz: string;
    score: number;
    text: string;
    type: string;
    answers: ITAnswerData[];
}

interface ITQuestionData {
    text: string;
    type: string;
    answers: ITAnswerData[];
}


interface ITAnswerData {
    text: string;
    _id: Object;
    isCorrect: boolean;
}

interface ITScore {
    total: number,
    totalPassed: number,
}


export  {ITQuestionData, ITAddQuestionData, ITSubmitQuestion, ITAnswerData, ITScore, ITSubmittedQuestionData}