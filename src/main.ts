import * as core from '@actions/core'
import { run as runSingle } from './single'
import { run as runList } from './list'
import { public_ip } from './ipinfo'
import { github_meta } from './githubmeta'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  // Executing bypass cloudflare for github action
  core.info('Executing bypass cloudflare for github action')

  // get the public ip for the github actions runner
  core.info('Get the public ip for the github actions runner')
  const ip = await public_ip()

  const modestring: string = core.getInput('mode')

  // Mode
  core.info(
    'The mode for bypass cloudflare for github action is: ' + modestring
  )
  const modelist: string[] = modestring.split(',')

  for (let i = 0; i < modelist.length; i++) {
    const mode = modelist[i]

    switch (mode) {
      case 'single': {
        await runSingle(ip)
        break
      }
      case 'list': {
        await runList(ip)
        break
      }
      case 'github': {
        core.info('Get the IPV4 and IPV6 List for the github actions runners.')
        const ips = await github_meta()
        await runList(ips)
        break
      }
      default: {
        await runList(ip)
        break
      }
    }
  }

  core.info('Done for bypass cloudflare for github action')
}
