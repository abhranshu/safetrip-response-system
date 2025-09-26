"use client";

import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import L from "leaflet";
import { useMemo } from "react";
import "leaflet/dist/leaflet.css";

// Fix Leaflet's default icon paths in bundlers like Next.js
import icon2x from "leaflet/dist/images/marker-icon-2x.png";
import icon1x from "leaflet/dist/images/marker-icon.png";
import shadow from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: icon2x.src ?? icon2x as unknown as string,
  iconUrl: icon1x.src ?? icon1x as unknown as string,
  shadowUrl: shadow.src ?? shadow as unknown as string,
});

export type LatLng = [number, number];

export interface MarkerData {
  position: LatLng;
  popup?: string;
}

interface LeafletMapProps {
  center: LatLng;
  zoom?: number;
  markers?: MarkerData[];
  route?: { from: LatLng; to: LatLng; color?: string } | null;
  className?: string;
}

export const LeafletMap = ({ center, zoom = 13, markers = [], route = null, className }: LeafletMapProps) => {
  const polylinePositions = useMemo<LatLngExpression[] | null>(() => {
    if (!route) return null;
    return [route.from, route.to];
  }, [route]);

  return (
    <div className={className}>
      <MapContainer center={center as LatLngExpression} zoom={zoom} scrollWheelZoom className="h-full w-full">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {markers.map((m, idx) => (
          <Marker key={idx} position={m.position as LatLngExpression}>
            {m.popup ? <Popup>{m.popup}</Popup> : null}
          </Marker>
        ))}
        {polylinePositions ? (
          <Polyline positions={polylinePositions} color={route?.color ?? "#0ea5e9"} />
        ) : null}
      </MapContainer>
    </div>
  );
};

export default LeafletMap;