import { MailtrapClient } from "mailtrap";
import dotenv from "dotenv";

dotenv.config();

const TOKEN = process.env.MAILTRAP_TOKEN as string;

export const mailTrapClient = new MailtrapClient({
  token: TOKEN,
});

export const sender = {
  email: "vikingwithguns@gmail.com",
  name: "EduVerse",
};
