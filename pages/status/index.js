import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}

function DatabaseInfo() {
  const { data, isLoading } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  let [updatedAt, maxConnections, openedConnections, version] =
    Array(4).fill("Loading...");

  if (!isLoading && data) {
    updatedAt = new Date(data.updated_at).toLocaleString();

    const database = data.dependencies.database;
    maxConnections = database.max_connections;
    openedConnections = database.opened_connections;
    version = database.version;
  }

  return (
    <>
      <p>Updated at: {updatedAt}</p>
      <div>
        <h2>Database</h2>
        <p>Max connections: {maxConnections}</p>
        <p>Opened connections: {openedConnections}</p>
        <p>Version: {version}</p>
      </div>
    </>
  );
}

export default function StatusPage() {
  return (
    <>
      <h1>Status</h1>
      <DatabaseInfo />
    </>
  );
}
