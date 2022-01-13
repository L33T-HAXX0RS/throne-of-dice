// std
import * as http from 'http'

// 3p
import { Config, createApp, displayServerURL } from '@foal/core'

// App
import { AppController } from './app/app.controller'
import { setupServiceManager } from './setup'

async function main() {
  console.log('Initializing dependencies...')
  const serviceManager = await setupServiceManager()

  const app = await createApp(AppController, {
    serviceManager,
  })

  const httpServer = http.createServer(app)
  const port = Config.get('port', 'number', 3001)
  httpServer.listen(port, () => displayServerURL(port))
}

main().catch((err) => {
  console.error(err.stack)
  process.exit(1)
})
