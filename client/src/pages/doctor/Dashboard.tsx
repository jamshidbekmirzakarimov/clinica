import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { StatsCard } from '../../components/ui/StatsCard';
import { Calendar, Users, Clock, Loader2, ArrowRight } from 'lucide-react';
import api from '../../utils/api';
import { Link } from 'react-router-dom';

export function DoctorDashboard() {
  const { user } = useAuthStore();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/doctor/appointments');
      setAppointments(res.data.appointments);
    } catch (error) {
      console.error('Failed to fetch doctor dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter(a => a.appointment_time.startsWith(today));
  const pendingAppointments = appointments.filter(a => !a.diagnosis);
  const totalPatients = new Set(appointments.map(a => a.patient_id)).size;

  if (isLoading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
        <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Preparing Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Welcome, Dr. {user?.fullname}
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            You have {todayAppointments.length} appointments scheduled for today.
          </p>
        </div>
        <Link 
            to="/doctor/appointments" 
            className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-black transition-all shadow-lg active:scale-95 text-sm"
        >
            View My Schedule <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Today's Appointments"
          value={todayAppointments.length}
          icon={Calendar}
          color="blue"
        />
        <StatsCard
          title="Pending Consultation"
          value={pendingAppointments.length}
          icon={Clock}
          color="amber"
        />
        <StatsCard
          title="Total Patients Seen"
          value={totalPatients}
          icon={Users}
          color="green"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
                <h2 className="text-lg font-black text-slate-800 tracking-tight">Today's Schedule</h2>
                <span className="px-3 py-1 bg-primary-50 text-primary-700 text-[10px] font-black uppercase rounded-full">Real-time</span>
            </div>
            <div className="p-0">
                {todayAppointments.length > 0 ? (
                    <div className="divide-y divide-slate-50">
                        {todayAppointments.map((apt) => (
                            <div key={apt.appointment_id} className="px-8 py-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-slate-100 rounded-2xl flex flex-col items-center justify-center">
                                        <span className="text-[10px] font-black text-slate-400 uppercase leading-none">
                                            {new Date(apt.appointment_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).split(' ')[1]}
                                        </span>
                                        <span className="text-sm font-black text-slate-800">
                                            {new Date(apt.appointment_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).split(' ')[0]}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-800">{apt.patient_name}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{apt.patient_phone}</p>
                                    </div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${apt.diagnosis ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                                    {apt.diagnosis ? 'Done' : 'Waiting'}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-16 text-center">
                        <Calendar className="w-10 h-10 text-slate-100 mx-auto mb-4" />
                        <p className="text-slate-400 font-bold text-sm">No more appointments for today.</p>
                    </div>
                )}
            </div>
        </div>

        <div className="bg-slate-900 rounded-3xl p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500 rounded-full -mr-32 -mt-32 opacity-20 transition-all group-hover:scale-125" />
            <div className="relative z-10 space-y-6">
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-xl">
                    <Users className="w-8 h-8 text-white" />
                </div>
                <div>
                    <h3 className="text-2xl font-black text-white leading-tight">Fast Clinical<br />Operations</h3>
                    <p className="text-slate-400 font-medium mt-2 text-sm">
                        Record diagnoses and prescriptions instantly. Your patients can see them as soon as you save.
                    </p>
                </div>
                <button className="bg-white text-slate-900 px-6 py-3 rounded-2xl font-bold hover:bg-primary-400 transition-all text-sm">
                    Open Patient History
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}