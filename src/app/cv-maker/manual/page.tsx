"use client";

import React from 'react';
import CVEditor, { GENERIC_DATA } from '@/components/CVEditor';

export default function ManualCVPage() {
    return (
        <CVEditor initialData={GENERIC_DATA} />
    );
}
