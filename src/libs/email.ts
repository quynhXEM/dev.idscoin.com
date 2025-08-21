export const EmailVerifyEmail = (lang: string, username : string, base64 : string, email : string) => {
    const url = process.env.NEXT_PUBLIC_WEB_URL + username + '/verify?token=' + base64;
  if (lang == "vi-VN") {
    return `<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Xác minh địa chỉ email</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f4f4f4;">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    <tr>
                        <td align="center" style="padding: 40px 30px 20px 30px;">
                            <h1 style="margin: 0; color: #333333; font-size: 28px; font-weight: bold;">
                                Xác minh địa chỉ email
                            </h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 0 30px 20px 30px;">
                            <p style="margin: 0 0 20px 0; color: #666666; font-size: 16px; line-height: 1.6; text-align: center;">
                                Vui lòng bấm vào nút ngay bên dưới để xác minh bạn là chủ sở hữu của địa chỉ email [${email}]:
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding: 20px 30px;">
                            <a href="${url}" style="display: inline-block; text-decoration: none;">
                                <img 
                                    src="https://i.imgur.com/wIkhR7f.png" 
                                    alt="Click để xác minh email" 
                                    width="300" 
                                    height="100" 
                                    style="border: 3px solid #4CAF50; border-radius: 12px; cursor: pointer;"
                                />
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 20px 30px;">
                            <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 4px; padding: 15px;">
                                <p style="margin: 0; color: #856404; font-size: 13px; line-height: 1.5;">
                                    <strong>⚠️ Lưu ý:</strong> Liên kết xác minh chỉ có giá trị trong vòng 24 giờ.
                                </p>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 30px; text-align: center; border-top: 1px solid #eeeeee;">
                            <p style="margin: 0 0 10px 0; color: #999999; font-size: 12px;">
                                Email này được gửi từ hệ thống tự động, vui lòng không reply.
                            </p>
                            <p style="margin: 0; color: #999999; font-size: 12px;">
                                © ${new Date().getFullYear()} <a href="${process.env.NEXT_PUBLIC_WEB_URL}" style="color: #999999; text-decoration: none;">IDS Coin</a>.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
  } else {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email Address</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f4f4f4;">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    <tr>
                        <td align="center" style="padding: 40px 30px 20px 30px;">
                            <h1 style="margin: 0; color: #333333; font-size: 28px; font-weight: bold;">
                                Verify Your Email Address
                            </h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 0 30px 20px 30px;">
                            <p style="margin: 0 0 20px 0; color: #666666; font-size: 16px; line-height: 1.6; text-align: center;">
                                Please click the button below to confirm that you are the owner of the email address [${email}]:
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding: 20px 30px;">
                            <a href="${url}" style="display: inline-block; text-decoration: none;">
                                <img 
                                    src="https://i.imgur.com/wIkhR7f.png" 
                                    alt="Click to verify your email" 
                                    width="300" 
                                    height="100" 
                                    style="border: 3px solid #4CAF50; border-radius: 12px; cursor: pointer;"
                                />
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 20px 30px;">
                            <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 4px; padding: 15px;">
                                <p style="margin: 0; color: #856404; font-size: 13px; line-height: 1.5;">
                                    <strong>⚠️ Note:</strong> The verification link is valid for 24 hours only.
                                </p>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 30px; text-align: center; border-top: 1px solid #eeeeee;">
                            <p style="margin: 0 0 10px 0; color: #999999; font-size: 12px;">
                                This email was sent automatically, please do not reply.
                            </p>
                            <p style="margin: 0; color: #999999; font-size: 12px;">
                                © ${new Date().getFullYear()} <a href="${process.env.NEXT_PUBLIC_WEB_URL}" style="color:rgb(21, 83, 255); text-decoration: none;">IDS Coin</a>.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;
  }
};
