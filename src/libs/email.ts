export const EmailVerifyEmail = (lang: string, username : string, base64 : string, email : string) => {
    const url = process.env.NEXT_PUBLIC_WEB_URL + username + '/verify?token=' + base64;
  if (lang == "vi-VN") {
    return `<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<style>
		table,
		td,
		th {
			border-collapse: collapse;
		}

		div,
		a,
		b,
		h1,
		h2,
		h3,
		h4,
		h5,
		h6,
		p,
		td,
		body,
		span {
			font-family: 'Open Sans', Arial, Helvetica, sans-serif !important;
		}

		a {
			text-decoration: none !important;
		}

		@media (max-width: 600px) {
			.mobile-stack {
				display: block !important;
				width: 100% !important;
				padding-left: 0 !important;
				padding-right: 0 !important;
				text-align: center !important;
			}

			.mobile-center {
				text-align: center !important;
			}

			td {
				border-radius: 0 !important;
			}

			.container-mobile {
				padding: 0 !important;
				border-radius: 0 !important;
			}

			.mobile-button {
				display: block !important;
				width: calc(100% - 40px) !important;
				margin: 10px 20px !important;
				text-align: center !important;
				box-sizing: border-box !important;
			}
		}
	</style>
</head>
<div style="margin: 0; background-color: #f5f5f5;">
	<!-- Main Container Table -->
	<table width="100%" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
		<tr>
			<td style="background: #3f3f4c; border-radius: 8px; padding: 50px 60px;"
				class="container-mobile container-mobile-header">

				<!-- Header Section -->
				<table width="100%" cellpadding="0" cellspacing="0">
					<tr>
						<td
							style="text-align: center; color: #fff; background-color: #121316; border-radius: 14px; margin-bottom: 20px;">
							<div style="padding: 24px;">
								<img
									src="https://cdn.nobody.network/assets/5c74bc70-c141-403f-86db-4825addc93c3/nobody-network-dark.jpg?height=120"
									alt="Nobody Network Logo" style="max-width: 180px; display: block; margin: 0 auto 20px;">
								<h1 style="margin: 14px 0 25px 0; font-size: 28px; font-weight: 600; line-height: normal; color: #fff;">
									Xác minh địa chỉ email</h1>
								<p style="font-size: 16px; line-height: 24px; margin: 0 0 15px; color: #fff;">
									Cảm ơn bạn đã tham gia vào hệ sinh thái Nobody Network. Vui lòng xác minh địa chỉ email của bạn bằng cách bấm vào nút bên dưới.</p>
							</div>
						</td>
					</tr>
				</table>

				<!-- Spacing -->
				<table width="100%" cellpadding="0" cellspacing="0">
					<tr>
						<td style="height: 20px;"></td>
					</tr>
				</table>

				<!-- Verification Button Section -->
				<table width="100%" cellpadding="0" cellspacing="0">
					<tr>
						<td style="text-align: center; background: #121316; border-radius: 14px; padding: 30px;">
							<a href="${url}" target="_blank"
								style="background: linear-gradient(-30deg, #17cdd8, #8b5cf6, #17cdd8); color: #fff!important; font-size: 16px; font-weight: 600; line-height: 20px; border-radius: 50px; padding: 15px 40px; text-decoration: none; display: inline-block; margin: 20px 0;" class="mobile-button">✅ Xác minh email ngay</a>
							<p style="color: #9f9fa7; font-size: 14px; line-height: 20px; margin: 20px 0 0; text-align: center;">
								<strong style="color: #fff;">⚠️ Lưu ý:</strong> Link xác minh sẽ hết hạn sau 24 giờ
							</p>
						</td>
					</tr>
				</table>

				<!-- Footer Text -->
				<table width="100%" cellpadding="0" cellspacing="0">
					<tr>
						<td style="color: #ffffff!important; font-size: 14px; text-align: center; padding: 20px;">
							Nếu bạn không thực hiện yêu cầu, hãy bỏ qua email này.<br><br>
							Để được hỗ trợ, vui lòng liên hệ <a href="mailto:zero@nobody.network" style="color: #17cdd8;">zero@nobody.network</a>
						</td>
					</tr>
				</table>

				<!-- Footer Links -->
				<table width="100%" cellpadding="0" cellspacing="0">
					<tr>
						<td style="border-top: 1px solid #4e4e52; padding: 10px 20px; text-align: center; margin: 0 20px;">
							<a href="https://www.nobody.network" target="_blank"
								style="color: #91919a; font-size: 14px; text-decoration: none; margin: 0 10px;">Truy cập
								nobody.network</a>
							<span style="color: #91919a; ">|</span>
							<a href="/unsubscribe" style="color: #91919a; font-size: 14px; text-decoration: none; margin: 0 10px;">Hủy
								đăng ký</a>
						</td>
					</tr>
				</table>

				<!-- Final Footer Text -->
				<table width="100%" cellpadding="0" cellspacing="0">
					<tr>
						<td style="color: #fff; text-align: center; font-size: 14px;">
							Email này được gửi bởi Nobody Network.
						</td>
					</tr>
				</table>

			</td>
		</tr>
	</table>
</div>`;
  } else {
    return `<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<style>
		table,
		td,
		th {
			border-collapse: collapse;
		}

		div,
		a,
		b,
		h1,
		h2,
		h3,
		h4,
		h5,
		h6,
		p,
		td,
		body,
		span {
			font-family: 'Open Sans', Arial, Helvetica, sans-serif !important;
		}

		a {
			text-decoration: none !important;
		}

		@media (max-width: 600px) {
			.mobile-stack {
				display: block !important;
				width: 100% !important;
				padding-left: 0 !important;
				padding-right: 0 !important;
				text-align: center !important;
			}

			.mobile-center {
				text-align: center !important;
			}

			td {
				border-radius: 0 !important;
			}

			.container-mobile {
				padding: 0 !important;
				border-radius: 0 !important;
			}

			.mobile-button {
				display: block !important;
				width: calc(100% - 40px) !important;
				margin: 10px 20px !important;
				text-align: center !important;
				box-sizing: border-box !important;
			}
		}
	</style>
</head>
<div style="margin: 0; background-color: #f5f5f5;">
	<!-- Main Container Table -->
	<table width="100%" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
		<tr>
			<td style="background: #3f3f4c; border-radius: 8px; padding: 50px 60px;"
				class="container-mobile container-mobile-header">

				<!-- Header Section -->
				<table width="100%" cellpadding="0" cellspacing="0">
					<tr>
						<td
							style="text-align: center; color: #fff; background-color: #121316; border-radius: 14px; margin-bottom: 20px;">
							<div style="padding: 24px;">
								<img
									src="https://cdn.nobody.network/assets/5c74bc70-c141-403f-86db-4825addc93c3/nobody-network-dark.jpg?height=120"
									alt="Nobody Network Logo" style="max-width: 180px; display: block; margin: 0 auto 20px;">
								<h1 style="margin: 14px 0 25px 0; font-size: 28px; font-weight: 600; line-height: normal; color: #fff;">
									Verify email address</h1>
								<p style="font-size: 16px; line-height: 24px; margin: 0 0 15px; color: #fff;">
									Thank you for joining the Nobody Network ecosystem. Please verify your email address by clicking the button below.</p>
							</div>
						</td>
					</tr>
				</table>

				<!-- Spacing -->
				<table width="100%" cellpadding="0" cellspacing="0">
					<tr>
						<td style="height: 20px;"></td>
					</tr>
				</table>

				<!-- Verification Button Section -->
				<table width="100%" cellpadding="0" cellspacing="0">
					<tr>
						<td style="text-align: center; background: #121316; border-radius: 14px; padding: 30px;">
							<a href="${url}" target="_blank"
								style="background: linear-gradient(-30deg, #17cdd8, #8b5cf6, #17cdd8); color: #fff!important; font-size: 16px; font-weight: 600; line-height: 20px; border-radius: 50px; padding: 15px 40px; text-decoration: none; display: inline-block; margin: 20px 0;" class="mobile-button">✅ Verify Email Now</a>
							<p style="color: #9f9fa7; font-size: 14px; line-height: 20px; margin: 20px 0 0; text-align: center;">
								<strong style="color: #fff;">⚠️ Note:</strong> The verification link will expire in 24 hours.
							</p>
						</td>
					</tr>
				</table>

				<!-- Footer Text -->
				<table width="100%" cellpadding="0" cellspacing="0">
					<tr>
						<td style="color: #ffffff!important; font-size: 14px; text-align: center; padding: 20px;">
							If you did not make this request, please ignore this email.<br><br>
							For support, please contact <a href="mailto:zero@nobody.network" style="color: #17cdd8;">zero@nobody.network</a>
						</td>
					</tr>
				</table>

				<!-- Footer Links -->
				<table width="100%" cellpadding="0" cellspacing="0">
					<tr>
						<td style="border-top: 1px solid #4e4e52; padding: 10px 20px; text-align: center; margin: 0 20px;">
							<a href="https://www.nobody.network" target="_blank"
								style="color: #91919a; font-size: 14px; text-decoration: none; margin: 0 10px;">Visit nobody.network</a>
							<span style="color: #91919a; ">|</span>
							<a href="/unsubscribe" style="color: #91919a; font-size: 14px; text-decoration: none; margin: 0 10px;">Unsubscribe</a>
						</td>
					</tr>
				</table>

				<!-- Final Footer Text -->
				<table width="100%" cellpadding="0" cellspacing="0">
					<tr>
						<td style="color: #fff; text-align: center; font-size: 14px;">
							This email was sent by Nobody Network.
						</td>
					</tr>
				</table>

			</td>
		</tr>
	</table>
</div>
`;
  }
};
