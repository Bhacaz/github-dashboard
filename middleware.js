export default function middleware(request) {
    const url = new URL(request.url);
    // protect all path except root with basic auth
    if (url.pathname !== '/') {
        const authorization = request.headers.get('authorization');
        if (authorization === null) {
            return new Response(null, {
                status: 401,
                headers: {
                    'WWW-Authenticate': 'Basic realm="Please enter your credentials to proceed"'
                }
            });
        }
        const [username, password] = atob(authorization.split(' ')[1]).split(':');
        if (username !== process.env.USERNAME || password !== process.env.PASSWORD) {
            return new Response(null, {
                status: 403,
                headers: {
                    'WWW-Authenticate': 'Basic realm="Please enter your credentials to proceed"'
                }
            });
        }
    }
}
