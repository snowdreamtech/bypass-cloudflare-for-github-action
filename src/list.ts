import * as core from '@actions/core'

import {
  get_custom_zone_rulesets_id,
  get_custom_zone_ruleset,
  create_custom_zone_rule,
  update_custom_zone_rule,
  get_lists,
  create_list_items,
  update_all_list_items,
  create_list,
  ZoneRule,
  ListsResultMeta
} from './cloudflare'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(ip: string | Array<string>): Promise<void> {
  try {
    const cf_zone_id: string = core.getInput('cf_zone_id')
    const cf_api_token: string = core.getInput('cf_api_token')
    const cf_account_id: string = core.getInput('cf_account_id')

    let list_rule_description: string = core.getInput('list_rule_description')
    let list_name: string = core.getInput('list_name')

    if (!cf_zone_id) {
      throw new Error('cf_zone_id is empty')
    }

    if (!cf_api_token) {
      throw new Error('cf_api_token is empty')
    }

    if (!cf_account_id) {
      throw new Error('cf_account_id is empty')
    }

    if (!list_rule_description) {
      list_rule_description = 'Bypass Cloudflare for GitHub Action (List)'
    }

    if (!list_name) {
      list_name = 'github_actions_runners'
    }

    // get account lists
    core.info('Getting account lists')
    const lists = await get_lists(cf_account_id, cf_api_token)

    // get the list with the list_name
    let list: ListsResultMeta | undefined

    for (let i = 0; i < lists.length; ++i) {
      if (lists[i].name == list_name) {
        list = lists[i]
      }
    }

    // get the custom zone rules
    core.info('Adding IP of the github action runner to the list')
    if (!list) {
      const data = {
        name: list_name,
        description: list_name,
        kind: 'ip'
      }

      list = await create_list(cf_account_id, cf_api_token, data)
    }

    let data: any = []

    if (Array.isArray(ip)) {
      for (let item of ip) {
        data.push({
          ip: item
        })
      }
    } else {
      data.push({
        ip: ip
      })
    }

    await create_list_items(cf_account_id, cf_api_token, list.id, data)

    // get the custom zone rulesets id
    core.info('Getting the custom zone rulesets id')
    const zone_custom_rulesets_id = await get_custom_zone_rulesets_id(
      cf_zone_id,
      cf_api_token
    )

    // get the custom zone ruleset
    core.info('Getting the custom zone ruleset')
    const zone_custom_ruleset = await get_custom_zone_ruleset(
      cf_zone_id,
      cf_api_token,
      zone_custom_rulesets_id
    )
    // get the custom zone rules
    core.info('Getting the custom zone rules')
    const zone_custom_rules = zone_custom_ruleset.rules

    let listzonerule: any

    for (let i = 0; i < zone_custom_rules.length; ++i) {
      const zonerule = zone_custom_rules[i]

      if (zonerule.description == list_rule_description) {
        listzonerule = zonerule
      }
    }

    // get the custom zone rules
    core.info('Adding IP of the github action runner to the custom zone rules')
    if (listzonerule) {
      await update_custom_zone_rule(
        cf_zone_id,
        cf_api_token,
        zone_custom_rulesets_id,
        listzonerule.id,
        listzonerule
      )
    } else {
      const data = {
        action: 'skip',
        expression: `(ip.src in \$$list_name)`,
        description: `${list_rule_description}`,
        enabled: true,
        logging: {
          enabled: true
        },
        action_parameters: {
          response: {
            content:
              '{\n  "success": false,\n  "error": "you have been blocked"\n}',
            content_type: 'application/json',
            status_code: 400
          },
          ruleset: 'current',
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
          ]
        }
      }

      await create_custom_zone_rule(
        cf_zone_id,
        cf_api_token,
        zone_custom_rulesets_id,
        data
      )
    }

    // Set outputs for other workflow steps to use
    core.setOutput('time', new Date().toTimeString())
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function clean(ip: string | Array<string>): Promise<void> {
  try {
    const cf_zone_id: string = core.getInput('cf_zone_id')
    const cf_api_token: string = core.getInput('cf_api_token')
    const cf_account_id: string = core.getInput('cf_account_id')

    let list_rule_description: string = core.getInput('list_rule_description')
    let list_name: string = core.getInput('list_name')

    if (!cf_zone_id) {
      throw new Error('cf_zone_id is empty')
    }

    if (!cf_api_token) {
      throw new Error('cf_api_token is empty')
    }

    if (!cf_account_id) {
      throw new Error('cf_account_id is empty')
    }

    if (!list_rule_description) {
      list_rule_description = 'Bypass Cloudflare for GitHub Action (List)'
    }

    if (!list_name) {
      list_name = 'github_actions_runners'
    }

    // get account lists
    core.info('Getting account lists')
    const lists = await get_lists(cf_account_id, cf_api_token)

    // get the list with the list_name
    let list: ListsResultMeta | undefined

    for (let i = 0; i < lists.length; ++i) {
      if (lists[i].name == list_name) {
        list = lists[i]
      }
    }

    // get the custom zone rules
    core.info('Adding IP of the github action runner to the list')
    if (!list) {
      const data = {
        name: list_name,
        description: list_name,
        kind: 'ip'
      }

      list = await create_list(cf_account_id, cf_api_token, data)
    }

    let data: any = []

    await update_all_list_items(cf_account_id, cf_api_token, list.id, data)

    // get the custom zone rulesets id
    core.info('Getting the custom zone rulesets id')
    const zone_custom_rulesets_id = await get_custom_zone_rulesets_id(
      cf_zone_id,
      cf_api_token
    )

    // get the custom zone ruleset
    core.info('Getting the custom zone ruleset')
    const zone_custom_ruleset = await get_custom_zone_ruleset(
      cf_zone_id,
      cf_api_token,
      zone_custom_rulesets_id
    )
    // get the custom zone rules
    core.info('Getting the custom zone rules')
    const zone_custom_rules = zone_custom_ruleset.rules

    let listzonerule: any

    for (let i = 0; i < zone_custom_rules.length; ++i) {
      const zonerule = zone_custom_rules[i]

      if (zonerule.description == list_rule_description) {
        listzonerule = zonerule
      }
    }

    // get the custom zone rules
    core.info('Adding IP of the github action runner to the custom zone rules')
    if (listzonerule) {
      await update_custom_zone_rule(
        cf_zone_id,
        cf_api_token,
        zone_custom_rulesets_id,
        listzonerule.id,
        listzonerule
      )
    } else {
      const data = {
        action: 'skip',
        expression: `(ip.src in \$$list_name)`,
        description: `${list_rule_description}`,
        enabled: true,
        logging: {
          enabled: true
        },
        action_parameters: {
          response: {
            content:
              '{\n  "success": false,\n  "error": "you have been blocked"\n}',
            content_type: 'application/json',
            status_code: 400
          },
          ruleset: 'current',
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
          ]
        }
      }

      await create_custom_zone_rule(
        cf_zone_id,
        cf_api_token,
        zone_custom_rulesets_id,
        data
      )
    }

    // Set outputs for other workflow steps to use
    core.setOutput('time', new Date().toTimeString())
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}