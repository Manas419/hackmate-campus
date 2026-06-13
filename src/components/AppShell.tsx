'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { Menu, X } from 'lucide-react';

export default function AppShell({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex">
            {/* Mobile menu button */}
            <button
                className="fixed top-4 left-4 z-50 md:hidden btn-ghost p-2"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                aria-label="Toggle menu"
            >
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex-1 flex flex-col min-w-0">
                <Topbar />
                <main className="main-content flex-1 animate-fade-in">
                    {children}
                </main>
            </div>
        </div>
    );
}
