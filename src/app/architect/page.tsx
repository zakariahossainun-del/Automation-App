"use client"

import { useState, useRef, ReactNode, MouseEvent as ReactMouseEvent } from "react"
import { 
  Plus, 
  Trash2, 
  GripVertical, 
  Play, 
  Square,
  Save, 
  Target, 
  MousePointer2, 
  Keyboard, 
  Clock, 
  ExternalLink,
  Settings,
  Loader2,
  CheckCircle2,
  Eraser,
  Dices,
  PlusCircle,
  X,
  Activity,
  Hand,
  Repeat,
  RefreshCw,
  CircleDot,
  Layers
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Image from "next/image"
import { PlaceHolderImages } from "@/lib/placeholder-images"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

const actionTypes = [
  { id: 'tap', icon: MousePointer2, label: 'Tap' },
  { id: 'longPress', icon: Hand, label: 'Hold' },
  { id: 'swipe', icon: GripVertical, label: 'Swipe' },
  { id: 'textInput', icon: Keyboard, label: 'Auto Text' },
  { id: 'delay', icon: Clock, label: 'Delay' },
  { id: 'openApp', icon: ExternalLink, label: 'App' },
]

const defaultDeviceApps = [
  { name: 'Settings', package: 'com.android.settings' },
  { name: 'Chrome', package: 'com.android.chrome' },
  { name: 'YouTube', package: 'com.google.android.youtube' },
  { name: 'Play Store', package: 'com.android.vending' },
  { name: 'Gmail', package: 'com.google.android.gm' },
  { name: 'Maps', package: 'com.google.android.apps.maps' },
  { name: 'WhatsApp', package: 'com.whatsapp' },
]

export default function Architect() {
  const { toast } = useToast()
  const [actions, setActions] = useState<any[]>([
    { id: '1', type: 'openApp', desc: 'Open Chrome', packageName: 'com.android.chrome', repeats: 1 },
    { id: '2', type: 'textInput', desc: 'Type URL', text: 'https://github.com', isRandom: false, repeats: 1 },
  ])
  const [textVault, setTextVault] = useState<string[]>([
    "Automating with ZAk",
    "System Status: Nominal",
    "This app is made By Zakaria-Zak"
  ])
  const [newVaultItem, setNewVaultItem] = useState("")
  const [isExecuting, setIsExecuting] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [activeActionIndex, setActiveActionIndex] = useState<number | null>(null)
  const [repeatProgress, setRepeatProgress] = useState<{current: number, total: number} | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const stopRef = useRef(false)
  const recordStartRef = useRef<{x: number, y: number, time: number} | null>(null)

  const androidImage = PlaceHolderImages.find(img => img.id === 'android-screen');

  function addAction(type: string, payload: any = {}) {
    const newAction: any = { 
      id: Date.now().toString() + Math.random(), 
      type, 
      desc: payload.desc || `Automated ${type} task`,
      repeats: 1,
      ...payload
    }

    if (type === 'tap' && !payload.x) {
      newAction.x = 540; newAction.y = 1200; newAction.durationMs = 100;
    } else if (type === 'longPress' && !payload.x) {
      newAction.x = 540; newAction.y = 1200; newAction.durationMs = 2000;
    } else if (type === 'swipe' && !payload.startX) {
      newAction.startX = 540; newAction.startY = 1800; newAction.endX = 540; newAction.endY = 600; newAction.durationMs = 300;
    } else if (type === 'textInput' && !payload.text) {
      newAction.text = "Hello ZAk"; newAction.isRandom = false;
    } else if (type === 'delay' && !payload.durationMs) {
      newAction.durationMs = 1000;
    } else if (type === 'openApp' && !payload.packageName) {
      newAction.packageName = "com.android.settings";
    }

    setActions(prev => [...prev, newAction])
  }

  function handleScanApps() {
    setIsScanning(true)
    setTimeout(() => {
      setIsScanning(false)
      toast({ title: "Scan Complete", description: "Fetched 42 installed applications." })
    }, 1500)
  }

  function addToVault(text: string) {
    if (!text.trim() || textVault.includes(text)) return
    setTextVault([...textVault, text])
    setNewVaultItem("")
    toast({ title: "Text Saved", description: "Added snippet to vault." })
  }

  function updateAction(id: string, updates: any) {
    setActions(actions.map(a => a.id === id ? { ...a, ...updates } : a))
  }

  function removeAction(id: string) {
    setActions(actions.filter(a => a.id !== id))
  }

  async function handleExecute() {
    if (actions.length === 0) return
    setIsExecuting(true)
    stopRef.current = false
    
    for (let i = 0; i < actions.length; i++) {
      if (stopRef.current) break;
      setActiveActionIndex(i)
      const currentAction = actions[i]
      const totalRepeats = currentAction.repeats || 1;
      
      for (let r = 0; r < totalRepeats; r++) {
        if (stopRef.current) break;
        setRepeatProgress({ current: r + 1, total: totalRepeats })
        let executionWait = 1500;
        if (currentAction.type === 'delay') executionWait = currentAction.durationMs || 1000;
        else if (currentAction.type === 'swipe') executionWait = (currentAction.durationMs || 300) + 500;
        else if (currentAction.type === 'tap' || currentAction.type === 'longPress') executionWait = (currentAction.durationMs || 100) + 500;

        await new Promise(resolve => setTimeout(resolve, executionWait))
      }
    }
    
    setActiveActionIndex(null)
    setRepeatProgress(null)
    setIsExecuting(false)
    toast({ title: stopRef.current ? "Halted" : "Success", description: "Sequence execution finished." })
  }

  function handleStop() {
    stopRef.current = true
    setIsExecuting(false)
    setIsRecording(false)
  }

  const handleSimulatorInteractionStart = (e: ReactMouseEvent) => {
    if (!isRecording) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 1080)
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 2400)
    recordStartRef.current = { x, y, time: Date.now() }
  }

  const handleSimulatorInteractionEnd = (e: ReactMouseEvent) => {
    if (!isRecording || !recordStartRef.current) return
    const rect = e.currentTarget.getBoundingClientRect()
    const endX = Math.round(((e.clientX - rect.left) / rect.width) * 1080)
    const endY = Math.round(((e.clientY - rect.top) / rect.height) * 2400)
    const endTime = Date.now()
    const duration = endTime - recordStartRef.current.time
    const dist = Math.sqrt(Math.pow(endX - recordStartRef.current.x, 2) + Math.pow(endY - recordStartRef.current.y, 2))

    if (dist < 30) {
      const type = duration > 500 ? 'longPress' : 'tap';
      addAction(type, { x: recordStartRef.current.x, y: recordStartRef.current.y, durationMs: duration > 500 ? duration : 100 })
    } else {
      addAction('swipe', { startX: recordStartRef.current.x, startY: recordStartRef.current.y, endX, endY, durationMs: Math.max(duration, 300) })
    }
    recordStartRef.current = null
  }

  return (
    <div className="h-[calc(100vh-0px)] overflow-hidden flex">
      {/* Sidebar Toolset */}
      <div className="w-80 border-r border-border bg-card flex flex-col">
        <div className="p-6 border-b border-border">
          <h2 className="font-headline text-xl font-bold text-foreground">ZAk Architect</h2>
          <p className="text-xs text-muted-foreground">Build automation sequences</p>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Action Palette</h3>
                <Button 
                  size="sm" 
                  variant={isRecording ? "destructive" : "secondary"} 
                  className={cn("h-7 gap-1.5 font-bold uppercase text-[9px]", isRecording && "animate-pulse")}
                  onClick={() => setIsRecording(!isRecording)}
                  disabled={isExecuting}
                >
                  <CircleDot size={12} /> {isRecording ? "Stop REC" : "Auto Record"}
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {actionTypes.map(t => (
                  <Button
                    key={t.id}
                    variant="outline"
                    className="h-24 flex-col gap-2 border-dashed hover:border-primary hover:bg-primary/5"
                    onClick={() => addAction(t.id)}
                    disabled={isExecuting || isRecording}
                  >
                    <t.icon size={24} className="text-primary" />
                    <span className="text-xs font-bold uppercase tracking-wider">{t.label}</span>
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Text Vault</h3>
                <span className="text-[10px] text-primary">{textVault.length} items</span>
              </div>
              <div className="flex gap-2">
                <Input 
                  placeholder="New snippet..." 
                  value={newVaultItem}
                  onChange={(e) => setNewVaultItem(e.target.value)}
                  className="h-8 text-xs bg-background/50"
                  onKeyDown={(e) => e.key === 'Enter' && addToVault(newVaultItem)}
                />
                <Button size="icon" className="h-8 w-8" onClick={() => addToVault(newVaultItem)}>
                  <PlusCircle size={16} />
                </Button>
              </div>
              <div className="space-y-2">
                {textVault.map((item, idx) => (
                  <div key={idx} className="group flex items-center justify-between p-2 rounded bg-muted/30 hover:bg-muted">
                    <span className="text-[11px] truncate flex-1 pr-2">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
        <div className="p-4 border-t border-border space-y-3">
          <Button 
            className="w-full h-11 font-bold gap-2"
            onClick={isExecuting ? handleStop : handleExecute}
            variant={isExecuting ? "destructive" : "default"}
            disabled={actions.length === 0 || isRecording}
          >
            {isExecuting ? <Square size={18} /> : <Play size={18} />}
            {isExecuting ? "Stop Sequence" : "Start Sequence"}
          </Button>
        </div>
      </div>

      {/* Main Canvas */}
      <div className="flex-1 flex flex-col bg-background relative overflow-hidden">
        <div className="h-16 border-b border-border bg-card/30 flex items-center justify-between px-8">
          <h3 className="font-headline font-bold text-lg">Sequence Builder</h3>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive" onClick={() => setActions([])} disabled={isExecuting}>
            <Eraser size={14} /> Clear All
          </Button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          <ScrollArea className="flex-1 p-8">
            <div className="max-w-3xl mx-auto space-y-4">
              {actions.map((action, idx) => {
                const typeInfo = actionTypes.find(t => t.id === action.type);
                const isActive = activeActionIndex === idx;
                return (
                  <div key={action.id} className="group flex items-center gap-4 animate-in slide-in-from-left-4 fade-in">
                    <div className={cn(
                      "h-10 w-10 rounded-xl flex items-center justify-center font-bold text-sm border transition-all",
                      isActive ? "bg-primary text-primary-foreground border-primary" : "bg-muted text-secondary border-border"
                    )}>
                      {isActive ? <ActivityIcon /> : idx + 1}
                    </div>
                    <Card className={cn("flex-1 border-border bg-card/50", isActive && "border-primary/50 ring-1 ring-primary/20")}>
                      <CardContent className="p-4 flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                              {typeInfo && <typeInfo.icon size={18} />}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-foreground capitalize">{action.type}</p>
                              <p className="text-[11px] text-muted-foreground">{action.desc}</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removeAction(action.id)} disabled={isExecuting}>
                            <Trash2 size={16} />
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-3 pt-2">
                          {action.type === 'textInput' && (
                            <div className="col-span-2 space-y-2">
                              <div className="flex items-center justify-between">
                                <Label className="text-[10px] font-bold uppercase">Random Vault Entry</Label>
                                <Switch checked={action.isRandom} onCheckedChange={(c) => updateAction(action.id, { isRandom: c })} />
                              </div>
                              <Input className="h-8 text-xs bg-background/50" value={action.text || ""} onChange={(e) => updateAction(action.id, { text: e.target.value })} disabled={action.isRandom} />
                            </div>
                          )}
                          {(action.type === 'tap' || action.type === 'longPress') && (
                            <>
                              <div className="flex gap-2">
                                <Input type="number" className="h-8 text-xs bg-background/50" value={action.x} onChange={(e) => updateAction(action.id, { x: Number(e.target.value) })} />
                                <Input type="number" className="h-8 text-xs bg-background/50" value={action.y} onChange={(e) => updateAction(action.id, { y: Number(e.target.value) })} />
                              </div>
                              <Input type="number" className="h-8 text-xs bg-background/50" value={action.durationMs} onChange={(e) => updateAction(action.id, { durationMs: Number(e.target.value) })} />
                            </>
                          )}
                          {action.type === 'swipe' && (
                            <div className="col-span-2 space-y-2">
                              <label className="text-[10px] font-bold uppercase">Path (Start -&gt; End)</label>
                              <div className="grid grid-cols-4 gap-2">
                                <Input type="number" className="h-8 text-xs" value={action.startX} onChange={(e) => updateAction(action.id, { startX: Number(e.target.value) })} />
                                <Input type="number" className="h-8 text-xs" value={action.startY} onChange={(e) => updateAction(action.id, { startY: Number(e.target.value) })} />
                                <Input type="number" className="h-8 text-xs" value={action.endX} onChange={(e) => updateAction(action.id, { endX: Number(e.target.value) })} />
                                <Input type="number" className="h-8 text-xs" value={action.endY} onChange={(e) => updateAction(action.id, { endY: Number(e.target.value) })} />
                              </div>
                              <Input type="number" className="h-8 text-xs" value={action.durationMs} onChange={(e) => updateAction(action.id, { durationMs: Number(e.target.value) })} placeholder="Speed (ms)" />
                            </div>
                          )}
                          {action.type === 'openApp' && (
                            <Select value={action.packageName} onValueChange={(val) => updateAction(action.id, { packageName: val })}>
                              <SelectTrigger className="h-8 text-xs col-span-2"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                {defaultDeviceApps.map(app => <SelectItem key={app.package} value={app.package}>{app.name}</SelectItem>)}
                              </SelectContent>
                            </Select>
                          )}
                          <div className="col-span-2 pt-2 border-t flex items-center justify-between">
                            <Label className="text-[10px] font-bold uppercase flex items-center gap-1"><Repeat size={10} /> Repeats</Label>
                            <Input type="number" min="1" className="h-8 w-20 text-xs text-right" value={action.repeats || 1} onChange={(e) => updateAction(action.id, { repeats: Number(e.target.value) })} />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )
              })}
            </div>
          </ScrollArea>

          {/* Device Simulator Overlay */}
          <div className="w-[450px] border-l border-border bg-muted/20 flex flex-col p-8 items-center justify-center">
             <div className="relative">
                <div className={cn(
                  "relative w-[300px] h-[600px] bg-black rounded-[36px] border-[8px] border-[#1f1f1f] shadow-2xl overflow-hidden transition-all",
                  isRecording && "ring-4 ring-destructive/50 cursor-crosshair",
                  isExecuting && "ring-4 ring-primary/50"
                )} onMouseDown={handleSimulatorInteractionStart} onMouseUp={handleSimulatorInteractionEnd}>
                  {/* Floating Controller Panel */}
                  <div className="absolute top-12 left-4 z-50">
                    <div className="bg-black/60 backdrop-blur-md border border-white/10 p-1.5 rounded-2xl flex flex-col gap-2 shadow-2xl">
                      <button onClick={(e) => { e.stopPropagation(); isExecuting ? handleStop() : handleExecute(); }} className={cn("h-10 w-10 rounded-xl flex items-center justify-center", isExecuting ? "bg-destructive text-white" : "bg-primary text-black")}>
                        {isExecuting ? <Square size={18} /> : <Play size={18} />}
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); setIsRecording(!isRecording); }} className={cn("h-10 w-10 rounded-xl flex items-center justify-center transition-all", isRecording ? "bg-destructive/20 text-destructive border border-destructive/30" : "bg-white/5 text-white/40")}>
                        <CircleDot size={18} className={cn(isRecording && "animate-pulse")} />
                      </button>
                    </div>
                  </div>
                  <Image src={androidImage?.imageUrl || "https://picsum.photos/seed/android/300/600"} alt="Screen" width={300} height={600} className="object-cover opacity-60" draggable={false} />
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div className="px-3 py-1 bg-primary/20 backdrop-blur-md text-primary text-[10px] font-bold rounded-full absolute bottom-8 border border-primary/30">
                      {isExecuting ? "ZAk OVERLAY: RUNNING..." : isRecording ? "ZAk OVERLAY: RECORDING..." : "LIVE PREVIEW"}
                    </div>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ActivityIcon() {
  return (
    <div className="flex gap-0.5 items-end h-4">
      <div className="w-1 bg-current animate-bounce [animation-delay:-0.3s]" style={{ height: '100%' }} />
      <div className="w-1 bg-current animate-bounce [animation-delay:-0.15s]" style={{ height: '60%' }} />
      <div className="w-1 bg-current animate-bounce" style={{ height: '80%' }} />
    </div>
  )
}
