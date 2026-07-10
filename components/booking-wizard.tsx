"use client";

import { useReducer, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Check, CreditCard, User, Calendar, Loader2 } from "lucide-react";
import { createBooking } from "@/lib/actions/booking";

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
};

type Action =
  | { type: "NEXT" }
  | { type: "BACK" }
  | { type: "SET_FIELD"; field: keyof State; value: string };

const STEPS = [
  { label: "Dates", icon: Calendar },
  { label: "Details", icon: User },
  { label: "Payment", icon: CreditCard },
  { label: "Confirm", icon: Check },
];

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

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-2">
      {STEPS.map((s, i) => {
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
            {i < STEPS.length - 1 && <div className="mx-1 hidden h-px w-8 bg-border sm:block" />}
          </div>
        );
      })}
    </div>
  );
}

function StepDates({ state, dispatch, roomType }: { state: State; dispatch: React.Dispatch<Action>; roomType: RoomType }) {
  const nights = getNights(state.checkIn, state.checkOut);
  const total = nights * roomType.basePrice;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="checkIn">Check-in Date</Label>
        <Input
          type="date"
          id="checkIn"
          value={state.checkIn}
          onChange={(e) => dispatch({ type: "SET_FIELD", field: "checkIn", value: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="checkOut">Check-out Date</Label>
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
            <span className="text-muted-foreground">{nights} {nights === 1 ? "night" : "nights"} × ${roomType.basePrice.toFixed(2)}</span>
            <span className="text-lg font-bold">${total.toFixed(2)}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function StepDetails({ state, dispatch }: { state: State; dispatch: React.Dispatch<Action> }) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          placeholder="John Doe"
          value={state.name}
          onChange={(e) => dispatch({ type: "SET_FIELD", field: "name", value: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
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

function StepPayment({ state, dispatch }: { state: State; dispatch: React.Dispatch<Action> }) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="cardNumber">Card Number</Label>
        <Input
          id="cardNumber"
          placeholder="4242 4242 4242 4242"
          value={state.cardNumber}
          onChange={(e) => dispatch({ type: "SET_FIELD", field: "cardNumber", value: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="expiry">Expiry</Label>
          <Input
            id="expiry"
            placeholder="MM/YY"
            value={state.expiry}
            onChange={(e) => dispatch({ type: "SET_FIELD", field: "expiry", value: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cvc">CVC</Label>
          <Input
            id="cvc"
            placeholder="123"
            value={state.cvc}
            onChange={(e) => dispatch({ type: "SET_FIELD", field: "cvc", value: e.target.value })}
          />
        </div>
      </div>
      <p className="text-xs text-muted-foreground">This is a simulated payment form. No real charges will be made.</p>
    </div>
  );
}

function StepConfirm({ state, roomType }: { state: State; roomType: RoomType }) {
  const nights = getNights(state.checkIn, state.checkOut);
  const total = nights * roomType.basePrice;

  return (
    <div className="space-y-6">
      <div className="rounded-lg border p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Room</span>
          <span className="font-medium">{roomType.title}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Dates</span>
          <span className="font-medium">{state.checkIn} — {state.checkOut}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Guest</span>
          <span className="font-medium">{state.name || state.email}</span>
        </div>
        <div className="border-t pt-3 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Total</span>
          <span className="text-lg font-bold">${total.toFixed(2)}</span>
        </div>
      </div>
      <p className="text-xs text-muted-foreground text-center">
        By confirming, you agree to the booking terms.
      </p>
    </div>
  );
}

function StepSuccess() {
  return (
    <div className="space-y-6 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        <Check className="h-8 w-8 text-primary" />
      </div>
      <div className="space-y-2">
        <h2 className="text-xl font-bold">Booking Confirmed</h2>
        <p className="text-muted-foreground">
          Your reservation has been created successfully.
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
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canNext =
    (state.step === 0 && state.checkIn && state.checkOut && getNights(state.checkIn, state.checkOut) > 0) ||
    (state.step === 1 && state.name && state.email) ||
    (state.step === 2 && state.cardNumber && state.expiry && state.cvc) ||
    state.step === 3;

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
      });
      dispatch({ type: "NEXT" });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Book {roomType.title}</h1>
        <p className="text-muted-foreground">{roomType.description}</p>
      </div>

      <StepIndicator current={state.step} />

      <Card>
        <CardHeader>
          <CardTitle>{state.step < 4 ? STEPS[state.step].label : "Done"}</CardTitle>
          <CardDescription>
            {state.step === 0 && "Select your travel dates"}
            {state.step === 1 && "Provide your contact information"}
            {state.step === 2 && "Enter payment details"}
            {state.step === 3 && "Review and confirm your booking"}
            {state.step === 4 && "Your booking has been confirmed"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {state.step === 0 && <StepDates state={state} dispatch={dispatch} roomType={roomType} />}
          {state.step === 1 && <StepDetails state={state} dispatch={dispatch} />}
          {state.step === 2 && <StepPayment state={state} dispatch={dispatch} />}
          {state.step === 3 && <StepConfirm state={state} roomType={roomType} />}
          {state.step === 4 && <StepSuccess />}
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
                Back
              </Button>
              {state.step < 3 ? (
                <Button onClick={() => dispatch({ type: "NEXT" })} disabled={!canNext}>
                  Continue
                </Button>
              ) : (
                <Button onClick={handleConfirm} disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm Booking"}
                </Button>
              )}
            </>
          ) : (
            <Button className="w-full" onClick={() => router.push("/rooms")}>
              Browse More Rooms
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
