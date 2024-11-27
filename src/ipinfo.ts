// Define an interface for IPMeta
export interface IPMeta {
  ip: string
  city: string
  region: string
  country: string
  loc: string
  org: string
  postal: string
  timezone: string
  readme: string
}

/**
 * Get the public IPV4 and IPV6 for the github actions runner.
 *
 * @returns {Promise<string>} The Public IPV4 and IPV6 for the github actions runner.
 */
export async function public_ip(): Promise<string> {
  return new Promise(async (resolve, reject) => {
    const url = 'https://myip.ipip.net/json'

    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
        "Content-Type": "application/json",
      }
    })

    if (!response.ok) {
      reject(new Error(`Response status: ${response.status}`))
    }

    const ipdata = await response.json() as IPMeta

    if (!ipdata || !ipdata.ip) {
      reject(new Error('Public IP Not Found.'))
    }

    resolve(ipdata.ip)
  })
}
