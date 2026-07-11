"use client";

import { useReducer, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Check, CreditCard, User, Calendar, Loader2, Tag } from "lucide-react";
import { createBooking } from "@/lib/actions/booking";
import { applyCoupon, type CouponResult } from "@/lib/actions/coupon";

type RoomType = {
  id: string;
  title: string;
  description: string;
  basePrice: number;
  capacity: number;
};

type State = {
  step: number;
  checkIn: string;
  checkOut: string;
  name: string;
  email: string;
  cardNumber: string;
  expiry: string;
  cvc: string;
  couponCode: string;
};

type Action =
  | { type: "NEXT" }
  | { type: "BACK" }
  | { type: "SET_FIELD"; field: keyof State; value: string };

function getNights(checkIn: string, checkOut: string): number {
  if (!checkIn || !checkOut) return 0;
  const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "NEXT":
      return { ...state, step: Math.min(state.step + 1, 3) };
    case "BACK":
      return { ...state, step: Math.max(state.step - 1, 0) };
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    default:
      return state;
  }
}

function StepIndicator({ current, t }: { current: number; t: ReturnType<typeof useTranslations> }) {
  const steps = [
    { label: t("booking.stepDates"), icon: Calendar },
    { label: t("booking.stepDetails"), icon: User },
    { label: t("booking.stepPayment"), icon: CreditCard },
    { label: t("booking.stepConfirm"), icon: Check },
  ];

  return (
    <div className="flex items-center justify-center gap-2">
      {steps.map((s, i) => {
        const Icon = s.icon;
        const active = i === current;
        const done = i < current;
        return (
          <div key={s.label} className="flex items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium transition-colors ${
                done
                  ? "bg-primary text-primary-foreground"
                  : active
                    ? "bg-primary/10 text-primary ring-2 ring-primary"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {done ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
            </div>
            <span className={`hidden text-sm sm:inline ${active ? "font-medium text-foreground" : "text-muted-foreground"}`}>
              {s.label}
            </span>
            {i < steps.length - 1 && <div className="mx-1 hidden h-px w-8 bg-border sm:block" />}
          </div>
        );
      })}
    </div>
  );
}

function StepDates({ state, dispatch, roomType, t }: { state: State; dispatch: React.Dispatch<Action>; roomType: RoomType; t: ReturnType<typeof useTranslations> }) {
  const nights = getNights(state.checkIn, state.checkOut);
  const total = nights * roomType.basePrice;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="checkIn">{t("booking.checkInDate")}</Label>
        <Input
          type="date"
          id="checkIn"
          value={state.checkIn}
          onChange={(e) => dispatch({ type: "SET_FIELD", field: "checkIn", value: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="checkOut">{t("booking.checkOutDate")}</Label>
        <Input
          type="date"
          id="checkOut"
          value={state.checkOut}
          onChange={(e) => dispatch({ type: "SET_FIELD", field: "checkOut", value: e.target.value })}
        />
      </div>
      {nights > 0 && (
        <div className="rounded-lg bg-muted p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {nights === 1 ? t("booking.night", { count: 1 }) : t("booking.nights", { count: nights })} × ${roomType.basePrice.toFixed(2)}
            </span>
            <span className="text-lg font-bold">${total.toFixed(2)}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function StepDetails({ state, dispatch, t }: { state: State; dispatch: React.Dispatch<Action>; t: ReturnType<typeof useTranslations> }) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">{t("booking.fullName")}</Label>
        <Input
          id="name"
          placeholder="John Doe"
          value={state.name}
          onChange={(e) => dispatch({ type: "SET_FIELD", field: "name", value: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">{t("booking.emailAddress")}</Label>
        <Input
          type="email"
          id="email"
          placeholder="john@example.com"
          value={state.email}
          onChange={(e) => dispatch({ type: "SET_FIELD", field: "email", value: e.target.value })}
        />
      </div>
    </div>
  );
}

function StepPayment({ state, dispatch, t }: { state: State; dispatch: React.Dispatch<Action>; t: ReturnType<typeof useTranslations> }) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="cardNumber">{t("booking.cardNumber")}</Label>
        <Input
          id="cardNumber"
          placeholder="4242 4242 4242 4242"
          value={state.cardNumber}
          onChange={(e) => dispatch({ type: "SET_FIELD", field: "cardNumber", value: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="expiry">{t("booking.expiry")}</Label>
          <Input
            id="expiry"
            placeholder="MM/YY"
            value={state.expiry}
            onChange={(e) => dispatch({ type: "SET_FIELD", field: "expiry", value: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cvc">{t("booking.cvc")}</Label>
          <Input
            id="cvc"
            placeholder="123"
            value={state.cvc}
            onChange={(e) => dispatch({ type: "SET_FIELD", field: "cvc", value: e.target.value })}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="couponCode">{t("booking.couponCode")}</Label>
        <div className="flex gap-2">
          <Input
            id="couponCode"
            placeholder={t("booking.couponPlaceholder")}
            value={state.couponCode}
            onChange={(e) => dispatch({ type: "SET_FIELD", field: "couponCode", value: e.target.value.toUpperCase() })}
          />
        </div>
      </div>
      <p className="text-xs text-muted-foreground">{t("booking.simulatedPayment")}</p>
    </div>
  );
}

function StepConfirm({ state, roomType, coupon, t }: { state: State; roomType: RoomType; coupon: CouponResult | null; t: ReturnType<typeof useTranslations> }) {
  const nights = getNights(state.checkIn, state.checkOut);
  const total = nights * roomType.basePrice;

  return (
    <div className="space-y-6">
      <div className="rounded-lg border p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{t("booking.room")}</span>
          <span className="font-medium">{roomType.title}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{t("booking.stepDates")}</span>
          <span className="font-medium">{state.checkIn} — {state.checkOut}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{t("booking.guest")}</span>
          <span className="font-medium">{state.name || state.email}</span>
        </div>
        {coupon && (
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1 text-muted-foreground">
              <Tag className="h-3 w-3" />
              Coupon ({coupon.code})
            </span>
            <span className="font-medium text-green-600">
              -${coupon.discountAmount.toFixed(2)}
            </span>
          </div>
        )}
        <div className="border-t pt-3 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{t("booking.total")}</span>
          <span className="text-lg font-bold">
            ${(coupon ? coupon.finalTotal : total).toFixed(2)}
          </span>
        </div>
      </div>
      <p className="text-xs text-muted-foreground text-center">
        {t("booking.agreement")}
      </p>
    </div>
  );
}

function StepSuccess({ t }: { t: ReturnType<typeof useTranslations> }) {
  return (
    <div className="space-y-6 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        <Check className="h-8 w-8 text-primary" />
      </div>
      <div className="space-y-2">
        <h2 className="text-xl font-bold">{t("booking.bookingConfirmed")}</h2>
        <p className="text-muted-foreground">
          {t("booking.reservationCreated")}
        </p>
      </div>
    </div>
  );
}

type BookingWizardProps = {
  roomType: RoomType;
  initialCheckIn: string | null;
  initialCheckOut: string | null;
};

export default function BookingWizard({ roomType, initialCheckIn, initialCheckOut }: BookingWizardProps) {
  const t = useTranslations();
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, {
    step: 0,
    checkIn: initialCheckIn ?? "",
    checkOut: initialCheckOut ?? "",
    name: "",
    email: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
    couponCode: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [coupon, setCoupon] = useState<CouponResult | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);

  const canNext =
    (state.step === 0 && state.checkIn && state.checkOut && getNights(state.checkIn, state.checkOut) > 0) ||
    (state.step === 1 && state.name && state.email) ||
    (state.step === 2 && state.cardNumber && state.expiry && state.cvc) ||
    state.step === 3;

  async function handleApplyCoupon() {
    if (!state.couponCode.trim()) return;
    setCouponLoading(true);
    setCouponError(null);
    try {
      const nights = getNights(state.checkIn, state.checkOut);
      const total = nights * roomType.basePrice;
      const result = await applyCoupon({ code: state.couponCode, bookingTotal: total });
      setCoupon(result);
    } catch (e) {
      setCoupon(null);
      setCouponError(e instanceof Error ? e.message : t("common.loading"));
    } finally {
      setCouponLoading(false);
    }
  }

  async function handleConfirm() {
    setLoading(true);
    setError(null);
    try {
      await createBooking({
        roomTypeId: roomType.id,
        checkInDate: state.checkIn,
        checkOutDate: state.checkOut,
        guestName: state.name,
        guestEmail: state.email,
        couponCode: state.couponCode || undefined,
      });
      dispatch({ type: "NEXT" });
    } catch (e) {
      setError(e instanceof Error ? e.message : t("common.loading"));
    } finally {
      setLoading(false);
    }
  }

  const stepDescriptions = [
    t("booking.descDates"),
    t("booking.descDetails"),
    t("booking.descPayment"),
    t("booking.descConfirm"),
    t("booking.descDone"),
  ];

  const stepLabels = [
    t("booking.stepDates"),
    t("booking.stepDetails"),
    t("booking.stepPayment"),
    t("booking.stepConfirm"),
  ];

  return (
    <div className="mx-auto max-w-lg space-y-8">
      <div>
        <h1 className="text-2xl font-bold">{t("booking.book", { title: roomType.title })}</h1>
        <p className="text-muted-foreground">{roomType.description}</p>
      </div>

      <StepIndicator current={state.step} t={t} />

      <Card>
        <CardHeader>
          <CardTitle>{state.step < 4 ? stepLabels[state.step] : t("booking.stepDone")}</CardTitle>
          <CardDescription>
            {stepDescriptions[state.step]}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {state.step === 0 && <StepDates state={state} dispatch={dispatch} roomType={roomType} t={t} />}
          {state.step === 1 && <StepDetails state={state} dispatch={dispatch} t={t} />}
          {state.step === 2 && (
            <div className="space-y-4">
              <StepPayment state={state} dispatch={dispatch} t={t} />
              {state.couponCode && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleApplyCoupon}
                    disabled={couponLoading}
                    className="gap-1"
                  >
                    {couponLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Tag className="h-3 w-3" />}
                    {t("booking.applyCoupon")}
                  </Button>
                  {coupon && (
                    <span className="text-sm text-green-600 font-medium">
                      -${coupon.discountAmount.toFixed(2)}
                    </span>
                  )}
                  {couponError && (
                    <span className="text-sm text-destructive">{couponError}</span>
                  )}
                </div>
              )}
            </div>
          )}
          {state.step === 3 && <StepConfirm state={state} roomType={roomType} coupon={coupon} t={t} />}
          {state.step === 4 && <StepSuccess t={t} />}
          {error && (
            <div className="mt-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          {state.step < 4 ? (
            <>
              <Button
                variant="outline"
                onClick={() => dispatch({ type: "BACK" })}
                disabled={state.step === 0 || loading}
              >
                {t("common.back")}
              </Button>
              {state.step < 3 ? (
                <Button onClick={() => dispatch({ type: "NEXT" })} disabled={!canNext}>
                  {t("common.continue")}
                </Button>
              ) : (
                <Button onClick={handleConfirm} disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : t("booking.confirmBooking")}
                </Button>
              )}
            </>
          ) : (
            <Button className="w-full" onClick={() => router.push("/rooms")}>
              {t("booking.browseMoreRooms")}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
