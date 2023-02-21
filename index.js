const core = require('@actions/core');
const github = require('@actions/github');

const run = async () => {
    const currentBranch = core.getInput('current_branch');
    console.log('Current Branch', currentBranch);
    console.log('Repo', github.context.repo);
    const githubToken = core.getInput('github_token');
    const octokit = github.getOctokit(githubToken);
    const allBranches = await octokit.rest.repos.listBranches({
        owner: false,
        repo: github.context.repo,
    });
    console.log('allBranches', allBranches);
};

run().catch((e) => {
    console.error(e);
    core.setFailed(e.message);
}).finally(() => {
    process.exit(0);
});
