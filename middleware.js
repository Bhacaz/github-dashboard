export default function middleware(request) {
    const url = new URL(request.url);

    if (url.pathname.startsWith('/dashboard') || url.pathname.startsWith('/api/pullrequests')) {
        let token;
        let ghAccessTokenCookie = request.headers.get('cookie').split('; ').find(row => row.startsWith('github_dashboard_token'))
        if (ghAccessTokenCookie) {
            token = ghAccessTokenCookie.split('=')[1];
        }
        if (!token) {
            const redirectUrl = request.url.replace(url.pathname, '')
            return Response.redirect(redirectUrl, 302);
        }
    }
}
