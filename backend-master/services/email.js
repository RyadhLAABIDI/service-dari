import nodemailer from "nodemailer";

const message = `
Welcome to home-service\n\n\n
 Thank you for joining us.
\nThank you again for choosing home-service.`;

const sendEmail = async (option) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "bilelyousfi101@gmail.com",
        pass: "xboqnybtwnjcxury",
      },
    });

    const mailOptions = {
      from: "home-service",
      to: option.email,
      subject: option.subject,
      text: option.text || message, // Utilisez `option.text` si fourni, sinon utilisez `message`
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.error("Error sending email: ", error);
    throw new Error("Failed to send email");
  }
};

export default sendEmail;
