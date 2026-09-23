import { createFileRoute } from "@tanstack/react-router";
import {
  Boxes,
  Camera,
  ChartNoAxesCombined,
  Check,
  ChevronDown,
  Cpu,
  Download,
  Expand,
  LayoutDashboard,
  Map,
  RefreshCw,
  Settings,
  ShoppingCart,
  TriangleAlert,
  Users,
  X
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { acknowledgeAlert, dashboardQuery, demoDashboard } from "@/lib/api";
import { cn } from "@/lib/utils";
import groceryFeed from "@/assets/cctv-grocery.jpg";
import checkoutFeed from "@/assets/cctv-checkout.jpg";
import basketFeed from "@/assets/cctv-basket.jpg";
import dairyFeed from "@/assets/cctv-dairy.jpg";
const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Live Store Overview | RetailEdge" },
      { name: "description", content: "Monitor shopper movement, stock, queues, shelf alerts, and edge devices in real time." },
      { property: "og:title", content: "RetailEdge Live Store Overview" },
      { property: "og:description", content: "Real-time, privacy-first retail operations powered by local edge intelligence." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" }
    ]
  }),
  component: RetailDashboard
});
const navItems = [
  { label: "Live Overview", icon: LayoutDashboard, target: "overview" },
  { label: "Zones", icon: Map, target: "zones" },
  { label: "Inventory", icon: Boxes, target: "inventory" },
  { label: "Queues", icon: Users, target: "queues" },
  { label: "CCTV Feeds", icon: Camera, target: "cameras" },
  { label: "Edge Devices", icon: Cpu, target: "devices" },
  { label: "Settings", icon: Settings, target: "settings" }
];
const timeWindows = ["1h", "4h", "24h"];
const cameraFeeds = [
  { id: "CAM-01", name: "Checkout Lanes", location: "Front end · Lanes 1–4", image: checkoutFeed, purpose: "Queue & lane monitoring" },
  { id: "CAM-02", name: "Basket Scanner", location: "Self-checkout · Scan counter", image: basketFeed, purpose: "Scans items in basket" },
  { id: "CAM-03", name: "Grocery Aisle", location: "Grocery · Aisle 4", image: groceryFeed, purpose: "Item mismatch detection" },
  { id: "CAM-04", name: "Dairy Section", location: "Chilled goods · Aisle 8", image: dairyFeed, purpose: "Item mismatch detection" }
];

