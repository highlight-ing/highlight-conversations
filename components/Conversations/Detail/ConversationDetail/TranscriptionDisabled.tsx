import React from 'react'
import SoundIcon from '../Icon/SoundIcon'
import ShieldTickIcon from '../Icon/ShieldTickIcon'
import CalendarIcon from '../Icon/CalendarIcon'
import VideoPlayIcon from '../Icon/VideoPlayIcon'
import MicrophoneIcon from '../Icon/MicrophoneIcon'
import BigSoundIcon from '../Icon/BigSoundIcon'
import getSoundIconColor from '../../Panel/ActiveConversationComponent'


const TranscriptionDisabled: React.FC = () => (
    <div className="h-[900px] relative bg-[#0f0f0f]">
        <div className="left-[84px] top-[48px] absolute justify-start items-center gap-[13px] inline-flex">
            <div className="w-8 h-8 justify-center items-center flex">
                <div className="w-8 h-8 relative">
                    <BigSoundIcon />
                </div>
            </div>
            <div className="text-white text-2xl font-semibold font-inter leading-[31px]">Highlight Audio Transcription</div>
        </div>
        <div className="w-[624px] left-[84px] top-[104px] absolute text-[#484848] text-[15px] font-normal font-inter leading-normal">
            Highlight only captures audio for text-to-speech transcription
        </div>

        { /* first box */ }
        <div className="h-[168px] p-5 left-[64px] top-[176px] absolute rounded-[22px] border border-[#222222]/50 flex-col justify-start items-start gap-4 inline-flex">
            <div className="w-[673px] h-6 justify-between items-start inline-flex">
                <div className="pr-[378px] justify-start items-center flex">
                    <div className="self-stretch pl-0.5 justify-start items-center gap-4 inline-flex">
                    <div className="w-6 h-6 justify-center items-center flex">
                    <div className="w-6 h-6 relative">
                        <ShieldTickIcon />
                    </div>
                    </div>
                        <div className="text-[#eeeeee] text-[15px] font-medium font-inter leading-normal">
                            Local first and totally private to you
                        </div>
                    </div>
                </div>
        </div>
        <div className="self-stretch pt-4 border-t border-white/0 justify-start items-center gap-2.5 inline-flex">
            <div className="w-[672px] text-[#6e6e6e] text-[15px] font-normal font-inter leading-normal">
                <ul className="list-disc pl-6">
                    <li>No audio is captured or stored anywhere</li>
                    <li>All transcriptions happen on your computer and cannot be seen or accessed by anyone</li>
                    <li>No data is passed to AIs unless you attach them to a chat</li>
                </ul>
            </div>
        </div>
    </div>

    {/* second box */}
    <div className="h-36 p-5 left-[64px] top-[368px] absolute rounded-[22px] border border-[#222222]/50 flex-col justify-start items-start gap-4 inline-flex">
        <div className="w-[673px] h-6 justify-between items-start inline-flex">
            <div className="pr-[367px] justify-start items-center flex">
                <div className="self-stretch pl-0.5 justify-start items-center gap-4 inline-flex">
                <div className="w-6 h-6 justify-center items-center flex">
                    <div className="w-6 h-6 relative">
                        <CalendarIcon />
                    </div>
                </div>
                    <div className="text-[#b4b4b4] text-[15px] font-medium font-inter leading-normal">
                        Automatically capture meeting notes
                    </div>
                </div>
            </div>
        </div>
        <div className="self-stretch pt-4 border-t border-white/0 justify-start items-center gap-2.5 inline-flex">
            <div className="w-[672px] text-[#6e6e6e] text-[15px] font-normal font-inter leading-normal">
                Highlight automatically detects when your meetings are happening and gets you automatic meeting notes that are totally private to you by default and shareable with a click.
            </div>
        </div>
    </div>

    { /* third box */ }
    <div className="h-36 p-5 left-[64px] top-[536px] absolute rounded-[22px] border border-[#222222]/50 flex-col justify-start items-start gap-4 inline-flex">
        <div className="w-[673px] h-6 justify-between items-start inline-flex">
            <div className="pr-[339px] justify-start items-center flex">
                <div className="self-stretch pl-0.5 justify-start items-center gap-4 inline-flex">
                <div className="w-6 h-6 justify-center items-center flex">

                <div className="w-6 h-6 relative">
                    <VideoPlayIcon />
                </div>
                </div>
                    <div className="text-[#b4b4b4] text-[15px] font-medium font-inter leading-normal">
                        Transcribe podcasts and youtube videos
                    </div>
                </div>
        </div>
        </div>
        <div className="self-stretch pt-4 border-t border-white/0 justify-start items-center gap-2.5 inline-flex">
            <div className="w-[672px] text-[#6e6e6e] text-[15px] font-normal font-inter leading-normal">
                With audio transcription enabled, Highlight will automatically capture and transcribe anything you’re listening to so you can chat with it using Highlight AI.
            </div>
        </div>
    </div>

    { /* fourth box */ }
    <div className="h-36 p-5 left-[64px] top-[704px] absolute rounded-[22px] border border-[#222222]/50 flex-col justify-start items-start gap-4 inline-flex">
        <div className="w-[673px] h-6 justify-between items-start inline-flex">
            <div className="pr-[357px] justify-start items-center flex">
                <div className="self-stretch pl-0.5 justify-start items-center gap-4 inline-flex">
                    <div className="w-6 h-6 justify-center items-center flex">
                        <div className="w-6 h-6 relative">
                            <MicrophoneIcon />
                        </div>
                    </div>
                <div className="text-[#b4b4b4] text-[15px] font-medium font-inter leading-normal">Capture lecture notes and voice notes </div>
                </div>
            </div>
        </div>
        <div className="self-stretch pt-4 border-t border-white/0 justify-start items-center gap-2.5 inline-flex">
            <div className="w-[672px] text-[#6e6e6e] text-[15px] font-normal font-inter leading-normal">
                Capture your microphone audio to capture lecture notes, in person conversations, and voice notes that you can instantly chat with and format with Highlight AI.
            </div>
        </div>
    </div>

</div>
)

export default TranscriptionDisabled
