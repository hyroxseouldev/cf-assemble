export type Gender = "MALE" | "FEMALE";

export type MissionType = "REPS" | "DISTANCE";

export interface AwardPrize {
  rank: number;
  amountKRW: number;
}

export interface ScoringRule {
  id: string;
  description: string;
  metric: string;
  unitChange: number;
  scorePerUnit: number;
}

export interface Mission {
  id: string;
  date: string;
  weekday: string;
  weekIndex: number;
  title: string;
  type: MissionType;
  targetValue?: number;
  targetByGender?: Partial<Record<Gender, number>>;
  targetUnit: string;
  youtubeUrl?: string;
}

export interface ChallengeData {
  challenge: {
    id: string;
    title: string;
    period: {
      startDate: string;
      endDate: string;
      timezone: string;
    };
    registration: {
      deadlineDate: string;
      submissionMethod: string;
      photoRequired: boolean;
    };
    finalInbodySubmission: {
      startDate: string;
      endDate: string;
      method: string;
    };
    entryFee: {
      amountKRW: number;
      cashOnly: boolean;
      usage: string;
    };
    awards: {
      male: AwardPrize[];
      female: AwardPrize[];
      diet: AwardPrize[];
      note: string;
    };
    scoringRules: ScoringRule[];
  };
  missions: Mission[];
  notices: Array<{
    id: string;
    type: string;
    message: string;
  }>;
}

export interface DietQuote {
  id: string;
  date: string;
  quote: string;
  author: string;
  category: string;
  language: string;
}

export interface DietQuoteData {
  challengeId: string;
  startDate: string;
  endDate: string;
  quotes: DietQuote[];
}
