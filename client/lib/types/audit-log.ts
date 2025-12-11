export interface IAuditLog {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userRole: string;
  action: any;
  resourceType: string;
  resourceId?: string;
  resourceName?: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  metadata?: {
    ip?: string;
    userAgent?: string;
    [key: string]: any;
  };
  createdAt: string;
}

export interface AuditLogListResponse {
  data: IAuditLog[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AuditLogStats {
  totalLogs: number;
  byAction: { action: string; count: number }[];
  byResourceType: { resourceType: string; count: number }[];
  period: string;
}
