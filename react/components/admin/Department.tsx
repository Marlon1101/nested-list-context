import React, { FC, useState }
  from 'react'
import { FormattedMessage }
  from 'react-intl'
import {
  Layout,
  PageHeader,
  Spinner,
} from 'vtex.styleguide'

import '../../styles.global.css'
import { getAllDocuments }
  from '../../utils/allQueries'
import BlockTable
  from '../../global_table'
import AlertInformation
  from '../AlertInformation'
import DeleteDocuments
  from '../forms/DeleteDocuments';
import { SchemasTableDepartment }
  from './SchemasTable';
import CreateDocument
  from '../forms/CreateDocument'
import UpdateDocument
  from '../forms/UpdateDocument'

const Department: FC<Props> = () => {
  const [
    resultAllDocs,
    errorAllDocs,
    loadingAllDocs
  ] = getAllDocuments("DD",
    [
      "code_dane",
      "label",
      "slug"
    ]
  )
  const [showAlert,
    setShowAlert
  ] = useState(false)
  const [showAlertDelete, setShowAlertDelete] = useState(false)
  const [modalCreate, setModalCreate] = useState(false)
  const [modalDelete, setModalDelete] = useState(false)
  const [dataForDelete, setDataForDelete] = useState({
    acronym: "DD",
    idDocument: ""
  })
  const [modalUpdate, setModalUpdate] = useState(false)
  const [dataForUpdate, setDataForUpdate] = useState({
    acronym: "DD",
    idDocument: ""
  })
  const handleModalCreate = () => {
    setModalCreate(!modalCreate)
  }
  const handleModalDelete = (e: any, data: any) => {
    e.preventDefault()
    setModalDelete(!modalDelete)
    setDataForDelete({
      ...dataForDelete, idDocument: data
    })
  }
  const handleModalUpdate = (e: any, data: any) => {
    e.preventDefault()
    setModalUpdate(!modalUpdate)
    setDataForUpdate({
      ...dataForUpdate, idDocument: data
    })
  }
  return (
    <div>
      {errorAllDocs && null}
      {
        loadingAllDocs &&
        <Spinner />
      }
      {
        modalCreate &&
        <CreateDocument
          modal={modalCreate}
          departmentDane={""}
          handleModal={handleModalCreate}
          setShowAlert={setShowAlert}
          acronym={"DD"}
        />
      }
      {
        modalUpdate &&
        <UpdateDocument
          modal={modalUpdate}
          dataForUpdate={dataForUpdate}
          handleModal={handleModalUpdate}
        />
      }
      {
        showAlert &&
        <AlertInformation
          message={'Your new product was created with success.'}
          event={"success"}
        />
      }
      {
        modalDelete &&
        <DeleteDocuments
          ubication='Department'
          dataForDelete={dataForDelete}
          modalDelete={modalDelete}
          handleModalDelete={handleModalDelete}
          setShowAlertDelete={setShowAlertDelete}
        />
      }
      {
        showAlertDelete &&
        <AlertInformation
          message={'Information has been deleted successfully.'}
          event={"success"}
        />
      }
      <Layout
        pageHeader={
          <PageHeader
            title={<FormattedMessage
              id="admin-department.details"
            />}
          />
        }
      >
        <BlockTable
          location={"Departments"}
          downloadDocument={<FormattedMessage
            id= "admin-department.export.department"
          />}
          uploadDocument={<FormattedMessage
            id= "admin-department.import.department"
          />}
          labelNew ={ <FormattedMessage
            id= "admin-department.new.department"
          />}
          jsonschema={
            SchemasTableDepartment(
              handleModalDelete,
              handleModalUpdate,

            )}
          dataDisplay={resultAllDocs}
          handleModal={handleModalCreate}
        />
      </Layout>
    </div>
  )
}
interface Props {
  params: any
}
export default Department;
