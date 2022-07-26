import React, {
  useEffect,
  useState
} from 'react'
import {
  Modal,
  Input,
  Button
} from 'vtex.styleguide'
import { useMutation }
  from 'react-apollo'
import UPDATE_DEPARTMENT
  from '../../graphql/updateInformation.graphql'
import { getOneDocument }
  from '../../utils/allQueries'

type Props = {
  modal: boolean,
  handleModal: Function,
  dataForUpdate: any,
}
const UpdateDocument = ({
  modal,
  handleModal,
  dataForUpdate,
}: Props
) => {
  const { idDocument, acronym } = dataForUpdate
  const [
    resultOneDoc,
    loadingOneDoc,
    errorOneDoc
  ] = getOneDocument(
    idDocument,
    acronym
  )
  errorOneDoc &&
    console.log("ERROR UPDATE DOCUMENT", errorOneDoc);
  const [notButton, setNotButton] = useState(true)
  const [updateDocument] = useMutation(UPDATE_DEPARTMENT)
  const [data, setData] = useState<any>({
    label: "",
    code_dane: "",
    code_dane2: "",
  })
  useEffect(() => {
    if (acronym === "MD") {
      setData({
        label: resultOneDoc[0]?.label,
        code_dane: resultOneDoc[0]?.code_dane,
        code_dane2: resultOneDoc[0]?.code_dane2,
      })
    }
    if (acronym === "DD") {
      setData({
        label: resultOneDoc[0]?.label,
        code_dane: resultOneDoc[0]?.code_dane
      })
    }
  }, [loadingOneDoc])
  const handleChange = (e: any) => {
    setData({
      ...data, [e.target.name]: e.target.value
    })
    setNotButton(false)
  }
  const handleClick = async () => {
    let fields: any;
    const aux = data.label
      .toLocaleLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/['"`)(]+/g, '')
      .replace(/ /g, '_')

    if (acronym === "MD") {
      fields = [
        {
          key: "id",
          value: resultOneDoc[0].id
        }, {
          key: 'label',
          value: data.label
        },
        {
          key: 'slug',
          value: aux
        },
        {
          key: 'code_dane',
          value: data.code_dane
        },
        {
          key: 'code_dane2',
          value: data.code_dane2
        },
        {
          key: 'code_department',
          value: resultOneDoc[0].code_department
        }
      ]
    }
    if (acronym === "DD") {
      fields = [
        {
          key: "id",
          value: resultOneDoc[0].id
        }, {
          key: 'label',
          value: data.label
        }, {
          key: 'slug',
          value: aux
        }, {
          key: 'code_dane',
          value: data.code_dane
        }
      ]
    }
    updateDocument({
      variables: {
        acronym: acronym,
        document: {
          fields: fields
        }
      }
    })
    location.reload()
  }
  return (
    <Modal
      centered
      isOpen={modal}
      onClose={handleModal}>
      <div className="w-100 flex flex-column items-center justify-center">
        <h3 className='flex tc'>
          UPDATE <br />
          {acronym === "MD"
            ?
            'MUNICIPALITY'
            :
            'DEPARTMENT'
          }
        </h3>
        <div className="w-80 mv6">
          <Input
            onChange={handleChange}
            name="label"
            value={data.label}
            placeholder="Bogotá"
            size="large"
            label="Label"
          />
        </div>
        <div className="w-80 mv6">
          <Input
            onChange={handleChange}
            name="code_dane"
            value={data.code_dane}
            placeholder="4444"
            size="large"
            label="Dane Code"
          />
        </div>
        {acronym === "MD" &&
          <div className="w-80 mv6">
            <Input
              onChange={handleChange}
              value={data.code_dane2}
              name="code_dane2"
              placeholder="4444"
              size="large"
              label="Dane Code 2"
            />
          </div>
        }
        <Button
          variation="primary"
          disabled={notButton}
          onClick={handleClick}
        >Update
          {acronym === "MD"
            ?
            'Municipality'
            :
            'Department'
          }
        </Button>
      </div>
    </Modal>
  )
}
export default UpdateDocument
