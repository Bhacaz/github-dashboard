const { Octokit } = require('@octokit/rest');

// Create an Octokit instance using your personal access token
const octokit = new Octokit({
    auth: process.env.GH_TOKEN
});

async function allReviewRequested() {
    let q = 'is:pr is:open review-requested:@me state:open type:pullrequests';
    return octokit.search.issuesAndPullRequests({ q, order: 'desc' })
        .then(({ data }) => {
            return data;
        }).catch((error) => {
            console.log(error);
        });
}

async function fetchPullRequest(owner, repo, pull_number) {
    return octokit.pulls.get({
        owner,
        repo,
        pull_number
    })
        .then(({ data }) => {
            return data;
        })
        .catch((error) => {
            console.log(error);
        });
}

async function filterReviewAssignPullRequests() {
    const allReviewRequestedPR = await allReviewRequested();
    const reviewByTeam = [];

    let individualPRs = allReviewRequestedPR.items.map((item) => {
        let [owner, repo, pullString, pull_number] = item.html_url.split('/').slice(-4);
        return fetchPullRequest(owner, repo, pull_number);
    });

    individualPRs = await Promise.all(individualPRs);

    individualPRs.forEach((pr) => {
        let directReviewRequest = pr.requested_reviewers.filter((reviewer) => {
            return reviewer.login === process.env.GH_USERNAME;
        });
        if (directReviewRequest.length > 0 ) {
            reviewByTeam.push(pr);
        }
    });
    return reviewByTeam;
}

export default function handler(request, response) {
    filterReviewAssignPullRequests().then((data) => {
        response.status(200).json(data);
    });
}
