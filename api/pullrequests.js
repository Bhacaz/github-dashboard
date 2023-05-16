const { Octokit } = require('@octokit/rest');

// Create an Octokit instance using your personal access token
const octokit = new Octokit({
    auth: process.env.GH_TOKEN
});

export default function handler(request, response) {
    let q = 'is:open is:pr author:@me sort:updated';
    // let q = 'is:pr is:open review-requested:@me state:open type:pullrequests';
    octokit.search.issuesAndPullRequests({ q, order: 'desc' })
        .then(({ data }) => {
            // console.log(data);
            response.status(200).json(data);
    }).catch((error) => {
        console.log(error);
        response.status(error.status).json(error);
    });
}
