import { Navigation } from '@/app/components/global/Navigation';
import { Footer } from '@/app/components/global/Footer';

export default function About() {
  return (
    <div className="bg-background min-h-screen">
      <Navigation />

      <main className="relative pt-24 pb-16 md:pt-30 lg:pt-36">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="mb-16 text-center">
            <h1 className="font-hf-mono mb-6 text-4xl font-bold tracking-tight text-[var(--deep-purple)] drop-shadow-[0_0_20px_rgba(0,255,170,0.6)] sm:text-5xl dark:text-[var(--neon-cyan)]">
              ABOUT_HACKERFLIX
            </h1>
            <div className="mx-auto mb-8 h-1 w-24 bg-gradient-to-r from-transparent via-[var(--electric-green)] to-transparent shadow-[0_0_20px_rgba(0,255,170,0.8)]" />
            <p className="text-muted-foreground mx-auto max-w-2xl text-xl">
              The premier streaming library for everything cyber, technology, security, privacy, and
              digital culture.
            </p>
          </div>

          {/* Mission Section */}
          <section className="mb-16">
            <h2 className="font-hf-mono mb-6 text-2xl font-bold tracking-tight text-[var(--deep-purple)] dark:text-[var(--neon-cyan)]">
              OUR_MISSION
            </h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-foreground mb-4 leading-relaxed">
                HackerFlix was born from a simple observation: the world of cybersecurity, hacking,
                privacy, and digital culture has produced some of the most compelling stories of our
                time, yet they remain scattered across the digital landscape.
              </p>
              <p className="text-foreground mb-4 leading-relaxed">
                We're building a curated home for documentaries, shows, and films that explore the
                intersection of technology and society. From legendary hacker stories to
                cutting-edge privacy documentaries, from surveillance state exposés to the pioneers
                who built the internet—we're archiving it all.
              </p>
              <p className="text-foreground leading-relaxed">
                Our mission is to make this content discoverable, accessible, and celebrated. Stay
                paranoid. Stay curious.
              </p>
            </div>
          </section>

          {/* What We Cover */}
          <section className="mb-16">
            <h2 className="font-hf-mono mb-8 text-2xl font-bold tracking-tight text-[var(--deep-purple)] dark:text-[var(--neon-cyan)]">
              CONTENT_CATEGORIES
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {[
                {
                  title: 'HACKING & SECURITY',
                  description:
                    'Deep dives into legendary hacks, security breaches, and the minds behind them.',
                },
                {
                  title: 'PRIVACY & SURVEILLANCE',
                  description:
                    'Stories about digital privacy, mass surveillance, and the fight for our data rights.',
                },
                {
                  title: 'TECH CULTURE',
                  description: 'The people, companies, and movements that shaped the digital age.',
                },
                {
                  title: 'CRYPTO & DARKNET',
                  description:
                    'Explorations of cryptocurrency, blockchain, and the hidden corners of the internet.',
                },
                {
                  title: 'WHISTLEBLOWERS',
                  description:
                    'The courageous individuals who exposed corruption and digital wrongdoing.',
                },
                {
                  title: 'OPEN SOURCE',
                  description:
                    'Celebrating the free software movement and collaborative innovation.',
                },
              ].map((category, index) => (
                <div
                  key={index}
                  className="group bg-card border-border rounded-xl border p-6 transition-all duration-300 hover:border-[var(--electric-green)]/40 hover:shadow-[0_0_30px_rgba(0,255,170,0.3)]"
                >
                  <h3 className="font-hf-mono mb-3 text-sm font-bold text-[var(--deep-purple)] transition-all duration-300 group-hover:drop-shadow-[0_0_10px_rgba(0,255,170,0.8)] dark:text-[var(--neon-cyan)]">
                    {category.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {category.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Values Section */}
          <section className="mb-16">
            <h2 className="font-hf-mono mb-8 text-2xl font-bold tracking-tight text-[var(--deep-purple)] dark:text-[var(--neon-cyan)]">
              CORE_VALUES
            </h2>
            <div className="space-y-6">
              {[
                {
                  icon: '🔐',
                  title: 'PRIVACY_FIRST',
                  description:
                    'We respect your privacy. No tracking, no data harvesting, no surveillance capitalism.',
                },
                {
                  icon: '🎯',
                  title: 'CURATED_QUALITY',
                  description:
                    'Every piece of content is hand-selected for its educational value and storytelling excellence.',
                },
                {
                  icon: '🌐',
                  title: 'OPEN_ACCESS',
                  description:
                    'Knowledge should be free. We link to content that is publicly available and properly attributed.',
                },
                {
                  icon: '⚡',
                  title: 'STAY_CURRENT',
                  description:
                    'The digital landscape evolves fast. We update our library with the latest documentaries and films.',
                },
              ].map((value, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex-shrink-0 text-3xl">{value.icon}</div>
                  <div>
                    <h3 className="font-hf-mono mb-2 text-lg font-bold text-[var(--deep-purple)] dark:text-[var(--neon-cyan)]">
                      {value.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Contact/Contribute Section */}
          <section className="bg-card mb-16 rounded-xl border border-[var(--deep-purple)]/20 p-8">
            <h2 className="font-hf-mono mb-4 text-2xl font-bold tracking-tight text-[var(--deep-purple)] dark:text-[var(--neon-cyan)]">
              JOIN_THE_COMMUNITY
            </h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              HackerFlix is a community-driven project. If you know of a documentary, film, or
              series that belongs in our library, we want to hear from you. Help us build the most
              comprehensive archive of tech culture content on the internet.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#"
                className="font-hf-mono inline-flex items-center rounded-lg bg-[var(--deep-purple)] px-6 py-3 font-bold text-white transition-all duration-300 hover:bg-[var(--deep-purple)]/80 hover:shadow-[0_0_25px_rgba(0,255,170,0.6)] hover:drop-shadow-[0_0_15px_rgba(0,255,170,0.8)]"
              >
                SUBMIT_CONTENT
              </a>
              <a
                href="#"
                className="font-hf-mono inline-flex items-center rounded-lg border-2 border-[var(--deep-purple)] px-6 py-3 font-bold text-[var(--deep-purple)] transition-all duration-300 hover:bg-[var(--deep-purple)]/10 hover:shadow-[0_0_25px_rgba(0,255,170,0.4)] dark:text-[var(--neon-cyan)]"
              >
                API_ACCESS
              </a>
            </div>
          </section>

          {/* Tech Stack */}
          <section className="text-center">
            <p className="font-hf-mono text-muted-foreground mb-2 text-sm">BUILT_WITH</p>
            <div className="flex flex-wrap justify-center gap-3 font-mono text-xs">
              {['REACT', 'TYPESCRIPT', 'TAILWIND', 'VITE'].map((tech) => (
                <span
                  key={tech}
                  className="bg-card rounded border border-[var(--deep-purple)]/30 px-3 py-1 text-[var(--deep-purple)] dark:text-[var(--neon-cyan)]"
                >
                  {tech}
                </span>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
