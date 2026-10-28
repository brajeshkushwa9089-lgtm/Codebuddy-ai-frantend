import React from 'react';
import { Terminal, Sparkles, Brain, Code2, Rocket, CheckCircle2 } from 'lucide-react';

export default function AuthHero() {
  const features = [
    {
      icon: Sparkles,
      title: 'AI Code Assistant',
      description: 'Get instant solutions and explanations.',
      accentColor: 'text-cerulean',
      bgGlow: 'from-cerulean/20 to-transparent',
    },
    {
      icon: Brain,
      title: 'Better Learning',
      description: 'Understand concepts step by step.',
      accentColor: 'text-neonRose',
      bgGlow: 'from-neonRose/20 to-transparent',
    },
    {
      icon: Rocket,
      title: 'Build Real Projects',
      description: 'Turn your ideas into working code.',
      accentColor: 'text-cerulean',
      bgGlow: 'from-cerulean/20 to-transparent',
    },
  ];

  return (
    <div className="relative flex-1 flex flex-col justify-between p-8 lg:p-14 overflow-hidden select-none">
      {/* Background Ambient Glows */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-cerulean/15 rounded-full blur-3xl pointer-events-none animate-pulseGlow" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-neonRose/15 rounded-full blur-3xl pointer-events-none animate-pulseGlow" />
      <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cerulean/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Branding */}
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-cerulean to-neonRose rounded-2xl blur-sm opacity-70 group-hover:opacity-100 transition duration-300" />
            <div className="relative w-12 h-12 rounded-xl bg-navy flex items-center justify-center border border-navy-border shadow-md">
              <Terminal className="w-6 h-6 text-cerulean" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight text-[#F8FAFC]">
                CodeBuddy <span className="text-transparent bg-clip-text bg-gradient-to-r from-cerulean to-neonRose">AI</span>
              </span>
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-cerulean">
              Understand the Logic.
            </p>
          </div>
        </div>

        {/* Main Heading & Supporting Text */}
        <div className="max-w-xl mt-4">
          <h1 className="text-3xl lg:text-4xl font-extrabold text-[#F8FAFC] tracking-tight leading-tight">
            Your AI-Powered{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cerulean via-sky-300 to-neonRose">
              Coding Companion.
            </span>
          </h1>
          <p className="mt-3 text-sm lg:text-base text-[#94A3B8] leading-relaxed">
            Learn, build and grow with CodeBuddy AI.
          </p>
        </div>

        {/* Three Feature Highlights */}
        <div className="mt-8 space-y-3.5 max-w-lg">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="group relative flex items-start gap-3.5 p-3.5 rounded-2xl bg-navy/60 hover:bg-navy/90 border border-navy-border/80 hover:border-cerulean/40 transition-all duration-300"
              >
                <div className={`p-2 rounded-xl bg-jet border border-navy-border ${feature.accentColor} shrink-0 group-hover:scale-105 transition-transform`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xs font-semibold text-[#F8FAFC] flex items-center gap-1.5">
                    {feature.title}
                    <CheckCircle2 className="w-3.5 h-3.5 text-cerulean/80 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h3>
                  <p className="text-xs text-[#94A3B8] mt-0.5">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Middle Neon-Style Terminal Illustration */}
      <div className="relative z-10 my-8 max-w-lg">
        <div className="relative group">
          {/* Subtle Outer Neon Glow */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-cerulean/40 via-sky-500/20 to-neonRose/40 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-500" />
          
          <div className="relative rounded-2xl bg-jet/90 border border-navy-border/90 overflow-hidden shadow-2xl backdrop-blur-xl">
            {/* Terminal Window Header */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-navy/80 border-b border-navy-border/80">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#FF2DAA]/80 inline-block shadow-sm shadow-[#FF2DAA]/50" />
                <span className="w-3 h-3 rounded-full bg-amber-400/80 inline-block shadow-sm shadow-amber-400/50" />
                <span className="w-3 h-3 rounded-full bg-emerald-400/80 inline-block shadow-sm shadow-emerald-400/50" />
                <span className="ml-2 text-[11px] font-mono text-slate-400 font-medium">logic_engine.py</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono text-cerulean bg-cerulean/10 border border-cerulean/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-cerulean animate-ping" />
                  AI Ready
                </span>
              </div>
            </div>

            {/* Terminal Code Mockup */}
            <div className="p-4 font-mono text-xs leading-relaxed text-slate-300 overflow-x-auto space-y-1">
              <div className="text-slate-500"># 🧠 CodeBuddy AI — Understand The Logic</div>
              <div>
                <span className="text-neonRose font-semibold">def</span>{' '}
                <span className="text-cerulean font-semibold">master_code</span>
                <span className="text-slate-400">(student, problem):</span>
              </div>
              <div className="pl-4">
                <span className="text-slate-400">logic = ai.</span>
                <span className="text-sky-300">explain_step_by_step</span>
                <span className="text-slate-400">(problem)</span>
              </div>
              <div className="pl-4">
                <span className="text-slate-400">hint  = ai.</span>
                <span className="text-sky-300">progressive_hints</span>
                <span className="text-slate-400">(level=1)</span>
              </div>
              <div className="pl-4 text-emerald-400">
                <span className="text-neonRose font-semibold">return</span>{' '}
                <span>student.build_with_confidence(logic, hint)</span>
              </div>
              <div className="pt-2 text-slate-500 flex items-center gap-2">
                <span className="text-emerald-400">✔</span>
                <span>Output: Concept Mastered & Ready for Production</span>
                <span className="w-1.5 h-3.5 bg-cerulean animate-pulse inline-block" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Slogan Badge */}
      <div className="relative z-10 pt-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-navy/80 border border-cerulean/30 text-xs font-semibold text-[#F8FAFC] shadow-sm">
          <Code2 className="w-3.5 h-3.5 text-neonRose" />
          <span>Code Smarter, Not Harder.</span>
        </div>
      </div>
    </div>
  );
}
