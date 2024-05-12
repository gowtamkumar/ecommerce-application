export async function backupDB() {
  const res = await fetch(`http://localhost:3900/api/v1/settings/db-backup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ a: 1, b: "Textual content" }),
  });

  return res;
}
