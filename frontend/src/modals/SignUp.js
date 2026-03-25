import React, { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, UserPlus, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../components/AuthContext';

const SignUp = () => {
  const { modalSignup, toggleSignup, signUpUser, loginError } = useAuth();
  const [formData, setFormData] = useState({ username: '', email: '', password1: '', password2: '' });
  const [errors, setErrors] = useState({});
  const [showPass1, setShowPass1] = useState(false);
  const [showPass2, setShowPass2] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
  };

  const validate = () => {
    const { username, email, password1, password2 } = formData;
    const e = {};
    if (!username.trim())                                e.username  = 'Username is required';
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) e.email     = 'Enter a valid email';
    if (password1.length < 8 || password1.length > 100)  e.password1 = 'Must be 8–100 characters';
    else if (!/[A-Z]/.test(password1))                   e.password1 = 'Must include an uppercase letter';
    else if (!/[a-z]/.test(password1))                   e.password1 = 'Must include a lowercase letter';
    else if (!/\d/.test(password1))                      e.password1 = 'Must include a number';
    else if (!/[.@$!%*#?]/.test(password1))              e.password1 = 'Must include a special character (.@$!%*#?)';
    if (password1 !== password2)                         e.password2 = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    await signUpUser(formData);
  };

  const close = () => {
    toggleSignup();
    setFormData({ username: '', email: '', password1: '', password2: '' });
    setErrors({});
  };

  return (
    <Transition show={modalSignup} as={Fragment}>
      <Dialog onClose={close} className="relative z-50">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100"
          leave="ease-in duration-150"  leaveFrom="opacity-100" leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200" enterFrom="opacity-0 scale-95 translate-y-2" enterTo="opacity-100 scale-100 translate-y-0"
            leave="ease-in duration-150"  leaveFrom="opacity-100 scale-100 translate-y-0" leaveTo="opacity-0 scale-95 translate-y-2"
          >
            <Dialog.Panel className="w-full max-w-md bg-white rounded-2xl shadow-modal p-8 relative my-8">
              <button onClick={close} className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <X size={16} />
              </button>

              <div className="mb-7">
                <div className="w-10 h-10 bg-toki-green-light rounded-xl flex items-center justify-center mb-4">
                  <UserPlus size={18} className="text-toki-green" />
                </div>
                <Dialog.Title className="text-xl font-semibold text-gray-900">Create your account</Dialog.Title>
                <p className="text-sm text-gray-500 mt-1">Free forever. No credit card needed.</p>
              </div>

              {loginError && (
                <div className="mb-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg px-4 py-3">
                  {loginError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="field-label">Username</label>
                  <input
                    type="text"
                    name="username"
                    className={`field ${errors.username ? 'border-red-300' : ''}`}
                    placeholder="yourname"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                  {errors.username && <p className="text-xs text-red-500 mt-1">{errors.username}</p>}
                </div>

                <div>
                  <label className="field-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    className={`field ${errors.email ? 'border-red-300' : ''}`}
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="field-label">Password</label>
                  <div className="relative">
                    <input
                      type={showPass1 ? 'text' : 'password'}
                      name="password1"
                      className={`field pr-10 ${errors.password1 ? 'border-red-300' : ''}`}
                      placeholder="••••••••"
                      value={formData.password1}
                      onChange={handleChange}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass1(p => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      tabIndex={-1}
                    >
                      {showPass1 ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  {errors.password1 && <p className="text-xs text-red-500 mt-1">{errors.password1}</p>}
                </div>

                <div>
                  <label className="field-label">Confirm password</label>
                  <div className="relative">
                    <input
                      type={showPass2 ? 'text' : 'password'}
                      name="password2"
                      className={`field pr-10 ${errors.password2 ? 'border-red-300' : ''}`}
                      placeholder="••••••••"
                      value={formData.password2}
                      onChange={handleChange}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass2(p => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      tabIndex={-1}
                    >
                      {showPass2 ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  {errors.password2 && <p className="text-xs text-red-500 mt-1">{errors.password2}</p>}
                </div>

                <div className="bg-gray-50 rounded-lg px-4 py-3 text-xs text-gray-500">
                  Password must be 8–100 characters and include uppercase, lowercase, a number, and a special character (.@$!%*#?)
                </div>

                <button type="submit" className="btn-primary justify-center py-3 mt-1">
                  Create account
                </button>

                <p className="text-xs text-gray-400 text-center leading-relaxed">
                  By signing up you agree to Toki's{' '}
                  <a href="#terms" className="underline hover:text-gray-600">Terms of Service</a>,{' '}
                  <a href="#conduct" className="underline hover:text-gray-600">Code of Conduct</a>, and{' '}
                  <a href="#privacy" className="underline hover:text-gray-600">Privacy Policy</a>.
                </p>
              </form>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default SignUp;
