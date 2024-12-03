/**
 * Unit tests for src/pre.ts
 */
import * as pre from '../src/pre'
import * as core from '@actions/core'

// Mock the action's pre run function
const runMock = jest.spyOn(pre, 'run')

const cf_zone_id = '${{ secrets.GITHUB_TOKEN }}'
const cf_api_token = '${{ secrets.GITHUB_TOKEN }}'
const cf_account_id = '${{ secrets.GITHUB_TOKEN }}'
const github_api_token = '${{ secrets.GITHUB_TOKEN }}'
const empty_string = ''

// Mock the GitHub Actions core library
// let debugMock: jest.SpiedFunction<typeof core.debug>
let infoMock: jest.SpiedFunction<typeof core.info>
// let errorMock: jest.SpiedFunction<typeof core.error>
let getInputMock: jest.SpiedFunction<typeof core.getInput>
let setFailedMock: jest.SpiedFunction<typeof core.setFailed>
// let setOutputMock: jest.SpiedFunction<typeof core.setOutput>

describe('pre.ts', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    // debugMock = jest.spyOn(core, 'debug').mockImplementation()
    infoMock = jest.spyOn(core, 'info').mockImplementation()
    // errorMock = jest.spyOn(core, 'error').mockImplementation()
    getInputMock = jest.spyOn(core, 'getInput').mockImplementation()
    setFailedMock = jest.spyOn(core, 'setFailed').mockImplementation()
    // setOutputMock = jest.spyOn(core, 'setOutput').mockImplementation()
  })

  afterEach(() => {})

  describe('run', () => {
    it('should print message: Be prepared for bypass cloudflare for github action.', () => {
      getInputMock.mockImplementation(name => {
        switch (name) {
          case 'cf_zone_id':
            return cf_zone_id
          case 'cf_api_token':
            return cf_api_token
          case 'cf_account_id':
            return cf_account_id
          case 'github_api_token':
            return github_api_token
          default:
            return ''
        }
      })

      pre.run()
      expect(runMock).toHaveReturned()

      // Verify that all of the core library functions were called correctly
      expect(getInputMock).toHaveBeenCalled()
      expect(getInputMock).toHaveBeenCalledTimes(4)
      expect(getInputMock).toHaveBeenNthCalledWith(1, 'cf_zone_id')
      expect(getInputMock).toHaveBeenNthCalledWith(2, 'cf_api_token')
      expect(getInputMock).toHaveBeenNthCalledWith(3, 'cf_account_id')
      expect(getInputMock).toHaveBeenNthCalledWith(4, 'github_api_token')

      expect(getInputMock).toHaveReturned()
      expect(getInputMock).toHaveReturnedTimes(4)
      expect(getInputMock).toHaveNthReturnedWith(1, cf_zone_id)
      expect(getInputMock).toHaveNthReturnedWith(2, cf_api_token)
      expect(getInputMock).toHaveNthReturnedWith(3, cf_account_id)
      expect(getInputMock).toHaveNthReturnedWith(4, github_api_token)

      expect(infoMock).toHaveBeenCalled()
      expect(infoMock).toHaveBeenCalledTimes(2)
      expect(infoMock).toHaveBeenNthCalledWith(
        1,
        'Preparing for bypass cloudflare for github action.'
      )
      expect(infoMock).toHaveBeenNthCalledWith(
        2,
        'Be prepared for bypass cloudflare for github action.'
      )
    })

    it('should throw Error with message: cf_zone_id is empty.', () => {
      getInputMock.mockImplementation(name => {
        switch (name) {
          case 'cf_zone_id':
            return empty_string
          case 'cf_api_token':
            return cf_api_token
          case 'cf_account_id':
            return cf_account_id
          case 'github_api_token':
            return github_api_token
          default:
            return ''
        }
      })

      pre.run()
      expect(runMock).toHaveReturned()

      // Verify that all of the core library functions were called correctly
      // Verify that all of the core library functions were called correctly
      expect(getInputMock).toHaveBeenCalled()
      expect(getInputMock).toHaveBeenCalledTimes(4)
      expect(getInputMock).toHaveBeenNthCalledWith(1, 'cf_zone_id')
      expect(getInputMock).toHaveBeenNthCalledWith(2, 'cf_api_token')
      expect(getInputMock).toHaveBeenNthCalledWith(3, 'cf_account_id')
      expect(getInputMock).toHaveBeenNthCalledWith(4, 'github_api_token')

      expect(getInputMock).toHaveReturned()
      expect(getInputMock).toHaveReturnedTimes(4)
      expect(getInputMock).toHaveNthReturnedWith(1, empty_string)
      expect(getInputMock).toHaveNthReturnedWith(2, cf_api_token)
      expect(getInputMock).toHaveNthReturnedWith(3, cf_account_id)
      expect(getInputMock).toHaveNthReturnedWith(4, github_api_token)

      expect(infoMock).toHaveBeenCalled()
      expect(infoMock).toHaveBeenCalledTimes(1)
      expect(infoMock).toHaveBeenNthCalledWith(
        1,
        'Preparing for bypass cloudflare for github action.'
      )

      expect(setFailedMock).toHaveBeenNthCalledWith(1, 'cf_zone_id is empty')
    })

    it('should throw Error with message: cf_api_token is empty.', () => {
      getInputMock.mockImplementation(name => {
        switch (name) {
          case 'cf_zone_id':
            return cf_zone_id
          case 'cf_api_token':
            return empty_string
          case 'cf_account_id':
            return cf_account_id
          case 'github_api_token':
            return github_api_token
          default:
            return ''
        }
      })

      pre.run()
      expect(runMock).toHaveReturned()

      // Verify that all of the core library functions were called correctly
      // Verify that all of the core library functions were called correctly
      expect(getInputMock).toHaveBeenCalled()
      expect(getInputMock).toHaveBeenCalledTimes(4)
      expect(getInputMock).toHaveBeenNthCalledWith(1, 'cf_zone_id')
      expect(getInputMock).toHaveBeenNthCalledWith(2, 'cf_api_token')
      expect(getInputMock).toHaveBeenNthCalledWith(3, 'cf_account_id')
      expect(getInputMock).toHaveBeenNthCalledWith(4, 'github_api_token')

      expect(getInputMock).toHaveReturned()
      expect(getInputMock).toHaveReturnedTimes(4)
      expect(getInputMock).toHaveNthReturnedWith(1, cf_zone_id)
      expect(getInputMock).toHaveNthReturnedWith(2, empty_string)
      expect(getInputMock).toHaveNthReturnedWith(3, cf_account_id)
      expect(getInputMock).toHaveNthReturnedWith(4, github_api_token)

      expect(infoMock).toHaveBeenCalled()
      expect(infoMock).toHaveBeenCalledTimes(1)
      expect(infoMock).toHaveBeenNthCalledWith(
        1,
        'Preparing for bypass cloudflare for github action.'
      )

      expect(setFailedMock).toHaveBeenNthCalledWith(1, 'cf_api_token is empty')
    })

    it('should throw Error with message: cf_account_id is empty.', () => {
      getInputMock.mockImplementation(name => {
        switch (name) {
          case 'cf_zone_id':
            return cf_zone_id
          case 'cf_api_token':
            return cf_api_token
          case 'cf_account_id':
            return empty_string
          case 'github_api_token':
            return github_api_token
          default:
            return ''
        }
      })

      pre.run()
      expect(runMock).toHaveReturned()

      // Verify that all of the core library functions were called correctly
      // Verify that all of the core library functions were called correctly
      expect(getInputMock).toHaveBeenCalled()
      expect(getInputMock).toHaveBeenCalledTimes(4)
      expect(getInputMock).toHaveBeenNthCalledWith(1, 'cf_zone_id')
      expect(getInputMock).toHaveBeenNthCalledWith(2, 'cf_api_token')
      expect(getInputMock).toHaveBeenNthCalledWith(3, 'cf_account_id')
      expect(getInputMock).toHaveBeenNthCalledWith(4, 'github_api_token')

      expect(getInputMock).toHaveReturned()
      expect(getInputMock).toHaveReturnedTimes(4)
      expect(getInputMock).toHaveNthReturnedWith(1, cf_zone_id)
      expect(getInputMock).toHaveNthReturnedWith(2, cf_api_token)
      expect(getInputMock).toHaveNthReturnedWith(3, empty_string)
      expect(getInputMock).toHaveNthReturnedWith(4, github_api_token)

      expect(infoMock).toHaveBeenCalled()
      expect(infoMock).toHaveBeenCalledTimes(1)
      expect(infoMock).toHaveBeenNthCalledWith(
        1,
        'Preparing for bypass cloudflare for github action.'
      )

      expect(setFailedMock).toHaveBeenNthCalledWith(1, 'cf_account_id is empty')
    })

    it('should throw Error with message: github_api_token is empty.', () => {
      getInputMock.mockImplementation(name => {
        switch (name) {
          case 'cf_zone_id':
            return cf_zone_id
          case 'cf_api_token':
            return cf_api_token
          case 'cf_account_id':
            return cf_account_id
          case 'github_api_token':
            return empty_string
          default:
            return ''
        }
      })

      pre.run()
      expect(runMock).toHaveReturned()

      // Verify that all of the core library functions were called correctly
      // Verify that all of the core library functions were called correctly
      expect(getInputMock).toHaveBeenCalled()
      expect(getInputMock).toHaveBeenCalledTimes(4)
      expect(getInputMock).toHaveBeenNthCalledWith(1, 'cf_zone_id')
      expect(getInputMock).toHaveBeenNthCalledWith(2, 'cf_api_token')
      expect(getInputMock).toHaveBeenNthCalledWith(3, 'cf_account_id')
      expect(getInputMock).toHaveBeenNthCalledWith(4, 'github_api_token')

      expect(getInputMock).toHaveReturned()
      expect(getInputMock).toHaveReturnedTimes(4)
      expect(getInputMock).toHaveNthReturnedWith(1, cf_zone_id)
      expect(getInputMock).toHaveNthReturnedWith(2, cf_api_token)
      expect(getInputMock).toHaveNthReturnedWith(3, cf_account_id)
      expect(getInputMock).toHaveNthReturnedWith(4, empty_string)

      expect(infoMock).toHaveBeenCalled()
      expect(infoMock).toHaveBeenCalledTimes(1)
      expect(infoMock).toHaveBeenNthCalledWith(
        1,
        'Preparing for bypass cloudflare for github action.'
      )

      expect(setFailedMock).toHaveBeenNthCalledWith(
        1,
        'github_api_token is empty'
      )
    })
  })
})
