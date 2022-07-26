import React
  from 'react'
import { Alert }
  from 'vtex.styleguide'
type Props = {
  message: string
  event: string
}
const AlertInformation = ({
  message,
  event }: Props) => {
  return (
    <div>
      <Alert
        type={`${event}`}
      >
        {message}
      </Alert>
    </div>
  )
}
export default AlertInformation
