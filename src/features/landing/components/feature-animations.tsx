'use client';

import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { 
  LayoutGrid, 
  Workflow, 
  Database, 
  Globe, 
  Zap, 
  Shield,
  Sparkles,
  Bot,
  Code2,
  Cloud,
  Lock,
  Gauge,
  ArrowRight,
  Check,
  Play,
  Layers,
  Terminal,
  GitBranch,
  Cpu,
  Users,
  Server,
  Wifi,
  MousePointer2,
  Type,
  Image,
  Table,
  Send,
  Eye,
  EyeOff,
  Key,
  FileCode,
  Braces,
  Webhook
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';

// 1. Builder - Real drag and drop interface
export function BuilderAnimation({ color }: { color: string }) {
  const [components, setComponents] = useState([
    { id: 1, type: 'header', x: 10, y: 10, w: 140, h: 25 },
    { id: 2, type: 'text', x: 10, y: 45, w: 90, h: 20 },
    { id: 3, type: 'button', x: 110, y: 45, w: 40, h: 20 },
  ]);
  
  const [draggedId, setDraggedId] = useState<number | null>(null);
  const [sidebarHover, setSidebarHover] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setDraggedId(2);
      setTimeout(() => {
        setComponents(prev => prev.map(c => 
          c.id === 2 ? { ...c, y: 75 } : c
        ));
        setTimeout(() => setDraggedId(null), 500);
      }, 800);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 flex">
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
            {type === 'text' && <span className="text-[8px] text-white/60">T</span>}
            {type === 'button' && <div className="w-4 h-2 rounded-sm bg-white/60" />}
            {type === 'image' && <Image className="w-4 h-4 text-white/60" />}
          </motion.div>
        ))}
      </div>
      
      <div className="flex-1 p-3 relative bg-black/20">
        <div className="absolute top-2 right-2 flex gap-1">
          <div className="w-16 h-4 rounded bg-white/10 flex items-center justify-center text-[6px] text-white/40">Desktop</div>
          <div className="w-12 h-4 rounded bg-white/5 flex items-center justify-center text-[6px] text-white/30">Mobile</div>
        </div>
        
        {components.map((comp) => (
          <motion.div
            key={comp.id}
            className={cn(
              "absolute rounded border-2 flex items-center justify-center",
              draggedId === comp.id ? "border-primary z-10 shadow-lg" : "border-white/20"
            )}
            style={{
              left: comp.x,
              top: comp.y,
              width: comp.w,
              height: comp.h,
              backgroundColor: draggedId === comp.id ? `${color}30` : 'rgba(255,255,255,0.05)',
            }}
            animate={draggedId === comp.id ? { 
              scale: [1, 1.05, 1],
              boxShadow: [`0 0 0 ${color}00`, `0 0 20px ${color}60`, `0 0 0 ${color}00`]
            } : {}}
            transition={{ duration: 0.5 }}
          >
            {comp.type === 'header' && <div className="w-3/4 h-2 rounded-full bg-white/40" />}
            {comp.type === 'text' && <div className="w-full px-1 space-y-1"><div className="h-1.5 rounded-full bg-white/30 w-full" /><div className="h-1.5 rounded-full bg-white/30 w-2/3" /></div>}
            {comp.type === 'button' && <div className="px-2 py-0.5 rounded bg-white/30 text-[6px] text-white">Click</div>}
          </motion.div>
        ))}
        
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }} />
      </div>
    </div>
  );
}

