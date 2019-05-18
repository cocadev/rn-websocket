import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Text, TouchableWithoutFeedback, View } from 'react-native'
import { Button, Input } from 'react-native-elements'
import { ActionBar, OnboardingHeader } from 'hg/components'
import { app, colors, dimensions, fontSizes } from 'hg/constants'
import { formatPhoneNumber, getCurrentTimestamp } from 'hg/utils'

export default class OnboardingSubmit extends Component {
  static propTypes = {
    countryCode: PropTypes.string.isRequired,
    phoneNumber: PropTypes.string.isRequired,
    requestVerificationCode: PropTypes.func.isRequired,
    submitVerificationCode: PropTypes.func.isRequired
  }

  state = {
    isRequesting: false,
    isSubmitting: false,
    timeoutId: 0,
    verificationCode: ''
  }

  render() {
    const formattedPhoneNumber = formatPhoneNumber(this.props.countryCode, this.props.phoneNumber)

    return (
      <View
        style={
          {
            alignItems: 'center',
            flex: 1,
            paddingHorizontal: dimensions.PADDING
          }
        }
      >
        <OnboardingHeader
          title={`Verify ${formattedPhoneNumber}`}
        />
        <Text>{`We have sent an SMS with a code to ${formattedPhoneNumber}.`}</Text>
        <Input
          autoFocus={true}
          containerStyle={
            {
              width: dimensions.LENGTH_200
            }
          }
          inputContainerStyle={
            {
              borderBottomWidth: dimensions.BORDER_WIDTH,
              borderColor: colors.WHITE_SMOKE
            }
          }
          inputStyle={
            {
              fontSize: fontSizes.XXLARGE,
              textAlign: 'center'
            }
          }
          keyboardType='numeric'
          onChangeText={
            (text) => {
              this.setState({ verificationCode: text })
            }
          }
          value={this.state.verificationCode}
        />
        <Text>Enter 4-digit code</Text>
        <Button
          TouchableComponent={TouchableWithoutFeedback}
          buttonStyle={
            {
              width: dimensions.LENGTH_150
            }
          }
          containerStyle={
            {
              marginTop: dimensions.PADDING
            }
          }
          loading={this.state.isRequesting}
          loadingProps={
            {
              color: colors.GREY
            }
          }
          onPress={
            () => {
              if (this.state.isRequesting) return

              this.setState({ isRequesting: true })
              const actionId = getCurrentTimestamp()
              this.props.requestVerificationCode(actionId, this.props.countryCode, this.props.phoneNumber)

              setTimeout(
                () => {
                  this.setState({ isRequesting: false })
                },
                app.TIMEOUT_XLONG
              )
            }
          }
          title='Resend SMS'
          titleStyle={
            {
              color: colors.GREY
            }
          }
          type='clear'
        />
        <ActionBar
          mainActionIconName={this.state.isSubmitting ? 'hourglass-empty' : 'done'}
          mainActionOnPress={
            () => {
              if (this.state.isSubmitting) return

              this.setState({ isSubmitting: true })
              const actionId = getCurrentTimestamp()
              this.props.submitVerificationCode(actionId, this.state.verificationCode)

              const timeoutId = setTimeout(
                () => {
                  this.setState({ isSubmitting: false })
                },
                app.TIMEOUT_XLONG
              )
              this.setState({ timeoutId })
            }
          }
          style={
            {
              backgroundColor: colors.WHITE
            }
          }
        />
      </View>
    )
  }

  componentWillUnmount() {
    clearTimeout(this.state.timeoutId)
  }
}
