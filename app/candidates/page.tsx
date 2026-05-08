"use client";

import { useState } from "react";
import CandidateForm from "@/components/CandidateForm";
import CandidateTable from "@/components/CandidateTable";
import OfflineBanner from "@/components/OfflineBanner";
import { Users } from "lucide-react";
import { Candidate } from "@/lib/types";

export default function CandidatesPage() {
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);

  const handleEdit = (candidate: Candidate) => {
    setEditingCandidate(candidate);
    // Scroll to form on mobile
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingCandidate(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <OfflineBanner />
      
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 space-y-8">
        <header className="flex items-center gap-3">
          <div className="bg-blue-600 p-2.5 rounded-lg text-white shadow-lg shadow-blue-200">
            <Users size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Candidate Management</h1>
            <p className="text-slate-500 font-medium">Offline-first recruitment dashboard</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-4">
            <CandidateForm 
              editingCandidate={editingCandidate} 
              onCancel={handleCancelEdit} 
              onSuccess={() => setEditingCandidate(null)}
            />
          </div>

          {/* Table Section */}
          <div className="lg:col-span-8">
            <CandidateTable onEdit={handleEdit} />
          </div>
        </div>
      </main>

      <footer className="py-6 border-t border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center text-slate-400 text-sm font-medium">
          &copy; {new Date().getFullYear()} Candidate Management POC • Powered by Firebase Offline Persistence
        </div>
      </footer>
    </div>
  );
}
