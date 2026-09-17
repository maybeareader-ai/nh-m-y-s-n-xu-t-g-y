import express, { Request, Response, NextFunction } from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const DB_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DB_DIR, "db.json");

interface Item {
  id: string;
  name: string;
  image: string;
  presetId?: string;
  description: string;
  tray: "tray1" | "tray2";
  rarity?: string;
  customLore?: string[];
  createdAt: number;
}

interface Recipe {
  id: string;
  itemAId: string;
  itemBId: string;
  resultItem: {
    id: string;
    name: string;
    image: string;
    description: string;
    rarity?: string;
  };
  doc: {
    title: string;
    subtitle?: string;
    story: string;
    formulaSteps: string[];
    properties?: { label: string; value: string }[];
    images: string[];
    notes: string;
    updatedAt: number;
  };
}

interface TrayConfig {
  id: "tray1" | "tray2";
  title: string;
  subtitle: string;
  color: string;
}

interface DBData {
  adminPassword: string;
  items: Item[];
  recipes: Recipe[];
  trays: TrayConfig[];
}

const DEFAULT_DB: DBData = {
  adminPassword: process.env.ADMIN_PASSWORD || "admin123",
  items: [],
  recipes: [],
  trays: [
    { id: "tray1", title: "Khay 1", subtitle: "", color: "#0284c7" },
    { id: "tray2", title: "Khay 2", subtitle: "", color: "#9333ea" },
  ],
};

function ensureDB(): DBData {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_PATH)) {
      fs.writeFileSync(DB_PATH, JSON.stringify(DEFAULT_DB, null, 2), "utf-8");
      return DEFAULT_DB;
    }
    const raw = fs.readFileSync(DB_PATH, "utf-8");
    const data = JSON.parse(raw);
    return {
      adminPassword: data.adminPassword || process.env.ADMIN_PASSWORD || "admin123",
      items: Array.isArray(data.items) ? data.items : [],
      recipes: Array.isArray(data.recipes) ? data.recipes : [],
      trays: Array.isArray(data.trays) && data.trays.length >= 2 ? data.trays : DEFAULT_DB.trays,
    };
  } catch (err) {
    console.error("Error reading db.json, returning default:", err);
    return DEFAULT_DB;
  }
}

function saveDB(data: DBData) {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Error saving db.json:", err);
  }
}

let db = ensureDB();

function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers["x-admin-token"] || req.headers["authorization"];
  const currentPass = process.env.ADMIN_PASSWORD || db.adminPassword || "admin123";

  const bearerToken = typeof token === "string" && token.startsWith("Bearer ")
    ? token.slice(7)
    : token;

  if (bearerToken === currentPass) {
    return next();
  }
  return res.status(401).json({ error: "Unauthorized: Chế độ chỉ dành cho Quản trị viên." });
}

