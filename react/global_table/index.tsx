import React, {
  useEffect,
  useState
} from 'react'
import {
  PageBlock,
  Table,
  ButtonPlain,
  Box,
} from 'vtex.styleguide'
import { FormattedMessage }
  from 'react-intl'
import {
  useMutation
} from 'react-apollo'
import { getAllDocuments }
  from '../utils/allQueries'
import CREATE_DOCUMENT
  from '../graphql/createDocuments.graphql'
import { exportDocument }
  from '../utils/exportDocuments'
import { importRecords }
  from './importRecord'
import AlertInformation
  from '../components/AlertInformation'
const schemaRepeted = {
  properties: {
    department: {
      title: 'NAME',
    },
    dane_code: {
      title: 'CODE DANE',
    }
  }
}
type Data = {
  label?: String
  slug?: String
  code_dane?: String
  code_dane2?: String
}
type Props = {
  jsonschema: Object
  dataDisplay: Array<Data>
  handleModal: Function
  labelNew: any
  uploadDocument: any
  downloadDocument: any
  location: string
}
const BlockTable = ({
  jsonschema,
  dataDisplay,
  handleModal,
  uploadDocument,
  downloadDocument,
  location,
  labelNew }: Props) => {
  let dataSliced: any = dataDisplay.length ? dataDisplay : []
  const totalPages = Math.ceil(dataDisplay.length / 10)
  const arrayPages: any = []
  const [allData, setAllData] = useState([])
  const [emptyStateLabel, /* setEmptyStateLabel */] = useState("")
  const [tableLength] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [slicedData, setSlicedData] = useState([])
  const [currentItemFrom, setCurrentItemFrom] = useState(1)
  const [currentItemTo, setCurrentItemTo] = useState(tableLength)
  const [createDocument] = useMutation(CREATE_DOCUMENT)
  const [searchValue, setSearchValue] = useState("")
  const [firstButtonDisabled, setFirstButtonDisabled] = useState(true)
  const [lastButtonDisabled, setLastButtonDisabled] = useState(false)
  const [stateRecords, setStateRecords] = useState({
    show: false,
    message: "",
    event: ""
  })
  const [repeatedRecords, setRepeatedRecords] = useState([])
  const goToPage = (
    currentPage: number,
    currentItemFrom: number,
    currentItemTo: number,
    slicedData: any) => {
    let currentItemFromValidate = currentItemFrom <= 0 ? 1 : currentItemFrom
    setCurrentPage(currentPage)
    setCurrentItemFrom(currentItemFromValidate)
    setCurrentItemTo(currentItemTo)
    setSlicedData(slicedData)
  }
  const handleFirstClick = () => {
    if (currentPage === 0) return
    const newPage = 1
    const itemFrom: any = 1
    const itemTo: any = 10
    const data = dataDisplay.slice(itemFrom - 1, itemTo)
    setFirstButtonDisabled(true)
    setLastButtonDisabled(false)
    goToPage(
      newPage,
      itemFrom,
      itemTo,
      data
    )
  }
  const handleLastClick = () => {
    const newPage: number = Math.ceil(dataDisplay.length / 10)
    const itemFrom: number = dataDisplay.length - 10
    const itemTo = dataDisplay.length
    const data = dataDisplay.slice(itemFrom, itemTo)
    setFirstButtonDisabled(false)
    setLastButtonDisabled(true)
    goToPage(
      newPage,
      itemFrom,
      itemTo,
      data
    )
  }
  const handlePrevClick = () => {
    if (currentPage === 0) return
    if (lastButtonDisabled) setLastButtonDisabled(false)
    const newPage = currentPage - 1
    const itemFrom: any = currentItemFrom < 10 ? 1 : currentItemFrom - tableLength
    const itemTo: any = currentItemFrom - 1
    const data = dataDisplay.slice(itemFrom - 1, itemTo)
    goToPage(
      newPage,
      itemFrom,
      itemTo,
      data
    )
  }
  const handleNextClick = () => {
    if (firstButtonDisabled) setFirstButtonDisabled(false)
    const newPage: number = currentPage + 1
    const itemFrom: number = currentItemTo + 1
    const itemTo = itemFrom + 9
    const data = dataDisplay.slice(itemFrom - 1, itemTo)
    goToPage(
      newPage,
      itemFrom,
      itemTo,
      data
    )
  }
  const handleNumberPage = (e: any, number: number) => {
    e.preventDefault()
    const newPage: number = number
    const itemFrom: number = number === 1 ? 1 : 10 * newPage - 10
    const itemTo = itemFrom + 9
    const data = dataDisplay.slice(itemFrom - 1, itemTo)
    if (newPage === 1) {
      setFirstButtonDisabled(true)
    }
    if (newPage === totalPages) {
      setLastButtonDisabled(true)
    }
    if (newPage > 1) {
      setFirstButtonDisabled(false)
    }
    if (newPage < totalPages) {
      setLastButtonDisabled(false)
    }
    goToPage(
      newPage,
      itemFrom,
      itemTo,
      data
    )
  }
  let codeList: any = []
  if (location === "Departments") {
    const [data] = getAllDocuments("DD", ["code_dane"])
    codeList.push(...data.map((obj: { code_dane: number }) => {
      return obj.code_dane
    }))
  }
  if (location === "Municipalities") {
    const [data] = getAllDocuments("MD", ["code_dane"])
    codeList.push(...data.map((obj: { code_dane: number }) => {
      return obj.code_dane
    }))
  }
  useEffect(() => {
    setAllData(dataSliced)
    setSlicedData(dataSliced.slice(0, 10))
  }, [dataDisplay])
  for (let i = 1; i <= totalPages; i++) {
    arrayPages.push(i)
  }
  const handleInputSearchChange = (e: any) => {
    setSearchValue(e.target.value.toLocaleLowerCase())
    if (searchValue.length < 2) {
      setSlicedData(allData.slice(0, 10))
    } else {
      const filteredData = allData.filter((element: any) => {
        return element.label.toLocaleLowerCase().includes(searchValue)
      })
      const slicedFilteredData = filteredData.slice(0, 10)
      setSlicedData(slicedFilteredData)
    }
  }
  const handleInputSearchClear = () => {
    setSearchValue("")
    setSlicedData(allData.slice(0, 10))
  }
  return (
    <>
      {stateRecords.show ?
        <AlertInformation
          message={stateRecords.message}
          event={stateRecords.event}
        />
        : null
      }
      {repeatedRecords.length ?
        <Box title="Repeated Data">
          <Table
            schema={schemaRepeted}
            items={repeatedRecords}
          />
        </Box>
        : null
      }
      <PageBlock variation="full">
        <Table
          schema={jsonschema}
          items={slicedData}
          toolbar={{
            emptyStateLabel: emptyStateLabel,
            inputSearch: {
              value: searchValue,
              placeholder: 'Search by name...',
              onChange: handleInputSearchChange,
              onClear: handleInputSearchClear,
            },
            density: {
              buttonLabel: 'Line density',
              lowOptionLabel: 'Low',
              mediumOptionLabel: 'Medium',
              highOptionLabel: 'High',
            },
            download: {
              label: downloadDocument,
              handleCallback: () => exportDocument(
                dataSliced,
                location
              )
            },
            upload: {
              label: uploadDocument,
              handleCallback: () => {
                importRecords(
                  codeList,
                  createDocument,
                  location,
                  setStateRecords,
                  setRepeatedRecords
                )
              }
            }
            ,
            fields: {
              label: 'Toggle visible fields',
              showAllLabel: 'Show All',
              hideAllLabel: 'Hide All',
            },
            newLine: {
              label: labelNew,
              handleCallback: () => handleModal(),
            },
          }}
          pagination={{
            onNextClick: handleNextClick,
            onPrevClick: handlePrevClick,
            currentItemFrom: currentItemFrom,
            currentItemTo: currentItemTo,
            textShowRows: 'Show rows',
            textOf: 'of',
            totalItems: dataDisplay?.length,
          }}
        />
        {
          dataDisplay?.length > 10 &&
          <div className="flex justify-around w-80">
            <ButtonPlain
              disabled={firstButtonDisabled}
              onClick={handleFirstClick}
            >
              {<FormattedMessage
            id=  "admin-department.button.first"
          />}
              </ButtonPlain>
            {
              arrayPages?.map((n: any) => (

                <ButtonPlain onClick={(e:any) => handleNumberPage(e, n)}  >{n}</ButtonPlain>

              ))
            }
            <ButtonPlain
              disabled={lastButtonDisabled}
              onClick={handleLastClick}
            >
 {<FormattedMessage
            id=  "admin-department.button.last"
          />}

            </ButtonPlain>
          </div>
        }
      </PageBlock>
    </>
  )
}
export default BlockTable
