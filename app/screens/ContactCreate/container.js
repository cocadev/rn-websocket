import { connect } from 'react-redux'
import { goToContactEdit } from 'hg/actions'
import component from './component'

const mapDispatchToProps = (dispatch) => {
  return {
    goToContactEdit: (contactSid) => {
      dispatch(goToContactEdit(contactSid))
    }
  }
}

const mapStateToProps = (state) => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(component)
