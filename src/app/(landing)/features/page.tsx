'use client';

import {
  ArrowRight,
  Bot,
  Braces,
  Check,
  Cloud,
  Code2,
  Cpu,
  Database,
  Eye,
  EyeOff,
  FileCode,
  Gauge,
  GitBranch,
  Globe,
  Image,
  Key,
  Layers,
  LayoutGrid,
  Lock,
  MousePointer2,
  Play,
  Send,
  Server,
  Shield,
  Sparkles,
  Table,
  Terminal,
  Type,
  Users,
  Webhook,
  Wifi,
  Workflow,
  Zap,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  ContentPageBackground,
  FeaturesBackground,
} from '@/components/ui/backgrounds';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// ==================== MEANINGFUL ANIMATION COMPONENTS ====================

// 1. Builder - Real drag and drop interface
function BuilderAnimation({ color }: { color: string }) {
  const [components, setComponents] = useState([
    { id: 1, type: 'header', x: 10, y: 10, w: 140, h: 25 },
    { id: 2, type: 'text', x: 10, y: 45, w: 90, h: 20 },
    { id: 3, type: 'button', x: 110, y: 45, w: 40, h: 20 },
  ]);

  const [draggedId, setDraggedId] = useState<number | null>(null);
  const [sidebarHover, setSidebarHover] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate dragging
      setDraggedId(2);
      setTimeout(() => {
        setComponents((prev) =>
          prev.map((c) => (c.id === 2 ? { ...c, y: 75 } : c)),
        );
        setTimeout(() => setDraggedId(null), 500);
      }, 800);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 flex">
      {/* Sidebar with components */}
      <div className="w-12 border-r border-white/10 bg-white/5 p-1.5 space-y-2">
        {['header', 'text', 'button', 'image'].map((type) => (
          <motion.div
            key={type}
            onMouseEnter={() => setSidebarHover(type)}
            onMouseLeave={() => setSidebarHover(null)}
            className="w-8 h-8 rounded bg-white/10 flex items-center justify-center cursor-grab"
            whileHover={{ scale: 1.1, backgroundColor: `${color}40` }}
          >
            {type === 'header' && <Type className="w-4 h-4 text-white/60" />}
            {type === 'text' && (
              <span className="text-[8px] text-white/60">T</span>
            )}
            {type === 'button' && (
              <div className="w-4 h-2 rounded-sm bg-white/60" />
            )}
            {type === 'image' && <Image className="w-4 h-4 text-white/60" />}
          </motion.div>
        ))}
      </div>

      {/* Canvas */}
      <div className="flex-1 p-3 relative bg-black/20">
        <div className="absolute top-2 right-2 flex gap-1">
          <div className="w-16 h-4 rounded bg-white/10 flex items-center justify-center text-[6px] text-white/40">
            Desktop
          </div>
          <div className="w-12 h-4 rounded bg-white/5 flex items-center justify-center text-[6px] text-white/30">
            Mobile
          </div>
        </div>

        {components.map((comp) => (
          <motion.div
            key={comp.id}
            className={cn(
              'absolute rounded border-2 flex items-center justify-center',
              draggedId === comp.id
                ? 'border-primary z-10 shadow-lg'
                : 'border-white/20',
            )}
            style={{
              left: comp.x,
              top: comp.y,
              width: comp.w,
              height: comp.h,
              backgroundColor:
                draggedId === comp.id ? `${color}30` : 'rgba(255,255,255,0.05)',
            }}
            animate={
              draggedId === comp.id
                ? {
                    scale: [1, 1.05, 1],
                    boxShadow: [
                      `0 0 0 ${color}00`,
                      `0 0 20px ${color}60`,
                      `0 0 0 ${color}00`,
                    ],
                  }
                : {}
            }
            transition={{ duration: 0.5 }}
          >
            {comp.type === 'header' && (
              <div className="w-3/4 h-2 rounded-full bg-white/40" />
            )}
            {comp.type === 'text' && (
              <div className="w-full px-1 space-y-1">
                <div className="h-1.5 rounded-full bg-white/30 w-full" />
                <div className="h-1.5 rounded-full bg-white/30 w-2/3" />
              </div>
            )}
            {comp.type === 'button' && (
              <div className="px-2 py-0.5 rounded bg-white/30 text-[6px] text-white">
                Click
              </div>
            )}
          </motion.div>
        ))}

        {/* Grid lines */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />
      </div>
    </div>
  );
}

