import { Router } from 'express';
import { getDoctorAppointments, addDiagnosisAndPrescription } from '../controllers/doctor.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { authorizeDoctor } from '../middleware/role.middleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Doctor - Appointments
 *     description: Operations for doctors to view their appointments and add diagnosis
 */

/**
 * @swagger
 * /api/doctor/appointments:
 *   get:
 *     summary: Get appointments for the logged-in doctor
 *     tags: [Doctor - Appointments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of appointments
 */
router.get('/appointments', authenticateToken, authorizeDoctor, getDoctorAppointments);

/**
 * @swagger
 * /api/doctor/diagnosis:
 *   post:
 *     summary: Add diagnosis and prescription for an appointment
 *     tags: [Doctor - Appointments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - appointment_id
 *               - description
 *             properties:
 *               appointment_id:
 *                 type: integer
 *               description:
 *                 type: string
 *               medicine:
 *                 type: string
 *               instructions:
 *                 type: string
 *     responses:
 *       201:
 *         description: Diagnosis and prescription added
 */
router.post('/diagnosis', authenticateToken, authorizeDoctor, addDiagnosisAndPrescription);

export default router;
