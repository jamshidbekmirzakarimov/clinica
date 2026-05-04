import { Request, Response } from 'express';
import argon2 from 'argon2';
import pool from '../config/connection';
import { generateTokens, verifyRefreshToken } from '../utils/jwt';

export const register = async (req: Request, res: Response): Promise<any> => {
        const { fullname, email, password, role } = req.body;

        if (!fullname || !email || !password || !role) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        try {
            // Check if user exists
            const userCheck = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
            if (userCheck.rows.length > 0) {
                return res.status(409).json({ message: 'User already exists' });
            }

            // Hash password with argon2
            const hashedPassword = await argon2.hash(password);

            // Insert new user
            const result = await pool.query(
                'INSERT INTO users (fullname, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, fullname, email, role',
                [fullname, email, hashedPassword, role]
            );

        const newUser = result.rows[0];

        // Generate tokens
        const tokens = generateTokens(newUser.id, newUser.email);

        res.status(201).json({
            message: 'User registered successfully',
            user: newUser,
            tokens
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const login = async (req: Request, res: Response): Promise<any> => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        // Find user by email
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check if password hash is from argon2 or old plain dummy data.
        // The dummy data had 'hashed_password1'. Argon2 verify will fail on it, 
        // so we just try to verify and catch or handle it gracefully.
        try {
            const isMatch = await argon2.verify(user.password, password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
        } catch (err) {
            // If argon2.verify fails (e.g. dummy string without valid argon2 hash format)
            if (user.password !== password) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
        }

        // Generate tokens
        const tokens = generateTokens(user.id, user.email);

        // Return user data without password
        const { password: _, ...userData } = user;

        res.status(200).json({
            message: 'Login successful',
            user: userData,
            tokens
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const refresh = async (req: Request, res: Response): Promise<any> => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh token is required' });
    }

    try {
        const decoded: any = verifyRefreshToken(refreshToken);
        
        // Generate new tokens
        const tokens = generateTokens(decoded.id, decoded.email);

        res.status(200).json({
            message: 'Tokens refreshed successfully',
            tokens
        });
    } catch (error) {
        console.error('Refresh token error:', error);
        res.status(403).json({ message: 'Invalid or expired refresh token' });
    }
};

export const me = async (req: Request | any, res: Response): Promise<any> => {
    try {
        const userId = req.user.id;
        const result = await pool.query('SELECT id, fullname, email, role FROM users WHERE id = $1', [userId]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ user: result.rows[0] });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
