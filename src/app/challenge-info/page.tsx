import Link from "next/link";
import Image from "next/image";
import { getChallengeDateLabel, getChallengeOverview, getNotices } from "@/lib/challenge-repo";

function formatKRW(amount: number) {
  return new Intl.NumberFormat("ko-KR").format(amount);
}

export default function ChallengeInfoPage() {
  const challenge = getChallengeOverview();
  const notices = getNotices();

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_#fff5de_0%,_#ffedd2_36%,_#f7e6c4_72%,_#efdbb6_100%)]" />
      <div className="absolute -left-20 top-24 -z-10 h-64 w-64 rounded-full bg-[#f8c37a]/40 blur-3xl" />
      <div className="absolute -right-12 bottom-12 -z-10 h-72 w-72 rounded-full bg-[#84b19d]/25 blur-3xl" />

      <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <header className="rounded-3xl border border-[#e8cda1] bg-white/85 p-5 shadow-[0_10px_45px_-24px_rgba(113,73,7,0.5)] backdrop-blur sm:p-7">
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
                <h1 className="text-2xl font-bold text-[#2f2418] sm:text-3xl">챌린지 핵심 정보</h1>
                <p className="mt-1 text-sm text-[#5b4834]">
                  {challenge.title} · {getChallengeDateLabel(challenge.period.startDate)} -{" "}
                  {getChallengeDateLabel(challenge.period.endDate)}
                </p>
              </div>
            </div>
            <Link
              href="/"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-[#d8c19b] bg-[#fff5e5] px-4 text-sm font-semibold text-[#5b4632] transition hover:bg-[#fdeac8]"
            >
              운동 화면으로 돌아가기
            </Link>
          </div>
        </header>

        <section className="grid gap-6 md:grid-cols-2">
          <article className="rounded-3xl border border-[#e8cda1] bg-white/90 p-6 shadow-[0_10px_35px_-24px_rgba(80,45,9,0.55)] backdrop-blur sm:p-8">
            <h2 className="text-xl font-bold text-[#2f2418]">운영 안내</h2>
            <ul className="mt-4 space-y-3 text-sm text-[#4e3f30]">
              <li>참가비: {formatKRW(challenge.entryFee.amountKRW)}원 (현금 제출)</li>
              <li>접수 마감: {getChallengeDateLabel(challenge.registration.deadlineDate)}</li>
              <li>접수 방식: {challenge.registration.submissionMethod}</li>
              <li>
                최종 인바디 제출: {getChallengeDateLabel(challenge.finalInbodySubmission.startDate)} -{" "}
                {getChallengeDateLabel(challenge.finalInbodySubmission.endDate)}
              </li>
            </ul>
          </article>

          <article className="rounded-3xl border border-[#e8cda1] bg-white/90 p-6 shadow-[0_10px_35px_-24px_rgba(80,45,9,0.55)] backdrop-blur sm:p-8">
            <h2 className="text-xl font-bold text-[#2f2418]">상금 정보</h2>
            <ul className="mt-4 space-y-3 text-sm text-[#4e3f30]">
              <li>남자 1등: {formatKRW(challenge.awards.male[0].amountKRW)}원</li>
              <li>여자 1등: {formatKRW(challenge.awards.female[0].amountKRW)}원</li>
              <li>식단상 1등: {formatKRW(challenge.awards.diet[0].amountKRW)}원</li>
              <li className="rounded-xl bg-[#fff4e0] px-3 py-2">{challenge.awards.note}</li>
            </ul>
          </article>
        </section>

        <section className="rounded-3xl border border-[#e8cda1] bg-white/90 p-6 shadow-[0_10px_35px_-24px_rgba(80,45,9,0.55)] backdrop-blur sm:p-8">
          <h2 className="text-xl font-bold text-[#2f2418]">점수 규칙</h2>
          <ul className="mt-4 space-y-2 text-sm text-[#4e3f30]">
            {challenge.scoringRules.map((rule) => (
              <li key={rule.id} className="rounded-xl bg-[#fff4e0] px-3 py-2">
                {rule.description}
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-3xl border border-[#e8cda1] bg-white/90 p-6 shadow-[0_10px_35px_-24px_rgba(80,45,9,0.55)] backdrop-blur sm:p-8">
          <h2 className="text-xl font-bold text-[#2f2418]">공지</h2>
          <ul className="mt-4 space-y-2 text-sm text-[#4e3f30]">
            {notices.map((notice) => (
              <li key={notice.id} className="rounded-xl bg-[#eef5ed] px-3 py-2">
                {notice.message}
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
