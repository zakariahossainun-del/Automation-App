
"use client"

import { Database, Search, Filter, Play, MoreVertical, Star, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

const profiles = [
  { id: 1, name: "Daily Checkin", desc: "Automates morning app logins and rewards", actions: 12, lastUsed: "2h ago", fav: true },
  { id: 2, name: "System Cleanup", desc: "Clears cache and force stops background apps", actions: 8, lastUsed: "1d ago", fav: false },
  { id: 3, name: "Network Toggle", desc: "Switches between 5G/LTE based on signal", actions: 4, lastUsed: "5m ago", fav: true },
  { id: 4, name: "Social Auto-Scroll", desc: "Simulated engagement for test profiles", actions: 15, lastUsed: "Never", fav: false },
]

export default function Vault() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <header className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="font-headline text-3xl font-bold flex items-center gap-3">
            <Database className="text-primary" />
            Workflow Vault
          </h2>
          <p className="text-muted-foreground">Centralized repository for your automation logic.</p>
        </div>
        <Button className="bg-primary text-primary-foreground font-bold rounded-full px-6">
          Import Profile
        </Button>
      </header>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input placeholder="Search profiles..." className="pl-10 bg-card border-border h-12 text-lg" />
        </div>
        <Button variant="outline" className="h-12 px-6 gap-2 border-border">
          <Filter size={18} /> Filters
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {profiles.map(p => (
          <Card key={p.id} className="border-none bg-card hover:bg-card/80 hover:scale-[1.02] staccato-transition shadow-lg overflow-hidden flex flex-col">
            <CardHeader className="relative">
              <div className="flex justify-between items-start">
                <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <Database size={20} />
                </div>
                <div className="flex gap-1">
                   {p.fav && <Star size={16} className="text-amber-400 fill-amber-400" />}
                   <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                      <MoreVertical size={16} />
                   </Button>
                </div>
              </div>
              <CardTitle className="font-headline text-xl mt-4">{p.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-muted-foreground line-clamp-2">{p.desc}</p>
              <div className="mt-6 flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Database size={12} className="text-secondary" />
                  {p.actions} Actions
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={12} className="text-secondary" />
                  {p.lastUsed}
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/30 p-4 border-t border-border">
               <Button className="w-full gap-2 bg-secondary/10 text-secondary border border-secondary/20 hover:bg-secondary/20 staccato-transition">
                  <Play size={16} /> Deploy Workflow
               </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
