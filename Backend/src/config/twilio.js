import twilio from 'twilio';

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const sendOTP = async (phone, otp) => {
    return client.messages.create({
        body: `Mã OTP của bạn là: ${otp}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phone,
    });
};

export default sendOTP;
