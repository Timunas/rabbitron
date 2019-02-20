import React from 'react'
import { func } from 'prop-types'
import { Box, Button, Layer, Text } from 'grommet'
import { StatusCritical, FormClose } from 'grommet-icons'

class ErrorModal extends React.Component {
  static propTypes = {
    onClose: func.isRequired
  }

  render() {
    const { onClose } = this.props

    return (
      <Layer
        position="bottom-right"
        modal={false}
        margin={{ vertical: 'small', horizontal: 'small' }}
        onEsc={onClose}
        responsive={false}
        plain
      >
        <Box
          align="center"
          direction="row"
          gap="small"
          justify="between"
          round="small"
          elevation="small"
          pad={{ horizontal: 'small' }}
          background="status-error"
        >
          <Box align="center" direction="row" gap="xsmall">
            <StatusCritical />
            <Text>Connection failure. Check settings</Text>
          </Box>
          <Button icon={<FormClose />} onClick={onClose} plain />
        </Box>
      </Layer>
    )
  }
}

export default ErrorModal
