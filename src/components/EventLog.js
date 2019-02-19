import React from 'react'
import { Box, Button, Text } from 'grommet'
import { string, func } from 'prop-types'

class EventLog extends React.Component {
  static propTypes = {
    text: string.isRequired,
    onClick: func.isRequired
  }

  handleOnClick = () => {
    this.props.onClick(this.props.text)
  }

  render() {
    return (
      <Button
        hoverIndicator
        plain
        focusIndicator={false}
        onClick={this.handleOnClick}
        fill
        alignSelf="center"
      >
        <Box>
          <Text textAlign="center" truncate>
            {this.props.text}
          </Text>
        </Box>
      </Button>
    )
  }
}

export default EventLog
