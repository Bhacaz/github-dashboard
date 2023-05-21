const { Octokit } = require('@octokit/rest');

const octokit = new Octokit({
    auth: process.env.GH_TOKEN
});

const PRQUERY = 'is:open is:pr author:@me sort:updated';
const ASSIGNTOMEQUERY = 'is:open is:pr assignee:@me sort:updated';
const ALLREVIEWREQUESTEDQUERY = 'is:pr is:open review-requested:@me state:open type:pullrequests';

async function allReviewRequested() {
    let q = ALLREVIEWREQUESTEDQUERY;
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

async function fetchAllIndividualPRs() {
    const allReviewRequestedPR = await allReviewRequested();

    let individualPRs = allReviewRequestedPR.items.map((item) => {
        let [owner, repo, pullString, pull_number] = item.html_url.split('/').slice(-4);
        return fetchPullRequest(owner, repo, pull_number);
    });

    return Promise.all(individualPRs);
}

function fetchReviewAssignPullRequests(response, { reviewKind }) {
    return fetchAllIndividualPRs()
        .then((allIndividualPRs) => {
        const reviews = [];
        allIndividualPRs.forEach((pr) => {
            let directReviewRequest = pr.requested_reviewers.filter((reviewer) => {
                return reviewer.login === process.env.GH_USERNAME;
            });
            if (reviewKind === 'direct' && directReviewRequest.length > 0) {
                reviews.push(pr);
            } else if (reviewKind === 'team' && directReviewRequest.length === 0) {
                reviews.push(pr);
            }
        });
        response.status(200).json(reviews);
    }).catch((error) => {
            response.status(error.status).json(error);
        });
}

function searchIssuesAndPullRequests(q, response) {
    return octokit.search.issuesAndPullRequests({ q, order: 'desc' })
        .then(({ data }) => {
            response.status(200).json(data.items);
        }).catch((error) => {
            response.status(error.status).json(error);
        });
}

export default function handler(request, response) {
    switch (request.query.itemsToFetchParams) {
        case 'pullrequests':
            return searchIssuesAndPullRequests(PRQUERY, response);
        case 'assigneetome':
            return searchIssuesAndPullRequests(ASSIGNTOMEQUERY, response);
        case 'reviewrequests':
            return fetchReviewAssignPullRequests(response, { reviewKind: 'direct' });
        case 'teamreviewrequests':
            return fetchReviewAssignPullRequests(response, { reviewKind: 'team' });
    }
}