// 2. Workflow - Real automation flow
export function WorkflowAnimation({ color }: { color: string }) {
  const [activeNode, setActiveNode] = useState(0);
  const [running, setRunning] = useState(true);
  
  const nodes = [
    { id: 0, type: 'trigger', label: 'New User', icon: Users, x: 20, y: 50 },
    { id: 1, type: 'condition', label: 'Check Plan', icon: Eye, x: 70, y: 50 },
    { id: 2, type: 'action', label: 'Send Email', icon: Send, x: 120, y: 30 },
    { id: 3, type: 'action', label: 'Create DB', icon: Database, x: 120, y: 70 },
  ];
  
  const connections = [
    { from: 0, to: 1 },
    { from: 1, to: 2, label: 'Pro' },
    { from: 1, to: 3, label: 'Free' },
  ];

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      setActiveNode(prev => (prev + 1) % 4);
    }, 1500);
    return () => clearInterval(interval);
  }, [running]);

  return (
    <div className="absolute inset-0 p-3">
      <svg className="w-full h-full" viewBox="0 0 150 100">
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
                animate={isActive ? { 
                  strokeDasharray: ['0,10', '10,0'],
                } : {}}
                transition={{ duration: 0.5 }}
              />
              {conn.label && (
                <text x={(fromNode.x + toNode.x) / 2} y={(fromNode.y + toNode.y) / 2 - 5} 
                      fill="rgba(255,255,255,0.4)" fontSize="6" textAnchor="middle">
                  {conn.label}
                </text>
              )}
            </g>
          );
        })}
        
        <defs>
          <marker id="arrowhead" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <polygon points="0 0, 6 3, 0 6" fill={color} />
          </marker>
        </defs>
        
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
                animate={isActive ? { 
                  scale: [1, 1.1, 1],
                  filter: [`drop-shadow(0 0 0 ${color}00)`, `drop-shadow(0 0 8px ${color}80)`, `drop-shadow(0 0 0 ${color}00)`]
                } : {}}
                transition={{ duration: 0.5 }}
              />
              <foreignObject x={node.x - 8} y={node.y - 8} width="16" height="16">
                <Icon className="w-4 h-4" style={{ color: isActive ? 'white' : 'rgba(255,255,255,0.5)' }} />
              </foreignObject>
              <text x={node.x} y={node.y + 20} fill="rgba(255,255,255,0.5)" fontSize="5" textAnchor="middle">
                {node.label}
              </text>
            </motion.g>
          );
        })}
        
        <circle cx="140" cy="10" r="3" fill={running ? '#22c55e' : '#ef4444'} />
        <text x="130" y="12" fill="rgba(255,255,255,0.4)" fontSize="5" textAnchor="end">
          {running ? 'Running' : 'Paused'}
        </text>
      </svg>
    </div>
  );
}

