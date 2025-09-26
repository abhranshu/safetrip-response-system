"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ShieldCheck, Siren, MapPinned, Smartphone, MonitorCheck, Navigation } from "lucide-react";
import TouristApp from "@/components/TouristApp";
import OperatorDashboard from "@/components/OperatorDashboard";
import ResponderApp from "@/components/ResponderApp";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [time, setTime] = useState<string>("");
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    setTime(new Date().toLocaleTimeString());
    const id = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background">
      <div className="mx-auto w-full max-w-6xl px-4 py-8">
        <header className="mb-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-sky-600/10 ring-1 ring-sky-600/20 grid place-items-center">
                <ShieldCheck className="h-6 w-6 text-sky-600" />
              </div>
              <div>
                <h1 className="text-xl font-semibold tracking-tight">Smart Tourist Safety Monitoring & Incident Response</h1>
                <p className="text-sm text-muted-foreground">Calming blue/green for safety, red/orange for alerts • {mounted ? time : "Loading..."}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="rounded-full"><MapPinned className="mr-1 h-3 w-3 text-sky-600" /> Real-time simulation</Badge>
              <Badge variant="outline" className="rounded-full"><Siren className="mr-1 h-3 w-3 text-rose-600" /> Alerts ready</Badge>
            </div>
          </div>
        </header>

        <Card className="rounded-2xl shadow-sm border">
          <CardHeader>
            <CardTitle className="text-base">Interfaces</CardTitle>
            <CardDescription>Switch between user perspectives to test flows quickly</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="tourist" className="w-full">
              <TabsList className="rounded-full">
                <TabsTrigger value="tourist" className="rounded-full"><Smartphone className="mr-2 h-4 w-4 text-emerald-600" /> Tourist App</TabsTrigger>
                <TabsTrigger value="operator" className="rounded-full"><MonitorCheck className="mr-2 h-4 w-4 text-sky-600" /> Operator Dashboard</TabsTrigger>
                <TabsTrigger value="responder" className="rounded-full"><Navigation className="mr-2 h-4 w-4 text-indigo-600" /> Responder App</TabsTrigger>
              </TabsList>

              <TabsContent value="tourist" className="mt-4">
                <TouristApp />
              </TabsContent>
              <TabsContent value="operator" className="mt-4">
                <OperatorDashboard />
              </TabsContent>
              <TabsContent value="responder" className="mt-4">
                <ResponderApp />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <footer className="mt-8 text-center text-xs text-muted-foreground">
          Built with trust-first design, rounded cards, and soft shadows. Icons by lucide-react.
        </footer>
      </div>
    </div>
  );
}