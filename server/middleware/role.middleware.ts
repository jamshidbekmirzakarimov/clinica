import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';
import pool from '../config/connection';

export const authorizeAdmin = async (req: AuthRequest, res: Response, next: NextFunction): Promise<any> => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const result = await pool.query('SELECT role FROM users WHERE id = $1', [userId]);
        
        if (result.rows.length === 0 || result.rows[0].role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Only admins can perform this action.' });
        }

        next();
    } catch (error) {
        console.error('Role authorization error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const authorizeCashier = async (req: AuthRequest, res: Response, next: NextFunction): Promise<any> => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const result = await pool.query('SELECT role FROM users WHERE id = $1', [userId]);
        
        if (result.rows.length === 0 || (result.rows[0].role !== 'cashier' && result.rows[0].role !== 'admin')) {
            return res.status(403).json({ message: 'Access denied. This action is restricted to cashiers and admins.' });
        }

        next();
    } catch (error) {
        console.error('Role authorization error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
export const authorizeDoctor = async (req: AuthRequest, res: Response, next: NextFunction): Promise<any> => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const result = await pool.query('SELECT role FROM users WHERE id = $1', [userId]);
        
        if (result.rows.length === 0 || (result.rows[0].role !== 'doctor' && result.rows[0].role !== 'admin')) {
            return res.status(403).json({ message: 'Access denied. This action is restricted to doctors and admins.' });
        }

        next();
    } catch (error) {
        console.error('Role authorization error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
