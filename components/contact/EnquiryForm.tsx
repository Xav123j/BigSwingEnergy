'use client';

import React, { useState, useEffect } from 'react';
import { useForm, Controller, ControllerRenderProps, Control } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/24/solid';
import Toast from '@/components/ui/Toast';
import { useToast } from '@/hooks/useToast';

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

const phoneRegex = /^\+?[1-9]\d{1,14}$/;

const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  phone: z.string().regex(phoneRegex, { message: "Please enter a valid phone number (E.164 format)" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  eventDate: z.string().min(1, { message: "Please select an event date" }),
  eventLocation: z.string().min(1, { message: "Please enter the event location" }),
  eventType: z.string().min(1, { message: "Please select the type of event" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" })
});

type ContactFormData = z.infer<typeof contactFormSchema>;

const EnquiryForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast, showToast, hideToast } = useToast();
  
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitSuccessful },
    reset,
    setFocus
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      eventDate: '',
      eventLocation: '',
      eventType: '',
      message: ''
    }
  });

  // Focus the first field with an error
  useEffect(() => {
    const firstError = Object.keys(errors)[0] as keyof ContactFormData;
    if (firstError) {
      setFocus(firstError);
    }
  }, [errors, setFocus]);

  // Reset form after successful submission
  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Something went wrong. Please try again.');
      }
      
      showToast("Thank you – we'll be in touch within 24 hours.", 6000);
    } catch (error) {
      console.error('Error submitting form:', error);
      showToast('There was an error submitting your form. Please try again.', 6000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-4">
          {/* First column */}
          <div>
            <label htmlFor="name" className="block font-sans uppercase tracking-wide text-xs text-brand-champagne mb-1">
              Name*
            </label>
            <input
              id="name"
              type="text"
              {...register('name')}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
              className={`w-full rounded-lg px-3 py-2 bg-brand-midnight/20 border 
                          ${errors.name ? 'border-red-500' : 'border-brand-champagne/30'} 
                          text-brand-champagne placeholder-brand-champagne/50 focus:outline-none 
                          focus:ring-2 focus:ring-brand-gold/70 text-sm`}
              placeholder="Your full name"
            />
            {errors.name && (
              <p id="name-error" className="mt-0.5 text-xs text-brand-champagne">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Second column */}
          <div>
            <label htmlFor="email" className="block font-sans uppercase tracking-wide text-xs text-brand-champagne mb-1">
              Email*
            </label>
            <input
              id="email"
              type="email"
              {...register('email')}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              className={`w-full rounded-lg px-3 py-2 bg-brand-midnight/20 border 
                          ${errors.email ? 'border-red-500' : 'border-brand-champagne/30'} 
                          text-brand-champagne placeholder-brand-champagne/50 focus:outline-none 
                          focus:ring-2 focus:ring-brand-gold/70 text-sm`}
              placeholder="your@email.com"
            />
            {errors.email && (
              <p id="email-error" className="mt-0.5 text-xs text-brand-champagne">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Third column */}
          <div>
            <label htmlFor="phone" className="block font-sans uppercase tracking-wide text-xs text-brand-champagne mb-1">
              Phone*
            </label>
            <input
              id="phone"
              type="tel"
              {...register('phone')}
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? "phone-error" : undefined}
              className={`w-full rounded-lg px-3 py-2 bg-brand-midnight/20 border 
                          ${errors.phone ? 'border-red-500' : 'border-brand-champagne/30'} 
                          text-brand-champagne placeholder-brand-champagne/50 focus:outline-none 
                          focus:ring-2 focus:ring-brand-gold/70 text-sm`}
              placeholder="+44 7000 000000"
            />
            {errors.phone && (
              <p id="phone-error" className="mt-0.5 text-xs text-brand-champagne">
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Second row */}
          <div>
            <label htmlFor="eventDate" className="block font-sans uppercase tracking-wide text-xs text-brand-champagne mb-1">
              Event Date*
            </label>
            <input
              id="eventDate"
              type="date"
              {...register('eventDate')}
              aria-invalid={!!errors.eventDate}
              aria-describedby={errors.eventDate ? "eventDate-error" : undefined}
              className={`w-full rounded-lg px-3 py-2 bg-brand-midnight/20 border 
                          ${errors.eventDate ? 'border-red-500' : 'border-brand-champagne/30'} 
                          text-brand-champagne placeholder-brand-champagne/50 focus:outline-none 
                          focus:ring-2 focus:ring-brand-gold/70 text-sm`}
            />
            {errors.eventDate && (
              <p id="eventDate-error" className="mt-0.5 text-xs text-brand-champagne">
                {errors.eventDate.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="eventLocation" className="block font-sans uppercase tracking-wide text-xs text-brand-champagne mb-1">
              Location*
            </label>
            <input
              id="eventLocation"
              type="text"
              {...register('eventLocation')}
              aria-invalid={!!errors.eventLocation}
              aria-describedby={errors.eventLocation ? "eventLocation-error" : undefined}
              className={`w-full rounded-lg px-3 py-2 bg-brand-midnight/20 border 
                          ${errors.eventLocation ? 'border-red-500' : 'border-brand-champagne/30'} 
                          text-brand-champagne placeholder-brand-champagne/50 focus:outline-none 
                          focus:ring-2 focus:ring-brand-gold/70 text-sm`}
              placeholder="City / Venue"
            />
            {errors.eventLocation && (
              <p id="eventLocation-error" className="mt-0.5 text-xs text-brand-champagne">
                {errors.eventLocation.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="eventType" className="block font-sans uppercase tracking-wide text-xs text-brand-champagne mb-1">
              Event Type*
            </label>
            <Controller
              name="eventType"
              control={control}
              render={({ field }: { field: ControllerRenderProps<ContactFormData, 'eventType'> }) => (
                <Listbox
                  value={field.value}
                  onChange={field.onChange}
                >
                  <div className="relative">
                    <Listbox.Button
                      className={`relative w-full rounded-lg px-3 py-2 bg-brand-midnight/20 border 
                                 ${errors.eventType ? 'border-red-500' : 'border-brand-champagne/30'} 
                                 text-left text-brand-champagne focus:outline-none focus:ring-2 focus:ring-brand-gold/70 text-sm`}
                      aria-invalid={!!errors.eventType}
                      aria-describedby={errors.eventType ? "eventType-error" : undefined}
                    >
                      <span className={`block truncate ${!field.value ? 'text-brand-champagne/50' : ''}`}>
                        {field.value || 'Select an option'}
                      </span>
                      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronUpDownIcon className="h-4 w-4 text-brand-champagne/70" aria-hidden="true" />
                      </span>
                    </Listbox.Button>
                    <Transition
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <Listbox.Options className="absolute z-10 mt-1 max-h-40 w-full overflow-auto rounded-md bg-brand-midnight-blue py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        {eventTypes.map((type, typeIdx) => (
                          <Listbox.Option
                            key={typeIdx}
                            className={({ active }) =>
                              `relative cursor-default select-none py-1.5 pl-8 pr-4 ${
                                active ? 'bg-brand-midnight/40 text-brand-gold' : 'text-brand-champagne'
                              }`
                            }
                            value={type}
                          >
                            {({ selected, active }) => (
                              <>
                                <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                  {type}
                                </span>
                                {selected ? (
                                  <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-brand-gold">
                                    <CheckIcon className="h-4 w-4" aria-hidden="true" />
                                  </span>
                                ) : null}
                              </>
                            )}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </Transition>
                  </div>
                </Listbox>
              )}
            />
            {errors.eventType && (
              <p id="eventType-error" className="mt-0.5 text-xs text-brand-champagne">
                {errors.eventType.message}
              </p>
            )}
          </div>

          {/* Full width message */}
          <div className="md:col-span-3">
            <label htmlFor="message" className="block font-sans uppercase tracking-wide text-xs text-brand-champagne mb-1">
              Message*
            </label>
            <textarea
              id="message"
              rows={3}
              {...register('message')}
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? "message-error" : undefined}
              className={`w-full rounded-lg px-3 py-2 bg-brand-midnight/20 border 
                          ${errors.message ? 'border-red-500' : 'border-brand-champagne/30'} 
                          text-brand-champagne placeholder-brand-champagne/50 focus:outline-none 
                          focus:ring-2 focus:ring-brand-gold/70 text-sm`}
              placeholder="Tell us about your event and how we can help..."
            />
            {errors.message && (
              <p id="message-error" className="mt-0.5 text-xs text-brand-champagne">
                {errors.message.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-center pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-brand-gold hover:bg-brand-gold/80 text-brand-black rounded-lg 
                      font-sans font-bold uppercase tracking-wide text-sm transition-colors duration-200 
                      focus:outline-none focus:ring-2 focus:ring-brand-gold/70 focus:ring-offset-2 
                      focus:ring-offset-brand-black disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-brand-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </span>
            ) : (
              'Send Enquiry'
            )}
          </button>
        </div>
      </form>

      <Toast 
        show={toast.show}
        message={toast.message}
        onClose={hideToast}
      />
    </div>
  );
};

export default EnquiryForm; 