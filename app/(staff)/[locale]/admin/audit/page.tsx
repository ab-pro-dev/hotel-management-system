import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollText } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin — Audit Log",
};

const ACTION_COLORS: Record<string, string> = {
  CREATE: "bg-primary/10 text-primary",
  UPDATE: "bg-primary/5 text-primary",
  UPDATE_STATUS: "bg-primary/5 text-primary",
  DELETE: "bg-destructive/10 text-destructive",
  SET_OVERRIDE: "bg-secondary text-secondary-foreground",
  REMOVE_OVERRIDE: "bg-secondary text-secondary-foreground",
  CANCEL: "bg-destructive/10 text-destructive",
};

export default async function AuditLogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect(`/${locale}/login`);

  const logs = await prisma.auditLog.findMany({
    take: 100,
    include: {
      user: { select: { name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl">Audit Log</h1>
        <p className="text-muted-foreground">Recent admin actions across the system.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <ScrollText className="h-4 w-4" />
            Recent Entries ({logs.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <p className="text-sm text-muted-foreground">No audit entries yet.</p>
          ) : (
            <div className="space-y-2">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="flex flex-col gap-1 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className={ACTION_COLORS[log.action] ?? "bg-muted text-muted-foreground"}>
                      {log.action}
                    </Badge>
                    <Badge variant="secondary">{log.targetTable}</Badge>
                    <span className="text-xs text-muted-foreground font-mono">{log.targetId.slice(0, 8)}</span>
                    <span className="text-sm font-medium">{log.user?.name ?? "System"}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    {log.metadata && typeof log.metadata === "object" && Object.keys(log.metadata).length > 0 && (
                      <span className="max-w-xs truncate">
                        {JSON.stringify(log.metadata)}
                      </span>
                    )}
                    <span>{new Date(log.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
