import { useQuery }
  from 'react-apollo'
import { pathOr }
  from 'ramda'
import documentSerializer
  from './serializer'
import GET_ALL_DOCUMENTS
  from '../graphql/getAllQueries.graphql'

  
const getAllDocuments = (
  acronym: string,
  fields: any
) => {
  const {
    data,
    loading,
    error
  } = useQuery(GET_ALL_DOCUMENTS, {
    variables: {
      acronym: acronym,
      fields: fields
    },
    fetchPolicy: "no-cache"
  })
  const resultAllDocs = documentSerializer(
    pathOr([], ['documents'], data))
  const errorAllDocs = error
  const loadingAllDocs = loading
  return [
    resultAllDocs,
    loadingAllDocs,
    errorAllDocs
  ]
}
const getMunicipalitiesDepart = (
  code_dane: string
) => {
  const {
    data,
    loading,
    error
  } = useQuery(GET_ALL_DOCUMENTS, {
    variables: {
      acronym: "MD",
      fields: [
        "code_dane",
        "label",
        "slug",
        "code_dane",
        "code_dane2",
        "code_department"
      ],
      where: `code_department=${code_dane}`
    },
    fetchPolicy: "no-cache"
  })
  const resultMun = documentSerializer(
    pathOr([], ['documents'], data))
  const errorMun = error
  const loadingMun = loading
  return [
    resultMun,
    loadingMun,
    errorMun
  ]
}
const getOneDocument = (
  code_dane: string,
  acronym: string
) => {
  let fields;
  if (acronym === "DD") {
    fields = [
      "code_dane",
      "label",
      "code_dane",
      "slug"
    ]
  }
  if (acronym === "MD") {
    fields = [
      "code_dane",
      "label",
      "slug",
      "code_dane",
      "code_dane2",
      "code_department"
    ]
  }
  const {
    data,
    error,
    loading
  } = useQuery(GET_ALL_DOCUMENTS, {
    variables: {
      acronym: acronym,
      fields: fields,
      where: `id=${code_dane}`
    },
    fetchPolicy: "no-cache"
  })
  const resultOneDoc = documentSerializer(
    pathOr([], ['documents'], data))
  const errorOneDoc = error
  const loadingOneDoc = loading
  return [
    resultOneDoc,
    loadingOneDoc,
    errorOneDoc
  ]
}
export {
  getAllDocuments,
  getMunicipalitiesDepart,
  getOneDocument
}
