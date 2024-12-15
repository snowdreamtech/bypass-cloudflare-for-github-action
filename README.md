# Bypass Cloudflare for GitHub Action Pro

Never receive 403 Forbidden from Cloudflare again.

Inspired by
[xiaotianxt/bypass-cloudflare-for-github-action](https://github.com/xiaotianxt/bypass-cloudflare-for-github-action)

[![GitHub Super-Linter](https://github.com/snowdreamtech/bypass-cloudflare-for-github-action/actions/workflows/linter.yml/badge.svg)](https://github.com/snowdreamtech/bypass-cloudflare-for-github-action/actions/workflows/linter.yml)
[![CI](https://github.com/snowdreamtech/bypass-cloudflare-for-github-action/actions/workflows/ci.yml/badge.svg)](https://github.com/snowdreamtech/bypass-cloudflare-for-github-action/actions/workflows/ci.yml)
[![Check dist/](https://github.com/snowdreamtech/bypass-cloudflare-for-github-action/actions/workflows/check-dist.yml/badge.svg)](https://github.com/snowdreamtech/bypass-cloudflare-for-github-action/actions/workflows/check-dist.yml)
[![CodeQL](https://github.com/snowdreamtech/bypass-cloudflare-for-github-action/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/snowdreamtech/bypass-cloudflare-for-github-action/actions/workflows/codeql-analysis.yml)
[![Coverage](./badges/coverage.svg)](./badges/coverage.svg)

Requests from GitHub Action servers to a Cloudflare proxied host may be blocked
by
[Cloudflare's Web Application Firewall(WAF)](https://developers.cloudflare.com/support/troubleshooting/http-status-codes/4xx-client-error/)
or [Super Bot Fight Mode](https://developers.cloudflare.com/bots/get-started/pro/) .
This action automatically adds the public IP of the GitHub Action runner to
Cloudflare's firewall
[Custom rules](https://developers.cloudflare.com/waf/custom-rules/) or
[Lists](https://developers.cloudflare.com/waf/tools/lists/)

## Features

- Automatically retrieves the public IP of the GitHub Action runner.
- Adds the runner's IP to Cloudflare's firewall custom rules.
- Adds the runner's IP to Cloudflare's account list.
- Cleans up by removing the IP from Cloudflare's firewall custom rules after the
  job is complete.
- Cleans up by removing the IP from Cloudflare's account list after the job is
  complete.

## Inputs

| Input                     | Description                                                  | Required | Default                                      |
| ------------------------- | ------------------------------------------------------------ | -------- | -------------------------------------------- |
| `mode`                    | single/list/github                                           | false    | github                                       |
| `cf_zone_id`              | Cloudflare Zone ID                                           | true     | /                                            |
| `cf_api_token`            | Cloudflare API Token                                         | true     | /                                            |
| `cf_account_id`           | Cloudflare Account ID                                        | true     | /                                            |
| `github_api_token`        | Github API Token                                             | true     | /                                            |
| `single_rule_description` | Rule Description For Mode Single                             | false    | Bypass Cloudflare for GitHub Action (Single) |
| `list_rule_description`   | Rule Description For Mode List                               | false    | Bypass Cloudflare for GitHub Action (List)   |
| `list_name`               | List name                                                    | false    | github_actions_runners                       |
| `clean`                   | Caution: It will remove your zone ruleset rule and your list | false    | false                                        |

## Outputs

| Output | Description         |
| ------ | ------------------- |
| `time` | Time when finished. |

## Usage

To use this action, create a workflow in your repository's `.github/workflows`
directory. Below is an example workflow file:

```yaml
name: Bypass Cloudflare for Github Action Pro
on: [push]
jobs:
  bypass-cloudflare-for-github-action-pro:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4.2.1
      - name: Bypass Cloudflare for Github Action Pro
        uses: snowdreamtech/bypass-cloudflare-for-github-action@v0.0.3
        with:
          mode: 'github'
          cf_account_id: ${{ secrets.CF_ACCOUNT_ID }}
          cf_api_token: ${{ secrets.CF_API_TOKEN }}
          cf_zone_id: ${{ secrets.CF_ZONE_ID }}
          github_api_token: ${{ secrets.GITHUB_TOKEN }}
      - name: Send request to Cloudflare-protected server
        run: curl https://example.com/api
```

## Important Note

This action requires a Cloudflare API Token, not the Global API Key. To create
an API token:

1. Log in to the Cloudflare dashboard.
1. Go to "My Profile" > "API Tokens".
1. Click "Create Token".
1. Create a custom token with the following permissions:
   - Account > Account Filter > Edit
   - Zone > Zone WAF > Edit
   - Zone > Zone Settings > Edit
   - Zone > Zone > Edit
1. Set the token to access the specific account you're working with.
1. Set the token to access the specific zone you're working with.
1. Create the token and save it securely.

Remember to add your Cloudflare Account ID, Cloudflare Zone ID and the new API
Token to your GitHub repository secrets as `CF_ACCOUNT_ID`, `CF_ZONE_ID` and
`CF_API_TOKEN` respectively.

[About the GITHUB_TOKEN secret](https://docs.github.com/en/actions/security-for-github-actions/security-guides/automatic-token-authentication)

At the start of each workflow job, GitHub automatically creates a unique
`GITHUB_TOKEN` secret to use in your workflow. You can use the `GITHUB_TOKEN` to
authenticate in the workflow job.

Before each job begins, GitHub fetches an installation access token for the job.
The `GITHUB_TOKEN` expires when a job finishes or after a maximum of 24 hours.

## Limits

The global rate limit for the Cloudflare API is 1200 requests per five minute
period per user, and applies cumulatively regardless of whether the request is
made via the dashboard, API key, or API token.

If you exceed this limit, all API calls for the next five minutes will be
blocked, receiving a HTTP 429 - Too Many Requests response.
