import { Request, Response } from 'express';
import pool from '../config/connection';

// --- SUPPLIERS ---
export const getSuppliers = async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT * FROM suppliers ORDER BY id DESC');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const createSupplier = async (req: Request, res: Response) => {
    const { name, phone } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO suppliers (name, phone) VALUES ($1, $2) RETURNING *',
            [name, phone]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const updateSupplier = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, phone } = req.body;
    try {
        const result = await pool.query(
            'UPDATE suppliers SET name = $1, phone = $2 WHERE id = $3 RETURNING *',
            [name, phone, id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const deleteSupplier = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM suppliers WHERE id = $1', [id]);
        res.json({ message: 'Deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// --- CUSTOMERS ---
export const getCustomers = async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT * FROM customers ORDER BY id DESC');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const createCustomer = async (req: Request, res: Response) => {
    const { name, phone, address } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO customers (name, phone, address) VALUES ($1, $2, $3) RETURNING *',
            [name, phone, address]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const updateCustomer = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, phone, address } = req.body;
    try {
        const result = await pool.query(
            'UPDATE customers SET name = $1, phone = $2, address = $3 WHERE id = $4 RETURNING *',
            [name, phone, address, id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const deleteCustomer = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM customers WHERE id = $1', [id]);
        res.json({ message: 'Deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// --- PRODUCTS ---
export const getProducts = async (req: Request, res: Response) => {
    const { search } = req.query;
    try {
        let query = `
            SELECT p.*, s.name as supplier_name 
            FROM products p 
            LEFT JOIN suppliers s ON p.supplier_id = s.id
        `;
        const params: any[] = [];
        
        if (search) {
            query += ` WHERE p.name ILIKE $1 OR p.category ILIKE $1`;
            params.push(`%${search}%`);
        }
        query += ` ORDER BY p.id DESC`;
        
        const result = await pool.query(query, params);
        
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
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const createProduct = async (req: Request, res: Response) => {
    const { name, category, price, stock, supplier_id } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO products (name, category, price, stock, supplier_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [name, category, price, stock, supplier_id]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const updateProduct = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, category, price, stock, supplier_id } = req.body;
    try {
        const result = await pool.query(
            'UPDATE products SET name = $1, category = $2, price = $3, stock = $4, supplier_id = $5 WHERE id = $6 RETURNING *',
            [name, category, price, stock, supplier_id, id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const deleteProduct = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM products WHERE id = $1', [id]);
        res.json({ message: 'Deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// --- ORDERS ---
export const getOrders = async (req: Request, res: Response) => {
    try {
        const result = await pool.query(`
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
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const createOrder = async (req: Request, res: Response) => {
    const { customer_id, status, items } = req.body;
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');
        
        // 1. Insert order
        const orderResult = await client.query(
            'INSERT INTO orders (customer_id, status) VALUES ($1, $2) RETURNING id',
            [customer_id, status || 'new']
        );
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
                await client.query(
                    'UPDATE products SET stock = stock - $1 WHERE id = $2',
                    [item.quantity, item.product_id]
                );
            }
            
            await client.query(
                `INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES ${values.join(', ')}`,
                flatValues
            );
        }
        
        await client.query('COMMIT');
        res.status(201).json({ id: orderId });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        client.release();
    }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        await pool.query('UPDATE orders SET status = $1 WHERE id = $2', [status, id]);
        res.json({ message: 'Updated' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const deleteOrder = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM orders WHERE id = $1', [id]);
        res.json({ message: 'Deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