async function startServer() {
  const app = express();

  // CORS middleware for seamless iframe and preview proxy support
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, x-admin-token");
    if (req.method === "OPTIONS") {
      return res.sendStatus(204);
    }
    next();
  });

  // Allow larger payload for image base64
  app.use(express.json({ limit: "25mb" }));
  app.use(express.urlencoded({ limit: "25mb", extended: true }));

  // --- API Routes ---

  // Lấy toàn bộ dữ liệu chung cho tất cả mọi người mở link
  app.get("/api/data", (_req: Request, res: Response) => {
    db = ensureDB();
    res.json({
      items: db.items,
      recipes: db.recipes,
      trays: db.trays,
    });
  });

  // Xác thực mật khẩu Admin
  app.post("/api/auth/login", (req: Request, res: Response) => {
    const { password } = req.body;
    const currentPass = process.env.ADMIN_PASSWORD || db.adminPassword || "admin123";
    if (password === currentPass) {
      res.json({ success: true, token: currentPass });
    } else {
      res.status(401).json({ success: false, message: "Mật khẩu quản trị viên không chính xác!" });
    }
  });

  // Đổi mật khẩu Admin
  app.post("/api/auth/change-password", authMiddleware, (req: Request, res: Response) => {
    const { newPassword } = req.body;
    if (!newPassword || typeof newPassword !== "string" || newPassword.trim().length < 4) {
      return res.status(400).json({ error: "Mật khẩu mới phải từ 4 ký tự trở lên." });
    }
    db.adminPassword = newPassword.trim();
    saveDB(db);
    res.json({ success: true, message: "Đã đổi mật khẩu thành công!" });
  });

  // Thêm / cập nhật vật phẩm (Chỉ Admin)
  app.post("/api/items", authMiddleware, (req: Request, res: Response) => {
    const item: Item = req.body;
    if (!item || !item.name) {
      return res.status(400).json({ error: "Tên vật phẩm không được để trống." });
    }

    const existingIdx = db.items.findIndex((i) => i.id === item.id);
    if (existingIdx >= 0) {
      db.items[existingIdx] = item;
    } else {
      db.items.push(item);
    }
    saveDB(db);
    res.json({ success: true, items: db.items });
  });

  // Xoá vật phẩm (Chỉ Admin)
  app.delete("/api/items/:id", authMiddleware, (req: Request, res: Response) => {
    const { id } = req.params;
    db.items = db.items.filter((i) => i.id !== id);
    saveDB(db);
    res.json({ success: true, items: db.items });
  });

  // Xoá sạch 1 khay (Chỉ Admin)
  app.post("/api/trays/:trayId/clear", authMiddleware, (req: Request, res: Response) => {
    const { trayId } = req.params;
    db.items = db.items.filter((i) => i.tray !== trayId);
    saveDB(db);
    res.json({ success: true, items: db.items });
  });

  // Cập nhật tên khay (Chỉ Admin)
  app.put("/api/trays/:trayId", authMiddleware, (req: Request, res: Response) => {
    const { trayId } = req.params;
    const { title } = req.body;
    db.trays = db.trays.map((t) => (t.id === trayId ? { ...t, title: title || t.title } : t));
    saveDB(db);
    res.json({ success: true, trays: db.trays });
  });

  // Thêm / cập nhật công thức (Chỉ Admin)
  app.post("/api/recipes", authMiddleware, (req: Request, res: Response) => {
    const recipe: Recipe = req.body;
    if (!recipe || !recipe.id) {
      return res.status(400).json({ error: "Dữ liệu công thức không hợp lệ." });
    }

    const existingIdx = db.recipes.findIndex((r) => r.id === recipe.id);
    if (existingIdx >= 0) {
      db.recipes[existingIdx] = recipe;
    } else {
      db.recipes.push(recipe);
    }
    saveDB(db);
    res.json({ success: true, recipes: db.recipes });
  });

  // Cập nhật trang công thức (Chỉ Admin)
  app.put("/api/recipes/:id", authMiddleware, (req: Request, res: Response) => {
    const { id } = req.params;
    const recipe: Recipe = req.body;
    db.recipes = db.recipes.map((r) => (r.id === id ? recipe : r));
    saveDB(db);
    res.json({ success: true, recipes: db.recipes });
  });

  // Xoá công thức (Chỉ Admin)
  app.delete("/api/recipes/:id", authMiddleware, (req: Request, res: Response) => {
    const { id } = req.params;
    db.recipes = db.recipes.filter((r) => r.id !== id);
    saveDB(db);
    res.json({ success: true, recipes: db.recipes });
  });

  // Đặt lại toàn bộ dữ liệu (Chỉ Admin)
  app.post("/api/reset", authMiddleware, (_req: Request, res: Response) => {
    db.items = [];
    db.recipes = [];
    db.trays = DEFAULT_DB.trays;
    saveDB(db);
    res.json({ success: true, items: [], recipes: [], trays: db.trays });
  });

  // --- Vite / Frontend Serving ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
