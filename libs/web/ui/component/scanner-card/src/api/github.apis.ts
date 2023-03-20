import { Octokit } from '@octokit/rest'

const octokit = new Octokit({
  auth: import.meta.env.VITE_APP_GITHUB_PERSONAL_ACCESS_TOKEN,
})

export function getRepoInformation(repoUrl: string) {
  const [owner, repo] = repoUrl.split('https://github.com/')[1].split('/')

  return octokit.rest.repos.get({
    owner,
    repo,
  })
}
