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
  return new Promise((resolve, reject) => {
    const url = 'https://ipinfo.io/json'

    fetch(url, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(async response => {
        if (!response.ok) {
          reject(new Error(`Response status: ${response.status}`))
        }
        return (await response.json()) as Promise<IPMeta>
      })
      .then((ipdata: IPMeta) => {
        if (!ipdata || !ipdata.ip) {
          reject(new Error('Public IP Not Found.'))
        }

        resolve(ipdata.ip)
      })
      .catch((error: Error) => {
        reject(error)
      })
  })
}
