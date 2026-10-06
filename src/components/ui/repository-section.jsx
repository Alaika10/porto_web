import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import dynamic from 'next/dynamic';
import Image from 'next/image';

const ContributionSkyline = dynamic(
  () => import('@/components/ui/contribution-skyline'),
  { ssr: false, loading: () => <div style={{ height: '300px' }} /> }
);
import { 
  FolderGit2, 
  Star, 
  GitFork, 
  ArrowUpRight, 
  BookOpen, 
  Code2, 
  Sparkles,
  ExternalLink,
  Layers,
  Terminal,
  Cpu,
  CheckCircle2,
  Calendar
} from 'lucide-react';

const GITHUB_USERNAME = 'Alaika10';
const GITHUB_PROFILE_URL = `https://github.com/${GITHUB_USERNAME}`;

// Pinned & real repositories from https://github.com/Alaika10
const REPOSITORIES = [
  {
    name: 'strukly_AI_UMKM',
    owner: 'Alaika10',
    description: 'Platform AI inovatif untuk digitalisasi struk, manajemen transaksi, dan analisis otomatis bagi pelaku UMKM.',
    language: 'Python',
    langColor: '#3572A5',
    stars: 1,
    forks: 1,
    url: `https://github.com/Alaika10/strukly_AI_UMKM`,
    license: 'MIT',
    badge: 'AI & Data Science',
  },
  {
    name: 'web_next',
    owner: 'Alaika10',
    description: 'Modern full-stack web application built with Next.js, TypeScript, and Tailwind CSS. Live deployed on Vercel.',
    language: 'TypeScript',
    langColor: '#3178c6',
    stars: 1,
    forks: 0,
    url: `https://github.com/Alaika10/web_next`,
    homepage: 'https://alexdatalabs.vercel.app',
    license: 'MIT',
    badge: 'Full Stack Web',
  },
  {
    name: 'submission-2',
    owner: 'Alaika10',
    description: 'End-to-end Machine Learning model development, exploratory data analysis, and predictive model evaluation.',
    language: 'Jupyter Notebook',
    langColor: '#DA5B0B',
    stars: 0,
    forks: 0,
    url: `https://github.com/Alaika10/submission-2`,
    license: 'Open Source',
    badge: 'Machine Learning',
  },
  {
    name: 'datalabs-v2',
    owner: 'Alaika10',
    description: 'Interactive analytics dashboard and data science experimental laboratory with responsive visualization charts.',
    language: 'JavaScript',
    langColor: '#f1e05a',
    stars: 0,
    forks: 0,
    url: `https://github.com/Alaika10/datalabs-v2`,
    license: 'MIT',
    badge: 'Data Analytics',
  },
  {
    name: 'Alaika-web',
    owner: 'Alaika10',
    description: 'Personal web engineering space featuring responsive UI components, animations, and TypeScript architecture.',
    language: 'TypeScript',
    langColor: '#3178c6',
    stars: 0,
    forks: 0,
    url: `https://github.com/Alaika10/Alaika-web`,
    license: 'MIT',
    badge: 'Web Engineering',
  },
  {
    name: 'VolunterPembuatanAplikasi',
    owner: 'Alaika10',
    description: 'Collaborative application engineering with Git branching workflows, code reviews, and modular component design.',
    language: 'JavaScript',
    langColor: '#f1e05a',
    stars: 0,
    forks: 0,
    url: `https://github.com/Alaika10/VolunterPembuatanAplikasi`,
    license: 'Open Source',
    badge: 'Open Collaboration',
  },
];

