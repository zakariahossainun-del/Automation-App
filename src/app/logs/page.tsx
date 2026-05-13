
"use client"

import { useState, useEffect, useRef } from "react"
import { Terminal, Trash2, Download, Search, Activity, Circle, Server } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

const initialLogs = [
  { id: 1, time: "14:20:01", type: "system", msg: "OMNIBOT Kernel version 2.4.0 initialized." },
  { id: 2, time: "14:20:02", type: "info", msg: "ADB Connection established to SM-G998B." },
  { id: 3, time: "14:21:45", type: "action", msg: "Executing sequence: 'Daily Checkin v1'" },
  { id: 4, time: "14:21:46", type: "success", msg: "Action (1/4) - Tap Settings [OK]" },
  { id: 5, time: "14:21:48", type: "success", msg: "Action (2/4) - Input text 'search' [OK]" },
  { id: 6, time: "14:21:50", type: "warning", msg: "Screen latency detected: 250ms." },
]

export default function Logs() {
  const [logs, setLogs] = useState(initialLogs)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      const time = new Date().toLocaleTimeString('en-GB')
      const types = ['info', 'success', 'warning', 'action']
      const msgs = [
        'Heartbeat detected from remote agent.',
        'Buffer synchronization complete.',
        'Target element found at (234, 1102).',
        'Executing swipe gesture from (100, 100) to (100, 500).'
      ]
      
      const newLog = {
        id: Date.now(),
        time,
        type: types[Math.floor(Math.random() * types.length)],
        msg: msgs[Math.floor(Math.random() * msgs.length)]
      }
      
      setLogs(prev => [...prev.slice(-49), newLog])
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="h-[calc(100vh-0px)] flex flex-col p-8 space-y-6">
      <header className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="font-headline text-3xl font-bold flex items-center gap-3">
            <Terminal className="text-primary" />
            Execution Telemetry
          </h2>
          <p className="text-muted-foreground">Real-time system diagnostics and interaction events.</p>
        </div>
        <div className="flex gap-3">
          <div className="px-4 py-2 bg-muted rounded-lg flex items-center gap-2 border border-border">
             <Circle className="text-green-500 animate-pulse fill-green-500" size={10} />
             <span className="text-xs font-bold uppercase tracking-widest">Live Stream</span>
          </div>
          <Button variant="outline" className="gap-2 border-border">
            <Download size={16} /> Export
          </Button>
          <Button variant="outline" className="gap-2 border-border text-destructive hover:bg-destructive/10" onClick={() => setLogs([])}>
            <Trash2 size={16} /> Clear
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full overflow-hidden">
        {/* Status Dashboard */}
        <div className="space-y-6">
           <CardStat title="Active Connection" value="ADB Bridge" icon={Server} color="text-secondary" />
           <CardStat title="System Load" value="4.2%" icon={Activity} color="text-primary" />
           <div className="p-6 rounded-2xl bg-primary/5 border border-primary/20 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-primary">System Health</h4>
              <div className="space-y-2">
                 <HealthBar label="Memory" val={68} />
                 <HealthBar label="I/O Latency" val={12} />
                 <HealthBar label="Network" val={92} />
              </div>
           </div>
        </div>

        {/* Log Viewer */}
        <div className="lg:col-span-3 bg-card rounded-2xl border border-border flex flex-col overflow-hidden shadow-2xl">
          <div className="p-4 border-b border-border bg-muted/30 flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
               <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                  <Input placeholder="Filter logs..." className="pl-9 h-9 bg-background border-border text-xs" />
               </div>
            </div>
            <div className="flex gap-2">
               {['All', 'Info', 'Actions', 'Errors'].map(f => (
                 <button key={f} className="px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-muted hover:bg-primary hover:text-primary-foreground staccato-transition">
                    {f}
                 </button>
               ))}
            </div>
          </div>
          
          <ScrollArea className="flex-1 font-code p-6 text-sm">
            <div className="space-y-2">
              {logs.map((log) => (
                <div key={log.id} className="flex gap-4 group">
                  <span className="text-muted-foreground shrink-0 select-none w-20">[{log.time}]</span>
                  <span className={`font-bold uppercase tracking-wider text-[10px] w-16 shrink-0 ${
                    log.type === 'error' ? 'text-destructive' :
                    log.type === 'warning' ? 'text-amber-500' :
                    log.type === 'success' ? 'text-green-500' :
                    log.type === 'action' ? 'text-primary' : 'text-secondary'
                  }`}>
                    {log.type}
                  </span>
                  <span className="text-foreground/80 break-all">{log.msg}</span>
                </div>
              ))}
              <div ref={scrollRef} />
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}

function CardStat({ title, value, icon: Icon, color }: any) {
  return (
    <div className="p-6 rounded-2xl bg-card border border-border space-y-2">
       <div className="flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{title}</p>
          <Icon size={16} className={color} />
       </div>
       <p className="text-2xl font-headline font-bold">{value}</p>
    </div>
  )
}

function HealthBar({ label, val }: { label: string, val: number }) {
  return (
    <div className="space-y-1">
       <div className="flex justify-between text-[10px] font-bold uppercase text-muted-foreground">
          <span>{label}</span>
          <span>{val}%</span>
       </div>
       <div className="h-1 w-full bg-background rounded-full overflow-hidden">
          <div className="h-full bg-secondary staccato-transition" style={{ width: `${val}%` }}></div>
       </div>
    </div>
  )
}
