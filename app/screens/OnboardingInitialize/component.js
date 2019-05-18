import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Text } from 'react-native'
import { ActivityIndicator, NavigationView, OnboardingHeader } from 'hg/components'
import { app } from 'hg/constants'
import { getCurrentTimestamp } from 'hg/utils'

export default class OnboardingInitialize extends Component {
  static propTypes = {
    countryCode: PropTypes.string.isRequired,
    phoneNumber: PropTypes.string.isRequired,
    verificationCode: PropTypes.string.isRequired
  }

  state = {
    timeoutId: 0
  }

  render() {
    return (
      <NavigationView
        onWillBlur={
          () => {
            clearTimeout(this.state.timeoutId)
          }
        }
        onWillFocus={
          () => {
            const timeoutId = setTimeout(
              () => {
                const actionId = getCurrentTimestamp()
                this.props.authorizationSignInRequest(
                  actionId,
                  this.props.countryCode,
                  this.props.phoneNumber,
                  this.props.verificationCode
                )
                this.props.goToHome()
              },
              app.TIMEOUT_LONG
            )
            this.setState({ timeoutId })
          }
        }
        style={
          {
            alignItems: 'center',
            justifyContent: 'center'
          }
        }
      >
        <ActivityIndicator/>
        <OnboardingHeader
          title='Initializing'
        />
        <Text>Please wait a moment.</Text>
      </NavigationView>
    )
  }
}
