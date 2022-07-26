import React, { FC, useState }
  from 'react'
import { FormattedMessage }
  from 'react-intl'
import {
  Layout,
  PageBlock,
  PageHeader,
  Spinner,
} from 'vtex.styleguide'
import { Link }
  from 'vtex.render-runtime';
import '../../styles.global.css'
import {
  getMunicipalitiesDepart,
  getOneDocument,
} from '../../utils/allQueries'
import BlockTable
  from '../../global_table';
import AlertInformation
  from '../AlertInformation';
import DeleteDocuments
  from '../forms/DeleteDocuments';
import { SchemasTableMuncipalitie }
  from './SchemasTable';
import CreateDocument
  from '../forms/CreateDocument';
import UpdateDocument
  from '../forms/UpdateDocument';

const DepartmentDetail: FC<Props> = ({ params }) => {

  const [showAlert, setShowAlert] = useState(false)
  const [modal, setModal] = useState(false)
  const [modalDelete, setModalDelete] = useState(false)
  const [showAlertDelete, setShowAlertDelete] = useState(false)
  const [dataForDelete, setDataForDelete] = useState({
    acronym: "MD",
    idDocument: ""
  })
  const [modalUpdate, setModalUpdate] = useState(false)
  const [dataForUpdate, setDataForUpdate] = useState({
    acronym: "MD",
    idDocument: ""
  })
  const [
    resultOneDoc,
    loadingOneDoc,
    errorOneDoc
  ] = getOneDocument(params.id, "DD")
  const [
    resultMun,
    errorMun
  ] = getMunicipalitiesDepart(resultOneDoc[0]?.code_dane)
  errorOneDoc &&
    console.error("Error Query Detail ", errorOneDoc);
  errorMun &&
    console.error("Error Query Municipalities ", errorMun);
  const handleModal = () => {
    setModal(!modal)
  }
  const handleModalUpdate = (e: any, data: any) => {
    e.preventDefault()
    setModalUpdate(!modalUpdate)
    setDataForUpdate({
      ...dataForUpdate, idDocument: data
    })
  }
  const handleModalDelete = (e: any, data: any) => {
    e.preventDefault()
    setModalDelete(!modalDelete)
    setDataForDelete({
      ...dataForDelete, idDocument: data
    })
  }
  return (
    <>
      {loadingOneDoc && <Spinner />}
      {
        modal &&
        <CreateDocument
          departmentDane={resultOneDoc[0]?.code_dane || "60"}
          modal={modal}
          handleModal={handleModal}
          setShowAlert={setShowAlert}
          acronym={"MD"}
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
          message={'Your new municipality was created with success.'}
          event={"success"}
        />
      }
      {
        showAlertDelete &&
        <AlertInformation
          message={'Information has been deleted successfully.'}
          event={"success"}
        />
      }
      {
        modalDelete &&
        <DeleteDocuments
          ubication='Municipalitie'
          dataForDelete={dataForDelete}
          modalDelete={modalDelete}
          handleModalDelete={handleModalDelete}
          setShowAlertDelete={setShowAlertDelete}
        />
      }
      <Layout
        pageHeader={
          <PageHeader
            linkLabel={
              <Link
                className='links'
                to="/admin/app/department"
              >Return</Link>}
            title=
            {
              <FormattedMessage
                id="admin-department.details-detail"
              />
            }
          />
        }
      >
        <PageBlock variation="full">
          <div className='titleDetail'>
            {
              resultOneDoc &&
              <>
                <label
                  className="detailLabel"
                >Department:{' '}
                  <p> {resultOneDoc[0]?.label}</p>
                </label>
                <label
                  className="detailLabel"
                >DANE Code:{' '}
                  <p> {resultOneDoc[0]?.code_dane}</p>
                </label>
                <label
                  className="detailLabel"
                > Slug:{' '}
                  <p> {resultOneDoc[0]?.slug}</p>
                </label>
              </>
            }
          </div>
        </PageBlock>
        <BlockTable
          location={"Municipalities"}
          downloadDocument={<FormattedMessage
            id="admin-department.export.municipality"
          />}
          uploadDocument={<FormattedMessage
            id="admin-department.import.municipality"
          />}
          labelNew={<FormattedMessage
            id="admin-department.new.municipality"
          />}
          jsonschema={
            SchemasTableMuncipalitie(
              handleModalDelete,
              handleModalUpdate
            )
          }
          dataDisplay={resultMun}
          handleModal={handleModal}
        />
      </Layout>
    </>
  )
}
interface Props {
  params: any
}
export default DepartmentDetail
