/**
 * Unit tests for the action's main functionality, src/main.ts
 *
 * These should be run as if the action was called from a workflow.
 * Specifically, the inputs listed in `action.yml` should be set as environment
 * variables following the pattern `INPUT_<INPUT_NAME>`.
 */

import * as core from '@actions/core'
import * as post from '../src/post'
import * as single from '../src/single'
import * as list from '../src/list'
import * as ipinfo from '../src/ipinfo'
import * as githubmeta from '../src/githubmeta'

// Mock the action's main function
const runMock = jest.spyOn(post, 'run')
const cleanSingleMock = jest.spyOn(single, 'clean')
const cleanListMock = jest.spyOn(list, 'clean')
const publicipMock = jest.spyOn(ipinfo, 'public_ip')
const githubmetaMock = jest.spyOn(githubmeta, 'github_meta')

const mode_single = 'single'
const mode_list = 'list'
const mode_github = 'github'

// Mock the GitHub Actions core library
// let debugMock: jest.SpiedFunction<typeof core.debug>
let infoMock: jest.SpiedFunction<typeof core.info>
// let errorMock: jest.SpiedFunction<typeof core.error>
let getInputMock: jest.SpiedFunction<typeof core.getInput>
// let setFailedMock: jest.SpiedFunction<typeof core.setFailed>
// let setOutputMock: jest.SpiedFunction<typeof core.setOutput>

