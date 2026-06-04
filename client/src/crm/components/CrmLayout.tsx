// src/crm/components/CrmLayout.tsx
// CRM qismi uchun umumiy Layout (Sidebar va asosiy qism).
import React from 'react';
import { CrmSidebar } from './Sidebar';

interface CrmLayoutProps {
  children: React.ReactNode;
}

export function CrmLayout({ children }: CrmLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <CrmSidebar />
      <div className="flex-1 ml-64 flex flex-col">
        <main className="p-8 flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
