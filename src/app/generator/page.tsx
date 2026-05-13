
"use client"

import { useState } from "react"
import { Sparkles, Terminal, Play, Save, Loader2, Bot, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { generateAutomationFromNaturalLanguage } from "@/ai/flows/generate-automation-from-natural-language"
import type { GenerateAutomationOutput } from "@/ai/flows/generate-automation-from-natural-language"
import { useToast } from "@/hooks/use-toast"

export default function AIGenerator() {
  const [prompt, setPrompt] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<GenerateAutomationOutput | null>(null)
  const { toast } = useToast()

  async function handleGenerate() {
    if (!prompt.trim()) return
    
    setLoading(true)
    try {
      const output = await generateAutomationFromNaturalLanguage({
        naturalLanguageDescription: prompt
      })
      setResult(output)
      toast({
        title: "Automation Generated",
        description: "AI has successfully mapped the sequence."
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: "An error occurred while generating the sequence."
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <header className="space-y-2">
        <h2 className="font-headline text-3xl font-bold flex items-center gap-3">
          <Sparkles className="text-primary" />
          AI Logic Generator
        </h2>
        <p className="text-muted-foreground">Describe your task in plain English and let OMNIBOT architect the logic.</p>
      </header>

      <Card className="border-none bg-card shadow-2xl">
        <CardContent className="p-8 space-y-6">
          <div className="space-y-3">
            <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Natural Language Prompt</label>
            <Textarea 
              placeholder="e.g., 'Open Settings, scroll down to Battery, and tap on Power Saving mode...'"
              className="min-h-[150px] bg-background border-border focus:border-primary focus:ring-primary/20 text-lg resize-none"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>
          <div className="flex justify-end">
            <Button 
              onClick={handleGenerate} 
              disabled={loading || !prompt.trim()}
              className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8 rounded-full font-bold gap-2"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Bot size={20} />}
              Generate Sequence
            </Button>
          </div>
        </CardContent>
      </Card>

      {result && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card className="md:col-span-2 border-none bg-card shadow-xl">
            <CardHeader className="border-b border-border/50">
              <CardTitle className="text-lg font-headline flex items-center gap-2">
                <Layers className="text-secondary" size={18} />
                Action Sequence
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/50">
                {result.actions.map((action, idx) => (
                  <div key={idx} className="p-4 flex items-start gap-4 hover:bg-muted/30 staccato-transition">
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold shrink-0">
                      {idx + 1}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-primary capitalize">{action.type}</span>
                        {action.type === 'delay' && <span className="text-xs text-muted-foreground">{action.durationMs}ms</span>}
                      </div>
                      <p className="text-sm text-muted-foreground">{action.description || `Automated ${action.type} action.`}</p>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {'x' in action && <ActionBadge label="X" val={action.x} />}
                        {'y' in action && <ActionBadge label="Y" val={action.y} />}
                        {'packageName' in action && <ActionBadge label="Package" val={action.packageName} />}
                        {'text' in action && <ActionBadge label="Text" val={action.text} />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-none bg-secondary/5 border-l-4 border-secondary shadow-lg">
              <CardHeader>
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-secondary">AI Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">{result.summary}</p>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-3">
              <Button className="w-full gap-2 bg-secondary hover:bg-secondary/90 h-12 font-bold">
                <Play size={18} />
                Run Now
              </Button>
              <Button variant="outline" className="w-full gap-2 h-12 font-bold border-border">
                <Save size={18} />
                Save to Vault
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function ActionBadge({ label, val }: { label: string, val: string | number }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-muted text-[10px] font-bold text-muted-foreground">
      <span className="text-secondary opacity-70">{label}:</span>
      {val}
    </span>
  )
}
