import React from 'react';
import { panelFormatDate } from '@/data/conversations';
import FlashIcon from '../Detail/Icon/flash';
// TODO: Need to think about locations of icons 
import TrashIcon from '../Detail/Icon/trash';
import ClipboardTextIcon from '../Detail/Icon/clipboard-text';

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
            {/* Icon on the left */}
            <div
                style={{
                    width: '32px',
                    height: '32px',
                    flexShrink: 0,
                    borderRadius: '100px',
                    background: 'var(--neutrals-background-first-layer, #000)',
                }}
            />

            {/* Title and Date Information */}
            <div style={{ flexGrow: 1 }}>
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

            {/* Flash Icon (on the right) */}
            <div style={{
                    display: 'flex',
                    gap: '12px', 
                    marginLeft: 'auto', 
                }}>
                <ClipboardTextIcon />
                <TrashIcon />
                <FlashIcon />
            </div>
        </div>
    );
};

export default Header;