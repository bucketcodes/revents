import React from 'react'
import { Dimmer, Loader } from 'semantic-ui-react'

const loadingComponent = ({inverted, text}) => {
  return (
    <Dimmer inverted={inverted} active={true}>
        <Loader content={text} />
    </Dimmer>
  )
}

export default loadingComponent
