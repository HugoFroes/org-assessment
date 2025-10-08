import React, { useState, useEffect } from 'react';
import { Briefcase, CheckCircle, TrendingUp, Users, Target, Mail, Calendar, ArrowRight, BarChart3, Award, AlertCircle, Download } from 'lucide-react';

// Brand colors
const COLORS = {
  black: '#000000',
  white: '#FFFFFF',
  pink: '#FF005E',
  gray: '#6B7280'
};

// Analytics tracking
const trackEvent = (eventName, eventData = {}) => {
  // Only track if user accepted cookies
  const consent = localStorage.getItem('cookie_consent');
  
  if (consent === 'accepted' && typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, eventData);
  }
  
  // Always log to console for debugging
  console.log('Analytics:', eventName, eventData);
};

// Assessment Data
const assessmentData = {
  primerQuestions: [
    { id: 'org_size', question: 'Organization size', options: ['Solo/Freelancer (1)', 'Micro (2-10)', 'Small (11-50)', 'Medium (51-200)', 'Large (201-1000)', 'Enterprise (1000+)'] },
    { id: 'industry', question: 'Industry sector', options: ['Technology/Software', 'Financial Services', 'Healthcare', 'Retail/E-commerce', 'Manufacturing', 'Professional Services', 'Non-profit/Government', 'Other'] },
    { id: 'role', question: 'Your role', options: ['Individual Contributor', 'Team Lead', 'Manager', 'Director', 'VP/C-Suite', 'Consultant/External'] },
    { id: 'team_size', question: 'Product organization size', options: ['Just me', '2-5 people', '6-10 people', '11-20 people', '20+ people', 'Multiple teams'] },
    { id: 'years', question: 'Years with organization', options: ['Less than 6 months', '6 months - 1 year', '1-2 years', '2-5 years', '5+ years'] },
    { id: 'department', question: 'Department/function', options: ['Engineering/Technology', 'Product/Design', 'Operations', 'Sales/Marketing', 'Finance/Admin', 'HR/People', 'Strategy/Leadership', 'Other'] }
  ],
  
  operatingPrinciples: [
    { id: 'strategically_aligned', name: 'Strategically Aligned', weight: 0.25 },
    { id: 'value_driven', name: 'Value Driven', weight: 0.25 },
    { id: 'outcome_focused', name: 'Outcome Focused', weight: 0.25 },
    { id: 'financially_impactful', name: 'Financially Impactful', weight: 0.25 }
  ],
  
  statements: [
    { id: 1, text: "The organization's long-term direction and purpose is clearly understood by all team members", principle: 'strategically_aligned' },
    { id: 2, text: "Customer needs and problems consistently drive decision-making across the organization", principle: 'strategically_aligned' },
    { id: 3, text: "Teams have the authority and autonomy to make decisions within their areas of responsibility", principle: 'strategically_aligned' },
    { id: 4, text: "People's work connects to what personally motivates and energizes them", principle: 'strategically_aligned' },
    { id: 5, text: "Strategic priorities remain stable and are not frequently changing", principle: 'strategically_aligned' },
    { id: 6, text: "Individuals feel empowered to challenge ideas and propose alternative approaches", principle: 'strategically_aligned' },
    { id: 7, text: "Teams have regular, meaningful interactions with customers to understand their evolving needs", principle: 'strategically_aligned' },
    { id: 8, text: "The organization actively helps people align their personal growth goals with organizational needs", principle: 'strategically_aligned' },
    { id: 9, text: "The organization's offerings strongly resonate with market needs and demands", principle: 'value_driven' },
    { id: 10, text: "Customer insights actively inform and guide decision-making across the organization", principle: 'value_driven' },
    { id: 11, text: "Teams have easy access to relevant data when they need to make decisions", principle: 'value_driven' },
    { id: 12, text: "Decisions are based on evidence and data rather than opinions or assumptions alone", principle: 'value_driven' },
    { id: 13, text: "People feel safe to speak up, share concerns, and admit when they don't know something", principle: 'value_driven' },
    { id: 14, text: "There is clear evidence that the organization solves real problems for its target market", principle: 'value_driven' },
    { id: 15, text: "Mistakes are treated as learning opportunities rather than reasons for blame", principle: 'value_driven' },
    { id: 16, text: "There is a culture of curiosity where teams actively seek customer data to inform their work", principle: 'value_driven' },
    { id: 17, text: "Assumptions and hypotheses are explicitly stated and systematically tested", principle: 'value_driven' },
    { id: 18, text: "The organization has clear, measurable definitions of success and impact", principle: 'outcome_focused' },
    { id: 19, text: "Customer feedback is systematically collected and acted upon", principle: 'outcome_focused' },
    { id: 20, text: "The organization regularly experiments and learns from both successes and failures", principle: 'outcome_focused' },
    { id: 21, text: "People regularly learn from experiences and share knowledge with colleagues", principle: 'outcome_focused' },
    { id: 22, text: "The organization actively supports professional growth and skill development", principle: 'outcome_focused' },
    { id: 23, text: "Teams can clearly articulate the outcomes they're working towards and how they measure progress", principle: 'outcome_focused' },
    { id: 24, text: "There are established mechanisms for incorporating customer insights into product and service improvements", principle: 'outcome_focused' },
    { id: 25, text: "Work is broken down into small increments that allow for rapid learning and adjustment", principle: 'outcome_focused' },
    { id: 26, text: "Individuals regularly receive meaningful feedback that supports their development", principle: 'outcome_focused' },
    { id: 27, text: "The organization's funding model is sustainable and aligned with its strategic goals", principle: 'financially_impactful' },
    { id: 28, text: "People can explain how the organization's work translates into customer value", principle: 'financially_impactful' },
    { id: 29, text: "Processes and operations are efficient without unnecessary complexity or waste", principle: 'financially_impactful' },
    { id: 30, text: "Teams and individuals are held accountable for the impact and outcomes they deliver", principle: 'financially_impactful' },
    { id: 31, text: "Resource allocation decisions are made strategically based on expected impact and return", principle: 'financially_impactful' },
    { id: 32, text: "The organization eliminates low-value activities and focuses resources on what matters most", principle: 'financially_impactful' },
    { id: 33, text: "The organization can clearly explain how it creates and captures value", principle: 'financially_impactful' },
    { id: 34, text: "Performance conversations focus on outcomes and impact rather than just activities or effort", principle: 'financially_impactful' }
  ]
};

