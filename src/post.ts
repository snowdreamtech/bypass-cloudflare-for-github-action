import * as core from '@actions/core'
import { clean as cleanSingle } from './single'
import { clean as cleanList } from './list'
// import { public_ip } from './ipinfo'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  // Executing bypass cloudflare for github action
  core.info('Executing bypass cloudflare for github action')

  // https://github.com/actions/toolkit/issues/723#issuecomment-784759206
  const trueValue = [
    'true',
    'True',
    'TRUE',
    'yes',
    'Yes',
    'YES',
    'y',
    'Y',
    'on',
    'On',
    'ON'
  ]
  const clean: string = core.getInput('clean')

  if (trueValue.includes(clean)) {
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
          await cleanSingle()
          break
        }
        case 'list': {
          await cleanList()
          break
        }
        case 'github': {
          // core.info('Get the IPV4 and IPV6 List for the github actions runners.')
          // const ips = await github_meta()
          await cleanList()
          break
        }
        default: {
          await cleanList()
          break
        }
      }
    }
  }

  core.info('Done for bypass cloudflare for github action')
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
run()
