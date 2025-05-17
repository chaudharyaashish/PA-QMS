// services/emailService.js
const sgMail = require('@sendgrid/mail');
const logger = require('./logger'); // Assuming you have a logging service

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

class EmailService {
  static async sendEmail(to, subject, text, html) {
    try {
      const msg = {
        to,
        from: process.env.FROM_EMAIL,
        subject,
        text,
        html,
      };
      await sgMail.send(msg);
      logger.info(`Email sent successfully to ${to}`);
      return true;
    } catch (error) {
      logger.error(`Email sending failed: ${error.message}`);
      throw error;
    }
  }

  // Email template for appointment approval
  static async sendAppointmentApproval(userEmail, appointmentDetails) {
    const subject = 'Your Appointment Has Been Approved';
    const text = `Your appointment scheduled for ${appointmentDetails.date} at ${appointmentDetails.time} has been approved.`;
    const html = `
      <h2>Appointment Approved</h2>
      <p>Dear ${appointmentDetails.userName},</p>
      <p>Your appointment has been approved with the following details:</p>
      <ul>
        <li>Date: ${appointmentDetails.date}</li>
        <li>Time: ${appointmentDetails.time}</li>
        <li>Doctor: Dr. ${appointmentDetails.doctorName}</li>
      </ul>
      <p>Please arrive 15 minutes before your scheduled time.</p>
    `;
    
    return this.sendEmail(userEmail, subject, text, html);
  }

  // Email template for appointment rejection
  static async sendAppointmentRejection(userEmail, appointmentDetails) {
    const subject = 'Appointment Status Update';
    const text = `Your appointment request has been declined. Please contact our support team for assistance.`;
    const html = `
      <h2>Appointment Status Update</h2>
      <p>Dear ${appointmentDetails.userName},</p>
      <p>Unfortunately, your appointment request for ${appointmentDetails.date} could not be accommodated.</p>
      <p>Please contact our support team at ${process.env.SUPPORT_EMAIL} to discuss alternative options.</p>
      <p>We apologize for any inconvenience caused.</p>
    `;
    
    return this.sendEmail(userEmail, subject, text, html);
  }

  // Email template for prescription updates
  static async sendPrescriptionNotification(userEmail, prescriptionDetails) {
    const subject = 'Prescription Update';
    const text = `Your prescription has been ${prescriptionDetails.isNew ? 'added' : 'updated'}.`;
    const html = `
      <h2>Prescription ${prescriptionDetails.isNew ? 'Added' : 'Updated'}</h2>
      <p>Dear ${prescriptionDetails.userName},</p>
      <p>Your prescription has been ${prescriptionDetails.isNew ? 'added' : 'updated'} with the following details:</p>
      <ul>
        ${prescriptionDetails.medications.map(med => `
          <li>
            ${med.medication} - ${med.dosage}
            <br>Frequency: ${med.frequency}
            <br>Duration: ${med.duration}
          </li>
        `).join('')}
      </ul>
      <p>Additional Notes: ${prescriptionDetails.additionalNotes || 'None'}</p>
    `;
    
    return this.sendEmail(userEmail, subject, text, html);
  }

  // Email template for turn notification
  static async sendTurnNotification(userEmail, appointmentDetails) {
    const subject = 'It\'s Your Turn!';
    const text = `It's your turn for your appointment. Please proceed.`;
    const html = `
      <h2>It's Your Turn!</h2>
      <p>Dear ${appointmentDetails.userName},</p>
      <p>It's now your turn for your appointment scheduled for ${appointmentDetails.date} at ${appointmentDetails.time}.</p>
      <p>Please proceed to:</p>
      <p><strong>Room: ${appointmentDetails.room}</strong></p>
      <p>If you're not currently at the clinic, please arrive as soon as possible.</p>
    `;
    
    return this.sendEmail(userEmail, subject, text, html);
  }
}

module.exports = EmailService;