// 3. AI - Real chat interface with code generation
export function AIAnimation({ color }: { color: string }) {
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
    '</form>'
  ];

  useEffect(() => {
    const timer = setTimeout(() => setShowCode(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="absolute inset-0 p-2 flex flex-col">
      <div className="flex items-center gap-2 px-2 py-1.5 border-b border-white/10 bg-white/5 rounded-t-lg">
        <div className="w-4 h-4 rounded-full flex items-center justify-center" style={{ backgroundColor: `${color}40` }}>
          <Sparkles className="w-2.5 h-2.5" style={{ color }} />
        </div>
        <span className="text-[8px] text-white/60">AI Assistant</span>
        <div className="ml-auto flex gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
        </div>
      </div>
      
      <div className="flex-1 p-2 space-y-2 overflow-hidden">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "text-[8px] p-1.5 rounded-lg max-w-[85%]",
              msg.type === 'user' 
                ? 'bg-white/10 ml-auto text-white/80' 
                : 'bg-white/5 text-white/60'
            )}
          >
            {msg.text}
          </motion.div>
        ))}
        
        <AnimatePresence>
          {showCode && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="rounded-lg bg-black/40 border border-white/10 p-2 font-mospace"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[6px] text-white/40">Generated Component</span>
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
export function DatabaseAnimation({ color }: { color: string }) {
  const [activeTable, setActiveTable] = useState<'users' | 'posts' | null>(null);
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
      <motion.div
        className={cn(
          "absolute left-2 top-4 w-20 rounded-lg border overflow-hidden",
          activeTable === 'users' ? "border-primary" : "border-white/20"
        )}
        animate={activeTable === 'users' ? { 
          boxShadow: [`0 0 0 ${color}00`, `0 0 15px ${color}60`, `0 0 0 ${color}00`],
          scale: [1, 1.02, 1]
        } : {}}
        transition={{ duration: 0.5 }}
      >
        <div className="h-5 flex items-center px-2 gap-1.5" style={{ backgroundColor: `${color}30` }}>
          <Table className="w-3 h-3 text-white/80" />
          <span className="text-[8px] font-medium text-white">users</span>
        </div>
        <div className="p-1.5 space-y-1">
          {['id', 'email', 'name', 'plan'].map((col, i) => (
            <div key={col} className="flex items-center gap-1.5">
              <Key className={cn("w-2.5 h-2.5", i === 0 ? "text-yellow-500" : "text-white/30")} />
              <span className="text-[7px] text-white/60">{col}</span>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        className={cn(
          "absolute right-2 top-12 w-20 rounded-lg border overflow-hidden",
          activeTable === 'posts' ? "border-primary" : "border-white/20"
        )}
        animate={activeTable === 'posts' ? { 
          boxShadow: [`0 0 0 ${color}00`, `0 0 15px ${color}60`, `0 0 0 ${color}00`],
          scale: [1, 1.02, 1]
        } : {}}
        transition={{ duration: 0.5 }}
      >
        <div className="h-5 flex items-center px-2 gap-1.5" style={{ backgroundColor: `${color}30` }}>
          <Table className="w-3 h-3 text-white/80" />
          <span className="text-[8px] font-medium text-white">posts</span>
        </div>
        <div className="p-1.5 space-y-1">
          {['id', 'title', 'user_id', 'status'].map((col, i) => (
            <div key={col} className="flex items-center gap-1.5">
              <Key className={cn("w-2.5 h-2.5", i === 0 ? "text-yellow-500" : i === 2 ? "text-blue-400" : "text-white/30")} />
              <span className="text-[7px] text-white/60">{col}</span>
            </div>
          ))}
        </div>
      </motion.div>

      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <motion.path
          d="M 45 35 Q 75 35 75 55 Q 75 75 105 75"
          fill="none"
          stroke={highlightedRelation ? color : 'rgba(255,255,255,0.2)'}
          strokeWidth="2"
          strokeDasharray="4,2"
          markerEnd="url(#arrow)"
          animate={highlightedRelation ? {
            strokeDashoffset: [0, -12]
          } : {}}
          transition={{ duration: 1, repeat: highlightedRelation ? Infinity : 0, ease: "linear" }}
        />
        <defs>
          <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <polygon points="0 0, 6 3, 0 6" fill={color} />
          </marker>
        </defs>
      </svg>

      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-2 py-1 rounded-full bg-white/10 border border-white/20">
        <span className="text-[7px] text-white/60">+ New Table</span>
      </div>
    </div>
  );
}

// 5. API - Real endpoint tester
export function APIAnimation({ color }: { color: string }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [responseTime, setResponseTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStatus('loading');
      setResponseTime(0);
      
      const timer = setInterval(() => {
        setResponseTime(t => t + 12);
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

        <div className="flex gap-1 border-b border-white/10 pb-1">
          {['Params', 'Headers', 'Body'].map((tab, i) => (
            <button key={tab} className={cn(
              "px-2 py-0.5 rounded text-[7px]",
              i === 0 ? "bg-white/10 text-white" : "text-white/40"
            )}>
              {tab}
            </button>
          ))}
        </div>

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

      <div className="mt-2 pt-2 border-t border-white/10">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[8px] text-white/40">Response</span>
          <div className="flex items-center gap-2">
            {status === 'loading' && (
              <motion.div
                className="w-3 h-3 border-2 border-white/20 border-t-primary rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
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
export function EdgeAnimation({ color }: { color: string }) {
  const [activeRequest, setActiveRequest] = useState(0);
  const locations = [
    { city: 'NYC', x: 25, y: 35, delay: 0 },
    { city: 'LON', x: 48, y: 30, delay: 0.2 },
    { city: 'SIN', x: 75, y: 50, delay: 0.4 },
    { city: 'SYD', x: 85, y: 65, delay: 0.6 },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveRequest(prev => (prev + 1) % locations.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 p-3">
      <svg className="w-full h-full" viewBox="0 0 100 80">
        <path
          d="M20,30 Q30,25 40,30 Q50,35 60,30 Q70,25 80,30 M25,50 Q35,45 45,50 Q55,55 65,50"
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="0.5"
        />

        {locations.map((loc, i) => (
          <g key={loc.city}>
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
            
            <motion.circle
              cx={loc.x}
              cy={loc.y}
              r="5"
              fill={activeRequest === i ? color : 'rgba(255,255,255,0.1)'}
              animate={activeRequest === i ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.5 }}
            />
            <foreignObject x={loc.x - 3} y={loc.y - 3} width="6" height="6">
              <Server className="w-full h-full" style={{ color: 'white' }} />
            </foreignObject>
            
            <text x={loc.x} y={loc.y + 12} fill="rgba(255,255,255,0.5)" fontSize="5" textAnchor="middle">
              {loc.city}
            </text>
          </g>
        ))}

        <motion.circle
          r="2"
          fill={color}
          animate={{
            cx: [25, 48, 75, 85, 25],
            cy: [35, 30, 50, 65, 35]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
      </svg>

      <div className="absolute bottom-2 right-2 text-right">
        <div className="text-[10px] font-bold" style={{ color }}>23ms</div>
        <div className="text-[6px] text-white/40">latency</div>
      </div>
    </div>
  );
}

// 7. Security - Encryption visualization
export function SecurityAnimation({ color }: { color: string }) {
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
        <motion.div
          className="w-full max-w-[120px] rounded-lg border border-white/20 bg-white/5 p-3 relative overflow-hidden"
          animate={encrypting ? {
            borderColor: [color, 'rgba(255,255,255,0.2)'],
          } : {}}
          transition={{ duration: 0.5 }}
        >
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
                animate={encrypting ? { width: ['0%', '100%'] } : { width: '100%' }}
                transition={{ duration: 1 }}
              />
            </div>
            <span className="text-[6px] text-white/40">
              {encrypting ? 'AES-256' : 'Encrypted'}
            </span>
          </div>
        </motion.div>

        <motion.div
          className="mt-4 flex items-center gap-2 px-3 py-1.5 rounded-full border"
          style={{ borderColor: `${color}40`, backgroundColor: `${color}10` }}
          animate={encrypting ? {
            boxShadow: [`0 0 0 ${color}00`, `0 0 20px ${color}40`, `0 0 0 ${color}00`]
          } : {}}
          transition={{ duration: 1 }}
        >
          <Shield className="w-3 h-3" style={{ color }} />
          <span className="text-[8px] font-medium" style={{ color }}>TLS 1.3 Active</span>
        </motion.div>
      </div>
    </div>
  );
}

// 8. Collaboration - Multiplayer editing
export function CollaborationAnimation({ color }: { color: string }) {
  const cursors = [
    { id: 1, name: 'Alex', color: '#3b82f6', x: 20, y: 25 },
    { id: 2, name: 'Sam', color: '#84cc16', x: 60, y: 45 },
    { id: 3, name: 'You', color: color, x: 40, y: 65 },
  ];

  return (
    <div className="absolute inset-0 p-3">
      <div className="w-full h-full rounded-lg bg-white/5 border border-white/10 p-3 relative">
        <div className="space-y-2">
          <div className="h-3 w-3/4 rounded bg-white/20" />
          <div className="h-2 w-full rounded bg-white/10" />
          <div className="h-2 w-5/6 rounded bg-white/10" />
          <div className="h-2 w-4/5 rounded bg-white/10" />
        </div>

        {cursors.map((cursor) => (
          <motion.div
            key={cursor.id}
            className="absolute"
            animate={{
              x: [cursor.x, cursor.x + 20, cursor.x],
              y: [cursor.y, cursor.y + 10, cursor.y]
            }}
            transition={{
              duration: 4 + cursor.id,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill={cursor.color}>
              <path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87a.5.5 0 0 0 .35-.85L6.35 2.85a.5.5 0 0 0-.85.35Z"/>
            </svg>
            <div 
              className="absolute -top-4 left-3 px-1.5 py-0.5 rounded text-[6px] font-medium text-white"
              style={{ backgroundColor: cursor.color }}
            >
              {cursor.name}
            </div>
          </motion.div>
        ))}

        <motion.div
          className="absolute left-4 top-8 h-4 w-20 rounded"
          style={{ backgroundColor: `${color}20` }}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />

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
