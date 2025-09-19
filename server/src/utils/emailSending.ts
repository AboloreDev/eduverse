import AppError from "./appError";
import { mailTrapClient, sender } from "./email";
import { VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplate";

export const sendVerificationEmail = async (
  email: string,
  verificationToken: string
) => {
  const recipient = [{ email }];

  try {
    const response = await mailTrapClient.send({
      from: sender,
      to: recipient,
      subject: "Verify your email address",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationToken
      ),
      category: "Email Verification",
    });
  } catch (error) {
    return new AppError(`Error sending verification mail: ${error}`, 500);
  }
};