// 2. Workflow - Real automation flow
function WorkflowAnimation({ color }: { color: string }) {
  const [activeNode, setActiveNode] = useState(0);
  const [running, setRunning] = useState(true);

  const nodes = [
    { id: 0, type: 'trigger', label: 'New User', icon: Users, x: 20, y: 50 },
    { id: 1, type: 'condition', label: 'Check Plan', icon: Eye, x: 70, y: 50 },
    { id: 2, type: 'action', label: 'Send Email', icon: Send, x: 120, y: 30 },
    {
      id: 3,
      type: 'action',
      label: 'Create DB',
      icon: Database,
      x: 120,
      y: 70,
    },
  ];

  const connections = [
    { from: 0, to: 1 },
    { from: 1, to: 2, label: 'Pro' },
    { from: 1, to: 3, label: 'Free' },
  ];

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      setActiveNode((prev) => (prev + 1) % 4);
    }, 1500);
    return () => clearInterval(interval);
  }, [running]);

  return (
    <div className="absolute inset-0 p-3">
      <svg className="w-full h-full" viewBox="0 0 150 100">
        {/* Connections */}
        {connections.map((conn, i) => {
          const fromNode = nodes[conn.from];
          const toNode = nodes[conn.to];
          const isActive = activeNode === conn.from;

          return (
            <g key={i}>
              <motion.path
                d={`M ${fromNode.x + 15} ${fromNode.y} L ${toNode.x - 15} ${toNode.y}`}
                fill="none"
                stroke={isActive ? color : 'rgba(255,255,255,0.2)'}
                strokeWidth="2"
                markerEnd="url(#arrowhead)"
                animate={
                  isActive
                    ? {
                        strokeDasharray: ['0,10', '10,0'],
                      }
                    : {}
                }
                transition={{ duration: 0.5 }}
              />
              {conn.label && (
                <text
                  x={(fromNode.x + toNode.x) / 2}
                  y={(fromNode.y + toNode.y) / 2 - 5}
                  fill="rgba(255,255,255,0.4)"
                  fontSize="6"
                  textAnchor="middle"
                >
                  {conn.label}
                </text>
              )}
            </g>
          );
        })}

        <defs>
          <marker
            id="arrowhead"
            markerWidth="6"
            markerHeight="6"
            refX="5"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 6 3, 0 6" fill={color} />
          </marker>
        </defs>

        {/* Nodes */}
        {nodes.map((node) => {
          const Icon = node.icon;
          const isActive = activeNode === node.id;

          return (
            <motion.g key={node.id}>
              <motion.rect
                x={node.x - 15}
                y={node.y - 12}
                width="30"
                height="24"
                rx="4"
                fill={isActive ? `${color}40` : 'rgba(255,255,255,0.05)'}
                stroke={isActive ? color : 'rgba(255,255,255,0.2)'}
                strokeWidth="1"
                animate={
                  isActive
                    ? {
                        scale: [1, 1.1, 1],
                        filter: [
                          `drop-shadow(0 0 0 ${color}00)`,
                          `drop-shadow(0 0 8px ${color}80)`,
                          `drop-shadow(0 0 0 ${color}00)`,
                        ],
                      }
                    : {}
                }
                transition={{ duration: 0.5 }}
              />
              <foreignObject
                x={node.x - 8}
                y={node.y - 8}
                width="16"
                height="16"
              >
                <Icon
                  className="w-4 h-4"
                  style={{
                    color: isActive ? 'white' : 'rgba(255,255,255,0.5)',
                  }}
                />
              </foreignObject>
              <text
                x={node.x}
                y={node.y + 20}
                fill="rgba(255,255,255,0.5)"
                fontSize="5"
                textAnchor="middle"
              >
                {node.label}
              </text>
            </motion.g>
          );
        })}

        {/* Running indicator */}
        <circle cx="140" cy="10" r="3" fill={running ? '#22c55e' : '#ef4444'} />
        <text
          x="130"
          y="12"
          fill="rgba(255,255,255,0.4)"
          fontSize="5"
          textAnchor="end"
        >
          {running ? 'Running' : 'Paused'}
        </text>
      </svg>
    </div>
  );
}

