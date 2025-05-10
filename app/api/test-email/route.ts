import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function GET() {
  console.log('Test email API route called');
  
  // Only allow in development mode for security
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { success: false, message: 'This endpoint is only available in development mode' },
      { status: 403 }
    );
  }
  
  try {
    // Log email configuration
    console.log('Email configuration:', { 
      apiKeyConfigured: !!process.env.RESEND_API_KEY,
      contactEmailConfigured: !!process.env.CONTACT_EMAIL,
      fromEmailConfigured: !!process.env.FROM_EMAIL,
      contactEmail: process.env.CONTACT_EMAIL,
      fromEmail: process.env.FROM_EMAIL
    });
    
    // Set up Resend
    console.log('Setting up Resend...');
    if (!process.env.RESEND_API_KEY) {
      throw new Error('Resend API key is not configured');
    }
    
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    // Construct test email
    console.log('Constructing test email...');
    
    // Send the test email
    console.log('Sending test email via Resend...');
    const data = await resend.emails.send({
      from: process.env.FROM_EMAIL || '',
      to: process.env.CONTACT_EMAIL || '',
      subject: 'Test Email - Contact Form',
      html: '<h1>Test Email</h1><p>This is a test email to verify that your contact form email setup is working correctly.</p>',
      text: 'This is a test email to verify that your contact form email setup is working correctly.',
    });
    
    console.log('Test email sent successfully. Response:', data);
    
    // Return successful response
    return NextResponse.json({ 
      success: true, 
      message: "Test email sent successfully!",
      details: {
        from: process.env.FROM_EMAIL || '',
        to: process.env.CONTACT_EMAIL,
        data: data
      }
    });
    
  } catch (error: any) {
    console.error('Error sending test email:', error);
    
    const errorResponse = {
      success: false, 
      message: "Failed to send test email",
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    };
    
    return NextResponse.json(errorResponse, { status: 500 });
  }
} 