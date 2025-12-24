'use client';

import CVEditor, { GENERIC_DATA } from '@/components/CVEditor';
import Link from 'next/link';

export default function CVMakerPage() {
    return (
        <div className="bg-black min-h-screen">
            <CVEditor initialData={GENERIC_DATA} />

            {/* Floating Back Button for Mobile/Desktop */}
            <Link
                href="/"
                className="fixed bottom-6 left-6 z-[80] p-4 bg-black/80 hover:bg-grow hover:text-black border border-white/20 hover:border-grow text-white rounded-full shadow-2xl backdrop-blur-md transition-all duration-300 group"
                title="Volver a Grow Labs"
            >
                <i className="fas fa-home text-lg group-hover:scale-110 transition-transform"></i>
            </Link>
        </div>
    );
}
