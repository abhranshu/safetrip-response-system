"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MapPinned, Navigation, PhoneCall, MessageSquare, CheckCircle2, Clock, Siren, Route } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import dynamic from "next/dynamic";
import type { LatLng, MarkerData } from "@/components/map/LeafletMap";
const LeafletMap = dynamic(() => import("@/components/map/LeafletMap"), { ssr: false });

function useTicker(ms: number) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), ms);
    return () => clearInterval(id);
  }, [ms]);
  return tick;
}

const queue = [
  { id: "INC-1026", title: "SOS - Critical", location: "Harbor Gate", distance: 1.2, priority: "Critical" },
  { id: "INC-1024", title: "Medical - High", location: "Night Market", distance: 2.8, priority: "High" },
  { id: "INC-1025", title: "Theft - Medium", location: "Old Town", distance: 4.1, priority: "Medium" },
];

export default function ResponderApp() {
  const tick = useTicker(2500);
  const [status, setStatus] = useState<string>("available");
  const [active, setActive] = useState(queue[0]);

  const eta = useMemo(() => Math.max(1, Math.round(active.distance * 2 - (tick % 3))), [active.distance, tick]);

  // Basic coords for demo (city center) and named locations
  const center: LatLng = [1.3521, 103.8198]; // Example: Singapore
  const namedLocations: Record<string, LatLng> = {
    "Harbor Gate": [1.265, 103.8205],
    "Night Market": [1.305, 103.852],
    "Old Town": [1.292, 103.845],
  };
  const you: LatLng = [center[0] + 0.01, center[1] - 0.015];
  const incident: LatLng = namedLocations[active.location] ?? [center[0] + 0.02, center[1] + 0.02];
  const markers: MarkerData[] = [
    { position: you, popup: "You" },
    { position: incident, popup: active.title },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Card className="rounded-xl shadow-sm border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Siren className="h-5 w-5 text-rose-600" /> Incident Queue
          </CardTitle>
          <CardDescription>Tap to focus, then navigate</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {queue.map((item) => (
            <div key={item.id} className={`flex items-center justify-between rounded-lg border p-3 ${active.id === item.id ? "bg-secondary/60" : "bg-background"}`}>
              <div>
                <div className="font-medium">{item.title}</div>
                <div className="text-sm text-muted-foreground">{item.location} • {item.distance} km</div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={
                  item.priority === "Critical"
                    ? "bg-rose-50 text-rose-700 border-rose-200"
                    : item.priority === "High"
                    ? "bg-orange-50 text-orange-700 border-orange-200"
                    : "bg-amber-50 text-amber-700 border-amber-200"
                }>
                  {item.priority}
                </Badge>
                <Button size="sm" className="rounded-full" onClick={() => setActive(item)}>Focus</Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-4">
        <Card className="rounded-xl shadow-sm border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><MapPinned className="h-5 w-5 text-sky-600" /> Navigation</CardTitle>
            <CardDescription>Guidance to the active incident</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative aspect-[9/12] w-full overflow-hidden rounded-lg border bg-muted">
              <div className="absolute inset-0">
                <LeafletMap
                  center={center}
                  zoom={13}
                  markers={markers}
                  route={{ from: you, to: incident, color: "#0ea5e9" }}
                  className="h-full w-full"
                />
              </div>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/40 via-background/0 to-background/20" />
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="rounded-full"><Clock className="mr-1 h-3 w-3" /> ETA {eta}m</Badge>
              <Badge variant="secondary" className="rounded-full"><Route className="mr-1 h-3 w-3 text-sky-600" /> {active.distance} km</Badge>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <Button className="rounded-full"><Navigation className="mr-2 h-4 w-4" /> Start</Button>
              <Button className="rounded-full" variant="outline"><PhoneCall className="mr-2 h-4 w-4 text-emerald-600" /> Call</Button>
              <Button className="rounded-full" variant="outline"><MessageSquare className="mr-2 h-4 w-4 text-sky-600" /> Message</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-emerald-600" /> Response Status</CardTitle>
            <CardDescription>Update your current state</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-2">
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="rounded-full w-44"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="en-route">En Route</SelectItem>
                <SelectItem value="on-scene">On Scene</SelectItem>
                <SelectItem value="transporting">Transporting</SelectItem>
                <SelectItem value="clear">Clear</SelectItem>
              </SelectContent>
            </Select>
            <Badge variant="outline" className={
              status === "on-scene" || status === "clear"
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : status === "en-route" || status === "transporting"
                ? "bg-sky-50 text-sky-700 border-sky-200"
                : "bg-muted text-muted-foreground"
            }>
              {status}
            </Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}