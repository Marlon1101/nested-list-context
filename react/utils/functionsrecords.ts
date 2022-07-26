export function formatString(
  data: string
) {
  return (data as string)
    .toString()
    .replace(/  +/g, ' ')
    .replace(/['"`]+/g, '')
    .replace(/ /g, '_')
    .toLocaleLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
}

export function formatCode(
  data: string
) {
  return (data as string)
    .toString()
    .replace(/  +/g, "")
    .replace(/['"`]+/g, "")
    .replace(/ /g, '')
    .toLocaleLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
}

export function filterInformation(
  info: any,
  infoExist: any
) {
  let filteredArr = info
    .filter((code: any) => {
      return !infoExist
        .includes(code.dane_code)
    })
  return filteredArr
}

export function alreadyExists(
  info: any,
  infoExist: any
) {
  let existingCodes = info
    .filter((code: any) => {
      return infoExist
        .includes(code.dane_code)
    })
  return existingCodes
}

export async function createDocuments(
  filteredArr: any,
  createDocument: any,
  acronym: string
) {
  if (acronym === "DD") {
    await Promise
      .all(filteredArr
        .map((obj: any) => createDocument({
          variables: {
            acronym: acronym,
            document: {
              fields: [
                {
                  key: "label",
                  value: obj.department
                },
                {
                  key: "slug",
                  value: obj.slug
                },
                {
                  key: "code_dane",
                  value: obj.dane_code
                }
              ]
            }
          }
        })))
  }
  if (acronym === "MD") {
    await Promise
      .all(filteredArr
        .map((obj: any) => createDocument({
          variables: {
            acronym: acronym,
            document: {
              fields: [
                {
                  key: "label",
                  value: obj.municipality
                },
                {
                  key: "slug",
                  value: obj.slug
                },
                {
                  key: "code_department",
                  value: obj.department_dane_code
                },
                {
                  key: "code_dane",
                  value: obj.dane_code
                },
                {
                  key: "code_dane2",
                  value: obj.dane_code2
                }
              ]
            }
          }
        })))
  }
}
