import { Request, Response } from 'express';
import pool from '../config/connection';
import { AuthRequest } from '../middleware/auth.middleware';

export const getDoctorAppointments = async (req: AuthRequest, res: Response): Promise<any> => {
    const userId = req.user?.id;

    try {
        // First get the doctor_id from user_id
        const doctorRes = await pool.query('SELECT id FROM doctors WHERE user_id = $1', [userId]);
        if (doctorRes.rows.length === 0) {
            return res.status(404).json({ message: 'Doctor profile not found' });
        }
        const doctorId = doctorRes.rows[0].id;

        const query = `
            SELECT 
                a.id as appointment_id,
                a.appointment_time,
                p.id as patient_id,
                p.name as patient_name,
                p.age as patient_age,
                p.phone as patient_phone,
                d.description as diagnosis,
                pr.medicine as prescription
            FROM appointment a
            JOIN patients p ON a.patient_id = p.id
            LEFT JOIN diagnosis d ON a.id = d.appointment_id
            LEFT JOIN prescription pr ON d.id = pr.diagnosis_id
            WHERE a.doctor_id = $1
            ORDER BY a.appointment_time DESC
        `;
        const result = await pool.query(query, [doctorId]);
        res.status(200).json({ appointments: result.rows });
    } catch (error) {
        console.error('Get doctor appointments error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const addDiagnosisAndPrescription = async (req: AuthRequest, res: Response): Promise<any> => {
    const { appointment_id, description, medicine, instructions } = req.body;

    if (!appointment_id || !description) {
        return res.status(400).json({ message: 'Appointment ID and description are required' });
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // 1. Create Diagnosis
        const diagRes = await client.query(
            'INSERT INTO diagnosis (appointment_id, description) VALUES ($1, $2) RETURNING id',
            [appointment_id, description]
        );
        const diagnosisId = diagRes.rows[0].id;

        // 2. Create Prescription (if provided)
        if (medicine) {
            await client.query(
                'INSERT INTO prescription (diagnosis_id, medicine, instructions) VALUES ($1, $2, $3)',
                [diagnosisId, medicine, instructions || '']
            );
        }

        await client.query('COMMIT');
        res.status(201).json({ message: 'Diagnosis and prescription recorded successfully' });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Add diagnosis error:', error);
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        client.release();
    }
};
