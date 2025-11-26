import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Check, ArrowLeft, Building2, HelpCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { AuthModal } from '../components/auth/AuthModal';
import { useAuth } from '../context/AuthContext';
import { ThemeToggle } from '../components/ui/ThemeToggle';

const PLANS = [
  {
    name: 'Starter',
    price: '$0',
    period: '/forever',
    description: 'Perfect for solo agents just getting started.',
    features: [
      'Manage up to 10 properties',
      'Basic lead tracking',
      'Standard dashboard stats',
      'Email support',
      'Mobile friendly'
    ],
    cta: 'Get Started Free',
    highlighted: false
  },
  {
    name: 'Pro',
    price: '$49',
    period: '/month',
    description: 'Advanced tools for growing real estate businesses.',
    features: [
      'Unlimited properties',
      'AI Property Descriptions (Gemini)',
      'Advanced Lead Pipeline',
      'Priority Email Support',
      'Performance Analytics',
      'Google Calendar Integration'
    ],
    cta: 'Start Pro Trial',
    highlighted: true
  },
  {
    name: 'Agency',
    price: '$199',
    period: '/month',
    description: 'Complete power for real estate teams and brokerages.',
    features: [
      'Everything in Pro',
      'Team Management (up to 10 users)',
      'Role-based permissions',
      'Dedicated Account Manager',
      'API Access',
      'Custom Branding'
    ],
    cta: 'Contact Sales',
    highlighted: false
  }
];

const FAQS = [
  {
    question: 'Can I switch plans later?',
    answer: 'Yes, you can upgrade or downgrade your plan at any time from your settings page. Prorated charges will apply automatically.'
  },
  {
    question: 'What is the AI limit on the Pro plan?',
    answer: 'The Pro plan includes 500 AI-generated descriptions per month. If you need more, you can purchase add-on packs or upgrade to Agency.'
  },
  {
    question: 'Is my data secure?',
    answer: 'Absolutely. We use industry-standard encryption for all data in transit and at rest. Your client data is never shared.'
  },
  {
    question: 'Do you offer a free trial for paid plans?',
    answer: 'Yes! Both Pro and Agency plans come with a 14-day free trial. No credit card required to start.'
  }
];

export const Plans: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Redirect if already logged in or after successful login/signup
  if (!isLoading && user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
      {/* Navbar */}
      <nav className="border-b border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-950 sticky top-0 z-40 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 text-primary dark:text-white font-bold text-2xl cursor-pointer"
            onClick={() => navigate('/')}
          >
            <Building2 className="text-accent h-8 w-8" />
            <span>EstateFlow</span>
          </div>
          <div className="flex items-center gap-4">
             <ThemeToggle />
             <button 
               onClick={() => navigate('/')}
               className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-white transition-colors"
             >
               <ArrowLeft size={16} />
               Back to Home
             </button>
          </div>
        </div>
      </nav>

      <main className="flex-grow py-16 bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6">
              Simple, transparent pricing for real estate professionals
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400">
              Choose the plan that fits your business stage. No hidden fees. Cancel anytime.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
            {PLANS.map((plan) => (
              <div 
                key={plan.name}
                className={`
                  relative bg-white dark:bg-slate-800 rounded-2xl p-8 border transition-all duration-200
                  ${plan.highlighted 
                    ? 'border-accent shadow-xl ring-1 ring-accent scale-105 z-10' 
                    : 'border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md'
                  }
                  flex flex-col
                `}
              >
                {plan.highlighted && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-accent text-white px-4 py-1 rounded-full text-sm font-bold">
                    Most Popular
                  </div>
                )}
                
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{plan.name}</h3>
                  <div className="mt-4 flex items-baseline text-slate-900 dark:text-white">
                    <span className="text-4xl font-extrabold tracking-tight">{plan.price}</span>
                    <span className="ml-1 text-xl font-medium text-slate-500 dark:text-slate-400">{plan.period}</span>
                  </div>
                  <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">{plan.description}</p>
                </div>

                <ul className="space-y-4 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <div className="flex-shrink-0">
                        <Check className="h-5 w-5 text-green-500" />
                      </div>
                      <p className="ml-3 text-sm text-slate-600 dark:text-slate-300">{feature}</p>
                    </li>
                  ))}
                </ul>

                <Button 
                  variant={plan.highlighted ? 'primary' : 'secondary'}
                  size="lg"
                  className="w-full"
                  onClick={() => setIsAuthModalOpen(true)}
                >
                  {plan.cta}
                </Button>
              </div>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Frequently Asked Questions</h2>
            </div>
            <div className="space-y-8">
              {FAQS.map((faq, index) => (
                <div key={index} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-slate-700 transition-colors duration-200">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 mt-1">
                      <HelpCircle className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{faq.question}</h3>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>

      <footer className="bg-white dark:bg-slate-950 border-t border-gray-200 dark:border-slate-800 py-12 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-primary dark:text-white font-bold text-xl">
            <Building2 className="text-accent h-6 w-6" />
            <span>EstateFlow</span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">© 2023 EstateFlow CRM. All rights reserved.</p>
        </div>
      </footer>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
};