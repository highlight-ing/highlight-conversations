import React from 'react';

const SettingsPage: React.FC = () => {
  return (
    <>
      <div className="w-[467px] h-[137px] flex-col justify-start items-center gap-px inline-flex">
        <div className="self-stretch pl-6 pr-3 py-3 bg-white/0 rounded-tl-2xl rounded-tr-2xl justify-between items-center inline-flex">
          <div className="text-[#eeeeee] text-[15px] font-medium font-inter leading-normal">Auto Save</div>
          <div className="px-4 py-1.5 bg-white/10 rounded-[10px] justify-center items-center gap-2 flex">
            <div className="text-[#b4b4b4] text-[15px] font-medium font-inter leading-tight">After 2 Minutes</div>
          </div>
        </div>
        <div className="self-stretch px-6 py-4 bg-white/0 rounded-bl-2xl rounded-br-2xl justify-start items-center gap-2.5 inline-flex">
          <div className="grow shrink basis-0 opacity-50 text-[#b4b4b4] text-[15px] font-normal font-inter leading-normal">
            Highlight will automatically save your conversation transcript after this duration of silence
          </div>
        </div>
      </div>

      <div className="h-14 pl-6 pr-3 py-3 bg-white/0 rounded-tl-2xl rounded-tr-2xl justify-between items-center inline-flex">
        <div className="text-[#eeeeee] text-[15px] font-medium font-inter leading-normal">Auto Clear</div>
        <div className="px-4 py-1.5 bg-white/10 rounded-[10px] justify-center items-center gap-2 flex">
          <div className="text-[#b4b4b4] text-[15px] font-medium font-inter leading-tight">Every 2 Weeks</div>
        </div>
      </div>

      <div className="w-[467px] h-[161px] flex-col justify-start items-center gap-px inline-flex">
        <div className="self-stretch pl-6 pr-3 py-3 bg-white/0 rounded-tl-2xl rounded-tr-2xl justify-between items-center inline-flex">
          <div className="text-[#eeeeee] text-[15px] font-medium font-inter leading-normal">Audio Transcript Duration</div>
          <div className="px-4 py-1.5 bg-white/10 rounded-[10px] justify-center items-center gap-2 flex">
            <div className="text-[#b4b4b4] text-[15px] font-medium font-inter leading-tight">8 Hours</div>
          </div>
        </div>
        <div className="self-stretch px-6 py-4 bg-white/0 rounded-bl-2xl rounded-br-2xl justify-start items-center gap-2.5 inline-flex">
          <div className="grow shrink basis-0 opacity-50 text-[#b4b4b4] text-[15px] font-normal font-inter leading-normal">
            Length of audio transcript duration that will be stored in memory. In the interest of your privacy, there is no data saved anywhere.
          </div>
        </div>
      </div>

      <div className="w-[467px] h-[161px] flex-col justify-start items-center gap-px inline-flex">
        <div className="self-stretch pl-6 pr-3 py-[15px] bg-white/0 rounded-tl-2xl rounded-tr-2xl justify-between items-center inline-flex">
          <div className="text-[#eeeeee] text-[15px] font-medium font-inter leading-normal">Cloud Transcript</div>
          <div className="h-[26px] justify-end items-center gap-1.5 flex">
            <div className="text-right text-white/40 text-xs font-normal font-['Public Sans'] leading-snug">ON</div>
            <div className="w-[49px] h-[26px] relative rounded-2xl">
              <div className="w-[49px] h-[26px] left-0 top-0 absolute bg-[#00cc88] rounded-[100px]" />
              <div className="w-6 h-6 left-[24px] top-[1px] absolute bg-white rounded-2xl shadow" />
            </div>
          </div>
        </div>
        <div className="self-stretch px-6 py-4 bg-white/0 rounded-bl-2xl rounded-br-2xl justify-start items-center gap-2.5 inline-flex">
          <div className="grow shrink basis-0 opacity-50 text-[#b4b4b4] text-[15px] font-normal font-inter leading-normal">
            Allow transcription to work in the cloud whenever your device is unable to transcribe your conversations locally. No audio or text transcription is stored anywhere to protect your privacy.
          </div>
        </div>
      </div>

      <div className="w-[467px] h-12 px-8 py-3 bg-white/10 rounded-xl justify-center items-center gap-2 inline-flex">
        <div className="text-[#ff3333] text-[17px] font-medium font-inter leading-tight">Delete All Transcripts</div>
      </div>
    </>
  );
};

export default SettingsPage;
