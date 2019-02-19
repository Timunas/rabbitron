import React, { Component } from 'react'
import { Grommet, Box } from 'grommet'
import TopBox from './components/TopBox'
import LoggingBox from './components/LoggingBox'

const theme = {
  global: {
    font: {
      family: 'Roboto',
      size: '14px',
      height: '20px'
    }
  }
}

class App extends Component {
  state = { events: [] }

  onReset = () => this.setState({ events: [] })

  onEventArrival = event => {
    console.log('Event: ', event)
    if (event) {
      const parsedEvent = this.isJson(event)
        ? JSON.stringify(JSON.parse(event), undefined, 2)
        : event

      this.setState(prevState => ({
        events: [parsedEvent, ...prevState.events]
      }))
    }
  }

  isJson = str => {
    try {
      JSON.parse(str)
    } catch (e) {
      return false
    }
    return true
  }

  render() {
    const { events } = this.state
    return (
      <Grommet theme={theme} full>
        <Box background="dark-1" height="full">
          <TopBox queueCallback={this.onEventArrival} onReset={this.onReset} />
          <LoggingBox events={events} />
        </Box>
      </Grommet>
    )
  }
}

export default App
