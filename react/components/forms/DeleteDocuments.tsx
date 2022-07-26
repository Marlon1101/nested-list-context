import React
  from 'react'
import {
  Modal,
  Button,
} from 'vtex.styleguide'
import { useMutation }
  from 'react-apollo'
import DELETE_DOCUMENT
  from '../../graphql/deleteDocument.graphql'
import AlertInformation
  from '../AlertInformation'
import '../../styles.global.css'

type Props = {
  modalDelete: boolean,
  handleModalDelete: Function,
  ubication: string
  setShowAlertDelete: any
  dataForDelete: any
}
const DeleteDocuments = ({
  modalDelete,
  handleModalDelete,
  setShowAlertDelete,
  ubication,
  dataForDelete
}: Props
) => {
  const [deleteDocument] = useMutation(DELETE_DOCUMENT, {
    onCompleted: () => {
      setShowAlertDelete(true)
      setTimeout(() => {
        setShowAlertDelete(false)
      }, 5000);
      location.reload()
    },
  })
  const handleClick = () => {
    const { acronym, idDocument } = dataForDelete
    deleteDocument({
      variables: {
        acronym: acronym,
        idDocument: idDocument
      }
    })
  }
  return (
    <Modal
      centered
      isOpen={modalDelete}
      onClose={handleModalDelete}>
      <h3>{`Delete ${ubication}`}</h3>
      <AlertInformation
        message={`Alert!
             Are you sure you
              want to delete this information?
               If you do,
               it won't be possible to recover.`}
        event={"warning"}
      />
      <div className='titleDetail'>
        <Button
          onClick={handleClick}
          variation="danger"
        >YES DELETE</Button>
        <Button
          onClick={handleModalDelete}
          variation="secondary"
        >DO NOT RETURN</Button>
      </div>
    </Modal>
  )
}
export default DeleteDocuments
