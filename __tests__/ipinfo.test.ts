/**
 * Unit tests for src/ipinfo.ts
 */

import { IPMeta, public_ip } from '../src/ipinfo'

describe('ipinfo.ts', () => {
  describe('public_ip', () => {
    it('should return an IP if accessible.', async () => {
      const ipmeta: IPMeta = {
        ip: '151.138.53.15',
        city: 'Ashburn',
        region: 'Virginia',
        country: 'US',
        loc: '39.0437,-77.4875',
        org: 'AS31898 Oracle Corporation',
        postal: '20147',
        timezone: 'America/New_York',
        readme: 'https://ipinfo.io/missingauth'
      }

      const ip = '151.138.53.15'

      jest.spyOn(global, 'fetch').mockResolvedValueOnce(
        Promise.resolve({
          ok: true,
          status: 200,
          json: async () => Promise.resolve(ipmeta)
        }) as Promise<Response>
      )

      expect(await public_ip()).toBe(ip)
    })

    it('should throw Error with status 403', async () => {
      const ipmeta: IPMeta = {
        ip: '151.138.53.15',
        city: 'Ashburn',
        region: 'Virginia',
        country: 'US',
        loc: '39.0437,-77.4875',
        org: 'AS31898 Oracle Corporation',
        postal: '20147',
        timezone: 'America/New_York',
        readme: 'https://ipinfo.io/missingauth'
      }

      // const ip = '151.138.53.15'

      jest.spyOn(global, 'fetch').mockResolvedValueOnce(
        Promise.resolve({
          ok: false,
          status: 403,
          json: async () => Promise.resolve(ipmeta)
        }) as Promise<Response>
      )

      await expect(public_ip()).rejects.toThrow('Response status: 403')
    })

    it('should throw Error with message: Public IP Not Found.', async () => {
      const ipmeta: IPMeta = {
        ip: '',
        city: 'Ashburn',
        region: 'Virginia',
        country: 'US',
        loc: '39.0437,-77.4875',
        org: 'AS31898 Oracle Corporation',
        postal: '20147',
        timezone: 'America/New_York',
        readme: 'https://ipinfo.io/missingauth'
      }

      // const ip = '151.138.53.15'

      jest.spyOn(global, 'fetch').mockResolvedValueOnce(
        Promise.resolve({
          ok: true,
          status: 200,
          json: async () => Promise.resolve(ipmeta)
        }) as Promise<Response>
      )

      await expect(public_ip()).rejects.toThrow('Public IP Not Found.')
    })
  })

  it('should throw TypeError: fetch failed', async () => {
    jest
      .spyOn(global, 'fetch')
      .mockRejectedValue(new Error('TypeError: fetch failed'))

    await expect(public_ip()).rejects.toThrow('TypeError: fetch failed')
  })
})
