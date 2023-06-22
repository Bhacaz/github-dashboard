const { Octokit } = require('@octokit/rest');
const encryption = require('../utils/encryption');

let octokit;
let ghUsername;

function initOctokit(request) {
    const accessToken = encryption.decrypt(request.cookies.github_dashboard_token);
    octokit = new Octokit({
        auth: accessToken
    });
}

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

async function initGhUsername() {
    return octokit.users.getAuthenticated()
        .then(({ data }) => {
            ghUsername = data.login;
        })
        .catch((error) => {
            console.log(error);
        });
}

async function fetchAllIndividualPRs() {
    const allReviewRequestedPR = await allReviewRequested();
    await initGhUsername();
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
                return reviewer.login === ghUsername;
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
    initOctokit(request);
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
