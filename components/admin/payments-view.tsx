"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search } from "lucide-react";

type Payment = {
  id: string;
  guestName: string;
  guestEmail: string;
  roomNumber: string;
  bookingId: string;
  amount: number;
  paymentMethod: string;
  transactionId: string;
  status: string;
};

const STATUS_COLORS: Record<string, string> = {
  PAID: "bg-primary/10 text-primary",
  REFUNDED: "bg-secondary text-secondary-foreground",
  FAILED: "bg-destructive/10 text-destructive",
};

type FilterType = "all" | "PAID" | "REFUNDED" | "FAILED";

export default function PaymentsView({ payments: initial }: { payments: Payment[] }) {
  const [payments] = useState(initial);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");

  const filtered = payments.filter((p) => {
    const q = search.toLowerCase();
    const matchesSearch = !q ||
      p.guestName.toLowerCase().includes(q) ||
      p.guestEmail.toLowerCase().includes(q) ||
      p.transactionId.toLowerCase().includes(q) ||
      p.roomNumber.toLowerCase().includes(q);
    const matchesFilter = filter === "all" || p.status === filter;
    return matchesSearch && matchesFilter;
  });

  const statusCounts = {
    all: payments.length,
    PAID: payments.filter((p) => p.status === "PAID").length,
    REFUNDED: payments.filter((p) => p.status === "REFUNDED").length,
    FAILED: payments.filter((p) => p.status === "FAILED").length,
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by guest, email, transaction ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "PAID", "REFUNDED", "FAILED"] as FilterType[]).map((f) => (
            <Button
              key={f}
              variant={filter === f ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(f)}
            >
              {f === "all" ? "All" : f} ({statusCounts[f]})
            </Button>
          ))}
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Guest</TableHead>
                <TableHead>Room</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    No payments found.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      <div className="font-medium">{payment.guestName}</div>
                      <div className="text-xs text-muted-foreground">{payment.guestEmail}</div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{payment.roomNumber}</TableCell>
                    <TableCell className="font-mono text-sm">
                      ${payment.amount.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-sm">{payment.paymentMethod}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {payment.transactionId}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={`${STATUS_COLORS[payment.status] || ""} border-0`}
                      >
                        {payment.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
