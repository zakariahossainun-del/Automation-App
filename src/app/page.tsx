import { 
  Zap, 
  Play, 
  History, 
  Cpu, 
  Activity,
  ArrowRight,
  ShieldCheck
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Dashboard() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="font-headline text-3xl font-bold">ZAk Version 2.0 | System Overview</h2>
          <p className="text-muted-foreground">Control and monitor your autonomous bot fleet.</p>
          <p className="text-xs text-primary font-bold mt-2">This app is made By Zakaria-Zak</p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" className="gap-2 border-primary/20 text-primary hover:bg-primary/10">
            <History size={16} />
            History
          </Button>
          <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
            <Play size={16} />
            New Bot
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard icon={Zap} title="Active Bots" value="12" subValue="+2 today" color="text-primary" />
        <StatsCard icon={Activity} title="Operations" value="1.2k" subValue="Last 24h" color="text-secondary" />
        <StatsCard icon={ShieldCheck} title="Success Rate" value="98.2%" subValue="Healthy" color="text-green-400" />
        <StatsCard icon={Cpu} title="CPU Load" value="14%" subValue="Optimized" color="text-amber-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-none bg-card shadow-2xl">
          <CardHeader>
            <CardTitle className="font-headline text-xl flex items-center gap-2">
              <Activity className="text-secondary" size={20} />
              Live Bot Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center border-t border-border/50 pt-6">
              <div className="text-center space-y-4">
                <div className="flex gap-2 justify-center">
                  {[40, 70, 45, 90, 65, 80, 50, 60, 85].map((h, i) => (
                    <div 
                      key={i} 
                      style={{ height: `${h}px` }} 
                      className="w-8 bg-gradient-to-t from-primary/10 to-primary rounded-t-sm"
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">Real-time throughput metrics (TPS)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none bg-card shadow-2xl overflow-hidden">
          <CardHeader className="bg-primary/5">
            <CardTitle className="font-headline text-xl">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <QuickActionLink 
              href="/architect" 
              title="Architect" 
              desc="Build custom sequences" 
            />
            <QuickActionLink 
              href="/generator" 
              title="AI Generator" 
              desc="Prompt to automation" 
            />
            <QuickActionLink 
              href="/vault" 
              title="Workflow Vault" 
              desc="Browse saved profiles" 
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function StatsCard({ icon: Icon, title, value, subValue, color }: any) {
  return (
    <Card className="border-none bg-card/50 backdrop-blur-sm shadow-lg overflow-hidden relative group">
      <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
        <Icon size={48} />
      </div>
      <CardContent className="p-6">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">{title}</p>
        <div className={`text-3xl font-headline font-bold mb-1 ${color}`}>{value}</div>
        <p className="text-xs text-muted-foreground">{subValue}</p>
      </CardContent>
    </Card>
  )
}

function QuickActionLink({ href, title, desc }: { href: string, title: string, desc: string }) {
  return (
    <Link href={href} className="flex items-center justify-between p-4 rounded-xl hover:bg-muted group staccato-transition border border-transparent hover:border-border">
      <div>
        <h4 className="font-bold text-foreground group-hover:text-primary staccato-transition">{title}</h4>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
      <ArrowRight size={18} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 staccato-transition" />
    </Link>
  )
}
