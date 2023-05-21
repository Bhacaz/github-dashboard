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
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code,
            }),
        })
            .then(auth_response => auth_response.json() )
            .then((data) => {
            console.log(data);
            const accessToken = data.access_token;

            // Set the access token as an HTTP cookie
            response.setHeader('Set-Cookie', `access_token=${accessToken}; Path=/; HttpOnly`);

            // Redirect the user to a different URL
            response.setHeader('Location', '/dashboard');
            response.status(302).end();
        })
        .catch((error) => {
            response.status(error.status).json(error);
        });
};
