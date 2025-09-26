"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Phone, PhoneCall, ShieldCheck, Siren, MapPinned, Fence, Users, AlertTriangle, Lock } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

function useTicker(ms: number) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), ms);
    return () => clearInterval(id);
  }, [ms]);
  return tick;
}

export default function TouristApp() {
  const tick = useTicker(2500);
  const [status, setStatus] = useState<"safe" | "caution" | "alert">("safe");
  const [selectedContact, setSelectedContact] = useState("local-police");

  useEffect(() => {
    // lightweight simulation of changing safety status
    const r = Math.random();
    if (r > 0.92) setStatus("alert");
    else if (r > 0.75) setStatus("caution");
    else setStatus("safe");
  }, [tick]);

  const statusConfig = useMemo(() => ({
    safe: {
      label: "You're safe",
      color: "bg-emerald-50 text-emerald-700 border-emerald-200",
      dot: "bg-emerald-500",
      icon: <ShieldCheck className="h-4 w-4" />,
    },
    caution: {
      label: "Be cautious nearby",
      color: "bg-amber-50 text-amber-700 border-amber-200",
      dot: "bg-amber-500",
      icon: <AlertTriangle className="h-4 w-4" />,
    },
    alert: {
      label: "Incident nearby",
      color: "bg-rose-50 text-rose-700 border-rose-200",
      dot: "bg-rose-500",
      icon: <Siren className="h-4 w-4" />,
    },
  }), []);

  const geofenceMsg = status === "safe" ? "Within safe area" : status === "caution" ? "Near geofence boundary" : "Exited safe zone!";

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Card className="rounded-xl shadow-sm border border-border/80">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPinned className="h-5 w-5 text-sky-600" />
            Live Location
          </CardTitle>
          <CardDescription>Real-time map preview with soft overlays</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className="relative aspect-[9/12] w-full overflow-hidden rounded-lg border bg-muted"
            style={{
              backgroundImage:
                "url(https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-background/0 to-background/20" />
            {/* Tourist marker */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="h-4 w-4 rounded-full bg-sky-500 ring-4 ring-sky-500/30 shadow" />
              <div className="mt-2 text-xs text-foreground/80 px-2 py-1 rounded-full bg-background/90 shadow border">You</div>
            </div>
            {/* Geofence ring */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-emerald-400/60" style={{ width: 220, height: 220 }} />
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm ${statusConfig[status].color}`}>
              <span className={`h-2 w-2 rounded-full ${statusConfig[status].dot}`} />
              {statusConfig[status].icon}
              <span>{statusConfig[status].label}</span>
            </div>
            <Badge variant="secondary" className="rounded-full">{geofenceMsg}</Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        <Card className="rounded-xl shadow-sm border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Siren className="h-5 w-5 text-rose-600" />
              SOS & Quick Actions
            </CardTitle>
            <CardDescription>Fast access during emergencies</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <Button size="lg" className="h-12 rounded-full bg-rose-600 hover:bg-rose-700 text-white shadow-md">
                <Siren className="mr-2 h-5 w-5" />
                Send SOS
              </Button>
              <Button variant="outline" className="h-12 rounded-full">
                <Lock className="mr-2 h-5 w-5 text-emerald-600" />
                Secure Check-in
              </Button>
            </div>
            <Separator />
            <div className="grid gap-2">
              <div className="text-sm font-medium">Emergency Contacts</div>
              <div className="flex items-center gap-2">
                <Select value={selectedContact} onValueChange={setSelectedContact}>
                  <SelectTrigger className="rounded-full">
                    <SelectValue placeholder="Choose contact" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="local-police">Local Police</SelectItem>
                    <SelectItem value="tour-operator">Tour Operator</SelectItem>
                    <SelectItem value="embassy-support">Embassy Support</SelectItem>
                    <SelectItem value="medical-emergency">Medical Emergency</SelectItem>
                  </SelectContent>
                </Select>
                <Button className="rounded-full" variant="secondary">
                  <PhoneCall className="mr-2 h-4 w-4" /> Call
                </Button>
                <Button className="rounded-full" variant="outline">
                  <Phone className="mr-2 h-4 w-4" /> SMS
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Fence className="h-5 w-5 text-emerald-600" />
              Geofencing Alerts
            </CardTitle>
            <CardDescription>Boundaries and notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Old Town Safe Zone</div>
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 rounded-full">Active</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Harbor Restricted</div>
              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 rounded-full">Warning</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Night Market</div>
              <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200 rounded-full">Alert</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-sky-600" />
              Nearby Support
            </CardTitle>
            <CardDescription>Trusted responders around you</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Badge key={i} variant="secondary" className="rounded-full">Responder #{i + 1} • {200 + i * 30}m</Badge>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}