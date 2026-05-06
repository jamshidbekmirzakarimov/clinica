import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, X, Plus } from 'lucide-react';

interface ScheduleManagerProps {
  slots: string[];
  onChange: (slots: string[]) => void;
}

const COMMON_TIMES = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
];

export function ScheduleManager({ slots, onChange }: ScheduleManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [customTime, setCustomTime] = useState('09:00');

  const handleAddSlot = (time: string) => {
    if (!selectedDate) {
      alert('Please select a date first');
      return;
    }
    
    // Create a local date string to avoid timezone shifts
    // Format: YYYY-MM-DDTHH:mm:00
    const timestamp = `${selectedDate}T${time}:00`;
    
    if (!slots.includes(timestamp)) {
      const updatedSlots = [...slots, timestamp].sort();
      onChange(updatedSlots);
    }
  };

  const handleRemoveSlot = (slot: string) => {
    onChange(slots.filter(s => s !== slot));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-primary-600" /> 
          Doctor's Schedule (Timestamps)
        </h3>
        <button
          type="button"
          onClick={() => setIsAdding(!isAdding)}
          className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${isAdding ? 'bg-slate-100 text-slate-500' : 'bg-primary-600 text-white shadow-md hover:bg-primary-700'}`}
        >
          {isAdding ? 'Close Picker' : '+ Add Slots'}
        </button>
      </div>

      {isAdding && (
        <div className="bg-white border-2 border-primary-50 rounded-2xl p-5 shadow-xl space-y-5 animate-in fade-in zoom-in-95 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-2">
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">1. Pick a Day</label>
                <div className="relative group">
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-medium focus:bg-white focus:border-primary-500 outline-none transition-all group-hover:border-slate-200"
                  />
                  <CalendarIcon className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                </div>
             </div>

             <div className="space-y-2">
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">2. Set Exact Time</label>
                <div className="flex gap-2">
                  <div className="relative flex-1 group">
                    <input
                      type="time"
                      value={customTime}
                      onChange={(e) => setCustomTime(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-medium focus:bg-white focus:border-primary-500 outline-none transition-all group-hover:border-slate-200"
                    />
                    <Clock className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAddSlot(customTime)}
                    className="bg-slate-900 text-white px-5 py-3 rounded-xl text-sm font-bold hover:bg-black transition-all shadow-lg active:scale-95"
                  >
                    Add
                  </button>
                </div>
             </div>
          </div>
          
          <div className="space-y-3">
             <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 text-center">Quick Select Popular Times</label>
             <div className="flex flex-wrap justify-center gap-2">
                {['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'].map(time => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => handleAddSlot(time)}
                    className="py-2 px-4 text-xs font-bold bg-slate-50 text-slate-600 rounded-full border-2 border-slate-100 hover:border-primary-500 hover:bg-white hover:text-primary-600 transition-all active:scale-90"
                  >
                    {time}
                  </button>
                ))}
             </div>
          </div>
        </div>
      )}

      <div className="bg-slate-50/50 rounded-2xl p-4 border-2 border-slate-100/50">
        {slots.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm">
               <Clock className="w-6 h-6 text-slate-300" />
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">No time slots added</p>
          </div>
        ) : (
          <div className="space-y-4">
             <div className="flex items-center justify-between px-1">
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{slots.length} Active Slots</span>
                <button 
                  type="button"
                  onClick={() => onChange([])}
                  className="text-[10px] font-black text-red-400 hover:text-red-600 uppercase tracking-widest"
                >
                  Clear All
                </button>
             </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
              {slots.map((slot) => {
                const [datePart, timePart] = slot.split('T');
                return (
                  <div key={slot} className="group bg-white border-2 border-slate-100 p-3 rounded-xl flex items-center justify-between shadow-sm hover:border-primary-100 hover:shadow-md transition-all">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary-50 p-2 rounded-lg">
                        <Clock className="w-4 h-4 text-primary-600" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-800">{timePart.substring(0, 5)}</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase">{new Date(datePart).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                      </div>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => handleRemoveSlot(slot)}
                      className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