const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const calculateScores = (responses, shuffledStatements) => {
  const principleScores = assessmentData.operatingPrinciples.map(principle => {
    const principleStatements = shuffledStatements.filter(s => s.principle === principle.id);
    const values = principleStatements.map(s => responses[s.id]).filter(v => v !== undefined);
    const average = values.length > 0 ? values.reduce((sum, val) => sum + val, 0) / values.length : 0;
    return { id: principle.id, name: principle.name, score: Math.round(average), weight: principle.weight };
  });
  
  const overallScore = principleScores.reduce((total, p) => total + (p.score * p.weight), 0);
  const thinkRight = Math.round((principleScores.find(p => p.id === 'strategically_aligned')?.score + 
                                  principleScores.find(p => p.id === 'value_driven')?.score) / 2);
  const rightThing = Math.round((principleScores.find(p => p.id === 'outcome_focused')?.score + 
                                 principleScores.find(p => p.id === 'financially_impactful')?.score) / 2);
  
  return { overall: Math.round(overallScore), principles: principleScores, thinkRight, rightThing };
};

// Email Capture Modal Component
function EmailCaptureModal({ isOpen, onClose, onSubmit }) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  
  if (!isOpen) return null;
  
  const handleSubmit = () => {
    if (email && name) {
      trackEvent('email_captured', { email, name });
      onSubmit({ email, name });
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-8 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-black text-2xl">×</button>
        
        <div className="text-center mb-6">
          <Mail className="w-12 h-12 mx-auto mb-3" style={{ color: COLORS.pink }} />
          <h3 className="text-2xl font-bold mb-2">Get Your Complete Report</h3>
          <p className="text-gray-600 text-sm">Receive detailed PDF with personalized recommendations</p>
        </div>
        
        <div className="space-y-4">
          <input type="text" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black" />
          <input type="email" placeholder="Your email" value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black" />
          
          <button onClick={handleSubmit} className="w-full py-3 text-white rounded-lg font-semibold"
            style={{ backgroundColor: COLORS.pink }}>Send My Report →</button>
          
          <p className="text-xs text-gray-500 text-center">Plus monthly insights on organizational excellence</p>
        </div>
      </div>
    </div>
  );
}

