const API_BASE_URL = import.meta.env["VITE_API_BASE_URL"] ?? "";
async function request(path, init) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    ...init
  });
  if (!response.ok) throw new Error(`Request failed: ${response.status}`);
  return await response.json();
}
const demoWindows = {
  "1h": { conversion: "31.7%", carts: "37", bars: [38, 44, 52, 49, 61, 58, 70, 66, 78, 74, 88, 92, 85, 96, 90, 100] },
  "4h": { conversion: "33.1%", carts: "142", bars: [26, 32, 38, 46, 52, 61, 65, 72, 78, 85, 91, 84, 79, 86, 94, 88] },
  "24h": { conversion: "32.4%", carts: "311", bars: [12, 18, 16, 22, 35, 48, 62, 78, 91, 84, 70, 66, 72, 82, 58, 31] }
};
function demoDashboard(timeWindow) {
  return {
    metrics: demoWindows[timeWindow],
    zones: [
      { name: "Grocery", value: 78, tone: "primary" },
      { name: "Personal Care", value: 54, tone: "accent" },
      { name: "Home & Living", value: 41, tone: "accent" },
      { name: "Electronics", value: 33, tone: "accent" },
      { name: "Checkout", value: 94, tone: "warning" }
    ],
    alerts: [
      { id: 1, title: "Checkout queue exceeded 6", detail: "Lane 3 \xB7 detected 1 min ago", kind: "warning" },
      { id: 2, title: "Shelf gap detected", detail: "Grocery \xB7 Aisle 7 \xB7 SKU 88213", kind: "warning" },
      { id: 3, title: "Dairy stock below threshold", detail: "12 units remaining \xB7 replenish now", kind: "success" }
    ],
    inventory: { inStock: 186, lowStock: 23, outOfStock: 5, skus: 214 },
    queues: [
      { lane: "Lane 1", state: "4 waiting \xB7 6m", warning: true },
      { lane: "Lane 2", state: "1 waiting \xB7 2m", warning: false },
      { lane: "Lane 3", state: "Open \xB7 0m", warning: false }
    ],
    devices: [
      { name: "Raspberry Pi 5 \xB7 Core", warning: false },
      { name: "Shelf camera \xB7 Grocery", warning: false },
      { name: "BLE gateway \xB7 Entrance", warning: true },
      { name: "Queue camera \xB7 Lane 3", warning: false }
    ]
  };
}
async function fetchDashboard(timeWindow) {
  if (!API_BASE_URL) return demoDashboard(timeWindow);
  try {
    return await request(`/api/dashboard/?window=${timeWindow}`);
  } catch {
    return demoDashboard(timeWindow);
  }
}
async function acknowledgeAlert(id) {
  if (!API_BASE_URL) return;
  try {
    await request(`/api/alerts/${id}/acknowledge/`, { method: "POST" });
  } catch {
  }
}
const dashboardQuery = (timeWindow) => ({
  queryKey: ["dashboard", timeWindow],
  queryFn: () => fetchDashboard(timeWindow),
  staleTime: 15e3
});
export {
  API_BASE_URL,
  acknowledgeAlert,
  dashboardQuery,
  demoDashboard,
  fetchDashboard
};
