import challengeJson from "@/data/challenge-data.json";
import dietQuotesJson from "@/data/diet-quotes.json";
import type { ChallengeData, DietQuoteData, Mission } from "@/types/challenge";

const challengeData = challengeJson as ChallengeData;
const dietQuoteData = dietQuotesJson as DietQuoteData;

function formatDateInTimeZone(date: Date, timezone: string): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const year = parts.find((part) => part.type === "year")?.value ?? "0000";
  const month = parts.find((part) => part.type === "month")?.value ?? "01";
  const day = parts.find((part) => part.type === "day")?.value ?? "01";
  return `${year}-${month}-${day}`;
}

function formatKoreanDate(dateISO: string, timezone: string): string {
  const [year, month, day] = dateISO.split("-").map(Number);
  const utcDate = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));

  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: timezone,
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  }).format(utcDate);
}

function sortMissionsByDate(missions: Mission[]): Mission[] {
  return [...missions].sort((a, b) => a.date.localeCompare(b.date));
}

function buildMissionTargetLabel(mission: Mission): string {
  if (mission.targetByGender) {
    const male = mission.targetByGender.MALE;
    const female = mission.targetByGender.FEMALE;

    const segments = [
      male ? `남 ${male}${mission.targetUnit === "reps" ? "회" : mission.targetUnit}` : null,
      female ? `여 ${female}${mission.targetUnit === "reps" ? "회" : mission.targetUnit}` : null,
    ].filter(Boolean);

    if (segments.length > 0) {
      return segments.join(" / ");
    }
  }

  if (mission.targetValue !== undefined) {
    const unit = mission.targetUnit === "reps" ? "회" : mission.targetUnit;
    return `${mission.targetValue}${unit}`;
  }

  return "목표 추후 공지";
}

export function getChallengeOverview() {
  return challengeData.challenge;
}

export function getNotices() {
  return challengeData.notices;
}

export function getTodayISO() {
  return formatDateInTimeZone(new Date(), challengeData.challenge.period.timezone);
}

export function getMissionByDate(dateISO: string): Mission | null {
  return challengeData.missions.find((mission) => mission.date === dateISO) ?? null;
}

export function shiftDate(dateISO: string, offsetDays: number): string {
  const [year, month, day] = dateISO.split("-").map(Number);
  const base = new Date(Date.UTC(year, month - 1, day));
  base.setUTCDate(base.getUTCDate() + offsetDays);

  const shiftedYear = base.getUTCFullYear();
  const shiftedMonth = String(base.getUTCMonth() + 1).padStart(2, "0");
  const shiftedDay = String(base.getUTCDate()).padStart(2, "0");
  return `${shiftedYear}-${shiftedMonth}-${shiftedDay}`;
}

export function isInChallengePeriod(dateISO: string): boolean {
  const { startDate, endDate } = challengeData.challenge.period;
  return dateISO >= startDate && dateISO <= endDate;
}

export function getTodayMission() {
  const today = getTodayISO();
  return getMissionByDate(today);
}

export function getNextMission(fromDateISO: string): Mission | null {
  const missions = sortMissionsByDate(challengeData.missions);
  return missions.find((mission) => mission.date >= fromDateISO) ?? null;
}

export function getMissionsSortedFromDate(fromDateISO: string): Mission[] {
  const sorted = sortMissionsByDate(challengeData.missions);
  const upcoming = sorted.filter((mission) => mission.date >= fromDateISO);
  const past = sorted.filter((mission) => mission.date < fromDateISO);
  return [...upcoming, ...past];
}

export function getMissionViewModel(mission: Mission) {
  const timezone = challengeData.challenge.period.timezone;
  return {
    ...mission,
    dateLabel: formatKoreanDate(mission.date, timezone),
    targetLabel: buildMissionTargetLabel(mission),
  };
}

export function getChallengeDateLabel(dateISO: string): string {
  return formatKoreanDate(dateISO, challengeData.challenge.period.timezone);
}

export function getDietQuoteByDate(dateISO: string) {
  return dietQuoteData.quotes.find((quote) => quote.date === dateISO) ?? null;
}
