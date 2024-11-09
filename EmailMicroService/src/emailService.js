import nodemailer from "nodemailer"
import { google } from "googleapis"
import { config } from 'dotenv';

config()


export class EmailService {

    #userAuth;
    constructor() {
        const REDIRECT_URI = "https://developers.google.com/oauthplayground"

        this.#userAuth = new google.auth.OAuth2(
            process.env.CLIENT_ID,
            process.env.CLIENT_SECRET,
            REDIRECT_URI)

        this.#userAuth.setCredentials({ refresh_token: process.env.REFRESH_TOKEN })
    }


    async sendAccountConfirmationEmail(user) {
        try {

            const html = `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Confirmation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f0f8ff;
            color: #333;
            margin: 0;
            padding: 20px;
        }

        .container {
            max-width: 600px;
            margin: auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            padding: 30px;
        }

        h1 {
            color: #007bff;
            text-align: center;
        }

        p {
            font-size: 16px;
            line-height: 1.5;
            text-align: center;
        }

        .button {
            display: inline-block;
            margin: 20px auto;
            padding: 10px 20px;
            font-size: 16px;
            color: #ffffff;
            background-color: #007bff;
            text-decoration: none;
            border-radius: 5px;
            transition: background-color 0.3s;
        }

        .button:hover {
            background-color: #0056b3;
        }

        .footer {
            text-align: center;
            font-size: 12px;
            color: #777;
            margin-top: 20px;
        }

        .btn-send {
            width: 100px;
            padding: 10px;
            background-color: #0056b3;
            color: white;
            border: none;
            border-radius: 10px;
            margin: auto;
        }

        form {
            display: flex;
        }
    </style>
</head>

<body>
    <div class="container">
        <h1>Account Confirmation</h1>
        <p>Hello ${user.userName}</p>
        <p>Congratulations on signing up for Just Translate. <br> Click the button below to confirm your new account:</p>
        <form id="emailForm" action="http://localhost:8729/user/${user.userId}/confirm" method="GET">
            <button type="submit" class="btn-send">Send</button>
        </form>
        <p>If you have already confirmed your account, please ignore this email.</p>
        <p>Thank you!</p>
    </div>
    <div class="footer">
        <p>&copy; 2024 Just Translate. All rights reserved.</p>
    </div>
</body>
</html>
`

            const accessToken = await this.#userAuth
                .getAccessToken();

            const transport = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    type: 'OAuth2',
                    user: "rissardi.luiz2006@gmail.com",
                    password: "Fabio24031981",
                    clientId: process.env.CLIENT_ID,
                    clientSecret: process.env.CLIENT_SECRET,
                    refreshToken: process.env.REFRESH_TOKEN,
                    accessToken: accessToken,
                },
            });

            const mailOptions = {
                to: "rissardi.luiz2006@gmail.com",
                subject: 'Hello from gmail using API',
                text: 'Hello from gmail email using API',
                html: html,
            };

            const result = await transport.sendMail(mailOptions);
            return result;
        } catch (error) {
            console.log(error);
        }
    }

}

