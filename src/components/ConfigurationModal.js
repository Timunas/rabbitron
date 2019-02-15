import React from 'react'
import { func, object } from 'prop-types'
import {
  Box,
  Button,
  Layer,
  Heading,
  FormField,
  Select,
  TextInput
} from 'grommet'

class ConfigurationModal extends React.Component {
  static propTypes = {
    onClose: func.isRequired,
    connectionData: object
  }

  state = {
    exchange_type: 'none',
    hostname: 'localhost',
    port: '5672',
    username: 'guest',
    password: 'guest',
    vhost: '/',
    exchange_name: '',
    routing_key: '',
    queue_name: ''
  }

  componentWillMount() {
    if (this.props.connectionData) {
      this.setState({ ...this.props.connectionData })
    }
  }

  onHostnameChange = event => {
    this.setState({ hostname: event.target.value })
  }

  onPortChange = event => {
    this.setState({ port: event.target.value })
  }

  onUsernameChange = event => {
    this.setState({ username: event.target.value })
  }

  onPasswordChange = event => {
    this.setState({ password: event.target.value })
  }

  onVhostChange = event => {
    this.setState({ vhost: event.target.value })
  }

  onExchangeNameChange = event => {
    this.setState({ exchange_name: event.target.value })
  }

  onRoutingKeyChange = event => {
    this.setState({ routing_key: event.target.value })
  }

  onQueueNameChange = event => {
    this.setState({ queue_name: event.target.value })
  }

  handleOnClose = () => {
    this.props.onClose(this.state)
  }

  render() {
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
    } = this.state

    return (
      <Layer
        position="right"
        full="vertical"
        modal
        onClickOutside={this.handleOnClose}
        onEsc={this.handleOnClose}
      >
        <Box
          as="form"
          fill="vertical"
          overflow="auto"
          width="medium"
          pad="medium"
          onSubmit={this.handleOnClose}
        >
          <Box flex={false} direction="row" justify="between">
            <Heading level={2} margin="none">
              Settings
            </Heading>
          </Box>
          <Box flex="grow" overflow="auto" pad={{ vertical: 'medium' }}>
            <FormField label="Hostname">
              <TextInput onChange={this.onHostnameChange} value={hostname} />
            </FormField>
            <FormField label="Port">
              <TextInput onChange={this.onPortChange} value={port} />
            </FormField>
            <FormField label="Username">
              <TextInput onChange={this.onUsernameChange} value={username} />
            </FormField>
            <FormField label="Password">
              <TextInput onChange={this.onPasswordChange} value={password} />
            </FormField>
            <FormField label="VHost">
              <TextInput onChange={this.onVhostChange} value={vhost} />
            </FormField>
            <FormField label="Exchange Type">
              <Select
                options={['none', 'direct', 'fanout', 'topic']}
                value={exchange_type}
                onChange={({ option }) =>
                  this.setState({ exchange_type: option })
                }
              />
            </FormField>
            <FormField label="Exchange Name">
              <TextInput
                onChange={this.onExchangeNameChange}
                value={exchange_name}
              />
            </FormField>
            <FormField label="Routing Key">
              <TextInput
                onChange={this.onRoutingKeyChange}
                value={routing_key}
              />
            </FormField>
            <FormField label="Queue Name">
              <TextInput onChange={this.onQueueNameChange} value={queue_name} />
            </FormField>
          </Box>
          <Box flex={false} as="footer" align="start">
            <Button
              type="submit"
              label="Save"
              onClick={this.handleOnClose}
              primary
            />
          </Box>
        </Box>
      </Layer>
    )
  }
}

export default ConfigurationModal
