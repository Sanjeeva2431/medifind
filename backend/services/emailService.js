// MediFind Brevo Email Service Integration
// Uses Brevo (Sendinblue) Transactional Email API (v3)

export const sendEmail = async ({ to, subject, htmlContent, textContent }) => {
    const apiKey = process.env.BREVO_API_KEY;
    const senderEmail = process.env.BREVO_SENDER_EMAIL;
    const senderName = process.env.BREVO_SENDER_NAME || 'medifind';

    if (!apiKey) {
        console.warn('⚠️ BREVO_API_KEY is not configured in process.env');
        return { success: false, message: 'BREVO_API_KEY missing.' };
    }

    const payload = {
        sender: { name: senderName, email: senderEmail },
        to: Array.isArray(to) ? to.map(email => ({ email })) : [{ email: to }],
        subject,
        htmlContent: htmlContent || `<p>${textContent || ''}</p>`,
        ...(textContent && { textContent })
    };

    try {
        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'api-key': apiKey,
                'content-type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok) {
            console.log('📧 Email sent successfully via Brevo API.');
            return { success: true, data };
        } else {
            console.error('❌ Brevo Email API error:', data.message || response.statusText);
            return { success: false, error: data };
        }
    } catch (err) {
        console.error('❌ Failed to send email via Brevo:', err.message);
        return { success: false, error: err.message };
    }
};
