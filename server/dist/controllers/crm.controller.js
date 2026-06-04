"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOrder = exports.updateOrderStatus = exports.createOrder = exports.getOrders = exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProducts = exports.deleteCustomer = exports.updateCustomer = exports.createCustomer = exports.getCustomers = exports.deleteSupplier = exports.updateSupplier = exports.createSupplier = exports.getSuppliers = void 0;
const connection_1 = __importDefault(require("../config/connection"));
// --- SUPPLIERS ---
const getSuppliers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield connection_1.default.query('SELECT * FROM suppliers ORDER BY id DESC');
        res.json(result.rows);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.getSuppliers = getSuppliers;
const createSupplier = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, phone } = req.body;
    try {
        const result = yield connection_1.default.query('INSERT INTO suppliers (name, phone) VALUES ($1, $2) RETURNING *', [name, phone]);
        res.status(201).json(result.rows[0]);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.createSupplier = createSupplier;
const updateSupplier = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, phone } = req.body;
    try {
        const result = yield connection_1.default.query('UPDATE suppliers SET name = $1, phone = $2 WHERE id = $3 RETURNING *', [name, phone, id]);
        res.json(result.rows[0]);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.updateSupplier = updateSupplier;
const deleteSupplier = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield connection_1.default.query('DELETE FROM suppliers WHERE id = $1', [id]);
        res.json({ message: 'Deleted' });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.deleteSupplier = deleteSupplier;
// --- CUSTOMERS ---
const getCustomers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield connection_1.default.query('SELECT * FROM customers ORDER BY id DESC');
        res.json(result.rows);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.getCustomers = getCustomers;
const createCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, phone, address } = req.body;
    try {
        const result = yield connection_1.default.query('INSERT INTO customers (name, phone, address) VALUES ($1, $2, $3) RETURNING *', [name, phone, address]);
        res.status(201).json(result.rows[0]);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.createCustomer = createCustomer;
const updateCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, phone, address } = req.body;
    try {
        const result = yield connection_1.default.query('UPDATE customers SET name = $1, phone = $2, address = $3 WHERE id = $4 RETURNING *', [name, phone, address, id]);
        res.json(result.rows[0]);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.updateCustomer = updateCustomer;
const deleteCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield connection_1.default.query('DELETE FROM customers WHERE id = $1', [id]);
        res.json({ message: 'Deleted' });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.deleteCustomer = deleteCustomer;
// --- PRODUCTS ---
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { search } = req.query;
    try {
        let query = `
            SELECT p.*, s.name as supplier_name 
            FROM products p 
            LEFT JOIN suppliers s ON p.supplier_id = s.id
        `;
        const params = [];
        if (search) {
            query += ` WHERE p.name ILIKE $1 OR p.category ILIKE $1`;
            params.push(`%${search}%`);
        }
        query += ` ORDER BY p.id DESC`;
        const result = yield connection_1.default.query(query, params);
        // Transform to match previous Supabase format: { ..., suppliers: { name } }
        const data = result.rows.map(row => ({
            id: row.id,
            name: row.name,
            category: row.category,
            price: row.price,
            stock: row.stock,
            supplier_id: row.supplier_id,
            suppliers: row.supplier_name ? { name: row.supplier_name } : null
        }));
        res.json(data);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.getProducts = getProducts;
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, category, price, stock, supplier_id } = req.body;
    try {
        const result = yield connection_1.default.query('INSERT INTO products (name, category, price, stock, supplier_id) VALUES ($1, $2, $3, $4, $5) RETURNING *', [name, category, price, stock, supplier_id]);
        res.status(201).json(result.rows[0]);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.createProduct = createProduct;
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, category, price, stock, supplier_id } = req.body;
    try {
        const result = yield connection_1.default.query('UPDATE products SET name = $1, category = $2, price = $3, stock = $4, supplier_id = $5 WHERE id = $6 RETURNING *', [name, category, price, stock, supplier_id, id]);
        res.json(result.rows[0]);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.updateProduct = updateProduct;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield connection_1.default.query('DELETE FROM products WHERE id = $1', [id]);
        res.json({ message: 'Deleted' });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.deleteProduct = deleteProduct;
// --- ORDERS ---
const getOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield connection_1.default.query(`
            SELECT 
                o.id, o.customer_id, o.order_date, o.status,
                c.name as customer_name,
                json_agg(
                    json_build_object(
                        'product_id', oi.product_id,
                        'quantity', oi.quantity,
                        'unit_price', oi.unit_price,
                        'products', json_build_object('name', p.name)
                    )
                ) as order_items
            FROM orders o
            LEFT JOIN customers c ON o.customer_id = c.id
            LEFT JOIN order_items oi ON o.id = oi.order_id
            LEFT JOIN products p ON oi.product_id = p.id
            GROUP BY o.id, c.name
            ORDER BY o.id DESC
        `);
        // Transform slightly to match Supabase structure expectations if needed
        const data = result.rows.map(row => ({
            id: row.id,
            customer_id: row.customer_id,
            order_date: row.order_date,
            status: row.status,
            customers: { name: row.customer_name },
            order_items: (row.order_items[0] && row.order_items[0].product_id === null) ? [] : row.order_items
        }));
        res.json(data);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.getOrders = getOrders;
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { customer_id, status, items } = req.body;
    const client = yield connection_1.default.connect();
    try {
        yield client.query('BEGIN');
        // 1. Insert order
        const orderResult = yield client.query('INSERT INTO orders (customer_id, status) VALUES ($1, $2) RETURNING id', [customer_id, status || 'new']);
        const orderId = orderResult.rows[0].id;
        // 2. Insert items and update stock
        if (items && items.length > 0) {
            const values = [];
            const flatValues = [];
            let i = 1;
            for (const item of items) {
                values.push(`($${i++}, $${i++}, $${i++}, $${i++})`);
                flatValues.push(orderId, item.product_id, item.quantity, item.unit_price);
                // Optional: update stock logically
                yield client.query('UPDATE products SET stock = stock - $1 WHERE id = $2', [item.quantity, item.product_id]);
            }
            yield client.query(`INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES ${values.join(', ')}`, flatValues);
        }
        yield client.query('COMMIT');
        res.status(201).json({ id: orderId });
    }
    catch (error) {
        yield client.query('ROLLBACK');
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    finally {
        client.release();
    }
});
exports.createOrder = createOrder;
const updateOrderStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { status } = req.body;
    try {
        yield connection_1.default.query('UPDATE orders SET status = $1 WHERE id = $2', [status, id]);
        res.json({ message: 'Updated' });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.updateOrderStatus = updateOrderStatus;
const deleteOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield connection_1.default.query('DELETE FROM orders WHERE id = $1', [id]);
        res.json({ message: 'Deleted' });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.deleteOrder = deleteOrder;
