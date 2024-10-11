import React from 'react';
import { panelFormatDate } from '@/data/conversations';

interface HeaderProps {
    title: string;
    startedAt: Date;
    endedAt: Date;
}

const Header: React.FC<HeaderProps> = ({ title, startedAt, endedAt }) => {
    return (
        <div
            className="relative w-[746px] h-[48px] border-b border-black mb-4"
            style={{
                display: 'flex',
                alignItems: 'center', 
                gap: '12px',
                padding: '8px 16px', 
                boxSizing: 'border-box',
            }}
        >
            <div
                style={{
                    width: '32px',
                    height: '32px',
                    flexShrink: 0,
                    borderRadius: '100px',
                    background: 'var(--neutrals-background-first-layer, #000)',
                }}
            />

            <div>
                <h1
                    className="font-inter text-[13px] font-medium"
                    style={{
                        color: 'var(--White, #FFF)',
                        lineHeight: '1.2',
                        margin: '0',
                    }}
                >
                    {title}
                </h1>
                <span
                    className="font-inter text-[13px] font-medium"
                    style={{
                        color: 'var(--White, #FFF)',
                        lineHeight: 'normal',
                        opacity: 0.3,
                        margin: '0',
                    }}
                >
                    {panelFormatDate(startedAt)} - {panelFormatDate(endedAt)}
                </span>
            </div>
        </div>
    );
};

export default Header;
