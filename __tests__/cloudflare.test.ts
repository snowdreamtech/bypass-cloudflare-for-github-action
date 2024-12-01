/**
 * Unit tests for src/cloudflare.ts
 */

import {
  ResponseMeta,
  get_custom_zone_rulesets_id,
  get_custom_zone_ruleset,
  create_custom_zone_rule,
  update_custom_zone_rule,
  delete_custom_zone_rule,
  get_lists,
  get_list,
  create_list,
  update_list,
  delete_list,
  get_list_items,
  create_list_items,
  update_all_list_items,
  delete_list_items
} from '../src/cloudflare'

const responseError: ResponseMeta = {
  success: false,
  result: {},
  errors: [
    {
      code: 9106,
      message: 'Missing X-Auth-Key, X-Auth-Email or Authorization headers'
    }
  ]
}

const responseMessage: ResponseMeta = {
  success: false,
  result: {},
  messages: [
    {
      code: 9106,
      message: 'Missing X-Auth-Key, X-Auth-Email or Authorization headers'
    }
  ]
}

describe('cloudflare.ts', () => {
  describe('get_custom_zone_rulesets_id', () => {
    it('should return zone rulesets id if possible.', async () => {
      const cf_zone_id = '0890d49c7ecd89e4abef674d77b2e766'
      const cf_api_token = 'WKZDG_1owHLAWSasxxHyObz1zWH2aBdac9s0X4955'

      const data = {
        result: [
          {
            description:
              'Created by the Cloudflare security team, this ruleset is designed to provide protection for free zones',
            id: '77454fe2d30c4220b5701f6fdfb893ba',
            kind: 'managed',
            last_updated: '2024-08-01T17:37:10.825759Z',
            name: 'Cloudflare Managed Free Ruleset',
            phase: 'http_request_firewall_managed',
            source: 'firewall_managed',
            version: '57'
          },
          {
            description:
              'Created by the Cloudflare security team, this ruleset provides normalization on the URL path',
            id: '70339d97bdb34195bbf054b1ebe81f76',
            kind: 'managed',
            last_updated: '2024-08-01T17:37:11.538019Z',
            name: 'Cloudflare Normalization Ruleset',
            phase: 'http_request_sanitize',
            version: '6'
          },
          {
            description: '',
            id: '25090ce00659453389ae6b2e075cbd77',
            kind: 'zone',
            last_updated: '2024-08-28T15:01:18.34891Z',
            name: 'zone',
            phase: 'http_request_sbfm',
            source: 'firewall_managed',
            version: '1'
          },
          {
            description: '',
            id: '20fa246ce0bf4c409400673d60783f6e',
            kind: 'zone',
            last_updated: '2024-10-18T22:55:37.870024Z',
            name: 'default',
            phase: 'http_request_firewall_custom',
            source: 'firewall_custom',
            version: '17'
          },
          {
            description:
              'Rules maintained by bots team that can run for all plans',
            id: '3e677e63d4e9479382576f3fa66279e7',
            kind: 'managed',
            last_updated: '2024-11-13T00:24:24.512812Z',
            name: 'Cloudflare Bot Management rules for all plans',
            phase: 'http_request_sbfm',
            source: 'firewall_managed',
            version: '7'
          },
          {
            description:
              'Automatic mitigation of HTTP-based DDoS attacks. Cloudflare routinely adds signatures to address new attack vectors. Additional configuration allows you to customize the sensitivity of each rule and the performed mitigation action.',
            id: '4d21379b4f9f4bb088e0729962c8b3cf',
            kind: 'managed',
            last_updated: '2024-11-22T23:55:35.02395Z',
            name: 'DDoS L7 ruleset',
            phase: 'ddos_l7',
            version: '2574'
          }
        ],
        success: true,
        errors: [],
        messages: []
      }

      const custom_zone_rulesets_id = '20fa246ce0bf4c409400673d60783f6e'

      jest.spyOn(global, 'fetch').mockResolvedValue(
        Promise.resolve({
          ok: true,
          status: 200,
          json: async () => Promise.resolve(data)
        }) as Promise<Response>
      )

      const custom_zone_rulesets_id_result = await get_custom_zone_rulesets_id(
        cf_zone_id,
        cf_api_token
      )

      expect(custom_zone_rulesets_id_result).toEqual(custom_zone_rulesets_id)
    })

    it('should throw Error with status 403', async () => {
      const cf_zone_id = '0890d49c7ecd89e4abef674d77b2e766'
      const cf_api_token = 'WKZDG_1owHLAWSasxxHyObz1zWH2aBdac9s0X4955'

      const data = {
        result: [
          {
            description:
              'Created by the Cloudflare security team, this ruleset is designed to provide protection for free zones',
            id: '77454fe2d30c4220b5701f6fdfb893ba',
            kind: 'managed',
            last_updated: '2024-08-01T17:37:10.825759Z',
            name: 'Cloudflare Managed Free Ruleset',
            phase: 'http_request_firewall_managed',
            source: 'firewall_managed',
            version: '57'
          },
          {
            description:
              'Created by the Cloudflare security team, this ruleset provides normalization on the URL path',
            id: '70339d97bdb34195bbf054b1ebe81f76',
            kind: 'managed',
            last_updated: '2024-08-01T17:37:11.538019Z',
            name: 'Cloudflare Normalization Ruleset',
            phase: 'http_request_sanitize',
            version: '6'
          },
          {
            description: '',
            id: '25090ce00659453389ae6b2e075cbd77',
            kind: 'zone',
            last_updated: '2024-08-28T15:01:18.34891Z',
            name: 'zone',
            phase: 'http_request_sbfm',
            source: 'firewall_managed',
            version: '1'
          },
          {
            description: '',
            id: '20fa246ce0bf4c409400673d60783f6e',
            kind: 'zone',
            last_updated: '2024-10-18T22:55:37.870024Z',
            name: 'default',
            phase: 'http_request_firewall_custom',
            source: 'firewall_custom',
            version: '17'
          },
          {
            description:
              'Rules maintained by bots team that can run for all plans',
            id: '3e677e63d4e9479382576f3fa66279e7',
            kind: 'managed',
            last_updated: '2024-11-13T00:24:24.512812Z',
            name: 'Cloudflare Bot Management rules for all plans',
            phase: 'http_request_sbfm',
            source: 'firewall_managed',
            version: '7'
          },
          {
            description:
              'Automatic mitigation of HTTP-based DDoS attacks. Cloudflare routinely adds signatures to address new attack vectors. Additional configuration allows you to customize the sensitivity of each rule and the performed mitigation action.',
            id: '4d21379b4f9f4bb088e0729962c8b3cf',
            kind: 'managed',
            last_updated: '2024-11-22T23:55:35.02395Z',
            name: 'DDoS L7 ruleset',
            phase: 'ddos_l7',
            version: '2574'
          }
        ],
        success: true,
        errors: [],
        messages: []
      }

      jest.spyOn(global, 'fetch').mockResolvedValue(
        Promise.resolve({
          ok: false,
          status: 403,
          json: async () => Promise.resolve(data)
        }) as Promise<Response>
      )

      await expect(
        get_custom_zone_rulesets_id(cf_zone_id, cf_api_token)
      ).rejects.toThrow('Response status: 403')
    })

    it('should throw Error with responseError', async () => {
      const cf_zone_id = '0890d49c7ecd89e4abef674d77b2e766'
      const cf_api_token = 'WKZDG_1owHLAWSasxxHyObz1zWH2aBdac9s0X4955'

      jest.spyOn(global, 'fetch').mockResolvedValue(
        Promise.resolve({
          ok: true,
          status: 200,
          json: async () => Promise.resolve(responseError)
        }) as Promise<Response>
      )

      await expect(
        get_custom_zone_rulesets_id(cf_zone_id, cf_api_token)
      ).rejects.toThrow(JSON.stringify(responseError.errors, null, 2))
    })

    it('should throw Error with responseMessage', async () => {
      const cf_zone_id = '0890d49c7ecd89e4abef674d77b2e766'
      const cf_api_token = 'WKZDG_1owHLAWSasxxHyObz1zWH2aBdac9s0X4955'

      jest.spyOn(global, 'fetch').mockResolvedValue(
        Promise.resolve({
          ok: true,
          status: 200,
          json: async () => Promise.resolve(responseMessage)
        }) as Promise<Response>
      )

      await expect(
        get_custom_zone_rulesets_id(cf_zone_id, cf_api_token)
      ).rejects.toThrow(JSON.stringify(responseMessage.messages, null, 2))
    })

    it('should throw Error with ZoneRulesets Not found.', async () => {
      const cf_zone_id = '0890d49c7ecd89e4abef674d77b2e766'
      const cf_api_token = 'WKZDG_1owHLAWSasxxHyObz1zWH2aBdac9s0X4955'

      const data = {
        result: [],
        success: true,
        errors: [],
        messages: []
      }

      jest.spyOn(global, 'fetch').mockResolvedValue(
        Promise.resolve({
          ok: true,
          status: 200,
          json: async () => Promise.resolve(data)
        }) as Promise<Response>
      )

      await expect(
        get_custom_zone_rulesets_id(cf_zone_id, cf_api_token)
      ).rejects.toThrow('ZoneRulesets Not found.')
    })

    it('should throw Error with zone_custom_rulesets_id Not found.', async () => {
      const cf_zone_id = '0890d49c7ecd89e4abef674d77b2e766'
      const cf_api_token = 'WKZDG_1owHLAWSasxxHyObz1zWH2aBdac9s0X4955'

      const data = {
        result: [
          {
            description:
              'Created by the Cloudflare security team, this ruleset is designed to provide protection for free zones',
            id: '77454fe2d30c4220b5701f6fdfb893ba',
            kind: 'managed',
            last_updated: '2024-08-01T17:37:10.825759Z',
            name: 'Cloudflare Managed Free Ruleset',
            phase: 'http_request_firewall_managed',
            source: 'firewall_managed',
            version: '57'
          },
          {
            description:
              'Created by the Cloudflare security team, this ruleset provides normalization on the URL path',
            id: '70339d97bdb34195bbf054b1ebe81f76',
            kind: 'managed',
            last_updated: '2024-08-01T17:37:11.538019Z',
            name: 'Cloudflare Normalization Ruleset',
            phase: 'http_request_sanitize',
            version: '6'
          },
          {
            description: '',
            id: '25090ce00659453389ae6b2e075cbd77',
            kind: 'zone',
            last_updated: '2024-08-28T15:01:18.34891Z',
            name: 'zone',
            phase: 'http_request_sbfm',
            source: 'firewall_managed',
            version: '1'
          },
          {
            description:
              'Rules maintained by bots team that can run for all plans',
            id: '3e677e63d4e9479382576f3fa66279e7',
            kind: 'managed',
            last_updated: '2024-11-13T00:24:24.512812Z',
            name: 'Cloudflare Bot Management rules for all plans',
            phase: 'http_request_sbfm',
            source: 'firewall_managed',
            version: '7'
          },
          {
            description:
              'Automatic mitigation of HTTP-based DDoS attacks. Cloudflare routinely adds signatures to address new attack vectors. Additional configuration allows you to customize the sensitivity of each rule and the performed mitigation action.',
            id: '4d21379b4f9f4bb088e0729962c8b3cf',
            kind: 'managed',
            last_updated: '2024-11-22T23:55:35.02395Z',
            name: 'DDoS L7 ruleset',
            phase: 'ddos_l7',
            version: '2574'
          }
        ],
        success: true,
        errors: [],
        messages: []
      }

      jest.spyOn(global, 'fetch').mockResolvedValue(
        Promise.resolve({
          ok: true,
          status: 200,
          json: async () => Promise.resolve(data)
        }) as Promise<Response>
      )

      await expect(
        get_custom_zone_rulesets_id(cf_zone_id, cf_api_token)
      ).rejects.toThrow('zone_custom_rulesets_id Not found.')
    })
  })

  describe('get_custom_zone_ruleset', () => {
    it('should return custom zone ruleset if possible.', async () => {
      const cf_zone_id = '0890d49c7ecd89e4abef674d77b2e766'
      const cf_api_token = 'WKZDG_1owHLAWSasxxHyObz1zWH2aBdac9s0X4955'
      const ruleset_id = '0890d49c7ecd89e4abef674d77b2e766'

      const data = {
        result: {
          description: '',
          id: '20fa246ce0bf4c409400673d60783f6e',
          kind: 'zone',
          last_updated: '2024-10-18T22:55:37.870024Z',
          name: 'default',
          phase: 'http_request_firewall_custom',
          rules: [
            {
              action: 'skip',
              action_parameters: {
                phases: [
                  'http_ratelimit',
                  'http_request_firewall_managed',
                  'http_request_sbfm'
                ],
                products: [
                  'waf',
                  'rateLimit',
                  'securityLevel',
                  'hot',
                  'bic',
                  'uaBlock',
                  'zoneLockdown'
                ],
                ruleset: 'current'
              },
              description: 'Bypass Cloudflare for GitHub Action (Self-Hosted)',
              enabled: true,
              expression:
                '(ip.src eq 150.136.52.14) or (ip.src eq 132.145.163.239) or (ip.src eq 66.135.17.160)',
              id: '22241cbc29684840bac4b9e3684059df',
              last_updated: '2024-10-12T13:13:05.450759Z',
              logging: {
                enabled: true
              },
              ref: '22241cbc29684840bac4b9e3684059df',
              version: '6'
            },
            {
              action: 'skip',
              action_parameters: {
                phases: [
                  'http_ratelimit',
                  'http_request_firewall_managed',
                  'http_request_sbfm'
                ],
                products: [
                  'zoneLockdown',
                  'uaBlock',
                  'bic',
                  'hot',
                  'securityLevel',
                  'rateLimit',
                  'waf'
                ],
                ruleset: 'current'
              },
              description: 'Bypass Cloudflare for GitHub Action (GitHub)',
              enabled: true,
              expression: '(ip.src in $github_actions)',
              id: 'f6b9944b24294a9b94bc46e66e93c725',
              last_updated: '2024-10-05T14:00:38.340186Z',
              logging: {
                enabled: true
              },
              ref: 'f6b9944b24294a9b94bc46e66e93c725',
              version: '4'
            },
            {
              action: 'block',
              description: 'Block',
              enabled: true,
              expression:
                '(http.user_agent eq "Go-http-client/1.1") or (ip.src eq 115.205.49.184) or (http.request.uri.path eq "/.env") or (http.request.full_uri wildcard r"https://docker.sn0wdr1am.com/wp-*/*")',
              id: '96cd484aac714008a4987d324c558316',
              last_updated: '2024-10-18T22:55:37.870024Z',
              ref: '96cd484aac714008a4987d324c558316',
              version: '7'
            }
          ],
          source: 'firewall_custom',
          version: '17'
        },
        success: true,
        errors: [],
        messages: []
      }

      const custom_zone_rulesets_id = '20fa246ce0bf4c409400673d60783f6e'

      jest.spyOn(global, 'fetch').mockResolvedValue(
        Promise.resolve({
          ok: true,
          status: 200,
          json: async () => Promise.resolve(data)
        }) as Promise<Response>
      )

      const custom_zone_rulesets = await get_custom_zone_ruleset(
        cf_zone_id,
        cf_api_token,
        ruleset_id
      )

      expect(custom_zone_rulesets.id).toEqual(custom_zone_rulesets_id)
    })

    it('should throw Error with status 403', async () => {
      const cf_zone_id = '0890d49c7ecd89e4abef674d77b2e766'
      const cf_api_token = 'WKZDG_1owHLAWSasxxHyObz1zWH2aBdac9s0X4955'
      const ruleset_id = '0890d49c7ecd89e4abef674d77b2e766'

      const data = {
        result: {
          description: '',
          id: '20fa246ce0bf4c409400673d60783f6e',
          kind: 'zone',
          last_updated: '2024-10-18T22:55:37.870024Z',
          name: 'default',
          phase: 'http_request_firewall_custom',
          rules: [
            {
              action: 'skip',
              action_parameters: {
                phases: [
                  'http_ratelimit',
                  'http_request_firewall_managed',
                  'http_request_sbfm'
                ],
                products: [
                  'waf',
                  'rateLimit',
                  'securityLevel',
                  'hot',
                  'bic',
                  'uaBlock',
                  'zoneLockdown'
                ],
                ruleset: 'current'
              },
              description: 'Bypass Cloudflare for GitHub Action (Self-Hosted)',
              enabled: true,
              expression:
                '(ip.src eq 150.136.52.14) or (ip.src eq 132.145.163.239) or (ip.src eq 66.135.17.160)',
              id: '22241cbc29684840bac4b9e3684059df',
              last_updated: '2024-10-12T13:13:05.450759Z',
              logging: {
                enabled: true
              },
              ref: '22241cbc29684840bac4b9e3684059df',
              version: '6'
            },
            {
              action: 'skip',
              action_parameters: {
                phases: [
                  'http_ratelimit',
                  'http_request_firewall_managed',
                  'http_request_sbfm'
                ],
                products: [
                  'zoneLockdown',
                  'uaBlock',
                  'bic',
                  'hot',
                  'securityLevel',
                  'rateLimit',
                  'waf'
                ],
                ruleset: 'current'
              },
              description: 'Bypass Cloudflare for GitHub Action (GitHub)',
              enabled: true,
              expression: '(ip.src in $github_actions)',
              id: 'f6b9944b24294a9b94bc46e66e93c725',
              last_updated: '2024-10-05T14:00:38.340186Z',
              logging: {
                enabled: true
              },
              ref: 'f6b9944b24294a9b94bc46e66e93c725',
              version: '4'
            },
            {
              action: 'block',
              description: 'Block',
              enabled: true,
              expression:
                '(http.user_agent eq "Go-http-client/1.1") or (ip.src eq 115.205.49.184) or (http.request.uri.path eq "/.env") or (http.request.full_uri wildcard r"https://docker.sn0wdr1am.com/wp-*/*")',
              id: '96cd484aac714008a4987d324c558316',
              last_updated: '2024-10-18T22:55:37.870024Z',
              ref: '96cd484aac714008a4987d324c558316',
              version: '7'
            }
          ],
          source: 'firewall_custom',
          version: '17'
        },
        success: true,
        errors: [],
        messages: []
      }

      jest.spyOn(global, 'fetch').mockResolvedValue(
        Promise.resolve({
          ok: false,
          status: 403,
          json: async () => Promise.resolve(data)
        }) as Promise<Response>
      )

      await expect(
        get_custom_zone_ruleset(cf_zone_id, cf_api_token, ruleset_id)
      ).rejects.toThrow('Response status: 403')
    })

    it('should throw Error with responseError', async () => {
      const cf_zone_id = '0890d49c7ecd89e4abef674d77b2e766'
      const cf_api_token = 'WKZDG_1owHLAWSasxxHyObz1zWH2aBdac9s0X4955'
      const ruleset_id = '0890d49c7ecd89e4abef674d77b2e766'

      jest.spyOn(global, 'fetch').mockResolvedValue(
        Promise.resolve({
          ok: true,
          status: 200,
          json: async () => Promise.resolve(responseError)
        }) as Promise<Response>
      )

      await expect(
        get_custom_zone_ruleset(cf_zone_id, cf_api_token, ruleset_id)
      ).rejects.toThrow(JSON.stringify(responseError.errors, null, 2))
    })

    it('should throw Error with responseMessage', async () => {
      const cf_zone_id = '0890d49c7ecd89e4abef674d77b2e766'
      const cf_api_token = 'WKZDG_1owHLAWSasxxHyObz1zWH2aBdac9s0X4955'
      const ruleset_id = '0890d49c7ecd89e4abef674d77b2e766'

      jest.spyOn(global, 'fetch').mockResolvedValue(
        Promise.resolve({
          ok: true,
          status: 200,
          json: async () => Promise.resolve(responseMessage)
        }) as Promise<Response>
      )

      await expect(
        get_custom_zone_ruleset(cf_zone_id, cf_api_token, ruleset_id)
      ).rejects.toThrow(JSON.stringify(responseMessage.messages, null, 2))
    })

    it('should return ZoneRuleset Not found.', async () => {
      const cf_zone_id = '0890d49c7ecd89e4abef674d77b2e766'
      const cf_api_token = 'WKZDG_1owHLAWSasxxHyObz1zWH2aBdac9s0X4955'
      const ruleset_id = '0890d49c7ecd89e4abef674d77b2e766'

      const data = {
        result: {},
        success: true,
        errors: [],
        messages: []
      }

      jest.spyOn(global, 'fetch').mockResolvedValue(
        Promise.resolve({
          ok: true,
          status: 200,
          json: async () => Promise.resolve(data)
        }) as Promise<Response>
      )

      await expect(
        get_custom_zone_ruleset(cf_zone_id, cf_api_token, ruleset_id)
      ).rejects.toThrow('ZoneRuleset Not found.')
    })
  })

  describe('create_custom_zone_rule', () => {
    it('should return custom zone rule if possible.', async () => {
      const cf_zone_id = '0890d49c7ecd89e4abef674d77b2e766'
      const cf_api_token = 'WKZDG_1owHLAWSasxxHyObz1zWH2aBdac9s0X4955'
      const ruleset_id = '0890d49c7ecd89e4abef674d77b2e766'

      const data = {
        action: 'skip',
        action_parameters: {
          phases: [
            'http_ratelimit',
            'http_request_firewall_managed',
            'http_request_sbfm'
          ],
          products: [
            'waf',
            'rateLimit',
            'securityLevel',
            'hot',
            'bic',
            'uaBlock',
            'zoneLockdown'
          ],
          ruleset: 'current'
        },
        description: 'test',
        enabled: true,
        expression:
          '(ip.src eq 150.136.52.14) or (ip.src eq 132.145.163.239) or (ip.src eq 66.135.17.160)'
      }

      const response = {
        result: {
          description: '',
          id: '20fa246ce0bf4c409400673d60783f6e',
          kind: 'zone',
          last_updated: '2024-11-27T13:08:16.577727Z',
          name: 'default',
          phase: 'http_request_firewall_custom',
          rules: [
            {
              action: 'skip',
              action_parameters: {
                phases: [
                  'http_ratelimit',
                  'http_request_firewall_managed',
                  'http_request_sbfm'
                ],
                products: [
                  'waf',
                  'rateLimit',
                  'securityLevel',
                  'hot',
                  'bic',
                  'uaBlock',
                  'zoneLockdown'
                ],
                ruleset: 'current'
              },
              description: 'Bypass Cloudflare for GitHub Action (Self-Hosted)',
              enabled: true,
              expression:
                '(ip.src eq 150.136.52.14) or (ip.src eq 132.145.163.239) or (ip.src eq 66.135.17.160)',
              id: '22241cbc29684840bac4b9e3684059df',
              last_updated: '2024-10-12T13:13:05.450759Z',
              logging: {
                enabled: true
              },
              ref: '22241cbc29684840bac4b9e3684059df',
              version: '6'
            },
            {
              action: 'skip',
              action_parameters: {
                phases: [
                  'http_ratelimit',
                  'http_request_firewall_managed',
                  'http_request_sbfm'
                ],
                products: [
                  'zoneLockdown',
                  'uaBlock',
                  'bic',
                  'hot',
                  'securityLevel',
                  'rateLimit',
                  'waf'
                ],
                ruleset: 'current'
              },
              description: 'Bypass Cloudflare for GitHub Action (GitHub)',
              enabled: true,
              expression: '(ip.src in $github_actions)',
              id: 'f6b9944b24294a9b94bc46e66e93c725',
              last_updated: '2024-10-05T14:00:38.340186Z',
              logging: {
                enabled: true
              },
              ref: 'f6b9944b24294a9b94bc46e66e93c725',
              version: '4'
            },
            {
              action: 'block',
              description: 'Block',
              enabled: true,
              expression:
                '(http.user_agent eq "Go-http-client/1.1") or (ip.src eq 115.205.49.184) or (http.request.uri.path eq "/.env") or (http.request.full_uri wildcard r"https://docker.sn0wdr1am.com/wp-*/*")',
              id: '96cd484aac714008a4987d324c558316',
              last_updated: '2024-10-18T22:55:37.870024Z',
              ref: '96cd484aac714008a4987d324c558316',
              version: '7'
            },
            {
              action: 'skip',
              action_parameters: {
                phases: [
                  'http_ratelimit',
                  'http_request_firewall_managed',
                  'http_request_sbfm'
                ],
                products: [
                  'waf',
                  'rateLimit',
                  'securityLevel',
                  'hot',
                  'bic',
                  'uaBlock',
                  'zoneLockdown'
                ],
                ruleset: 'current'
              },
              description: 'test',
              enabled: true,
              expression:
                '(ip.src eq 150.136.52.14) or (ip.src eq 132.145.163.239) or (ip.src eq 66.135.17.160)',
              id: 'a471f6e4e6da48d3a0c444a0e6d357b1',
              last_updated: '2024-11-27T13:08:16.577727Z',
              logging: {
                enabled: true
              },
              ref: 'a471f6e4e6da48d3a0c444a0e6d357b1',
              version: '1'
            }
          ],
          source: 'firewall_custom',
          version: '18'
        },
        success: true,
        errors: [],
        messages: []
      }

      const custom_zone_rulesets_id = '20fa246ce0bf4c409400673d60783f6e'

      jest.spyOn(global, 'fetch').mockResolvedValue(
        Promise.resolve({
          ok: true,
          status: 200,
          json: async () => Promise.resolve(response)
        }) as Promise<Response>
      )

      const custom_zone_rulesets = await create_custom_zone_rule(
        cf_zone_id,
        cf_api_token,
        ruleset_id,
        data
      )

      expect(custom_zone_rulesets.id).toEqual(custom_zone_rulesets_id)
    })

    it('should throw Error with status 403', async () => {
      const cf_zone_id = '0890d49c7ecd89e4abef674d77b2e766'
      const cf_api_token = 'WKZDG_1owHLAWSasxxHyObz1zWH2aBdac9s0X4955'
      const ruleset_id = '0890d49c7ecd89e4abef674d77b2e766'

      const data = {
        action: 'skip',
        action_parameters: {
          phases: [
            'http_ratelimit',
            'http_request_firewall_managed',
            'http_request_sbfm'
          ],
          products: [
            'waf',
            'rateLimit',
            'securityLevel',
            'hot',
            'bic',
            'uaBlock',
            'zoneLockdown'
          ],
          ruleset: 'current'
        },
        description: 'test',
        enabled: true,
        expression:
          '(ip.src eq 150.136.52.14) or (ip.src eq 132.145.163.239) or (ip.src eq 66.135.17.160)'
      }

      const response = {
        result: {
          description: '',
          id: '20fa246ce0bf4c409400673d60783f6e',
          kind: 'zone',
          last_updated: '2024-11-27T13:08:16.577727Z',
          name: 'default',
          phase: 'http_request_firewall_custom',
          rules: [
            {
              action: 'skip',
              action_parameters: {
                phases: [
                  'http_ratelimit',
                  'http_request_firewall_managed',
                  'http_request_sbfm'
                ],
                products: [
                  'waf',
                  'rateLimit',
                  'securityLevel',
                  'hot',
                  'bic',
                  'uaBlock',
                  'zoneLockdown'
                ],
                ruleset: 'current'
              },
              description: 'Bypass Cloudflare for GitHub Action (Self-Hosted)',
              enabled: true,
              expression:
                '(ip.src eq 150.136.52.14) or (ip.src eq 132.145.163.239) or (ip.src eq 66.135.17.160)',
              id: '22241cbc29684840bac4b9e3684059df',
              last_updated: '2024-10-12T13:13:05.450759Z',
              logging: {
                enabled: true
              },
              ref: '22241cbc29684840bac4b9e3684059df',
              version: '6'
            },
            {
              action: 'skip',
              action_parameters: {
                phases: [
                  'http_ratelimit',
                  'http_request_firewall_managed',
                  'http_request_sbfm'
                ],
                products: [
                  'zoneLockdown',
                  'uaBlock',
                  'bic',
                  'hot',
                  'securityLevel',
                  'rateLimit',
                  'waf'
                ],
                ruleset: 'current'
              },
              description: 'Bypass Cloudflare for GitHub Action (GitHub)',
              enabled: true,
              expression: '(ip.src in $github_actions)',
              id: 'f6b9944b24294a9b94bc46e66e93c725',
              last_updated: '2024-10-05T14:00:38.340186Z',
              logging: {
                enabled: true
              },
              ref: 'f6b9944b24294a9b94bc46e66e93c725',
              version: '4'
            },
            {
              action: 'block',
              description: 'Block',
              enabled: true,
              expression:
                '(http.user_agent eq "Go-http-client/1.1") or (ip.src eq 115.205.49.184) or (http.request.uri.path eq "/.env") or (http.request.full_uri wildcard r"https://docker.sn0wdr1am.com/wp-*/*")',
              id: '96cd484aac714008a4987d324c558316',
              last_updated: '2024-10-18T22:55:37.870024Z',
              ref: '96cd484aac714008a4987d324c558316',
              version: '7'
            },
            {
              action: 'skip',
              action_parameters: {
                phases: [
                  'http_ratelimit',
                  'http_request_firewall_managed',
                  'http_request_sbfm'
                ],
                products: [
                  'waf',
                  'rateLimit',
                  'securityLevel',
                  'hot',
                  'bic',
                  'uaBlock',
                  'zoneLockdown'
                ],
                ruleset: 'current'
              },
              description: 'test',
              enabled: true,
              expression:
                '(ip.src eq 150.136.52.14) or (ip.src eq 132.145.163.239) or (ip.src eq 66.135.17.160)',
              id: 'a471f6e4e6da48d3a0c444a0e6d357b1',
              last_updated: '2024-11-27T13:08:16.577727Z',
              logging: {
                enabled: true
              },
              ref: 'a471f6e4e6da48d3a0c444a0e6d357b1',
              version: '1'
            }
          ],
          source: 'firewall_custom',
          version: '18'
        },
        success: true,
        errors: [],
        messages: []
      }

      jest.spyOn(global, 'fetch').mockResolvedValue(
        Promise.resolve({
          ok: false,
          status: 403,
          json: async () => Promise.resolve(response)
        }) as Promise<Response>
      )

      await expect(
        create_custom_zone_rule(cf_zone_id, cf_api_token, ruleset_id, data)
      ).rejects.toThrow('Response status: 403')
    })

    it('should throw Error with responseError', async () => {
      const cf_zone_id = '0890d49c7ecd89e4abef674d77b2e766'
      const cf_api_token = 'WKZDG_1owHLAWSasxxHyObz1zWH2aBdac9s0X4955'
      const ruleset_id = '0890d49c7ecd89e4abef674d77b2e766'

      const data = {
        action: 'skip',
        action_parameters: {
          phases: [
            'http_ratelimit',
            'http_request_firewall_managed',
            'http_request_sbfm'
          ],
          products: [
            'waf',
            'rateLimit',
            'securityLevel',
            'hot',
            'bic',
            'uaBlock',
            'zoneLockdown'
          ],
          ruleset: 'current'
        },
        description: 'test',
        enabled: true,
        expression:
          '(ip.src eq 150.136.52.14) or (ip.src eq 132.145.163.239) or (ip.src eq 66.135.17.160)'
      }

      jest.spyOn(global, 'fetch').mockResolvedValue(
        Promise.resolve({
          ok: true,
          status: 200,
          json: async () => Promise.resolve(responseError)
        }) as Promise<Response>
      )

      await expect(
        create_custom_zone_rule(cf_zone_id, cf_api_token, ruleset_id, data)
      ).rejects.toThrow(JSON.stringify(responseError.errors, null, 2))
    })

    it('should throw Error with responseMessage', async () => {
      const cf_zone_id = '0890d49c7ecd89e4abef674d77b2e766'
      const cf_api_token = 'WKZDG_1owHLAWSasxxHyObz1zWH2aBdac9s0X4955'
      const ruleset_id = '0890d49c7ecd89e4abef674d77b2e766'

      const data = {
        action: 'skip',
        action_parameters: {
          phases: [
            'http_ratelimit',
            'http_request_firewall_managed',
            'http_request_sbfm'
          ],
          products: [
            'waf',
            'rateLimit',
            'securityLevel',
            'hot',
            'bic',
            'uaBlock',
            'zoneLockdown'
          ],
          ruleset: 'current'
        },
        description: 'test',
        enabled: true,
        expression:
          '(ip.src eq 150.136.52.14) or (ip.src eq 132.145.163.239) or (ip.src eq 66.135.17.160)'
      }

      jest.spyOn(global, 'fetch').mockResolvedValue(
        Promise.resolve({
          ok: true,
          status: 200,
          json: async () => Promise.resolve(responseMessage)
        }) as Promise<Response>
      )

      await expect(
        create_custom_zone_rule(cf_zone_id, cf_api_token, ruleset_id, data)
      ).rejects.toThrow(JSON.stringify(responseMessage.messages, null, 2))
    })

    it('should return ZoneRuleset Not found.', async () => {
      const cf_zone_id = '0890d49c7ecd89e4abef674d77b2e766'
      const cf_api_token = 'WKZDG_1owHLAWSasxxHyObz1zWH2aBdac9s0X4955'
      const ruleset_id = '0890d49c7ecd89e4abef674d77b2e766'

      const data = {
        action: 'skip',
        action_parameters: {
          phases: [
            'http_ratelimit',
            'http_request_firewall_managed',
            'http_request_sbfm'
          ],
          products: [
            'waf',
            'rateLimit',
            'securityLevel',
            'hot',
            'bic',
            'uaBlock',
            'zoneLockdown'
          ],
          ruleset: 'current'
        },
        description: 'test',
        enabled: true,
        expression:
          '(ip.src eq 150.136.52.14) or (ip.src eq 132.145.163.239) or (ip.src eq 66.135.17.160)'
      }

      const response = {
        result: {},
        success: true,
        errors: [],
        messages: []
      }

      jest.spyOn(global, 'fetch').mockResolvedValue(
        Promise.resolve({
          ok: true,
          status: 200,
          json: async () => Promise.resolve(response)
        }) as Promise<Response>
      )

      await expect(
        create_custom_zone_rule(cf_zone_id, cf_api_token, ruleset_id, data)
      ).rejects.toThrow('ZoneRuleset Not found.')
    })
  })

  describe('update_custom_zone_rule', () => {
    it('should return custom zone rule if possible.', async () => {
      const cf_zone_id = '0890d49c7ecd89e4abef674d77b2e766'
      const cf_api_token = 'WKZDG_1owHLAWSasxxHyObz1zWH2aBdac9s0X4955'
      const ruleset_id = '0890d49c7ecd89e4abef674d77b2e766'
      const rule_id = '0890d49c7ecd89e4abef674d77b2e766'

      const data = {
        action: 'skip',
        action_parameters: {
          phases: [
            'http_ratelimit',
            'http_request_firewall_managed',
            'http_request_sbfm'
          ],
          products: [
            'waf',
            'rateLimit',
            'securityLevel',
            'hot',
            'bic',
            'uaBlock',
            'zoneLockdown'
          ],
          ruleset: 'current'
        },
        description: 'test 11',
        enabled: true,
        expression:
          '(ip.src eq 150.136.52.14) or (ip.src eq 132.145.163.239) or (ip.src eq 66.135.17.160)',
        id: 'a471f6e4e6da48d3a0c444a0e6d357b1',
        last_updated: '2024-11-27T13:08:16.577727Z',
        logging: {
          enabled: true
        },
        ref: 'a471f6e4e6da48d3a0c444a0e6d357b1',
        version: '1'
      }

      const response = {
        result: {
          description: '',
          id: '20fa246ce0bf4c409400673d60783f6e',
          kind: 'zone',
          last_updated: '2024-11-27T13:31:38.225415Z',
          name: 'default',
          phase: 'http_request_firewall_custom',
          rules: [
            {
              action: 'skip',
              action_parameters: {
                phases: [
                  'http_ratelimit',
                  'http_request_firewall_managed',
                  'http_request_sbfm'
                ],
                products: [
                  'waf',
                  'rateLimit',
                  'securityLevel',
                  'hot',
                  'bic',
                  'uaBlock',
                  'zoneLockdown'
                ],
                ruleset: 'current'
              },
              description: 'Bypass Cloudflare for GitHub Action (Self-Hosted)',
              enabled: true,
              expression:
                '(ip.src eq 150.136.52.14) or (ip.src eq 132.145.163.239) or (ip.src eq 66.135.17.160)',
              id: '22241cbc29684840bac4b9e3684059df',
              last_updated: '2024-10-12T13:13:05.450759Z',
              logging: {
                enabled: true
              },
              ref: '22241cbc29684840bac4b9e3684059df',
              version: '6'
            },
            {
              action: 'skip',
              action_parameters: {
                phases: [
                  'http_ratelimit',
                  'http_request_firewall_managed',
                  'http_request_sbfm'
                ],
                products: [
                  'zoneLockdown',
                  'uaBlock',
                  'bic',
                  'hot',
                  'securityLevel',
                  'rateLimit',
                  'waf'
                ],
                ruleset: 'current'
              },
              description: 'Bypass Cloudflare for GitHub Action (GitHub)',
              enabled: true,
              expression: '(ip.src in $github_actions)',
              id: 'f6b9944b24294a9b94bc46e66e93c725',
              last_updated: '2024-10-05T14:00:38.340186Z',
              logging: {
                enabled: true
              },
              ref: 'f6b9944b24294a9b94bc46e66e93c725',
              version: '4'
            },
            {
              action: 'block',
              description: 'Block',
              enabled: true,
              expression:
                '(http.user_agent eq "Go-http-client/1.1") or (ip.src eq 115.205.49.184) or (http.request.uri.path eq "/.env") or (http.request.full_uri wildcard r"https://docker.sn0wdr1am.com/wp-*/*")',
              id: '96cd484aac714008a4987d324c558316',
              last_updated: '2024-10-18T22:55:37.870024Z',
              ref: '96cd484aac714008a4987d324c558316',
              version: '7'
            },
            {
              action: 'skip',
              action_parameters: {
                phases: [
                  'http_ratelimit',
                  'http_request_firewall_managed',
                  'http_request_sbfm'
                ],
                products: [
                  'waf',
                  'rateLimit',
                  'securityLevel',
                  'hot',
                  'bic',
                  'uaBlock',
                  'zoneLockdown'
                ],
                ruleset: 'current'
              },
              description: 'test 11',
              enabled: true,
              expression:
                '(ip.src eq 150.136.52.14) or (ip.src eq 132.145.163.239) or (ip.src eq 66.135.17.160)',
              id: 'a471f6e4e6da48d3a0c444a0e6d357b1',
              last_updated: '2024-11-27T13:31:38.225415Z',
              logging: {
                enabled: true
              },
              ref: 'a471f6e4e6da48d3a0c444a0e6d357b1',
              version: '2'
            }
          ],
          source: 'firewall_custom',
          version: '19'
        },
        success: true,
        errors: [],
        messages: []
      }

      const custom_zone_rulesets_id = '20fa246ce0bf4c409400673d60783f6e'

      jest.spyOn(global, 'fetch').mockResolvedValue(
        Promise.resolve({
          ok: true,
          status: 200,
          json: async () => Promise.resolve(response)
        }) as Promise<Response>
      )

      const custom_zone_rulesets = await update_custom_zone_rule(
        cf_zone_id,
        cf_api_token,
        ruleset_id,
        rule_id,
        data
      )

      expect(custom_zone_rulesets.id).toEqual(custom_zone_rulesets_id)
    })

    it('should throw Error with status 403', async () => {
      const cf_zone_id = '0890d49c7ecd89e4abef674d77b2e766'
      const cf_api_token = 'WKZDG_1owHLAWSasxxHyObz1zWH2aBdac9s0X4955'
      const ruleset_id = '0890d49c7ecd89e4abef674d77b2e766'
      const rule_id = '0890d49c7ecd89e4abef674d77b2e766'

      const data = {
        action: 'skip',
        action_parameters: {
          phases: [
            'http_ratelimit',
            'http_request_firewall_managed',
            'http_request_sbfm'
          ],
          products: [
            'waf',
            'rateLimit',
            'securityLevel',
            'hot',
            'bic',
            'uaBlock',
            'zoneLockdown'
          ],
          ruleset: 'current'
        },
        description: 'test 11',
        enabled: true,
        expression:
          '(ip.src eq 150.136.52.14) or (ip.src eq 132.145.163.239) or (ip.src eq 66.135.17.160)',
        id: 'a471f6e4e6da48d3a0c444a0e6d357b1',
        last_updated: '2024-11-27T13:08:16.577727Z',
        logging: {
          enabled: true
        },
        ref: 'a471f6e4e6da48d3a0c444a0e6d357b1',
        version: '1'
      }

      const response = {
        result: {
          description: '',
          id: '20fa246ce0bf4c409400673d60783f6e',
          kind: 'zone',
          last_updated: '2024-11-27T13:31:38.225415Z',
          name: 'default',
          phase: 'http_request_firewall_custom',
          rules: [
            {
              action: 'skip',
              action_parameters: {
                phases: [
                  'http_ratelimit',
                  'http_request_firewall_managed',
                  'http_request_sbfm'
                ],
                products: [
                  'waf',
                  'rateLimit',
                  'securityLevel',
                  'hot',
                  'bic',
                  'uaBlock',
                  'zoneLockdown'
                ],
                ruleset: 'current'
              },
              description: 'Bypass Cloudflare for GitHub Action (Self-Hosted)',
              enabled: true,
              expression:
                '(ip.src eq 150.136.52.14) or (ip.src eq 132.145.163.239) or (ip.src eq 66.135.17.160)',
              id: '22241cbc29684840bac4b9e3684059df',
              last_updated: '2024-10-12T13:13:05.450759Z',
              logging: {
                enabled: true
              },
              ref: '22241cbc29684840bac4b9e3684059df',
              version: '6'
            },
            {
              action: 'skip',
              action_parameters: {
                phases: [
                  'http_ratelimit',
                  'http_request_firewall_managed',
                  'http_request_sbfm'
                ],
                products: [
                  'zoneLockdown',
                  'uaBlock',
                  'bic',
                  'hot',
                  'securityLevel',
                  'rateLimit',
                  'waf'
                ],
                ruleset: 'current'
              },
              description: 'Bypass Cloudflare for GitHub Action (GitHub)',
              enabled: true,
              expression: '(ip.src in $github_actions)',
              id: 'f6b9944b24294a9b94bc46e66e93c725',
              last_updated: '2024-10-05T14:00:38.340186Z',
              logging: {
                enabled: true
              },
              ref: 'f6b9944b24294a9b94bc46e66e93c725',
              version: '4'
            },
            {
              action: 'block',
              description: 'Block',
              enabled: true,
              expression:
                '(http.user_agent eq "Go-http-client/1.1") or (ip.src eq 115.205.49.184) or (http.request.uri.path eq "/.env") or (http.request.full_uri wildcard r"https://docker.sn0wdr1am.com/wp-*/*")',
              id: '96cd484aac714008a4987d324c558316',
              last_updated: '2024-10-18T22:55:37.870024Z',
              ref: '96cd484aac714008a4987d324c558316',
              version: '7'
            },
            {
              action: 'skip',
              action_parameters: {
                phases: [
                  'http_ratelimit',
                  'http_request_firewall_managed',
                  'http_request_sbfm'
                ],
                products: [
                  'waf',
                  'rateLimit',
                  'securityLevel',
                  'hot',
                  'bic',
                  'uaBlock',
                  'zoneLockdown'
                ],
                ruleset: 'current'
              },
              description: 'test 11',
              enabled: true,
              expression:
                '(ip.src eq 150.136.52.14) or (ip.src eq 132.145.163.239) or (ip.src eq 66.135.17.160)',
              id: 'a471f6e4e6da48d3a0c444a0e6d357b1',
              last_updated: '2024-11-27T13:31:38.225415Z',
              logging: {
                enabled: true
              },
              ref: 'a471f6e4e6da48d3a0c444a0e6d357b1',
              version: '2'
            }
          ],
          source: 'firewall_custom',
          version: '19'
        },
        success: true,
        errors: [],
        messages: []
      }

      jest.spyOn(global, 'fetch').mockResolvedValue(
        Promise.resolve({
          ok: false,
          status: 403,
          json: async () => Promise.resolve(response)
        }) as Promise<Response>
      )

      await expect(
        update_custom_zone_rule(
          cf_zone_id,
          cf_api_token,
          ruleset_id,
          rule_id,
          data
        )
      ).rejects.toThrow('Response status: 403')
    })

    it('should throw Error with responseError', async () => {
      const cf_zone_id = '0890d49c7ecd89e4abef674d77b2e766'
      const cf_api_token = 'WKZDG_1owHLAWSasxxHyObz1zWH2aBdac9s0X4955'
      const ruleset_id = '0890d49c7ecd89e4abef674d77b2e766'
      const rule_id = '0890d49c7ecd89e4abef674d77b2e766'

      const data = {
        action: 'skip',
        action_parameters: {
          phases: [
            'http_ratelimit',
            'http_request_firewall_managed',
            'http_request_sbfm'
          ],
          products: [
            'waf',
            'rateLimit',
            'securityLevel',
            'hot',
            'bic',
            'uaBlock',
            'zoneLockdown'
          ],
          ruleset: 'current'
        },
        description: 'test 11',
        enabled: true,
        expression:
          '(ip.src eq 150.136.52.14) or (ip.src eq 132.145.163.239) or (ip.src eq 66.135.17.160)',
        id: 'a471f6e4e6da48d3a0c444a0e6d357b1',
        last_updated: '2024-11-27T13:08:16.577727Z',
        logging: {
          enabled: true
        },
        ref: 'a471f6e4e6da48d3a0c444a0e6d357b1',
        version: '1'
      }

      jest.spyOn(global, 'fetch').mockResolvedValue(
        Promise.resolve({
          ok: true,
          status: 200,
          json: async () => Promise.resolve(responseError)
        }) as Promise<Response>
      )

      await expect(
        update_custom_zone_rule(
          cf_zone_id,
          cf_api_token,
          ruleset_id,
          rule_id,
          data
        )
      ).rejects.toThrow(JSON.stringify(responseError.errors, null, 2))
    })

    it('should throw Error with responseMessage', async () => {
      const cf_zone_id = '0890d49c7ecd89e4abef674d77b2e766'
      const cf_api_token = 'WKZDG_1owHLAWSasxxHyObz1zWH2aBdac9s0X4955'
      const ruleset_id = '0890d49c7ecd89e4abef674d77b2e766'
      const rule_id = '0890d49c7ecd89e4abef674d77b2e766'

      const data = {
        action: 'skip',
        action_parameters: {
          phases: [
            'http_ratelimit',
            'http_request_firewall_managed',
            'http_request_sbfm'
          ],
          products: [
            'waf',
            'rateLimit',
            'securityLevel',
            'hot',
            'bic',
            'uaBlock',
            'zoneLockdown'
          ],
          ruleset: 'current'
        },
        description: 'test 11',
        enabled: true,
        expression:
          '(ip.src eq 150.136.52.14) or (ip.src eq 132.145.163.239) or (ip.src eq 66.135.17.160)',
        id: 'a471f6e4e6da48d3a0c444a0e6d357b1',
        last_updated: '2024-11-27T13:08:16.577727Z',
        logging: {
          enabled: true
        },
        ref: 'a471f6e4e6da48d3a0c444a0e6d357b1',
        version: '1'
      }

      jest.spyOn(global, 'fetch').mockResolvedValue(
        Promise.resolve({
          ok: true,
          status: 200,
          json: async () => Promise.resolve(responseMessage)
        }) as Promise<Response>
      )

      await expect(
        update_custom_zone_rule(
          cf_zone_id,
          cf_api_token,
          ruleset_id,
          rule_id,
          data
        )
      ).rejects.toThrow(JSON.stringify(responseMessage.messages, null, 2))
    })

    it('should return ZoneRuleset Not found.', async () => {
      const cf_zone_id = '0890d49c7ecd89e4abef674d77b2e766'
      const cf_api_token = 'WKZDG_1owHLAWSasxxHyObz1zWH2aBdac9s0X4955'
      const ruleset_id = '0890d49c7ecd89e4abef674d77b2e766'
      const rule_id = '0890d49c7ecd89e4abef674d77b2e766'

      const data = {
        action: 'skip',
        action_parameters: {
          phases: [
            'http_ratelimit',
            'http_request_firewall_managed',
            'http_request_sbfm'
          ],
          products: [
            'waf',
            'rateLimit',
            'securityLevel',
            'hot',
            'bic',
            'uaBlock',
            'zoneLockdown'
          ],
          ruleset: 'current'
        },
        description: 'test 11',
        enabled: true,
        expression:
          '(ip.src eq 150.136.52.14) or (ip.src eq 132.145.163.239) or (ip.src eq 66.135.17.160)',
        id: 'a471f6e4e6da48d3a0c444a0e6d357b1',
        last_updated: '2024-11-27T13:08:16.577727Z',
        logging: {
          enabled: true
        },
        ref: 'a471f6e4e6da48d3a0c444a0e6d357b1',
        version: '1'
      }

      const response = {
        result: {},
        success: true,
        errors: [],
        messages: []
      }

      jest.spyOn(global, 'fetch').mockResolvedValue(
        Promise.resolve({
          ok: true,
          status: 200,
          json: async () => Promise.resolve(response)
        }) as Promise<Response>
      )

      await expect(
        update_custom_zone_rule(
          cf_zone_id,
          cf_api_token,
          ruleset_id,
          rule_id,
          data
        )
      ).rejects.toThrow('ZoneRuleset Not found.')
    })
  })

  describe('delete_custom_zone_rule', () => {
    it('should return custom zone rule if possible.', async () => {
      const cf_zone_id = '0890d49c7ecd89e4abef674d77b2e766'
      const cf_api_token = 'WKZDG_1owHLAWSasxxHyObz1zWH2aBdac9s0X4955'
      const ruleset_id = '0890d49c7ecd89e4abef674d77b2e766'
      const rule_id = '0890d49c7ecd89e4abef674d77b2e766'

      const response = {
        result: {
          description: '',
          id: '20fa246ce0bf4c409400673d60783f6e',
          kind: 'zone',
          last_updated: '2024-11-27T14:06:58.148638Z',
          name: 'default',
          phase: 'http_request_firewall_custom',
          rules: [
            {
              action: 'skip',
              action_parameters: {
                phases: [
                  'http_ratelimit',
                  'http_request_firewall_managed',
                  'http_request_sbfm'
                ],
                products: [
                  'waf',
                  'rateLimit',
                  'securityLevel',
                  'hot',
                  'bic',
                  'uaBlock',
                  'zoneLockdown'
                ],
                ruleset: 'current'
              },
              description: 'Bypass Cloudflare for GitHub Action (Self-Hosted)',
              enabled: true,
              expression:
                '(ip.src eq 150.136.52.14) or (ip.src eq 132.145.163.239) or (ip.src eq 66.135.17.160)',
              id: '22241cbc29684840bac4b9e3684059df',
              last_updated: '2024-10-12T13:13:05.450759Z',
              logging: {
                enabled: true
              },
              ref: '22241cbc29684840bac4b9e3684059df',
              version: '6'
            },
            {
              action: 'skip',
              action_parameters: {
                phases: [
                  'http_ratelimit',
                  'http_request_firewall_managed',
                  'http_request_sbfm'
                ],
                products: [
                  'zoneLockdown',
                  'uaBlock',
                  'bic',
                  'hot',
                  'securityLevel',
                  'rateLimit',
                  'waf'
                ],
                ruleset: 'current'
              },
              description: 'Bypass Cloudflare for GitHub Action (GitHub)',
              enabled: true,
              expression: '(ip.src in $github_actions)',
              id: 'f6b9944b24294a9b94bc46e66e93c725',
              last_updated: '2024-10-05T14:00:38.340186Z',
              logging: {
                enabled: true
              },
              ref: 'f6b9944b24294a9b94bc46e66e93c725',
              version: '4'
            },
            {
              action: 'block',
              description: 'Block',
              enabled: true,
              expression:
                '(http.user_agent eq "Go-http-client/1.1") or (ip.src eq 115.205.49.184) or (http.request.uri.path eq "/.env") or (http.request.full_uri wildcard r"https://docker.sn0wdr1am.com/wp-*/*")',
              id: '96cd484aac714008a4987d324c558316',
              last_updated: '2024-10-18T22:55:37.870024Z',
              ref: '96cd484aac714008a4987d324c558316',
              version: '7'
            }
          ],
          source: 'firewall_custom',
          version: '20'
        },
        success: true,
        errors: [],
        messages: []
      }

      const custom_zone_rulesets_id = '20fa246ce0bf4c409400673d60783f6e'

      jest.spyOn(global, 'fetch').mockResolvedValue(
        Promise.resolve({
          ok: true,
          status: 200,
          json: async () => Promise.resolve(response)
        }) as Promise<Response>
      )

      const custom_zone_rulesets = await delete_custom_zone_rule(
        cf_zone_id,
        cf_api_token,
        ruleset_id,
        rule_id
      )

      expect(custom_zone_rulesets.id).toEqual(custom_zone_rulesets_id)
    })

    it('should throw Error with status 403', async () => {
      const cf_zone_id = '0890d49c7ecd89e4abef674d77b2e766'
      const cf_api_token = 'WKZDG_1owHLAWSasxxHyObz1zWH2aBdac9s0X4955'
      const ruleset_id = '0890d49c7ecd89e4abef674d77b2e766'
      const rule_id = '0890d49c7ecd89e4abef674d77b2e766'

      const response = {
        result: {
          description: '',
          id: '20fa246ce0bf4c409400673d60783f6e',
          kind: 'zone',
          last_updated: '2024-11-27T14:06:58.148638Z',
          name: 'default',
          phase: 'http_request_firewall_custom',
          rules: [
            {
              action: 'skip',
              action_parameters: {
                phases: [
                  'http_ratelimit',
                  'http_request_firewall_managed',
                  'http_request_sbfm'
                ],
                products: [
                  'waf',
                  'rateLimit',
                  'securityLevel',
                  'hot',
                  'bic',
                  'uaBlock',
                  'zoneLockdown'
                ],
                ruleset: 'current'
              },
              description: 'Bypass Cloudflare for GitHub Action (Self-Hosted)',
              enabled: true,
              expression:
                '(ip.src eq 150.136.52.14) or (ip.src eq 132.145.163.239) or (ip.src eq 66.135.17.160)',
              id: '22241cbc29684840bac4b9e3684059df',
              last_updated: '2024-10-12T13:13:05.450759Z',
              logging: {
                enabled: true
              },
              ref: '22241cbc29684840bac4b9e3684059df',
              version: '6'
            },
            {
              action: 'skip',
              action_parameters: {
                phases: [
                  'http_ratelimit',
                  'http_request_firewall_managed',
                  'http_request_sbfm'
                ],
                products: [
                  'zoneLockdown',
                  'uaBlock',
                  'bic',
                  'hot',
                  'securityLevel',
                  'rateLimit',
                  'waf'
                ],
                ruleset: 'current'
              },
              description: 'Bypass Cloudflare for GitHub Action (GitHub)',
              enabled: true,
              expression: '(ip.src in $github_actions)',
              id: 'f6b9944b24294a9b94bc46e66e93c725',
              last_updated: '2024-10-05T14:00:38.340186Z',
              logging: {
                enabled: true
              },
              ref: 'f6b9944b24294a9b94bc46e66e93c725',
              version: '4'
            },
            {
              action: 'block',
              description: 'Block',
              enabled: true,
              expression:
                '(http.user_agent eq "Go-http-client/1.1") or (ip.src eq 115.205.49.184) or (http.request.uri.path eq "/.env") or (http.request.full_uri wildcard r"https://docker.sn0wdr1am.com/wp-*/*")',
              id: '96cd484aac714008a4987d324c558316',
              last_updated: '2024-10-18T22:55:37.870024Z',
              ref: '96cd484aac714008a4987d324c558316',
              version: '7'
            }
          ],
          source: 'firewall_custom',
          version: '20'
        },
        success: true,
        errors: [],
        messages: []
      }

      jest.spyOn(global, 'fetch').mockResolvedValue(
        Promise.resolve({
          ok: false,
          status: 403,
          json: async () => Promise.resolve(response)
        }) as Promise<Response>
      )

      await expect(
        delete_custom_zone_rule(cf_zone_id, cf_api_token, ruleset_id, rule_id)
      ).rejects.toThrow('Response status: 403')
    })

    it('should throw Error with responseError', async () => {
      const cf_zone_id = '0890d49c7ecd89e4abef674d77b2e766'
      const cf_api_token = 'WKZDG_1owHLAWSasxxHyObz1zWH2aBdac9s0X4955'
      const ruleset_id = '0890d49c7ecd89e4abef674d77b2e766'
      const rule_id = '0890d49c7ecd89e4abef674d77b2e766'

      jest.spyOn(global, 'fetch').mockResolvedValue(
        Promise.resolve({
          ok: true,
          status: 200,
          json: async () => Promise.resolve(responseError)
        }) as Promise<Response>
      )

      await expect(
        delete_custom_zone_rule(cf_zone_id, cf_api_token, ruleset_id, rule_id)
      ).rejects.toThrow(JSON.stringify(responseError.errors, null, 2))
    })

    it('should throw Error with responseMessage', async () => {
      const cf_zone_id = '0890d49c7ecd89e4abef674d77b2e766'
      const cf_api_token = 'WKZDG_1owHLAWSasxxHyObz1zWH2aBdac9s0X4955'
      const ruleset_id = '0890d49c7ecd89e4abef674d77b2e766'
      const rule_id = '0890d49c7ecd89e4abef674d77b2e766'

      jest.spyOn(global, 'fetch').mockResolvedValue(
        Promise.resolve({
          ok: true,
          status: 200,
          json: async () => Promise.resolve(responseMessage)
        }) as Promise<Response>
      )

      await expect(
        delete_custom_zone_rule(cf_zone_id, cf_api_token, ruleset_id, rule_id)
      ).rejects.toThrow(JSON.stringify(responseMessage.messages, null, 2))
    })

    it('should return ZoneRuleset Not found.', async () => {
      const cf_zone_id = '0890d49c7ecd89e4abef674d77b2e766'
      const cf_api_token = 'WKZDG_1owHLAWSasxxHyObz1zWH2aBdac9s0X4955'
      const ruleset_id = '0890d49c7ecd89e4abef674d77b2e766'
      const rule_id = '0890d49c7ecd89e4abef674d77b2e766'

      const response = {
        result: {},
        success: true,
        errors: [],
        messages: []
      }

      jest.spyOn(global, 'fetch').mockResolvedValue(
        Promise.resolve({
          ok: true,
          status: 200,
          json: async () => Promise.resolve(response)
        }) as Promise<Response>
      )

      await expect(
        delete_custom_zone_rule(cf_zone_id, cf_api_token, ruleset_id, rule_id)
      ).rejects.toThrow('ZoneRuleset Not found.')
    })
  })

  describe('get_lists', () => {
    it('should return lists if possible.', async () => {
      const cf_account_id = '0890d49c7ecd89e4abef674d77b2e766'
      const cf_api_token = 'WKZDG_1owHLAWSasxxHyObz1zWH2aBdac9s0X4955'

      const response = {
        result: [
          {
            id: 'b63638d093bb467a823be69f78eb6b17',
            name: 'github_actions',
            description: 'github_actions 列表',
            kind: 'ip',
            num_items: 4715,
            num_referencing_filters: 0,
            created_on: '2024-10-05T03:56:56Z',
            modified_on: '2024-10-05T08:21:07Z'
          }
        ],
        success: true,
        errors: [],
        messages: []
      }

      jest.spyOn(global, 'fetch').mockResolvedValue(
        Promise.resolve({
          ok: true,
          status: 200,
          json: async () => Promise.resolve(response)
        }) as Promise<Response>
      )

      const lists = await get_lists(cf_account_id, cf_api_token)

      expect(lists).toBeDefined()
    })

    it('should throw Error with status 403', async () => {
      const cf_account_id = '0890d49c7ecd89e4abef674d77b2e766'
      const cf_api_token = 'WKZDG_1owHLAWSasxxHyObz1zWH2aBdac9s0X4955'

      const response = {
        result: [
          {
            id: 'b63638d093bb467a823be69f78eb6b17',
            name: 'github_actions',
            description: 'github_actions 列表',
            kind: 'ip',
            num_items: 4715,
            num_referencing_filters: 0,
            created_on: '2024-10-05T03:56:56Z',
            modified_on: '2024-10-05T08:21:07Z'
          }
        ],
        success: true,
        errors: [],
        messages: []
      }

      jest.spyOn(global, 'fetch').mockResolvedValue(
        Promise.resolve({
          ok: false,
          status: 403,
          json: async () => Promise.resolve(response)
        }) as Promise<Response>
      )

      await expect(get_lists(cf_account_id, cf_api_token)).rejects.toThrow(
        'Response status: 403'
      )
    })

    it('should throw Error with responseError', async () => {
      const cf_account_id = '0890d49c7ecd89e4abef674d77b2e766'
      const cf_api_token = 'WKZDG_1owHLAWSasxxHyObz1zWH2aBdac9s0X4955'

      jest.spyOn(global, 'fetch').mockResolvedValue(
        Promise.resolve({
          ok: true,
          status: 200,
          json: async () => Promise.resolve(responseError)
        }) as Promise<Response>
      )

      await expect(get_lists(cf_account_id, cf_api_token)).rejects.toThrow(
        JSON.stringify(responseError.errors, null, 2)
      )
    })

    it('should throw Error with responseMessage', async () => {
      const cf_account_id = '0890d49c7ecd89e4abef674d77b2e766'
      const cf_api_token = 'WKZDG_1owHLAWSasxxHyObz1zWH2aBdac9s0X4955'

      jest.spyOn(global, 'fetch').mockResolvedValue(
        Promise.resolve({
          ok: true,
          status: 200,
          json: async () => Promise.resolve(responseMessage)
        }) as Promise<Response>
      )

      await expect(get_lists(cf_account_id, cf_api_token)).rejects.toThrow(
        JSON.stringify(responseMessage.messages, null, 2)
      )
    })

    it('should return Lists Not found.', async () => {
      const cf_account_id = '0890d49c7ecd89e4abef674d77b2e766'
      const cf_api_token = 'WKZDG_1owHLAWSasxxHyObz1zWH2aBdac9s0X4955'

      const response = {
        result: [],
        success: true,
        errors: [],
        messages: []
      }

      jest.spyOn(global, 'fetch').mockResolvedValue(
        Promise.resolve({
          ok: true,
          status: 200,
          json: async () => Promise.resolve(response)
        }) as Promise<Response>
      )

      await expect(get_lists(cf_account_id, cf_api_token)).rejects.toThrow(
        'Lists Not found.'
      )
    })
  })

  describe('get_list', () => {
    it('should return list if possible.', async () => {
      const cf_account_id = '0890d49c7ecd89e4abef674d77b2e766'
      const cf_api_token = 'WKZDG_1owHLAWSasxxHyObz1zWH2aBdac9s0X4955'
      const list_id = 'b63638d093bb467a823be69f78eb6b17'

      const response = {
        result: {
          id: 'b63638d093bb467a823be69f78eb6b17',
          name: 'github_actions',
          description: 'github_actions 列表',
          kind: 'ip',
          num_items: 4715,
          num_referencing_filters: 0,
          created_on: '2024-10-05T03:56:56Z',
          modified_on: '2024-10-05T08:21:07Z'
        },
        success: true,
        errors: [],
        messages: []
      }

      jest.spyOn(global, 'fetch').mockResolvedValue(
        Promise.resolve({
          ok: true,
          status: 200,
          json: async () => Promise.resolve(response)
        }) as Promise<Response>
      )

      const list = await get_list(cf_account_id, cf_api_token, list_id)

      expect(list).toBeDefined()
      expect(list.id).toEqual(list_id)
    })

    it('should throw Error with status 403', async () => {
      const cf_account_id = '0890d49c7ecd89e4abef674d77b2e766'
      const cf_api_token = 'WKZDG_1owHLAWSasxxHyObz1zWH2aBdac9s0X4955'
      const list_id = 'b63638d093bb467a823be69f78eb6b17'

      const response = {
        result: {
          id: 'b63638d093bb467a823be69f78eb6b17',
          name: 'github_actions',
          description: 'github_actions 列表',
          kind: 'ip',
          num_items: 4715,
          num_referencing_filters: 0,
          created_on: '2024-10-05T03:56:56Z',
          modified_on: '2024-10-05T08:21:07Z'
        },
        success: true,
        errors: [],
        messages: []
      }

      jest.spyOn(global, 'fetch').mockResolvedValue(
        Promise.resolve({
          ok: false,
          status: 403,
          json: async () => Promise.resolve(response)
        }) as Promise<Response>
      )

      await expect(
        get_list(cf_account_id, cf_api_token, list_id)
      ).rejects.toThrow('Response status: 403')
    })

    it('should throw Error with responseError', async () => {
      const cf_account_id = '0890d49c7ecd89e4abef674d77b2e766'
      const cf_api_token = 'WKZDG_1owHLAWSasxxHyObz1zWH2aBdac9s0X4955'
      const list_id = 'b63638d093bb467a823be69f78eb6b17'

      jest.spyOn(global, 'fetch').mockResolvedValue(
        Promise.resolve({
          ok: true,
          status: 200,
          json: async () => Promise.resolve(responseError)
        }) as Promise<Response>
      )

      await expect(
        get_list(cf_account_id, cf_api_token, list_id)
      ).rejects.toThrow(JSON.stringify(responseError.errors, null, 2))
    })

    it('should throw Error with responseMessage', async () => {
      const cf_account_id = '0890d49c7ecd89e4abef674d77b2e766'
      const cf_api_token = 'WKZDG_1owHLAWSasxxHyObz1zWH2aBdac9s0X4955'
      const list_id = 'b63638d093bb467a823be69f78eb6b17'

      jest.spyOn(global, 'fetch').mockResolvedValue(
        Promise.resolve({
          ok: true,
          status: 200,
          json: async () => Promise.resolve(responseMessage)
        }) as Promise<Response>
      )

      await expect(
        get_list(cf_account_id, cf_api_token, list_id)
      ).rejects.toThrow(JSON.stringify(responseMessage.messages, null, 2))
    })

    it('should return List Not found.', async () => {
      const cf_account_id = '0890d49c7ecd89e4abef674d77b2e766'
      const cf_api_token = 'WKZDG_1owHLAWSasxxHyObz1zWH2aBdac9s0X4955'
      const list_id = 'b63638d093bb467a823be69f78eb6b17'

      const response = {
        result: {},
        success: true,
        errors: [],
        messages: []
      }

      jest.spyOn(global, 'fetch').mockResolvedValue(
        Promise.resolve({
          ok: true,
          status: 200,
          json: async () => Promise.resolve(response)
        }) as Promise<Response>
      )

      await expect(
        get_list(cf_account_id, cf_api_token, list_id)
      ).rejects.toThrow('List Not found.')
    })
  })

  describe('create_list', () => {
    it('should return list if possible.', async () => {
      const cf_account_id = '0890d49c7ecd89e4abef674d77b2e766'
      const cf_api_token = 'WKZDG_1owHLAWSasxxHyObz1zWH2aBdac9s0X4955'

      const data = {
        name: 'github_actions_1',
        description: 'github_actions 列表1',
        kind: 'ip'
      }

      const response = {
        result: {
          id: 'dbdd50b8de13482ca51970b8ce127b63',
          name: 'github_actions_1',
          description: 'github_actions 列表1',
          kind: 'ip',
          num_items: 0,
          num_referencing_filters: 0,
          created_on: '2024-11-28T02:59:21Z',
          modified_on: '2024-11-28T02:59:21Z'
        },
        success: true,
        errors: [],
        messages: []
      }

      jest.spyOn(global, 'fetch').mockResolvedValue(
        Promise.resolve({
          ok: true,
          status: 200,
          json: async () => Promise.resolve(response)
        }) as Promise<Response>
      )

      const result = await create_list(cf_account_id, cf_api_token, data)

      expect(result).toBeDefined()
      expect(result.id).toEqual(response.result.id)
      expect(result.name).toEqual(data.name)
      expect(result.name).toEqual(response.result.name)
    })

    it('should throw Error with status 403', async () => {
      const cf_account_id = '0890d49c7ecd89e4abef674d77b2e766'
      const cf_api_token = 'WKZDG_1owHLAWSasxxHyObz1zWH2aBdac9s0X4955'

      const data = {
        name: 'github_actions_1',
        description: 'github_actions 列表1',
        kind: 'ip'
      }

      const response = {
        result: {
          id: 'dbdd50b8de13482ca51970b8ce127b63',
          name: 'github_actions_1',
          description: 'github_actions 列表1',
          kind: 'ip',
          num_items: 0,
          num_referencing_filters: 0,
          created_on: '2024-11-28T02:59:21Z',
          modified_on: '2024-11-28T02:59:21Z'
        },
        success: true,
        errors: [],
        messages: []
      }

      jest.spyOn(global, 'fetch').mockResolvedValue(
        Promise.resolve({
          ok: false,
          status: 403,
          json: async () => Promise.resolve(response)
        }) as Promise<Response>
      )

      await expect(
        create_list(cf_account_id, cf_api_token, data)
      ).rejects.toThrow('Response status: 403')
    })

    it('should throw Error with responseError', async () => {
      const cf_account_id = '0890d49c7ecd89e4abef674d77b2e766'
      const cf_api_token = 'WKZDG_1owHLAWSasxxHyObz1zWH2aBdac9s0X4955'

      const data = {
        name: 'github_actions_1',
        description: 'github_actions 列表1',
        kind: 'ip'
      }

      jest.spyOn(global, 'fetch').mockResolvedValue(
        Promise.resolve({
          ok: true,
          status: 200,
          json: async () => Promise.resolve(responseError)
        }) as Promise<Response>
      )

      await expect(
        create_list(cf_account_id, cf_api_token, data)
      ).rejects.toThrow(JSON.stringify(responseError.errors, null, 2))
    })

    it('should throw Error with responseMessage', async () => {
      const cf_account_id = '0890d49c7ecd89e4abef674d77b2e766'
      const cf_api_token = 'WKZDG_1owHLAWSasxxHyObz1zWH2aBdac9s0X4955'

      const data = {
        name: 'github_actions_1',
        description: 'github_actions 列表1',
        kind: 'ip'
      }

      jest.spyOn(global, 'fetch').mockResolvedValue(
        Promise.resolve({
          ok: true,
          status: 200,
          json: async () => Promise.resolve(responseMessage)
        }) as Promise<Response>
      )

      await expect(
        create_list(cf_account_id, cf_api_token, data)
      ).rejects.toThrow(JSON.stringify(responseMessage.messages, null, 2))
    })

    it('should return List Not found.', async () => {
      const cf_account_id = '0890d49c7ecd89e4abef674d77b2e766'
      const cf_api_token = 'WKZDG_1owHLAWSasxxHyObz1zWH2aBdac9s0X4955'

      const data = {
        name: 'github_actions_1',
        description: 'github_actions 列表1',
        kind: 'ip'
      }

      const response = {
        result: {},
        success: true,
        errors: [],
        messages: []
      }

      jest.spyOn(global, 'fetch').mockResolvedValue(
        Promise.resolve({
          ok: true,
          status: 200,
          json: async () => Promise.resolve(response)
        }) as Promise<Response>
      )

      await expect(
        create_list(cf_account_id, cf_api_token, data)
      ).rejects.toThrow('List Not found.')
    })
  })

  describe('update_list', () => {
    it('should return list if possible.', async () => {
      const cf_account_id = '0890d49c7ecd89e4abef674d77b2e766'
      const cf_api_token = 'WKZDG_1owHLAWSasxxHyObz1zWH2aBdac9s0X4955'
      const list_id = 'dbdd50b8de13482ca51970b8ce127b63'

      const data = {
        description: 'github_actions 列表1'
      }

      const response = {
        result: {
          id: 'dbdd50b8de13482ca51970b8ce127b63',
          name: 'github_actions_1',
          description: 'github_actions 列表1',
          kind: 'ip',
          num_items: 0,
          num_referencing_filters: 0,
          created_on: '2024-11-28T02:59:21Z',
          modified_on: '2024-11-28T02:59:21Z'
        },
        success: true,
        errors: [],
        messages: []
      }

      jest.spyOn(global, 'fetch').mockResolvedValue(
        Promise.resolve({
          ok: true,
          status: 200,
          json: async () => Promise.resolve(response)
        }) as Promise<Response>
      )

      const result = await update_list(
        cf_account_id,
        cf_api_token,
        list_id,
        data
      )

      expect(result).toBeDefined()
      expect(result.id).toEqual(response.result.id)
      expect(result.description).toEqual(data.description)
      expect(result.description).toEqual(response.result.description)
    })

    it('should throw Error with status 403', async () => {
      const cf_account_id = '0890d49c7ecd89e4abef674d77b2e766'
      const cf_api_token = 'WKZDG_1owHLAWSasxxHyObz1zWH2aBdac9s0X4955'
      const list_id = 'dbdd50b8de13482ca51970b8ce127b63'

      const data = {
        description: 'github_actions 列表1'
      }

      const response = {
        result: {
          id: 'dbdd50b8de13482ca51970b8ce127b63',
          name: 'github_actions_1',
          description: 'github_actions 列表1',
          kind: 'ip',
          num_items: 0,
          num_referencing_filters: 0,
          created_on: '2024-11-28T02:59:21Z',
          modified_on: '2024-11-28T02:59:21Z'
        },
        success: true,
        errors: [],
        messages: []
      }

      jest.spyOn(global, 'fetch').mockResolvedValue(
        Promise.resolve({
          ok: false,
          status: 403,
          json: async () => Promise.resolve(response)
        }) as Promise<Response>
      )

      await expect(
        update_list(cf_account_id, cf_api_token, list_id, data)
      ).rejects.toThrow('Response status: 403')
    })

    it('should throw Error with responseError', async () => {
      const cf_account_id = '0890d49c7ecd89e4abef674d77b2e766'
      const cf_api_token = 'WKZDG_1owHLAWSasxxHyObz1zWH2aBdac9s0X4955'
      const list_id = 'dbdd50b8de13482ca51970b8ce127b63'

      const data = {
        description: 'github_actions 列表1'
      }

      jest.spyOn(global, 'fetch').mockResolvedValue(
        Promise.resolve({
          ok: true,
          status: 200,
          json: async () => Promise.resolve(responseError)
        }) as Promise<Response>
      )

      await expect(
        update_list(cf_account_id, cf_api_token, list_id, data)
      ).rejects.toThrow(JSON.stringify(responseError.errors, null, 2))
    })

    it('should throw Error with responseMessage', async () => {
      const cf_account_id = '0890d49c7ecd89e4abef674d77b2e766'
      const cf_api_token = 'WKZDG_1owHLAWSasxxHyObz1zWH2aBdac9s0X4955'
      const list_id = 'dbdd50b8de13482ca51970b8ce127b63'

      const data = {
        description: 'github_actions 列表1'
      }

      jest.spyOn(global, 'fetch').mockResolvedValue(
        Promise.resolve({
          ok: true,
          status: 200,
          json: async () => Promise.resolve(responseMessage)
        }) as Promise<Response>
      )

      await expect(
        update_list(cf_account_id, cf_api_token, list_id, data)
      ).rejects.toThrow(JSON.stringify(responseMessage.messages, null, 2))
    })

    it('should return List Not found.', async () => {
      const cf_account_id = '0890d49c7ecd89e4abef674d77b2e766'
      const cf_api_token = 'WKZDG_1owHLAWSasxxHyObz1zWH2aBdac9s0X4955'
      const list_id = 'dbdd50b8de13482ca51970b8ce127b63'

      const data = {
        description: 'github_actions 列表1'
      }

      const response = {
        result: {},
        success: true,
        errors: [],
        messages: []
      }

      jest.spyOn(global, 'fetch').mockResolvedValue(
        Promise.resolve({
          ok: true,
          status: 200,
          json: async () => Promise.resolve(response)
        }) as Promise<Response>
      )

      await expect(
        update_list(cf_account_id, cf_api_token, list_id, data)
      ).rejects.toThrow('List Not found.')
    })
  })

  describe('delete_list', () => {
    it('should return list if possible.', async () => {
      const cf_account_id = '0890d49c7ecd89e4abef674d77b2e766'
      const cf_api_token = 'WKZDG_1owHLAWSasxxHyObz1zWH2aBdac9s0X4955'
      const list_id = 'dbdd50b8de13482ca51970b8ce127b63'

      const response = {
        result: {
          id: 'dbdd50b8de13482ca51970b8ce127b63'
        },
        success: true,
        errors: [],
        messages: []
      }

      jest.spyOn(global, 'fetch').mockResolvedValue(
        Promise.resolve({
          ok: true,
          status: 200,
          json: async () => Promise.resolve(response)
        }) as Promise<Response>
      )

      const result = await delete_list(cf_account_id, cf_api_token, list_id)

      expect(result).toBeDefined()
      expect(result.id).toEqual(response.result.id)
    })

    it('should throw Error with status 403', async () => {
      const cf_account_id = '0890d49c7ecd89e4abef674d77b2e766'
      const cf_api_token = 'WKZDG_1owHLAWSasxxHyObz1zWH2aBdac9s0X4955'
      const list_id = 'dbdd50b8de13482ca51970b8ce127b63'

      const response = {
        result: {
          id: 'dbdd50b8de13482ca51970b8ce127b63'
        },
        success: true,
        errors: [],
        messages: []
      }

      jest.spyOn(global, 'fetch').mockResolvedValue(
        Promise.resolve({
          ok: false,
          status: 403,
          json: async () => Promise.resolve(response)
        }) as Promise<Response>
      )

      await expect(
        delete_list(cf_account_id, cf_api_token, list_id)
      ).rejects.toThrow('Response status: 403')
    })

    it('should throw Error with responseError', async () => {
      const cf_account_id = '0890d49c7ecd89e4abef674d77b2e766'
      const cf_api_token = 'WKZDG_1owHLAWSasxxHyObz1zWH2aBdac9s0X4955'
      const list_id = 'dbdd50b8de13482ca51970b8ce127b63'

      jest.spyOn(global, 'fetch').mockResolvedValue(
        Promise.resolve({
          ok: true,
          status: 200,
          json: async () => Promise.resolve(responseError)
        }) as Promise<Response>
      )

      await expect(
        delete_list(cf_account_id, cf_api_token, list_id)
      ).rejects.toThrow(JSON.stringify(responseError.errors, null, 2))
    })

    it('should throw Error with responseMessage', async () => {
      const cf_account_id = '0890d49c7ecd89e4abef674d77b2e766'
      const cf_api_token = 'WKZDG_1owHLAWSasxxHyObz1zWH2aBdac9s0X4955'
      const list_id = 'dbdd50b8de13482ca51970b8ce127b63'

      jest.spyOn(global, 'fetch').mockResolvedValue(
        Promise.resolve({
          ok: true,
          status: 200,
          json: async () => Promise.resolve(responseMessage)
        }) as Promise<Response>
      )

      await expect(
        delete_list(cf_account_id, cf_api_token, list_id)
      ).rejects.toThrow(JSON.stringify(responseMessage.messages, null, 2))
    })

    it('should return List Not found.', async () => {
      const cf_account_id = '0890d49c7ecd89e4abef674d77b2e766'
      const cf_api_token = 'WKZDG_1owHLAWSasxxHyObz1zWH2aBdac9s0X4955'
      const list_id = 'dbdd50b8de13482ca51970b8ce127b63'

      const response = {
        result: {},
        success: true,
        errors: [],
        messages: []
      }

      jest.spyOn(global, 'fetch').mockResolvedValue(
        Promise.resolve({
          ok: true,
          status: 200,
          json: async () => Promise.resolve(response)
        }) as Promise<Response>
      )

      await expect(
        delete_list(cf_account_id, cf_api_token, list_id)
      ).rejects.toThrow('List Not found.')
    })
  })

  describe('get_list_items', () => {
    it('should return list with items if possible.', async () => {
      const cf_account_id = '0890d49c7ecd89e4abef674d77b2e766'
      const cf_api_token = 'WKZDG_1owHLAWSasxxHyObz1zWH2aBdac9s0X4955'
      const list_id = 'b63638d093bb467a823be69f78eb6b17'

      const response = {
        result: [
          {
            id: '86d3217978564a09a730e1fcdefab46b',
            ip: '1.1.1.1',
            comment: 'Github Actions (Snowdream Tech Test)',
            created_on: '2024-11-29T06:34:42Z',
            modified_on: '2024-11-29T06:34:42Z'
          }
        ],
        success: true,
        errors: [],
        messages: [],
        result_info: {
          cursors: {
            after: 'Ntw1mvZWGHjCasEPQyhOpEeSsusfx_4TMtrsV9BpaMm5txqKOn89bwBfUWw'
          }
        }
      }

      jest.spyOn(global, 'fetch').mockResolvedValue(
        Promise.resolve({
          ok: true,
          status: 200,
          json: async () => Promise.resolve(response)
        }) as Promise<Response>
      )

      const list = await get_list_items(cf_account_id, cf_api_token, list_id)

      expect(list).toBeDefined()
    })

    it('should throw Error with status 403', async () => {
      const cf_account_id = '0890d49c7ecd89e4abef674d77b2e766'
      const cf_api_token = 'WKZDG_1owHLAWSasxxHyObz1zWH2aBdac9s0X4955'
      const list_id = 'b63638d093bb467a823be69f78eb6b17'

      const response = {
        result: [
          {
            id: '86d3217978564a09a730e1fcdefab46b',
            ip: '1.1.1.1',
            comment: 'Github Actions (Snowdream Tech Test)',
            created_on: '2024-11-29T06:34:42Z',
            modified_on: '2024-11-29T06:34:42Z'
          }
        ],
        success: true,
        errors: [],
        messages: [],
        result_info: {
          cursors: {
            after: 'Ntw1mvZWGHjCasEPQyhOpEeSsusfx_4TMtrsV9BpaMm5txqKOn89bwBfUWw'
          }
        }
      }

      jest.spyOn(global, 'fetch').mockResolvedValue(
        Promise.resolve({
          ok: false,
          status: 403,
          json: async () => Promise.resolve(response)
        }) as Promise<Response>
      )

      await expect(
        get_list_items(cf_account_id, cf_api_token, list_id)
      ).rejects.toThrow('Response status: 403')
    })

    it('should throw Error with responseError', async () => {
      const cf_account_id = '0890d49c7ecd89e4abef674d77b2e766'
      const cf_api_token = 'WKZDG_1owHLAWSasxxHyObz1zWH2aBdac9s0X4955'
      const list_id = 'b63638d093bb467a823be69f78eb6b17'

      jest.spyOn(global, 'fetch').mockResolvedValue(
        Promise.resolve({
          ok: true,
          status: 200,
          json: async () => Promise.resolve(responseError)
        }) as Promise<Response>
      )

      await expect(
        get_list_items(cf_account_id, cf_api_token, list_id)
      ).rejects.toThrow(JSON.stringify(responseError.errors, null, 2))
    })

    it('should throw Error with responseMessage', async () => {
      const cf_account_id = '0890d49c7ecd89e4abef674d77b2e766'
      const cf_api_token = 'WKZDG_1owHLAWSasxxHyObz1zWH2aBdac9s0X4955'
      const list_id = 'b63638d093bb467a823be69f78eb6b17'

      jest.spyOn(global, 'fetch').mockResolvedValue(
        Promise.resolve({
          ok: true,
          status: 200,
          json: async () => Promise.resolve(responseMessage)
        }) as Promise<Response>
      )

      await expect(
        get_list_items(cf_account_id, cf_api_token, list_id)
      ).rejects.toThrow(JSON.stringify(responseMessage.messages, null, 2))
    })

    it('should return List Items Not found.', async () => {
      const cf_account_id = '0890d49c7ecd89e4abef674d77b2e766'
      const cf_api_token = 'WKZDG_1owHLAWSasxxHyObz1zWH2aBdac9s0X4955'
      const list_id = 'b63638d093bb467a823be69f78eb6b17'

      const response = {
        result: undefined,
        success: true,
        errors: [],
        messages: [],
        result_info: {
          cursors: {
            after: 'Ntw1mvZWGHjCasEPQyhOpEeSsusfx_4TMtrsV9BpaMm5txqKOn89bwBfUWw'
          }
        }
      }

      jest.spyOn(global, 'fetch').mockResolvedValue(
        Promise.resolve({
          ok: true,
          status: 200,
          json: async () => Promise.resolve(response)
        }) as Promise<Response>
      )

      await expect(
        get_list_items(cf_account_id, cf_api_token, list_id)
      ).rejects.toThrow('List Items Not found.')
    })
  })

  describe('create_list_items', () => {
    it('should return done if possible.', async () => {
      const cf_account_id = '0890d49c7ecd89e4abef674d77b2e766'
      const cf_api_token = 'WKZDG_1owHLAWSasxxHyObz1zWH2aBdac9s0X4955'
      const list_id = 'b63638d093bb467a823be69f78eb6b17'

      const data = [
        {
          ip: '3.3.3.3',
          comment: '3.3.3.3'
        },
        {
          ip: '4.4.4.4',
          comment: '4.4.4.4'
        }
      ]
      const response = {
        result: {
          operation_id: '347f0f150bd24e66b0a6356e84db5198'
        },
        success: true,
        errors: [],
        messages: []
      }

      jest.spyOn(global, 'fetch').mockResolvedValue(
        Promise.resolve({
          ok: true,
          status: 200,
          json: async () => Promise.resolve(response)
        }) as Promise<Response>
      )

      const result = await create_list_items(
        cf_account_id,
        cf_api_token,
        list_id,
        data
      )

      expect(result).toBeDefined()
      expect(result).toEqual('done')
    })

    it('should throw Error with status 403', async () => {
      const cf_account_id = '0890d49c7ecd89e4abef674d77b2e766'
      const cf_api_token = 'WKZDG_1owHLAWSasxxHyObz1zWH2aBdac9s0X4955'
      const list_id = 'b63638d093bb467a823be69f78eb6b17'

      const data = [
        {
          ip: '3.3.3.3',
          comment: '3.3.3.3'
        },
        {
          ip: '4.4.4.4',
          comment: '4.4.4.4'
        }
      ]
      const response = {
        result: {
          operation_id: '347f0f150bd24e66b0a6356e84db5198'
        },
        success: true,
        errors: [],
        messages: []
      }

      jest.spyOn(global, 'fetch').mockResolvedValue(
        Promise.resolve({
          ok: false,
          status: 403,
          json: async () => Promise.resolve(response)
        }) as Promise<Response>
      )

      await expect(
        create_list_items(cf_account_id, cf_api_token, list_id, data)
      ).rejects.toThrow('Response status: 403')
    })

    it('should throw Error with responseError', async () => {
      const cf_account_id = '0890d49c7ecd89e4abef674d77b2e766'
      const cf_api_token = 'WKZDG_1owHLAWSasxxHyObz1zWH2aBdac9s0X4955'
      const list_id = 'b63638d093bb467a823be69f78eb6b17'

      const data = [
        {
          ip: '3.3.3.3',
          comment: '3.3.3.3'
        },
        {
          ip: '4.4.4.4',
          comment: '4.4.4.4'
        }
      ]

      jest.spyOn(global, 'fetch').mockResolvedValue(
        Promise.resolve({
          ok: true,
          status: 200,
          json: async () => Promise.resolve(responseError)
        }) as Promise<Response>
      )

      await expect(
        create_list_items(cf_account_id, cf_api_token, list_id, data)
      ).rejects.toThrow(JSON.stringify(responseError.errors, null, 2))
    })

    it('should throw Error with responseMessage', async () => {
      const cf_account_id = '0890d49c7ecd89e4abef674d77b2e766'
      const cf_api_token = 'WKZDG_1owHLAWSasxxHyObz1zWH2aBdac9s0X4955'
      const list_id = 'b63638d093bb467a823be69f78eb6b17'

      const data = [
        {
          ip: '3.3.3.3',
          comment: '3.3.3.3'
        },
        {
          ip: '4.4.4.4',
          comment: '4.4.4.4'
        }
      ]

      jest.spyOn(global, 'fetch').mockResolvedValue(
        Promise.resolve({
          ok: true,
          status: 200,
          json: async () => Promise.resolve(responseMessage)
        }) as Promise<Response>
      )

      await expect(
        create_list_items(cf_account_id, cf_api_token, list_id, data)
      ).rejects.toThrow(JSON.stringify(responseMessage.messages, null, 2))
    })

    it('should throw Error with Response Or Result Not found.', async () => {
      const cf_account_id = '0890d49c7ecd89e4abef674d77b2e766'
      const cf_api_token = 'WKZDG_1owHLAWSasxxHyObz1zWH2aBdac9s0X4955'
      const list_id = 'b63638d093bb467a823be69f78eb6b17'

      const data = [
        {
          ip: '3.3.3.3',
          comment: '3.3.3.3'
        },
        {
          ip: '4.4.4.4',
          comment: '4.4.4.4'
        }
      ]

      const response = {
        result: undefined,
        success: true,
        errors: [],
        messages: []
      }

      jest.spyOn(global, 'fetch').mockResolvedValue(
        Promise.resolve({
          ok: true,
          status: 200,
          json: async () => Promise.resolve(response)
        }) as Promise<Response>
      )

      await expect(
        create_list_items(cf_account_id, cf_api_token, list_id, data)
      ).rejects.toThrow('Response Or Result Not found.')
    })
  })

  describe('update_all_list_items', () => {
    it('should return done if possible.', async () => {
      const cf_account_id = '0890d49c7ecd89e4abef674d77b2e766'
      const cf_api_token = 'WKZDG_1owHLAWSasxxHyObz1zWH2aBdac9s0X4955'
      const list_id = 'b63638d093bb467a823be69f78eb6b17'

      const data = [
        {
          ip: '3.3.3.3',
          comment: '3.3.3.3'
        },
        {
          ip: '4.4.4.4',
          comment: '4.4.4.4'
        }
      ]
      const response = {
        result: {
          operation_id: '347f0f150bd24e66b0a6356e84db5198'
        },
        success: true,
        errors: [],
        messages: []
      }

      jest.spyOn(global, 'fetch').mockResolvedValue(
        Promise.resolve({
          ok: true,
          status: 200,
          json: async () => Promise.resolve(response)
        }) as Promise<Response>
      )

      const result = await update_all_list_items(
        cf_account_id,
        cf_api_token,
        list_id,
        data
      )

      expect(result).toBeDefined()
      expect(result).toEqual('done')
    })

    it('should throw Error with status 403', async () => {
      const cf_account_id = '0890d49c7ecd89e4abef674d77b2e766'
      const cf_api_token = 'WKZDG_1owHLAWSasxxHyObz1zWH2aBdac9s0X4955'
      const list_id = 'b63638d093bb467a823be69f78eb6b17'

      const data = [
        {
          ip: '3.3.3.3',
          comment: '3.3.3.3'
        },
        {
          ip: '4.4.4.4',
          comment: '4.4.4.4'
        }
      ]
      const response = {
        result: {
          operation_id: '347f0f150bd24e66b0a6356e84db5198'
        },
        success: true,
        errors: [],
        messages: []
      }

      jest.spyOn(global, 'fetch').mockResolvedValue(
        Promise.resolve({
          ok: false,
          status: 403,
          json: async () => Promise.resolve(response)
        }) as Promise<Response>
      )

      await expect(
        update_all_list_items(cf_account_id, cf_api_token, list_id, data)
      ).rejects.toThrow('Response status: 403')
    })

    it('should throw Error with responseError', async () => {
      const cf_account_id = '0890d49c7ecd89e4abef674d77b2e766'
      const cf_api_token = 'WKZDG_1owHLAWSasxxHyObz1zWH2aBdac9s0X4955'
      const list_id = 'b63638d093bb467a823be69f78eb6b17'

      const data = [
        {
          ip: '3.3.3.3',
          comment: '3.3.3.3'
        },
        {
          ip: '4.4.4.4',
          comment: '4.4.4.4'
        }
      ]

      jest.spyOn(global, 'fetch').mockResolvedValue(
        Promise.resolve({
          ok: true,
          status: 200,
          json: async () => Promise.resolve(responseError)
        }) as Promise<Response>
      )

      await expect(
        update_all_list_items(cf_account_id, cf_api_token, list_id, data)
      ).rejects.toThrow(JSON.stringify(responseError.errors, null, 2))
    })

    it('should throw Error with responseMessage', async () => {
      const cf_account_id = '0890d49c7ecd89e4abef674d77b2e766'
      const cf_api_token = 'WKZDG_1owHLAWSasxxHyObz1zWH2aBdac9s0X4955'
      const list_id = 'b63638d093bb467a823be69f78eb6b17'

      const data = [
        {
          ip: '3.3.3.3',
          comment: '3.3.3.3'
        },
        {
          ip: '4.4.4.4',
          comment: '4.4.4.4'
        }
      ]

      jest.spyOn(global, 'fetch').mockResolvedValue(
        Promise.resolve({
          ok: true,
          status: 200,
          json: async () => Promise.resolve(responseMessage)
        }) as Promise<Response>
      )

      await expect(
        update_all_list_items(cf_account_id, cf_api_token, list_id, data)
      ).rejects.toThrow(JSON.stringify(responseMessage.messages, null, 2))
    })

    it('should throw Error with Response Or Result Not found.', async () => {
      const cf_account_id = '0890d49c7ecd89e4abef674d77b2e766'
      const cf_api_token = 'WKZDG_1owHLAWSasxxHyObz1zWH2aBdac9s0X4955'
      const list_id = 'b63638d093bb467a823be69f78eb6b17'

      const data = [
        {
          ip: '3.3.3.3',
          comment: '3.3.3.3'
        },
        {
          ip: '4.4.4.4',
          comment: '4.4.4.4'
        }
      ]
      const response = {
        result: undefined,
        success: true,
        errors: [],
        messages: []
      }

      jest.spyOn(global, 'fetch').mockResolvedValue(
        Promise.resolve({
          ok: true,
          status: 200,
          json: async () => Promise.resolve(response)
        }) as Promise<Response>
      )

      await expect(
        update_all_list_items(cf_account_id, cf_api_token, list_id, data)
      ).rejects.toThrow('Response Or Result Not found.')
    })
  })

  describe('delete_list_items', () => {
    it('should return list if possible.', async () => {
      const cf_account_id = '0890d49c7ecd89e4abef674d77b2e766'
      const cf_api_token = 'WKZDG_1owHLAWSasxxHyObz1zWH2aBdac9s0X4955'
      const list_id = 'dbdd50b8de13482ca51970b8ce127b63'

      const data = {
        items: [
          {
            id: '954730a06fae437fb2dd13d74d412ee6'
          },
          {
            id: '15d1d989c93f44b8b144ea244394fb17'
          }
        ]
      }

      const response = {
        result: {
          operation_id: '82507eae7abf480ca893612609b74205'
        },
        success: true,
        errors: [],
        messages: []
      }

      jest.spyOn(global, 'fetch').mockResolvedValue(
        Promise.resolve({
          ok: true,
          status: 200,
          json: async () => Promise.resolve(response)
        }) as Promise<Response>
      )

      const result = await delete_list_items(
        cf_account_id,
        cf_api_token,
        list_id,
        data
      )

      expect(result).toBeDefined()
    })

    it('should throw Error with status 403', async () => {
      const cf_account_id = '0890d49c7ecd89e4abef674d77b2e766'
      const cf_api_token = 'WKZDG_1owHLAWSasxxHyObz1zWH2aBdac9s0X4955'
      const list_id = 'dbdd50b8de13482ca51970b8ce127b63'

      const data = {
        items: [
          {
            id: '954730a06fae437fb2dd13d74d412ee6'
          },
          {
            id: '15d1d989c93f44b8b144ea244394fb17'
          }
        ]
      }

      const response = {
        result: {
          operation_id: '82507eae7abf480ca893612609b74205'
        },
        success: true,
        errors: [],
        messages: []
      }

      jest.spyOn(global, 'fetch').mockResolvedValue(
        Promise.resolve({
          ok: false,
          status: 403,
          json: async () => Promise.resolve(response)
        }) as Promise<Response>
      )

      await expect(
        delete_list_items(cf_account_id, cf_api_token, list_id, data)
      ).rejects.toThrow('Response status: 403')
    })

    it('should throw Error with responseError', async () => {
      const cf_account_id = '0890d49c7ecd89e4abef674d77b2e766'
      const cf_api_token = 'WKZDG_1owHLAWSasxxHyObz1zWH2aBdac9s0X4955'
      const list_id = 'dbdd50b8de13482ca51970b8ce127b63'

      const data = {
        items: [
          {
            id: '954730a06fae437fb2dd13d74d412ee6'
          },
          {
            id: '15d1d989c93f44b8b144ea244394fb17'
          }
        ]
      }

      jest.spyOn(global, 'fetch').mockResolvedValue(
        Promise.resolve({
          ok: true,
          status: 200,
          json: async () => Promise.resolve(responseError)
        }) as Promise<Response>
      )

      await expect(
        delete_list_items(cf_account_id, cf_api_token, list_id, data)
      ).rejects.toThrow(JSON.stringify(responseError.errors, null, 2))
    })

    it('should throw Error with responseMessage', async () => {
      const cf_account_id = '0890d49c7ecd89e4abef674d77b2e766'
      const cf_api_token = 'WKZDG_1owHLAWSasxxHyObz1zWH2aBdac9s0X4955'
      const list_id = 'dbdd50b8de13482ca51970b8ce127b63'

      const data = {
        items: [
          {
            id: '954730a06fae437fb2dd13d74d412ee6'
          },
          {
            id: '15d1d989c93f44b8b144ea244394fb17'
          }
        ]
      }

      jest.spyOn(global, 'fetch').mockResolvedValue(
        Promise.resolve({
          ok: true,
          status: 200,
          json: async () => Promise.resolve(responseMessage)
        }) as Promise<Response>
      )

      await expect(
        delete_list_items(cf_account_id, cf_api_token, list_id, data)
      ).rejects.toThrow(JSON.stringify(responseMessage.messages, null, 2))
    })

    it('should throw Error with Response Or Result Not found.', async () => {
      const cf_account_id = '0890d49c7ecd89e4abef674d77b2e766'
      const cf_api_token = 'WKZDG_1owHLAWSasxxHyObz1zWH2aBdac9s0X4955'
      const list_id = 'dbdd50b8de13482ca51970b8ce127b63'

      const data = {
        items: [
          {
            id: '954730a06fae437fb2dd13d74d412ee6'
          },
          {
            id: '15d1d989c93f44b8b144ea244394fb17'
          }
        ]
      }

      const response = {
        result: undefined,
        success: true,
        errors: [],
        messages: []
      }

      jest.spyOn(global, 'fetch').mockResolvedValue(
        Promise.resolve({
          ok: true,
          status: 200,
          json: async () => Promise.resolve(response)
        }) as Promise<Response>
      )

      await expect(
        delete_list_items(cf_account_id, cf_api_token, list_id, data)
      ).rejects.toThrow('Response Or Result Not found.')
    })
  })
})
