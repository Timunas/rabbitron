var amqp = require('amqplib/callback_api')

export function consumeFromQueue(callback) {
  amqp.connect('amqp://localhost', function(err, conn) {
    conn.createChannel(function(err, ch) {
      var q = 'hello'

      ch.assertQueue(q, { durable: false })

      console.log(' [*] Waiting for messages in %s. To exit press CTRL+C', q)

      ch.consume(q, callback, { noAck: true })
    })
  })
}

export function consumeFromExchange() {
  amqp.connect('amqp://localhost', function(err, conn) {
    conn.createChannel(function(err, ch) {
      var ex = 'logs'

      ch.assertExchange(ex, 'fanout', { durable: false })

      ch.assertQueue('', { exclusive: true }, function(err, q) {
        console.log(
          ' [*] Waiting for messages in %s. To exit press CTRL+C',
          q.queue
        )
        ch.bindQueue(q.queue, ex, '')

        ch.consume(
          q.queue,
          function(msg) {
            if (msg.content) {
              console.log(' [x] %s', msg.content.toString())
            }
          },
          { noAck: true }
        )
      })
    })
  })
}
