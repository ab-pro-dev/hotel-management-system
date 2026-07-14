"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Search, Wifi, Tv, Wind, Coffee, Bath, Eye, PawPrint, Shirt } from "lucide-react";

const AVAILABLE_AMENITIES = [
  { value: "wifi", labelKey: "wifi", icon: Wifi },
  { value: "tv", labelKey: "tv", icon: Tv },
  { value: "air-conditioning", labelKey: "airConditioning", icon: Wind },
  { value: "coffee-maker", labelKey: "coffeeMaker", icon: Coffee },
  { value: "minibar", labelKey: "minibar", icon: Coffee },
  { value: "balcony", labelKey: "balcony", icon: Eye },
  { value: "bathrobe", labelKey: "bathrobe", icon: Shirt },
  { value: "soaking-tub", labelKey: "soakingTub", icon: Bath },
  { value: "city-views", labelKey: "cityViews", icon: Eye },
  { value: "pet-friendly", labelKey: "petFriendly", icon: PawPrint },
];

type SearchParams = {
  checkIn?: string;
  checkOut?: string;
  capacity?: string;
  minPrice?: string;
  maxPrice?: string;
  amenities?: string;
};

export default function FilterForm({ searchParams }: { searchParams: SearchParams }) {
  const t = useTranslations("rooms");
  const tAmenity = useTranslations("amenities");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(
    searchParams.amenities?.split(",").filter(Boolean) ?? []
  );

  function toggleAmenity(value: string, checked: boolean) {
    setSelectedAmenities((prev) =>
      checked ? [...prev, value] : prev.filter((v) => v !== value)
    );
  }

  return (
    <form method="get" className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-2">
          <Label htmlFor="checkIn">{t("filterCheckIn")}</Label>
          <Input
            type="date"
            id="checkIn"
            name="checkIn"
            defaultValue={searchParams.checkIn ?? ""}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="checkOut">{t("filterCheckOut")}</Label>
          <Input
            type="date"
            id="checkOut"
            name="checkOut"
            defaultValue={searchParams.checkOut ?? ""}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="capacity">{t("filterMinCapacity")}</Label>
          <Input
            type="number"
            id="capacity"
            name="capacity"
            placeholder="e.g. 2"
            min="1"
            defaultValue={searchParams.capacity ?? ""}
          />
        </div>
        <div className="space-y-2">
          <Label>{t("filterPriceRange")}</Label>
          <div className="flex gap-2">
            <Input
              type="number"
              name="minPrice"
              placeholder={t("filterMin")}
              min="0"
              defaultValue={searchParams.minPrice ?? ""}
            />
            <Input
              type="number"
              name="maxPrice"
              placeholder={t("filterMax")}
              min="0"
              defaultValue={searchParams.maxPrice ?? ""}
            />
          </div>
        </div>
      </div>

      <input type="hidden" name="amenities" value={selectedAmenities.join(",")} />

      <div className="space-y-2">
        <Label>{t("filterAmenities")}</Label>
        <div className="flex flex-wrap gap-3">
          {AVAILABLE_AMENITIES.map((a) => {
            const Icon = a.icon;
            const checked = selectedAmenities.includes(a.value);
            return (
              <label
                key={a.value}
                className={`flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors ${
                  checked
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/50"
                }`}
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={checked}
                  onChange={(e) => toggleAmenity(a.value, e.target.checked)}
                />
                <Icon className="h-3.5 w-3.5" />
                {tAmenity(a.labelKey)}
              </label>
            );
          })}
        </div>
      </div>

      <Button type="submit" className="gap-2">
        <Search className="h-4 w-4" />
        {t("search")}
      </Button>
    </form>
  );
}
