import moment from 'moment'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { FlatList } from 'react-native'
import { ActionBar, DirectMessageSnippet, MessageGroupSnippet, NavigationView } from 'hg/components'
import { app, groupTypes } from 'hg/constants'
import { readContact, readMessageGroupContacts, readMessageGroups } from 'hg/db'

const directMessageRecipient = {}
const groupNumOfParticipants = {}

export default class Home extends Component {
  static navigationOptions = {
    headerTitle: 'Hooligram'
  }

  static propTypes = {
    currentUserSid: PropTypes.string.isRequired,
    goToContact: PropTypes.func.isRequired,
    goToDirectMessage: PropTypes.func.isRequired,
    goToGroupMessage: PropTypes.func.isRequired
  }

  state = {
    intervalId: 0,
    messageGroups: []
  }

  render() {
    return (
      <NavigationView
        onWillBlur={
          () => {
            clearInterval(this.state.intervalId)
          }
        }
        onWillFocus={
          () => {
            this.updateMessageGroups()

            const intervalId = setInterval(() => {
              this.updateMessageGroups()
            }, app.INTERVAL)

            this.setState({ intervalId })
          }
        }
      >
        <FlatList
          data={this.state.messageGroups
            .sort((a, b) => {
              if (moment(a.date_updated).isSame(b.date_updated)) {
                if (moment(a.date_created).isSame(b.date_created)) return 0
                return moment(a.date_created).isAfter(b.date_created) ? 1 : -1;
              }

              return moment(a.date_updated).isAfter(b.date_updated) ? 1 : -1;
            })
            .reverse()
          }
          keyExtractor={(messageGroup) => (messageGroup.id.toString())}
          renderItem={
            (item) => {
              const messageGroup = item.item
              return (
                messageGroup.type === groupTypes.DIRECT_MESSAGE
                ?
                (
                  directMessageRecipient[messageGroup.id]
                  ?
                  <DirectMessageSnippet
                    recipient={
                      directMessageRecipient[messageGroup.id]
                      ||
                      {
                        name: '',
                        sid: ''
                      }
                    }
                    onPress={
                      () => {
                        const groupId = messageGroup.id
                        this.props.goToDirectMessage(groupId)
                      }
                    }
                  />
                  :
                  null
                )
                :
                (
                  groupNumOfParticipants[messageGroup.id]
                  ?
                  <MessageGroupSnippet
                    messageGroup={
                      {
                        id: messageGroup.id,
                        name: messageGroup.name,
                        numOfParticipants: groupNumOfParticipants[messageGroup.id]
                      }
                    }
                    onPress={
                      () => {
                        const groupId = messageGroup.id
                        this.props.goToGroupMessage(groupId)
                      }
                    }
                  />
                  :
                  null
                )
              )
            }
          }
        />
        <ActionBar
          mainActionIconName='dashboard'
          mainActionOnPress={
            () => {
              this.props.goToContact()
            }
          }
        />
      </NavigationView>
    )
  }

  updateMessageGroups() {
    readMessageGroups()
      .then((messageGroups) => {
        this.setState({ messageGroups })

        messageGroups.forEach((messageGroup) => {
          readMessageGroupContacts(messageGroup.id)
            .then((contacts) => {
              if (messageGroup.type === groupTypes.DIRECT_MESSAGE) {
                contacts.forEach((sid) => {
                  if (sid === this.props.currentUserSid) return

                  readContact(sid)
                    .then((contact) => {
                      directMessageRecipient[messageGroup.id] = {
                        name: contact.name || '',
                        sid: contact.sid || ''
                      }
                    })
                })
              }
              else {
                groupNumOfParticipants[messageGroup.id] = contacts.length || 0
              }
            })
        })
      })
  }
}
