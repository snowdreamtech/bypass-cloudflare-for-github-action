import * as core from '@actions/core'

import {
  get_custom_zone_rulesets_id,
  get_custom_zone_ruleset,
  create_custom_zone_rule,
  update_custom_zone_rule,
  ZoneRule
} from './cloudflare'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(ip: string): Promise<void> {
  try {
    const cf_zone_id: string = core.getInput('cf_zone_id')
    const cf_api_token: string = core.getInput('cf_api_token')
    const cf_account_id: string = core.getInput('cf_account_id')

    let single_rule_description: string = core.getInput(
      'single_rule_description'
    )

    if (!cf_zone_id) {
      throw new Error('cf_zone_id is empty')
    }

    if (!cf_api_token) {
      throw new Error('cf_api_token is empty')
    }

    if (!cf_account_id) {
      throw new Error('cf_account_id is empty')
    }

    if (!single_rule_description) {
      single_rule_description = 'Bypass Cloudflare for GitHub Action (Single)'
    }

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

    let singlezonerule: ZoneRule

    for (const zonerule of zone_custom_rules) {
      if (zonerule.description == single_rule_description) {
        // update expression
        let expression = zonerule.expression

        if (!expression) {
          expression = `(ip.src eq ${ip})`
        } else {
          if (!expression.includes(ip)) {
            expression = expression + ` or (ip.src eq ${ip})`
          }
        }

        zonerule.expression = expression
        zonerule.enabled = true

        singlezonerule = zonerule
      }
    }

    // get the custom zone rules
    core.info('Adding IP of the github action runner to the custom zone rules')
    if (singlezonerule) {
      await update_custom_zone_rule(
        cf_zone_id,
        cf_api_token,
        zone_custom_rulesets_id,
        singlezonerule.id,
        singlezonerule
      )
    } else {
      const data = {
        action: 'skip',
        expression: `(ip.src eq ${ip})`,
        description: `${single_rule_description}`,
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
export async function clean(): Promise<void> {
  try {
    const cf_zone_id: string = core.getInput('cf_zone_id')
    const cf_api_token: string = core.getInput('cf_api_token')
    const cf_account_id: string = core.getInput('cf_account_id')

    let single_rule_description: string = core.getInput(
      'single_rule_description'
    )

    if (!cf_zone_id) {
      throw new Error('cf_zone_id is empty')
    }

    if (!cf_api_token) {
      throw new Error('cf_api_token is empty')
    }

    if (!cf_account_id) {
      throw new Error('cf_account_id is empty')
    }

    if (!single_rule_description) {
      single_rule_description = 'Bypass Cloudflare for GitHub Action (Single)'
    }

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

    let singlezonerule: ZoneRule

    for (const zonerule of zone_custom_rules) {
      if (zonerule.description == single_rule_description) {
        zonerule.expression = ''
        zonerule.enabled = true

        singlezonerule = zonerule
      }
    }

    // get the custom zone rules
    core.info('Adding IP of the github action runner to the custom zone rules')
    if (singlezonerule) {
      await update_custom_zone_rule(
        cf_zone_id,
        cf_api_token,
        zone_custom_rulesets_id,
        singlezonerule.id,
        singlezonerule
      )
    }

    // Set outputs for other workflow steps to use
    core.setOutput('time', new Date().toTimeString())
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
