const core = require('@actions/core');
const github = require('@actions/github');

const getReleaseDate = (branchName) => {
    const match = branchName.match(/\d{4}\.\d{2}\.\d{2}/);

    return match ? match[0] : '';
}

const compareBranches = (branch1, branch2) => {
    if (branch1 === 'master') {
        return -1;
    }
    if (branch2 === 'master') {
        return 1;
    }
    if (branch1 === 'develop') {
        return 1;
    }
    if (branch2 === 'develop') {
        return -1;
    }

    const branch1Date = getReleaseDate(branch1);
    const branch2Date = getReleaseDate(branch2);

    if (branch2Date === branch1Date) {
        return 0;
    }

    return (branch2Date > branch1Date) ? -1 : 1;
}
const run = async () => {
    const currentBranch = core.getInput('current_branch');
    console.log('Current branch:', currentBranch);
    const githubToken = core.getInput('github_token');
    const octokit = github.getOctokit(githubToken);
    const allBranches = (await octokit.rest.repos.listBranches(github.context.repo)).data
        .map((branch) => branch.name)
        .filter(name => name ? name.match(/(^master$|^develop$|^release_|^release\/|^draft_release)/) : false)
        .sort(compareBranches);
    console.log('allBranches', allBranches);
    const currentIndex = allBranches.findIndex((name) => name === currentBranch);
    const targetBranch = allBranches[currentIndex + 1];
    console.log('Target branch:', targetBranch);
    if (targetBranch) {
        core.setOutput('target_branch', targetBranch);
    }
};

run().catch((e) => {
    console.error(e);
    core.setFailed(e.message);
}).finally(() => {
    process.exit(0);
});
