const encryption = require('../utils/encryption');
export default function handler(request, response) {
    const { code } = request.query; // retrieve the authorization code from the query parameters

        // Exchange the authorization code for an access token
        fetch("https://github.com/login/oauth/access_token", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({
                client_id: process.env.VITE_GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code,
            }),
        })
            .then(auth_response => auth_response.json() )
            .then((data) => {
            const accessToken = data.access_token;
            const encryptedAccessToken = encryption.encrypt(accessToken);

            const setSecure = process.env.VERCEL_ENV === 'production' ? 'Secure' : '';
            const expireInOneWeek = `Max-Age=${60 * 60 * 24 * 7}`;
            // Set the access token as an HTTP cookie
            response.setHeader('Set-Cookie', `github_dashboard_token=${encryptedAccessToken}; ${expireInOneWeek}; Path=/; HttpOnly; ${setSecure}`);

            // Redirect the user to a different URL
            response.setHeader('Location', '/dashboard');
            response.status(302).end();
        })
        .catch((error) => {
            response.status(500).json(error);
        });
};
