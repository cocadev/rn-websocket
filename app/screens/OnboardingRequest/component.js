import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Keyboard, Picker, Text, View } from 'react-native'
import { Input } from 'react-native-elements'
import { ActionBar, OnboardingHeader } from 'hg/components'
import { app, colors, countryCodes, dimensions, fontSizes } from 'hg/constants'
import { getCurrentTimestamp } from 'hg/utils'

export default class extends Component {
  static propTypes = {
    requestVerificationCode: PropTypes.func.isRequired
  }

  state = {
    isRequesting: false,
    phoneNumber: '',
    selection: 0,
    timeoutId: 0
  }

  render() {
    return (
      <View
        style={
          {
            flex: 1,
            paddingHorizontal: dimensions.PADDING
          }
        }
      >
        <OnboardingHeader
          title='Verify your phone number'
        />
        <Text
          style={
            {
              textAlign: 'center'
            }
          }
        >
          Hooligram will send an SMS to verify your phone number. Enter your country code and phone number:
        </Text>
        <Picker
          onValueChange={
            (_, index) => {
              this.setState({ selection: index });
            }
          }
          selectedValue={this.state.selection}
          style={
            {
              alignSelf: 'center',
              minWidth: dimensions.PERCENT_50,
              width: dimensions.LENGTH_200
            }
          }
        >
          {
            countryCodes.map((country, index) => {
              return (
                <Picker.Item
                  label={country.name}
                  key={index}
                  value={index}
                />
              )
            })
          }
        </Picker>
        <View
          style={
            {
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'center'
            }
          }
        >
          <Text
            style={
              {
                fontSize: fontSizes.LARGE,
                textAlign: 'center',
                width: dimensions.LENGTH_50
              }
            }
          >
            +{countryCodes[this.state.selection].code}
          </Text>
          <Input
            autoFocus={true}
            containerStyle={
              {
                minWidth: dimensions.PERCENT_50,
                width: dimensions.LENGTH_250
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
                fontSize: fontSizes.XLARGE
              }
            }
            keyboardType='numeric'
            onChangeText={
              (text) => {
                const phoneNumber = text.replace(/[^0-9]/g, '')
                this.setState({ phoneNumber })
              }
            }
            value={this.state.phoneNumber}
          />
          <View
            style={
              {
                width: dimensions.LENGTH_50
              }
            }
          />
        </View>
        <ActionBar
          mainActionIconName={this.state.isRequesting ? 'hourglass-empty' : 'done'}
          mainActionOnPress={
            () => {
              if (this.state.isRequesting) return

              this.setState({ isRequesting: true })

              const actionId = getCurrentTimestamp()
              const countryCode = countryCodes[this.state.selection].code
              const phoneNumber = this.state.phoneNumber
              this.props.requestVerificationCode(actionId, countryCode, phoneNumber)
              Keyboard.dismiss()

              const timeoutId = setTimeout(
                () => {
                  this.setState({ isRequesting: false })
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
