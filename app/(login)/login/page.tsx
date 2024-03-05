"use client";
import LoginFlow from "./components/LoginFlow";

export default function Page({
  searchParams,
}: {
  searchParams: {
    signup_invite_token?: string;
    temporary_profile: string;
    invite_token: string;
    event: string;
  };
}) {
  return (
    <main className="px-4 mt-20 w-80 md:w-96 m-auto space-y-10 relative">
      <LoginFlow isDialog={false} />
      <div className="fixed md:absolute top-0 md:top-[-100px] left-[-100px] h-80 w-80 bg-primary rounded-full z-[-10] blur-2xl md:blur-3xl opacity-[0.05]" />
      <div className="fixed md:absolute bottom-[350px] md:bottom-[-200px] left-0 md:left-[100px] h-80 w-80 bg-primary rounded-full z-[-10] blur-2xl md:blur-3xl opacity-[0.05]" />
    </main>
  );
}
