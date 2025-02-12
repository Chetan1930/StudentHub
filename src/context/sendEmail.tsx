



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
     "service_cujcmqs", 
     "template_5b2p0am", 
      templateParams, 
      "FpUffqPZlmZCsmpdh"
    );
  } catch (error) {
    throw new Error("Email sending failed.");
  }
};