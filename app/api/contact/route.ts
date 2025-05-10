import { NextResponse } from 'next/server';
import { z } from 'zod';
import { Resend } from 'resend';

// Define schema for contact form validation
const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  eventDate: z.union([z.string().min(1, "Event date is required"), z.date()]).optional(), // Accept both string and Date for compatibility
  eventType: z.string().min(1, "Event type is required").optional(),  // Made optional for compatibility with the simpler form
  eventLocation: z.string().optional(),
  message: z.string().min(1, "Message is required")
});

export async function POST(request: Request) {
  console.log('Contact API route called');
  const requestUrl = request.url;
  console.log('Request URL:', requestUrl);
  
  // Add CORS headers to make sure the API can be called from different origins
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };
  
  try {
    // Parse the request body
    let body;
    try {
      body = await request.json();
      console.log('Request body received:', body);
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return NextResponse.json({ 
        success: false, 
        message: "Failed to parse request body",
        error: parseError instanceof Error ? parseError.message : "Unknown parsing error"
      }, { status: 400, headers });
    }
    
    // Validate the request body against our schema
    console.log('Validating form data...');
    let validatedData;
    try {
      validatedData = contactSchema.parse(body);
      console.log('Form data validated successfully');
    } catch (validationError) {
      console.error('Validation error:', validationError);
      if (validationError instanceof z.ZodError) {
        return NextResponse.json(
          { 
            success: false, 
            message: "Validation failed", 
            errors: validationError.errors
          }, 
          { status: 400, headers }
        );
      }
      throw validationError;
    }
    
    // Log email config (without sensitive data)
    console.log('Email configuration:', { 
      apiKeyConfigured: !!process.env.RESEND_API_KEY,
      contactEmailConfigured: !!process.env.CONTACT_EMAIL,
      contactEmail: process.env.CONTACT_EMAIL,
      fromEmailConfigured: !!process.env.FROM_EMAIL
    });
    
    // Initialize Resend
    console.log('Setting up Resend...');
    if (!process.env.RESEND_API_KEY) {
      console.error('Resend API key is not configured');
      return NextResponse.json({ 
        success: false, 
        message: "Email service not properly configured",
        error: "Missing API key"
      }, { status: 500, headers });
    }
    
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    // Format optional fields for the email
    const eventDateText = validatedData.eventDate 
      ? `<p><strong>Event Date:</strong> ${
          validatedData.eventDate instanceof Date 
            ? validatedData.eventDate.toLocaleDateString('en-GB') 
            : validatedData.eventDate
        }</p>` 
      : '';
    
    const eventTypeText = validatedData.eventType 
      ? `<p><strong>Event Type:</strong> ${validatedData.eventType}</p>` 
      : '';
      
    const eventLocationText = validatedData.eventLocation 
      ? `<p><strong>Event Location:</strong> ${validatedData.eventLocation}</p>` 
      : '';
    
    // Construct email content
    console.log('Constructing email content...');
    const emailHtml = `
<h2>New Contact Form Submission</h2>
<p><strong>Name:</strong> ${validatedData.name}</p>
<p><strong>Email:</strong> ${validatedData.email}</p>
${validatedData.phone ? `<p><strong>Phone:</strong> ${validatedData.phone}</p>` : ''}
${eventDateText}
${eventTypeText}
${eventLocationText}
<h3>Message:</h3>
<p>${validatedData.message.replace(/\n/g, '<br>')}</p>
    `;
    
    // Send the email
    console.log('Attempting to send email via Resend...');
    let emailResult;
    try {
      const data = await resend.emails.send({
        from: 'onboarding@resend.dev', // Fallback to the test sending identity
        to: process.env.CONTACT_EMAIL || '',
        subject: `New Contact Form Submission from ${validatedData.name}`,
        replyTo: validatedData.email,
        html: emailHtml,
        text: `
Name: ${validatedData.name}
Email: ${validatedData.email}
${validatedData.phone ? `Phone: ${validatedData.phone}` : ''}
${validatedData.eventDate ? `Event Date: ${
  validatedData.eventDate instanceof Date 
    ? validatedData.eventDate.toLocaleDateString('en-GB') 
    : validatedData.eventDate
}` : ''}
${validatedData.eventType ? `Event Type: ${validatedData.eventType}` : ''}
${validatedData.eventLocation ? `Event Location: ${validatedData.eventLocation}` : ''}

Message:
${validatedData.message}
        `,
      });
      
      console.log('Email sent successfully. Resend response:', data);
      emailResult = data;
      
      // Check for error in Resend response
      if (data.error) {
        console.error('Resend returned an error:', data.error);
        throw new Error(data.error.message || "Unknown error from email service");
      }
    } catch (emailError: any) {
      console.error('Resend email sending failed:', emailError.message);
      console.error('Error details:', emailError);
      throw emailError;
    }
    
    // Return successful response
    console.log('Returning success response');
    return NextResponse.json({ 
      success: true, 
      message: "Contact form submitted successfully!",
      debug: {
        emailSent: true,
        timestamp: new Date().toISOString(),
        to: process.env.CONTACT_EMAIL,
        resendResponse: emailResult
      }
    }, { headers });
    
  } catch (error: any) {
    console.error('Error in contact form submission:', error);
    
    // Return detailed error for debugging
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to submit contact form: " + (error.message || "Unknown error"),
        error: error.message,
        debug: {
          emailError: true,
          errorCode: error.code,
          errorMessage: error.message,
          errorName: error.name,
          timestamp: new Date().toISOString()
        },
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }, 
      { status: 500, headers }
    );
  }
} 