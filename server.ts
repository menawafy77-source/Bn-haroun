import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'orders_db.json');

// Ensure database directory and file exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify([], null, 2), 'utf-8');
}

// Helpers to read/write orders database safely
function readOrders(): any[] {
  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.error('Error reading orders DB:', err);
  }
  return [];
}

function writeOrders(orders: any[]): boolean {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(orders, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing orders DB:', err);
    return false;
  }
}

// Middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ================= API ROUTES ================= //

// 1. Health check
app.get('/api/health', (req: Request, res: Response) => {
  const orders = readOrders();
  res.json({ status: 'ok', ordersCount: orders.length, timestamp: new Date().toISOString() });
});

// 2. Get all orders
app.get('/api/orders', (req: Request, res: Response) => {
  const orders = readOrders();
  res.json({ success: true, count: orders.length, orders });
});

// 3. Create / save new order
app.post('/api/orders', (req: Request, res: Response) => {
  try {
    const newOrder = req.body;
    if (!newOrder || !newOrder.id) {
      return res.status(400).json({ success: false, error: 'بيانات الطلب غير مكتملة' });
    }

    const currentOrders = readOrders();
    // Prevent duplicate orders with same ID
    const filtered = currentOrders.filter((ord: any) => ord.id !== newOrder.id);
    const updated = [newOrder, ...filtered];

    if (writeOrders(updated)) {
      console.log(`[ORDER CREATED] Order ${newOrder.id} (${newOrder.customerName}) saved successfully. Total orders: ${updated.length}`);
      return res.status(201).json({ success: true, order: newOrder, totalOrders: updated.length });
    } else {
      return res.status(500).json({ success: false, error: 'فشل حفظ الطلب في قاعدة البيانات' });
    }
  } catch (err: any) {
    console.error('Error in POST /api/orders:', err);
    return res.status(500).json({ success: false, error: err?.message || 'خطأ غير متوقع' });
  }
});

// 4. Update order status or points
app.put('/api/orders/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const currentOrders = readOrders();
    let found = false;

    const updated = currentOrders.map((ord: any) => {
      if (ord.id === id) {
        found = true;
        return { ...ord, ...updates };
      }
      return ord;
    });

    if (!found) {
      return res.status(404).json({ success: false, error: 'الطلب غير موجود' });
    }

    writeOrders(updated);
    return res.json({ success: true, message: 'تم تحديث حالة الطلب بنجاح' });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message });
  }
});

// 5. Delete specific order
app.delete('/api/orders/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const currentOrders = readOrders();
    const updated = currentOrders.filter((ord: any) => ord.id !== id);

    writeOrders(updated);
    return res.json({ success: true, message: 'تم حذف الطلب بنجاح', remainingCount: updated.length });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message });
  }
});

// 6. Clear all orders
app.delete('/api/orders', (req: Request, res: Response) => {
  try {
    writeOrders([]);
    return res.json({ success: true, message: 'تم مسح سجل الطلبات' });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message });
  }
});

// ================= FRONTEND VITE INTEGRATION ================= //

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    // Development mode: mount Vite dev server as middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production mode: serve static files from dist
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`☕ Haroun Coffee Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
