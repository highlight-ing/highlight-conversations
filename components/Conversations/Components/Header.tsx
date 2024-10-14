import React from 'react';
import { panelFormatDate } from '@/data/conversations';
import FlashIcon from '../Detail/Icon/flash';
import TrashIcon from '../Detail/Icon/trash';
import ClipboardTextIcon from '../Detail/Icon/clipboard-text';
import { formatTimestamp, getRelativeTimeString } from '@/utils/dateUtils'

interface HeaderProps {
    title: string;
    startedAt: Date;
    endedAt: Date;
}

const Header: React.FC<HeaderProps> = ({ title, startedAt, endedAt }) => {
    return (
        <div
            className="relative max-w-full h-[48px] border-b border-black mb-4"
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px', 
                padding: '8px 16px',
                boxSizing: 'border-box',
                overflow: 'hidden', 
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
            <div style={{ flexGrow: 1, minWidth: '0' }}>
                <h1
                    className="font-inter text-[13px] font-medium"
                    style={{
                        color: 'var(--White, #FFF)',
                        lineHeight: '1.2',
                        margin: '0',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap', 
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

            {/* Icons on the right, aligned horizontally */}
            <div
                style={{
                    display: 'flex',
                    gap: '12px', 
                    marginLeft: 'auto',
                    flexShrink: 0, 
                }}
            >
                <ClipboardTextIcon />
                <TrashIcon />
                <FlashIcon />
            </div>
        </div>
    );
};

export default Header;
