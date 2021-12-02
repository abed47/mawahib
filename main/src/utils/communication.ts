import * as nodemailer from 'nodemailer';

export const sendEmail = (receiver: string, sender: string, topic: string, message: string) => {

    return new Promise((resolve, reject) => {
        
        let transporter = nodemailer.createTransport({
            host: 'staging.mawahib.tv',
            port: 25,
            secure: false,
            auth: {
                user: 'info@staging.mawahib.tv',
                pass: 'mawahib_info'
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        transporter.sendMail({
            from: '"Mawahib APP" <staging.mawahib.tv',
            to: receiver,
            subject: topic,
            text: message
        }).then(res =>resolve(res)).catch(err => reject(err));
    });
}