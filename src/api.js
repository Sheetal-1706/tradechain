import { seedShipments } from "./data/sampleShipments";

// false = demo data saved in this browser, true = your teammate's backend
const USE_BACKEND = false;
const BASE_URL = "http://localhost:5000/api";
const KEY = "tradechain_shipments";

function writeAll(list) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch (e) {}
}

function readAll() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  const fresh = JSON.parse(JSON.stringify(seedShipments));
  writeAll(fresh);
  return fresh;
}

function today() {
  return new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function chunk(n) {
  let s = "";
  for (let i = 0; i < n; i++) s += Math.floor(Math.random() * 16).toString(16);
  return s;
}

// Fake demo reference. A real one comes from the blockchain later.
function fakeRef() {
  return "0x" + chunk(4) + "..." + chunk(4);
}

export function resetDemoData() {
  try {
    localStorage.removeItem(KEY);
  } catch (e) {}
}

export async function getShipments() {
  if (USE_BACKEND) {
    const res = await fetch(BASE_URL + "/shipments");
    if (!res.ok) throw new Error("Could not load shipments");
    return res.json();
  }
  return readAll();
}

export async function getShipment(id) {
  if (USE_BACKEND) {
    const res = await fetch(BASE_URL + "/shipments/" + id);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error("Could not load shipment");
    return res.json();
  }
  const found = readAll().find((s) => s.id === id);
  return found || null;
}

export async function createShipment(data) {
  if (USE_BACKEND) {
    const res = await fetch(BASE_URL + "/shipments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Could not create shipment");
    return res.json();
  }

  const list = readAll();
  let max = 1023;
  list.forEach((s) => {
    const n = parseInt(s.id.replace("SHP-", ""), 10);
    if (!isNaN(n) && n > max) max = n;
  });

  const shipment = {
    id: "SHP-" + (max + 1),
    product: data.product,
    importer: data.importer,
    route: data.route,
    expectedQty: data.expectedQty,
    receivedQty: null,
    events: [
      {
        stage: "Exporter",
        title: "Shipment created",
        qty: data.expectedQty,
        status: "ok",
        date: today(),
        txRef: fakeRef(),
      },
    ],
  };

  list.push(shipment);
  writeAll(list);
  return shipment;
}

export async function submitReceivedQty(id, qty) {
  if (USE_BACKEND) {
    const res = await fetch(BASE_URL + "/shipments/" + id + "/received", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ qty: qty }),
    });
    if (!res.ok) throw new Error("Could not save received quantity");
    return res.json();
  }

  const list = readAll();
  const shipment = list.find((s) => s.id === id);
  if (!shipment) throw new Error("Shipment not found");

  const match = qty === shipment.expectedQty;
  shipment.receivedQty = qty;
  shipment.events.push({
    stage: "Importer",
    title: match ? "Quantity verified" : "Quantity discrepancy",
    qty: qty,
    status: match ? "ok" : "flag",
    date: today(),
    txRef: fakeRef(),
  });

  writeAll(list);
  return shipment;
}