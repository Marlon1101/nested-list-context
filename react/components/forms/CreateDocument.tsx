import React, {
  useState
}
  from 'react'
import {
  Modal,
  Input,
  Button
} from 'vtex.styleguide'
import { useMutation }
  from 'react-apollo'
import CREATE_DOCUMENT
  from '../../graphql/createDocuments.graphql'
import { getAllDocuments }
  from '../../utils/allQueries'

type Props = {
  modal: boolean,
  handleModal: Function,
  setShowAlert: any,
  departmentDane: string,
  acronym: string
}

const CreateDocument = ({
  modal,
  handleModal,
  setShowAlert,
  departmentDane,
  acronym,
}: Props
) => {
  const codesDane: any = []
  const [data, setData] = useState({
    label: "",
    code_dane: "",
    code_dane2: ""
  })
  if (acronym === "MD") {
    const [resultMun,
      loadingMun,
      errorMun] = getAllDocuments("MD", ["code_dane"])
    codesDane.push(...resultMun.map((obj: any) => {
      return obj.code_dane
    }))
    console.log("muni", resultMun,
      loadingMun,
      errorMun);
  }
  if (acronym === "DD") {
    const [resultDep,
      loadingDep,
      errorDep] = getAllDocuments("DD", ["code_dane"])
    codesDane.push(...resultDep.map((obj: any) => {
      return obj.code_dane
    }))
    console.log("depar", resultDep,
      loadingDep,
      errorDep);
  }
  const [createDocument] = useMutation(CREATE_DOCUMENT, {
    onCompleted: () => {
      setShowAlert(true)
      handleModal()
      setTimeout(() => {
        setShowAlert(false)
      }, 5000);
    }
  })
  const handleChange = (e: any) => {
    setData({
      ...data,
      [e.target.name]: e.target.value
    }
    )
  }
  const handleClick = async () => {
    console.log("CREATE DOCUMENTS",
      data,
      acronym,);
    let fields: any;
    const aux = data.label
      .toLocaleLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/['"`)(]+/g, '')
      .replace(/ /g, '_')

    if (codesDane.length > 0) {
      if (codesDane.includes(data.code_dane)) {
        alert('Dane code already exists')
        return
      }
      if (acronym === "MD") {
        fields = [{
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
          value: departmentDane
        }
        ]
      }
      if (acronym === "DD") {
        fields = [{
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
      if (!codesDane.includes(data.code_dane)) {
        createDocument({
          variables: {
            acronym: acronym,
            document:
            {
              fields: fields
            }
          }
        })
      }
    }
    else { alert('Cant connect to the database, try again later.') }
    location.reload()
  }
  return (
    <Modal
      centered
      isOpen={modal}
      onClose={handleModal}>
      <div className="w-100 flex flex-column items-center justify-center">
        <h1>
          CREATE {" "}
          {acronym === "MD"
            ?
            'MUNICIPALITY'
            :
            'DEPARTMENT'
          }
        </h1>
        <div className="w-80 mv6">
          <Input
            onChange={handleChange}
            name="label"
            placeholder="Bogotá"
            size="large"
            label="Label"
          />
        </div>
        <div className="w-80 mv6">
          <Input
            onChange={handleChange}
            name="code_dane"
            placeholder="4444"
            size="large"
            label="Dane Code"
          />
        </div>
        {acronym === "MD" &&
          <div className="w-80 mv6">
            <Input
              onChange={handleChange}
              name="code_dane2"
              placeholder="4444"
              size="large"
              label="Dane Code 2"
            />
          </div>
        }
        <Button
          variation="primary"
          onClick={handleClick}
        >Create
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
export default CreateDocument
