import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getChallengeDateLabel, getChallengeOverview, getNotices } from "@/lib/challenge-repo";

function formatKRW(amount: number) {
  return new Intl.NumberFormat("ko-KR").format(amount);
}

export default function ChallengeInfoPage() {
  const challenge = getChallengeOverview();
  const notices = getNotices();

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_#ffffff_0%,_#eef6ff_42%,_#dff0ff_76%,_#cfe8ff_100%)]" />
      <div className="absolute -left-20 top-24 -z-10 h-64 w-64 rounded-full bg-[#8db8dc]/35 blur-3xl" />
      <div className="absolute -right-12 bottom-12 -z-10 h-72 w-72 rounded-full bg-[#dcf2ff]/55 blur-3xl" />

      <main id="main-content" className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <Card className="rounded-3xl border-border/80 bg-white/90 shadow-[0_10px_45px_-24px_rgba(22,64,124,0.35)] backdrop-blur">
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
                  <h1 className="text-balance text-2xl font-bold text-foreground sm:text-3xl">챌린지 핵심 정보</h1>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {challenge.title} · {getChallengeDateLabel(challenge.period.startDate)} -{" "}
                    {getChallengeDateLabel(challenge.period.endDate)}
                  </p>
                </div>
              </div>

              <Button
                asChild
                variant="outline"
                className="h-11 rounded-xl border-border bg-secondary text-secondary-foreground hover:bg-accent"
              >
                <Link href="/">
                  <ArrowLeft aria-hidden="true" />
                  운동 화면으로 돌아가기
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <section className="grid gap-6 md:grid-cols-2">
          <Card className="rounded-3xl border-border/80 bg-white/90 shadow-[0_10px_35px_-24px_rgba(22,64,124,0.33)] backdrop-blur">
            <CardHeader className="px-6 sm:px-8">
              <CardTitle className="text-xl text-foreground">운영 안내</CardTitle>
            </CardHeader>
            <CardContent className="px-6 text-sm text-muted-foreground sm:px-8">
              <ul className="space-y-3">
                <li>참가비: {formatKRW(challenge.entryFee.amountKRW)}원 (현금 제출)</li>
                <li>접수 마감: {getChallengeDateLabel(challenge.registration.deadlineDate)}</li>
                <li>접수 방식: {challenge.registration.submissionMethod}</li>
                <li>
                  최종 인바디 제출: {getChallengeDateLabel(challenge.finalInbodySubmission.startDate)} -{" "}
                  {getChallengeDateLabel(challenge.finalInbodySubmission.endDate)}
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-border/80 bg-white/90 shadow-[0_10px_35px_-24px_rgba(22,64,124,0.33)] backdrop-blur">
            <CardHeader className="px-6 sm:px-8">
              <CardTitle className="flex items-center gap-2 text-xl text-foreground">
                <Trophy aria-hidden="true" className="size-5" />
                상금 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 text-sm text-muted-foreground sm:px-8">
              <ul className="space-y-3">
                <li>남자 1등: {formatKRW(challenge.awards.male[0].amountKRW)}원</li>
                <li>여자 1등: {formatKRW(challenge.awards.female[0].amountKRW)}원</li>
                <li>식단상 1등: {formatKRW(challenge.awards.diet[0].amountKRW)}원</li>
                <li>
                  <Badge className="rounded-xl bg-accent px-3 py-2 text-accent-foreground">{challenge.awards.note}</Badge>
                </li>
              </ul>
            </CardContent>
          </Card>
        </section>

        <Card className="rounded-3xl border-border/80 bg-white/90 shadow-[0_10px_35px_-24px_rgba(22,64,124,0.33)] backdrop-blur">
          <CardHeader className="px-6 sm:px-8">
            <CardTitle className="text-xl text-foreground">점수 규칙</CardTitle>
          </CardHeader>
          <CardContent className="px-6 sm:px-8">
            <ul className="space-y-2 text-sm text-muted-foreground">
              {challenge.scoringRules.map((rule) => (
                <li key={rule.id} className="rounded-xl bg-secondary px-3 py-2">
                  {rule.description}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-border/80 bg-white/90 shadow-[0_10px_35px_-24px_rgba(22,64,124,0.33)] backdrop-blur">
          <CardHeader className="px-6 pb-4 sm:px-8">
            <CardTitle className="text-xl text-foreground">공지</CardTitle>
          </CardHeader>
          <Separator className="bg-border" />
          <CardContent className="px-6 pt-4 sm:px-8">
            <ul className="space-y-2 text-sm text-muted-foreground">
              {notices.map((notice) => (
                <li key={notice.id} className="rounded-xl bg-secondary px-3 py-2">
                  {notice.message}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
