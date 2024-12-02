// Define an interface for IPIPMeta
export interface IPIPMeta {
  ip: string
  location: string[]
}

// Define an interface for IPIPResponseMeta
export interface IPIPResponseMeta {
  ret: string
  data: IPIPMeta
}

/**
 * Get the public IPV4 and IPV6 for the github actions runner.
 *
 * @returns {Promise<string>} The Public IPV4 and IPV6 for the github actions runner.
 */
export async function public_ip(): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = 'https://myip.ipip.net/json'

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
        return (await response.json()) as Promise<IPIPResponseMeta>
      })
      .then((ipipresponsemeta: IPIPResponseMeta) => {
        if (ipipresponsemeta.ret != 'ok') {
          reject(new Error('Failed to Get Public IP.'))
        }

        const ipdata = ipipresponsemeta.data

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