export function RepositorySection() {
  const [contributionData, setContributionData] = useState(null);
  const [totalContributions, setTotalContributions] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch live contributions from GitHub API for @Alaika10
    let isMounted = true;
    async function fetchContributions() {
      try {
        const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}?y=last`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data?.contributions) {
            setContributionData(data.contributions);
            if (data.total?.lastYear) {
              setTotalContributions(data.total.lastYear);
            }
          }
        }
      } catch (err) {
        console.warn('Live GitHub contribution fetch fell back to generator:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    fetchContributions();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section id="repository" className="repository-section relative w-full py-28 bg-[#f0f1f1] text-[#111418] border-t border-black/5 overflow-hidden">
      {/* Subtle background grid pattern */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40" 
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.06) 1px, transparent 1px)',
          backgroundSize: '28px 28px'
        }}
        aria-hidden="true" 
      />

      <div className="relative max-w-[1240px] mx-auto px-6 sm:px-10 lg:px-12 z-10">
        
        {/* ── Section Header ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/[0.05] border border-black/[0.08] text-xs font-bold uppercase tracking-[0.2em] text-[#57606a] mb-4"
            >
              <FolderGit2 size={13} className="text-black/60" />
              <span>GitHub & Open Source</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0d1117] leading-[1.1]"
            >
              Activity Skyline & <br className="hidden sm:inline" />
              <em className="font-serif italic font-normal text-black/70">@{GITHUB_USERNAME} Repositories</em>
            </motion.h2>
          </div>

          {/* GitHub Profile Pill Card */}
          <motion.a
            href={GITHUB_PROFILE_URL}
            target="_blank"
            rel="noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="group p-4 rounded-2xl bg-white/80 hover:bg-white border border-black/[0.08] hover:border-black/20 shadow-sm hover:shadow-md transition-all flex items-center gap-4 max-w-sm"
          >
            <Image
              src={`https://avatars.githubusercontent.com/u/128287471?v=4`}
              alt={GITHUB_USERNAME}
              width={48}
              height={48}
              className="rounded-full border border-black/10 object-cover"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 font-bold text-sm text-[#0d1117]">
                <span>@{GITHUB_USERNAME}</span>
                <CheckCircle2 size={14} className="text-emerald-600 inline" />
              </div>
              <p className="text-xs text-[#57606a] truncate">
                github.com/{GITHUB_USERNAME}
              </p>
            </div>
            <span className="p-2 rounded-full bg-black/[0.05] group-hover:bg-black group-hover:text-white transition-colors">
              <ArrowUpRight size={15} />
            </span>
          </motion.a>
        </div>

        {/* ── Contribution Skyline (Heatmap + 3D Isometric View) ── */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.75, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-14 rounded-3xl bg-white/85 backdrop-blur-md border border-black/[0.08] p-3 sm:p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)] transition-all duration-500"
        >
          <ContributionSkyline 
            data={contributionData || undefined}
            defaultView="3d" 
            palette="github" 
            heightScale={1.2}
            orbit={true}
            showStats={true}
            title={
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#0d1117]">
                  {totalContributions ? `${totalContributions} contributions` : 'GitHub Activity Skyline'}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-800 font-semibold border border-emerald-500/20 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live @{GITHUB_USERNAME}
                </span>
              </div>
            }
          />
        </motion.div>

        {/* ── Featured Repositories Grid ── */}
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg sm:text-xl font-bold tracking-tight text-[#0d1117] flex items-center gap-2">
            <BookOpen size={18} className="text-black/60" />
            <span>Public Repositories ({REPOSITORIES.length})</span>
          </h3>
          <a
            href={GITHUB_PROFILE_URL}
            target="_blank"
            rel="noreferrer"
            className="text-xs sm:text-sm font-semibold text-black/70 hover:text-black flex items-center gap-1 group"
          >
            <span>View All Repositories on GitHub</span>
            <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {REPOSITORIES.map((repo, idx) => (
            <motion.a
              key={repo.name}
              href={repo.url}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: idx * 0.07, ease: [0.16, 1, 0.3, 1] }}
              className="group relative flex flex-col justify-between p-6 rounded-2xl bg-white/75 backdrop-blur-md border border-black/[0.08] hover:border-black/20 hover:bg-white hover:-translate-y-1.5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.06)] transition-all duration-300"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-mono text-black/40 font-semibold">{repo.owner} /</span>
                    <h4 className="text-base font-bold text-[#0d1117] group-hover:text-emerald-700 transition-colors">
                      {repo.name}
                    </h4>
                  </div>
                  <span className="p-1 rounded-full text-black/40 group-hover:text-black group-hover:bg-black/5 transition-all">
                    <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </span>
                </div>

                {repo.badge && (
                  <span className="inline-block mb-3 px-2 py-0.5 rounded-md bg-black/[0.04] text-[#4b5563] text-[10px] font-semibold uppercase tracking-wider">
                    {repo.badge}
                  </span>
                )}

                <p className="text-xs sm:text-sm text-[#57606a] leading-relaxed mb-6">
                  {repo.description}
                </p>
              </div>

              <div className="pt-4 border-t border-black/[0.06] flex items-center justify-between text-xs text-[#57606a]">
                <div className="flex items-center gap-4">
                  {/* Language */}
                  <div className="flex items-center gap-1.5 font-medium">
                    <span 
                      className="w-2.5 h-2.5 rounded-full" 
                      style={{ backgroundColor: repo.langColor }} 
                    />
                    <span>{repo.language}</span>
                  </div>

                  {/* Stars */}
                  <div className="flex items-center gap-1">
                    <Star size={13} className="text-amber-500 fill-amber-500/20" />
                    <span>{repo.stars}</span>
                  </div>

                  {/* Forks */}
                  <div className="flex items-center gap-1">
                    <GitFork size={13} className="text-black/50" />
                    <span>{repo.forks}</span>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-black/[0.04] text-black/60">
                  {repo.license}
                </span>
              </div>
            </motion.a>
          ))}
        </div>

        {/* ── Direct GitHub CTA Bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-14 p-6 sm:p-8 rounded-3xl bg-white/90 backdrop-blur-md border border-black/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#0d1117]">Follow @{GITHUB_USERNAME} on GitHub</h4>
              <p className="text-xs text-[#57606a]">Explore commits, pull requests, and stars across open-source work</p>
            </div>
          </div>

          <a
            href={GITHUB_PROFILE_URL}
            target="_blank"
            rel="noreferrer"
            className="whitespace-nowrap px-5 py-2.5 rounded-full bg-[#111418] text-white font-semibold text-xs hover:bg-black hover:scale-105 transition-all inline-flex items-center gap-2 shadow-md"
          >
            <span>Visit Profile</span>
            <ArrowUpRight size={14} />
          </a>
        </motion.div>

      </div>
    </section>
  );
}
