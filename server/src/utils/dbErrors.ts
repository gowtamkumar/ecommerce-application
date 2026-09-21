interface DbError {
  code?: unknown;
  message?: unknown;
  driverError?: { code?: unknown };
}

/**
 * Detect a Postgres foreign-key violation (SQLSTATE 23503).
 * Lets services translate raw FK crashes into friendly, actionable errors
 * instead of leaking SQL errors to the client.
 */
export const isForeignKeyViolation = (error: unknown): boolean => {
  const wrapped = error as DbError;
  return (
    wrapped?.code === '23503' ||
    String(wrapped?.message ?? '').includes('violates foreign key constraint') ||
    wrapped?.driverError?.code === '23503'
  );
};
