"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpRight, CalendarDays, ChevronLeft, ChevronRight, Dumbbell, Quote } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  getChallengeDateLabel,
  getDietQuoteByDate,
  getChallengeOverview,
  getMissionByDate,
  getMissionViewModel,
  getTodayISO,
  isInChallengePeriod,
  shiftDate,
} from "@/lib/challenge-repo";

function getYoutubeEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace("www.", "");

    if (host === "youtu.be") {
      const id = parsed.pathname.split("/").filter(Boolean)[0];
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }

    if (host === "youtube.com" || host === "m.youtube.com") {
      const id = parsed.searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }

    return null;
  } catch {
    return null;
  }
}

function parseISODateUTC(dateISO: string): Date {
  const [year, month, day] = dateISO.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

function getChallengeDday(todayISO: string, startDateISO: string, endDateISO: string): string {
  const dayMs = 1000 * 60 * 60 * 24;
  const today = parseISODateUTC(todayISO);
  const start = parseISODateUTC(startDateISO);
  const end = parseISODateUTC(endDateISO);

  const diffStart = Math.floor((start.getTime() - today.getTime()) / dayMs);
  const diffEnd = Math.floor((end.getTime() - today.getTime()) / dayMs);

  if (diffStart > 0) {
    return `시작까지 D-${diffStart}`;
  }

  if (diffEnd >= 0) {
    return `종료까지 D-${diffEnd}`;
  }

  return `종료 D+${Math.abs(diffEnd)}`;
}

export default function Home() {
  const challenge = getChallengeOverview();
  const [selectedDateISO, setSelectedDateISO] = useState(getTodayISO());
  const todayISO = getTodayISO();

  const mission = useMemo(() => getMissionByDate(selectedDateISO), [selectedDateISO]);
  const missionView = mission ? getMissionViewModel(mission) : null;
  const selectedDateQuote = useMemo(() => getDietQuoteByDate(selectedDateISO), [selectedDateISO]);
  const inPeriod = isInChallengePeriod(selectedDateISO);
  const embedUrl = mission?.youtubeUrl ? getYoutubeEmbedUrl(mission.youtubeUrl) : null;
  const ddayLabel = getChallengeDday(todayISO, challenge.period.startDate, challenge.period.endDate);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_#fff5de_0%,_#ffedd2_36%,_#f7e6c4_72%,_#efdbb6_100%)]" />
      <div className="absolute -left-20 top-24 -z-10 h-64 w-64 rounded-full bg-[#f8c37a]/40 blur-3xl" />
      <div className="absolute -right-12 bottom-12 -z-10 h-72 w-72 rounded-full bg-[#84b19d]/25 blur-3xl" />

      <main id="main-content" className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <Card className="rounded-3xl border-[#e8cda1] bg-white/85 shadow-[0_10px_45px_-24px_rgba(113,73,7,0.5)] backdrop-blur">
          <CardContent className="px-5 sm:px-7">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <Image
                  src="/cf-as-logo.png"
                  alt="Assemble CrossFit"
                  width={120}
                  height={84}
                  className="h-16 w-auto rounded-xl border border-[#d9d9d9] bg-white object-contain p-1"
                  priority
                />
                <div>
                  <p className="text-xs font-semibold tracking-[0.2em] text-[#6e5840]">ASSEMBLE FITNESS</p>
                  <h1 className="text-balance text-2xl font-bold text-[#2f2418] sm:text-3xl">{challenge.title}</h1>
                  <p className="mt-1 text-sm text-[#5b4834]">
                    {getChallengeDateLabel(challenge.period.startDate)} - {getChallengeDateLabel(challenge.period.endDate)}
                  </p>
                  <p className="mt-2">
                    <Badge className="rounded-lg bg-[#f2e4ce] px-3 py-1 text-sm font-bold text-[#4a3724]">
                      {ddayLabel}
                    </Badge>
                  </p>
                </div>
              </div>

              <Button
                asChild
                variant="outline"
                className="h-11 rounded-xl border-[#84b19d] bg-[#e9f4ef] text-[#2f5f4b] hover:bg-[#d9ece4]"
              >
                <Link href="/challenge-info">
                  챌린지 핵심 정보 보기
                  <ArrowUpRight aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-[#e8cda1] bg-white/90 shadow-[0_10px_35px_-24px_rgba(80,45,9,0.55)] backdrop-blur">
          <CardHeader className="px-6 sm:px-8">
            <CardTitle className="flex items-center gap-2 text-lg text-[#2f2418]">
              <CalendarDays aria-hidden="true" className="size-5" />
              날짜 이동
            </CardTitle>
            <CardDescription className="text-[#8b6e4d]">원하는 날짜의 미션과 명언을 확인하세요.</CardDescription>
          </CardHeader>
          <CardContent className="px-6 sm:px-8">
            <div className="flex items-center justify-between gap-3 rounded-2xl border border-[#ead7b6] bg-[#fff8ed] p-2 sm:px-3">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => setSelectedDateISO((prev) => shiftDate(prev, -1))}
                aria-label="이전 날짜"
                className="h-11 w-11 rounded-xl border-[#d8c19b] bg-white text-[#5b4632] hover:bg-[#fdeac8]"
              >
                <ChevronLeft aria-hidden="true" />
              </Button>

              <div className="flex min-w-0 flex-1 flex-col items-center px-2 text-center">
                <p className="truncate text-lg font-bold text-[#2f2418]">{getChallengeDateLabel(selectedDateISO)}</p>
                <p className="mt-1 text-sm text-[#6b543d]">
                  {selectedDateISO === todayISO ? "오늘 기준 미션" : "선택한 날짜 미션"}
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => setSelectedDateISO((prev) => shiftDate(prev, 1))}
                aria-label="다음 날짜"
                className="h-11 w-11 rounded-xl border-[#d8c19b] bg-white text-[#5b4632] hover:bg-[#fdeac8]"
              >
                <ChevronRight aria-hidden="true" />
              </Button>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setSelectedDateISO(getTodayISO())}
                className="h-10 rounded-lg border border-[#84b19d] bg-[#eaf7f1] px-4 text-[#2f5f4b] hover:bg-[#dff2e9]"
              >
                오늘로 이동
              </Button>
              <Badge variant="outline" className="border-[#d8c19b] bg-white/70 px-3 py-1 text-sm text-[#6b543d]">
                {inPeriod ? "챌린지 기간 내 날짜" : "챌린지 기간 외 날짜"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-[#e8cda1] bg-white/90 shadow-[0_10px_35px_-24px_rgba(80,45,9,0.55)] backdrop-blur">
          <CardHeader className="px-6 sm:px-8">
            <CardTitle className="flex items-center gap-2 text-lg text-[#2f2418]">
              <Quote aria-hidden="true" className="size-5" />
              오늘의 명언
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 sm:px-8">
            {selectedDateQuote ? (
              <blockquote className="rounded-2xl border border-[#edd9b5] bg-[#fff7e9] px-4 py-4">
                <p className="text-lg font-medium leading-relaxed text-[#3a2c1e]">&ldquo;{selectedDateQuote.quote}&rdquo;</p>
                <footer className="mt-2 text-sm font-semibold text-[#7b6147]">- {selectedDateQuote.author}</footer>
              </blockquote>
            ) : (
              <p className="text-sm text-[#6b543d]">선택한 날짜에는 등록된 다이어트 명언이 없습니다.</p>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-[#e8cda1] bg-white/90 shadow-[0_10px_35px_-24px_rgba(80,45,9,0.55)] backdrop-blur">
          <CardHeader className="px-6 sm:px-8">
            <CardTitle className="flex items-center gap-2 text-lg text-[#2f2418]">
              <Dumbbell aria-hidden="true" className="size-5" />
              오늘의 운동
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 sm:px-8">
            {mission && missionView ? (
              <>
                <h2 className="text-balance text-3xl font-bold text-[#2f2418]">{mission.title}</h2>
                <p className="mt-3 inline-flex rounded-xl bg-[#f2e4ce] px-3 py-2 text-base font-semibold text-[#3f2f1e]">
                  목표: {missionView.targetLabel}
                </p>

                {mission.youtubeUrl ? (
                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    <Button asChild className="bg-[#84b19d] text-white hover:bg-[#5f987f]">
                      <a href={mission.youtubeUrl} target="_blank" rel="noopener noreferrer">
                        운동 영상 보기
                        <ArrowUpRight aria-hidden="true" />
                      </a>
                    </Button>
                  </div>
                ) : null}

                {embedUrl ? (
                  <>
                    <Separator className="my-5 bg-[#ebd8b7]" />
                    <div className="overflow-hidden rounded-2xl border border-[#ebd8b7] bg-[#fff8ed]">
                      <div className="aspect-video w-full">
                        <iframe
                          src={embedUrl}
                          title={`${mission.title} 미션 영상`}
                          className="h-full w-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          referrerPolicy="strict-origin-when-cross-origin"
                          allowFullScreen
                        />
                      </div>
                    </div>
                  </>
                ) : null}
              </>
            ) : (
              <div className="rounded-2xl border border-[#ebd8b7] bg-[#fff8ed] px-4 py-4 text-[#5b4834]">
                선택한 날짜에는 등록된 운동 미션이 없습니다.
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
