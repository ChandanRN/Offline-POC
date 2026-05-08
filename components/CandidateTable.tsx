"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy, doc, deleteDoc } from "firebase/firestore";
import { CheckCircle2, Clock, Mail, Phone, Briefcase, Edit2, Trash2 } from "lucide-react";
import { Candidate } from "@/lib/types";

interface CandidateTableProps {
  onEdit: (candidate: Candidate) => void;
}

export default function CandidateTable({ onEdit }: CandidateTableProps) {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this candidate?")) {
      try {
        await deleteDoc(doc(db, "candidates", id));
        // No need to manually update state as onSnapshot will handle it
      } catch (error) {
        console.error("Error deleting candidate: ", error);
        alert("Error deleting candidate. Please try again.");
      }
    }
  };

  useEffect(() => {
    const q = query(collection(db, "candidates"), orderBy("createdAt", "desc"));

    // Use onSnapshot for realtime updates and offline support
    const unsubscribe = onSnapshot(
      q, 
      { includeMetadataChanges: true }, // This is key for detecting pending sync
      (snapshot) => {
        const candidateData: Candidate[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            // metadata.hasPendingWrites is true if the document has local changes that haven't been synced to the server
            hasPendingWrites: doc.metadata.hasPendingWrites,
          } as Candidate;
        });
        setCandidates(candidateData);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching candidates: ", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-sm font-semibold text-slate-600 uppercase tracking-wider">Candidate</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600 uppercase tracking-wider">Contact</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600 uppercase tracking-wider">Experience</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600 uppercase tracking-wider">Skills</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600 uppercase tracking-wider">Sync Status</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {candidates.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-slate-500 italic">
                  No candidates found. Add your first candidate above.
                </td>
              </tr>
            ) : (
              candidates.map((candidate) => (
                <tr key={candidate.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{candidate.name}</div>
                    <div className="text-xs text-slate-500 mt-1 uppercase tracking-tighter">ID: {candidate.id.substring(0, 8)}...</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-sm text-slate-600">
                        <Mail size={14} className="text-slate-400" />
                        {candidate.email}
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-slate-600">
                        <Phone size={14} className="text-slate-400" />
                        {candidate.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-sm text-slate-700 font-medium">
                      <Briefcase size={14} className="text-slate-400" />
                      {candidate.experience} {candidate.experience === 1 ? 'Year' : 'Years'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {candidate.skills.map((skill, index) => (
                        <span 
                          key={index} 
                          className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-100"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {candidate.hasPendingWrites ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                        <Clock size={12} className="animate-pulse" />
                        Pending Sync
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
                        <CheckCircle2 size={12} />
                        Synced
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onEdit(candidate)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit Candidate"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(candidate.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Candidate"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
