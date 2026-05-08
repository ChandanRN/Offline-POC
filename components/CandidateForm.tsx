"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, updateDoc, doc, serverTimestamp } from "firebase/firestore";
import { PlusCircle, Loader2, Save, X } from "lucide-react";
import { Candidate } from "@/lib/types";

interface CandidateFormProps {
  editingCandidate: Candidate | null;
  onCancel: () => void;
  onSuccess: () => void;
}

export default function CandidateForm({ editingCandidate, onCancel, onSuccess }: CandidateFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    skills: "",
    experience: 0,
  });

  useEffect(() => {
    if (editingCandidate) {
      setFormData({
        name: editingCandidate.name,
        email: editingCandidate.email,
        phone: editingCandidate.phone,
        skills: editingCandidate.skills.join(", "),
        experience: editingCandidate.experience,
      });
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        skills: "",
        experience: 0,
      });
    }
  }, [editingCandidate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const skillsArray = formData.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill !== "");

      const candidateData: any = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        skills: skillsArray,
        experience: Number(formData.experience),
        updatedAt: serverTimestamp(),
      };

      if (editingCandidate) {
        await updateDoc(doc(db, "candidates", editingCandidate.id), candidateData);
        alert("Candidate updated successfully!");
      } else {
        candidateData.status = "active";
        candidateData.createdAt = serverTimestamp();
        candidateData.createdBy = "admin1";
        candidateData.offlineCreated = !window.navigator.onLine;
        candidateData.synced = window.navigator.onLine;
        
        await addDoc(collection(db, "candidates"), candidateData);
        alert("Candidate added successfully!");
      }

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        skills: "",
        experience: 0,
      });
      
      onSuccess();
    } catch (error) {
      console.error("Error saving candidate: ", error);
      alert(`Error ${editingCandidate ? 'updating' : 'adding'} candidate. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          {editingCandidate ? (
            <>
              <Save className="text-blue-600" size={20} />
              Edit Candidate
            </>
          ) : (
            <>
              <PlusCircle className="text-blue-600" size={20} />
              Add New Candidate
            </>
          )}
        </h2>
        {editingCandidate && (
          <button
            onClick={onCancel}
            className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
            title="Cancel Editing"
          >
            <X size={20} />
          </button>
        )}
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
            <input
              required
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
            <input
              required
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
            <input
              required
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="9876543210"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Experience (Years)</label>
            <input
              required
              type="number"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              min="0"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Skills (comma separated)</label>
          <input
            required
            type="text"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            placeholder="React, Node.js, TypeScript"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
        </div>
        <div className="flex gap-3">
          {editingCandidate && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className={`flex-[2] ${editingCandidate ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} text-white font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Processing...
              </>
            ) : (
              <>
                {editingCandidate ? <Save size={20} /> : <PlusCircle size={20} />}
                {editingCandidate ? "Update Candidate" : "Add Candidate"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
