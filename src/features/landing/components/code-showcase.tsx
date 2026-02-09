'use client';

import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { 
  Terminal, 
  Copy, 
  Check, 
  Play,
  Database,
  Zap,
  Shield,
  Cpu,
  Code2
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { ContentPageBackground } from '@/shared/components/ui/backgrounds';

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
    <section className="py-24 relative overflow-hidden">
      <ContentPageBackground />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6"
          >
            <Code2 className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-white/80">Developer Experience</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Код <span className="text-gradient">под капотом</span>
          </h2>
          <p className="text-lg text-white/50 max-w-2xl mx-auto">
            Чистый, типизированный код с современными практиками. 
            Полный контроль и прозрачность.
          </p>
        </motion.div>

        {/* Code Editor */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto"
        >
          <div className="rounded-2xl overflow-hidden border border-white/10 bg-[#0d0d12] shadow-2xl shadow-black/50">
            {/* Editor Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="ml-4 flex items-center gap-2 px-3 py-1 rounded-md bg-white/5 text-white/40 text-xs">
                  <Terminal className="w-3 h-3" />
                  <span>{activeTab.label.toLowerCase().replace(/\s/g, '-')}.ts</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Editor Body */}
            <div className="grid md:grid-cols-[200px_1fr]">
              {/* Sidebar */}
              <div className="hidden md:block border-r border-white/5 p-4">
                <div className="space-y-1">
                  {codeSnippets.map((snippet) => (
                    <button
                      key={snippet.id}
                      onClick={() => setActiveTab(snippet)}
                      className={cn(
                        'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm transition-all',
                        activeTab.id === snippet.id
                          ? 'bg-white/10 text-white'
                          : 'text-white/40 hover:text-white/70 hover:bg-white/5'
                      )}
                    >
                      <snippet.icon className={cn(
                        'w-4 h-4',
                        activeTab.id === snippet.id ? 'text-primary' : 'text-white/30'
                      )} />
                      <span>{snippet.label}</span>
                    </button>
                  ))}
                </div>

                {/* Stats */}
                <div className="mt-8 pt-6 border-t border-white/5">
                  <div className="text-xs text-white/30 uppercase tracking-wider mb-3">Build Stats</div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/40">Bundle Size</span>
                      <span className="text-white/70">124KB</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/40">Build Time</span>
                      <span className="text-white/70">1.2s</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/40">Type Check</span>
                      <span className="text-green-400/70">Passed</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Code Area */}
              <div className="relative">
                {/* Mobile Tabs */}
                <div className="md:hidden flex overflow-x-auto border-b border-white/5">
                  {codeSnippets.map((snippet) => (
                    <button
                      key={snippet.id}
                      onClick={() => setActiveTab(snippet)}
                      className={cn(
                        'flex items-center gap-2 px-4 py-3 text-sm whitespace-nowrap border-b-2 transition-colors',
                        activeTab.id === snippet.id
                          ? 'border-primary text-white'
                          : 'border-transparent text-white/40'
                      )}
                    >
                      <snippet.icon className="w-4 h-4" />
                      {snippet.label}
                    </button>
                  ))}
                </div>

                {/* Code */}
                <div className="p-6 overflow-x-auto">
                  <pre className="font-mono text-sm leading-relaxed">
                    <code className="text-white/80">
                      {typingText}
                      <motion.span
                        animate={{ opacity: [1, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                        className="inline-block w-2 h-5 bg-primary ml-1"
                      />
                    </code>
                  </pre>
                </div>

                {/* Language Badge */}
                <div className="absolute bottom-4 right-4">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 text-white/40 border border-white/10">
                    {activeTab.language}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'TypeScript', desc: '100% typed', icon: '🔷' },
              { label: 'Prisma ORM', desc: 'Type-safe DB', icon: '📊' },
              { label: 'Next.js 15', desc: 'App Router', icon: '▲' },
              { label: 'Edge Ready', desc: 'Global latency', icon: '⚡' },
            ].map((item) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center p-4 rounded-xl bg-white/[0.02] border border-white/5"
              >
                <div className="text-2xl mb-2">{item.icon}</div>
                <div className="text-white font-medium text-sm">{item.label}</div>
                <div className="text-white/40 text-xs">{item.desc}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
