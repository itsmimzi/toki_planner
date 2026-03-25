import React, { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, UserPlus } from 'lucide-react';
import { useAuth } from '../components/AuthContext';

const SignUp = () => {
  const { modalSignup, toggleSignup, signUpUser, loginError } = useAuth();
  const [formData, setFormData] = useState({ username: '', email: '', password1: '', password2: '' });
  const [errors, setErrors]     = useState({});

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

  const Field = ({ name, label, type = 'text', placeholder }) => (
    <div>
      <label className="field-label">{label}</label>
      <input
        type={type}
        name={name}
        className={`field ${errors[name] ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : ''}`}
        placeholder={placeholder}
        value={formData[name]}
        onChange={handleChange}
        required
      />
      {errors[name] && <p className="text-xs text-red-500 mt-1">{errors[name]}</p>}
    </div>
  );

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
                <Field name="username"  label="Username"         placeholder="yourname" />
                <Field name="email"     label="Email"            type="email"    placeholder="you@example.com" />
                <Field name="password1" label="Password"         type="password" placeholder="••••••••" />
                <Field name="password2" label="Confirm password" type="password" placeholder="••••••••" />

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
