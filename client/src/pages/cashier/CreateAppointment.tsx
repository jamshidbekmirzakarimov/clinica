import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Stethoscope, ChevronRight, CheckCircle2, CreditCard, Loader2, ArrowLeft } from 'lucide-react';
import { Patient, Doctor, PaymentStatus } from '../../types';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export function CreateAppointment() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Data lists
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [schedule, setSchedule] = useState<any[]>([]);

  // Selection state
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [selectedSlotId, setSelectedSlotId] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('50000'); // Default price
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('paid');

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [pRes, dRes] = await Promise.all([
        api.get('/cashier/patients'),
        api.get('/cashier/doctors')
      ]);
      setPatients(pRes.data.patients);
      setDoctors(dRes.data.doctors);
    } catch (error) {
      toast.error('Failed to load initial data');
    }
  };

  const fetchDoctorSchedule = async (doctorId: string) => {
    setIsLoading(true);
    try {
      const res = await api.get(`/cashier/doctors/${doctorId}/schedule`);
      setSchedule(res.data.schedule.filter((s: any) => !s.is_booked));
    } catch (error) {
      toast.error('Failed to load doctor schedule');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDoctorSelect = (id: string) => {
    setSelectedDoctorId(id);
    setSelectedSlotId('');
    fetchDoctorSchedule(id);
  };

  const handleFinish = async () => {
    if (!selectedPatientId || !selectedDoctorId || !selectedSlotId) {
      toast.error('Please complete all steps');
      return;
    }

    setIsLoading(true);
    try {
      // 1. Create Appointment
      const slot = schedule.find(s => String(s.id) === selectedSlotId);
      const appRes = await api.post('/cashier/appointments', {
        doctor_id: parseInt(selectedDoctorId),
        patient_id: parseInt(selectedPatientId),
        appointment_time: slot.available_time
      });

      const appointmentId = appRes.data.appointment.id;

      // 2. Create Payment
      await api.post('/cashier/payments', {
        appointment_id: appointmentId,
        amount: parseFloat(paymentAmount),
        status: paymentStatus
      });

      toast.success('Appointment and Payment recorded successfully!');
      navigate('/cashier');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to complete process');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <div className="flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="flex items-center gap-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${step >= s ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30' : 'bg-slate-200 text-slate-500'}`}>
                {step > s ? <CheckCircle2 className="w-5 h-5" /> : s}
              </div>
              {s < 3 && <div className={`w-8 h-0.5 rounded ${step > s ? 'bg-primary-600' : 'bg-slate-200'}`} />}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        {/* STEP 1: PATIENT & DOCTOR */}
        {step === 1 && (
          <div className="p-8 space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-black text-slate-800">Assign Patient & Doctor</h2>
              <p className="text-slate-500 text-sm font-medium">Select who is visiting and which specialist they need.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                  <User className="w-4 h-4" /> Select Patient
                </label>
                <select
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:border-primary-500 outline-none transition-all appearance-none"
                >
                  <option value="">-- Choose Patient --</option>
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.phone})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-4">
                <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                  <Stethoscope className="w-4 h-4" /> Select Doctor
                </label>
                <select
                  value={selectedDoctorId}
                  onChange={(e) => handleDoctorSelect(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:border-primary-500 outline-none transition-all appearance-none"
                >
                  <option value="">-- Choose Specialist --</option>
                  {doctors.map(d => (
                    <option key={d.doctor_id} value={d.doctor_id}>{d.doctor_name} - {d.specialization}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                disabled={!selectedPatientId || !selectedDoctorId}
                onClick={() => setStep(2)}
                className="group flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-black transition-all shadow-xl active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Continue to Schedule <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: SCHEDULE */}
        {step === 2 && (
          <div className="p-8 space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-black text-slate-800">Choose Available Time</h2>
              <p className="text-slate-500 text-sm font-medium">Picking a slot for Dr. {doctors.find(d => String(d.doctor_id) === selectedDoctorId)?.doctor_name}</p>
            </div>

            {isLoading ? (
              <div className="py-20 flex flex-col items-center gap-4">
                <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
                <p className="text-slate-400 font-bold animate-pulse">Fetching doctor availability...</p>
              </div>
            ) : schedule.length === 0 ? (
              <div className="py-20 text-center space-y-4">
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto">
                  <Calendar className="w-10 h-10 text-red-300" />
                </div>
                <p className="text-slate-500 font-bold">No available slots found for this doctor.</p>
                <button onClick={() => setStep(1)} className="text-primary-600 font-bold hover:underline">Try another doctor</button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {schedule.map(slot => {
                   const date = new Date(slot.available_time);
                   const isSelected = selectedSlotId === String(slot.id);
                   return (
                     <button
                        key={slot.id}
                        onClick={() => setSelectedSlotId(String(slot.id))}
                        className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-1 ${isSelected ? 'bg-primary-600 border-primary-600 text-white shadow-lg shadow-primary-500/30 scale-105' : 'bg-slate-50 border-slate-100 text-slate-600 hover:border-primary-200 hover:bg-white'}`}
                     >
                        <span className="text-[10px] font-black uppercase opacity-60">{date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                        <span className="text-lg font-black">{date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        <span className="text-[9px] font-bold opacity-60">{date.toLocaleDateString(undefined, { weekday: 'short' })}</span>
                     </button>
                   );
                })}
              </div>
            )}

            <div className="flex justify-between pt-4">
              <button onClick={() => setStep(1)} className="px-8 py-4 rounded-2xl font-bold text-slate-400 hover:bg-slate-50 transition-all">Go Back</button>
              <button
                disabled={!selectedSlotId}
                onClick={() => setStep(3)}
                className="group flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-black transition-all shadow-xl active:scale-95 disabled:opacity-30"
              >
                Continue to Payment <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: PAYMENT */}
        {step === 3 && (
          <div className="p-8 space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
             <div className="text-center space-y-2">
              <h2 className="text-2xl font-black text-slate-800">Payment Details</h2>
              <p className="text-slate-500 text-sm font-medium">Finalize the appointment with payment information.</p>
            </div>

            <div className="bg-slate-50 rounded-3xl p-6 border-2 border-slate-100 flex flex-col md:flex-row items-center gap-6">
               <div className="flex-1 space-y-1 text-center md:text-left">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Summary</span>
                  <div className="text-slate-800">
                    <p className="font-black text-lg">{patients.find(p => String(p.id) === selectedPatientId)?.name}</p>
                    <p className="text-sm font-bold text-primary-600">{doctors.find(d => String(d.doctor_id) === selectedDoctorId)?.doctor_name}</p>
                    <p className="text-xs text-slate-500 mt-1 flex items-center justify-center md:justify-start gap-1 font-bold">
                      <Calendar className="w-3 h-3" /> {new Date(schedule.find(s => String(s.id) === selectedSlotId)?.available_time).toLocaleString()}
                    </p>
                  </div>
               </div>
               <div className="h-12 w-0.5 bg-slate-200 hidden md:block" />
               <div className="flex-1 w-full space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Amount (UZS)</label>
                    <div className="relative">
                      <CreditCard className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                      <input
                        type="number"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white border-2 border-slate-100 rounded-2xl font-bold text-slate-800 outline-none focus:border-primary-500 transition-all"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {['paid', 'pending'].map(s => (
                      <button
                        key={s}
                        onClick={() => setPaymentStatus(s as PaymentStatus)}
                        className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${paymentStatus === s ? 'bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-900/20' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
               </div>
            </div>

            <div className="flex justify-between pt-4">
              <button onClick={() => setStep(2)} className="px-8 py-4 rounded-2xl font-bold text-slate-400 hover:bg-slate-50 transition-all">Go Back</button>
              <button
                disabled={isLoading || !paymentAmount}
                onClick={handleFinish}
                className="flex items-center gap-2 bg-primary-600 text-white px-10 py-4 rounded-2xl font-black hover:bg-primary-700 transition-all shadow-xl shadow-primary-500/30 active:scale-95 disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                Confirm & Create
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="text-center text-slate-400 text-xs font-bold uppercase tracking-widest">
        Clinica CRM - Secure Transaction System
      </div>
    </div>
  );
}