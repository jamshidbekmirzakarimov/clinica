import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import { 
    FileText, 
    CheckCircle, 
    Clock,
    Loader2, 
    User, 
    Calendar, 
    Phone, 
    ClipboardList,
    Pill
} from 'lucide-react';
import { Modal } from '../../components/ui/Modal';

export function DoctorAppointments() {
    const { user } = useAuthStore();
    const [appointments, setAppointments] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedApt, setSelectedApt] = useState<any | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Diagnosis form state
    const [diagnosis, setDiagnosis] = useState('');
    const [medicine, setMedicine] = useState('');
    const [instructions, setInstructions] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        setIsLoading(true);
        try {
            const res = await api.get('/doctor/appointments');
            setAppointments(res.data.appointments);
        } catch (error) {
            toast.error('Failed to load appointments');
        } finally {
            setIsLoading(true); // Wait, should be false
            setIsLoading(false);
        }
    };

    const handleOpenModal = (apt: any) => {
        setSelectedApt(apt);
        setDiagnosis(apt.diagnosis || '');
        setMedicine(apt.prescription || '');
        setInstructions('');
        setIsModalOpen(true);
    };

    const handleSaveMedicalRecord = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedApt) return;

        setIsSaving(true);
        try {
            await api.post('/doctor/diagnosis', {
                appointment_id: selectedApt.appointment_id,
                description: diagnosis,
                medicine,
                instructions
            });
            toast.success('Medical record saved successfully!');
            setIsModalOpen(false);
            fetchAppointments(); // Refresh list
        } catch (error) {
            toast.error('Failed to save medical record');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-8 pb-10">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Appointments</h1>
                    <p className="text-slate-500 font-medium mt-1">Review patient history and record new diagnoses.</p>
                </div>
                <div className="bg-primary-50 px-4 py-2 rounded-2xl border border-primary-100 flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary-700">Live Schedule</span>
                </div>
            </div>

            {isLoading ? (
                <div className="py-20 flex flex-col items-center gap-4">
                    <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
                    <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Loading Patients...</p>
                </div>
            ) : appointments.length === 0 ? (
                <div className="bg-white rounded-3xl p-20 text-center border-2 border-dashed border-slate-200">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Calendar className="w-10 h-10 text-slate-200" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">No appointments today</h3>
                    <p className="text-slate-500 mt-2">Take a break or check back later.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {appointments.map((apt) => (
                        <div 
                            key={apt.appointment_id}
                            className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:border-primary-200 transition-all group relative overflow-hidden"
                        >
                            <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-5 transition-all group-hover:scale-150 ${apt.diagnosis ? 'bg-green-500' : 'bg-amber-500'}`} />
                            
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-primary-50 transition-colors">
                                    <User className="w-6 h-6 text-slate-400 group-hover:text-primary-600" />
                                </div>
                                <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${apt.diagnosis ? 'bg-green-50 text-green-700 border-green-100' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>
                                    {apt.diagnosis ? 'Completed' : 'Upcoming'}
                                </span>
                            </div>

                            <div className="space-y-1 mb-6">
                                <h3 className="text-xl font-black text-slate-800 leading-tight">{apt.patient_name}</h3>
                                <p className="text-slate-400 text-xs font-bold flex items-center gap-2">
                                    <Phone className="w-3 h-3" /> {apt.patient_phone}
                                </p>
                            </div>

                            <div className="space-y-3 py-4 border-t border-slate-50">
                                <div className="flex items-center gap-3 text-slate-600">
                                    <Calendar className="w-4 h-4 text-primary-500" />
                                    <span className="text-xs font-bold">{new Date(apt.appointment_time).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-600">
                                    <Clock className="w-4 h-4 text-primary-500" />
                                    <span className="text-xs font-bold">{new Date(apt.appointment_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                            </div>

                            <button 
                                onClick={() => handleOpenModal(apt)}
                                className={`w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm transition-all ${apt.diagnosis ? 'bg-slate-50 text-slate-600 hover:bg-slate-100' : 'bg-primary-600 text-white shadow-lg shadow-primary-500/20 hover:bg-primary-700'}`}
                            >
                                <FileText className="w-4 h-4" />
                                {apt.diagnosis ? 'View Details' : 'Start Consultation'}
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Clinical Consultation"
            >
                {selectedApt && (
                    <form onSubmit={handleSaveMedicalRecord} className="space-y-6">
                        <div className="bg-slate-50 p-6 rounded-3xl border-2 border-slate-100 flex items-center gap-6">
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100">
                                <User className="w-8 h-8 text-primary-500" />
                            </div>
                            <div>
                                <h4 className="font-black text-slate-800 text-lg">{selectedApt.patient_name}</h4>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{selectedApt.patient_age} Years • Patient ID: {selectedApt.patient_id}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                    <ClipboardList className="w-4 h-4" /> Diagnosis & Findings
                                </label>
                                <textarea
                                    required
                                    rows={4}
                                    value={diagnosis}
                                    onChange={(e) => setDiagnosis(e.target.value)}
                                    placeholder="Describe patient condition and findings..."
                                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl px-4 py-3 focus:bg-white focus:border-primary-500 outline-none transition-all text-sm font-medium"
                                    disabled={!!selectedApt.diagnosis}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                    <Pill className="w-4 h-4" /> Prescription (Medicine)
                                </label>
                                <input
                                    type="text"
                                    value={medicine}
                                    onChange={(e) => setMedicine(e.target.value)}
                                    placeholder="Medication name..."
                                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 focus:bg-white focus:border-primary-500 outline-none transition-all text-sm font-medium"
                                    disabled={!!selectedApt.diagnosis}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                    Instructions
                                </label>
                                <textarea
                                    rows={2}
                                    value={instructions}
                                    onChange={(e) => setInstructions(e.target.value)}
                                    placeholder="Dosage, frequency, etc..."
                                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 focus:bg-white focus:border-primary-500 outline-none transition-all text-sm font-medium"
                                    disabled={!!selectedApt.diagnosis}
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="flex-1 py-4 rounded-2xl font-bold text-slate-400 hover:bg-slate-50 transition-all"
                            >
                                Close
                            </button>
                            {!selectedApt.diagnosis && (
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="flex-[2] flex items-center justify-center gap-2 bg-slate-900 text-white py-4 rounded-2xl font-black hover:bg-black transition-all shadow-xl active:scale-95 disabled:opacity-50"
                                >
                                    {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
                                    Save & Complete
                                </button>
                            )}
                        </div>
                    </form>
                )}
            </Modal>
        </div>
    );
}