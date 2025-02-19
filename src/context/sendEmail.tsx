



import emailjs from "emailjs-com";

export const sendEmail = async (fullname,email, otp) => {
  const templateParams = {
    to_name: fullname,
    to_email: email,
    gang:"StudentHub",
    OTP: otp,

  };

  try {
    await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID, 
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID, 
      templateParams, 
      import.meta.env.VITE_EMAILJS_USER_ID
    );
  } catch (error) {
    throw new Error("Email sending failed.");
  }
};