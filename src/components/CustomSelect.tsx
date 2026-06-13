'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface Option {
    value: string;
    label: string;
}

interface CustomSelectProps {
    value: string;
    onChange: (value: string) => void;
    options: Option[];
    placeholder?: string;
    id?: string;
    style?: React.CSSProperties;
    className?: string;
}

export default function CustomSelect({
    value,
    onChange,
    options,
    placeholder = 'Select...',
    id,
    style,
    className = '',
}: CustomSelectProps) {
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedLabel = options.find((o) => o.value === value)?.label;

    // Close when clicking outside
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // Keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') { setOpen(false); return; }
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen((o) => !o); return; }
        if (e.key === 'ArrowDown' && open) {
            const idx = options.findIndex((o) => o.value === value);
            const next = options[Math.min(idx + 1, options.length - 1)];
            if (next) onChange(next.value);
        }
        if (e.key === 'ArrowUp' && open) {
            const idx = options.findIndex((o) => o.value === value);
            const prev = options[Math.max(idx - 1, 0)];
            if (prev) onChange(prev.value);
        }
    };

    return (
        <div
            ref={containerRef}
            id={id}
            style={{ position: 'relative', ...style }}
            className={className}
        >
            {/* Trigger button */}
            <button
                type="button"
                className="input-field"
                onClick={() => setOpen((o) => !o)}
                onKeyDown={handleKeyDown}
                aria-haspopup="listbox"
                aria-expanded={open}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    textAlign: 'left',
                    userSelect: 'none',
                }}
            >
                <span style={{ color: selectedLabel ? 'var(--text-primary)' : 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {selectedLabel || placeholder}
                </span>
                <ChevronDown
                    size={15}
                    style={{
                        color: 'var(--accent-indigo)',
                        flexShrink: 0,
                        marginLeft: 8,
                        transition: 'transform 0.2s',
                        transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                />
            </button>

            {/* Dropdown panel */}
            {open && (
                <ul
                    role="listbox"
                    style={{
                        position: 'absolute',
                        top: 'calc(100% + 6px)',
                        left: 0,
                        right: 0,
                        zIndex: 200,
                        background: '#0d1421',
                        border: '1px solid rgba(99,102,241,0.35)',
                        borderRadius: 12,
                        boxShadow: '0 16px 48px rgba(0,0,0,0.7)',
                        maxHeight: 260,
                        overflowY: 'auto',
                        padding: '0.375rem',
                        margin: 0,
                        listStyle: 'none',
                        animation: 'fadeIn 0.12s ease',
                    }}
                >
                    {options.map((option) => {
                        const isSelected = option.value === value;
                        return (
                            <li
                                key={option.value}
                                role="option"
                                aria-selected={isSelected}
                                onClick={() => { onChange(option.value); setOpen(false); }}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '0.55rem 0.875rem',
                                    borderRadius: 8,
                                    cursor: 'pointer',
                                    fontSize: '0.875rem',
                                    fontWeight: isSelected ? 600 : 400,
                                    color: isSelected ? 'white' : 'var(--text-secondary)',
                                    background: isSelected ? 'var(--accent-indigo)' : 'transparent',
                                    transition: 'background 0.12s, color 0.12s',
                                }}
                                onMouseEnter={(e) => {
                                    if (!isSelected) {
                                        (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)';
                                        (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isSelected) {
                                        (e.currentTarget as HTMLElement).style.background = 'transparent';
                                        (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
                                    }
                                }}
                            >
                                {option.label}
                                {isSelected && <Check size={13} style={{ color: 'var(--accent-indigo)', flexShrink: 0 }} />}
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}