function RetailDashboard() {
  const [activeNav, setActiveNav] = useState("Live Overview");
  const [timeWindow, setTimeWindow] = useState("1h");
  const [acknowledged, setAcknowledged] = useState([]);
  const [refreshed, setRefreshed] = useState(false);
  const [expandedCamera, setExpandedCamera] = useState(null);
  const { data, refetch } = useQuery({
    ...dashboardQuery(timeWindow),
    initialData: () => demoDashboard(timeWindow)
  });
  const { metrics, zones, inventory, queues, devices } = data;
  const alerts = useMemo(
    () => data.alerts.filter((alert) => !acknowledged.includes(alert.id)),
    [data.alerts, acknowledged]
  );
  const openAlerts = alerts.length;
  const dismissAlert = (id) => {
    setAcknowledged((current) => [...current, id]);
    void acknowledgeAlert(id);
  };
  const navigateTo = (label, target) => {
    setActiveNav(label);
    document.getElementById(target)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const exportReport = () => {
    const csv = `RetailEdge live report
Window,${timeWindow}
Conversion,${metrics.conversion}
Active carts,${metrics.carts}
Open alerts,${openAlerts}`;
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "retailedge-live-report.csv";
    link.click();
    URL.revokeObjectURL(url);
  };
  return <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-4 px-3 py-3 lg:min-h-screen lg:flex-row lg:px-5 lg:py-5">
        <aside className="glass-panel rise-in flex shrink-0 flex-col rounded-2xl p-4 lg:sticky lg:top-5 lg:h-[calc(100vh-2.5rem)] lg:w-[236px]">
          <div className="flex items-center gap-2.5 px-1 pb-4">
            <div className="grid size-10 place-items-center rounded-xl bg-primary font-display text-sm font-bold text-primary-foreground">RE</div>
            <div className="leading-tight">
              <p className="font-display text-[15px] font-semibold">RetailEdge</p>
              <p className="text-[11px] text-muted-foreground">by 1008 A-Rise</p>
            </div>
          </div>

          <button className="mb-4 flex w-full items-center justify-between rounded-xl bg-brand-soft p-3 text-left ring-1 ring-primary/15" type="button" aria-label="Select store">
            <span className="leading-tight">
              <span className="mb-1 block text-[10px] font-semibold uppercase text-brand-soft-foreground">Active store</span>
              <span className="block text-[13px] font-semibold">A-Rise Demo Store</span>
              <span className="block text-[11px] text-muted-foreground">Store 001 · Bengaluru</span>
            </span>
            <ChevronDown className="size-4 text-primary" />
          </button>

          <nav className="grid grid-cols-2 gap-1 sm:grid-cols-3 lg:flex lg:flex-col" aria-label="Dashboard sections">
            {navItems.map(({ label, icon: Icon, target }) => <Button
    key={label}
    variant={activeNav === label ? "navActive" : "nav"}
    size="sm"
    onClick={() => navigateTo(label, target)}
    className="min-w-0 px-2 lg:px-3"
  >
                <Icon className="size-4" />
                <span className="truncate">{label}</span>
              </Button>)}
          </nav>

          <div id="settings" className="mt-4 rounded-xl bg-surface-strong p-3 ring-1 ring-border lg:mt-auto">
            <div className="flex items-center gap-2">
              <span className="live-dot size-2 rounded-full bg-success" />
              <p className="text-[11px] font-semibold text-success">Edge processing local</p>
            </div>
            <p className="mt-1.5 text-[10.5px] leading-snug text-muted-foreground">Anonymous tag IDs · no facial recognition · offline-ready</p>
          </div>
        </aside>

        <main className="flex min-w-0 flex-1 flex-col gap-4">
          <header id="overview" className="glass-panel rise-in flex flex-col gap-3 rounded-2xl px-4 py-3 sm:flex-row sm:items-center sm:justify-between lg:px-5">
            <div className="flex items-center gap-3 sm:gap-4">
              <div>
                <h1 className="font-display text-xl font-semibold">Live Overview</h1>
                <p className="text-xs text-muted-foreground">A-Rise Demo Store · peak window</p>
              </div>
              <span className="flex items-center gap-1.5 rounded-full bg-success-soft px-2.5 py-1 text-[11px] font-semibold text-success ring-1 ring-success/20">
                <span className="live-dot size-1.5 rounded-full bg-success" /> Live
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex rounded-lg bg-secondary p-0.5 text-xs font-medium">
                {timeWindows.map((window2) => <Button key={window2} variant={timeWindow === window2 ? "secondary" : "ghost"} size="sm" className="h-7 px-2.5" onClick={() => setTimeWindow(window2)}>{window2}</Button>)}
              </div>
              <Button size="sm" onClick={exportReport}><Download className="size-3.5" /> Export</Button>
              <Button variant="secondary" size="icon" title="Refresh live data" onClick={() => {
    setRefreshed(true);
    void refetch();
    window.setTimeout(() => setRefreshed(false), 700);
  }}>
                <RefreshCw className={cn("size-4", refreshed && "animate-spin")} />
              </Button>

            </div>
          </header>

          <section className="grid grid-cols-2 gap-3">
            <Metric label="Conversion" value={metrics.conversion} detail="cart-to-checkout" change="−0.6%" icon={ChartNoAxesCombined} warning />
            <Metric label="Virtual carts" value={metrics.carts} detail="barcode-linked sessions" change="+12.9%" icon={ShoppingCart} />
          </section>

          <section id="zones" className="grid scroll-mt-5 grid-cols-1 gap-4 xl:grid-cols-12">
            <article className="glass-panel rise-in rounded-2xl p-4 xl:col-span-8 xl:p-5">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div><h2 className="font-display text-[15px] font-semibold">Customer density</h2><p className="text-[11px] text-muted-foreground">Anonymous BLE/RSSI zone count · last {timeWindow}</p></div>
                <div className="flex gap-3 text-[11px] text-muted-foreground"><span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-primary" />In-store</span><span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-accent" />Peak line</span></div>
              </div>
              <div className="relative h-44">
                <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-accent/50" />
                <div className="flex h-full items-end gap-1.5">
                  {metrics.bars.map((height, index) => <div key={`${timeWindow}-${index}`} className={cn("chart-bar flex-1 rounded-t-sm", index > 9 ? "bg-primary" : "bg-primary/65")} style={{ height: `${height}%`, animationDelay: `${index * 25}ms` }} />)}
                </div>
              </div>
              <div className="mt-2 flex justify-between text-[10px] text-muted-foreground"><span>Start</span><span>+20m</span><span>+40m</span><span>Now</span></div>
            </article>

            <article className="glass-panel rise-in rounded-2xl p-4 xl:col-span-4 xl:p-5">
              <div className="mb-4 flex items-center justify-between"><h2 className="font-display text-[15px] font-semibold">Zone occupancy</h2><span className="text-[11px] text-muted-foreground">live</span></div>
              <div className="flex flex-col gap-3.5">
                {zones.map((zone) => <div key={zone.name}>
                    <div className="mb-1 flex justify-between text-xs"><span className="font-medium">{zone.name}</span><span className={zone.tone === "warning" ? "font-semibold text-warning" : "text-muted-foreground"}>{zone.value}%</span></div>
                    <div className="h-2 overflow-hidden rounded-full bg-secondary"><div className={cn("h-full rounded-full transition-all", zone.tone === "warning" ? "bg-warning" : zone.tone === "primary" ? "bg-primary" : "bg-accent")} style={{ width: `${zone.value}%` }} /></div>
                  </div>)}
              </div>
            </article>
          </section>

          <section className="grid grid-cols-1 gap-4 xl:grid-cols-12">
            <article className="glass-panel rise-in rounded-2xl p-4 xl:col-span-5 xl:p-5">
              <div className="mb-4 flex items-center justify-between"><h2 className="font-display text-[15px] font-semibold">Prioritized alerts</h2><span className="rounded-full bg-warning-soft px-2 py-0.5 text-[11px] font-semibold text-warning">{openAlerts} open</span></div>
              <div className="flex min-h-52 flex-col gap-2.5">
                {alerts.length === 0 ? <div className="grid flex-1 place-items-center rounded-xl bg-success-soft text-center"><div><Check className="mx-auto size-7 text-success" /><p className="mt-2 text-sm font-semibold">All alerts acknowledged</p></div></div> : alerts.map((alert) => <div key={alert.id} className={cn("flex flex-col gap-3 rounded-xl p-3 ring-1 sm:flex-row sm:items-center", alert.kind === "warning" ? "bg-warning-soft/70 ring-warning/20" : "bg-success-soft/70 ring-success/20")}>
                    <span className={cn("grid size-8 shrink-0 place-items-center rounded-lg text-warning-foreground", alert.kind === "warning" ? "bg-warning" : "bg-success")}>{alert.kind === "warning" ? <TriangleAlert className="size-4" /> : <Boxes className="size-4" />}</span>
                    <div className="min-w-0 flex-1"><p className="text-[13px] font-semibold">{alert.title}</p><p className="text-[11px] text-muted-foreground">{alert.detail}</p></div>
                    <Button variant={alert.kind === "warning" ? "warning" : "secondary"} size="sm" onClick={() => dismissAlert(alert.id)}>Acknowledge</Button>
                  </div>)}
              </div>
            </article>

            <div className="flex flex-col gap-4 xl:col-span-7">
              <article id="inventory" className="glass-panel rise-in scroll-mt-5 rounded-2xl p-4 xl:p-5">
                <div className="mb-4 flex items-center justify-between"><h2 className="font-display text-[15px] font-semibold">Inventory health</h2><span className="text-[11px] text-muted-foreground">{inventory.skus} SKUs monitored</span></div>
                <div className="grid grid-cols-3 gap-3">
                  <InventoryStat value={String(inventory.inStock)} label="In stock" tone="success" />
                  <InventoryStat value={String(inventory.lowStock)} label="Low stock" tone="warning" />
                  <InventoryStat value={String(inventory.outOfStock)} label="Out of stock" tone="danger" />
                </div>
              </article>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <article id="queues" className="glass-panel rise-in scroll-mt-5 rounded-2xl p-4 xl:p-5">
                  <h2 className="mb-3 font-display text-[15px] font-semibold">Checkout queue</h2>
                  <div className="flex flex-col gap-2">
                    {queues.map((queue) => <QueueRow key={queue.lane} lane={queue.lane} state={queue.state} warning={queue.warning} />)}
                  </div>
                </article>
                <article id="devices" className="glass-panel rise-in scroll-mt-5 rounded-2xl p-4 xl:p-5">
                  <h2 className="mb-3 font-display text-[15px] font-semibold">Edge devices</h2>
                  <div className="flex flex-col gap-2.5">
                    {devices.map((device) => <DeviceRow key={device.name} name={device.name} warning={device.warning} />)}
                  </div>

                </article>
              </div>
            </div>
          </section>

          <section id="cameras" className="glass-panel rise-in scroll-mt-5 rounded-2xl p-4 xl:p-5">
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Camera className="size-4 text-primary" />
                  <h2 className="font-display text-[15px] font-semibold">Connected CCTV feeds</h2>
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground">Checkout & aisle cameras · cart and basket verification · mismatch alerts · processed locally at the edge</p>
              </div>
              <span className="flex w-fit items-center gap-1.5 rounded-full bg-success-soft px-2.5 py-1 text-[11px] font-semibold text-success ring-1 ring-success/20">
                <span className="live-dot size-1.5 rounded-full bg-success" /> 4 of 4 online
              </span>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {cameraFeeds.map((camera) => <CameraFeed key={camera.id} camera={camera} onExpand={() => setExpandedCamera(camera)} />)}
            </div>
          </section>
        </main>
      </div>
      {expandedCamera ? <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/80 p-4" role="dialog" aria-modal="true" aria-label={`${expandedCamera.name} expanded camera feed`} onClick={() => setExpandedCamera(null)}>
        <div className="relative w-full max-w-5xl overflow-hidden rounded-xl bg-card shadow-2xl" onClick={(event) => event.stopPropagation()}>
          <img src={expandedCamera.image} alt={`${expandedCamera.name} CCTV view`} width={992} height={672} className="aspect-video w-full object-cover" />
          <div className="flex items-center justify-between gap-4 p-4">
            <div><p className="font-display text-sm font-semibold">{expandedCamera.name}</p><p className="text-[11px] text-muted-foreground">{expandedCamera.id} · {expandedCamera.location}</p></div>
            <span className="flex items-center gap-1.5 text-xs font-semibold text-success"><span className="live-dot size-2 rounded-full bg-success" />Live</span>
          </div>
          <Button variant="secondary" size="icon" className="absolute right-3 top-3" title="Close camera view" onClick={() => setExpandedCamera(null)}><X className="size-4" /></Button>
        </div>
      </div> : null}
    </div>;
}
function CameraFeed({ camera, onExpand }) {
  return <article className="group overflow-hidden rounded-xl bg-surface-strong ring-1 ring-border">
    <div className="relative aspect-video overflow-hidden bg-secondary">
      <img src={camera.image} alt={`${camera.name} CCTV view`} loading="lazy" width={992} height={672} className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.02]" />
      <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-md bg-foreground/80 px-2 py-1 text-[10px] font-semibold text-background">
        <span className="live-dot size-1.5 rounded-full bg-success" /> LIVE
      </div>
      <Button variant="secondary" size="icon" className="absolute right-3 top-3 opacity-90" title={`Expand ${camera.name}`} onClick={onExpand}><Expand className="size-4" /></Button>
      <span className="absolute bottom-3 left-3 rounded-md bg-foreground/80 px-2 py-1 font-mono text-[10px] text-background">{camera.id}</span>
    </div>
    <div className="flex items-center justify-between gap-3 p-3">
      <div className="min-w-0"><p className="truncate text-xs font-semibold">{camera.name}</p><p className="truncate text-[10.5px] text-muted-foreground">{camera.location}</p></div>
      <span className="shrink-0 text-[10px] font-medium text-muted-foreground">1080p · 24fps</span>
    </div>
    <div className="px-3 pb-3"><span className="inline-flex items-center rounded-full bg-brand-soft px-2 py-0.5 text-[10px] font-semibold text-brand-soft-foreground ring-1 ring-primary/15">{camera.purpose}</span></div>
  </article>;
}
function Metric({ label, value, detail, change, icon: Icon, warning = false }) {
  return <article className="glass-panel rise-in rounded-2xl p-4"><div className="flex items-center justify-between gap-2"><div className="flex items-center gap-2 text-[11px] font-medium uppercase text-muted-foreground"><Icon className="size-3.5" />{label}</div><span className={cn("rounded-full px-1.5 py-0.5 text-[10px] font-semibold", warning ? "bg-warning-soft text-warning" : "bg-success-soft text-success")}>{change}</span></div><p className="mt-2 font-display text-2xl font-semibold sm:text-3xl">{value}</p><p className="mt-1 text-[11px] text-muted-foreground">{detail}</p></article>;
}
function InventoryStat({ value, label, tone }) {
  const styles = { success: "bg-success-soft/70 text-success ring-success/15", warning: "bg-warning-soft/70 text-warning ring-warning/15", danger: "bg-danger-soft/70 text-danger ring-danger/15" };
  return <div className={cn("rounded-xl p-3 ring-1", styles[tone])}><p className="font-display text-2xl font-semibold">{value}</p><p className="text-[11px] text-muted-foreground">{label}</p></div>;
}
function QueueRow({ lane, state, warning = false }) {
  return <div className={cn("flex items-center justify-between rounded-lg px-3 py-2 ring-1", warning ? "bg-warning-soft/70 ring-warning/15" : "bg-success-soft/70 ring-success/15")}><span className="text-xs font-medium">{lane}</span><span className={cn("text-xs font-semibold", warning ? "text-warning" : "text-success")}>{state}</span></div>;
}
function DeviceRow({ name, warning = false }) {
  return <div className="flex items-center justify-between gap-2 px-1"><span className="truncate text-xs font-medium">{name}</span><span className={cn("flex shrink-0 items-center gap-1.5 text-[11px] font-semibold", warning ? "text-warning" : "text-success")}><span className={cn("size-1.5 rounded-full", warning ? "bg-warning" : "live-dot bg-success")} />{warning ? "Reconnecting" : "Online"}</span></div>;
}
export {
  Route
};
