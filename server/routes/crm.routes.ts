import { Router } from 'express';
import {
    getSuppliers, createSupplier, updateSupplier, deleteSupplier,
    getCustomers, createCustomer, updateCustomer, deleteCustomer,
    getProducts, createProduct, updateProduct, deleteProduct,
    getOrders, createOrder, updateOrderStatus, deleteOrder
} from '../controllers/crm.controller';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: CRM
 *   description: Omborxona va CRM operatsiyalari
 */

/**
 * @swagger
 * /api/crm/suppliers:
 *   get:
 *     summary: Barcha yetkazib beruvchilarni olish
 *     tags: [CRM]
 *     responses:
 *       200:
 *         description: Muvaffaqiyatli
 */
router.get('/suppliers', getSuppliers);
router.post('/suppliers', createSupplier);
router.put('/suppliers/:id', updateSupplier);
router.delete('/suppliers/:id', deleteSupplier);

/**
 * @swagger
 * /api/crm/customers:
 *   get:
 *     summary: Barcha mijozlarni olish
 *     tags: [CRM]
 *     responses:
 *       200:
 *         description: Muvaffaqiyatli
 */
router.get('/customers', getCustomers);
router.post('/customers', createCustomer);
router.put('/customers/:id', updateCustomer);
router.delete('/customers/:id', deleteCustomer);

/**
 * @swagger
 * /api/crm/products:
 *   get:
 *     summary: Barcha mahsulotlarni olish
 *     tags: [CRM]
 *     responses:
 *       200:
 *         description: Muvaffaqiyatli
 */
router.get('/products', getProducts);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

/**
 * @swagger
 * /api/crm/orders:
 *   get:
 *     summary: Barcha buyurtmalarni olish
 *     tags: [CRM]
 *     responses:
 *       200:
 *         description: Muvaffaqiyatli
 */
router.get('/orders', getOrders);
router.post('/orders', createOrder);
router.put('/orders/:id/status', updateOrderStatus);
router.delete('/orders/:id', deleteOrder);

export default router;
