import { motion } from 'framer-motion';

interface CashShieldLandingProps {
  onGetStarted: () => void;
}

export function CashShieldLanding({ onGetStarted }: CashShieldLandingProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="h-screen flex flex-col bg-white font-sans overflow-hidden"
    >
      {/* Gmail top bar - fixed */}
      <div className="shrink-0 flex items-center gap-6 px-4 py-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5f6368" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
          <svg width="26" height="26" viewBox="0 0 24 24"><path fill="#EA4335" d="M2 6.5A2.5 2.5 0 014.5 4h1.7L12 9.5 17.8 4h1.7A2.5 2.5 0 0122 6.5v.3l-10 7-10-7z"/><path fill="#4285F4" d="M2 8.6l10 7 10-7V17.5A2.5 2.5 0 0119.5 20h-15A2.5 2.5 0 012 17.5z"/></svg>
          <span className="text-xl text-gray-600 ml-1">Gmail</span>
        </div>
        <div className="flex-1 max-w-2xl bg-[#eaf1fb] rounded-full flex items-center gap-3 px-4 py-2.5">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5f6368" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/></svg>
          <span className="text-gray-700 text-sm flex-1">cash shield ulaw</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5f6368" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5f6368" strokeWidth="2"><path d="M4 6h16M7 12h10M10 18h4"/></svg>
        </div>
        <div className="flex-1" />
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5f6368" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M12 16v-4M12 8h.01"/></svg>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5f6368" strokeWidth="2"><path d="M12 15a3 3 0 003-3V6a3 3 0 00-6 0v6a3 3 0 003 3zM19 11a7 7 0 01-14 0M12 18v3"/></svg>
        <button className="text-sm text-blue-700 border border-gray-300 rounded-full px-4 py-1.5">Upgrade</button>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5f6368" strokeWidth="2"><rect x="3" y="4" width="18" height="14" rx="2"/><path d="M8 21h8M12 18v3"/></svg>
        <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-medium">S</div>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Left sidebar - fixed */}
        <div className="w-56 shrink-0 py-4 pr-2 overflow-y-auto">
          <button className="flex items-center gap-3 bg-[#c2e7ff] hover:shadow-md transition-shadow rounded-2xl px-6 py-4 ml-3 mb-4 text-sm font-medium text-gray-800">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3c4043" strokeWidth="2"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z"/></svg>
            Compose
          </button>
          <div className="text-sm">
            <div className="flex items-center gap-4 px-6 py-2 bg-[#d3e3fd] rounded-r-full font-medium text-gray-900">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 4l-8 5-8-5V6l8 5 8-5z"/></svg>
              <span className="flex-1">Inbox</span>
              <span className="text-xs font-bold">14</span>
            </div>
            <div className="flex items-center gap-4 px-6 py-2 text-gray-700">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 17.3L18.2 21l-1.6-7 5.4-4.7-7.1-.6L12 2 9.1 8.7 2 9.3l5.4 4.7L5.8 21z"/></svg>
              Starred
            </div>
            <div className="flex items-center gap-4 px-6 py-2 text-gray-700">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></svg>
              Snoozed
            </div>
            <div className="flex items-center gap-4 px-6 py-2 text-gray-700">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4z"/></svg>
              Sent
            </div>
            <div className="flex items-center gap-4 px-6 py-2 text-gray-700">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/></svg>
              Drafts
            </div>
            <div className="flex items-center gap-4 px-6 py-2 text-gray-700">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
              Purchases
            </div>
            <div className="flex items-center gap-4 px-6 py-2 text-gray-700">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M6 9l6 6 6-6"/></svg>
              More
            </div>
          </div>
          <div className="flex items-center justify-between px-6 pt-6 text-sm text-gray-700">
            <span>Labels</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
          </div>
        </div>

        {/* Main email area - scrollable */}
        <div className="flex-1 border-l border-gray-200 overflow-y-auto">
          <div className="max-w-2xl mx-auto">
          {/* Email toolbar */}
          <div className="flex items-center gap-4 px-2 py-2 border-b border-gray-200 text-gray-600">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 12H4M4 12l6-6M4 12l6 6" />
            </svg>
            <div className="flex items-center gap-3 ml-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18"/></svg>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M12 8v4l3 2"/></svg>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M8 6v12a2 2 0 002 2h4a2 2 0 002-2V6M10 6V4a2 2 0 012-2 2 2 0 012 2v2"/></svg>
            </div>
            <div className="flex-1" />
            <span className="text-sm text-gray-500">1 of 1</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
          </div>

          {/* Subject line */}
          <div className="flex items-center gap-3 px-2 pt-5 pb-3">
            <h1 className="text-[22px] font-normal text-gray-900">
              Welcome to CAS Shield
            </h1>
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full flex items-center gap-1">
              Inbox
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </span>
          </div>

          {/* Sender row */}
          <div className="flex items-center justify-between px-2 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#9CA3AF"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-6 8-6s8 2 8 6"/></svg>
              </div>
              <div className="leading-tight">
                <div className="text-sm font-semibold text-gray-900">contact@cas-shield.com</div>
                <div className="text-xs text-gray-500 flex items-center gap-1">
                  to me
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M6 9l6 6 6-6"/></svg>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 text-gray-500">
              <span className="text-xs whitespace-nowrap">Wed, May 27, 11:17 PM</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l2.9 6.6L22 9.3l-5 4.9 1.2 7-6.2-3.3L5.8 21.2 7 14.2l-5-4.9 7.1-.7z"/></svg>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M9 10s.5-1.5 3-1.5 3 1.5 3 1.5M9 15s1 2 3 2 3-2 3-2M9 9h.01M15 9h.01"/></svg>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 17l-4 4V5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H9z"/></svg>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/></svg>
            </div>
          </div>

          {/* Email body card */}
          <div className="border border-gray-200 rounded-xl px-7 py-7 mx-4 shadow-sm max-w-2xl">
            <div className="mb-8">
              <div className="text-[#2b2470] text-2xl font-bold leading-tight tracking-tight">The</div>
              <div className="text-[#2b2470] text-2xl font-bold leading-tight tracking-tight">University of</div>
              <div className="text-[#7a1fa2] text-5xl font-black leading-none tracking-tight mt-1">Law</div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">Hello, STUDENT</h2>

            <p className="text-gray-800 leading-relaxed mb-5">
              Welcome to CAS Shield, our student route platform to
              help facilitate your onboarding to The University of Law.
              The CAS Shield platform will enable smoother two-way
              communication related to us reviewing your application for a CAS.
            </p>

            <p className="text-gray-800 leading-relaxed mb-5">
              We recommend that you start this process as soon as possible. You may now use the{" "}
              CAS Shield system to start your application for a CAS.
            </p>

            <p className="text-gray-800 leading-relaxed mb-6">The next steps depend on the type of offer you hold.</p>

            <h3 className="text-lg font-bold text-gray-900 mb-3">
              If you hold a conditional offer and have not paid a deposit
            </h3>
            <p className="text-gray-800 leading-relaxed mb-2">It is important that you:</p>
            <ul className="list-disc pl-6 text-gray-800 leading-relaxed mb-5 space-y-1">
              <li>complete the information check form (info check) on CAS Shield</li>
              <li>upload a copy of your passport</li>
              <li>Use our website and other resources to research and prepare for your interview</li>
              <li>Complete the compliance interview within a week, sooner if the deadline for your intake is approaching</li>
            </ul>

            <p className="text-gray-800 leading-relaxed mb-6">
              Please do not accept your place or pay a deposit until you have successfully passed your
              compliance interview.
            </p>

            <p className="text-gray-800 leading-relaxed mb-6">
              While you are undertaking this process you should also engage with the Admissions team to meet
              any other conditions outlined in your offer email.
            </p>

            <p className="text-gray-800 leading-relaxed mb-6">
              You may also start uploading documents to support your CAS application however it is important
              to note that your application for CAS will not be processed until you have met the conditions of
              your offer and accepted an unconditional offer. Consideration for CAS will only start once all
              required documents have been uploaded and funds have cleared into our account.
            </p>

            <h3 className="text-lg font-bold text-gray-900 mb-3">
              If you have accepted a conditional offer and paid a deposit
            </h3>
            <p className="text-gray-800 leading-relaxed mb-2">It is important that you:</p>
            <ul className="list-disc pl-6 text-gray-800 leading-relaxed mb-5 space-y-1">
              <li>complete the information check form (info check) on CAS Shield</li>
              <li>upload a copy of your passport</li>
              <li>Use our website and other resources to research and prepare for your interview</li>
              <li>Complete the compliance interview within a week or sooner if the deadline for your intake is approaching</li>
            </ul>

            <p className="text-gray-800 leading-relaxed mb-6">
              While you are undertaking this process you should also engage with the Admissions team to meet
              any other conditions outlined in your offer email.
            </p>

            <p className="text-gray-800 leading-relaxed mb-6">
              You may also start uploading documents to support your CAS application however It is important
              to note that your application for CAS will not be processed until you have met the conditions of
              your offer and accepted an unconditional offer. Consideration for CAS will only start once all
              required documents have been uploaded and funds have cleared into our account.
            </p>

            <p className="text-gray-800 leading-relaxed mb-2 font-medium">
              It is important that you use the interactive form within this system and complete all the
              sections needed for us to assess your eligibility for a CAS. There are 4 stages to complete:
            </p>
            <ol className="list-decimal pl-6 text-gray-800 leading-relaxed mb-6 space-y-1">
              <li>CAS Checklist</li>
              <li>General Documents</li>
              <li>Financial Documents</li>
              <li>Pre-CAS Questionnaire</li>
            </ol>

            <p className="text-gray-800 leading-relaxed mb-6">
              Please note that you may have already provided some of the information and/or documents
              requested but this must be re-submitted to ensure that your record is up to date within{" "}
              CAS Shield.
            </p>

            <p className="text-gray-800 leading-relaxed mb-8">
              If you are invited to a compliance interview, please ensure that you use our website and other
              resources to research and prepare for your interview. Once you are ready you should complete the
              compliance interview as soon as possible.
            </p>

            <button
              onClick={onGetStarted}
              className="w-full bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold text-lg py-4 rounded-md cursor-pointer"
            >
              Get started
            </button>
          </div>

          {/* Reply/Forward row */}
          <div className="flex items-center gap-3 px-2 py-6">
            <button className="flex items-center gap-2 border border-gray-300 rounded-full px-5 py-2 text-sm text-gray-700 hover:bg-gray-50">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 10L4 15l5 5M4 15h11a4 4 0 004-4V6"/></svg>
              Reply
            </button>
            <button className="flex items-center gap-2 border border-gray-300 rounded-full px-5 py-2 text-sm text-gray-700 hover:bg-gray-50">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 10l5 5-5 5M20 15H9a4 4 0 01-4-4V6"/></svg>
              Forward
            </button>
          </div>
          </div>
        </div>

        {/* Right icon rail - fixed */}
        <div className="w-14 shrink-0 flex flex-col items-center gap-5 pt-4 border-l border-gray-200">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 cursor-pointer">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18M8 2v4M16 2v4"/></svg>
          </div>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 cursor-pointer">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 18h6M10 21h4M12 3a6 6 0 00-4 10.5c.6.6 1 1.4 1 2.5h6c0-1.1.4-1.9 1-2.5A6 6 0 0012 3z"/></svg>
          </div>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 cursor-pointer">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 5H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2v-3M13 3l7 7-9 9H8v-3z"/></svg>
          </div>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 cursor-pointer">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="9" cy="7" r="3"/><path d="M2 21c0-4 3-6 7-6s7 2 7 6"/><circle cx="17" cy="8" r="2.5"/><path d="M15.5 13.2c2.7.2 4.5 1.9 4.5 4.8"/></svg>
          </div>
          <div className="mt-auto mb-4">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 cursor-pointer">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
