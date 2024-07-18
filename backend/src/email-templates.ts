export const resetPasswordHtml = (url: string) => {
  const html = `<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Reset Password</title>
  </head>
  <body>
    <h1>Reset Password</h1>
    <p>Click the link below to reset your password</p>
    <a href="{{resetPasswordUrl}}">Reset Password</a>

    <p>
      If link above does not work - please copy and paste this link into your
      browser
    </p>
    <p>{{resetPasswordUrl}}</p>

    <p>Password reset link will expire in one hour</p>
  </body>
</html>`;

  return html.replace(/{{resetPasswordUrl}}/g, url);
};

export const newUserEmailUser = (newUserFullName: string) => {
  const html = `
  <html lang="en">
  <head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Verify Email</title>
  </head>
  <body>
  <h1>Praise-Pal Pending Verification</h1>
  <p>Hi {{newUserFullName}}</p>
  <p>Your new user request is pending admin approval</p>
  <p>Please reach out <a href='mailto:support@praise-pal.com'>support@praise-pal.com</a> if you have any questions or concerns</p>

  </body>
  </html>
  `;

  return html.replace(/{{newUserFullName}}/g, newUserFullName);
};

export const newUserEmailOwner = (url: string, newUserFullName: string) => {
  const html = `
  <html lang="en">
  <head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New User Verification</title>
  </head>
  <body>
  <h1>Verify Email</h1>
  <p>{{newUserFullName}} has requsted to join your company. Click the link below to verify user</p>
  <a href="{{verifyEmailUrl}}">Verify User</a>
  
  <p>
  If link above does not work - please copy and paste this link into your
  browser
  </p>
  <p>{{verifyEmailUrl}}</p>
  
  </body>
  </html>
  `;

  return html
    .replace(/{{verifyEmailUrl}}/g, url)
    .replace(/{{newUserFullName}}/g, newUserFullName);
};

export const userVerifiedEmail = (
  newUserFirstName: string,
  companyName: string,
) => {
  const html = `
  <html lang="en">
  <head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Verify Email</title>
  </head>
  <body>
  <h1>You've been approved!</h1>
  <p>Congratulations! {{newUserFullName}}</p>
  <p>You've been approved to join {{companyName}} and share kudos with your co-workers. </p>
  <p><a href='https://praise-pal.com' target="_blank">Click here to start sharing!</a></p>

  </body>
  </html>
  `;

  return html
    .replace(/{{newUserFullName}}/g, newUserFirstName)
    .replace(/{{companyName}}/g, companyName);
};

export const cronErrorEmailHtml = (
  errorDetails: string,
  errorTitle: string,
) => {
  const html = `<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Error Notification</title>
  </head>
  <body>
    <h1>Error Notification</h1>
    <p>An error occurred duringb {{title}}</p>
    <p>Error Details:</p>
    <pre>{{errorDetails}}</pre>
  </body>
</html>`;
  html.replace(/{{errorDetails}}/g, errorDetails);
  html.replace(/{{title}}/g, errorTitle);

  return html;
};
