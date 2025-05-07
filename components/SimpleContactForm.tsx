'use client';

import React, { useState, Fragment } from 'react';
import Button from './ui/Button';
import { Transition } from '@headlessui/react';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { ChevronUpDownIcon, CheckIcon } from '@heroicons/react/24/solid';
import { z, ZodError, ZodIssue } from 'zod';

const eventTypes = [
  "Wedding",
  "Engagement",
  "Birthday",
  "Corporate / brand",
  "Seasonal party",
  "Bar/Bat Mitzvah",
  "Charity",
  "Other"
];

const ContactFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
  eventDate: z.string().min(1, { message: 'Please select an event date.' }),
  eventType: z.string().min(1, { message: 'Please select the type of event.' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters.' }),
});

type ContactFormData = z.infer<typeof ContactFormSchema>;
type FormErrors = Partial<Record<keyof ContactFormData, string>>;

interface ToastState {
  show: boolean;
  message: string;
  type: 'success' | 'error';
}

const SimpleContactForm: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    eventDate: '',
    eventType: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<ToastState>({ show: false, message: '', type: 'success' });
  const [eventTypeOpen, setEventTypeOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevState: ContactFormData) => ({
      ...prevState,
      [name]: value,
    }));
    if (errors[name as keyof ContactFormData]) {
      setErrors((prevErrors: FormErrors) => ({ ...prevErrors, [name]: undefined }));
    }
  };

  const handleEventTypeChange = (value: string) => {
    setFormData((prevState) => ({
      ...prevState,
      eventType: value,
    }));
    if (errors.eventType) {
      setErrors((prevErrors) => ({ ...prevErrors, eventType: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    const validationResult = ContactFormSchema.safeParse(formData);
    if (!validationResult.success) {
      const fieldErrors: FormErrors = {};
      (validationResult.error as ZodError).errors.forEach((err: ZodIssue) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as keyof ContactFormData] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validationResult.data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Something went wrong');
      }
      
      setToast({ show: true, message: 'Message sent successfully! We will be in touch soon.', type: 'success' });
      setFormData({ name: '', email: '', eventDate: '', eventType: '', message: '' });
      setErrors({});
    } catch (error: any) {
      console.error('Submission Error:', error);
      setToast({ show: true, message: error.message || 'Failed to send message. Please try again.', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto space-y-6 text-left">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-brand-champagne mb-1">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
            className={`mt-1 block w-full px-3 py-2 bg-white/5 border border-brand-champagne/30 rounded-md shadow-sm text-brand-champagne placeholder-brand-champagne/60 focus:outline-none focus:ring-2 sm:text-sm
                        ${errors.name ? 'border-red-500 ring-red-500' : 'focus:ring-brand-gold focus:border-brand-gold'}`}
            placeholder="Your Name"
          />
          {errors.name && <p id="name-error" className="mt-1 text-xs text-red-400">{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-brand-champagne mb-1">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={`mt-1 block w-full px-3 py-2 bg-white/5 border border-brand-champagne/30 rounded-md shadow-sm text-brand-champagne placeholder-brand-champagne/60 focus:outline-none focus:ring-2 sm:text-sm
                        ${errors.email ? 'border-red-500 ring-red-500' : 'focus:ring-brand-gold focus:border-brand-gold'}`}
            placeholder="you@example.com"
          />
          {errors.email && <p id="email-error" className="mt-1 text-xs text-red-400">{errors.email}</p>}
        </div>
        
        {/* Event date and event type in the same row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="eventDate" className="block text-sm font-medium text-brand-champagne mb-1">
              Event Date*
            </label>
            <input
              type="date"
              name="eventDate"
              id="eventDate"
              value={formData.eventDate}
              onChange={handleChange}
              aria-invalid={!!errors.eventDate}
              aria-describedby={errors.eventDate ? "eventDate-error" : undefined}
              className={`mt-1 block w-full px-3 py-2 bg-white/5 border border-brand-champagne/30 rounded-md shadow-sm text-brand-champagne placeholder-brand-champagne/60 focus:outline-none focus:ring-2 sm:text-sm
                          ${errors.eventDate ? 'border-red-500 ring-red-500' : 'focus:ring-brand-gold focus:border-brand-gold'}`}
            />
            {errors.eventDate && <p id="eventDate-error" className="mt-1 text-xs text-red-400">{errors.eventDate}</p>}
          </div>
          
          <div>
            <label htmlFor="eventType" className="block text-sm font-medium text-brand-champagne mb-1">
              Event Type*
            </label>
            <div className="relative mt-1">
              <button
                type="button"
                id="eventType"
                aria-invalid={!!errors.eventType}
                aria-describedby={errors.eventType ? "eventType-error" : undefined}
                onClick={() => setEventTypeOpen(!eventTypeOpen)}
                className={`relative w-full px-3 py-2 bg-white/5 border border-brand-champagne/30 rounded-md shadow-sm text-left text-brand-champagne placeholder-brand-champagne/60 focus:outline-none focus:ring-2 sm:text-sm
                         ${errors.eventType ? 'border-red-500 ring-red-500' : 'focus:ring-brand-gold focus:border-brand-gold'}`}
              >
                <span className={`block truncate ${!formData.eventType ? 'text-brand-champagne/50' : ''}`}>
                  {formData.eventType || 'Select an option'}
                </span>
                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <ChevronUpDownIcon className="h-4 w-4 text-brand-champagne/70" aria-hidden="true" />
                </span>
              </button>
              
              {eventTypeOpen && (
                <div className="absolute z-10 mt-1 w-full max-h-60 overflow-auto rounded-md bg-brand-midnight-blue shadow-lg">
                  <ul className="py-1 text-sm">
                    {eventTypes.map((type, index) => (
                      <li
                        key={index}
                        className={`relative cursor-default select-none py-2 pl-8 pr-4 hover:bg-brand-midnight/40 hover:text-brand-gold text-brand-champagne`}
                        onClick={() => {
                          handleEventTypeChange(type);
                          setEventTypeOpen(false);
                        }}
                      >
                        <span className={`block truncate ${formData.eventType === type ? 'font-medium' : 'font-normal'}`}>
                          {type}
                        </span>
                        {formData.eventType === type && (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-brand-gold">
                            <CheckIcon className="h-4 w-4" aria-hidden="true" />
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            {errors.eventType && <p id="eventType-error" className="mt-1 text-xs text-red-400">{errors.eventType}</p>}
          </div>
        </div>
        
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-brand-champagne mb-1">
            Message
          </label>
          <textarea
            name="message"
            id="message"
            rows={4}
            value={formData.message}
            onChange={handleChange}
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? "message-error" : undefined}
            className={`mt-1 block w-full px-3 py-2 bg-white/5 border border-brand-champagne/30 rounded-md shadow-sm text-brand-champagne placeholder-brand-champagne/60 focus:outline-none focus:ring-2 sm:text-sm
                        ${errors.message ? 'border-red-500 ring-red-500' : 'focus:ring-brand-gold focus:border-brand-gold'}`}
            placeholder="Your message..."
          ></textarea>
          {errors.message && <p id="message-error" className="mt-1 text-xs text-red-400">{errors.message}</p>}
        </div>
        <div className="flex justify-center mt-8">
          <Button type="submit" variant="primary" className="px-8 py-3" disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </Button>
        </div>
      </form>

      {/* Global Toast Notification */}
      <div
        aria-live="assertive"
        className="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start z-50"
      >
        <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
          <Transition
            show={toast.show}
            as={Fragment}
            enter="transform ease-out duration-300 transition"
            enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
            enterTo="translate-y-0 opacity-100 sm:translate-x-0"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setToast({ ...toast, show: false })} // Reset show state after leave
          >
            <div className={`max-w-sm w-full bg-brand-midnight-blue shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden border ${toast.type === 'success' ? 'border-green-500' : 'border-red-500'}`}>
              <div className="p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    {toast.type === 'success' ? (
                      <CheckCircleIcon className="h-6 w-6 text-green-400" aria-hidden="true" />
                    ) : (
                      <XCircleIcon className="h-6 w-6 text-red-400" aria-hidden="true" />
                    )}
                  </div>
                  <div className="ml-3 w-0 flex-1 pt-0.5">
                    <p className={`text-sm font-medium ${toast.type === 'success' ? 'text-green-300' : 'text-red-300'}`}>
                      {toast.type === 'success' ? 'Success' : 'Error'}
                    </p>
                    <p className="mt-1 text-sm text-brand-champagne/80">
                      {toast.message}
                    </p>
                  </div>
                  <div className="ml-4 flex-shrink-0 flex">
                    <button
                      type="button"
                      className="bg-brand-midnight-blue rounded-md inline-flex text-brand-champagne/70 hover:text-brand-champagne focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-midnight-blue focus:ring-brand-gold"
                      onClick={() => {
                        setToast({ ...toast, show: false });
                      }}
                    >
                      <span className="sr-only">Close</span>
                      <XCircleIcon className="h-5 w-5" aria-hidden="true" /> {/* Using XCircle for close icon consistency */}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </>
  );
};

export default SimpleContactForm; 