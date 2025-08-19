export const EmailVerifyEmail = (lang: string, username : string, base64 : string) => {
    const url = process.env.NEXT_PUBLIC_WEB_URL + username + '/verify?token=' + base64;
  if (lang == "vi-VN") {
    return `<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Xác thực Email IDS Coin</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f4f4f4;">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    <tr>
                        <td align="center" style="padding: 40px 30px 20px 30px;">
                            <h1 style="margin: 0; color: #333333; font-size: 28px; font-weight: bold;">
                                Xác thực Email của bạn
                            </h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 0 30px 20px 30px;">
                            <p style="margin: 0 0 20px 0; color: #666666; font-size: 16px; line-height: 1.6; text-align: center;">
                                Chào mừng bạn! Để nhận được 1 IDS Coin, vui lòng click vào hình ảnh bên dưới để xác thực email của bạn.
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding: 20px 30px;">
                            <a href="${url}" style="display: inline-block; text-decoration: none;">
                                <img 
                                    src="https://picsum.photos/300/200" 
                                    alt="Click để xác thực email" 
                                    width="300" 
                                    height="300" 
                                    style="border: 3px solid #4CAF50; border-radius: 12px; cursor: pointer;"
                                />
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 20px 30px;">
                            <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 4px; padding: 15px;">
                                <p style="margin: 0; color: #856404; font-size: 13px; line-height: 1.5;">
                                    <strong>⚠️ Lưu ý bảo mật:</strong> Link xác thực này sẽ hết hạn sau 24 giờ. Nếu bạn không yêu cầu xác thực email này, vui lòng bỏ qua email này.
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
                                © ${new Date().getFullYear()} IDS Coin.
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
    <title>Email Verification - IDS Coin</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f4f4f4;">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    <tr>
                        <td align="center" style="padding: 40px 30px 20px 30px;">
                            <h1 style="margin: 0; color: #333333; font-size: 28px; font-weight: bold;">
                                Verify Your Email
                            </h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 0 30px 20px 30px;">
                            <p style="margin: 0 0 20px 0; color: #666666; font-size: 16px; line-height: 1.6; text-align: center;">
                                Welcome! To receive 1 IDS Coin, please click on the image below to verify your email.
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding: 20px 30px;">
                            <a href="${url}" style="display: inline-block; text-decoration: none;">
                                <img 
                                    src="https://picsum.photos/300/200" 
                                    alt="Click to verify your email" 
                                    width="300" 
                                    height="300" 
                                    style="border: 3px solid #4CAF50; border-radius: 12px; cursor: pointer;"
                                />
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 20px 30px;">
                            <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 4px; padding: 15px;">
                                <p style="margin: 0; color: #856404; font-size: 13px; line-height: 1.5;">
                                    <strong>⚠️ Security Notice:</strong> This verification link will expire in 24 hours. If you did not request this verification, please ignore this email.
                                </p>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 30px; text-align: center; border-top: 1px solid #eeeeee;">
                            <p style="margin: 0 0 10px 0; color: #999999; font-size: 12px;">
                                This is an automated message, please do not reply.
                            </p>
                            <p style="margin: 0; color: #999999; font-size: 12px;">
                                © ${new Date().getFullYear()} IDS Coin.
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
