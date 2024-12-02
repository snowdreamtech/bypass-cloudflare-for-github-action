// Define an interface for ResponseError
export interface ResponseError {
  code: number
  message: string
}

// Define an interface for ResponseMessage
export interface ResponseMessage {
  code: number
  message: string
}

// Define an interface for ResponseMeta
export interface ResponseMeta {
  success: boolean
  result: any
  messages?: ResponseMessage[]
  errors?: ResponseError[]
}

// Define an interface for ZoneRulesetsMeta
export interface ZoneRulesetsMeta {
  success: boolean
  result: ZoneRulesetsResultMeta[]
  messages?: ResponseMessage[]
  errors?: ResponseError[]
}

// Define an interface for ZoneRulesetMeta
export interface ZoneRulesetsResultMeta {
  id: string
  name: string
  description: string
  kind: string
  version: string
  last_updated: string
  phase: string
}

// Define an interface for ZoneRulesetMeta
export interface ZoneRulesetMeta {
  success: boolean
  result: ZoneRulesetResultMeta
  messages?: ResponseMessage[]
  errors?: ResponseError[]
}

// Define an interface for ZoneRulesetMeta
export interface ZoneRulesetResultMeta {
  id: string
  name: string
  description: string
  kind: string
  version: string
  last_updated: string
  phase: string
  rules: ZoneRule[]
}

// Define an interface for ZoneRule
export interface ZoneRule {
  id: string
  version: string
  action: string
  expression: string
  description: string
  last_updated: string
  ref: string
  enabled: boolean
  logging: any
  action_parameters: any
}

// Define an interface for ListsMeta
export interface ListsMeta {
  success: boolean
  result: ListsResultMeta[]
  messages?: ResponseMessage[]
  errors?: ResponseError[]
}

// Define an interface for ListMeta
export interface ListMeta {
  success: boolean
  result: ListsResultMeta
  messages?: ResponseMessage[]
  errors?: ResponseError[]
}

// Define an interface for ZoneRulesetMeta
export interface ListsResultMeta {
  id: string
  name: string
  description: string
  kind: string
  num_items: number
  num_referencing_filters: number
  created_on: Date
  modified_on: Date
}

// Define an interface for ResultInfoMeta
export interface ResultInfoMeta {
  cursors: {
    after?: string
    before?: string
  }
}

// Define an interface for ListItemsMeta
export interface ListItemsMeta {
  success: boolean
  result: ListItemResultMeta[]
  messages?: ResponseMessage[]
  errors?: ResponseError[]
  result_info: ResultInfoMeta
}

// Define an interface for ListItemResultMeta
export interface ListItemResultMeta {
  id?: string
  ip: string
  comment?: string
  created_on?: Date
  modified_on?: Date
}

/**
 * Get the public IPV4 and IPV6 for the github actions runner.
 *
 * @returns {Promise<string>} The Public IPV4 and IPV6 for the github actions runner.
 */