// 3. AI - Real chat interface with code generation
function AIAnimation({ color }: { color: string }) {
  const [messages, setMessages] = useState([
    { type: 'user', text: 'Create a user auth form', time: 0 },
    { type: 'ai', text: 'Generating component...', time: 1 },
  ]);
  const [showCode, setShowCode] = useState(false);

  const codeLines = [
    '<form className="space-y-4">',
    '  <Input type="email" />',
    '  <Input type="password" />',
    '  <Button>Sign In</Button>',
    '</form>',
  ];

  useEffect(() => {
    const timer = setTimeout(() => setShowCode(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="absolute inset-0 p-2 flex flex-col">
      {/* Chat header */}
      <div className="flex items-center gap-2 px-2 py-1.5 border-b border-white/10 bg-white/5 rounded-t-lg">
        <div
          className="w-4 h-4 rounded-full flex items-center justify-center"
          style={{ backgroundColor: `${color}40` }}
        >
          <Sparkles className="w-2.5 h-2.5" style={{ color }} />
        </div>
        <span className="text-[8px] text-white/60">AI Assistant</span>
        <div className="ml-auto flex gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-2 space-y-2 overflow-hidden">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              'text-[8px] p-1.5 rounded-lg max-w-[85%]',
              msg.type === 'user'
                ? 'bg-white/10 ml-auto text-white/80'
                : 'bg-white/5 text-white/60',
            )}
          >
            {msg.text}
          </motion.div>
        ))}

        {/* Generated code preview */}
        <AnimatePresence>
          {showCode && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="rounded-lg bg-black/40 border border-white/10 p-2 font-mospace"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[6px] text-white/40">
                  Generated Component
                </span>
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-red-500/50" />
                  <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                  <div className="w-2 h-2 rounded-full bg-green-500/50" />
                </div>
              </div>
              <div className="space-y-0.5">
                {codeLines.map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.2 }}
                    className="text-[7px] text-green-400/80"
                  >
                    <span className="text-white/30">{i + 1}</span> {line}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input */}
      <div className="p-1.5 border-t border-white/10">
        <div className="h-5 rounded bg-white/5 border border-white/10 flex items-center px-2">
          <span className="text-[8px] text-white/30">Type a message...</span>
          <motion.div
            className="w-0.5 h-3 bg-white/40 ml-0.5"
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        </div>
      </div>
    </div>
  );
}

