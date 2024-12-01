/**
 * Unit tests for src/ipip.ts
 */

import { IPIPResponseMeta, public_ip } from '../src/ipip'

describe('ipip.ts', () => {
  describe('public_ip', () => {
    it('should return an IP if accessible.', async () => {
      const ipmeta: IPIPResponseMeta = {
        ret: 'ok',
        data: {
          ip: '128.169.188.141',
          location: ['中国', '江西', '宜春', '', '移动']
        }
      }

      const ip = '128.169.188.141'

      jest.spyOn(global, 'fetch').mockResolvedValue(
        Promise.resolve({
          ok: true,
          status: 200,
          json: async () => Promise.resolve(ipmeta)
        }) as Promise<Response>
      )

      expect(await public_ip()).toBe(ip)
    })

    it('should throw Error with status 403', async () => {
      const ipmeta: IPIPResponseMeta = {
        ret: 'ok',
        data: {
          ip: '128.169.188.141',
          location: ['中国', '江西', '宜春', '', '移动']
        }
      }

      // const ip = '128.169.188.141'

      jest.spyOn(global, 'fetch').mockResolvedValue(
        Promise.resolve({
          ok: false,
          status: 403,
          json: async () => Promise.resolve(ipmeta)
        }) as Promise<Response>
      )

      await expect(public_ip()).rejects.toThrow('Response status: 403')
    })

    it('should throw Error with message: Failed to Get Public IP.', async () => {
      const ipmeta: IPIPResponseMeta = {
        ret: 'false',
        data: {
          ip: '128.169.188.141',
          location: ['中国', '江西', '宜春', '', '移动']
        }
      }

      // const ip = '128.169.188.141'

      jest.spyOn(global, 'fetch').mockResolvedValue(
        Promise.resolve({
          ok: true,
          status: 200,
          json: async () => Promise.resolve(ipmeta)
        }) as Promise<Response>
      )

      await expect(public_ip()).rejects.toThrow('Failed to Get Public IP.')
    })

    it('should throw Error with message: Public IP Not Found.', async () => {
      const ipmeta: IPIPResponseMeta = {
        ret: 'ok',
        data: {
          ip: '',
          location: ['中国', '江西', '宜春', '', '移动']
        }
      }

      // const ip = '128.169.188.141'

      jest.spyOn(global, 'fetch').mockResolvedValue(
        Promise.resolve({
          ok: true,
          status: 200,
          json: async () => Promise.resolve(ipmeta)
        }) as Promise<Response>
      )

      await expect(public_ip()).rejects.toThrow('Public IP Not Found.')
    })
  })
})
