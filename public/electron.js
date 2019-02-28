const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const path = require('path')
const isDev = require('electron-is-dev')
const amqp = require('amqplib')
const ipc = require('electron').ipcMain

let mainWindow
let connection

function createWindow() {
  mainWindow = new BrowserWindow({ width: 900, height: 680, show: false })
  mainWindow.setMenu(null)
  mainWindow.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '/../build/index.html')}`
  )

  mainWindow.on('closed', () => {
    if (connection) {
      connection.close()
    }
    connection = null
    mainWindow = null
  })

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

ipc.on('connect-queue', function(event, arg) {
  if (arg) {
    arg.exchange_type === 'none'
      ? consumeFromQueue(event, arg)
      : consumeFromExchange(event, arg)
  } else {
    event.sender.send('queue-connection-failed', 'Invalid settings')
  }
})

ipc.on('disconnect-queue', function(event, arg) {
  if (connection) {
    connection.close().then(event.sender.send('queue-disconnected'))
  } else {
    event.sender.send('queue-disconnected')
  }
})

function consumeFromQueue(event, connectionData) {
  const {
    hostname,
    port,
    username,
    password,
    vhost,
    queue_name
  } = connectionData

  const connectionUrl = {
    protocol: 'amqp',
    hostname,
    port,
    vhost,
    username,
    password
  }

  amqp
    .connect(connectionUrl)
    .then(conn => {
      connection = conn
      conn.on('error', function(error) {
        mainWindow.webContents.send('queue-connection-failed', error)
      })

      return conn.createChannel()
    })
    .then(ch => {
      var q = ch.assertQueue(queue_name)
      return q.then(() => {
        return ch
      })
    })
    .then(ch => {
      ch.consume(
        queue_name,
        msg => {
          if (msg && msg.content) {
            mainWindow.webContents.send('event-arrival', msg.content.toString())
          }
        },
        { noAck: true }
      )

      event.sender.send('queue-connected')
    })
    .catch(error => event.sender.send('queue-connection-failed', error))
}

function consumeFromExchange(event, connectionData) {
  const {
    exchange_type,
    hostname,
    port,
    username,
    password,
    vhost,
    exchange_name,
    routing_key,
    queue_name
  } = connectionData

  const connectionUrl = {
    protocol: 'amqp',
    hostname,
    port,
    vhost,
    username,
    password
  }

  amqp
    .connect(connectionUrl)
    .then(conn => {
      connection = conn

      conn.on('error', function(error) {
        mainWindow.webContents.send('queue-connection-failed', error)
      })

      return conn.createChannel()
    })
    .then(ch => {
      var ex = ch.assertExchange(exchange_name, exchange_type)
      return ex.then(() => {
        return ch
      })
    })
    .then(ch => {
      var data = ch.assertQueue(queue_name)
      return data.then(() => {
        return { ch, queue: data.queue }
      })
    })
    .then(channelData => {
      const { ch, queue } = channelData
      var q = ch.bindQueue(queue, exchange_name, routing_key)
      return q.then(() => {
        return { ch, queue }
      })
    })
    .then(channelData => {
      const { ch, queue } = channelData
      ch.consume(
        queue,
        msg => {
          if (msg && msg.content) {
            mainWindow.webContents.send('event-arrival', msg.content.toString())
          }
        },
        { noAck: true }
      )

      event.sender.send('queue-connected')
    })
    .catch(error => event.sender.send('queue-connection-failed', error))
}
