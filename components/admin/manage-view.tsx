"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RoomStatus } from "@prisma/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Plus,
  Pencil,
  Trash2,
  Loader2,
  BedDouble,
  LayoutGrid,
  Users,
  AlertCircle,
  X,
  Copy,
  Check,
  UserCheck,
  UserX,
  Building2,
  Tag,
  Clock,
  Wrench,
} from "lucide-react";
import { createRoomType, updateRoomType, deleteRoomType } from "@/lib/actions/room-type";
import { createRoom, updateRoomStatus, updateRoom, deleteRoom } from "@/lib/actions/room";
import { createStaffUser, updateUserRole, deactivateUser, reactivateUser } from "@/lib/actions/user";
import { createProperty, updateProperty, deleteProperty } from "@/lib/actions/property";
import { createCoupon, updateCoupon, deleteCoupon } from "@/lib/actions/coupon";
import { createWaitlistEntry, updateWaitlistEntry, deleteWaitlistEntry } from "@/lib/actions/waitlist";
import { deleteServiceRequest } from "@/lib/actions/service-request";

type RoomType = {
  id: string;
  title: string;
  description: string;
  basePrice: number;
  capacity: number;
  propertyId: string;
  roomCount: number;
};

type Room = {
  id: string;
  roomNumber: string;
  status: string;
  roomType: { id: string; title: string };
};

type StaffUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
};

type Property = {
  id: string;
  name: string;
  address: string;
  roomTypeCount: number;
};

type Coupon = {
  id: string;
  code: string;
  discountType: string;
  discountValue: number;
  expiresAt: string;
  maxUses: number;
  usedCount: number;
};

type WaitlistEntry = {
  id: string;
  guestEmail: string;
  roomTypeTitle: string;
  roomTypeId: string;
  requestedCheckIn: string;
  requestedCheckOut: string;
  notified: boolean;
};

type ServiceRequestItem = {
  id: string;
  type: string;
  message: string;
  status: string;
  priority: string;
  createdAt: string;
  guestName: string;
  guestEmail: string;
  roomNumber: string;
  bookingId: string;
  assignedToName: string | null;
};

const ROOM_STATUSES = ["AVAILABLE", "OCCUPIED", "DIRTY", "IN_PROGRESS", "MAINTENANCE"] as const;

const STATUS_COLORS: Record<string, string> = {
  AVAILABLE: "bg-primary/10 text-primary",
  OCCUPIED: "bg-destructive/10 text-destructive",
  DIRTY: "bg-secondary text-secondary-foreground",
  IN_PROGRESS: "bg-primary/5 text-primary",
  MAINTENANCE: "bg-muted text-muted-foreground",
};

const STAFF_ROLES = ["RECEPTIONIST", "HOUSEKEEPER", "ADMIN"] as const;

const ROLE_COLORS: Record<string, string> = {
  ADMIN: "bg-primary/10 text-primary",
  RECEPTIONIST: "bg-secondary text-secondary-foreground",
  HOUSEKEEPER: "bg-muted text-muted-foreground",
};

const REQUEST_STATUS_COLORS: Record<string, string> = {
  OPEN: "bg-primary/10 text-primary",
  IN_PROGRESS: "bg-secondary text-secondary-foreground",
  RESOLVED: "bg-muted text-muted-foreground",
  CLOSED: "bg-muted text-muted-foreground",
};

const REQUEST_TYPE_LABELS: Record<string, string> = {
  HOUSEKEEPING: "Housekeeping",
  FRONT_DESK: "Front Desk",
  MAINTENANCE: "Maintenance",
};

type Tab = "room-types" | "rooms" | "staff" | "properties" | "coupons" | "waitlist" | "service-requests";

