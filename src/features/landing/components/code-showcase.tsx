'use client';

import {
  Check,
  Code2,
  Copy,
  Cpu,
  Database,
  Shield,
  Terminal,
  Zap,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { ContentPageBackground } from '@/components/ui/backgrounds';
import { cn } from '@/lib/utils';

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

const codeSnippets = [
  {
    id: 'schema',
    label: 'Database Schema',
    icon: Database,
    language: 'prisma',
    code: `model Project {
  id        String   @id @default(cuid())
  name      String
  status    Status   @default(DRAFT)
  owner     User     @relation(fields: [ownerId], references: [id])
  ownerId   String
  tasks     Task[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([ownerId, status])
}

model Task {
  id          String   @id @default(cuid())
  title       String
  completed   Boolean  @default(false)
  project     Project  @relation(fields: [projectId], references: [id])
  projectId   String
  assignedTo  User?    @relation(fields: [userId], references: [id])
  userId      String?
}`,
  },
  {
    id: 'api',
    label: 'API Route',
    icon: Zap,
    language: 'typescript',
    code: `import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(req: Request) {
  const session = await auth();
  
  if (!session?.user) {
    return NextResponse.json(
      { error: 'Unauthorized' }, 
      { status: 401 }
    );
  }

  const projects = await prisma.project.findMany({
    where: { ownerId: session.user.id },
    include: {
      tasks: { take: 5 },
      _count: { select: { tasks: true } }
    },
    orderBy: { updatedAt: 'desc' }
  });

  return NextResponse.json({ projects });
}`,
  },
  {
    id: 'auth',
    label: 'Authentication',
    icon: Shield,
    language: 'typescript',
    code: `export const authConfig = {
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        const user = await verifyCredentials(credentials);
        
        if (!user) return null;
        
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          permissions: user.permissions
        };
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    })
  ],
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub;
      session.user.role = token.role;
      return session;
    }
  }
};`,
  },
  {
    id: 'edge',
    label: 'Edge Function',
    icon: Cpu,
    language: 'typescript',
    code: `export const config = {
  runtime: 'edge',
  regions: ['iad1', 'fra1']
};

export default async function handler(req: Request) {
  const start = Date.now();
  
  // AI Inference at the edge
  const result = await fetch('https://api.ai.run/v1/chat', {
    method: 'POST',
    headers: { 'Authorization': \`Bearer \${process.env.AI_KEY}\` },
    body: JSON.stringify({
      model: 'llama-3-8b',
      messages: [{ role: 'user', content: req.prompt }],
      stream: true
    })
  });

  return new Response(result.body, {
    headers: {
      'Content-Type': 'text/event-stream',
      'X-Response-Time': \`\${Date.now() - start}ms\`
    }
  });
}`,
  },
];

const techStack = [
  { label: 'TypeScript', desc: '100% typed', icon: '🔷' },
  { label: 'Prisma ORM', desc: 'Type-safe DB', icon: '📊' },
  { label: 'Next.js 15', desc: 'App Router', icon: '▲' },
  { label: 'Edge Ready', desc: 'Global latency', icon: '⚡' },
];

export function CodeShowcase() {
  const [activeTab, setActiveTab] = useState(codeSnippets[0]);
  const [copied, setCopied] = useState(false);
  const [typingText, setTypingText] = useState('');

  useEffect(() => {
    setTypingText('');
    let index = 0;
    const text = activeTab.code;

    const interval = setInterval(() => {
      if (index < text.length) {
        setTypingText(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 8);

    return () => clearInterval(interval);
  }, [activeTab]);

  const handleCopy = () => {
    navigator.clipboard.writeText(activeTab.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      className="py-24 relative overflow-hidden"
      aria-labelledby="code-heading"
    >
      <ContentPageBackground />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <header className="text-center mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6"
            >
              <Code2 className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-white/80">
                Developer Experience
              </span>
            </motion.div>

            <h2
              id="code-heading"
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight"
            >
              Код <span className="text-gradient">под капотом</span>
            </h2>
            <p className="text-base md:text-lg text-white/50 max-w-2xl mx-auto">
              Чистый, типизированный код с современными практиками. Полный
              контроль и прозрачность.
            </p>
          </motion.div>
        </header>

        {/* Code Editor */}
        <motion.article
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
          className="max-w-5xl mx-auto"
        >
          <div className="rounded-2xl overflow-hidden border border-white/10 bg-[#0d0d12] shadow-2xl shadow-black/50">
            {/* Editor Header */}
            <header className="flex items-center justify-between px-3 md:px-4 py-2.5 md:py-3 border-b border-white/5 bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-red-500/80" />
                  <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="ml-3 md:ml-4 flex items-center gap-2 px-2.5 py-1 rounded-md bg-white/5 text-white/40 text-xs">
                  <Terminal className="w-3 h-3" />
                  <span className="hidden sm:inline">
                    {activeTab.label.toLowerCase().replace(/\s/g, '-')}.ts
                  </span>
                  <span className="sm:hidden">{activeTab.id}.ts</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="p-1.5 md:p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/20 active:scale-95"
                  aria-label={copied ? 'Copied!' : 'Copy code'}
                  title={copied ? 'Copied!' : 'Copy code'}
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 md:w-4 md:h-4 text-green-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  )}
                </button>
              </div>
            </header>

            {/* Editor Body */}
            <div className="grid md:grid-cols-[180px_1fr] lg:grid-cols-[200px_1fr]">
              {/* Sidebar */}
              <nav
                className="hidden md:block border-r border-white/5 p-3 md:p-4"
                aria-label="Code Tabs"
              >
                <ul className="space-y-1">
                  {codeSnippets.map((snippet) => (
                    <li key={snippet.id}>
                      <button
                        onClick={() => setActiveTab(snippet)}
                        className={cn(
                          'w-full flex items-center gap-2.5 md:gap-3 px-2.5 md:px-3 py-2 md:py-2.5 rounded-lg text-left text-xs md:text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/10',
                          activeTab.id === snippet.id
                            ? 'bg-white/10 text-white'
                            : 'text-white/40 hover:text-white/70 hover:bg-white/5',
                        )}
                        aria-current={
                          activeTab.id === snippet.id ? 'true' : undefined
                        }
                      >
                        <snippet.icon
                          className={cn(
                            'w-3.5 h-3.5 md:w-4 md:h-4',
                            activeTab.id === snippet.id
                              ? 'text-primary'
                              : 'text-white/30',
                          )}
                        />
                        <span>{snippet.label}</span>
                      </button>
                    </li>
                  ))}
                </ul>

                {/* Stats */}
                <footer className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-white/5">
                  <h3 className="text-[10px] md:text-xs text-white/30 uppercase tracking-wider mb-3">
                    Build Stats
                  </h3>
                  <dl className="space-y-2">
                    <div className="flex justify-between text-xs md:text-sm">
                      <dt className="text-white/40">Bundle Size</dt>
                      <dd className="text-white/70">124KB</dd>
                    </div>
                    <div className="flex justify-between text-xs md:text-sm">
                      <dt className="text-white/40">Build Time</dt>
                      <dd className="text-white/70">1.2s</dd>
                    </div>
                    <div className="flex justify-between text-xs md:text-sm">
                      <dt className="text-white/40">Type Check</dt>
                      <dd className="text-green-400/70">Passed</dd>
                    </div>
                  </dl>
                </footer>
              </nav>

              {/* Code Area */}
              <section className="relative">
                {/* Mobile Tabs */}
                <nav
                  className="md:hidden flex overflow-x-auto border-b border-white/5 scrollbar-hide"
                  aria-label="Code Tabs Mobile"
                >
                  {codeSnippets.map((snippet) => (
                    <button
                      key={snippet.id}
                      onClick={() => setActiveTab(snippet)}
                      className={cn(
                        'flex items-center gap-2 px-3 md:px-4 py-2.5 text-xs md:text-sm whitespace-nowrap border-b-2 transition-colors duration-300 focus:outline-none',
                        activeTab.id === snippet.id
                          ? 'border-primary text-white'
                          : 'border-transparent text-white/40',
                      )}
                      aria-current={
                        activeTab.id === snippet.id ? 'true' : undefined
                      }
                    >
                      <snippet.icon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                      {snippet.label}
                    </button>
                  ))}
                </nav>

                {/* Code */}
                <div className="p-4 md:p-6 overflow-x-auto">
                  <pre className="font-mono text-xs md:text-sm leading-relaxed">
                    <code className="text-white/80">
                      {typingText}
                      <motion.span
                        animate={{ opacity: [1, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                        className="inline-block w-1.5 h-4 md:w-2 md:h-5 bg-primary ml-1"
                        aria-hidden="true"
                      />
                    </code>
                  </pre>
                </div>

                {/* Language Badge */}
                <div className="absolute bottom-3 right-3 md:bottom-4 md:right-4">
                  <span className="px-2.5 py-1 md:px-3 rounded-full text-[10px] md:text-xs font-medium bg-white/5 text-white/40 border border-white/10">
                    {activeTab.language}
                  </span>
                </div>
              </section>
            </div>
          </div>

          {/* Features */}
          <footer className="mt-6 md:mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {techStack.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, ease: EASE_OUT_EXPO }}
                className="text-center p-3 md:p-4 rounded-xl bg-white/[0.02] border border-white/5 transition-all duration-300 hover:bg-white/[0.04] hover:border-white/10"
              >
                <div
                  className="text-lg md:text-2xl mb-1.5 md:mb-2"
                  aria-hidden="true"
                >
                  {item.icon}
                </div>
                <div className="text-white font-medium text-xs md:text-sm">
                  {item.label}
                </div>
                <div className="text-white/40 text-[10px] md:text-xs">
                  {item.desc}
                </div>
              </motion.div>
            ))}
          </footer>
        </motion.article>
      </div>
    </section>
  );
}
