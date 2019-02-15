import React from 'react'
import { Box, Button } from 'grommet'
import { ThemeContext } from 'grommet/contexts'
import { func } from 'prop-types'
import { Configure, Action, Connectivity, Trash } from 'grommet-icons'
import ConfigurationModal from './ConfigurationModal'
import MDSpinner from 'react-md-spinner'

const { ipcRenderer } = window.require('electron')

class TopBox extends React.Component {
  static propTypes = {
    queueCallback: func.isRequired,
    onReset: func.isRequired
  }

  state = {
    connected: false,
    showSettings: false,
    select: '',
    error: false,
    connectionData: {},
    buttonDisabled: false,
    buttonLoading: false
  }

  componentDidMount() {
    ipcRenderer.on('queue-connected', this.handleQueueConnected)
    ipcRenderer.on('queue-connection-failed', this.handleQueueConnectionFailed)
    ipcRenderer.on('queue-disconnected', this.handleQueueDisconnected)
    ipcRenderer.on('event-arrival', this.handleEventArrival)
  }

  onSettingsClose = connectionData => {
    this.setState({ showSettings: false, connectionData })
  }

  handleQueueConnected = (event, arg) => {
    this.setState({
      connected: true,
      buttonDisabled: false,
      buttonLoading: false
    })
  }

  handleQueueConnectionFailed = (event, arg) => {
    this.setState({ error: true, buttonDisabled: false, buttonLoading: false })
  }

  handleQueueDisconnected = (event, arg) => {
    this.setState({
      connected: false,
      buttonDisabled: false,
      buttonLoading: false
    })
  }

  handleEventArrival = (event, arg) => {
    this.props.queueCallback(arg)
  }

  handleOnClickConnect = () => {
    this.setState({ buttonDisabled: true, buttonLoading: true })
    ipcRenderer.send('connect-queue', this.state.connectionData)
  }

  handleOnClickDisconnect = () => {
    this.setState({ buttonDisabled: true, buttonLoading: true })
    ipcRenderer.send('disconnect-queue')
  }

  handleOnClickSettings = () => {
    this.setState({ showSettings: true })
  }

  renderConnectionButton = () => {
    const { connected } = this.state

    if (connected) {
      return (
        <Button
          reverse
          hoverIndicator
          focusIndicator={false}
          icon={<Action color="status-critical" />}
          label="Disconnect"
          onClick={this.handleOnClickDisconnect}
          disabled={this.state.buttonDisabled}
        />
      )
    } else {
      return (
        <Button
          reverse
          hoverIndicator
          focusIndicator={false}
          icon={<Connectivity color="accent-1" />}
          label="Connect"
          onClick={this.handleOnClickConnect}
          disabled={this.state.buttonDisabled}
        />
      )
    }
  }

  renderSettingsButton = () => {
    return (
      <Button
        hoverIndicator
        focusIndicator={false}
        icon={<Configure color="accent-1" />}
        onClick={this.handleOnClickSettings}
      />
    )
  }

  renderResetButton = () => {
    return (
      <Button
        hoverIndicator
        focusIndicator={false}
        icon={<Trash color="accent-1" />}
        onClick={this.props.onReset}
      />
    )
  }

  render() {
    return (
      <Box direction="row" justify="between">
        <ThemeContext.Extend
          value={{ button: { border: { radius: '0px', width: '0px' } } }}
        >
          {this.renderConnectionButton()}
          <Box direction="row" justify="start" align="center" fill="horizontal">
            {this.state.buttonLoading && <MDSpinner singleColor="#81FCED" />}
          </Box>
          {this.renderSettingsButton()}
          {this.renderResetButton()}
        </ThemeContext.Extend>
        {this.state.showSettings && (
          <ConfigurationModal
            onClose={this.onSettingsClose}
            connectionData={this.state.connectionData}
          />
        )}
      </Box>
    )
  }
}

export default TopBox
