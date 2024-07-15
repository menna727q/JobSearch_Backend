import nodemailer from 'nodemailer'

export const sendEmail = async ({ to = [], html='', text='', subject='' }) => {

    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL, // generated ethereal user
            pass: process.env.PASSWORD, // generated ethereal password
        },
    });

    let info = await transporter.sendMail({
        from: `<${process.env.EMAIL}>`, // sender address
        to, // list of receivers
        subject, // Subject line
        text, // plain text body
        html, // html body
    });
    if (info.rejected.length) {
        return false
    }
    return true
    // }

}