// 4. Database - Real schema editor
function DatabaseAnimation({ color }: { color: string }) {
  const [activeTable, setActiveTable] = useState<'users' | 'posts' | null>(
    null,
  );
  const [highlightedRelation, setHighlightedRelation] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTable('users');
      setTimeout(() => {
        setHighlightedRelation(true);
        setTimeout(() => {
          setActiveTable('posts');
          setTimeout(() => {
            setActiveTable(null);
            setHighlightedRelation(false);
          }, 1500);
        }, 1500);
      }, 1000);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 p-3">
      {/* Users Table */}
      <motion.div
        className={cn(
          'absolute left-2 top-4 w-20 rounded-lg border overflow-hidden',
          activeTable === 'users' ? 'border-primary' : 'border-white/20',
        )}
        animate={
          activeTable === 'users'
            ? {
                boxShadow: [
                  `0 0 0 ${color}00`,
                  `0 0 15px ${color}60`,
                  `0 0 0 ${color}00`,
                ],
                scale: [1, 1.02, 1],
              }
            : {}
        }
        transition={{ duration: 0.5 }}
      >
        <div
          className="h-5 flex items-center px-2 gap-1.5"
          style={{ backgroundColor: `${color}30` }}
        >
          <Table className="w-3 h-3 text-white/80" />
          <span className="text-[8px] font-medium text-white">users</span>
        </div>
        <div className="p-1.5 space-y-1">
          {['id', 'email', 'name', 'plan'].map((col, i) => (
            <div key={col} className="flex items-center gap-1.5">
              <Key
                className={cn(
                  'w-2.5 h-2.5',
                  i === 0 ? 'text-yellow-500' : 'text-white/30',
                )}
              />
              <span className="text-[7px] text-white/60">{col}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Posts Table */}
      <motion.div
        className={cn(
          'absolute right-2 top-12 w-20 rounded-lg border overflow-hidden',
          activeTable === 'posts' ? 'border-primary' : 'border-white/20',
        )}
        animate={
          activeTable === 'posts'
            ? {
                boxShadow: [
                  `0 0 0 ${color}00`,
                  `0 0 15px ${color}60`,
                  `0 0 0 ${color}00`,
                ],
                scale: [1, 1.02, 1],
              }
            : {}
        }
        transition={{ duration: 0.5 }}
      >
        <div
          className="h-5 flex items-center px-2 gap-1.5"
          style={{ backgroundColor: `${color}30` }}
        >
          <Table className="w-3 h-3 text-white/80" />
          <span className="text-[8px] font-medium text-white">posts</span>
        </div>
        <div className="p-1.5 space-y-1">
          {['id', 'title', 'user_id', 'status'].map((col, i) => (
            <div key={col} className="flex items-center gap-1.5">
              <Key
                className={cn(
                  'w-2.5 h-2.5',
                  i === 0
                    ? 'text-yellow-500'
                    : i === 2
                      ? 'text-blue-400'
                      : 'text-white/30',
                )}
              />
              <span className="text-[7px] text-white/60">{col}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Relation line */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <motion.path
          d="M 45 35 Q 75 35 75 55 Q 75 75 105 75"
          fill="none"
          stroke={highlightedRelation ? color : 'rgba(255,255,255,0.2)'}
          strokeWidth="2"
          strokeDasharray="4,2"
          markerEnd="url(#arrow)"
          animate={
            highlightedRelation
              ? {
                  strokeDashoffset: [0, -12],
                }
              : {}
          }
          transition={{
            duration: 1,
            repeat: highlightedRelation ? Infinity : 0,
            ease: 'linear',
          }}
        />
        <defs>
          <marker
            id="arrow"
            markerWidth="6"
            markerHeight="6"
            refX="5"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 6 3, 0 6" fill={color} />
          </marker>
        </defs>
      </svg>

      {/* Add table button */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-2 py-1 rounded-full bg-white/10 border border-white/20">
        <span className="text-[7px] text-white/60">+ New Table</span>
      </div>
    </div>
  );
}

// 5. API - Real endpoint tester
function APIAnimation({ color }: { color: string }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [responseTime, setResponseTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStatus('loading');
      setResponseTime(0);

      const timer = setInterval(() => {
        setResponseTime((t) => t + 12);
      }, 10);

      setTimeout(() => {
        clearInterval(timer);
        setStatus('success');
        setTimeout(() => setStatus('idle'), 2000);
      }, 600);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 p-2 flex flex-col">
      {/* Request section */}
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <select className="h-5 rounded bg-green-500/20 border border-green-500/40 text-[8px] text-green-400 px-1 outline-none">
            <option>GET</option>
            <option>POST</option>
            <option>PUT</option>
          </select>
          <div className="flex-1 h-5 rounded bg-white/5 border border-white/10 px-2 flex items-center">
            <span className="text-[8px] text-white/40">/api/v1/users</span>
          </div>
          <motion.button
            className="h-5 px-2 rounded text-[8px] font-medium text-white"
            style={{ backgroundColor: color }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Send
          </motion.button>
        </div>

        {/* Headers tabs */}
        <div className="flex gap-1 border-b border-white/10 pb-1">
          {['Params', 'Headers', 'Body'].map((tab, i) => (
            <button
              key={tab}
              className={cn(
                'px-2 py-0.5 rounded text-[7px]',
                i === 0 ? 'bg-white/10 text-white' : 'text-white/40',
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Params */}
        <div className="space-y-1">
          <div className="flex gap-1">
            <div className="w-12 h-4 rounded bg-white/5 border border-white/10 px-1 flex items-center">
              <span className="text-[7px] text-white/60">limit</span>
            </div>
            <div className="w-12 h-4 rounded bg-white/5 border border-white/10 px-1 flex items-center">
              <span className="text-[7px] text-white/60">10</span>
            </div>
          </div>
        </div>
      </div>

      {/* Response section */}
      <div className="mt-2 pt-2 border-t border-white/10">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[8px] text-white/40">Response</span>
          <div className="flex items-center gap-2">
            {status === 'loading' && (
              <motion.div
                className="w-3 h-3 border-2 border-white/20 border-t-primary rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
            )}
            {status === 'success' && (
              <span className="text-[7px] text-green-400">200 OK</span>
            )}
            <span className="text-[7px] text-white/30">{responseTime}ms</span>
          </div>
        </div>

        <div className="h-16 rounded bg-black/40 p-1.5 font-mono text-[6px] text-green-400/80 overflow-hidden">
          <div>{`{`}</div>
          <div className="pl-2">&quot;users&quot;: [</div>
          <div className="pl-4">{`{ &quot;id&quot;: 1, &quot;name&quot;: &quot;John&quot; }`}</div>
          <div className="pl-2">]</div>
          <div>{`}`}</div>
        </div>
      </div>
    </div>
  );
}

// 6. Edge - Global request routing
function EdgeAnimation({ color }: { color: string }) {
  const [activeRequest, setActiveRequest] = useState(0);
  const locations = [
    { city: 'NYC', x: 25, y: 35, delay: 0 },
    { city: 'LON', x: 48, y: 30, delay: 0.2 },
    { city: 'SIN', x: 75, y: 50, delay: 0.4 },
    { city: 'SYD', x: 85, y: 65, delay: 0.6 },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveRequest((prev) => (prev + 1) % locations.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 p-3">
      <svg className="w-full h-full" viewBox="0 0 100 80">
        {/* Simplified world map */}
        <path
          d="M20,30 Q30,25 40,30 Q50,35 60,30 Q70,25 80,30 M25,50 Q35,45 45,50 Q55,55 65,50"
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="0.5"
        />

        {/* Server locations */}
        {locations.map((loc, i) => (
          <g key={loc.city}>
            {/* Ping rings */}
            {activeRequest === i && (
              <>
                <motion.circle
                  cx={loc.x}
                  cy={loc.y}
                  r="4"
                  fill="none"
                  stroke={color}
                  strokeWidth="0.5"
                  animate={{ r: [4, 15], opacity: [1, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <motion.circle
                  cx={loc.x}
                  cy={loc.y}
                  r="4"
                  fill="none"
                  stroke={color}
                  strokeWidth="0.5"
                  animate={{ r: [4, 15], opacity: [1, 0] }}
                  transition={{ duration: 1.5, delay: 0.5, repeat: Infinity }}
                />
              </>
            )}

            {/* Server node */}
            <motion.circle
              cx={loc.x}
              cy={loc.y}
              r="5"
              fill={activeRequest === i ? color : 'rgba(255,255,255,0.1)'}
              animate={activeRequest === i ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.5 }}
            />
            <Server
              className="absolute"
              style={{
                left: `${loc.x - 2}%`,
                top: `${loc.y - 2}%`,
                width: '4%',
                color: 'white',
              }}
            />

            <text
              x={loc.x}
              y={loc.y + 12}
              fill="rgba(255,255,255,0.5)"
              fontSize="5"
              textAnchor="middle"
            >
              {loc.city}
            </text>
          </g>
        ))}

        {/* Request path */}
        <motion.circle
          r="2"
          fill={color}
          animate={{
            cx: [25, 48, 75, 85, 25],
            cy: [35, 30, 50, 65, 35],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        />
      </svg>

      {/* Metrics */}
      <div className="absolute bottom-2 right-2 text-right">
        <div className="text-[10px] font-bold" style={{ color }}>
          23ms
        </div>
        <div className="text-[6px] text-white/40">latency</div>
      </div>
    </div>
  );
}

// 7. Security - Encryption visualization
function SecurityAnimation({ color }: { color: string }) {
  const [encrypting, setEncrypting] = useState(false);
  const [data, setData] = useState('password123');

  useEffect(() => {
    const interval = setInterval(() => {
      setEncrypting(true);
      setTimeout(() => {
        setData('••••••••••••');
        setTimeout(() => {
          setEncrypting(false);
          setData('password123');
        }, 2000);
      }, 1000);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 p-4">
      <div className="h-full flex flex-col items-center justify-center">
        {/* Data packet */}
        <motion.div
          className="w-full max-w-[120px] rounded-lg border border-white/20 bg-white/5 p-3 relative overflow-hidden"
          animate={
            encrypting
              ? {
                  borderColor: [color, 'rgba(255,255,255,0.2)'],
                }
              : {}
          }
          transition={{ duration: 0.5 }}
        >
          {/* Lock icon overlay */}
          <AnimatePresence>
            {encrypting && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="absolute inset-0 flex items-center justify-center bg-black/60"
              >
                <Lock className="w-8 h-8" style={{ color }} />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center gap-2 mb-2">
            <Key className="w-3 h-3 text-white/40" />
            <span className="text-[8px] text-white/40">Sensitive Data</span>
          </div>

          <div className="font-mono text-[10px] text-white/80 truncate">
            {data}
          </div>

          <div className="mt-2 flex items-center gap-1">
            <div className="flex-1 h-1 rounded-full bg-white/10 overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: color }}
                animate={
                  encrypting ? { width: ['0%', '100%'] } : { width: '100%' }
                }
                transition={{ duration: 1 }}
              />
            </div>
            <span className="text-[6px] text-white/40">
              {encrypting ? 'AES-256' : 'Encrypted'}
            </span>
          </div>
        </motion.div>

        {/* Certificate badge */}
        <motion.div
          className="mt-4 flex items-center gap-2 px-3 py-1.5 rounded-full border"
          style={{ borderColor: `${color}40`, backgroundColor: `${color}10` }}
          animate={
            encrypting
              ? {
                  boxShadow: [
                    `0 0 0 ${color}00`,
                    `0 0 20px ${color}40`,
                    `0 0 0 ${color}00`,
                  ],
                }
              : {}
          }
          transition={{ duration: 1 }}
        >
          <Shield className="w-3 h-3" style={{ color }} />
          <span className="text-[8px] font-medium" style={{ color }}>
            TLS 1.3 Active
          </span>
        </motion.div>
      </div>
    </div>
  );
}

// 8. Collaboration - Multiplayer editing
function CollaborationAnimation({ color }: { color: string }) {
  const cursors = [
    { id: 1, name: 'Alex', color: '#3b82f6', x: 20, y: 25 },
    { id: 2, name: 'Sam', color: '#84cc16', x: 60, y: 45 },
    { id: 3, name: 'You', color: color, x: 40, y: 65 },
  ];

  return (
    <div className="absolute inset-0 p-3">
      {/* Document */}
      <div className="w-full h-full rounded-lg bg-white/5 border border-white/10 p-3 relative">
        <div className="space-y-2">
          <div className="h-3 w-3/4 rounded bg-white/20" />
          <div className="h-2 w-full rounded bg-white/10" />
          <div className="h-2 w-5/6 rounded bg-white/10" />
          <div className="h-2 w-4/5 rounded bg-white/10" />
        </div>

        {/* Cursors */}
        {cursors.map((cursor) => (
          <motion.div
            key={cursor.id}
            className="absolute"
            animate={{
              x: [cursor.x, cursor.x + 20, cursor.x],
              y: [cursor.y, cursor.y + 10, cursor.y],
            }}
            transition={{
              duration: 4 + cursor.id,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill={cursor.color}>
              <path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87a.5.5 0 0 0 .35-.85L6.35 2.85a.5.5 0 0 0-.85.35Z" />
            </svg>
            <div
              className="absolute -top-4 left-3 px-1.5 py-0.5 rounded text-[6px] font-medium text-white"
              style={{ backgroundColor: cursor.color }}
            >
              {cursor.name}
            </div>
          </motion.div>
        ))}

        {/* Selection highlight */}
        <motion.div
          className="absolute left-4 top-8 h-4 w-20 rounded"
          style={{ backgroundColor: `${color}20` }}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* Comments */}
        <motion.div
          className="absolute right-2 top-6 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold text-white"
          style={{ backgroundColor: '#f59e0b' }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          2
        </motion.div>
      </div>
    </div>
  );
}

// ==================== MAIN PAGE CONTENT ====================

const features = [
  {
    id: 'builder',
    title: 'Визуальный конструктор',
    description:
      'Создавайте интерфейсы методом drag-and-drop. Более 50 готовых компонентов, которые автоматически адаптируются под любые устройства.',
    icon: LayoutGrid,
    color: '#3b82f6',
    gradient: 'from-blue-500/20 to-cyan-500/20',
    capabilities: [
      '50+ UI компонентов',
      'Адаптивная сетка',
      'Real-time preview',
      'Темы оформления',
      'Custom CSS',
      'Компоненты AI',
    ],
    stats: { value: '10x', label: 'быстрее разработка' },
    Animation: BuilderAnimation,
  },
  {
    id: 'workflow',
    title: 'Автоматизация процессов',
    description:
      'Визуальный редактор бизнес-процессов. Соединяйте триггеры, условия и действия в мощные workflows без написания кода.',
    icon: Workflow,
    color: '#84cc16',
    gradient: 'from-lime-500/20 to-green-500/20',
    capabilities: [
      'Визуальный редактор',
      'CRON триггеры',
      'Условная логика',
      'Webhooks',
      'Обработка ошибок',
      'Логи выполнения',
    ],
    stats: { value: '500+', label: 'автоматизаций в месяц' },
    Animation: WorkflowAnimation,
  },
  {
    id: 'ai',
    title: 'AI Помощник',
    description:
      'Встроенный искусственный интеллект помогает генерировать код, создавать контент, анализировать данные и отвечать на вопросы пользователей.',
    icon: Bot,
    color: '#ec4899',
    gradient: 'from-pink-500/20 to-rose-500/20',
    capabilities: [
      'Генерация UI',
      'Написание кода',
      'Анализ данных',
      'Чат-боты',
      'Обработка текста',
      'Изображения',
    ],
    stats: { value: 'GPT-4', label: 'последняя модель' },
    Animation: AIAnimation,
  },
  {
    id: 'database',
    title: 'Визуальная база данных',
    description:
      'Создавайте схемы данных, связи и индексы через графический интерфейс. Автоматические миграции и GraphQL API из коробки.',
    icon: Database,
    color: '#8b5cf6',
    gradient: 'from-violet-500/20 to-purple-500/20',
    capabilities: [
      'Визуальные схемы',
      'Relations & Foreign Keys',
      'Авто-миграции',
      'GraphQL API',
      'Real-time subscriptions',
      'Бэкапы',
    ],
    stats: { value: '99.99%', label: 'доступность данных' },
    Animation: DatabaseAnimation,
  },
  {
    id: 'api',
    title: 'API Конструктор',
    description:
      'Создавайте REST и GraphQL endpoints без кода. Автоматическая документация Swagger, аутентификация и rate limiting.',
    icon: Globe,
    color: '#f59e0b',
    gradient: 'from-orange-500/20 to-amber-500/20',
    capabilities: [
      'REST & GraphQL',
      'JWT Auth',
      'Rate limiting',
      'API versioning',
      'Swagger docs',
      'Webhooks',
    ],
    stats: { value: '<50ms', label: 'время ответа' },
    Animation: APIAnimation,
  },
  {
    id: 'edge',
    title: 'Edge Runtime',
    description:
      'Приложения запускаются на 100+ edge-локациях по всему миру. Минимальная задержка и максимальная производительность.',
    icon: Zap,
    color: '#06b6d4',
    gradient: 'from-cyan-500/20 to-teal-500/20',
    capabilities: [
      'Global CDN',
      'Edge functions',
      'Auto-scaling',
      'Zero cold start',
      'Streaming',
      'Load balancing',
    ],
    stats: { value: '100+', label: 'локаций' },
    Animation: EdgeAnimation,
  },
  {
    id: 'security',
    title: 'Enterprise Security',
    description:
      'Банковский уровень безопасности с SSO, 2FA, audit logs и полным шифрованием данных в покое и при передаче.',
    icon: Shield,
    color: '#ef4444',
    gradient: 'from-red-500/20 to-orange-500/20',
    capabilities: [
      'SSO/SAML',
      '2FA/MFA',
      'Audit logs',
      'RBAC',
      'Encryption',
      'Compliance',
    ],
    stats: { value: 'SOC2', label: 'сертификат' },
    Animation: SecurityAnimation,
  },
  {
    id: 'collaboration',
    title: 'Командная работа',
    description:
      'Работайте вместе с командой в реальном времени. Git-интеграция, code review, комментарии и совместное редактирование.',
    icon: Code2,
    color: '#10b981',
    gradient: 'from-emerald-500/20 to-green-500/20',
    capabilities: [
      'Real-time совместная работа',
      'Git sync',
      'Code review',
      'Комментарии',
      'Роли и права',
      'История версий',
    ],
    stats: { value: '∞', label: 'участников' },
    Animation: CollaborationAnimation,
  },
];

const comparisons = [
  {
    feature: 'Время разработки',
    traditional: '3-6 месяцев',
    shakel: '1-2 недели',
  },
  { feature: 'Стоимость запуска', traditional: '$50K-200K', shakel: 'От $0' },
  {
    feature: 'Нужны разработчики',
    traditional: 'Команда 3-5 чел',
    shakel: '1 человек',
  },
  { feature: 'Обновления', traditional: 'Недели', shakel: 'Минуты' },
  { feature: 'Масштабирование', traditional: 'Сложно', shakel: 'Авто' },
];

function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof features)[0];
  index: number;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const Animation = feature.Animation;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm overflow-hidden transition-all duration-500 hover:border-primary/30 hover:bg-white/[0.04] hover:-translate-y-1"
    >
      {/* Gradient background */}
      <div
        className={cn(
          'absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-500',
          feature.gradient,
          isHovered && 'opacity-20',
        )}
      />

      <div className="relative p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
            style={{ backgroundColor: `${feature.color}15` }}
          >
            <feature.icon
              className="w-7 h-7"
              style={{ color: feature.color }}
            />
          </div>

          {/* Stats badge */}
          <div className="text-right">
            <div
              className="text-2xl font-bold"
              style={{ color: feature.color }}
            >
              {feature.stats.value}
            </div>
            <div className="text-xs text-white/40">{feature.stats.label}</div>
          </div>
        </div>

        {/* Animation Container */}
        <div
          className="relative h-[160px] rounded-xl border border-white/5 bg-black/30 mb-6 overflow-hidden"
          style={{
            boxShadow: isHovered ? `inset 0 0 40px ${feature.color}15` : 'none',
            transition: 'box-shadow 0.5s',
          }}
        >
          <Animation color={feature.color} />
        </div>

        {/* Content */}
        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-gradient transition-all">
          {feature.title}
        </h3>
        <p className="text-white/50 text-sm leading-relaxed mb-6">
          {feature.description}
        </p>

        {/* Capabilities */}
        <div className="flex flex-wrap gap-2">
          {feature.capabilities.slice(0, 4).map((cap, i) => (
            <motion.span
              key={cap}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="px-3 py-1.5 rounded-full text-xs bg-white/5 text-white/60 border border-white/10 hover:border-primary/30 hover:text-white transition-colors"
            >
              {cap}
            </motion.span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function FeaturesPage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Unified Background System */}
        <FeaturesBackground />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8"
            >
              <Layers className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-white/80">
                Возможности платформы
              </span>
            </motion.div>

            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">
              Всё, что нужно для <span className="text-gradient">создания</span>
            </h1>
            <p className="text-xl text-white/50 max-w-2xl mx-auto mb-10">
              Полный стек технологий для разработки, развёртывания и
              масштабирования современных веб-приложений без написания кода.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="gradient" size="lg" className="px-8" asChild>
                <Link href="/signup">Начать бесплатно</Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="px-8 border-white/20 text-white hover:bg-white/10"
                asChild
              >
                <Link href="/projects/new" className="flex items-center gap-2">
                  <Play className="w-4 h-4" />
                  Создать проект
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <FeatureCard key={feature.id} feature={feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-white text-center mb-12">
              Shakel против{' '}
              <span className="text-white/40">традиционной разработки</span>
            </h2>

            <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
              {comparisons.map((item, index) => (
                <motion.div
                  key={item.feature}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    'grid grid-cols-3 gap-4 p-6 items-center',
                    index !== comparisons.length - 1 &&
                      'border-b border-white/5',
                  )}
                >
                  <span className="text-white font-medium">{item.feature}</span>
                  <span className="text-white/40 text-center">
                    {item.traditional}
                  </span>
                  <span className="text-primary font-semibold text-center flex items-center justify-center gap-2">
                    <Check className="w-4 h-4" />
                    {item.shakel}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-20 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Современный стек технологий
            </h2>
            <p className="text-white/50">
              Мы используем лучшие технологии мира
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-6">
            {[
              { icon: Terminal, label: 'Next.js 15' },
              { icon: Database, label: 'PostgreSQL' },
              { icon: Cloud, label: 'AWS' },
              { icon: Lock, label: 'Auth.js' },
              { icon: Gauge, label: 'Redis' },
              { icon: GitBranch, label: 'Git' },
              { icon: Cpu, label: 'Docker' },
              { icon: Globe, label: 'Vercel' },
            ].map((tech, index) => (
              <motion.div
                key={tech.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{
                  scale: 1.05,
                  borderColor: 'rgba(59, 130, 246, 0.3)',
                }}
                className="flex items-center gap-3 px-6 py-4 rounded-xl bg-white/[0.02] border border-white/5 backdrop-blur-sm transition-all"
              >
                <tech.icon className="w-5 h-5 text-primary" />
                <span className="text-white/80 font-medium">{tech.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center p-12 rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-transparent relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
            <div className="relative z-10">
              <h2 className="text-3xl font-bold text-white mb-4">
                Готовы попробовать?
              </h2>
              <p className="text-white/50 mb-8">
                Начните бесплатно. Никакой карты не требуется.
              </p>
              <Button variant="gradient" size="lg" className="px-8" asChild>
                <Link href="/signup" className="flex items-center gap-2">
                  Создать аккаунт
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
