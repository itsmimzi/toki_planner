import React, { useState } from 'react';
import { Send, Mail, MessageSquare } from 'lucide-react';
import { useAuth } from '../components/AuthContext';

const Contact = () => {
  const { sendContact } = useAuth();
  const [email, setEmail]     = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus]   = useState(null); // 'success' | 'error' | null

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await sendContact({ email, message });
    if (success) {
      setStatus('success');
      setEmail('');
      setMessage('');
    } else {
      setStatus('error');
    }
  };

  return (
    <div className="bg-white min-h-[80vh]">
      <div className="max-w-6xl mx-auto px-6 pt-20 pb-24 grid grid-cols-1 md:grid-cols-2 gap-16 items-start">

        {/* Left */}
        <div>
          <span className="badge badge-green mb-5 text-xs tracking-wide uppercase">Get in touch</span>
          <h1 className="text-4xl font-bold text-gray-900 leading-tight mb-5">
            We'd love to<br />hear from you.
          </h1>
          <p className="text-gray-500 leading-relaxed mb-8">
            Have a question, a feature idea, or just want to say hi? Send a message and we'll get back to you as soon as possible.
          </p>

          <div className="flex flex-col gap-5">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-toki-green-light flex items-center justify-center flex-shrink-0 mt-0.5">
                <Mail size={14} className="text-toki-green" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 mb-0.5">Email</p>
                <p className="text-sm text-gray-500">We respond within 24 hours on weekdays.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-toki-green-light flex items-center justify-center flex-shrink-0 mt-0.5">
                <MessageSquare size={14} className="text-toki-green" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 mb-0.5">Feedback & feature requests</p>
                <p className="text-sm text-gray-500">Your input directly shapes the roadmap.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right — Form */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-card p-8">
          {status === 'success' ? (
            <div className="text-center py-10">
              <div className="w-12 h-12 bg-toki-green-light rounded-full flex items-center justify-center mx-auto mb-4">
                <Send size={20} className="text-toki-green" />
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">Message sent!</h3>
              <p className="text-sm text-gray-500 mb-6">We'll be in touch soon.</p>
              <button onClick={() => setStatus(null)} className="btn-ghost text-sm">Send another</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {status === 'error' && (
                <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg px-4 py-3">
                  Something went wrong. Please try again.
                </div>
              )}

              <div>
                <label className="field-label">Your email</label>
                <input
                  type="email"
                  className="field"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
                <p className="text-xs text-gray-400 mt-1">We'll never share your email.</p>
              </div>

              <div>
                <label className="field-label">Your message</label>
                <textarea
                  className="field resize-none"
                  rows={7}
                  placeholder="What's on your mind?"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn-primary justify-center py-3">
                Send message <Send size={14} />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