describe('main.ts', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    // debugMock = jest.spyOn(core, 'debug').mockImplementation()
    infoMock = jest.spyOn(core, 'info').mockImplementation()
    // errorMock = jest.spyOn(core, 'error').mockImplementation()
    getInputMock = jest.spyOn(core, 'getInput').mockImplementation()
    // setFailedMock = jest.spyOn(core, 'setFailed').mockImplementation()
    // setOutputMock = jest.spyOn(core, 'setOutput').mockImplementation()
  })

  afterEach(() => {})

  describe('run', () => {
    it('should print message: Executing bypass cloudflare for github action', async () => {
      publicipMock.mockResolvedValue('1.1.1.1')
      githubmetaMock.mockResolvedValue(['1.1.1.1'])

      getInputMock.mockImplementation(name => {
        switch (name) {
          case 'mode':
            return mode_list
          case 'clean':
            return 'true'
          default:
            return ''
        }
      })

      await post.run()
      expect(runMock).toHaveReturned()

      // Verify that all of the core library functions were called correctly
      expect(getInputMock).toHaveBeenCalled()
      expect(getInputMock).toHaveBeenNthCalledWith(1, 'clean')
      expect(getInputMock).toHaveBeenNthCalledWith(2, 'mode')

      expect(getInputMock).toHaveReturned()
      expect(getInputMock).toHaveNthReturnedWith(1, 'true')
      expect(getInputMock).toHaveNthReturnedWith(2, mode_list)

      expect(infoMock).toHaveBeenCalled()
      expect(infoMock).toHaveBeenCalledTimes(3)
      expect(infoMock).toHaveBeenNthCalledWith(
        1,
        'Executing bypass cloudflare for github action'
      )
      expect(infoMock).toHaveBeenNthCalledWith(
        2,
        'The mode for bypass cloudflare for github action is: ' + mode_list
      )
      expect(infoMock).toHaveBeenLastCalledWith(
        'Done for bypass cloudflare for github action'
      )
    })

    it('should runSingle when mode is: single', async () => {
      getInputMock.mockImplementation(name => {
        switch (name) {
          case 'mode':
            return mode_single
          case 'clean':
            return 'true'
          default:
            return ''
        }
      })

      await post.run()
      expect(runMock).toHaveReturned()

      // Verify that all of the core library functions were called correctly
      expect(getInputMock).toHaveBeenCalled()
      expect(getInputMock).toHaveBeenNthCalledWith(1, 'clean')
      expect(getInputMock).toHaveBeenNthCalledWith(2, 'mode')

      expect(getInputMock).toHaveReturned()
      expect(getInputMock).toHaveNthReturnedWith(1, 'true')
      expect(getInputMock).toHaveNthReturnedWith(2, mode_single)

      expect(infoMock).toHaveBeenCalled()
      expect(infoMock).toHaveBeenCalledTimes(3)
      expect(infoMock).toHaveBeenNthCalledWith(
        1,
        'Executing bypass cloudflare for github action'
      )
      expect(infoMock).toHaveBeenNthCalledWith(
        2,
        'The mode for bypass cloudflare for github action is: ' + mode_single
      )
      expect(infoMock).toHaveBeenLastCalledWith(
        'Done for bypass cloudflare for github action'
      )

      expect(cleanSingleMock).toHaveBeenCalled()
      expect(cleanListMock).not.toHaveBeenCalled()
    })

    it('should runList when mode is: list', async () => {
      getInputMock.mockImplementation(name => {
        switch (name) {
          case 'mode':
            return mode_list
          case 'clean':
            return 'true'
          default:
            return ''
        }
      })

      await post.run()
      expect(runMock).toHaveReturned()

      // Verify that all of the core library functions were called correctly
      expect(getInputMock).toHaveBeenCalled()
      expect(getInputMock).toHaveBeenNthCalledWith(1, 'clean')
      expect(getInputMock).toHaveBeenNthCalledWith(2, 'mode')

      expect(getInputMock).toHaveReturned()
      expect(getInputMock).toHaveNthReturnedWith(1, 'true')
      expect(getInputMock).toHaveNthReturnedWith(2, mode_list)

      expect(infoMock).toHaveBeenCalled()
      expect(infoMock).toHaveBeenCalledTimes(3)
      expect(infoMock).toHaveBeenNthCalledWith(
        1,
        'Executing bypass cloudflare for github action'
      )
      expect(infoMock).toHaveBeenNthCalledWith(
        2,
        'The mode for bypass cloudflare for github action is: ' + mode_list
      )
      expect(infoMock).toHaveBeenLastCalledWith(
        'Done for bypass cloudflare for github action'
      )

      expect(cleanSingleMock).not.toHaveBeenCalled()
      expect(cleanListMock).toHaveBeenCalled()
    })

    it('should runGithub when mode is: github', async () => {
      getInputMock.mockImplementation(name => {
        switch (name) {
          case 'mode':
            return mode_github
          case 'clean':
            return 'true'
          default:
            return ''
        }
      })

      await post.run()
      expect(runMock).toHaveReturned()

      // Verify that all of the core library functions were called correctly
      expect(getInputMock).toHaveBeenCalled()
      expect(getInputMock).toHaveBeenNthCalledWith(1, 'clean')
      expect(getInputMock).toHaveBeenNthCalledWith(2, 'mode')

      expect(getInputMock).toHaveReturned()
      expect(getInputMock).toHaveNthReturnedWith(1, 'true')
      expect(getInputMock).toHaveNthReturnedWith(2, mode_github)

      expect(infoMock).toHaveBeenCalled()
      expect(infoMock).toHaveBeenCalledTimes(3)
      expect(infoMock).toHaveBeenNthCalledWith(
        1,
        'Executing bypass cloudflare for github action'
      )
      expect(infoMock).toHaveBeenNthCalledWith(
        2,
        'The mode for bypass cloudflare for github action is: ' + mode_github
      )
      expect(infoMock).toHaveBeenLastCalledWith(
        'Done for bypass cloudflare for github action'
      )

      expect(cleanSingleMock).not.toHaveBeenCalled()
      expect(cleanListMock).toHaveBeenCalled()
    })

    it('should runList when mode is: others', async () => {
      getInputMock.mockImplementation(name => {
        switch (name) {
          case 'mode':
            return ''
          case 'clean':
            return 'true'
          default:
            return ''
        }
      })

      await post.run()
      expect(runMock).toHaveReturned()

      // Verify that all of the core library functions were called correctly
      expect(getInputMock).toHaveBeenCalled()
      expect(getInputMock).toHaveBeenNthCalledWith(1, 'clean')
      expect(getInputMock).toHaveBeenNthCalledWith(2, 'mode')

      expect(getInputMock).toHaveReturned()
      expect(getInputMock).toHaveNthReturnedWith(1, 'true')
      expect(getInputMock).toHaveNthReturnedWith(2, '')

      expect(infoMock).toHaveBeenCalled()
      expect(infoMock).toHaveBeenCalledTimes(3)
      expect(infoMock).toHaveBeenNthCalledWith(
        1,
        'Executing bypass cloudflare for github action'
      )
      expect(infoMock).toHaveBeenNthCalledWith(
        2,
        'The mode for bypass cloudflare for github action is: ' + ''
      )
      expect(infoMock).toHaveBeenLastCalledWith(
        'Done for bypass cloudflare for github action'
      )

      expect(cleanSingleMock).not.toHaveBeenCalled()
      expect(cleanListMock).toHaveBeenCalled()
    })
  })
})
