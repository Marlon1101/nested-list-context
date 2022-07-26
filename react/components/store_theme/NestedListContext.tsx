import React, { useEffect, useState }
  from 'react'
import {
  ActionMenu,
} from 'vtex.styleguide'
import { getAllDocuments }
  from '../../utils/allQueries'
import { useLazyQuery }
  from 'react-apollo'
import GET_FILTER_DOCUMENT
  from '../../graphql/getAllQueries.graphql'
import documentSerializer
  from '../../utils/serializer'
import { pathOr }
  from 'ramda'
import '../../styles.global.css'

const NestedListContext = () => {

  const [municipalities, setMunicipalities] = useState([{}])
  const [
    resultAllDocs,
    errorAllDocs,
    loadingAllDocs
  ] = getAllDocuments("DD", ["label", "code_dane"])
  const [goingQuery, setGoingQuery] = useState(false)
  const [value, setValue] = useState()
  const [department, setDepartment] = useState()
  const [searchMun, setSearchMun] = useState(false)
  const options = resultAllDocs?.map((
    { code_dane, label }: any) => {
    return {
      value: code_dane,
      label: label,
      onClick: ({ value,label }: any) => {
        setValue(value)
        setSearchMun(true)
        setDepartment(label)
      }
    }
  })


  const [getMunicipalities] = useLazyQuery(GET_FILTER_DOCUMENT, {
    onCompleted(data) {
      if (goingQuery) {
        const resulData = documentSerializer(pathOr([], ['documents'], data))
        setMunicipalities(resulData.map((
          { slug, label }: any) => {
          return {
            value: slug,
            label: label,
            onClick: ({ value }: any) => {
              location.replace(`${location.href}/${value}`)

            }
          }
        }))
        setGoingQuery(false)
      }
    },
    fetchPolicy: "no-cache"
  })
  errorAllDocs &&
    console.log("ERROR DEP", errorAllDocs);
  loadingAllDocs &&
    console.log("LOADING DEP", loadingAllDocs);
  useEffect(() => {
    if (searchMun) {
      setGoingQuery(true)
      getMunicipalities({
        variables: {
          acronym: "MD",
          fields: [
            "label", "slug"
          ],
          where: `code_department=${value}`
        }
      }
      )
    }
    setSearchMun(false)
  }, [searchMun])
  return (
    <div className="containerNested">
      <div className="mb1">
        <ActionMenu
          label= {department ? department : "Select Department"}
          options={options}
          buttonProps={{
            variation: 'tertiary',
            iconPosition: 'right',
            size: "small"
          }}
        />
      </div>
      {municipalities.length > 1 &&
        <div className="containerNestedMun">
          <ActionMenu
            label="Select Municipality"
            options={municipalities}
            buttonProps={{
              variation: 'tertiary',
              iconPosition: 'right',
              size: "small"
            }}
          />
        </div>
      }
    </div>
  )
}
export default NestedListContext;
