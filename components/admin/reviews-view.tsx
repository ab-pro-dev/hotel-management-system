"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Search,
  Star,
  EyeOff,
  Eye,
  Trash2,
  Loader2,
} from "lucide-react";
import { hideReview, unhideReview, deleteReview } from "@/lib/actions/review";

type Review = {
  id: string;
  rating: number;
  comment: string;
  hidden: boolean;
  createdAt: string;
  guestName: string;
  guestEmail: string;
  roomNumber: string;
  bookingId: string;
};

export default function ReviewsView({ reviews: initial }: { reviews: Review[] }) {
  const router = useRouter();
  const [reviews, setReviews] = useState(initial);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "visible" | "hidden">("all");
  const [saving, setSaving] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{ id: string; label: string } | null>(null);

  const filtered = reviews.filter((r) => {
    const q = search.toLowerCase();
    const matchesSearch = !q ||
      r.guestName.toLowerCase().includes(q) ||
      r.guestEmail.toLowerCase().includes(q) ||
      r.comment.toLowerCase().includes(q) ||
      r.roomNumber.toLowerCase().includes(q);
    const matchesFilter = filter === "all" ||
      (filter === "visible" && !r.hidden) ||
      (filter === "hidden" && r.hidden);
    return matchesSearch && matchesFilter;
  });

  const visibleCount = reviews.filter((r) => !r.hidden).length;
  const hiddenCount = reviews.filter((r) => r.hidden).length;

  async function handleToggleVisibility(review: Review) {
    setSaving(true);
    try {
      if (review.hidden) {
        await unhideReview(review.id);
        setReviews((prev) => prev.map((r) => r.id === review.id ? { ...r, hidden: false } : r));
      } else {
        await hideReview(review.id);
        setReviews((prev) => prev.map((r) => r.id === review.id ? { ...r, hidden: true } : r));
      }
      router.refresh();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    setSaving(true);
    try {
      await deleteReview(id);
      setReviews((prev) => prev.filter((r) => r.id !== id));
      setDeleteDialog(null);
      router.refresh();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by guest, email, room, or comment..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
          >
            All ({reviews.length})
          </Button>
          <Button
            variant={filter === "visible" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("visible")}
          >
            Visible ({visibleCount})
          </Button>
          <Button
            variant={filter === "hidden" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("hidden")}
          >
            Hidden ({hiddenCount})
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Guest</TableHead>
                <TableHead>Room</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Comment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                    No reviews found.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((review) => (
                  <TableRow key={review.id}>
                    <TableCell>
                      <div className="font-medium">{review.guestName}</div>
                      <div className="text-xs text-muted-foreground">{review.guestEmail}</div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{review.roomNumber}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3.5 w-3.5 ${
                              i < review.rating
                                ? "fill-primary text-primary"
                                : "fill-muted text-muted"
                            }`}
                          />
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate text-sm text-muted-foreground">
                      {review.comment}
                    </TableCell>
                    <TableCell>
                      {review.hidden ? (
                        <Badge variant="secondary" className="bg-muted text-muted-foreground border-0">Hidden</Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-primary/10 text-primary border-0">Visible</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleVisibility(review)}
                          disabled={saving}
                          title={review.hidden ? "Unhide" : "Hide"}
                        >
                          {review.hidden ? (
                            <Eye className="h-4 w-4" />
                          ) : (
                            <EyeOff className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setDeleteDialog({ id: review.id, label: review.guestName })}
                          disabled={saving}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!deleteDialog} onOpenChange={() => setDeleteDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Review</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete the review by <span className="font-medium text-foreground">{deleteDialog?.label}</span>? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog(null)} disabled={saving}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteDialog && handleDelete(deleteDialog.id)}
              disabled={saving}
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