export async function get_custom_zone_rulesets_id(
  cf_zone_id: string,
  cf_api_token: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = `https://api.cloudflare.com/client/v4/zones/${cf_zone_id}/rulesets`

    const options = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cf_api_token}`
      }
    }

    fetch(url, options)
      .then(async response => {
        if (!response.ok) {
          reject(new Error(`Response status: ${response.status}`))
        }
        return (await response.json()) as Promise<ZoneRulesetsMeta>
      })
      .then((zonerulesetsmeta: ZoneRulesetsMeta) => {
        if (!zonerulesetsmeta.success) {
          const errors = zonerulesetsmeta.errors

          if (errors && errors.length > 0) {
            reject(new Error(JSON.stringify(errors, null, 2)))
          }

          const messages = zonerulesetsmeta.messages

          if (messages && messages.length > 0) {
            reject(new Error(JSON.stringify(messages, null, 2)))
          }
        }

        const zonerulesets = zonerulesetsmeta.result

        if (!zonerulesets || zonerulesets.length == 0) {
          reject(new Error('ZoneRulesets Not found.'))
        }

        let zone_custom_rulesets_id = ''

        for (let i = 0; i < zonerulesets.length; i++) {
          const zoneruleset = zonerulesets[i]

          if (zoneruleset.phase == 'http_request_firewall_custom') {
            zone_custom_rulesets_id = zoneruleset.id
          }
        }

        if (!zone_custom_rulesets_id) {
          reject(new Error('zone_custom_rulesets_id Not found.'))
        }

        resolve(zone_custom_rulesets_id)
      })
      .catch((error: Error) => {
        reject(error)
      })
  })
}

/**
 * Get the custom ruleset
 *
 * @returns {Promise<ZoneRulesetResultMeta>} The custom ruleset.
 */
export async function get_custom_zone_ruleset(
  cf_zone_id: string,
  cf_api_token: string,
  ruleset_id: string
): Promise<ZoneRulesetResultMeta> {
  return new Promise((resolve, reject) => {
    const url = `https://api.cloudflare.com/client/v4/zones/${cf_zone_id}/rulesets/${ruleset_id}`

    const options = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cf_api_token}`
      }
    }

    fetch(url, options)
      .then(async response => {
        if (!response.ok) {
          reject(new Error(`Response status: ${response.status}`))
        }
        return (await response.json()) as Promise<ZoneRulesetMeta>
      })
      .then((zonerulesetmeta: ZoneRulesetMeta) => {
        if (!zonerulesetmeta.success) {
          const errors = zonerulesetmeta.errors

          if (errors && errors.length > 0) {
            reject(new Error(JSON.stringify(errors, null, 2)))
          }

          const messages = zonerulesetmeta.messages

          if (messages && messages.length > 0) {
            reject(new Error(JSON.stringify(messages, null, 2)))
          }
        }

        const zoneruleset = zonerulesetmeta.result

        if (!zoneruleset || !zoneruleset.id) {
          reject(new Error('ZoneRuleset Not found.'))
        }

        resolve(zoneruleset)
      })
      .catch((error: Error) => {
        reject(error)
      })
  })
}

/**
 * Create the custom rule
 *
 * @returns {Promise<ZoneRulesetResultMeta>} The custom ruleset.
 */
export async function create_custom_zone_rule(
  cf_zone_id: string,
  cf_api_token: string,
  ruleset_id: string,
  data: any
): Promise<ZoneRulesetResultMeta> {
  return new Promise((resolve, reject) => {
    const url = `https://api.cloudflare.com/client/v4/zones/${cf_zone_id}/rulesets/${ruleset_id}/rules`

    const options = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cf_api_token}`
      },
      body: data
    }

    fetch(url, options)
      .then(async response => {
        if (!response.ok) {
          reject(new Error(`Response status: ${response.status}`))
        }
        return (await response.json()) as Promise<ZoneRulesetMeta>
      })
      .then((zonerulesetmeta: ZoneRulesetMeta) => {
        if (!zonerulesetmeta.success) {
          const errors = zonerulesetmeta.errors

          if (errors && errors.length > 0) {
            reject(new Error(JSON.stringify(errors, null, 2)))
          }

          const messages = zonerulesetmeta.messages

          if (messages && messages.length > 0) {
            reject(new Error(JSON.stringify(messages, null, 2)))
          }
        }

        const zoneruleset = zonerulesetmeta.result

        if (!zoneruleset || !zoneruleset.id) {
          reject(new Error('ZoneRuleset Not found.'))
        }

        resolve(zoneruleset)
      })
      .catch((error: Error) => {
        reject(error)
      })
  })
}

/**
 * Delete the custom rule with rule_id
 *
 * @returns {Promise<ZoneRulesetResultMeta>} The custom ruleset.
 */
export async function delete_custom_zone_rule(
  cf_zone_id: string,
  cf_api_token: string,
  ruleset_id: string,
  rule_id: string
): Promise<ZoneRulesetResultMeta> {
  return new Promise((resolve, reject) => {
    const url = `https://api.cloudflare.com/client/v4/zones/${cf_zone_id}/rulesets/${ruleset_id}/rules/${rule_id}`

    const options = {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cf_api_token}`
      }
    }

    fetch(url, options)
      .then(async response => {
        if (!response.ok) {
          reject(new Error(`Response status: ${response.status}`))
        }
        return (await response.json()) as Promise<ZoneRulesetMeta>
      })
      .then((zonerulesetmeta: ZoneRulesetMeta) => {
        if (!zonerulesetmeta.success) {
          const errors = zonerulesetmeta.errors

          if (errors && errors.length > 0) {
            reject(new Error(JSON.stringify(errors, null, 2)))
          }

          const messages = zonerulesetmeta.messages

          if (messages && messages.length > 0) {
            reject(new Error(JSON.stringify(messages, null, 2)))
          }
        }

        const zoneruleset = zonerulesetmeta.result

        if (!zoneruleset || !zoneruleset.id) {
          reject(new Error('ZoneRuleset Not found.'))
        }

        resolve(zoneruleset)
      })
      .catch((error: Error) => {
        reject(error)
      })
  })
}

/**
 * Update the custom rule with rule_id
 *
 * @returns {Promise<ZoneRulesetResultMeta>} The custom ruleset.
 */
export async function update_custom_zone_rule(
  cf_zone_id: string,
  cf_api_token: string,
  ruleset_id: string,
  rule_id: string,
  data: any
): Promise<ZoneRulesetResultMeta> {
  return new Promise((resolve, reject) => {
    const url = `https://api.cloudflare.com/client/v4/zones/${cf_zone_id}/rulesets/${ruleset_id}/rules/${rule_id}`

    const options = {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cf_api_token}`
      },
      body: data
    }

    fetch(url, options)
      .then(async response => {
        if (!response.ok) {
          reject(new Error(`Response status: ${response.status}`))
        }
        return (await response.json()) as Promise<ZoneRulesetMeta>
      })
      .then((zonerulesetmeta: ZoneRulesetMeta) => {
        if (!zonerulesetmeta.success) {
          const errors = zonerulesetmeta.errors

          if (errors && errors.length > 0) {
            reject(new Error(JSON.stringify(errors, null, 2)))
          }

          const messages = zonerulesetmeta.messages

          if (messages && messages.length > 0) {
            reject(new Error(JSON.stringify(messages, null, 2)))
          }
        }

        const zoneruleset = zonerulesetmeta.result

        if (!zoneruleset || !zoneruleset.id) {
          reject(new Error('ZoneRuleset Not found.'))
        }

        resolve(zoneruleset)
      })
      .catch((error: Error) => {
        reject(error)
      })
  })
}

/**
 * Update the custom rule with rule_id
 *
 * @returns {Promise<ZoneRulesetResultMeta>} The custom ruleset.
 */
export async function get_lists(
  cf_account_id: string,
  cf_api_token: string
): Promise<ListsResultMeta[]> {
  return new Promise((resolve, reject) => {
    const url = `https://api.cloudflare.com/client/v4/accounts/${cf_account_id}/rules/lists`

    const options = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cf_api_token}`
      }
    }

    fetch(url, options)
      .then(async response => {
        if (!response.ok) {
          reject(new Error(`Response status: ${response.status}`))
        }
        return (await response.json()) as Promise<ListsMeta>
      })
      .then((listsmeta: ListsMeta) => {
        if (!listsmeta.success) {
          const errors = listsmeta.errors

          if (errors && errors.length > 0) {
            reject(new Error(JSON.stringify(errors, null, 2)))
          }

          const messages = listsmeta.messages

          if (messages && messages.length > 0) {
            reject(new Error(JSON.stringify(messages, null, 2)))
          }
        }

        const lists = listsmeta.result

        if (!lists || lists.length == 0) {
          reject(new Error('Lists Not found.'))
        }

        resolve(lists)
      })
      .catch((error: Error) => {
        reject(error)
      })
  })
}

/**
 * Creates a new list of the specified type.
 *
 * @returns {Promise<ListsResultMeta>} The custom list.
 */
export async function create_list(
  cf_account_id: string,
  cf_api_token: string,
  data: any
): Promise<ListsResultMeta> {
  return new Promise((resolve, reject) => {
    const url = `https://api.cloudflare.com/client/v4/accounts/${cf_account_id}/rules/lists`

    const options = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cf_api_token}`
      },
      body: data
    }

    fetch(url, options)
      .then(async response => {
        if (!response.ok) {
          reject(new Error(`Response status: ${response.status}`))
        }
        return (await response.json()) as Promise<ListMeta>
      })
      .then((listmeta: ListMeta) => {
        if (!listmeta.success) {
          const errors = listmeta.errors

          if (errors && errors.length > 0) {
            reject(new Error(JSON.stringify(errors, null, 2)))
          }

          const messages = listmeta.messages

          if (messages && messages.length > 0) {
            reject(new Error(JSON.stringify(messages, null, 2)))
          }
        }

        const result = listmeta.result

        if (!result || !result.id) {
          reject(new Error('List Not found.'))
        }

        resolve(result)
      })
      .catch((error: Error) => {
        reject(error)
      })
  })
}

/**
 * Deletes a specific list and all its items.
 *
 * @returns {Promise<ListsResultMeta>}
 */
export async function delete_list(
  cf_account_id: string,
  cf_api_token: string,
  list_id: string
): Promise<ListsResultMeta> {
  return new Promise((resolve, reject) => {
    const url = `https://api.cloudflare.com/client/v4/accounts/${cf_account_id}/rules/lists/${list_id}`

    const options = {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cf_api_token}`
      }
    }

    fetch(url, options)
      .then(async response => {
        if (!response.ok) {
          reject(new Error(`Response status: ${response.status}`))
        }
        return (await response.json()) as Promise<ListMeta>
      })
      .then((listmeta: ListMeta) => {
        if (!listmeta.success) {
          const errors = listmeta.errors

          if (errors && errors.length > 0) {
            reject(new Error(JSON.stringify(errors, null, 2)))
          }

          const messages = listmeta.messages

          if (messages && messages.length > 0) {
            reject(new Error(JSON.stringify(messages, null, 2)))
          }
        }

        const result = listmeta.result

        if (!result || !result.id) {
          reject(new Error('List Not found.'))
        }

        resolve(result)
      })
      .catch((error: Error) => {
        reject(error)
      })
  })
}

/**
 * Fetches the details of a list.
 *
 * @returns {Promise<ListsResultMeta>} the details of The custom list.
 */
export async function get_list(
  cf_account_id: string,
  cf_api_token: string,
  list_id: string
): Promise<ListsResultMeta> {
  return new Promise((resolve, reject) => {
    const url = `https://api.cloudflare.com/client/v4/accounts/${cf_account_id}/rules/lists/${list_id}`

    const options = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cf_api_token}`
      }
    }

    fetch(url, options)
      .then(async response => {
        if (!response.ok) {
          reject(new Error(`Response status: ${response.status}`))
        }
        return (await response.json()) as Promise<ListMeta>
      })
      .then((listmeta: ListMeta) => {
        if (!listmeta.success) {
          const errors = listmeta.errors

          if (errors && errors.length > 0) {
            reject(new Error(JSON.stringify(errors, null, 2)))
          }

          const messages = listmeta.messages

          if (messages && messages.length > 0) {
            reject(new Error(JSON.stringify(messages, null, 2)))
          }
        }

        const list = listmeta.result

        if (!list || !list.id) {
          reject(new Error('List Not found.'))
        }

        resolve(list)
      })
      .catch((error: Error) => {
        reject(error)
      })
  })
}

/**
 * Updates the description of a list.
 *
 * @returns {Promise<ListsResultMeta>} the details of The custom list.
 */
export async function update_list(
  cf_account_id: string,
  cf_api_token: string,
  list_id: string,
  data: any
): Promise<ListsResultMeta> {
  return new Promise((resolve, reject) => {
    const url = `https://api.cloudflare.com/client/v4/accounts/${cf_account_id}/rules/lists/${list_id}`

    const options = {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cf_api_token}`
      },
      body: data
    }

    fetch(url, options)
      .then(async response => {
        if (!response.ok) {
          reject(new Error(`Response status: ${response.status}`))
        }
        return (await response.json()) as Promise<ListMeta>
      })
      .then((listmeta: ListMeta) => {
        if (!listmeta.success) {
          const errors = listmeta.errors

          if (errors && errors.length > 0) {
            reject(new Error(JSON.stringify(errors, null, 2)))
          }

          const messages = listmeta.messages

          if (messages && messages.length > 0) {
            reject(new Error(JSON.stringify(messages, null, 2)))
          }
        }

        const result = listmeta.result

        if (!result || !result.id) {
          reject(new Error('List Not found.'))
        }

        resolve(result)
      })
      .catch((error: Error) => {
        reject(error)
      })
  })
}

/**
 * Removes one or more items from a list.
 *
 * @returns {Promise<boolean>}
 */
export async function delete_list_items(
  cf_account_id: string,
  cf_api_token: string,
  list_id: string,
  data: any
): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = `https://api.cloudflare.com/client/v4/accounts/${cf_account_id}/rules/lists/${list_id}/items`

    const options = {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cf_api_token}`
      },
      body: data
    }

    fetch(url, options)
      .then(async response => {
        if (!response.ok) {
          reject(new Error(`Response status: ${response.status}`))
        }
        return (await response.json()) as Promise<ResponseMeta>
      })
      .then((responsemeta: ResponseMeta) => {
        if (!responsemeta.success) {
          const errors = responsemeta.errors

          if (errors && errors.length > 0) {
            reject(new Error(JSON.stringify(errors, null, 2)))
          }

          const messages = responsemeta.messages

          if (messages && messages.length > 0) {
            reject(new Error(JSON.stringify(messages, null, 2)))
          }
        }

        if (!responsemeta || !responsemeta.result) {
          reject(new Error('Response Or Result Not found.'))
        }

        resolve('done')
      })
      .catch((error: Error) => {
        reject(error)
      })
  })
}

/**
 * Fetches all the items in the list.
 *
 * @returns {Promise<ListsResultMeta>}  all the items in the list.
 */
export async function get_list_items(
  cf_account_id: string,
  cf_api_token: string,
  list_id: string,
  cursor = '',
  per_page = 500,
  search = ''
): Promise<ListItemResultMeta[]> {
  return new Promise((resolve, reject) => {
    const params = new URLSearchParams()

    if (!cursor) {
      params.append('cursor', cursor)
    }

    params.append('per_page', '' + per_page)

    if (!search) {
      params.append('search', '' + search)
    }

    const queryString = new URLSearchParams(params).toString()

    const url = `https://api.cloudflare.com/client/v4/accounts/${cf_account_id}/rules/lists/${list_id}/items`
    const options = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cf_api_token}`
      }
    }

    fetch(`${url}?${queryString}`, options)
      .then(async response => {
        if (!response.ok) {
          reject(new Error(`Response status: ${response.status}`))
        }
        return (await response.json()) as Promise<ListItemsMeta>
      })
      .then((listmeta: ListItemsMeta) => {
        if (!listmeta.success) {
          const errors = listmeta.errors

          if (errors && errors.length > 0) {
            reject(new Error(JSON.stringify(errors, null, 2)))
          }

          const messages = listmeta.messages

          if (messages && messages.length > 0) {
            reject(new Error(JSON.stringify(messages, null, 2)))
          }
        }

        const list = listmeta.result

        if (!list) {
          reject(new Error('List Items Not found.'))
        }

        resolve(list)
      })
      .catch((error: Error) => {
        reject(error)
      })
  })
}

/**
 * Appends new items to the list.
 *
 * @returns {Promise<boolean>}
 */
export async function create_list_items(
  cf_account_id: string,
  cf_api_token: string,
  list_id: string,
  data: any
): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = `https://api.cloudflare.com/client/v4/accounts/${cf_account_id}/rules/lists/${list_id}/items`

    const options = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cf_api_token}`
      },
      body: data
    }

    fetch(url, options)
      .then(async response => {
        if (!response.ok) {
          reject(new Error(`Response status: ${response.status}`))
        }
        return (await response.json()) as Promise<ResponseMeta>
      })
      .then((responsemeta: ResponseMeta) => {
        if (!responsemeta.success) {
          const errors = responsemeta.errors

          if (errors && errors.length > 0) {
            reject(new Error(JSON.stringify(errors, null, 2)))
          }

          const messages = responsemeta.messages

          if (messages && messages.length > 0) {
            reject(new Error(JSON.stringify(messages, null, 2)))
          }
        }

        if (!responsemeta || !responsemeta.result) {
          reject(new Error('Response Or Result Not found.'))
        }

        resolve('done')
      })
      .catch((error: Error) => {
        reject(error)
      })
  })
}

/**
 * Removes all existing items from the list and adds the provided items to the list.
 *
 * @returns {Promise<boolean>}
 */
export async function update_all_list_items(
  cf_account_id: string,
  cf_api_token: string,
  list_id: string,
  data: any
): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = `https://api.cloudflare.com/client/v4/accounts/${cf_account_id}/rules/lists/${list_id}/items`

    const options = {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cf_api_token}`
      },
      body: data
    }

    fetch(url, options)
      .then(async response => {
        if (!response.ok) {
          reject(new Error(`Response status: ${response.status}`))
        }
        return (await response.json()) as Promise<ResponseMeta>
      })
      .then((responsemeta: ResponseMeta) => {
        if (!responsemeta.success) {
          const errors = responsemeta.errors

          if (errors && errors.length > 0) {
            reject(new Error(JSON.stringify(errors, null, 2)))
          }

          const messages = responsemeta.messages

          if (messages && messages.length > 0) {
            reject(new Error(JSON.stringify(messages, null, 2)))
          }
        }

        if (!responsemeta || !responsemeta.result) {
          reject(new Error('Response Or Result Not found.'))
        }

        resolve('done')
      })
      .catch((error: Error) => {
        reject(error)
      })
  })
}
