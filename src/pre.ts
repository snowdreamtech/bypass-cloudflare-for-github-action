import * as core from '@actions/core'

/**
 * The pre function for the action.
 * @returns void Resolves when the action is complete.
 */
export function run(): void {
  try {
    // Preparing for bypass cloudflare for github action
    core.info('Preparing for bypass cloudflare for github action.')

    const cf_zone_id: string = core.getInput('cf_zone_id')
    const cf_api_token: string = core.getInput('cf_api_token')
    const cf_account_id: string = core.getInput('cf_account_id')
    const github_api_token: string = core.getInput('github_api_token')

    if (!cf_zone_id) {
      throw new Error('cf_zone_id is empty')
    }

    if (!cf_api_token) {
      throw new Error('cf_api_token is empty')
    }

    if (!cf_account_id) {
      throw new Error('cf_account_id is empty')
    }

    if (!github_api_token) {
      throw new Error('github_api_token is empty')
    }

    // Prepared
    core.info('Be prepared for bypass cloudflare for github action.')
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
run()
