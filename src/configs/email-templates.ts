import { Constants } from '@Utility/constants';

const EmailTemplates = [
	{
		code: Constants.EmailCodes.MY_PROFESSOR_EMAIL_VERIFY,
		body: `<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
  <head>
    <!--[if (gte mso 9)|(IE)]>
		<xml>
			<o:OfficeDocumentSettings>
				<o:AllowPNG/>
				<o:PixelsPerInch>96</o:PixelsPerInch>
			</o:OfficeDocumentSettings>
		</xml>
		<![endif]-->
    <meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- So that mobile will display zoomed in -->
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <!-- enable media queries for windows phone 8 -->
    <meta name="format-detection" content="telephone=no">
    <!-- disable auto telephone linking in iOS -->
    <meta name="format-detection" content="date=no">
    <!-- disable auto date linking in iOS -->
    <meta name="format-detection" content="address=no">
    <!-- disable auto address linking in iOS -->
    <meta name="format-detection" content="email=no">
    <!-- disable auto email linking in iOS -->
    <meta name="color-scheme" content="only">
    <title></title>
    <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&amp;display=swap" rel="stylesheet">
    <style type="text/css">
      /*Basics*/
      body {
        margin: 0px !important;
        padding: 0px !important;
        display: block !important;
        min-width: 100% !important;
        width: 100% !important;
        -webkit-text-size-adjust: none;
      }

      table {
        border-spacing: 0;
        mso-table-lspace: 0pt;
        mso-table-rspace: 0pt;
      }

      table td {
        border-collapse: collapse;
        mso-line-height-rule: exactly;
      }

      td img {
        -ms-interpolation-mode: bicubic;
        width: auto;
        max-width: auto;
        height: auto;
        margin: auto;
        display: block !important;
        border: 0px;
      }

      td p {
        margin: 0;
        padding: 0;
      }

      td div {
        margin: 0;
        padding: 0;
      }

      td a {
        text-decoration: none;
        color: inherit;
      }

      /*Outlook*/
      .ExternalClass {
        width: 100%;
      }

      .ExternalClass,
      .ExternalClass p,
      .ExternalClass span,
      .ExternalClass font,
      .ExternalClass td,
      .ExternalClass div {
        line-height: inherit;
      }

      .ReadMsgBody {
        width: 100%;
        background-color: #ffffff;
      }

      /* iOS BLUE LINKS */
      a[x-apple-data-detectors] {
        color: inherit !important;
        text-decoration: none !important;
        font-size: inherit !important;
        font-family: inherit !important;
        font-weight: inherit !important;
        line-height: inherit !important;
      }

      /*Gmail blue links*/
      u+#body a {
        color: inherit;
        text-decoration: none;
        font-size: inherit;
        font-family: inherit;
        font-weight: inherit;
        line-height: inherit;
      }

      /*Buttons fix*/
      .undoreset a,
      .undoreset a:hover {
        text-decoration: none !important;
      }

      .yshortcuts a {
        border-bottom: none !important;
      }

      .ios-footer a {
        color: #aaaaaa !important;
        text-decoration: none;
      }

      /*Responsive*/
      @media screen and (max-width:799px) {
        table.row {
          width: 100% !important;
          max-width: 100% !important;
        }

        td.row {
          width: 100% !important;
          max-width: 100% !important;
        }

        .img-responsive img {
          width: 100% !important;
          max-width: 100% !important;
          height: auto !important;
          margin: auto;
        }

        .center-float {
          float: none !important;
          margin: auto !important;
        }

        .center-text {
          text-align: center !important;
        }

        .container-padding {
          width: 100% !important;
          padding-left: 15px !important;
          padding-right: 15px !important;
        }

        .container-padding10 {
          width: 100% !important;
          padding-left: 10px !important;
          padding-right: 10px !important;
        }

        .hide-mobile {
          display: none !important;
        }

        .menu-container {
          text-align: center !important;
        }

        .autoheight {
          height: auto !important;
        }

        .m-padding-10 {
          margin: 10px 0 !important;
        }

        .m-padding-15 {
          margin: 15px 0 !important;
        }

        .m-padding-20 {
          margin: 20px 0 !important;
        }

        .m-padding-30 {
          margin: 30px 0 !important;
        }

        .m-padding-40 {
          margin: 40px 0 !important;
        }

        .m-padding-50 {
          margin: 50px 0 !important;
        }

        .m-padding-60 {
          margin: 60px 0 !important;
        }

        .m-padding-top10 {
          margin: 30px 0 0 0 !important;
        }

        .m-padding-top15 {
          margin: 15px 0 0 0 !important;
        }

        .m-padding-top20 {
          margin: 20px 0 0 0 !important;
        }

        .m-padding-top30 {
          margin: 30px 0 0 0 !important;
        }

        .m-padding-top40 {
          margin: 40px 0 0 0 !important;
        }

        .m-padding-top50 {
          margin: 50px 0 0 0 !important;
        }

        .m-padding-top60 {
          margin: 60px 0 0 0 !important;
        }

        .m-height10 {
          font-size: 10px !important;
          line-height: 10px !important;
          height: 10px !important;
        }

        .m-height15 {
          font-size: 15px !important;
          line-height: 15px !important;
          height: 15px !important;
        }

        .m-height20 {
          font-size: 20px !important;
          line-height: 20px !important;
          height: 20px !important;
        }

        .m-height25 {
          font-size: 25px !important;
          line-height: 25px !important;
          height: 25px !important;
        }

        .m-height30 {
          font-size: 30px !important;
          line-height: 30px !important;
          height: 30px !important;
        }

        .rwd-on-mobile {
          display: inline-block !important;
          padding: 5px;
        }

        .center-on-mobile {
          text-align: center !important;
        }
      }
    </style>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:100,100italic,300,300italic,400,400italic,500,500italic,700,700italic,900,900italic">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:100,100italic,300,300italic,400,400italic,500,500italic,700,700italic,900,900italic">
  </head>
  <body style="margin-top:0;margin-bottom:0;padding-top:0;padding-bottom:0;width:100%;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;" bgcolor="#F4ECFA">
    <span class="preheader-text" style="color:transparent;height:0;max-height:0;max-width:0;opacity:0;overflow:hidden;visibility:hidden;width:0;display:none;mso-hide:all;"></span>
    <!-- Preheader white space hack -->
    <div style="display:none;max-height:0px;overflow:hidden;"> ‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp; </div>
    <table border="0" align="center" cellpadding="0" cellspacing="0" width="100%" style="width:100%;max-width:100%;">
      <tbody>
        <tr>
          <!-- Outer Table -->
          <td align="center" bgcolor="#F4ECFA">
            <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation" class="row" width="600" style="width:600px;max-width:600px;">
              <tbody>
                <tr>
                  <!-- Preheader-2 -->
                  <td height="20" style="font-size:20px;line-height:20px;">&nbsp;</td>
                </tr>
                <tr>
                  <td class="center-text" align="right">
                    <a href="#" style="font-family:'PT Sans',Arial,Helvetica,sans-serif;font-size:12px;line-height:16px;font-style:normal;font-weight:400;color:#6e6e6e;text-decoration:none;letter-spacing:0px;">View this email in your browser</a>
                  </td>
                </tr>
                <tr>
                  <td height="20" style="font-size:20px;line-height:20px;">&nbsp;</td>
                </tr>
              </tbody>
            </table>
            <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation" class="row" width="600" style="width:600px;max-width:600px;">
              <!-- purple-header-2 -->
              <tbody>
                <tr>
                  <td align="center" bgcolor="#FFFFFF" style="border-radius:10px 10px 0 0;">
                    <!-- gradient -->
                    <!-- gradient -->
                    <!-- inner-table -->
                    <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation" class="row" width="500" style="width:500px;max-width:500px;">
                      <tbody>
                        <tr>
                          <td align="center" class="container-padding">
                            <!-- content -->
                            <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="width:100%;max-width:100%;">
                              <tbody>
                                <tr>
                                  <td height="30" style="font-size:30px;line-height:30px;">&nbsp;</td>
                                </tr>
                                <tr>
                                  <td align="center" class="center-text">
                                    <img style="width: 220px;border:0px;display:inline!important;" src="{%s3Bucket%}/Media/EMAIL/emailPics/myprofessor-new.png" width="180" border="0" alt="logo">
                                  </td>
                                </tr>
                                <tr>
                                  <td class="center-text" align="center" style="font-family:Roboto, Arial, Helvetica, sans-serif;font-size:36px;line-height:40px;font-weight:700;font-style:normal;color:rgb(40, 40, 40);text-decoration:none;letter-spacing:0px;">
                                    <div style="margin: 0px; padding: 0px;">
                                      <p style="margin: 0px; padding: 0px;"> Verify Your Email Account</p>
                                    </div>
                                  </td>
                                </tr>
                                <tr>
                                  <td height="30" style="font-size:30px;line-height:30px;">&nbsp;</td>
                                </tr>
                                <tr>
                                  <td align="center" class="center-text img-responsive">
                                    <img style="width:180px;border:0px;display:inline!important;" src="{%s3Bucket%}/Media/EMAIL/emailPics/img_intro_2.png" width="260" border="0" alt="intro">
                                  </td>
                                </tr>
                                <tr>
                                  <td height="50" style="font-size:50px;line-height:50px;">&nbsp;</td>
                                </tr>
                                <tr>
                                  <td height="15" style="font-size:15px;line-height:15px;">&nbsp;</td>
                                </tr>
                                <tr>
                                  <td class="center-text" align="center" style="font-family:Roboto, Arial, Helvetica, sans-serif;font-size:16px;line-height:26px;font-weight:300;font-style:normal;color:rgb(110, 110, 110);text-decoration:none;letter-spacing:0px;">
                                    <div style="margin: 0px; padding: 0px;">
                                      <p style="margin: 0px; padding: 0px;"> Thank you for joining us. Please enter below OTP to verify your account email address.</p>
                                    </div>
                                  </td>
                                </tr>
                                <tr>
                                  <td height="25" style="font-size:25px;line-height:25px;">&nbsp;</td>
                                </tr>
                                <tr>
                                  <td align="center">
                                    <!-- Header Button -->
                                    <table border="0" cellspacing="0" cellpadding="0" role="presentation" align="center" class="center-float">
                                      <tbody>
                                        <tr>
                                          <td align="center" bgcolor="{%color%}" style="border-radius:36px;">
                                            <!--[if (gte mso 9)|(IE)]>
																																			<table border="0" cellpadding="0" cellspacing="0" align="center">
																																				<tr>
																																					<td align="center" width="35"></td>
																																					<td align="center" height="50" style="height:50px;">
																																						<![endif]-->
                                            <p style="font-family:'PT Sans',Arial,Helvetica,sans-serif;font-size:16px;line-height:20px;font-weight:700;font-style:normal;color:#FFFFFF;text-decoration:none;letter-spacing:0px;padding:15px 35px 15px 35px;display:inline-block;">
                                              <span>OTP : {%otp%} </span>
                                            </P>
                                            <!--[if (gte mso 9)|(IE)]>
																																					</td>
																																					<td align="center" width="35"></td>
																																				</tr>
																																			</table>
																																			<![endif]-->
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                    <!-- Header Button -->
                                  </td>
                                </tr>
                                <tr>
                                  <td height="40" style="font-size:40px;line-height:40px;">&nbsp;</td>
                                </tr>
                              </tbody>
                            </table>
                            <!-- content -->
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <!-- inner-table -->
                  </td>
                </tr>
              </tbody>
            </table>
            <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation" class="row" width="600" style="width:600px;max-width:600px;">
              <!-- purple-footer-2 -->
              <tbody>
                <tr>
                  <td align="center">
                    <!-- Content -->
                    <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="width:100%;max-width:100%;">
                      <tbody>
                        <tr>
                          <td align="center" bgcolor="{%color%}" class="container-padding" style="border-radius:0 0 10px 10px;">
                            <!-- inner-table -->
                            <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation" class="row" width="500" style="width:500px;max-width:500px;">
                              <tbody>
                                <tr>
                                  <td height="50" style="font-size:50px;line-height:50px;">&nbsp;</td>
                                </tr>
                                <tr>
                                  <td align="center">
                                    <!-- Social Icons -->
                                    <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="width:100%;max-width:100%;">
                                      <tbody>
                                        <tr>
                                          <td align="center">
                                            <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation">
                                              <tbody>
                                                <tr>
                                                  <td class="rwd-on-mobile" align="center" valign="middle" height="34" style="height:34px;">
                                                    <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation">
                                                      <tbody>
                                                        <tr>
                                                          <td width="7"></td>
                                                          <td align="center">
                                                            <a href="{%fb%}" target="_blank">
                                                              <img style="width:36px;border:0px;display:inline!important;" src="{%s3Bucket%}/Media/EMAIL/emailPics/ico_facebook.png" width="34" border="0" alt="icon">
                                                            </a>
                                                          </td>
                                                          <td width="7"></td>
                                                        </tr>
                                                      </tbody>
                                                    </table>
                                                  </td>
                                                  <td class="rwd-on-mobile" align="center" valign="middle" height="34" style="height:34px;">
                                                    <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation">
                                                      <tbody>
                                                        <tr>
                                                          <td width="7"></td>
                                                          <td align="center">
                                                            <a href="{%insta%}" target="_blank">
                                                              <img style="width:36px;border:0px;display:inline!important;" src="{%s3Bucket%}/Media/EMAIL/emailPics/ico_instagram.png" width="34" border="0" alt="icon">
                                                            </a>
                                                          </td>
                                                          <td width="7"></td>
                                                        </tr>
                                                      </tbody>
                                                    </table>
                                                  </td>
                                                  <td class="rwd-on-mobile" align="center" valign="middle" height="34" style="height:34px;">
                                                    <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation">
                                                      <tbody>
                                                        <tr>
                                                          <td width="7"></td>
                                                          <td align="center">
                                                            <a href="{%twitter%}" target="_blank">
                                                              <img style="width:36px;border:0px;display:inline!important;" src="{%s3Bucket%}/Media/EMAIL/emailPics/ico_twitter.png" width="34" border="0" alt="icon">
                                                            </a>
                                                          </td>
                                                          <td width="7"></td>
                                                        </tr>
                                                      </tbody>
                                                    </table>
                                                  </td>
                                                </tr>
                                              </tbody>
                                            </table>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                    <!-- Social Icons -->
                                  </td>
                                </tr>
                                <tr>
                                  <td height="20" style="font-size:20px;line-height:20px;">&nbsp;</td>
                                </tr>
                                <tr>
                                  <td class="center-text" align="center" style="font-family:Roboto, Arial, Helvetica, sans-serif;font-size:14px;line-height:24px;font-weight:400;font-style:normal;color:rgb(255, 255, 255);text-decoration:none;letter-spacing:0px;">
                                    <div style="margin: 0px; padding: 0px;">
                                      <p style="margin: 0px; padding: 0px;">{%appName%} - Your Edvantage App </p>
                                      <p style="margin: 0px; padding: 0px;"></p>
                                    </div>
                                  </td>
                                </tr>
                                <tr>
                                  <td class="center-text" align="center" style="font-family:Roboto, Arial, Helvetica, sans-serif;font-size:14px;line-height:24px;font-weight:400;font-style:normal;color:rgb(255, 255, 255);text-decoration:none;letter-spacing:0px;">
                                    <a href="" style="color: rgb(255, 255, 255); font-family: Roboto, Arial, Helvetica, sans-serif; text-decoration: none;">
                                      <span></span>
                                    </a> - <a href="" style="color: rgb(255, 255, 255); font-family: Roboto, Arial, Helvetica, sans-serif; text-decoration: none;">
                                      <span></span>
                                    </a>
                                  </td>
                                </tr>
                                <tr>
                                  <td class="center-text" align="center" style="font-family:Roboto, Arial, Helvetica, sans-serif;font-size:14px;line-height:24px;font-weight:400;font-style:normal;color:rgb(255, 255, 255);text-decoration:none;letter-spacing:0px;">
                                    <a href="mailto:{%adminMail%}" style="color: rgb(255, 255, 255); font-family: Roboto, Arial, Helvetica, sans-serif; text-decoration: none;">
                                      <span>{%adminMail%} </span>
                                    </a> - <a href="{%appLink%}" style="color: rgb(255, 255, 255); font-family: Roboto, Arial, Helvetica, sans-serif; text-decoration: none;">
                                      <span>{%appLink%} </span>
                                    </a>
                                  </td>
                                </tr>
                                <tr>
                                  <td height="20" style="font-size:20px;line-height:20px;">&nbsp;</td>
                                </tr>
                                <tr>
                                  <td align="center">
                                    <!-- Buttons -->
                                    <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation" class="row" width="100%" style="width:100%;max-width:100%;">
                                      <tbody>
                                        <tr>
                                          <td align="center">
                                            <!-- column -->
                                            <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation">
                                              <tbody>
                                                <tr>
                                                  <td align="center">
                                                    <a href="{%appStore%}" target="_blank">
                                                      <img style="display:block;width:100%;max-width:117px;border:0px;" width="117" src="{%s3Bucket%}/Media/EMAIL/emailPics/btn_appstore.png" border="0" alt="icon">
                                                    </a>
                                                  </td>
                                                  <td width="10" style="width:10px;"></td>
                                                  <td align="center">
                                                    <a href="{%playStore%}" target="_blank">
                                                      <img style="display:block;width:100%;max-width:117px;border:0px;" width="117" src="{%s3Bucket%}/Media/EMAIL/emailPics/btn_gplay.png" border="0" alt="icon">
                                                    </a>
                                                  </td>
                                                </tr>
                                              </tbody>
                                            </table>
                                            <!-- column -->
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                    <!-- Buttons -->
                                  </td>
                                </tr>
                                <tr>
                                  <td height="50" style="font-size:50px;line-height:50px;">&nbsp;</td>
                                </tr>
                              </tbody>
                            </table>
                            <!-- inner-table -->
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <!-- Tags -->
                    <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="width:100%;max-width:100%;">
                      <tbody>
                        <tr>
                          <td height="20" style="font-size:20px;line-height:20px;">&nbsp;</td>
                        </tr>
                        <tr>
                          <td align="center">
                            <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation">
                              <tbody>
                                <tr class="center-on-mobile">
                                  <td class="rwd-on-mobile center-text" align="center" style="font-family:Roboto, Arial, Helvetica, sans-serif;font-size:14px;line-height:24px;font-weight:400;font-style:normal;color:rgb(110, 110, 110);text-decoration:none;letter-spacing:0px;">
                                    <a href="#" style="font-family:'PT Sans',Arial,Helvetica,sans-serif;font-size:12px;font-weight:400;line-height:22px;color:#6e6e6e;text-decoration:none;">UNSUBSCRIBE</a>
                                  </td>
                                  <td class="rwd-on-mobile center-text" align="center" valign="middle" style="padding:0 0 0 0!important">
                                    <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation">
                                      <tbody>
                                        <tr>
                                          <td class="hide-mobile" width="5"></td>
                                          <td class="center-text" align="center" style="font-family:Roboto, Arial, Helvetica, sans-serif;font-size:12px;line-height:22px;font-weight:400;font-style:normal;color:rgb(110, 110, 110);text-decoration:none;letter-spacing:0px;">|</td>
                                          <td class="hide-mobile" width="5"></td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                  <td class="rwd-on-mobile center-text" align="center" style="font-family:Roboto, Arial, Helvetica, sans-serif;font-size:14px;line-height:24px;font-weight:400;font-style:normal;color:rgb(110, 110, 110);text-decoration:none;letter-spacing:0px;">
                                    <a href="#" style="font-family:'PT Sans',Arial,Helvetica,sans-serif;font-size:12px;font-weight:400;line-height:22px;color:#6e6e6e;text-decoration:none;">WEB VERSION</a>
                                  </td>
                                  <td class="rwd-on-mobile center-text" align="center" valign="middle" style="padding:0 0 0 0!important">
                                    <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation">
                                      <tbody>
                                        <tr>
                                          <td class="hide-mobile" width="5"></td>
                                          <td class="center-text" align="center" style="font-family:Roboto, Arial, Helvetica, sans-serif;font-size:12px;line-height:22px;font-weight:400;font-style:normal;color:rgb(110, 110, 110);text-decoration:none;letter-spacing:0px;">|</td>
                                          <td class="hide-mobile" width="5"></td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                  <td class="rwd-on-mobile center-text" align="center" style="font-family:Roboto, Arial, Helvetica, sans-serif;font-size:14px;line-height:24px;font-weight:400;font-style:normal;color:rgb(110, 110, 110);text-decoration:none;letter-spacing:0px;">
                                    <a href="#" style="font-family:'PT Sans',Arial,Helvetica,sans-serif;font-size:12px;font-weight:400;line-height:22px;color:#6e6e6e;text-decoration:none;">SEND TO A FRIEND</a>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td height="20" style="font-size:20px;line-height:20px;">&nbsp;</td>
                        </tr>
                      </tbody>
                    </table>
                    <!-- Tags -->
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
    </td>
    </tr>
    <!-- Outer-Table -->
    </tbody>
    </table>
  </body>
</html>
           `,
		subject: 'Email Verification',
	},
	{
		code: Constants.EmailCodes.MY_PROFESSOR_FORGET_PASSWORD_VERIFY,
		body: `<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
   <head>
      <!--[if (gte mso 9)|(IE)]>
      <xml>
         <o:OfficeDocumentSettings>
            <o:AllowPNG/>
            <o:PixelsPerInch>96</o:PixelsPerInch>
         </o:OfficeDocumentSettings>
      </xml>
      <![endif]-->
      <meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <!-- So that mobile will display zoomed in -->
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <!-- enable media queries for windows phone 8 -->
      <meta name="format-detection" content="telephone=no">
      <!-- disable auto telephone linking in iOS -->
      <meta name="format-detection" content="date=no">
      <!-- disable auto date linking in iOS -->
      <meta name="format-detection" content="address=no">
      <!-- disable auto address linking in iOS -->
      <meta name="format-detection" content="email=no">
      <!-- disable auto email linking in iOS -->
      <meta name="color-scheme" content="only">
      <title></title>
      <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&amp;display=swap" rel="stylesheet">
      <style type="text/css">
         /*Basics*/
         body {margin:0px!important;padding:0px!important;display:block!important;min-width:100%!important;width:100%!important;-webkit-text-size-adjust:none;}
         table {border-spacing:0;mso-table-lspace:0pt;mso-table-rspace:0pt;}
         table td {border-collapse:collapse;mso-line-height-rule:exactly;}
         td img {-ms-interpolation-mode:bicubic;width:auto;max-width:auto;height:auto;margin:auto;display:block!important;border:0px;}
         td p {margin:0;padding:0;}
         td div {margin:0;padding:0;}
         td a {text-decoration:none;color:inherit;}
         /*Outlook*/
         .ExternalClass {width:100%;}
         .ExternalClass,.ExternalClass p,.ExternalClass span,.ExternalClass font,.ExternalClass td,.ExternalClass div {line-height:inherit;}
         .ReadMsgBody {width:100%;background-color:#ffffff;}
         /* iOS BLUE LINKS */
         a[x-apple-data-detectors] {color:inherit!important;text-decoration:none!important;font-size:inherit!important;font-family:inherit!important;font-weight:inherit!important;line-height:inherit!important;}
         /*Gmail blue links*/
         u + #body a {color:inherit;text-decoration:none;font-size:inherit;font-family:inherit;font-weight:inherit;line-height:inherit;}
         /*Buttons fix*/
         .undoreset a, .undoreset a:hover {text-decoration:none!important;}
         .yshortcuts a {border-bottom:none!important;}
         .ios-footer a {color:#aaaaaa!important;text-decoration:none;}
         /*Responsive*/
         @media screen and (max-width:799px) {
         table.row {width:100%!important;max-width:100%!important;}
         td.row {width:100%!important;max-width:100%!important;}
         .img-responsive img {width:100%!important;max-width:100%!important;height:auto!important;margin:auto;}
         .center-float {float:none!important;margin:auto!important;}
         .center-text{text-align:center!important;}
         .container-padding {width:100%!important;padding-left:15px!important;padding-right:15px!important;}
         .container-padding10 {width:100%!important;padding-left:10px!important;padding-right:10px!important;}
         .hide-mobile {display:none!important;}
         .menu-container {text-align:center!important;}
         .autoheight {height:auto!important;}
         .m-padding-10 {margin:10px 0!important;}
         .m-padding-15 {margin:15px 0!important;}
         .m-padding-20 {margin:20px 0!important;}
         .m-padding-30 {margin:30px 0!important;}
         .m-padding-40 {margin:40px 0!important;}
         .m-padding-50 {margin:50px 0!important;}
         .m-padding-60 {margin:60px 0!important;}
         .m-padding-top10 {margin:30px 0 0 0!important;}
         .m-padding-top15 {margin:15px 0 0 0!important;}
         .m-padding-top20 {margin:20px 0 0 0!important;}
         .m-padding-top30 {margin:30px 0 0 0!important;}
         .m-padding-top40 {margin:40px 0 0 0!important;}
         .m-padding-top50 {margin:50px 0 0 0!important;}
         .m-padding-top60 {margin:60px 0 0 0!important;}
         .m-height10 {font-size:10px!important;line-height:10px!important;height:10px!important;}
         .m-height15 {font-size:15px!important;line-height:15px!important;height:15px!important;}
         .m-height20 {font-size:20px!important;line-height:20px!important;height:20px!important;}
         .m-height25 {font-size:25px!important;line-height:25px!important;height:25px!important;}
         .m-height30 {font-size:30px!important;line-height:30px!important;height:30px!important;}
         .rwd-on-mobile {display:inline-block!important;padding:5px;}
         .center-on-mobile {text-align:center!important;}
         }
      </style>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:100,100italic,300,300italic,400,400italic,500,500italic,700,700italic,900,900italic">
      <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:100,100italic,300,300italic,400,400italic,500,500italic,700,700italic,900,900italic">
   </head>
   <body style="margin-top:0;margin-bottom:0;padding-top:0;padding-bottom:0;width:100%;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;" bgcolor="#F4ECFA">
      <span class="preheader-text" style="color:transparent;height:0;max-height:0;max-width:0;opacity:0;overflow:hidden;visibility:hidden;width:0;display:none;mso-hide:all;"></span>
      <!-- Preheader white space hack -->
      <div style="display:none;max-height:0px;overflow:hidden;">
         ‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;
      </div>
      <table border="0" align="center" cellpadding="0" cellspacing="0" width="100%" style="width:100%;max-width:100%;">
         <tbody>
            <tr>
               <!-- Outer Table -->
               <td align="center" bgcolor="#F4ECFA">
                  <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation" class="row" width="600" style="width:600px;max-width:600px;">
                     <tbody>
                        <tr>
                           <!-- Preheader-2 -->
                           <td height="20" style="font-size:20px;line-height:20px;">&nbsp;</td>
                        </tr>
                        <tr>
                           <td class="center-text" align="right">
                              <a href="#" style="font-family:'PT Sans',Arial,Helvetica,sans-serif;font-size:12px;line-height:16px;font-style:normal;font-weight:400;color:#6e6e6e;text-decoration:none;letter-spacing:0px;">View this email in your browser</a>
                           </td>
                        </tr>
                        <tr>
                           <td height="20" style="font-size:20px;line-height:20px;">&nbsp;</td>
                        </tr>
                     </tbody>
                  </table>
                  <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation" class="row" width="600" style="width:600px;max-width:600px;">
                     <!-- purple-header-2 -->
                     <tbody>
                        <tr>
                           <td align="center" bgcolor="#FFFFFF" style="border-radius:10px 10px 0 0;">
                              <!-- gradient -->
                              <!-- gradient -->
                              <!-- inner-table -->
                              <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation" class="row" width="500" style="width:500px;max-width:500px;">
                                 <tbody>
                                    <tr>
                                       <td align="center" class="container-padding">
                                          <!-- content -->
                                          <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="width:100%;max-width:100%;">
                                             <tbody>
                                                <tr>
                                                   <td height="30" style="font-size:30px;line-height:30px;">&nbsp;</td>
                                                </tr>
                                                <tr>
                                                   <td align="center" class="center-text">
                                                      <img style="width:220px;border:0px;display:inline!important;" src=" {%s3Bucket%}/Media/EMAIL/emailPics/myprofessor-new.png" width="180" border="0" alt="logo">
                                                   </td>
                                                </tr>
                                                <tr>
                                                   <td height="30" style="font-size:30px;line-height:30px;">&nbsp;</td>
                                                </tr>
                                                <tr>
                                                   <td class="center-text" align="center" style="font-family:Roboto, Arial, Helvetica, sans-serif;font-size:36px;line-height:40px;font-weight:700;font-style:normal;color:rgb(40, 40, 40);text-decoration:none;letter-spacing:0px;">
                                                      <div style="margin: 0px; padding: 0px;">
                                                         <p style="margin: 0px; padding: 0px;">Forgot your password?</p>
                                                         <p style="margin: 0px; padding: 0px;"></p>
                                                         <p style="margin: 0px; padding: 0px;"> </p>
                                                      </div>
                                                   </td>
                                                </tr>
                                                <tr>
                                                   <td height="30" style="font-size:30px;line-height:30px;">&nbsp;</td>
                                                </tr>
                                                <tr>
                                                   <td align="center" class="center-text img-responsive">
                                                      <img style="width:180px;border:0px;display:inline!important;" src=" {%s3Bucket%}/Media/EMAIL/emailPics/img_intro_4.png" width="260" border="0" alt="intro">
                                                   </td>
                                                </tr>
                                                <tr>
                                                   <td height="50" style="font-size:50px;line-height:50px;">&nbsp;</td>
                                                </tr>
                                                <tr>
                                                   <td height="15" style="font-size:15px;line-height:15px;">&nbsp;</td>
                                                </tr>
                                                <tr>
                                                   <td class="center-text" align="center" style="font-family:Roboto, Arial, Helvetica, sans-serif;font-size:16px;line-height:26px;font-weight:300;font-style:normal;color:rgb(110, 110, 110);text-decoration:none;letter-spacing:0px;">
                                                      <div style="margin: 0px; padding: 0px;">
                                                         <p style="margin: 0px; padding: 0px;">
                                                            Use the OTP to reset your password, you have 24 hours to pick your password. After that, you'll have to ask for a new one.
                                                         </p>
                                                         <p style="margin: 0px; padding: 0px;"><br></p>
                                                      </div>
                                                   </td>
                                                </tr>
                                                <tr>
                                                   <td height="25" style="font-size:25px;line-height:25px;">&nbsp;</td>
                                                </tr>
                                                <tr>
                                                   <td align="center">
                                                      <!-- Header Button -->
                                                      <table border="0" cellspacing="0" cellpadding="0" role="presentation" align="center" class="center-float">
                                                         <tbody>
                                                            <tr>
                                                               <td align="center" bgcolor=" {%color%}" style="border-radius:36px;">
                                                                  <!--[if (gte mso 9)|(IE)]>
                                                                  <table border="0" cellpadding="0" cellspacing="0" align="center">
                                                                     <tr>
                                                                        <td align="center" width="35"></td>
                                                                        <td align="center" height="50" style="height:50px;">
                                                                           <![endif]-->
                                                                           <p style="font-family:'PT Sans',Arial,Helvetica,sans-serif;font-size:16px;line-height:20px;font-weight:700;font-style:normal;color:#FFFFFF;text-decoration:none;letter-spacing:0px;padding:15px 35px 15px 35px;display:inline-block;"><span>OTP : {%otp%}</span></p>
                                                                           <!--[if (gte mso 9)|(IE)]>
                                                                        </td>
                                                                        <td align="center" width="35"></td>
                                                                     </tr>
                                                                  </table>
                                                                  <![endif]-->
                                                               </td>
                                                            </tr>
                                                         </tbody>
                                                      </table>
                                                      <!-- Header Button -->
                                                   </td>
                                                </tr>
                                                <tr>
                                                   <td height="40" style="font-size:40px;line-height:40px;">&nbsp;</td>
                                                </tr>
                                             </tbody>
                                          </table>
                                          <!-- content -->
                                       </td>
                                    </tr>
                                 </tbody>
                              </table>
                              <!-- inner-table -->
                           </td>
                        </tr>
                     </tbody>
                  </table>
                  <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation" class="row" width="600" style="width:600px;max-width:600px;">
                     <!-- purple-footer-2 -->
                     <tbody>
                        <tr>
                           <td align="center">
                              <!-- Content -->
                              <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="width:100%;max-width:100%;">
                                 <tbody>
                                    <tr>
                                       <td align="center" bgcolor=" {%color%}" class="container-padding" style="border-radius:0 0 10px 10px;">
                                          <!-- inner-table -->
                                          <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation" class="row" width="500" style="width:500px;max-width:500px;">
                                             <tbody>
                                                <tr>
                                                   <td height="50" style="font-size:50px;line-height:50px;">&nbsp;</td>
                                                </tr>
                                                <tr>
                                                   <td align="center">
                                                      <!-- Social Icons -->
                                                      <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="width:100%;max-width:100%;">
                                                         <tbody>
                                                            <tr>
                                                               <td align="center">
                                                                  <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation">
                                                                     <tbody>
                                                                        <tr>
                                                                           <td class="rwd-on-mobile" align="center" valign="middle" height="34" style="height:34px;">
                                                                              <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation">
                                                                                 <tbody>
                                                                                    <tr>
                                                                                       <td width="7"></td>
                                                                                       <td align="center">
                                                                                          <a href=" {%fb%}" target="_blank"><img style="width:36px;border:0px;display:inline!important;" src=" {%s3Bucket%}/Media/EMAIL/emailPics/ico_facebook.png" width="34" border="0" alt="icon"></a>
                                                                                       </td>
                                                                                       <td width="7"></td>
                                                                                    </tr>
                                                                                 </tbody>
                                                                              </table>
                                                                           </td>
                                                                           <td class="rwd-on-mobile" align="center" valign="middle" height="34" style="height:34px;">
                                                                              <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation">
                                                                                 <tbody>
                                                                                    <tr>
                                                                                       <td width="7"></td>
                                                                                       <td align="center">
                                                                                          <a href=" {%insta%}" target="_blank"><img style="width:36px;border:0px;display:inline!important;" src=" {%s3Bucket%}/Media/EMAIL/emailPics/ico_instagram.png" width="34" border="0" alt="icon"></a>
                                                                                       </td>
                                                                                       <td width="7"></td>
                                                                                    </tr>
                                                                                 </tbody>
                                                                              </table>
                                                                           </td>
                                                                           <td class="rwd-on-mobile" align="center" valign="middle" height="34" style="height:34px;">
                                                                              <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation">
                                                                                 <tbody>
                                                                                    <tr>
                                                                                       <td width="7"></td>
                                                                                       <td align="center">
                                                                                          <img style="width:36px;border:0px;display:inline!important;" src=" {%s3Bucket%}/Media/EMAIL/emailPics/ico_twitter.png" width="34" border="0" alt="icon">
                                                                                       </td>
                                                                                       <td width="7"></td>
                                                                                    </tr>
                                                                                 </tbody>
                                                                              </table>
                                                                           </td>
                                                                        </tr>
                                                                     </tbody>
                                                                  </table>
                                                               </td>
                                                            </tr>
                                                         </tbody>
                                                      </table>
                                                      <!-- Social Icons -->
                                                   </td>
                                                </tr>
                                                <tr>
                                                   <td height="20" style="font-size:20px;line-height:20px;">&nbsp;</td>
                                                </tr>
                                                <tr>
                                                   <td class="center-text" align="center" style="font-family:Roboto, Arial, Helvetica, sans-serif;font-size:14px;line-height:24px;font-weight:400;font-style:normal;color:rgb(255, 255, 255);text-decoration:none;letter-spacing:0px;">
                                                      <div style="margin: 0px; padding: 0px;">
                                                         <p style="margin: 0px; padding: 0px;"> {%appName%} - Your Edvantage App</p>
                                                         <p style="margin: 0px; padding: 0px;">
                                                         </p>
                                                      </div>
                                                   </td>
                                                </tr>
                                                <tr>
                                                   <td class="center-text" align="center" style="font-family:Roboto, Arial, Helvetica, sans-serif;font-size:14px;line-height:24px;font-weight:400;font-style:normal;color:rgb(255, 255, 255);text-decoration:none;letter-spacing:0px;">
                                                      <a href="" style="color: rgb(255, 255, 255); font-family: Roboto, Arial, Helvetica, sans-serif; text-decoration: none;"><span></span></a> - <a href="" style="color: rgb(255, 255, 255); font-family: Roboto, Arial, Helvetica, sans-serif; text-decoration: none;"><span></span></a>
                                                   </td>
                                                </tr>
                                                <tr>
                                                   <td class="center-text" align="center" style="font-family:Roboto, Arial, Helvetica, sans-serif;font-size:14px;line-height:24px;font-weight:400;font-style:normal;color:rgb(255, 255, 255);text-decoration:none;letter-spacing:0px;">
                                                      <a href="mailto: {%adminMail%}" style="color: rgb(255, 255, 255); font-family: Roboto, Arial, Helvetica, sans-serif; text-decoration: none;"><span> {%adminMail%}</span></a> - <a href=" {%appLink%}" style="color: rgb(255, 255, 255); font-family: Roboto, Arial, Helvetica, sans-serif; text-decoration: none;"><span> {%appLink%}</span></a>
                                                   </td>
                                                </tr>
                                                <tr>
                                                   <td height="20" style="font-size:20px;line-height:20px;">&nbsp;</td>
                                                </tr>
                                                <tr>
                                                   <td align="center">
                                                      <!-- Buttons -->
                                                      <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation" class="row" width="100%" style="width:100%;max-width:100%;">
                                                         <tbody>
                                                            <tr>
                                                               <td align="center">
                                                                  <!-- column -->
                                                                  <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation">
                                                                     <tbody>
                                                                        <tr>
                                                                           <td align="center">
                                                                              <a href=" {%appStore%}" target="_blank"><img style="display:block;width:100%;max-width:117px;border:0px;" width="117" src=" {%s3Bucket%}/Media/EMAIL/emailPics/btn_appstore.png" border="0" alt="icon"></a>
                                                                           </td>
                                                                           <td width="10" style="width:10px;"></td>
                                                                           <td align="center">
                                                                              <a href=" {%playStore%}" target="_blank"><img style="display:block;width:100%;max-width:117px;border:0px;" width="117" src=" {%s3Bucket%}/Media/EMAIL/emailPics/btn_gplay.png" border="0" alt="icon"></a>
                                                                           </td>
                                                                        </tr>
                                                                     </tbody>
                                                                  </table>
                                                                  <!-- column -->
                                                               </td>
                                                            </tr>
                                                         </tbody>
                                                      </table>
                                                      <!-- Buttons -->
                                                   </td>
                                                </tr>
                                                <tr>
                                                   <td height="50" style="font-size:50px;line-height:50px;">&nbsp;</td>
                                                </tr>
                                             </tbody>
                                          </table>
                                          <!-- inner-table -->
                                       </td>
                                    </tr>
                                 </tbody>
                              </table>
                              <!-- Tags -->
                              <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="width:100%;max-width:100%;">
                                 <tbody>
                                    <tr>
                                       <td height="20" style="font-size:20px;line-height:20px;">&nbsp;</td>
                                    </tr>
                                    <tr>
                                       <td align="center">
                                          <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation">
                                             <tbody>
                                                <tr class="center-on-mobile">
                                                   <td class="rwd-on-mobile center-text" align="center" style="font-family:Roboto, Arial, Helvetica, sans-serif;font-size:14px;line-height:24px;font-weight:400;font-style:normal;color:rgb(110, 110, 110);text-decoration:none;letter-spacing:0px;">
                                                      <a href="#" style="font-family:'PT Sans',Arial,Helvetica,sans-serif;font-size:12px;font-weight:400;line-height:22px;color:#6e6e6e;text-decoration:none;">UNSUBSCRIBE</a>
                                                   </td>
                                                   <td class="rwd-on-mobile center-text" align="center" valign="middle" style="padding:0 0 0 0!important">
                                                      <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation">
                                                         <tbody>
                                                            <tr>
                                                               <td class="hide-mobile" width="5"></td>
                                                               <td class="center-text" align="center" style="font-family:Roboto, Arial, Helvetica, sans-serif;font-size:12px;line-height:22px;font-weight:400;font-style:normal;color:rgb(110, 110, 110);text-decoration:none;letter-spacing:0px;">|</td>
                                                               <td class="hide-mobile" width="5"></td>
                                                            </tr>
                                                         </tbody>
                                                      </table>
                                                   </td>
                                                   <td class="rwd-on-mobile center-text" align="center" style="font-family:Roboto, Arial, Helvetica, sans-serif;font-size:14px;line-height:24px;font-weight:400;font-style:normal;color:rgb(110, 110, 110);text-decoration:none;letter-spacing:0px;">
                                                      <a href="#" style="font-family:'PT Sans',Arial,Helvetica,sans-serif;font-size:12px;font-weight:400;line-height:22px;color:#6e6e6e;text-decoration:none;">WEB VERSION</a>
                                                   </td>
                                                   <td class="rwd-on-mobile center-text" align="center" valign="middle" style="padding:0 0 0 0!important">
                                                      <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation">
                                                         <tbody>
                                                            <tr>
                                                               <td class="hide-mobile" width="5"></td>
                                                               <td class="center-text" align="center" style="font-family:Roboto, Arial, Helvetica, sans-serif;font-size:12px;line-height:22px;font-weight:400;font-style:normal;color:rgb(110, 110, 110);text-decoration:none;letter-spacing:0px;">|</td>
                                                               <td class="hide-mobile" width="5"></td>
                                                            </tr>
                                                         </tbody>
                                                      </table>
                                                   </td>
                                                   <td class="rwd-on-mobile center-text" align="center" style="font-family:Roboto, Arial, Helvetica, sans-serif;font-size:14px;line-height:24px;font-weight:400;font-style:normal;color:rgb(110, 110, 110);text-decoration:none;letter-spacing:0px;">
                                                      <a href="#" style="font-family:'PT Sans',Arial,Helvetica,sans-serif;font-size:12px;font-weight:400;line-height:22px;color:#6e6e6e;text-decoration:none;">SEND TO A FRIEND</a>
                                                   </td>
                                                </tr>
                                             </tbody>
                                          </table>
                                       </td>
                                    </tr>
                                    <tr>
                                       <td height="20" style="font-size:20px;line-height:20px;">&nbsp;</td>
                                    </tr>
                                 </tbody>
                              </table>
                              <!-- Tags -->
                           </td>
                        </tr>
                     </tbody>
                  </table>
               </td>
            </tr>
         </tbody>
      </table>
      </td>
      </tr><!-- Outer-Table -->
      </tbody></table>
   </body>
</html>
`,
		subject: 'Email Verification',
	},
	{
		code: Constants.EmailCodes.MY_PROFESSOR_CONFIRM_EMAIL,
		body: `<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
  <head>
    <!--[if (gte mso 9)|(IE)]>
		<xml>
			<o:OfficeDocumentSettings>
				<o:AllowPNG/>
				<o:PixelsPerInch>96</o:PixelsPerInch>
			</o:OfficeDocumentSettings>
		</xml>
		<![endif]-->
    <meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- So that mobile will display zoomed in -->
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <!-- enable media queries for windows phone 8 -->
    <meta name="format-detection" content="telephone=no">
    <!-- disable auto telephone linking in iOS -->
    <meta name="format-detection" content="date=no">
    <!-- disable auto date linking in iOS -->
    <meta name="format-detection" content="address=no">
    <!-- disable auto address linking in iOS -->
    <meta name="format-detection" content="email=no">
    <!-- disable auto email linking in iOS -->
    <meta name="color-scheme" content="only">
    <title></title>
    <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&amp;display=swap" rel="stylesheet">
    <style type="text/css">
      /*Basics*/
      body {
        margin: 0px !important;
        padding: 0px !important;
        display: block !important;
        min-width: 100% !important;
        width: 100% !important;
        -webkit-text-size-adjust: none;
      }

      table {
        border-spacing: 0;
        mso-table-lspace: 0pt;
        mso-table-rspace: 0pt;
      }

      table td {
        border-collapse: collapse;
        mso-line-height-rule: exactly;
      }

      td img {
        -ms-interpolation-mode: bicubic;
        width: auto;
        max-width: auto;
        height: auto;
        margin: auto;
        display: block !important;
        border: 0px;
      }

      td p {
        margin: 0;
        padding: 0;
      }

      td div {
        margin: 0;
        padding: 0;
      }

      td a {
        text-decoration: none;
        color: inherit;
      }

      .parent {
        text-align: center;
      }

      .child {
        display: inline-block;
        margin:0px 20px;
      }

      /*Outlook*/
      .ExternalClass {
        width: 100%;
      }

      .ExternalClass,
      .ExternalClass p,
      .ExternalClass span,
      .ExternalClass font,
      .ExternalClass td,
      .ExternalClass div {
        line-height: inherit;
      }

      .ReadMsgBody {
        width: 100%;
        background-color: #ffffff;
      }

      /* iOS BLUE LINKS */
      a[x-apple-data-detectors] {
        color: inherit !important;
        text-decoration: none !important;
        font-size: inherit !important;
        font-family: inherit !important;
        font-weight: inherit !important;
        line-height: inherit !important;
      }

      /*Gmail blue links*/
      u+#body a {
        color: inherit;
        text-decoration: none;
        font-size: inherit;
        font-family: inherit;
        font-weight: inherit;
        line-height: inherit;
      }

      /*Buttons fix*/
      .undoreset a,
      .undoreset a:hover {
        text-decoration: none !important;
      }

      .yshortcuts a {
        border-bottom: none !important;
      }

      .ios-footer a {
        color: #aaaaaa !important;
        text-decoration: none;
      }

      /*Responsive*/
      @media screen and (max-width:799px) {
        table.row {
          width: 100% !important;
          max-width: 100% !important;
        }

        td.row {
          width: 100% !important;
          max-width: 100% !important;
        }

        .img-responsive img {
          width: 100% !important;
          max-width: 100% !important;
          height: auto !important;
          margin: auto;
        }

        .center-float {
          float: none !important;
          margin: auto !important;
        }

        .center-text {
          text-align: center !important;
        }

        .container-padding {
          width: 100% !important;
          padding-left: 15px !important;
          padding-right: 15px !important;
        }

        .container-padding10 {
          width: 100% !important;
          padding-left: 10px !important;
          padding-right: 10px !important;
        }

        .hide-mobile {
          display: none !important;
        }

        .menu-container {
          text-align: center !important;
        }

        .autoheight {
          height: auto !important;
        }

        .m-padding-10 {
          margin: 10px 0 !important;
        }

        .m-padding-15 {
          margin: 15px 0 !important;
        }

        .m-padding-20 {
          margin: 20px 0 !important;
        }

        .m-padding-30 {
          margin: 30px 0 !important;
        }

        .m-padding-40 {
          margin: 40px 0 !important;
        }

        .m-padding-50 {
          margin: 50px 0 !important;
        }

        .m-padding-60 {
          margin: 60px 0 !important;
        }

        .m-padding-top10 {
          margin: 30px 0 0 0 !important;
        }

        .m-padding-top15 {
          margin: 15px 0 0 0 !important;
        }

        .m-padding-top20 {
          margin: 20px 0 0 0 !important;
        }

        .m-padding-top30 {
          margin: 30px 0 0 0 !important;
        }

        .m-padding-top40 {
          margin: 40px 0 0 0 !important;
        }

        .m-padding-top50 {
          margin: 50px 0 0 0 !important;
        }

        .m-padding-top60 {
          margin: 60px 0 0 0 !important;
        }

        .m-height10 {
          font-size: 10px !important;
          line-height: 10px !important;
          height: 10px !important;
        }

        .m-height15 {
          font-size: 15px !important;
          line-height: 15px !important;
          height: 15px !important;
        }

        .m-height20 {
          font-size: 20px !important;
          line-height: 20px !important;
          height: 20px !important;
        }

        .m-height25 {
          font-size: 25px !important;
          line-height: 25px !important;
          height: 25px !important;
        }

        .m-height30 {
          font-size: 30px !important;
          line-height: 30px !important;
          height: 30px !important;
        }

        .rwd-on-mobile {
          display: inline-block !important;
          padding: 5px;
        }

        .center-on-mobile {
          text-align: center !important;
        }
      }
    </style>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:100,100italic,300,300italic,400,400italic,500,500italic,700,700italic,900,900italic">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:100,100italic,300,300italic,400,400italic,500,500italic,700,700italic,900,900italic">
  </head>
  <body style="margin-top:0;margin-bottom:0;padding-top:0;padding-bottom:0;width:100%;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;" bgcolor="#F4ECFA">
    <span class="preheader-text" style="color:transparent;height:0;max-height:0;max-width:0;opacity:0;overflow:hidden;visibility:hidden;width:0;display:none;mso-hide:all;"></span>
    <!-- Preheader white space hack -->
    <div style="display:none;max-height:0px;overflow:hidden;"> ‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp; </div>
    <table border="0" align="center" cellpadding="0" cellspacing="0" width="100%" style="width:100%;max-width:100%;">
      <tbody>
        <tr>
          <!-- Outer Table -->
          <td align="center" bgcolor="#F4ECFA">
            <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation" class="row" width="600" style="width:600px;max-width:600px;">
              <tbody>
                <tr>
                  <!-- Preheader-2 -->
                  <td height="20" style="font-size:20px;line-height:20px;">&nbsp;</td>
                </tr>
                <tr>
                  <td class="center-text" align="right">
                    <a href="#" style="font-family:'PT Sans',Arial,Helvetica,sans-serif;font-size:12px;line-height:16px;font-style:normal;font-weight:400;color:#6e6e6e;text-decoration:none;letter-spacing:0px;">View this email in your browser</a>
                  </td>
                </tr>
                <tr>
                  <td height="20" style="font-size:20px;line-height:20px;">&nbsp;</td>
                </tr>
              </tbody>
            </table>
            <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation" class="row" width="600" style="width:600px;max-width:600px;">
              <!-- purple-header-2 -->
              <tbody>
                <tr>
                  <td align="center" bgcolor="#FFFFFF" style="border-radius:10px 10px 0 0;">
                    <!-- gradient -->
                    <!-- gradient -->
                    <!-- inner-table -->
                    <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation" class="row" width="500" style="width:500px;max-width:500px;">
                      <tbody>
                        <tr>
                          <td align="center" class="container-padding">
                            <!-- content -->
                            <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="width:100%;max-width:100%;">
                              <tbody>
                                <tr>
                                  <td height="30" style="font-size:30px;line-height:30px;">&nbsp;</td>
                                </tr>
                                <tr>
                                  <td align="center" class="center-text">
                                    <img style="width:220px;border:0px;display:inline!important;" src="{%s3Bucket%}/Media/EMAIL/emailPics/myprofessor-new.png" width="180" border="0" alt="logo">
                                  </td>
                                </tr>
                                <tr>
                                  <td height="30" style="font-size:30px;line-height:30px;">&nbsp;</td>
                                </tr>
                                <tr>
                                  <td height="30" style="font-size:30px;line-height:30px;">&nbsp;</td>
                                </tr>
                                <tr>
                                  <td align="center" class="center-text img-responsive">
                                    <img style="width:180px;border:0px;display:inline!important;" src="{%s3Bucket%}/Media/EMAIL/emailPics/img_intro_1.png" width="260" border="0" alt="intro">
                                  </td>
                                </tr>
                                <tr>
                                  <td height="50" style="font-size:50px;line-height:50px;">&nbsp;</td>
                                </tr>
                                <tr>
                                  <td height="15" style="font-size:15px;line-height:15px;">&nbsp;</td>
                                </tr>
                                <tr>
                                  <td class="center-text" align="center" style="font-family:Roboto, Arial, Helvetica, sans-serif;font-size:16px;line-height:26px;font-weight:300;font-style:normal;color:rgb(110, 110, 110);text-decoration:none;letter-spacing:0px;">
                                    <div style="margin: 0px; padding: 0px;">
                                      <p style="margin: 0px; padding: 0px;"> Welcome to {%appName%} - Your Edvantage App </p>
                                      <p style="margin: 0px; padding: 0px;">
                                        <br>
                                      </p>
                                      <p style="margin: 0px; padding: 0px;">Your login information is:</p>
                                      <p style="margin: 0px; padding: 0px;"></p>
                                      <p style="margin: 0px; padding: 0px;">
                                        <strong>Username:</strong>{%email%}
                                      </p>
                                      <p style="margin: 0px; padding: 0px;">
                                        <strong>Password:</strong>{%password%}
                                      </p>
                                    </div>
                                  </td>
                                </tr>
                                <tr>
                                  <td height="25" style="font-size:25px;line-height:25px;">&nbsp;</td>
                                </tr>
                                  <td class="center-text" align="center" style="font-family:Roboto, Arial, Helvetica, sans-serif;font-size:16px;line-height:26px;font-weight:300;font-style:normal;color:rgb(110, 110, 110);text-decoration:none;letter-spacing:0px;">
                                    <div style="margin: 0px; padding: 0px;">
                                      <p style="margin: 0px; padding: 0px;"> Select the appropriate link for your device - Android or iOS </p>
                                      <p style="margin: 0px; padding: 0px;">
                                        <br>
                                      </p>
                                      <p class="parent" style="margin: 0px; padding: 0px;text-align:center;">
                                        <a class="child" href="{%appStore%}" target="_blank">
                                          <img style="display:block;width:100%;max-width:117px;border:0px;" width="117" src="{%s3Bucket%}/Media/EMAIL/emailPics/btn_appstore.png" border="0" alt="icon">
                                        </a>
                                          <a href="{%playStore%}" target="_blank" class="child">
                                            <img style="display:block;width:100%;max-width:117px;border:0px;" width="117" src="{%s3Bucket%}/Media/EMAIL/emailPics/btn_gplay.png" border="0" alt="icon">
                                          </a>
                                      </p>
                                    </div>
                                  </td>
                                <tr>
                                  <td height="40" style="font-size:40px;line-height:40px;">&nbsp;</td>
                                </tr>
                              </tbody>
                            </table>
                            <!-- content -->
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <!-- inner-table -->
                  </td>
                </tr>
              </tbody>
            </table>
            <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation" class="row" width="600" style="width:600px;max-width:600px;">
              <!-- purple-footer-2 -->
              <tbody>
                <tr>
                  <td align="center">
                    <!-- Content -->
                    <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="width:100%;max-width:100%;">
                      <tbody>
                        <tr>
                          <td align="center" bgcolor="{%color%}" class="container-padding" style="border-radius:0 0 10px 10px;">
                            <!-- inner-table -->
                            <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation" class="row" width="500" style="width:500px;max-width:500px;">
                              <tbody>
                                <tr>
                                  <td height="50" style="font-size:50px;line-height:50px;">&nbsp;</td>
                                </tr>
                                <tr>
                                  <td align="center">
                                    <!-- Social Icons -->
                                    <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="width:100%;max-width:100%;">
                                      <tbody>
                                        <tr>
                                          <td align="center">
                                            <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation">
                                              <tbody>
                                                <tr>
                                                  <td class="rwd-on-mobile" align="center" valign="middle" height="34" style="height:34px;">
                                                    <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation">
                                                      <tbody>
                                                        <tr>
                                                          <td width="7"></td>
                                                          <td align="center">
                                                            <a href="{%fb%}" target="_blank">
                                                              <img style="width:36px;border:0px;display:inline!important;" src="{%s3Bucket%}/Media/EMAIL/emailPics/ico_facebook.png" width="34" border="0" alt="icon">
                                                            </a>
                                                          </td>
                                                          <td width="7"></td>
                                                        </tr>
                                                      </tbody>
                                                    </table>
                                                  </td>
                                                  <td class="rwd-on-mobile" align="center" valign="middle" height="34" style="height:34px;">
                                                    <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation">
                                                      <tbody>
                                                        <tr>
                                                          <td width="7"></td>
                                                          <td align="center">
                                                            <a href="{%insta%}" target="_blank">
                                                              <img style="width:36px;border:0px;display:inline!important;" src="{%s3Bucket%}/Media/EMAIL/emailPics/ico_instagram.png" width="34" border="0" alt="icon">
                                                            </a>
                                                          </td>
                                                          <td width="7"></td>
                                                        </tr>
                                                      </tbody>
                                                    </table>
                                                  </td>
                                                  <td class="rwd-on-mobile" align="center" valign="middle" height="34" style="height:34px;">
                                                    <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation">
                                                      <tbody>
                                                        <tr>
                                                          <td width="7"></td>
                                                          <td align="center">
                                                            <img style="width:36px;border:0px;display:inline!important;" src="{%s3Bucket%}/Media/EMAIL/emailPics/ico_twitter.png" width="34" border="0" alt="icon">
                                                          </td>
                                                          <td width="7"></td>
                                                        </tr>
                                                      </tbody>
                                                    </table>
                                                  </td>
                                                </tr>
                                              </tbody>
                                            </table>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                    <!-- Social Icons -->
                                  </td>
                                </tr>
                                <tr>
                                  <td height="20" style="font-size:20px;line-height:20px;">&nbsp;</td>
                                </tr>
                                <tr>
                                  <td class="center-text" align="center" style="font-family:Roboto, Arial, Helvetica, sans-serif;font-size:14px;line-height:24px;font-weight:400;font-style:normal;color:rgb(255, 255, 255);text-decoration:none;letter-spacing:0px;">
                                    <div style="margin: 0px; padding: 0px;">
                                      <p style="margin: 0px; padding: 0px;">{%appName%} - Your Edvantage App </p>
                                      <p style="margin: 0px; padding: 0px;"></p>
                                    </div>
                                  </td>
                                </tr>
                                <tr>
                                  <td class="center-text" align="center" style="font-family:Roboto, Arial, Helvetica, sans-serif;font-size:14px;line-height:24px;font-weight:400;font-style:normal;color:rgb(255, 255, 255);text-decoration:none;letter-spacing:0px;"></td>
                                </tr>
                                <tr>
                                  <td class="center-text" align="center" style="font-family:Roboto, Arial, Helvetica, sans-serif;font-size:14px;line-height:24px;font-weight:400;font-style:normal;color:rgb(255, 255, 255);text-decoration:none;letter-spacing:0px;">
                                    <a href="mailto:{%adminMail%}" style="color: rgb(255, 255, 255); font-family: Roboto, Arial, Helvetica, sans-serif; text-decoration: none;">
                                      <span>{%adminMail%} </span>
                                    </a> - <a href="{%appLink%}" style="color: rgb(255, 255, 255); font-family: Roboto, Arial, Helvetica, sans-serif; text-decoration: none;">
                                      <span>{%appLink%} </span>
                                    </a>
                                  </td>
                                </tr>
                                <tr>
                                  <td height="20" style="font-size:20px;line-height:20px;">&nbsp;</td>
                                </tr>
                                <tr>
                                  <td height="50" style="font-size:50px;line-height:50px;">&nbsp;</td>
                                </tr>
                              </tbody>
                            </table>
                            <!-- inner-table -->
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <!-- Tags -->
                    <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="width:100%;max-width:100%;">
                      <tbody>
                        <tr>
                          <td height="20" style="font-size:20px;line-height:20px;">&nbsp;</td>
                        </tr>
                        <tr>
                          <td align="center">
                            <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation">
                              <tbody>
                                <tr class="center-on-mobile">
                                  <td class="rwd-on-mobile center-text" align="center" style="font-family:Roboto, Arial, Helvetica, sans-serif;font-size:14px;line-height:24px;font-weight:400;font-style:normal;color:rgb(110, 110, 110);text-decoration:none;letter-spacing:0px;">
                                    <a href="#" style="font-family:'PT Sans',Arial,Helvetica,sans-serif;font-size:12px;font-weight:400;line-height:22px;color:#6e6e6e;text-decoration:none;">UNSUBSCRIBE</a>
                                  </td>
                                  <td class="rwd-on-mobile center-text" align="center" valign="middle" style="padding:0 0 0 0!important">
                                    <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation">
                                      <tbody>
                                        <tr>
                                          <td class="hide-mobile" width="5"></td>
                                          <td class="center-text" align="center" style="font-family:Roboto, Arial, Helvetica, sans-serif;font-size:12px;line-height:22px;font-weight:400;font-style:normal;color:rgb(110, 110, 110);text-decoration:none;letter-spacing:0px;">|</td>
                                          <td class="hide-mobile" width="5"></td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                  <td class="rwd-on-mobile center-text" align="center" style="font-family:Roboto, Arial, Helvetica, sans-serif;font-size:14px;line-height:24px;font-weight:400;font-style:normal;color:rgb(110, 110, 110);text-decoration:none;letter-spacing:0px;">
                                    <a href="#" style="font-family:'PT Sans',Arial,Helvetica,sans-serif;font-size:12px;font-weight:400;line-height:22px;color:#6e6e6e;text-decoration:none;">WEB VERSION</a>
                                  </td>
                                  <td class="rwd-on-mobile center-text" align="center" valign="middle" style="padding:0 0 0 0!important">
                                    <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation">
                                      <tbody>
                                        <tr>
                                          <td class="hide-mobile" width="5"></td>
                                          <td class="center-text" align="center" style="font-family:Roboto, Arial, Helvetica, sans-serif;font-size:12px;line-height:22px;font-weight:400;font-style:normal;color:rgb(110, 110, 110);text-decoration:none;letter-spacing:0px;">|</td>
                                          <td class="hide-mobile" width="5"></td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                  <td class="rwd-on-mobile center-text" align="center" style="font-family:Roboto, Arial, Helvetica, sans-serif;font-size:14px;line-height:24px;font-weight:400;font-style:normal;color:rgb(110, 110, 110);text-decoration:none;letter-spacing:0px;">
                                    <a href="#" style="font-family:'PT Sans',Arial,Helvetica,sans-serif;font-size:12px;font-weight:400;line-height:22px;color:#6e6e6e;text-decoration:none;">SEND TO A FRIEND</a>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td height="20" style="font-size:20px;line-height:20px;">&nbsp;</td>
                        </tr>
                      </tbody>
                    </table>
                    <!-- Tags -->
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
    </td>
    </tr>
    <!-- Outer-Table -->
    </tbody>
    </table>
  </body>
</html>`,
		subject: 'Welcome to My Professor',
	},
	{
		code: Constants.EmailCodes.MY_PROFESSOR_WELCOME_EMAIL,
		body: `<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
  <head>
    <!--[if (gte mso 9)|(IE)]>
		<xml>
			<o:OfficeDocumentSettings>
				<o:AllowPNG/>
				<o:PixelsPerInch>96</o:PixelsPerInch>
			</o:OfficeDocumentSettings>
		</xml>
		<![endif]-->
    <meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- So that mobile will display zoomed in -->
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <!-- enable media queries for windows phone 8 -->
    <meta name="format-detection" content="telephone=no">
    <!-- disable auto telephone linking in iOS -->
    <meta name="format-detection" content="date=no">
    <!-- disable auto date linking in iOS -->
    <meta name="format-detection" content="address=no">
    <!-- disable auto address linking in iOS -->
    <meta name="format-detection" content="email=no">
    <!-- disable auto email linking in iOS -->
    <meta name="color-scheme" content="only">
    <title></title>
    <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&amp;display=swap" rel="stylesheet">
    <style type="text/css">
      /*Basics*/
      body {
        margin: 0px !important;
        padding: 0px !important;
        display: block !important;
        min-width: 100% !important;
        width: 100% !important;
        -webkit-text-size-adjust: none;
      }

      table {
        border-spacing: 0;
        mso-table-lspace: 0pt;
        mso-table-rspace: 0pt;
      }

      table td {
        border-collapse: collapse;
        mso-line-height-rule: exactly;
      }

      td img {
        -ms-interpolation-mode: bicubic;
        width: auto;
        max-width: auto;
        height: auto;
        margin: auto;
        display: block !important;
        border: 0px;
      }

      td p {
        margin: 0;
        padding: 0;
      }

      td div {
        margin: 0;
        padding: 0;
      }

      td a {
        text-decoration: none;
        color: inherit;
      }

      .parent {
        text-align: center;
      }

      .child {
        display: inline-block;
        margin:0px 20px;
      }

      /*Outlook*/
      .ExternalClass {
        width: 100%;
      }

      .ExternalClass,
      .ExternalClass p,
      .ExternalClass span,
      .ExternalClass font,
      .ExternalClass td,
      .ExternalClass div {
        line-height: inherit;
      }

      .ReadMsgBody {
        width: 100%;
        background-color: #ffffff;
      }

      /* iOS BLUE LINKS */
      a[x-apple-data-detectors] {
        color: inherit !important;
        text-decoration: none !important;
        font-size: inherit !important;
        font-family: inherit !important;
        font-weight: inherit !important;
        line-height: inherit !important;
      }

      /*Gmail blue links*/
      u+#body a {
        color: inherit;
        text-decoration: none;
        font-size: inherit;
        font-family: inherit;
        font-weight: inherit;
        line-height: inherit;
      }

      /*Buttons fix*/
      .undoreset a,
      .undoreset a:hover {
        text-decoration: none !important;
      }

      .yshortcuts a {
        border-bottom: none !important;
      }

      .ios-footer a {
        color: #aaaaaa !important;
        text-decoration: none;
      }

      /*Responsive*/
      @media screen and (max-width:799px) {
        table.row {
          width: 100% !important;
          max-width: 100% !important;
        }

        td.row {
          width: 100% !important;
          max-width: 100% !important;
        }

        .img-responsive img {
          width: 100% !important;
          max-width: 100% !important;
          height: auto !important;
          margin: auto;
        }

        .center-float {
          float: none !important;
          margin: auto !important;
        }

        .center-text {
          text-align: center !important;
        }

        .container-padding {
          width: 100% !important;
          padding-left: 15px !important;
          padding-right: 15px !important;
        }

        .container-padding10 {
          width: 100% !important;
          padding-left: 10px !important;
          padding-right: 10px !important;
        }

        .hide-mobile {
          display: none !important;
        }

        .menu-container {
          text-align: center !important;
        }

        .autoheight {
          height: auto !important;
        }

        .m-padding-10 {
          margin: 10px 0 !important;
        }

        .m-padding-15 {
          margin: 15px 0 !important;
        }

        .m-padding-20 {
          margin: 20px 0 !important;
        }

        .m-padding-30 {
          margin: 30px 0 !important;
        }

        .m-padding-40 {
          margin: 40px 0 !important;
        }

        .m-padding-50 {
          margin: 50px 0 !important;
        }

        .m-padding-60 {
          margin: 60px 0 !important;
        }

        .m-padding-top10 {
          margin: 30px 0 0 0 !important;
        }

        .m-padding-top15 {
          margin: 15px 0 0 0 !important;
        }

        .m-padding-top20 {
          margin: 20px 0 0 0 !important;
        }

        .m-padding-top30 {
          margin: 30px 0 0 0 !important;
        }

        .m-padding-top40 {
          margin: 40px 0 0 0 !important;
        }

        .m-padding-top50 {
          margin: 50px 0 0 0 !important;
        }

        .m-padding-top60 {
          margin: 60px 0 0 0 !important;
        }

        .m-height10 {
          font-size: 10px !important;
          line-height: 10px !important;
          height: 10px !important;
        }

        .m-height15 {
          font-size: 15px !important;
          line-height: 15px !important;
          height: 15px !important;
        }

        .m-height20 {
          font-size: 20px !important;
          line-height: 20px !important;
          height: 20px !important;
        }

        .m-height25 {
          font-size: 25px !important;
          line-height: 25px !important;
          height: 25px !important;
        }

        .m-height30 {
          font-size: 30px !important;
          line-height: 30px !important;
          height: 30px !important;
        }

        .rwd-on-mobile {
          display: inline-block !important;
          padding: 5px;
        }

        .center-on-mobile {
          text-align: center !important;
        }
      }
    </style>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:100,100italic,300,300italic,400,400italic,500,500italic,700,700italic,900,900italic">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:100,100italic,300,300italic,400,400italic,500,500italic,700,700italic,900,900italic">
  </head>
  <body style="margin-top:0;margin-bottom:0;padding-top:0;padding-bottom:0;width:100%;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;" bgcolor="#F4ECFA">
    <span class="preheader-text" style="color:transparent;height:0;max-height:0;max-width:0;opacity:0;overflow:hidden;visibility:hidden;width:0;display:none;mso-hide:all;"></span>
    <!-- Preheader white space hack -->
    <div style="display:none;max-height:0px;overflow:hidden;"> ‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp; </div>
    <table border="0" align="center" cellpadding="0" cellspacing="0" width="100%" style="width:100%;max-width:100%;">
      <tbody>
        <tr>
          <!-- Outer Table -->
          <td align="center" bgcolor="#F4ECFA">
            <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation" class="row" width="600" style="width:600px;max-width:600px;">
              <tbody>
                <tr>
                  <!-- Preheader-2 -->
                  <td height="20" style="font-size:20px;line-height:20px;">&nbsp;</td>
                </tr>
                <tr>
                  <td class="center-text" align="right">
                    <a href="#" style="font-family:'PT Sans',Arial,Helvetica,sans-serif;font-size:12px;line-height:16px;font-style:normal;font-weight:400;color:#6e6e6e;text-decoration:none;letter-spacing:0px;">View this email in your browser</a>
                  </td>
                </tr>
                <tr>
                  <td height="20" style="font-size:20px;line-height:20px;">&nbsp;</td>
                </tr>
              </tbody>
            </table>
            <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation" class="row" width="600" style="width:600px;max-width:600px;">
              <!-- purple-header-2 -->
              <tbody>
                <tr>
                  <td align="center" bgcolor="#FFFFFF" style="border-radius:10px 10px 0 0;">
                    <!-- gradient -->
                    <!-- gradient -->
                    <!-- inner-table -->
                    <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation" class="row" width="500" style="width:500px;max-width:500px;">
                      <tbody>
                        <tr>
                          <td align="center" class="container-padding">
                            <!-- content -->
                            <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="width:100%;max-width:100%;">
                              <tbody>
                                <tr>
                                  <td height="30" style="font-size:30px;line-height:30px;">&nbsp;</td>
                                </tr>
                                <tr>
                                  <td align="center" class="center-text">
                                    <img style="width:220px;border:0px;display:inline!important;" src="{%s3Bucket%}/Media/EMAIL/emailPics/myprofessor-new.png" width="180" border="0" alt="logo">
                                  </td>
                                </tr>
                                <tr>
                                  <td height="30" style="font-size:30px;line-height:30px;">&nbsp;</td>
                                </tr>
                                <tr>
                                  <td height="30" style="font-size:30px;line-height:30px;">&nbsp;</td>
                                </tr>
                                <tr>
                                  <td align="center" class="center-text img-responsive">
                                    <img style="width:180px;border:0px;display:inline!important;" src="{%s3Bucket%}/Media/EMAIL/emailPics/img_intro_1.png" width="260" border="0" alt="intro">
                                  </td>
                                </tr>
                                <tr>
                                  <td height="50" style="font-size:50px;line-height:50px;">&nbsp;</td>
                                </tr>
                                <tr>
                                  <td height="15" style="font-size:15px;line-height:15px;">&nbsp;</td>
                                </tr>
                                <tr>
                                  <td class="center-text" align="center" style="font-family:Roboto, Arial, Helvetica, sans-serif;font-size:16px;line-height:26px;font-weight:300;font-style:normal;color:rgb(110, 110, 110);text-decoration:none;letter-spacing:0px;">
                                    <div style="margin: 0px; padding: 0px;"><p style="margin: 0px; padding: 0px;">
                                      Thank you for joining with the {%appName%} ! Your successfully completed the registration. We’re excited to have you get started. </p></div>
                                  </td>
                                </tr>
                                <tr>
                                  <td height="25" style="font-size:25px;line-height:25px;">&nbsp;</td>
                                </tr>
                               <td class="center-text" align="center" style="font-family:Roboto, Arial, Helvetica, sans-serif;font-size:16px;line-height:26px;font-weight:300;font-style:normal;color:rgb(110, 110, 110);text-decoration:none;letter-spacing:0px;">
                                    <div style="margin: 0px; padding: 0px;">
                                      <p style="margin: 0px; padding: 0px;"> Select the appropriate link for your device - Android or iOS </p>
                                      <p style="margin: 0px; padding: 0px;">
                                        <br>
                                      </p>
                                      <p class="parent" style="margin: 0px; padding: 0px;text-align:center;">
                                        <a class="child" href="{%appStore%}" target="_blank">
                                          <img style="display:block;width:100%;max-width:117px;border:0px;" width="117" src="{%s3Bucket%}/Media/EMAIL/emailPics/btn_appstore.png" border="0" alt="icon">
                                        </a>
                                          <a href="{%playStore%}" target="_blank" class="child">
                                            <img style="display:block;width:100%;max-width:117px;border:0px;" width="117" src="{%s3Bucket%}/Media/EMAIL/emailPics/btn_gplay.png" border="0" alt="icon">
                                          </a>
                                      </p>
                                    </div>
                                  </td>
                                <tr>
                                  <td height="40" style="font-size:40px;line-height:40px;">&nbsp;</td>
                                </tr>
                              </tbody>
                            </table>
                            <!-- content -->
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <!-- inner-table -->
                  </td>
                </tr>
              </tbody>
            </table>
            <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation" class="row" width="600" style="width:600px;max-width:600px;">
              <!-- purple-footer-2 -->
              <tbody>
                <tr>
                  <td align="center">
                    <!-- Content -->
                    <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="width:100%;max-width:100%;">
                      <tbody>
                        <tr>
                          <td align="center" bgcolor="{%color%}" class="container-padding" style="border-radius:0 0 10px 10px;">
                            <!-- inner-table -->
                            <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation" class="row" width="500" style="width:500px;max-width:500px;">
                              <tbody>
                                <tr>
                                  <td height="50" style="font-size:50px;line-height:50px;">&nbsp;</td>
                                </tr>
                                <tr>
                                  <td align="center">
                                    <!-- Social Icons -->
                                    <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="width:100%;max-width:100%;">
                                      <tbody>
                                        <tr>
                                          <td align="center">
                                            <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation">
                                              <tbody>
                                                <tr>
                                                  <td class="rwd-on-mobile" align="center" valign="middle" height="34" style="height:34px;">
                                                    <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation">
                                                      <tbody>
                                                        <tr>
                                                          <td width="7"></td>
                                                          <td align="center">
                                                            <a href="{%fb%}" target="_blank">
                                                              <img style="width:36px;border:0px;display:inline!important;" src="{%s3Bucket%}/Media/EMAIL/emailPics/ico_facebook.png" width="34" border="0" alt="icon">
                                                            </a>
                                                          </td>
                                                          <td width="7"></td>
                                                        </tr>
                                                      </tbody>
                                                    </table>
                                                  </td>
                                                  <td class="rwd-on-mobile" align="center" valign="middle" height="34" style="height:34px;">
                                                    <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation">
                                                      <tbody>
                                                        <tr>
                                                          <td width="7"></td>
                                                          <td align="center">
                                                            <a href="{%insta%}" target="_blank">
                                                              <img style="width:36px;border:0px;display:inline!important;" src="{%s3Bucket%}/Media/EMAIL/emailPics/ico_instagram.png" width="34" border="0" alt="icon">
                                                            </a>
                                                          </td>
                                                          <td width="7"></td>
                                                        </tr>
                                                      </tbody>
                                                    </table>
                                                  </td>
                                                  <td class="rwd-on-mobile" align="center" valign="middle" height="34" style="height:34px;">
                                                    <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation">
                                                      <tbody>
                                                        <tr>
                                                          <td width="7"></td>
                                                          <td align="center">
                                                            <img style="width:36px;border:0px;display:inline!important;" src="{%s3Bucket%}/Media/EMAIL/emailPics/ico_twitter.png" width="34" border="0" alt="icon">
                                                          </td>
                                                          <td width="7"></td>
                                                        </tr>
                                                      </tbody>
                                                    </table>
                                                  </td>
                                                </tr>
                                              </tbody>
                                            </table>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                    <!-- Social Icons -->
                                  </td>
                                </tr>
                                <tr>
                                  <td height="20" style="font-size:20px;line-height:20px;">&nbsp;</td>
                                </tr>
                                <tr>
                                  <td class="center-text" align="center" style="font-family:Roboto, Arial, Helvetica, sans-serif;font-size:14px;line-height:24px;font-weight:400;font-style:normal;color:rgb(255, 255, 255);text-decoration:none;letter-spacing:0px;">
                                    <div style="margin: 0px; padding: 0px;">
                                      <p style="margin: 0px; padding: 0px;">{%appName%} - Your Edvantage App </p>
                                      <p style="margin: 0px; padding: 0px;"></p>
                                    </div>
                                  </td>
                                </tr>
                                <tr>
                                  <td class="center-text" align="center" style="font-family:Roboto, Arial, Helvetica, sans-serif;font-size:14px;line-height:24px;font-weight:400;font-style:normal;color:rgb(255, 255, 255);text-decoration:none;letter-spacing:0px;"></td>
                                </tr>
                                <tr>
                                  <td class="center-text" align="center" style="font-family:Roboto, Arial, Helvetica, sans-serif;font-size:14px;line-height:24px;font-weight:400;font-style:normal;color:rgb(255, 255, 255);text-decoration:none;letter-spacing:0px;">
                                    <a href="mailto:{%adminMail%}" style="color: rgb(255, 255, 255); font-family: Roboto, Arial, Helvetica, sans-serif; text-decoration: none;">
                                      <span>{%adminMail%} </span>
                                    </a> - <a href="{%appLink%}" style="color: rgb(255, 255, 255); font-family: Roboto, Arial, Helvetica, sans-serif; text-decoration: none;">
                                      <span>{%appLink%} </span>
                                    </a>
                                  </td>
                                </tr>
                                <tr>
                                  <td height="20" style="font-size:20px;line-height:20px;">&nbsp;</td>
                                </tr>
                                <tr>
                                  <td height="50" style="font-size:50px;line-height:50px;">&nbsp;</td>
                                </tr>
                              </tbody>
                            </table>
                            <!-- inner-table -->
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <!-- Tags -->
                    <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="width:100%;max-width:100%;">
                      <tbody>
                        <tr>
                          <td height="20" style="font-size:20px;line-height:20px;">&nbsp;</td>
                        </tr>
                        <tr>
                          <td align="center">
                            <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation">
                              <tbody>
                                <tr class="center-on-mobile">
                                  <td class="rwd-on-mobile center-text" align="center" style="font-family:Roboto, Arial, Helvetica, sans-serif;font-size:14px;line-height:24px;font-weight:400;font-style:normal;color:rgb(110, 110, 110);text-decoration:none;letter-spacing:0px;">
                                    <a href="#" style="font-family:'PT Sans',Arial,Helvetica,sans-serif;font-size:12px;font-weight:400;line-height:22px;color:#6e6e6e;text-decoration:none;">UNSUBSCRIBE</a>
                                  </td>
                                  <td class="rwd-on-mobile center-text" align="center" valign="middle" style="padding:0 0 0 0!important">
                                    <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation">
                                      <tbody>
                                        <tr>
                                          <td class="hide-mobile" width="5"></td>
                                          <td class="center-text" align="center" style="font-family:Roboto, Arial, Helvetica, sans-serif;font-size:12px;line-height:22px;font-weight:400;font-style:normal;color:rgb(110, 110, 110);text-decoration:none;letter-spacing:0px;">|</td>
                                          <td class="hide-mobile" width="5"></td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                  <td class="rwd-on-mobile center-text" align="center" style="font-family:Roboto, Arial, Helvetica, sans-serif;font-size:14px;line-height:24px;font-weight:400;font-style:normal;color:rgb(110, 110, 110);text-decoration:none;letter-spacing:0px;">
                                    <a href="#" style="font-family:'PT Sans',Arial,Helvetica,sans-serif;font-size:12px;font-weight:400;line-height:22px;color:#6e6e6e;text-decoration:none;">WEB VERSION</a>
                                  </td>
                                  <td class="rwd-on-mobile center-text" align="center" valign="middle" style="padding:0 0 0 0!important">
                                    <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation">
                                      <tbody>
                                        <tr>
                                          <td class="hide-mobile" width="5"></td>
                                          <td class="center-text" align="center" style="font-family:Roboto, Arial, Helvetica, sans-serif;font-size:12px;line-height:22px;font-weight:400;font-style:normal;color:rgb(110, 110, 110);text-decoration:none;letter-spacing:0px;">|</td>
                                          <td class="hide-mobile" width="5"></td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                  <td class="rwd-on-mobile center-text" align="center" style="font-family:Roboto, Arial, Helvetica, sans-serif;font-size:14px;line-height:24px;font-weight:400;font-style:normal;color:rgb(110, 110, 110);text-decoration:none;letter-spacing:0px;">
                                    <a href="#" style="font-family:'PT Sans',Arial,Helvetica,sans-serif;font-size:12px;font-weight:400;line-height:22px;color:#6e6e6e;text-decoration:none;">SEND TO A FRIEND</a>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td height="20" style="font-size:20px;line-height:20px;">&nbsp;</td>
                        </tr>
                      </tbody>
                    </table>
                    <!-- Tags -->
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
    </td>
    </tr>
    <!-- Outer-Table -->
    </tbody>
    </table>
  </body>
</html>`,
		subject: 'Welcome to My Professor',
	},
	{
		code: Constants.EmailCodes.MY_PROFESSOR_PAYMENT_CONFIRMATION_EMAIL,
		body: `<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
  <head>
    <!--[if (gte mso 9)|(IE)]>
		<xml>
			<o:OfficeDocumentSettings>
				<o:AllowPNG/>
				<o:PixelsPerInch>96</o:PixelsPerInch>
			</o:OfficeDocumentSettings>
		</xml>
		<![endif]-->
    <meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- So that mobile will display zoomed in -->
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <!-- enable media queries for windows phone 8 -->
    <meta name="format-detection" content="telephone=no">
    <!-- disable auto telephone linking in iOS -->
    <meta name="format-detection" content="date=no">
    <!-- disable auto date linking in iOS -->
    <meta name="format-detection" content="address=no">
    <!-- disable auto address linking in iOS -->
    <meta name="format-detection" content="email=no">
    <!-- disable auto email linking in iOS -->
    <meta name="color-scheme" content="only">
    <title></title>
    <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&amp;display=swap" rel="stylesheet">
    <style type="text/css">
      /*Basics*/
      body {
        margin: 0px !important;
        padding: 0px !important;
        display: block !important;
        min-width: 100% !important;
        width: 100% !important;
        -webkit-text-size-adjust: none;
      }

      table {
        border-spacing: 0;
        mso-table-lspace: 0pt;
        mso-table-rspace: 0pt;
      }

      table td {
        border-collapse: collapse;
        mso-line-height-rule: exactly;
      }

      td img {
        -ms-interpolation-mode: bicubic;
        width: auto;
        max-width: auto;
        height: auto;
        margin: auto;
        display: block !important;
        border: 0px;
      }

      td p {
        margin: 0;
        padding: 0;
      }

      td div {
        margin: 0;
        padding: 0;
      }

      td a {
        text-decoration: none;
        color: inherit;
      }

      /*Outlook*/
      .ExternalClass {
        width: 100%;
      }

      .ExternalClass,
      .ExternalClass p,
      .ExternalClass span,
      .ExternalClass font,
      .ExternalClass td,
      .ExternalClass div {
        line-height: inherit;
      }

      .ReadMsgBody {
        width: 100%;
        background-color: #ffffff;
      }

      /* iOS BLUE LINKS */
      a[x-apple-data-detectors] {
        color: inherit !important;
        text-decoration: none !important;
        font-size: inherit !important;
        font-family: inherit !important;
        font-weight: inherit !important;
        line-height: inherit !important;
      }

      /*Gmail blue links*/
      u+#body a {
        color: inherit;
        text-decoration: none;
        font-size: inherit;
        font-family: inherit;
        font-weight: inherit;
        line-height: inherit;
      }

      /*Buttons fix*/
      .undoreset a,
      .undoreset a:hover {
        text-decoration: none !important;
      }

      .yshortcuts a {
        border-bottom: none !important;
      }

      .ios-footer a {
        color: #aaaaaa !important;
        text-decoration: none;
      }

      /*Responsive*/
      @media screen and (max-width:799px) {
        table.row {
          width: 100% !important;
          max-width: 100% !important;
        }

        td.row {
          width: 100% !important;
          max-width: 100% !important;
        }

        .img-responsive img {
          width: 100% !important;
          max-width: 100% !important;
          height: auto !important;
          margin: auto;
        }

        .center-float {
          float: none !important;
          margin: auto !important;
        }

        .center-text {
          text-align: center !important;
        }

        .container-padding {
          width: 100% !important;
          padding-left: 15px !important;
          padding-right: 15px !important;
        }

        .container-padding10 {
          width: 100% !important;
          padding-left: 10px !important;
          padding-right: 10px !important;
        }

        .hide-mobile {
          display: none !important;
        }

        .menu-container {
          text-align: center !important;
        }

        .autoheight {
          height: auto !important;
        }

        .m-padding-10 {
          margin: 10px 0 !important;
        }

        .m-padding-15 {
          margin: 15px 0 !important;
        }

        .m-padding-20 {
          margin: 20px 0 !important;
        }

        .m-padding-30 {
          margin: 30px 0 !important;
        }

        .m-padding-40 {
          margin: 40px 0 !important;
        }

        .m-padding-50 {
          margin: 50px 0 !important;
        }

        .m-padding-60 {
          margin: 60px 0 !important;
        }

        .m-padding-top10 {
          margin: 30px 0 0 0 !important;
        }

        .m-padding-top15 {
          margin: 15px 0 0 0 !important;
        }

        .m-padding-top20 {
          margin: 20px 0 0 0 !important;
        }

        .m-padding-top30 {
          margin: 30px 0 0 0 !important;
        }

        .m-padding-top40 {
          margin: 40px 0 0 0 !important;
        }

        .m-padding-top50 {
          margin: 50px 0 0 0 !important;
        }

        .m-padding-top60 {
          margin: 60px 0 0 0 !important;
        }

        .m-height10 {
          font-size: 10px !important;
          line-height: 10px !important;
          height: 10px !important;
        }

        .m-height15 {
          font-size: 15px !important;
          line-height: 15px !important;
          height: 15px !important;
        }

        .m-height20 {
          font-size: 20px !important;
          line-height: 20px !important;
          height: 20px !important;
        }

        .m-height25 {
          font-size: 25px !important;
          line-height: 25px !important;
          height: 25px !important;
        }

        .m-height30 {
          font-size: 30px !important;
          line-height: 30px !important;
          height: 30px !important;
        }

        .rwd-on-mobile {
          display: inline-block !important;
          padding: 5px;
        }

        .center-on-mobile {
          text-align: center !important;
        }
      }
    </style>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:100,100italic,300,300italic,400,400italic,500,500italic,700,700italic,900,900italic">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:100,100italic,300,300italic,400,400italic,500,500italic,700,700italic,900,900italic">
  </head>
  <body style="margin-top:0;margin-bottom:0;padding-top:0;padding-bottom:0;width:100%;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;" bgcolor="#F4ECFA">
    <span class="preheader-text" style="color:transparent;height:0;max-height:0;max-width:0;opacity:0;overflow:hidden;visibility:hidden;width:0;display:none;mso-hide:all;"></span>
    <!-- Preheader white space hack -->
    <div style="display:none;max-height:0px;overflow:hidden;"> ‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp; </div>
    <table border="0" align="center" cellpadding="0" cellspacing="0" width="100%" style="width:100%;max-width:100%;">
      <tbody>
        <tr>
          <!-- Outer Table -->
          <td align="center" bgcolor="#F4ECFA">
            <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation" class="row" width="600" style="width:600px;max-width:600px;">
              <tbody>
                <tr>
                  <!-- Preheader-2 -->
                  <td height="20" style="font-size:20px;line-height:20px;">&nbsp;</td>
                </tr>
                <tr>
                  <td class="center-text" align="right">
                    <a href="#" style="font-family:'PT Sans',Arial,Helvetica,sans-serif;font-size:12px;line-height:16px;font-style:normal;font-weight:400;color:#6e6e6e;text-decoration:none;letter-spacing:0px;">View this email in your browser</a>
                  </td>
                </tr>
                <tr>
                  <td height="20" style="font-size:20px;line-height:20px;">&nbsp;</td>
                </tr>
              </tbody>
            </table>
            <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation" class="row" width="600" style="width:600px;max-width:600px;">
              <!-- purple-header-2 -->
              <tbody>
                <tr>
                  <td align="center" bgcolor="#FFFFFF" style="border-radius:10px 10px 0 0;">
                    <!-- gradient -->
                    <!-- gradient -->
                    <!-- inner-table -->
                    <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation" class="row" width="500" style="width:500px;max-width:500px;">
                      <tbody>
                        <tr>
                          <td align="center" class="container-padding">
                            <!-- content -->
                            <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="width:100%;max-width:100%;">
                              <tbody>
                                <tr>
                                  <td height="30" style="font-size:30px;line-height:30px;">&nbsp;</td>
                                </tr>
                                <tr>
                                  <td align="center" class="center-text">
                                    <img style="width:120px;border:0px;display:inline!important;" src="{%s3Bucket%}/Media/EMAIL/emailPics/myprofessor-new.png" width="180" border="0" alt="logo">
                                  </td>
                                </tr>
                                <tr>
                                  <td height="30" style="font-size:30px;line-height:30px;">&nbsp;</td>
                                </tr>
                                <tr>
                                  <td class="center-text" align="center" style="font-family:Roboto, Arial, Helvetica, sans-serif;font-size:16px;line-height:26px;font-weight:300;font-style:normal;color:rgb(110, 110, 110);text-decoration:none;letter-spacing:0px;">
                                    <div style="margin: 0px; padding: 0px;">
                                      <p style="margin: 0px; padding: 0px;"> Hi {%name%}, Congratulations.!</p>
                                    </div>
                                  </td>
                                </tr>
                                <tr>
                                  <td class="center-text" align="center" style="font-family:Roboto, Arial, Helvetica, sans-serif;font-size:36px;line-height:40px;font-weight:700;font-style:normal;color:rgb(40, 40, 40);text-decoration:none;letter-spacing:0px;">
                                    <div style="margin: 0px; padding: 0px;">
                                      <p style="margin: 0px; padding: 0px;">Your Payment was Successful</p>
                                      <p style="margin: 0px; padding: 0px;"></p>
                                      <p style="margin: 0px; padding: 0px;"></p>
                                    </div>
                                  </td>
                                </tr>
                                <tr>
                                  <td height="30" style="font-size:30px;line-height:30px;">&nbsp;</td>
                                </tr>
                                <tr>
                                  <td align="center" class="center-text img-responsive">
                                    <img style="width: 180px;border:0px;display:inline!important;" src="{%s3Bucket%}/Media/EMAIL/emailPics/payment.png" width="260" border="0" alt="intro">
                                  </td>
                                </tr>
                                <tr>
                                  <td height="50" style="font-size:50px;line-height:50px;">&nbsp;</td>
                                </tr>
                                <tr>
                                  <td class="center-text" align="center" style="font-family:Roboto, Arial, Helvetica, sans-serif;font-size:16px;line-height:26px;font-weight:300;font-style:normal;color:rgb(110, 110, 110);text-decoration:none;letter-spacing:0px;">
                                    <div style="margin: 0px; padding: 0px;">
                                      <p style="margin: 0px; padding: 0px;"> Hi {%name%}, Congratulations.! Your Payment was Successful.</p>
                                    </div>
                                  </td>
                                </tr>
                                <tr>
                                  <td height="15" style="font-size:15px;line-height:15px;">&nbsp;</td>
                                </tr>
                                <tr>
                                  <td class="center-text" align="center" style="font-family:Roboto, Arial, Helvetica, sans-serif;font-size:16px;line-height:26px;font-weight:300;font-style:normal;color:rgb(110, 110, 110);text-decoration:none;letter-spacing:0px;">
                                    <div style="margin: 0px; padding: 0px;">
                                      <p style="margin: 0px; padding: 0px;"> Thank you for joining with the {%appName%} ! Your successfully completed the payment. We’re excited to have you get started. </p>
                                    </div>
                                  </td>
                                </tr>
                                <tr>
                                  <td height="25" style="font-size:25px;line-height:25px;">&nbsp;</td>
                                </tr>
                                <tr>
                                  <td height="40" style="font-size:40px;line-height:40px;">&nbsp;</td>
                                </tr>
                              </tbody>
                            </table>
                            <!-- content -->
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <!-- inner-table -->
                  </td>
                </tr>
              </tbody>
            </table>
            <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation" class="row" width="600" style="width:600px;max-width:600px;">
              <!-- purple-footer-2 -->
              <tbody>
                <tr>
                  <td align="center">
                    <!-- Content -->
                    <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="width:100%;max-width:100%;">
                      <tbody>
                        <tr>
                          <td align="center" bgcolor="{%color%}" class="container-padding" style="border-radius:0 0 10px 10px;">
                            <!-- inner-table -->
                            <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation" class="row" width="500" style="width:500px;max-width:500px;">
                              <tbody>
                                <tr>
                                  <td height="50" style="font-size:50px;line-height:50px;">&nbsp;</td>
                                </tr>
                                <tr>
                                  <td align="center">
                                    <!-- Social Icons -->
                                    <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="width:100%;max-width:100%;">
                                      <tbody>
                                        <tr>
                                          <td align="center">
                                            <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation">
                                              <tbody>
                                                <tr>
                                                  <td class="rwd-on-mobile" align="center" valign="middle" height="34" style="height:34px;">
                                                    <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation">
                                                      <tbody>
                                                        <tr>
                                                          <td width="7"></td>
                                                          <td align="center">
                                                            <a href="{%fb%}" target="_blank">
                                                              <img style="width:36px;border:0px;display:inline!important;" src="{%s3Bucket%}/Media/EMAIL/emailPics/ico_facebook.png" width="34" border="0" alt="icon">
                                                            </a>
                                                          </td>
                                                          <td width="7"></td>
                                                        </tr>
                                                      </tbody>
                                                    </table>
                                                  </td>
                                                  <td class="rwd-on-mobile" align="center" valign="middle" height="34" style="height:34px;">
                                                    <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation">
                                                      <tbody>
                                                        <tr>
                                                          <td width="7"></td>
                                                          <td align="center">
                                                            <a href="{%insta%}" target="_blank">
                                                              <img style="width:36px;border:0px;display:inline!important;" src="{%s3Bucket%}/Media/EMAIL/emailPics/ico_instagram.png" width="34" border="0" alt="icon">
                                                            </a>
                                                          </td>
                                                          <td width="7"></td>
                                                        </tr>
                                                      </tbody>
                                                    </table>
                                                  </td>
                                                  <td class="rwd-on-mobile" align="center" valign="middle" height="34" style="height:34px;">
                                                    <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation">
                                                      <tbody>
                                                        <tr>
                                                          <td width="7"></td>
                                                          <td align="center">
                                                            <img style="width:36px;border:0px;display:inline!important;" src="{%s3Bucket%}/Media/EMAIL/emailPics/ico_twitter.png" width="34" border="0" alt="icon">
                                                          </td>
                                                          <td width="7"></td>
                                                        </tr>
                                                      </tbody>
                                                    </table>
                                                  </td>
                                                </tr>
                                              </tbody>
                                            </table>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                    <!-- Social Icons -->
                                  </td>
                                </tr>
                                <tr>
                                  <td height="20" style="font-size:20px;line-height:20px;">&nbsp;</td>
                                </tr>
                                <tr>
                                  <td class="center-text" align="center" style="font-family:Roboto, Arial, Helvetica, sans-serif;font-size:14px;line-height:24px;font-weight:400;font-style:normal;color:rgb(255, 255, 255);text-decoration:none;letter-spacing:0px;">
                                    <div style="margin: 0px; padding: 0px;">
                                      <p style="margin: 0px; padding: 0px;">{%appName%} - Your Edvantage App </p>
                                      <p style="margin: 0px; padding: 0px;"></p>
                                    </div>
                                  </td>
                                </tr>
                                <tr>
                                  <td class="center-text" align="center" style="font-family:Roboto, Arial, Helvetica, sans-serif;font-size:14px;line-height:24px;font-weight:400;font-style:normal;color:rgb(255, 255, 255);text-decoration:none;letter-spacing:0px;">
                                    <a href="" style="color: rgb(255, 255, 255); font-family: Roboto, Arial, Helvetica, sans-serif; text-decoration: none;">
                                      <span></span>
                                    </a> - <a href="" style="color: rgb(255, 255, 255); font-family: Roboto, Arial, Helvetica, sans-serif; text-decoration: none;">
                                      <span></span>
                                    </a>
                                  </td>
                                </tr>
                                <tr>
                                  <td class="center-text" align="center" style="font-family:Roboto, Arial, Helvetica, sans-serif;font-size:14px;line-height:24px;font-weight:400;font-style:normal;color:rgb(255, 255, 255);text-decoration:none;letter-spacing:0px;">
                                    <a href="mailto:{%adminMail%}" style="color: rgb(255, 255, 255); font-family: Roboto, Arial, Helvetica, sans-serif; text-decoration: none;">
                                      <span>{%adminMail%} </span>
                                    </a> - <a href="{%appLink %}" style="color: rgb(255, 255, 255); font-family: Roboto, Arial, Helvetica, sans-serif; text-decoration: none;">
                                      <span>{%appLink%} </span>
                                    </a>
                                  </td>
                                </tr>
                                <tr>
                                  <td height="20" style="font-size:20px;line-height:20px;">&nbsp;</td>
                                </tr>
                                <tr>
                                  <td align="center">
                                    <!-- Buttons -->
                                    <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation" class="row" width="100%" style="width:100%;max-width:100%;">
                                      <tbody>
                                        <tr>
                                          <td align="center">
                                            <!-- column -->
                                            <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation">
                                              <tbody>
                                                <tr>
                                                  <td align="center">
                                                    <a href="{%appStore%}" target="_blank">
                                                      <img style="display:block;width:100%;max-width:117px;border:0px;" width="117" src="{%s3Bucket%}/Media/EMAIL/emailPics/btn_appstore.png" border="0" alt="icon">
                                                    </a>
                                                  </td>
                                                  <td width="10" style="width:10px;"></td>
                                                  <td align="center">
                                                    <a href="{%playStore%}" target="_blank">
                                                      <img style="display:block;width:100%;max-width:117px;border:0px;" width="117" src="{%s3Bucket%}/Media/EMAIL/emailPics/btn_gplay.png" border="0" alt="icon">
                                                    </a>
                                                  </td>
                                                </tr>
                                              </tbody>
                                            </table>
                                            <!-- column -->
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                    <!-- Buttons -->
                                  </td>
                                </tr>
                                <tr>
                                  <td height="50" style="font-size:50px;line-height:50px;">&nbsp;</td>
                                </tr>
                              </tbody>
                            </table>
                            <!-- inner-table -->
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <!-- Tags -->
                    <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="width:100%;max-width:100%;">
                      <tbody>
                        <tr>
                          <td height="20" style="font-size:20px;line-height:20px;">&nbsp;</td>
                        </tr>
                        <tr>
                          <td align="center">
                            <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation">
                              <tbody>
                                <tr class="center-on-mobile">
                                  <td class="rwd-on-mobile center-text" align="center" style="font-family:Roboto, Arial, Helvetica, sans-serif;font-size:14px;line-height:24px;font-weight:400;font-style:normal;color:rgb(110, 110, 110);text-decoration:none;letter-spacing:0px;">
                                    <a href="#" style="font-family:'PT Sans',Arial,Helvetica,sans-serif;font-size:12px;font-weight:400;line-height:22px;color:#6e6e6e;text-decoration:none;">UNSUBSCRIBE</a>
                                  </td>
                                  <td class="rwd-on-mobile center-text" align="center" valign="middle" style="padding:0 0 0 0!important">
                                    <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation">
                                      <tbody>
                                        <tr>
                                          <td class="hide-mobile" width="5"></td>
                                          <td class="center-text" align="center" style="font-family:Roboto, Arial, Helvetica, sans-serif;font-size:12px;line-height:22px;font-weight:400;font-style:normal;color:rgb(110, 110, 110);text-decoration:none;letter-spacing:0px;">|</td>
                                          <td class="hide-mobile" width="5"></td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                  <td class="rwd-on-mobile center-text" align="center" style="font-family:Roboto, Arial, Helvetica, sans-serif;font-size:14px;line-height:24px;font-weight:400;font-style:normal;color:rgb(110, 110, 110);text-decoration:none;letter-spacing:0px;">
                                    <a href="#" style="font-family:'PT Sans',Arial,Helvetica,sans-serif;font-size:12px;font-weight:400;line-height:22px;color:#6e6e6e;text-decoration:none;">WEB VERSION</a>
                                  </td>
                                  <td class="rwd-on-mobile center-text" align="center" valign="middle" style="padding:0 0 0 0!important">
                                    <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation">
                                      <tbody>
                                        <tr>
                                          <td class="hide-mobile" width="5"></td>
                                          <td class="center-text" align="center" style="font-family:Roboto, Arial, Helvetica, sans-serif;font-size:12px;line-height:22px;font-weight:400;font-style:normal;color:rgb(110, 110, 110);text-decoration:none;letter-spacing:0px;">|</td>
                                          <td class="hide-mobile" width="5"></td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                  <td class="rwd-on-mobile center-text" align="center" style="font-family:Roboto, Arial, Helvetica, sans-serif;font-size:14px;line-height:24px;font-weight:400;font-style:normal;color:rgb(110, 110, 110);text-decoration:none;letter-spacing:0px;">
                                    <a href="#" style="font-family:'PT Sans',Arial,Helvetica,sans-serif;font-size:12px;font-weight:400;line-height:22px;color:#6e6e6e;text-decoration:none;">SEND TO A FRIEND</a>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td height="20" style="font-size:20px;line-height:20px;">&nbsp;</td>
                        </tr>
                      </tbody>
                    </table>
                    <!-- Tags -->
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
    </td>
    </tr>
    <!-- Outer-Table -->
    </tbody>
    </table>
  </body>
</html>`,
		subject: 'Payment Confirmation',
	},
	{
		code: Constants.EmailCodes.MY_PROFESSOR_CONTACT_EMAIL,
		body: `<!DOCTYPE html>
            <html>
            <head>
                <title>Contact Form Submission</title>
            </head>
            <body>
                <h2>Contact Form Submission</h2>

                <p><strong>From:</strong> {%email%}</p>

                <p><strong>Subject:</strong> {%subject%}</p>

                <h3>Message:</h3>
                <p>{%message%}</p>

                <h3>Contact Details:</h3>
                <p><strong>Name:</strong> {%name%}</p>
                <p><strong>Email:</strong> {%email%}</p>
                <p><strong>Mobile:</strong>{%mobileNumber%}</p>
            </body>
            </html>`,
		subject: 'Contact Form Submission',
	},
];
export { EmailTemplates };
