import Link from "next/link";
import { Users, Shield, Zap, Globe } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-4xl mx-auto px-6 py-24 sm:py-32">
        <div className="text-center">
          <div className="inline-flex items-center justify-center p-3 bg-blue-50 rounded-2xl text-blue-600 mb-8">
            <Users size={40} />
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-6xl mb-6">
            Firebase Offline <span className="text-blue-600">Candidate Management</span>
          </h1>
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
            A production-ready POC demonstrating Firestore's powerful offline persistence 
            with Next.js 14, Tailwind CSS, and TypeScript.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/candidates"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
            >
              Launch Dashboard
              <Zap size={20} />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
            <Globe className="text-blue-600 mb-4" size={24} />
            <h3 className="font-bold text-slate-900 mb-2">Offline-First</h3>
            <p className="text-slate-600 text-sm">Works seamlessly without internet using IndexedDB persistence.</p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
            <Shield className="text-blue-600 mb-4" size={24} />
            <h3 className="font-bold text-slate-900 mb-2">Auto Sync</h3>
            <p className="text-slate-600 text-sm">Pending records automatically sync to Firebase when back online.</p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
            <Zap className="text-blue-600 mb-4" size={24} />
            <h3 className="font-bold text-slate-900 mb-2">Real-time</h3>
            <p className="text-slate-600 text-sm">Instant UI updates using Firestore's onSnapshot listener.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
