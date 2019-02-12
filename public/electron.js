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
  console.log(arg)
  consumeFromQueue(event)
})

ipc.on('disconnect-queue', function(event, arg) {
  if (connection) {
    connection.close().then(event.sender.send('queue-disconnected'))
  } else {
    event.sender.send('queue-disconnected')
  }
})

function consumeFromQueue(event) {
  amqp
    .connect('amqp://localhost')
    .then(conn => {
      connection = conn

      conn.createChannel().then(ch => {
        var q = 'hello'

        ch.assertQueue(q, { durable: false }).then(data => {
          ch.consume(
            data.queue,
            msg => {
              if (msg && msg.content) {
                mainWindow.webContents.send(
                  'event-arrival',
                  msg.content.toString()
                )
              }
            },
            { noAck: true }
          )

          event.sender.send('queue-connected')
        })
      })
    })
    .catch(error => event.sender.send('queue-connection-failed'))
}
