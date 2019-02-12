import React from 'react'
import { Box, InfiniteScroll } from 'grommet'
import EventModal from './EventModal'
import EventLog from './EventLog'
import { arrayOf, object } from 'prop-types'

class LoggingBox extends React.Component {
  static propTypes = {
    events: arrayOf(object).isRequired
  }

  state = { showEvent: false, event: '' }

  onClose = () => {
    this.setState({ showEvent: false })
  }

  handleOnClick = event => {
    this.setState({ showEvent: true, event })
  }

  render() {
    const { events } = this.props
    const { showEvent } = this.state
    return (
      <Box
        fill
        overflow="auto"
        border={{ side: 'top', color: 'brand', size: 'small' }}
      >
        <InfiniteScroll items={events}>
          {item => (
            <Box flex={false} direction="row" justify="center">
              <EventLog text={item} onClick={this.handleOnClick} />
            </Box>
          )}
        </InfiniteScroll>
        {showEvent && (
          <EventModal event={this.state.event} onClose={this.onClose} />
        )}
      </Box>
    )
  }
}

export default LoggingBox