// Cookie Consent Banner Component
function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookie_consent', 'accepted');
    setShowBanner(false);
    trackEvent('cookie_consent', { action: 'accepted' });
  };

  const declineCookies = () => {
    localStorage.setItem('cookie_consent', 'declined');
    setShowBanner(false);
    trackEvent('cookie_consent', { action: 'declined' });
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black text-white p-4 z-50 shadow-lg">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm">
            We use cookies and analytics to improve this tool and understand how it's used. 
            No personal data is stored without your consent.{' '}
            <a href="/privacy.html" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-300">
              Learn more
            </a>
          </p>
        </div>
        <div className="flex gap-3 flex-shrink-0">
          <button
            onClick={declineCookies}
            className="px-4 py-2 border border-white rounded hover:bg-white hover:text-black transition-colors text-sm whitespace-nowrap"
          >
            Decline
          </button>
          <button
            onClick={acceptCookies}
            className="px-4 py-2 rounded text-sm font-semibold transition-colors whitespace-nowrap"
            style={{ backgroundColor: COLORS.pink }}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}

// Main Application Component
export default function OrganizationAssessment() {
  const PHASES = { WELCOME: 'welcome', PRIMER: 'primer', STATEMENTS: 'statements', REPORT: 'report' };
  
  const [phase, setPhase] = useState(PHASES.WELCOME);
  const [primerAnswers, setPrimerAnswers] = useState({});
  const [responses, setResponses] = useState({});
  const [shuffledStatements] = useState(() => shuffleArray(assessmentData.statements));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [startTime] = useState(Date.now());

  useEffect(() => { trackEvent('assessment_loaded'); }, []);

  // Scroll to top on phase change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [phase]);

  // Add print styles
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @media print {
        body * { visibility: hidden; }
        .print-content, .print-content * { visibility: visible; }
        .print-content { position: absolute; left: 0; top: 0; width: 100%; }
        .no-print { display: none !important; }
        .page-break { page-break-before: always; }
        @page { margin: 1cm; }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const handleNext = () => {
    if (currentIndex < shuffledStatements.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      trackEvent('assessment_completed', { timeSpent });
      setPhase(PHASES.REPORT);
      setTimeout(() => setShowEmailModal(true), 3000);
    }
  };

  if (phase === PHASES.WELCOME) {
    return (
      <>
        <CookieConsent />
        <div className="min-h-screen bg-white">
          <div className="max-w-4xl mx-auto px-6 py-12">
            <div className="flex items-center gap-3 mb-16">
              <div className="w-8 h-8 bg-black relative">
                <div className="absolute bottom-0 right-0 w-2 h-2" style={{ backgroundColor: COLORS.pink }}></div>
              </div>
              <span className="text-xl font-light tracking-wider">MAKE THE PRODUCT SHIFT</span>
            </div>

            <div className="mb-16">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Organization<br />Maturity Assessment
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl">
                Understand your organization's strengths and opportunities for growth across key operating principles.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {[
                { icon: CheckCircle, title: '34 Statements', desc: '10-12 minutes' },
                { icon: BarChart3, title: 'Comprehensive Analysis', desc: '4 key dimensions' },
                { icon: Target, title: 'Actionable Insights', desc: 'Personalized recommendations' }
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <item.icon className="w-10 h-10 mx-auto mb-3" style={{ color: COLORS.pink }} />
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="text-center">
              <button onClick={() => { trackEvent('assessment_started'); setPhase(PHASES.PRIMER); }}
                className="inline-flex items-center gap-2 px-8 py-4 text-white rounded-lg text-lg font-semibold transition-all hover:scale-105"
                style={{ backgroundColor: COLORS.black }}>
                Begin Assessment <ArrowRight className="w-5 h-5" />
              </button>
              <p className="text-sm text-gray-500 mt-4">Free • Anonymous • 10 minutes</p>
            </div>

            <div className="text-center mt-12 text-sm text-gray-500">
              <a href="/privacy.html" target="_blank" rel="noopener noreferrer" className="hover:text-gray-700 underline">
                Privacy Policy
              </a>
              {' • '}
              <span>© 2025 Make the Product Shift</span>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (phase === PHASES.PRIMER) {
    const allAnswered = assessmentData.primerQuestions.every(q => primerAnswers[q.id]);
    
    return (
      <>
        <CookieConsent />
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-3xl mx-auto px-6 py-12">
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">Context</h2>
              <p className="text-gray-600">Help us understand your organizational context</p>
              <p className="text-sm text-gray-500 mt-2">* All fields are required</p>
            </div>

            <div className="space-y-4">
              {assessmentData.primerQuestions.map((q, i) => (
                <div key={q.id} className="bg-white p-6 rounded-lg border border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    {i + 1}. {q.question} <span className="text-red-500">*</span>
                  </label>
                  <select value={primerAnswers[q.id] || ''}
                    onChange={(e) => setPrimerAnswers({ ...primerAnswers, [q.id]: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black bg-white">
                    <option value="">Select...</option>
                    {q.options.map((opt, idx) => <option key={idx} value={opt}>{opt}</option>)}
                  </select>
                </div>
              ))}
            </div>

            <button onClick={() => { trackEvent('primer_completed', primerAnswers); setPhase(PHASES.STATEMENTS); }}
              disabled={!allAnswered}
              className={`w-full mt-8 py-4 rounded-lg text-white font-semibold transition-all ${
                allAnswered ? 'bg-black hover:scale-[1.02]' : 'bg-gray-300 cursor-not-allowed'
              }`}>
              {allAnswered ? 'Continue →' : `Complete all (${Object.keys(primerAnswers).length}/6)`}
            </button>
          </div>
        </div>
      </>
    );
  }

  if (phase === PHASES.STATEMENTS) {
    const statement = shuffledStatements[currentIndex];
    const progress = ((currentIndex + 1) / shuffledStatements.length) * 100;
    const currentValue = responses[statement.id] || 50;
    const hasResponded = responses[statement.id] !== undefined;

    return (
      <>
        <CookieConsent />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-12">
          <div className="max-w-3xl w-full">
            <div className="mb-8">
              <div className="flex justify-between text-sm text-gray-600 mb-3">
                <span className="font-medium">{currentIndex + 1} / {shuffledStatements.length}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div className="h-1.5 rounded-full transition-all" 
                     style={{ width: `${progress}%`, backgroundColor: COLORS.pink }} />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-gray-200 mb-8">
              <p className="text-2xl leading-relaxed mb-12">{statement.text}</p>

              <div>
                <div className="flex justify-between text-sm font-medium text-gray-600 mb-6">
                  <span>Strongly Disagree</span>
                  <span>Strongly Agree</span>
                </div>
                
                <input type="range" min="0" max="100" value={currentValue}
                  onChange={(e) => { setResponses({ ...responses, [statement.id]: parseInt(e.target.value) }); 
                    trackEvent('statement_answered', { id: statement.id }); }}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, ${COLORS.pink} 0%, ${COLORS.pink} ${currentValue}%, #E5E7EB ${currentValue}%, #E5E7EB 100%)`
                  }} />
                
                <div className="flex justify-center mt-6">
                  <div className={`w-2.5 h-2.5 rounded-full transition-all ${
                    currentValue < 30 ? 'scale-150' : currentValue < 45 ? 'scale-125' :
                    currentValue < 55 ? 'scale-100' : currentValue < 70 ? 'scale-125' : 'scale-150'
                  }`} style={{ backgroundColor: COLORS.pink }} />
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button onClick={() => currentIndex > 0 && setCurrentIndex(currentIndex - 1)}
                disabled={currentIndex === 0}
                className="px-6 py-3 border border-gray-300 rounded-lg disabled:opacity-30 hover:border-black bg-white">
                ← Back
              </button>
              <button onClick={handleNext} disabled={!hasResponded}
                className={`flex-1 py-3 rounded-lg font-semibold ${
                  hasResponded ? 'bg-black text-white hover:scale-[1.02]' : 'bg-gray-200 text-gray-400'
                }`}>
                {currentIndex === shuffledStatements.length - 1 ? 'View Results →' : 'Next →'}
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  const scores = calculateScores(responses, shuffledStatements);
  const strengths = scores.principles.filter(p => p.score >= 70);
  const challenges = scores.principles.filter(p => p.score < 60);

  return (
    <>
      <CookieConsent />
      <EmailCaptureModal isOpen={showEmailModal} onClose={() => setShowEmailModal(false)}
        onSubmit={(data) => { setShowEmailModal(false); alert(`Report will be sent to ${data.email}`); }} />
      
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-6 py-12 space-y-8 print-content">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4 no-print">
              <div className="w-8 h-8 bg-black relative">
                <div className="absolute bottom-0 right-0 w-2 h-2" style={{ backgroundColor: COLORS.pink }}></div>
              </div>
              <span className="text-xl font-light tracking-wider">MAKE THE PRODUCT SHIFT</span>
            </div>
            <h1 className="text-4xl font-bold mb-2">Your Assessment Results</h1>
            <p className="text-gray-600">{primerAnswers.org_size} • {primerAnswers.industry}</p>
            <p className="text-sm text-gray-500 mt-2">Generated: {new Date().toLocaleDateString()}</p>
          </div>

          <div className="bg-black text-white rounded-2xl p-12 text-center">
            <p className="text-lg opacity-75 mb-3">Overall Maturity Score</p>
            <div className="text-8xl font-bold mb-4">{scores.overall}</div>
            <div className="inline-block px-6 py-2 rounded-full" style={{ backgroundColor: COLORS.pink }}>
              <span className="text-lg font-semibold">
                {scores.overall >= 80 ? 'Advanced' : scores.overall >= 65 ? 'Developing' : 
                 scores.overall >= 50 ? 'Emerging' : 'Early Stage'}
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="font-semibold mb-1">Building the Think Right</h3>
              <p className="text-sm text-gray-600 mb-4">Strategy & Direction</p>
              <div className="text-5xl font-bold" style={{ color: COLORS.pink }}>{scores.thinkRight}</div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="font-semibold mb-1">Building the Right Thing</h3>
              <p className="text-sm text-gray-600 mb-4">Execution & Culture</p>
              <div className="text-5xl font-bold" style={{ color: COLORS.pink }}>{scores.rightThing}</div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-8 border border-gray-200">
            <h2 className="text-2xl font-bold mb-6">Operating Principles</h2>
            <div className="space-y-6">
              {scores.principles.map(p => (
                <div key={p.id}>
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold">{p.name}</span>
                    <span className="text-2xl font-bold">{p.score}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="h-3 rounded-full" style={{ width: `${p.score}%`, backgroundColor: COLORS.pink }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {strengths.length > 0 && (
            <div className="bg-white rounded-xl p-8 border-2" style={{ borderColor: COLORS.pink }}>
              <div className="flex items-center gap-2 mb-4">
                <Award style={{ color: COLORS.pink }} />
                <h2 className="text-2xl font-bold">Strengths</h2>
              </div>
              {strengths.map(s => (
                <div key={s.id} className="flex justify-between p-4 bg-gray-50 rounded-lg mb-2">
                  <span className="font-medium">{s.name}</span>
                  <span className="text-xl font-bold" style={{ color: COLORS.pink }}>{s.score}</span>
                </div>
              ))}
            </div>
          )}

          {challenges.length > 0 && (
            <div className="bg-white rounded-xl p-8 border-2 border-orange-200">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="text-orange-500" />
                <h2 className="text-2xl font-bold">Areas for Improvement</h2>
              </div>
              {challenges.map(c => (
                <div key={c.id} className="flex justify-between p-4 bg-orange-50 rounded-lg mb-2">
                  <span className="font-medium">{c.name}</span>
                  <span className="text-xl font-bold text-orange-600">{c.score}</span>
                </div>
              ))}
            </div>
          )}

          <div className="bg-black text-white rounded-xl p-8 no-print">
            <h2 className="text-2xl font-bold mb-4">Ready to Transform Your Organization?</h2>
            <p className="mb-6 opacity-90">
              I conduct comprehensive organizational assessments and can work as an interim CPO to help you optimize your product organization.
            </p>
            <ul className="space-y-2 mb-6">
              {['Optimize product organization structure', 'Improve processes and ways of working', 
                'Build high-performing teams', 'Navigate digital transformation'].map((item, i) => (
                <li key={i} className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" style={{ color: COLORS.pink }} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <a href="https://calendly.com/hugofroesdesign/1-on-1" target="_blank" rel="no opener noreferrer"
            onClick={() => trackEvent('cta_clicked', { type: 'calendly' })}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold hover:scale-105"
            style={{ backgroundColor: COLORS.pink, color: 'white' }}>
            <Calendar className="w-5 h-5" />
            Book Free Discovery Call
          </a>
        </div>

        <div className="bg-gray-100 rounded-xl p-6 text-sm text-gray-600 no-print">
          <p className="mb-2">
            <strong>Please note:</strong> This assessment provides a high-level overview of organizational maturity based on self-reported responses. 
            For a comprehensive evaluation, we recommend engaging an experienced consultant to conduct an in-depth analysis, 
            including stakeholder interviews, process reviews, and tailored recommendations to support meaningful organizational change.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center no-print">
          <button
            onClick={() => {
              trackEvent('cta_clicked', { type: 'download_pdf' });
              window.print();
            }}
            className="inline-flex items-center gap-2 px-6 py-3 border-2 border-black rounded-lg hover:bg-black hover:text-white transition-colors w-full sm:w-auto"
          >
            <Download className="w-5 h-5" />
            Download as PDF
          </button>
          <button 
            onClick={() => { 
              setPhase(PHASES.WELCOME); 
              setPrimerAnswers({}); 
              setResponses({}); 
              setCurrentIndex(0); 
            }}
            className="inline-flex items-center justify-center px-8 py-3 border-2 border-black rounded-lg hover:bg-black hover:text-white transition-colors w-full sm:w-auto"
          >
            Start New Assessment
          </button>
        </div>
      </div>
    </div>
    </>
  );
}