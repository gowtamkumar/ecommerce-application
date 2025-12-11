import AuditLogList from "@/components/dashboard/audit-log/AuditLogList";

export const metadata = {
  title: "Audit Logs - Dashboard",
  description: "Track all admin actions and system events",
};

export default function AuditLogsPage() {
  return <AuditLogList />;
}