export default function ManageView({
  roomTypes: initialRoomTypes,
  rooms: initialRooms,
  staffUsers: initialStaff,
  properties: initialProperties,
  coupons: initialCoupons,
  waitlistEntries: initialWaitlist,
  serviceRequests: initialServiceRequests,
}: {
  roomTypes: RoomType[];
  rooms: Room[];
  staffUsers: StaffUser[];
  properties: Property[];
  coupons: Coupon[];
  waitlistEntries: WaitlistEntry[];
  serviceRequests: ServiceRequestItem[];
}) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("room-types");
  const [roomTypes, setRoomTypes] = useState(initialRoomTypes);
  const [rooms, setRooms] = useState(initialRooms);
  const [staffUsers, setStaffUsers] = useState(initialStaff);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [rtDialogOpen, setRtDialogOpen] = useState(false);
  const [editingRt, setEditingRt] = useState<RoomType | null>(null);
  const [rtForm, setRtForm] = useState({ title: "", description: "", basePrice: "", capacity: "" });

  const [roomDialogOpen, setRoomDialogOpen] = useState(false);
  const [roomForm, setRoomForm] = useState({ roomNumber: "", roomTypeId: "" });

  const [deleteDialog, setDeleteDialog] = useState<{ type: "room-type"; id: string; label: string } | null>(null);
  const [roomDeleteDialog, setRoomDeleteDialog] = useState<{ id: string; label: string } | null>(null);

  const [staffDialogOpen, setStaffDialogOpen] = useState(false);
  const [staffForm, setStaffForm] = useState({ name: "", email: "", role: "" });
  const [createdCredentials, setCreatedCredentials] = useState<{ email: string; tempPassword: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const [roleDialog, setRoleDialog] = useState<{ user: StaffUser; newRole: string } | null>(null);

  const [properties, setProperties] = useState(initialProperties);
  const [propertyDialogOpen, setPropertyDialogOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [propertyForm, setPropertyForm] = useState({ name: "", address: "" });
  const [propertyDeleteDialog, setPropertyDeleteDialog] = useState<{ id: string; label: string } | null>(null);

  const [coupons, setCoupons] = useState(initialCoupons);
  const [couponDialogOpen, setCouponDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [couponForm, setCouponForm] = useState({ code: "", discountType: "PERCENT", discountValue: "", expiresAt: "", maxUses: "" });
  const [couponDeleteDialog, setCouponDeleteDialog] = useState<{ id: string; label: string } | null>(null);

  const [waitlistEntries, setWaitlistEntries] = useState(initialWaitlist);
  const [waitlistDialogOpen, setWaitlistDialogOpen] = useState(false);
  const [editingWaitlist, setEditingWaitlist] = useState<WaitlistEntry | null>(null);
  const [waitlistForm, setWaitlistForm] = useState({ guestEmail: "", roomTypeId: "", requestedCheckIn: "", requestedCheckOut: "" });
  const [waitlistDeleteDialog, setWaitlistDeleteDialog] = useState<{ id: string; label: string } | null>(null);

  const [serviceRequests, setServiceRequests] = useState(initialServiceRequests);
  const [serviceRequestDeleteDialog, setServiceRequestDeleteDialog] = useState<{ id: string; label: string } | null>(null);
  const [srFilter, setSrFilter] = useState<"all" | "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED">("all");

  const [roomEditDialog, setRoomEditDialog] = useState<Room | null>(null);
  const [roomEditForm, setRoomEditForm] = useState({ roomNumber: "", roomTypeId: "" });

  function openRtCreate() {
    setEditingRt(null);
    setRtForm({ title: "", description: "", basePrice: "", capacity: "" });
    setRtDialogOpen(true);
  }

  function openRtEdit(rt: RoomType) {
    setEditingRt(rt);
    setRtForm({
      title: rt.title,
      description: rt.description,
      basePrice: String(rt.basePrice),
      capacity: String(rt.capacity),
    });
    setRtDialogOpen(true);
  }

  async function handleRtSubmit() {
    setError(null);
    setSaving(true);
    try {
      if (editingRt) {
        const updated = await updateRoomType(editingRt.id, {
          title: rtForm.title,
          description: rtForm.description,
          basePrice: parseFloat(rtForm.basePrice),
          capacity: parseInt(rtForm.capacity, 10),
        });
        setRoomTypes((prev) =>
          prev.map((rt) =>
            rt.id === editingRt.id
              ? { ...rt, title: updated.title, description: updated.description, basePrice: Number(updated.basePrice), capacity: updated.capacity }
              : rt
          )
        );
      } else {
        const created = await createRoomType({
          title: rtForm.title,
          description: rtForm.description,
          basePrice: parseFloat(rtForm.basePrice),
          capacity: parseInt(rtForm.capacity, 10),
          propertyId: roomTypes[0]?.propertyId ?? "",
        });
        setRoomTypes((prev) => [
          ...prev,
          { ...created, basePrice: Number(created.basePrice), roomCount: 0 },
        ]);
      }
      setRtDialogOpen(false);
      router.refresh();
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : "Failed to save room type.");
    } finally {
      setSaving(false);
    }
  }

  async function handleRtDelete(id: string) {
    setError(null);
    setSaving(true);
    try {
      await deleteRoomType(id);
      setRoomTypes((prev) => prev.filter((rt) => rt.id !== id));
      setDeleteDialog(null);
      router.refresh();
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : "Failed to delete room type.");
    } finally {
      setSaving(false);
    }
  }

  async function handleRoomDelete(id: string) {
    setError(null);
    setSaving(true);
    try {
      await deleteRoom(id);
      setRooms((prev) => prev.filter((r) => r.id !== id));
      setRoomDeleteDialog(null);
      router.refresh();
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : "Failed to delete room.");
    } finally {
      setSaving(false);
    }
  }

  function openRoomCreate() {
    setRoomForm({ roomNumber: "", roomTypeId: roomTypes[0]?.id ?? "" });
    setRoomDialogOpen(true);
  }

  async function handleRoomCreate() {
    setError(null);
    setSaving(true);
    try {
      const created = await createRoom({
        roomNumber: roomForm.roomNumber,
        roomTypeId: roomForm.roomTypeId,
      });
      const rt = roomTypes.find((rt) => rt.id === roomForm.roomTypeId);
      setRooms((prev) => [
        ...prev,
        { id: created.id, roomNumber: created.roomNumber, status: created.status, roomType: { id: rt!.id, title: rt!.title } },
      ]);
      setRoomDialogOpen(false);
      router.refresh();
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : "Failed to create room.");
    } finally {
      setSaving(false);
    }
  }

  async function handleStatusChange(roomId: string, newStatus: string) {
    setError(null);
    setSaving(true);
    try {
      await updateRoomStatus(roomId, { status: newStatus as RoomStatus });
      setRooms((prev) =>
        prev.map((r) => (r.id === roomId ? { ...r, status: newStatus } : r))
      );
      router.refresh();
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : "Failed to update room status.");
    } finally {
      setSaving(false);
    }
  }

  function openRoomEdit(room: Room) {
    setRoomEditDialog(room);
    setRoomEditForm({ roomNumber: room.roomNumber, roomTypeId: room.roomType.id });
  }

  async function handleRoomEdit() {
    if (!roomEditDialog) return;
    setError(null);
    setSaving(true);
    try {
      await updateRoom(roomEditDialog.id, {
        roomNumber: roomEditForm.roomNumber,
        roomTypeId: roomEditForm.roomTypeId,
      });
      const rt = roomTypes.find((rt) => rt.id === roomEditForm.roomTypeId);
      setRooms((prev) =>
        prev.map((r) =>
          r.id === roomEditDialog.id
            ? { ...r, roomNumber: roomEditForm.roomNumber, roomType: { id: rt!.id, title: rt!.title } }
            : r
        )
      );
      setRoomEditDialog(null);
      router.refresh();
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : "Failed to update room.");
    } finally {
      setSaving(false);
    }
  }

  async function handleServiceRequestDelete(id: string) {
    setError(null);
    setSaving(true);
    try {
      await deleteServiceRequest(id);
      setServiceRequests((prev) => prev.filter((sr) => sr.id !== id));
      setServiceRequestDeleteDialog(null);
      router.refresh();
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : "Failed to delete service request.");
    } finally {
      setSaving(false);
    }
  }

  async function handleStaffCreate() {
    setError(null);
    setSaving(true);
    try {
      const result = await createStaffUser({
        name: staffForm.name,
        email: staffForm.email,
        role: staffForm.role as "RECEPTIONIST" | "HOUSEKEEPER" | "ADMIN",
      });
      setStaffUsers((prev) => [
        {
          id: result.user.id,
          name: result.user.name,
          email: result.user.email,
          role: result.user.role,
          isActive: result.user.isActive,
          createdAt: result.user.createdAt.toISOString(),
        },
        ...prev,
      ]);
      setCreatedCredentials({ email: result.user.email, tempPassword: result.tempPassword });
      setStaffForm({ name: "", email: "", role: "" });
      router.refresh();
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : "Failed to create staff user.");
    } finally {
      setSaving(false);
    }
  }

  async function handleRoleChange() {
    if (!roleDialog) return;
    setError(null);
    setSaving(true);
    try {
      await updateUserRole(roleDialog.user.id, { role: roleDialog.newRole as "RECEPTIONIST" | "HOUSEKEEPER" | "ADMIN" });
      setStaffUsers((prev) =>
        prev.map((u) => (u.id === roleDialog.user.id ? { ...u, role: roleDialog.newRole } : u))
      );
      setRoleDialog(null);
      router.refresh();
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : "Failed to update role.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeactivate(user: StaffUser) {
    setError(null);
    setSaving(true);
    try {
      await deactivateUser(user.id);
      setStaffUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, isActive: false } : u))
      );
      router.refresh();
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : "Failed to deactivate user.");
    } finally {
      setSaving(false);
    }
  }

  async function handleReactivate(user: StaffUser) {
    setError(null);
    setSaving(true);
    try {
      await reactivateUser(user.id);
      setStaffUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, isActive: true } : u))
      );
      router.refresh();
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : "Failed to reactivate user.");
    } finally {
      setSaving(false);
    }
  }

  async function copyCredentials() {
    if (!createdCredentials) return;
    const text = `Email: ${createdCredentials.email}\nPassword: ${createdCredentials.tempPassword}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const input = document.createElement("input");
      input.value = text;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  async function handlePropertySubmit() {
    setError(null);
    setSaving(true);
    try {
      if (editingProperty) {
        const updated = await updateProperty(editingProperty.id, propertyForm);
        setProperties((prev) => prev.map((p) => (p.id === editingProperty.id ? { ...p, name: updated.name, address: updated.address } : p)));
      } else {
        const created = await createProperty(propertyForm);
        setProperties((prev) => [...prev, { id: created.id, name: created.name, address: created.address, roomTypeCount: 0 }]);
      }
      setPropertyDialogOpen(false);
      router.refresh();
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : "Failed to save property.");
    } finally {
      setSaving(false);
    }
  }

  async function handlePropertyDelete(id: string) {
    setError(null);
    setSaving(true);
    try {
      await deleteProperty(id);
      setProperties((prev) => prev.filter((p) => p.id !== id));
      setPropertyDeleteDialog(null);
      router.refresh();
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : "Failed to delete property.");
    } finally {
      setSaving(false);
    }
  }

  async function handleCouponSubmit() {
    setError(null);
    setSaving(true);
    try {
      if (editingCoupon) {
        const updated = await updateCoupon(editingCoupon.id, {
          code: couponForm.code,
          discountType: couponForm.discountType as "PERCENT" | "FLAT",
          discountValue: parseFloat(couponForm.discountValue),
          expiresAt: couponForm.expiresAt,
          maxUses: parseInt(couponForm.maxUses, 10),
        });
        setCoupons((prev) => prev.map((c) => (c.id === editingCoupon.id ? { ...c, code: updated.code, discountType: updated.discountType, discountValue: Number(updated.discountValue), expiresAt: updated.expiresAt.toISOString(), maxUses: updated.maxUses } : c)));
      } else {
        const created = await createCoupon({
          code: couponForm.code,
          discountType: couponForm.discountType as "PERCENT" | "FLAT",
          discountValue: parseFloat(couponForm.discountValue),
          expiresAt: couponForm.expiresAt,
          maxUses: parseInt(couponForm.maxUses, 10),
        });
        setCoupons((prev) => [...prev, { id: created.id, code: created.code, discountType: created.discountType, discountValue: Number(created.discountValue), expiresAt: created.expiresAt.toISOString(), maxUses: created.maxUses, usedCount: created.usedCount }]);
      }
      setCouponDialogOpen(false);
      router.refresh();
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : "Failed to save coupon.");
    } finally {
      setSaving(false);
    }
  }

  async function handleCouponDelete(id: string) {
    setError(null);
    setSaving(true);
    try {
      await deleteCoupon(id);
      setCoupons((prev) => prev.filter((c) => c.id !== id));
      setCouponDeleteDialog(null);
      router.refresh();
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : "Failed to delete coupon.");
    } finally {
      setSaving(false);
    }
  }

  async function handleWaitlistSubmit() {
    setError(null);
    setSaving(true);
    try {
      if (editingWaitlist) {
        await updateWaitlistEntry(editingWaitlist.id, {
          guestEmail: waitlistForm.guestEmail,
          roomTypeId: waitlistForm.roomTypeId,
          requestedCheckIn: waitlistForm.requestedCheckIn,
          requestedCheckOut: waitlistForm.requestedCheckOut,
        });
        setWaitlistEntries((prev) => prev.map((w) => (w.id === editingWaitlist.id ? { ...w, guestEmail: waitlistForm.guestEmail, requestedCheckIn: waitlistForm.requestedCheckIn, requestedCheckOut: waitlistForm.requestedCheckOut } : w)));
      } else {
        const created = await createWaitlistEntry({
          guestEmail: waitlistForm.guestEmail,
          roomTypeId: waitlistForm.roomTypeId,
          requestedCheckIn: waitlistForm.requestedCheckIn,
          requestedCheckOut: waitlistForm.requestedCheckOut,
        });
        const rt = roomTypes.find((rt) => rt.id === waitlistForm.roomTypeId);
        setWaitlistEntries((prev) => [...prev, { id: created.id, guestEmail: created.guestEmail, roomTypeTitle: rt?.title ?? "", roomTypeId: created.roomTypeId, requestedCheckIn: created.requestedCheckIn.toISOString(), requestedCheckOut: created.requestedCheckOut.toISOString(), notified: created.notified }]);
      }
      setWaitlistDialogOpen(false);
      router.refresh();
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : "Failed to save waitlist entry.");
    } finally {
      setSaving(false);
    }
  }

  async function handleWaitlistDelete(id: string) {
    setError(null);
    setSaving(true);
    try {
      await deleteWaitlistEntry(id);
      setWaitlistEntries((prev) => prev.filter((w) => w.id !== id));
      setWaitlistDeleteDialog(null);
      router.refresh();
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : "Failed to delete waitlist entry.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span className="flex-1">{error}</span>
          <button onClick={() => setError(null)} className="shrink-0">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setTab("room-types")}
          className={`flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
            tab === "room-types"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <LayoutGrid className="h-4 w-4" />
          Room Types
          <Badge variant="secondary" className="ml-1">{roomTypes.length}</Badge>
        </button>
        <button
          onClick={() => setTab("rooms")}
          className={`flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
            tab === "rooms"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <BedDouble className="h-4 w-4" />
          Rooms
          <Badge variant="secondary" className="ml-1">{rooms.length}</Badge>
        </button>
        <button
          onClick={() => setTab("staff")}
          className={`flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
            tab === "staff"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Users className="h-4 w-4" />
          Staff
          <Badge variant="secondary" className="ml-1">{staffUsers.length}</Badge>
        </button>
        <button
          onClick={() => setTab("properties")}
          className={`flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
            tab === "properties"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Building2 className="h-4 w-4" />
          Properties
          <Badge variant="secondary" className="ml-1">{properties.length}</Badge>
        </button>
        <button
          onClick={() => setTab("coupons")}
          className={`flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
            tab === "coupons"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Tag className="h-4 w-4" />
          Coupons
          <Badge variant="secondary" className="ml-1">{coupons.length}</Badge>
        </button>
        <button
          onClick={() => setTab("waitlist")}
          className={`flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
            tab === "waitlist"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Clock className="h-4 w-4" />
          Waitlist
          <Badge variant="secondary" className="ml-1">{waitlistEntries.length}</Badge>
        </button>
        <button
          onClick={() => setTab("service-requests")}
          className={`flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
            tab === "service-requests"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Wrench className="h-4 w-4" />
          Service Requests
          <Badge variant="secondary" className="ml-1">{serviceRequests.length}</Badge>
        </button>
      </div>

      {tab === "room-types" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={openRtCreate} className="gap-1">
              <Plus className="h-4 w-4" />
              New Room Type
            </Button>
          </div>
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Base Price</TableHead>
                    <TableHead className="text-right">Capacity</TableHead>
                    <TableHead className="text-right">Rooms</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roomTypes.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                        No room types yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    roomTypes.map((rt) => (
                      <TableRow key={rt.id}>
                        <TableCell className="font-medium">{rt.title}</TableCell>
                        <TableCell className="max-w-[200px] truncate text-muted-foreground">
                          {rt.description}
                        </TableCell>
                        <TableCell className="text-right">${rt.basePrice.toFixed(2)}</TableCell>
                        <TableCell className="text-right">{rt.capacity}</TableCell>
                        <TableCell className="text-right">
                          <Badge variant="outline">{rt.roomCount}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openRtEdit(rt)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              onClick={() => setDeleteDialog({ type: "room-type", id: rt.id, label: rt.title })}
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
        </div>
      )}

      {tab === "rooms" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={openRoomCreate} className="gap-1">
              <Plus className="h-4 w-4" />
              New Room
            </Button>
          </div>
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Room #</TableHead>
                    <TableHead>Room Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rooms.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                        No rooms yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    rooms.map((room) => (
                      <TableRow key={room.id}>
                        <TableCell className="font-medium font-mono">{room.roomNumber}</TableCell>
                        <TableCell>{room.roomType.title}</TableCell>
                        <TableCell>
                          <Select
                            value={room.status}
                            onValueChange={(v: string | null) => v && handleStatusChange(room.id, v)}
                          >
                            <SelectTrigger className="h-8 w-[150px] text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {ROOM_STATUSES.map((s) => (
                                <SelectItem key={s} value={s}>
                                  <Badge variant="secondary" className={`${STATUS_COLORS[s]} border-0 mr-1 text-[10px]`}>
                                    ●
                                  </Badge>
                                  {s}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openRoomEdit(room)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              onClick={() => setRoomDeleteDialog({ id: room.id, label: room.roomNumber })}
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
        </div>
      )}

      {tab === "staff" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => { setStaffForm({ name: "", email: "", role: "" }); setCreatedCredentials(null); setStaffDialogOpen(true); }} className="gap-1">
              <Plus className="h-4 w-4" />
              Add Staff
            </Button>
          </div>
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {staffUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                        No staff users yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    staffUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell className="text-muted-foreground">{user.email}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={`${ROLE_COLORS[user.role]} border-0`}>
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {user.isActive ? (
                            <Badge variant="secondary" className="bg-primary/10 text-primary border-0">Active</Badge>
                          ) : (
                            <Badge variant="secondary" className="bg-muted text-muted-foreground border-0">Inactive</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setRoleDialog({ user, newRole: user.role })}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            {user.isActive ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-destructive hover:text-destructive"
                                onClick={() => handleDeactivate(user)}
                              >
                                <UserX className="h-4 w-4" />
                              </Button>
                            ) : (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-primary hover:text-primary/80"
                                onClick={() => handleReactivate(user)}
                              >
                                <UserCheck className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}

      {tab === "properties" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => { setEditingProperty(null); setPropertyForm({ name: "", address: "" }); setPropertyDialogOpen(true); }} className="gap-1">
              <Plus className="h-4 w-4" />
              New Property
            </Button>
          </div>
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead className="text-right">Room Types</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {properties.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                        No properties yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    properties.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell className="font-medium">{p.name}</TableCell>
                        <TableCell className="text-muted-foreground">{p.address}</TableCell>
                        <TableCell className="text-right">
                          <Badge variant="outline">{p.roomTypeCount}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="sm" onClick={() => { setEditingProperty(p); setPropertyForm({ name: p.name, address: p.address }); setPropertyDialogOpen(true); }}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => setPropertyDeleteDialog({ id: p.id, label: p.name })}>
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
        </div>
      )}

      {tab === "coupons" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => { setEditingCoupon(null); setCouponForm({ code: "", discountType: "PERCENT", discountValue: "", expiresAt: "", maxUses: "" }); setCouponDialogOpen(true); }} className="gap-1">
              <Plus className="h-4 w-4" />
              New Coupon
            </Button>
          </div>
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Value</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead className="text-right">Uses</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {coupons.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                        No coupons yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    coupons.map((c) => (
                      <TableRow key={c.id}>
                        <TableCell className="font-mono font-medium">{c.code}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{c.discountType}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {c.discountType === "PERCENT" ? `${c.discountValue}%` : `$${c.discountValue.toFixed(2)}`}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(c.expiresAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right text-sm">
                          {c.usedCount}/{c.maxUses}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="sm" onClick={() => { setEditingCoupon(c); setCouponForm({ code: c.code, discountType: c.discountType, discountValue: String(c.discountValue), expiresAt: c.expiresAt.split("T")[0], maxUses: String(c.maxUses) }); setCouponDialogOpen(true); }}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => setCouponDeleteDialog({ id: c.id, label: c.code })}>
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
        </div>
      )}

      {tab === "waitlist" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => { setEditingWaitlist(null); setWaitlistForm({ guestEmail: "", roomTypeId: roomTypes[0]?.id ?? "", requestedCheckIn: "", requestedCheckOut: "" }); setWaitlistDialogOpen(true); }} className="gap-1">
              <Plus className="h-4 w-4" />
              Add to Waitlist
            </Button>
          </div>
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Guest Email</TableHead>
                    <TableHead>Room Type</TableHead>
                    <TableHead>Check-in</TableHead>
                    <TableHead>Check-out</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {waitlistEntries.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                        No waitlist entries.
                      </TableCell>
                    </TableRow>
                  ) : (
                    waitlistEntries.map((w) => (
                      <TableRow key={w.id}>
                        <TableCell className="font-medium">{w.guestEmail}</TableCell>
                        <TableCell className="text-muted-foreground">{w.roomTypeTitle}</TableCell>
                        <TableCell className="text-sm">
                          {new Date(w.requestedCheckIn).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-sm">
                          {new Date(w.requestedCheckOut).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {w.notified ? (
                            <Badge className="bg-primary/10 text-primary">Notified</Badge>
                          ) : (
                            <Badge className="bg-secondary text-secondary-foreground">Pending</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="sm" onClick={() => { setEditingWaitlist(w); setWaitlistForm({ guestEmail: w.guestEmail, roomTypeId: w.roomTypeId, requestedCheckIn: w.requestedCheckIn.split("T")[0], requestedCheckOut: w.requestedCheckOut.split("T")[0] }); setWaitlistDialogOpen(true); }}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => setWaitlistDeleteDialog({ id: w.id, label: w.guestEmail })}>
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
        </div>
      )}

      {tab === "service-requests" && (
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-2">
              {(["all", "OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"] as const).map((f) => (
                <Button
                  key={f}
                  variant={srFilter === f ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSrFilter(f)}
                >
                  {f === "all" ? "All" : f.replace("_", " ")} ({serviceRequests.filter((sr) => f === "all" || sr.status === f).length})
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
                    <TableHead>Type</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {serviceRequests.filter((sr) => srFilter === "all" || sr.status === srFilter).length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                        No service requests.
                      </TableCell>
                    </TableRow>
                  ) : (
                    serviceRequests
                      .filter((sr) => srFilter === "all" || sr.status === srFilter)
                      .map((sr) => (
                        <TableRow key={sr.id}>
                          <TableCell>
                            <div className="font-medium">{sr.guestName}</div>
                            <div className="text-xs text-muted-foreground">{sr.guestEmail}</div>
                          </TableCell>
                          <TableCell className="font-mono text-sm">{sr.roomNumber}</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="border-0">
                              {REQUEST_TYPE_LABELS[sr.type] || sr.type}
                            </Badge>
                          </TableCell>
                          <TableCell className="max-w-xs truncate text-sm text-muted-foreground">
                            {sr.message}
                          </TableCell>
                          <TableCell className="text-sm">{sr.priority}</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className={`${REQUEST_STATUS_COLORS[sr.status] || ""} border-0`}>
                              {sr.status.replace("_", " ")}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {sr.assignedToName || "—"}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              onClick={() => setServiceRequestDeleteDialog({ id: sr.id, label: `${sr.type} request by ${sr.guestName}` })}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}

      <Dialog open={rtDialogOpen} onOpenChange={setRtDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingRt ? "Edit Room Type" : "New Room Type"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="rt-title">Title</Label>
              <Input
                id="rt-title"
                value={rtForm.title}
                onChange={(e) => setRtForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="e.g. Deluxe Suite"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rt-desc">Description</Label>
              <Input
                id="rt-desc"
                value={rtForm.description}
                onChange={(e) => setRtForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Brief description of the room type"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rt-price">Base Price ($)</Label>
                <Input
                  id="rt-price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={rtForm.basePrice}
                  onChange={(e) => setRtForm((f) => ({ ...f, basePrice: e.target.value }))}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rt-cap">Capacity</Label>
                <Input
                  id="rt-cap"
                  type="number"
                  min="1"
                  value={rtForm.capacity}
                  onChange={(e) => setRtForm((f) => ({ ...f, capacity: e.target.value }))}
                  placeholder="2"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRtDialogOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleRtSubmit} disabled={saving || !rtForm.title || !rtForm.description || !rtForm.basePrice || !rtForm.capacity}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : editingRt ? "Save Changes" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={roomDialogOpen} onOpenChange={setRoomDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Room</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="room-num">Room Number</Label>
              <Input
                id="room-num"
                value={roomForm.roomNumber}
                onChange={(e) => setRoomForm((f) => ({ ...f, roomNumber: e.target.value }))}
                placeholder="e.g. 101"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="room-type">Room Type</Label>
              <Select
                value={roomForm.roomTypeId}
                onValueChange={(v: string | null) => v && setRoomForm((f) => ({ ...f, roomTypeId: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select room type" />
                </SelectTrigger>
                <SelectContent>
                  {roomTypes.map((rt) => (
                    <SelectItem key={rt.id} value={rt.id}>
                      {rt.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRoomDialogOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleRoomCreate} disabled={saving || !roomForm.roomNumber || !roomForm.roomTypeId}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={staffDialogOpen} onOpenChange={setStaffDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{createdCredentials ? "Staff Account Created" : "Add Staff Member"}</DialogTitle>
          </DialogHeader>
          {createdCredentials ? (
            <div className="space-y-4 py-2">
              <p className="text-sm text-muted-foreground">
                Share these credentials with the staff member. The password is temporary and should be changed on first login.
              </p>
              <div className="rounded-lg bg-muted p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Email</span>
                  <span className="font-medium font-mono text-sm">{createdCredentials.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Password</span>
                  <span className="font-medium font-mono text-sm">{createdCredentials.tempPassword}</span>
                </div>
              </div>
              <Button variant="outline" className="w-full gap-2" onClick={copyCredentials}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied!" : "Copy Credentials"}
              </Button>
            </div>
          ) : (
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="staff-name">Name</Label>
                <Input
                  id="staff-name"
                  value={staffForm.name}
                  onChange={(e) => setStaffForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="staff-email">Email</Label>
                <Input
                  id="staff-email"
                  type="email"
                  value={staffForm.email}
                  onChange={(e) => setStaffForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="staff@hotel.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="staff-role">Role</Label>
                <Select
                  value={staffForm.role}
                  onValueChange={(v: string | null) => v && setStaffForm((f) => ({ ...f, role: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {STAFF_ROLES.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => { setStaffDialogOpen(false); setCreatedCredentials(null); }} disabled={saving}>
              {createdCredentials ? "Close" : "Cancel"}
            </Button>
            {!createdCredentials && (
              <Button onClick={handleStaffCreate} disabled={saving || !staffForm.name || !staffForm.email || !staffForm.role}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Account"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!roleDialog} onOpenChange={() => setRoleDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Role</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-sm text-muted-foreground">
              Change the role for <span className="font-medium text-foreground">{roleDialog?.user.name}</span>
            </p>
            <Select
              value={roleDialog?.newRole ?? ""}
              onValueChange={(v: string | null) => v && setRoleDialog((d) => d ? { ...d, newRole: v } : null)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STAFF_ROLES.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRoleDialog(null)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleRoleChange} disabled={saving || roleDialog?.newRole === roleDialog?.user.role}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteDialog} onOpenChange={() => setDeleteDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Room Type</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete <span className="font-medium text-foreground">{deleteDialog?.label}</span>? This will also remove all rooms of this type. This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog(null)} disabled={saving}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteDialog && handleRtDelete(deleteDialog.id)}
              disabled={saving}
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!roomDeleteDialog} onOpenChange={() => setRoomDeleteDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Room</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete room <span className="font-medium text-foreground">{roomDeleteDialog?.label}</span>? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRoomDeleteDialog(null)} disabled={saving}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => roomDeleteDialog && handleRoomDelete(roomDeleteDialog.id)}
              disabled={saving}
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!roomEditDialog} onOpenChange={() => setRoomEditDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Room</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="edit-room-number">Room Number</Label>
              <Input
                id="edit-room-number"
                value={roomEditForm.roomNumber}
                onChange={(e) => setRoomEditForm((f) => ({ ...f, roomNumber: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-room-type">Room Type</Label>
              <Select
                value={roomEditForm.roomTypeId}
                onValueChange={(v: string | null) => v && setRoomEditForm((f) => ({ ...f, roomTypeId: v }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {roomTypes.map((rt) => (
                    <SelectItem key={rt.id} value={rt.id}>{rt.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRoomEditDialog(null)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleRoomEdit} disabled={saving || !roomEditForm.roomNumber || !roomEditForm.roomTypeId}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!serviceRequestDeleteDialog} onOpenChange={() => setServiceRequestDeleteDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Service Request</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete this <span className="font-medium text-foreground">{serviceRequestDeleteDialog?.label}</span>? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setServiceRequestDeleteDialog(null)} disabled={saving}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => serviceRequestDeleteDialog && handleServiceRequestDelete(serviceRequestDeleteDialog.id)}
              disabled={saving}
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={propertyDialogOpen} onOpenChange={setPropertyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingProperty ? "Edit Property" : "New Property"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="prop-name">Name</Label>
              <Input id="prop-name" value={propertyForm.name} onChange={(e) => setPropertyForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Grand Raya Resort" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="prop-address">Address</Label>
              <Input id="prop-address" value={propertyForm.address} onChange={(e) => setPropertyForm((f) => ({ ...f, address: e.target.value }))} placeholder="Full address" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPropertyDialogOpen(false)} disabled={saving}>Cancel</Button>
            <Button onClick={handlePropertySubmit} disabled={saving || !propertyForm.name || !propertyForm.address}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : editingProperty ? "Save Changes" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!propertyDeleteDialog} onOpenChange={() => setPropertyDeleteDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Property</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete <span className="font-medium text-foreground">{propertyDeleteDialog?.label}</span>? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPropertyDeleteDialog(null)} disabled={saving}>Cancel</Button>
            <Button variant="destructive" onClick={() => propertyDeleteDialog && handlePropertyDelete(propertyDeleteDialog.id)} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={couponDialogOpen} onOpenChange={setCouponDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCoupon ? "Edit Coupon" : "New Coupon"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="coupon-code">Code</Label>
              <Input id="coupon-code" value={couponForm.code} onChange={(e) => setCouponForm((f) => ({ ...f, code: e.target.value }))} placeholder="e.g. SUMMER25" className="font-mono" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="coupon-type">Type</Label>
                <Select value={couponForm.discountType} onValueChange={(v: string | null) => v && setCouponForm((f) => ({ ...f, discountType: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PERCENT">Percent (%)</SelectItem>
                    <SelectItem value="FLAT">Flat ($)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="coupon-value">Value</Label>
                <Input id="coupon-value" type="number" min="0" step="0.01" value={couponForm.discountValue} onChange={(e) => setCouponForm((f) => ({ ...f, discountValue: e.target.value }))} placeholder={couponForm.discountType === "PERCENT" ? "25" : "10.00"} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="coupon-expires">Expires</Label>
                <Input id="coupon-expires" type="date" value={couponForm.expiresAt} onChange={(e) => setCouponForm((f) => ({ ...f, expiresAt: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="coupon-max">Max Uses</Label>
                <Input id="coupon-max" type="number" min="1" value={couponForm.maxUses} onChange={(e) => setCouponForm((f) => ({ ...f, maxUses: e.target.value }))} placeholder="100" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCouponDialogOpen(false)} disabled={saving}>Cancel</Button>
            <Button onClick={handleCouponSubmit} disabled={saving || !couponForm.code || !couponForm.discountValue || !couponForm.expiresAt || !couponForm.maxUses}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : editingCoupon ? "Save Changes" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!couponDeleteDialog} onOpenChange={() => setCouponDeleteDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Coupon</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete coupon <span className="font-mono font-medium text-foreground">{couponDeleteDialog?.label}</span>? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCouponDeleteDialog(null)} disabled={saving}>Cancel</Button>
            <Button variant="destructive" onClick={() => couponDeleteDialog && handleCouponDelete(couponDeleteDialog.id)} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={waitlistDialogOpen} onOpenChange={setWaitlistDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingWaitlist ? "Edit Waitlist Entry" : "Add to Waitlist"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="wl-email">Guest Email</Label>
              <Input id="wl-email" type="email" value={waitlistForm.guestEmail} onChange={(e) => setWaitlistForm((f) => ({ ...f, guestEmail: e.target.value }))} placeholder="guest@email.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="wl-roomtype">Room Type</Label>
              <Select value={waitlistForm.roomTypeId} onValueChange={(v: string | null) => v && setWaitlistForm((f) => ({ ...f, roomTypeId: v }))}>
                <SelectTrigger><SelectValue placeholder="Select room type" /></SelectTrigger>
                <SelectContent>
                  {roomTypes.map((rt) => (
                    <SelectItem key={rt.id} value={rt.id}>{rt.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="wl-checkin">Check-in</Label>
                <Input id="wl-checkin" type="date" value={waitlistForm.requestedCheckIn} onChange={(e) => setWaitlistForm((f) => ({ ...f, requestedCheckIn: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="wl-checkout">Check-out</Label>
                <Input id="wl-checkout" type="date" value={waitlistForm.requestedCheckOut} onChange={(e) => setWaitlistForm((f) => ({ ...f, requestedCheckOut: e.target.value }))} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setWaitlistDialogOpen(false)} disabled={saving}>Cancel</Button>
            <Button onClick={handleWaitlistSubmit} disabled={saving || !waitlistForm.guestEmail || !waitlistForm.roomTypeId || !waitlistForm.requestedCheckIn || !waitlistForm.requestedCheckOut}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : editingWaitlist ? "Save Changes" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!waitlistDeleteDialog} onOpenChange={() => setWaitlistDeleteDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Waitlist Entry</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to remove <span className="font-medium text-foreground">{waitlistDeleteDialog?.label}</span> from the waitlist? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setWaitlistDeleteDialog(null)} disabled={saving}>Cancel</Button>
            <Button variant="destructive" onClick={() => waitlistDeleteDialog && handleWaitlistDelete(waitlistDeleteDialog.id)} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
