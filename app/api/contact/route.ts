import { NextResponse } from 'next/server';
import { z } from 'zod';

// Define schema for contact form validation
const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  eventDate: z.string().min(1, "Event date is required"),
  eventType: z.string().min(1, "Event type is required"),
  eventLocation: z.string().optional(),
  message: z.string().min(1, "Message is required")
});

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json();
    
    // Validate the request body against our schema
    const validatedData = contactSchema.parse(body);
    
    // Here you would typically send an email or save to a database
    // For this implementation, we'll just simulate a successful response
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return successful response
    return NextResponse.json({ 
      success: true, 
      message: "Contact form submitted successfully!" 
    });
    
  } catch (error) {
    // If validation fails or any other error occurs
    if (error instanceof z.ZodError) {
      // Return validation errors
      return NextResponse.json(
        { 
          success: false, 
          message: "Validation failed", 
          errors: error.errors 
        }, 
        { status: 400 }
      );
    }
    
    // Return generic error
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to submit contact form" 
      }, 
      { status: 500 }
    );
  }
} 