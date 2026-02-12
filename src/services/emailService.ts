import emailjs from '@emailjs/browser';

// Configuración - OBTÉN ESTOS DATOS DE TU DASHBOARD EMAILJS
const EMAILJS_CONFIG = {
    SERVICE_ID: 'service_1md5ngj', // En "Email Services"
    TEMPLATE_ID: 'template_wzupxl8', // En "Email Templates"
    PUBLIC_KEY: 'ddEdaiJ5A0r8_FD28' // En "Account" → API Keys
};

// Inicializar EmailJS
emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);

export const sendVerificationEmail = async (
    userEmail: string,
    userName: string,
    verificationToken: string
): Promise<boolean> => {
    try {
        const verificationLink = `http://localhost:5173/verify?token=${verificationToken}`; 

        const templateParams = {
            email: userEmail,
            name: userName,
            verification_link: verificationLink,
            year: new Date().getFullYear()
        };

        const response = await emailjs.send(
            EMAILJS_CONFIG.SERVICE_ID,
            EMAILJS_CONFIG.TEMPLATE_ID,
            templateParams
        );

        console.log('Email enviado:', response.status, response.text);
        return true;

    } catch (error) {
        console.error('Error enviando email:', error);
        return false;
    }
};

export const sendWelcomeEmail = async (userEmail: string, userName: string) => {
    try {
        const templateParams = {
            to_email: userEmail,
            name: userName,
            year: new Date().getFullYear()
        };

        await emailjs.send(
            EMAILJS_CONFIG.SERVICE_ID,
            'template_welcome_id', // Crea otra plantilla
            templateParams
        );

        return true;
    } catch (error) {
        console.error('Error enviando welcome email:', error);
        return false;
    }
};