"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, MapPinned, Siren, Users2, ShieldCheck, Lock, Radio, BellRing, Route, CheckCircle2, XCircle } from "lucide-react";
import LeafletMap, { type LatLng, type MarkerData } from "@/components/map/LeafletMap";

function useTicker(ms: number) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), ms);
    return () => clearInterval(id);
  }, [ms]);
  return tick;
}

const mockIncidents = [
  { id: "INC-1024", type: "Medical", severity: "High", status: "Open", location: "Night Market", eta: 6 },
  { id: "INC-1025", type: "Theft", severity: "Medium", status: "Acknowledged", location: "Old Town", eta: 12 },
  { id: "INC-1026", type: "SOS", severity: "Critical", status: "Open", location: "Harbor Gate", eta: 3 },
  { id: "INC-1027", type: "Lost", severity: "Low", status: "Resolved", location: "City Park", eta: 0 },
];

export default function OperatorDashboard() {
  const tick = useTicker(3000);
  const [filter, setFilter] = useState<string>("all");
  const [selected, setSelected] = useState<string | null>(null);

  const stats = useMemo(() => {
    const online = 24 + (tick % 5);
    const activeIncidents = 2 + ((tick + 1) % 3);
    const avgETA = 7 - ((tick % 4) - 1);
    return { online, activeIncidents, avgETA };
  }, [tick]);

  const filteredIncidents = useMemo(() => {
    if (filter === "all") return mockIncidents;
    if (filter === "open") return mockIncidents.filter((i) => i.status === "Open");
    if (filter === "ack") return mockIncidents.filter((i) => i.status === "Acknowledged");
    if (filter === "resolved") return mockIncidents.filter((i) => i.status === "Resolved");
    return mockIncidents;
  }, [filter]);

  // Map setup: simple city center with simulated responders and incident markers
  const center: LatLng = [1.3521, 103.8198];
  const responders: LatLng[] = useMemo(() => {
    return Array.from({ length: 6 }).map((_, i) => [
      center[0] + 0.01 * Math.sin((tick + i) * 0.1),
      center[1] + 0.01 * Math.cos((tick + i * 2) * 0.1),
    ] as LatLng);
  }, [tick]);
  const incidentPositions: LatLng[] = useMemo(() => {
    return filteredIncidents.map((_, idx) => [
      center[0] + 0.02 + idx * 0.005,
      center[1] + 0.015 + idx * 0.004,
    ] as LatLng);
  }, [filteredIncidents]);
  const markers: MarkerData[] = useMemo(() => {
    const r = responders.map((pos, i) => ({ position: pos, popup: `Responder #${i + 1}` }));
    const inc = incidentPositions.map((pos, i) => ({ position: pos, popup: `${filteredIncidents[i]?.id} • ${filteredIncidents[i]?.type}` }));
    return [...r, ...inc];
  }, [responders, incidentPositions, filteredIncidents]);

  return (
    <div className="grid gap-4 xl:grid-cols-3">
      <Card className="xl:col-span-2 rounded-xl shadow-sm border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPinned className="h-5 w-5 text-sky-600" />
            Real-time Operations Map
          </CardTitle>
          <CardDescription>Live overview of tourists and incidents</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg border bg-muted">
            <div className="absolute inset-0">
              <LeafletMap center={center} zoom={13} markers={markers} className="h-full w-full" />
            </div>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/40 via-background/0 to-background/20" />
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge className="rounded-full" variant="secondary">
              <Users2 className="mr-1 h-3 w-3 text-emerald-600" /> {stats.online} responders online
            </Badge>
            <Badge className="rounded-full" variant="secondary">
              <Siren className="mr-1 h-3 w-3 text-rose-600" /> {stats.activeIncidents} active incidents
            </Badge>
            <Badge className="rounded-full" variant="secondary">
              <Route className="mr-1 h-3 w-3 text-sky-600" /> avg ETA {stats.avgETA}m
            </Badge>
            <Badge className="rounded-full" variant="outline">
              <Lock className="mr-1 h-3 w-3 text-indigo-600" /> blockchain verified logs
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        <Card className="rounded-xl shadow-sm border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><BellRing className="h-5 w-5 text-amber-600" /> Alert Management</CardTitle>
            <CardDescription>Filter and manage incident workflow</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="rounded-full w-40"><SelectValue placeholder="Filter" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="ack">Acknowledged</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="rounded-full"><ShieldCheck className="mr-2 h-4 w-4 text-emerald-600" /> Auto-Dispatch</Button>
            </div>
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredIncidents.map((i) => (
                    <TableRow key={i.id} className={selected === i.id ? "bg-secondary/60" : undefined} onClick={() => setSelected(i.id)}>
                      <TableCell className="font-medium">{i.id}</TableCell>
                      <TableCell>{i.type}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={
                          i.severity === "Critical"
                            ? "bg-rose-50 text-rose-700 border-rose-200"
                            : i.severity === "High"
                            ? "bg-orange-50 text-orange-700 border-orange-200"
                            : i.severity === "Medium"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-emerald-50 text-emerald-700 border-emerald-200"
                        }>
                          {i.severity}
                        </Badge>
                      </TableCell>
                      <TableCell>{i.status}</TableCell>
                      <TableCell>{i.location}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button size="sm" className="rounded-full" variant="secondary"><Radio className="mr-1 h-3 w-3" /> Ack</Button>
                        <Button size="sm" className="rounded-full"><Route className="mr-1 h-3 w-3" /> Dispatch</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-rose-600" /> System Health</CardTitle>
            <CardDescription>Integrity and uptime</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="rounded-full"><CheckCircle2 className="mr-1 h-3 w-3 text-emerald-600" /> API healthy</Badge>
            <Badge variant="secondary" className="rounded-full"><CheckCircle2 className="mr-1 h-3 w-3 text-emerald-600" /> Websocket live</Badge>
            <Badge variant="secondary" className="rounded-full"><XCircle className="mr-1 h-3 w-3 text-amber-600" /> 1 delayed queue</Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}