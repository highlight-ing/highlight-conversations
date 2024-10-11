import React from 'react'
import { panelFormatDate } from '@/data/conversations'

interface HeaderProps {
    title: string
    startedAt: Date
    endedAt: Date
}

const Header: React.FC<HeaderProps> = ({ title, startedAt, endedAt }) => {
    return (
        <div
            className="relative w-[746px] h-[48px] border-b border-black mb-4">
            <h1 className="font-inter text-[13px] font-medium" style={{
                color: 'var(--White, #FFF)',
                lineHeight: 'normal'
            }}>{title}</h1>
            <div className="flex items-center justify-between">
                <span
                    className="font-inter text-[13px] font-medium mt-1"
                    style={{
                        color: 'var(--White, #FFF)',
                        lineHeight: 'normal',
                        opacity: 0.3,
                    }}
                >
                    {panelFormatDate(startedAt)} - {panelFormatDate(endedAt)}
                </span>
            </div>
        </div>
    );
}

export default Header