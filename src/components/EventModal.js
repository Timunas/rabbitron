import React from 'react'
import { func, string } from 'prop-types'
import { Box, Button, Layer, Heading, Text } from 'grommet'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { magula } from 'react-syntax-highlighter/dist/styles/hljs'

class EventModal extends React.Component {
  static propTypes = {
    event: string.isRequired,
    onClose: func.isRequired
  }

  render() {
    const { onClose, event } = this.props

    return (
      <Layer position="center" modal onClickOutside={onClose} onEsc={onClose}>
        <Box pad="medium" gap="small" width="medium">
          <Heading level={3} margin="none">
            Event
          </Heading>
          <SyntaxHighlighter language="json" style={magula}>
            {event}
          </SyntaxHighlighter>
          <Box
            as="footer"
            gap="small"
            direction="row"
            align="center"
            justify="end"
            pad={{ top: 'medium', bottom: 'small' }}
          >
            <Button
              label={
                <Text color="white">
                  <strong>Close</strong>
                </Text>
              }
              onClick={onClose}
              primary
              color="status-critical"
            />
          </Box>
        </Box>
      </Layer>
    )
  }
}

export default EventModal
