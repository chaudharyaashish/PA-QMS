const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Email templates
const emailTemplates = {
    appointmentCreated: (userName, doctorName, date, time, reason) => ({
        subject: 'Appointment Request Received',
        html: `
            <h2>Appointment Request Confirmation</h2>
            <p>Dear ${userName},</p>
            <p>We have received your appointment request with Dr. ${doctorName}.</p>
            <p><strong>Date:</strong> ${date}</p>
            <p><strong>Time:</strong> ${time}</p>
            <p><strong>Reason:</strong> ${reason}</p>
            <p>Your appointment is currently pending approval from the doctor. You will receive another email once it's approved.</p>
            <p>If you need to reschedule or cancel, please do so through our website.</p>
            <p>Best regards,<br>Medical Center Team</p>
        `
    }),

    appointmentApproved: (userName, doctorName, date, time) => ({
        subject: 'Appointment Approved',
        html: `
            <h2>Appointment Confirmation</h2>
            <p>Dear ${userName},</p>
            <p>Your appointment with Dr. ${doctorName} has been approved.</p>
            <p><strong>Date:</strong> ${date}</p>
            <p><strong>Time:</strong> ${time}</p>
            <p>Please arrive 15 minutes before your scheduled time.</p>
            <p>If you need to reschedule or cancel, please do so at least 24 hours in advance.</p>
            <p>Best regards,<br>Medical Center Team</p>
        `
    }),

    appointmentCancelled: (userName, doctorName, date, time, reason) => ({
        subject: 'Appointment Cancelled',
        html: `
            <h2>Appointment Cancellation Notice</h2>
            <p>Dear ${userName},</p>
            <p>Your appointment with Dr. ${doctorName} scheduled for:</p>
            <p><strong>Date:</strong> ${date}</p>
            <p><strong>Time:</strong> ${time}</p>
            <p>has been cancelled${reason ? ` due to: ${reason}` : ''}.</p>
            <p>Please visit our website to schedule a new appointment.</p>
            <p>We apologize for any inconvenience caused.</p>
            <p>Best regards,<br>Medical Center Team</p>
        `
    }),

    appointmentRescheduled: (userName, doctorName, oldDate, oldTime, newDate, newTime, reason) => ({
        subject: 'Appointment Rescheduled',
        html: `
            <h2>Appointment Rescheduling Confirmation</h2>
            <p>Dear ${userName},</p>
            <p>Your appointment with Dr. ${doctorName} has been rescheduled:</p>
            <p><strong>From:</strong> ${oldDate} at ${oldTime}</p>
            <p><strong>To:</strong> ${newDate} at ${newTime}</p>
            <p><strong>Reason:</strong> ${reason || 'Not specified'}</p>
            <p>If this new time doesn't work for you, please reschedule or cancel through our website.</p>
            <p>Best regards,<br>Medical Center Team</p>
        `
    }),

    appointmentCancelledByUser: (userName, doctorName, date, time) => ({
        subject: 'Appointment Cancellation Confirmation',
        html: `
            <h2>Appointment Cancellation Confirmation</h2>
            <p>Dear ${userName},</p>
            <p>You have successfully cancelled your appointment with Dr. ${doctorName} scheduled for:</p>
            <p><strong>Date:</strong> ${date}</p>
            <p><strong>Time:</strong> ${time}</p>
            <p>If you wish to schedule a new appointment, please visit our website.</p>
            <p>Thank you for letting us know in advance.</p>
            <p>Best regards,<br>Medical Center Team</p>
        `
    }),

    appointmentStatusUpdated: (userName, doctorName, date, time, status, notes) => ({
        subject: 'Appointment Status Updated',
        html: `
            <h2>Appointment Status Update</h2>
            <p>Dear ${userName},</p>
            <p>Your appointment with Dr. ${doctorName} scheduled for:</p>
            <p><strong>Date:</strong> ${date}</p>
            <p><strong>Time:</strong> ${time}</p>
            <p>has been updated to status: <strong>${status}</strong></p>
            ${notes ? `<p><strong>Doctor's Notes:</strong> ${notes}</p>` : ''}
            <p>If you have any questions, please contact our medical center.</p>
            <p>Best regards,<br>Medical Center Team</p>
        `
    })
};

// Reusable general-purpose email sending function
const sendMail = async ({ to, subject, html }) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            html
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('📧 Email Sent Successfully');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('To:', to);
        console.log('Subject:', subject);
        console.log('Message ID:', info.messageId);
        console.log('Response:', info.response);
        console.log('Accepted Recipients:', info.accepted);
        console.log('Timestamp:', new Date().toISOString());
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        return true;
    } catch (error) {
        console.error('❌ Email Sending Failed');
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.error('To:', to);
        console.error('Subject:', subject);
        console.error('Error Code:', error.code);
        console.error('Error Message:', error.message);
        console.error('Timestamp:', new Date().toISOString());
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        return false;
    }
};

// Optional wrapper using predefined templates
const sendEmail = async (to, template) => {
    return await sendMail({
        to,
        subject: template.subject,
        html: template.html
    });
};

module.exports = {
    sendEmail,      // Send from template
    sendMail,       // Send with raw subject/html
    emailTemplates  // Export templates for reuse
};