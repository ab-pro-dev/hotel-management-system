"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, DollarSign, Loader2 } from "lucide-react";
import {
  setPriceOverride,
  removePriceOverride,
  listPriceOverrides,
} from "@/lib/actions/price-override";

type RoomType = {
  id: string;
  title: string;
  basePrice: number;
};

type Override = {
  id: string;
  date: string;
  overridePrice: number;
};

type Props = {
  roomTypes: RoomType[];
};

export default function PricingManager({ roomTypes }: Props) {
  const router = useRouter();
  const [selectedRoomType, setSelectedRoomType] = useState<string>(roomTypes[0]?.id ?? "");
  const [overrides, setOverrides] = useState<Override[]>([]);
  const [loading, setLoading] = useState(false);
  const [newDate, setNewDate] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!selectedRoomType) return;
    setLoading(true);
    listPriceOverrides(selectedRoomType)
      .then((data) =>
        setOverrides(
          data.map((o) => ({
            id: o.id,
            date: o.date.toISOString().split("T")[0],
            overridePrice: Number(o.overridePrice),
          }))
        )
      )
      .catch(() => setOverrides([]))
      .finally(() => setLoading(false));
  }, [selectedRoomType]);

  async function handleAdd() {
    if (!selectedRoomType || !newDate || !newPrice) return;
    setSaving(true);
    try {
      await setPriceOverride({
        roomTypeId: selectedRoomType,
        date: newDate,
        overridePrice: parseFloat(newPrice),
      });
      setNewDate("");
      setNewPrice("");
      const data = await listPriceOverrides(selectedRoomType);
      setOverrides(
        data.map((o) => ({
          id: o.id,
          date: o.date.toISOString().split("T")[0],
          overridePrice: Number(o.overridePrice),
        }))
      );
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  async function handleRemove(id: string) {
    setSaving(true);
    try {
      await removePriceOverride(id);
      setOverrides((prev) => prev.filter((o) => o.id !== id));
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  const selectedRT = roomTypes.find((rt) => rt.id === selectedRoomType);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Room Type</Label>
        <Select value={selectedRoomType} onValueChange={(v: string | null) => v && setSelectedRoomType(v)}>
          <SelectTrigger className="w-full max-w-sm">
            <SelectValue placeholder="Select room type" />
          </SelectTrigger>
          <SelectContent>
            {roomTypes.map((rt) => (
              <SelectItem key={rt.id} value={rt.id}>
                {rt.title} — ${Number(rt.basePrice).toFixed(2)}/night base
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <DollarSign className="h-4 w-4" />
            Add Price Override
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="space-y-1 flex-1">
              <Label htmlFor="overrideDate">Date</Label>
              <Input
                id="overrideDate"
                type="date"
                value={newDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setNewDate(e.target.value)}
              />
            </div>
            <div className="space-y-1 flex-1">
              <Label htmlFor="overridePrice">Override Price ($)</Label>
              <Input
                id="overridePrice"
                type="number"
                min="0"
                step="0.01"
                placeholder={selectedRT ? String(selectedRT.basePrice) : "0.00"}
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
              />
            </div>
            <Button onClick={handleAdd} disabled={!newDate || !newPrice || saving} className="gap-1">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Set Override
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Active Overrides</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : overrides.length === 0 ? (
            <p className="text-sm text-muted-foreground">No overrides set for this room type.</p>
          ) : (
            <div className="space-y-2">
              {overrides.map((o) => (
                <div
                  key={o.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">{o.date}</span>
                    <Badge variant="secondary">${o.overridePrice.toFixed(2)}</Badge>
                    {selectedRT && o.overridePrice < Number(selectedRT.basePrice) && (
                      <Badge variant="outline" className="text-green-600">Discount</Badge>
                    )}
                    {selectedRT && o.overridePrice > Number(selectedRT.basePrice) && (
                      <Badge variant="outline" className="text-red-600">Surcharge</Badge>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemove(o.id)}
                    disabled={saving}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
