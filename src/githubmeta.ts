import * as core from '@actions/core'

// Define an interface for GitHubMeta
export interface GitHubMeta {
  actions: []
  actions_macos: []
}

/**
 * Get the IPV4 and IPV6 List for the github actions runners.
 *
 * @returns {Promise<Array<string>>} The IPV4 and IPV6 List for the github actions runners.
 */
export async function github_meta(): Promise<Array<string>> {
  return new Promise(async (resolve, reject) => {
    const github_api_token: string = core.getInput('github_api_token')

    if (!github_api_token) {
      reject(new Error('github_api_token is empty'))
    }

    const url = 'https://api.github.com/meta'

    const response = await fetch(url, {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: 'Bearer ' + github_api_token,
        'X-GitHub-Api-Version': '2022-11-28 '
      }
    })

    if (!response.ok) {
      reject(new Error(`Response status: ${response.status}`));
    }

    const githubmeta = await response.json() as GitHubMeta

    githubmeta.actions.push.apply(githubmeta.actions,githubmeta.actions_macos)

    resolve(githubmeta.actions)
  })
}
    