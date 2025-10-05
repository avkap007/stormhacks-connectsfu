import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { to, name, eventTitle, eventId } = await request.json();

    if (!to || !name || !eventTitle) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create a beautiful email template
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>RSVP Confirmation - ConnectSFU</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #414B9E 0%, #9792CB 100%); padding: 30px; border-radius: 15px 15px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🎉 ConnectSFU</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Your Campus Community Platform</p>
          </div>
          
          <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-top: none;">
            <h2 style="color: #414B9E; margin-top: 0;">RSVP Confirmed!</h2>
            
            <p>Hi ${name},</p>
            
            <p>Great news! Your RSVP for <strong>${eventTitle}</strong> has been confirmed. We're excited to see you there!</p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #414B9E;">
              <h3 style="margin-top: 0; color: #414B9E;">Event Details</h3>
              <p style="margin: 5px 0;"><strong>Event:</strong> ${eventTitle}</p>
              <p style="margin: 5px 0;"><strong>Event ID:</strong> ${eventId}</p>
              <p style="margin: 5px 0;"><strong>Status:</strong> Confirmed ✅</p>
            </div>
            
            <p>Don't forget to:</p>
            <ul>
              <li>Add the event to your calendar</li>
              <li>Check for any updates from the event organizers</li>
              <li>Arrive a few minutes early to check in</li>
            </ul>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="http://localhost:3000/events" style="background: #414B9E; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
                View All Events
              </a>
            </div>
            
            <p>If you have any questions or need to make changes to your RSVP, please contact the event organizers.</p>
            
            <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
            
            <p style="font-size: 14px; color: #666; text-align: center;">
              This email was sent from ConnectSFU - Find Your Campus Community<br>
              <a href="http://localhost:3000" style="color: #414B9E;">Visit ConnectSFU</a>
            </p>
          </div>
        </body>
      </html>
    `;

    const { data, error } = await resend.emails.send({
      from: 'ConnectSFU <onboarding@resend.dev>',
      to: [to],
      subject: `🎉 RSVP Confirmed: ${eventTitle}`,
      html: emailHtml,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      messageId: data?.id,
      message: 'Email sent successfully' 
    });

  } catch (error) {
    console.error('Email API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
