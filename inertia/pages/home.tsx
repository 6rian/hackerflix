import { Head } from '@inertiajs/react';

export default function Home() {
  return (
    <>
      <Head title="HackerFlix" />
      <main className="flex min-h-screen items-center justify-center bg-gray-950 text-white">
        <h1 className="text-4xl font-bold tracking-tight text-purple-400">HackerFlix</h1>
      </main>
    </>
  );
}
