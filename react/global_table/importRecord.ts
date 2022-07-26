import { alreadyExists, createDocuments, filterInformation, formatCode, formatString }
  from "../utils/functionsrecords"
export const importRecords = async (
  codeList: any,
  createDocument: any,
  location: string,
  setStateRecords: any,
  setRepeatedRecords: any
) => {
  let codesDane = codeList
  let data: any;
  if (codesDane.length === 0) {
    setStateRecords({
      show: true,
      message: "An unexpected error has occurred, please try again",
      event: "error"
    })
    setTimeout(() => {
      setStateRecords({
        show: false,
        message: "",
        event: ""
      })
    }, 5000);
    return
  }
  const fileReader = new FileReader()
  let input = document.createElement('input');
  input.type = 'file';
  input.accept = '.csv'
  input.onchange = () => {
    fileReader
      .readAsText(input.files![0]);
  }
  input.click();
  var results: any = []
  fileReader.onload = async () => {
    let text = fileReader.result
    let dataWithDuplicates = (text as string).split(/\r?\n/);
    data = [...new Set(dataWithDuplicates)]
    let columnNames = data[0].split(",").map((obj: string) => { return formatString(obj) })
    if (location === "Departments") {
      const codeIndex: number = columnNames.indexOf('code_dane')
      const departmentIndex: number = columnNames.indexOf('label')
      if (codeIndex === -1 || departmentIndex === -1) {
        setStateRecords({
          show: true,
          message: "Wrong column names. Change column names according to the documentation, and try again",
          event: "error"
        })
        setTimeout(() => {
          setStateRecords({
            show: false,
            message: "",
            event: ""
          })
        }, 5000);
        return
      }
      let arrOfData = data
        .slice(1, data.length - 1).map((row: string) => {
          let valueArr = row.split(",");
          let slug = formatString(valueArr[departmentIndex])
          let dict = {
            dane_code: formatCode(valueArr[codeIndex]),
            department: valueArr[departmentIndex].replace(/['"`]+/g, ''),
            slug: slug
          }
          return dict
        })
      let filteredArr = filterInformation(arrOfData, codesDane)
      results.push(...alreadyExists(arrOfData, codesDane))
      await createDocuments(
        filteredArr,
        createDocument,
        "DD"
      )
      await results
      if (results.length > 0) {
        setStateRecords({
          show: true,
          message: "Success,  records were uploaded except for:",
          event: "warning"
        })
        setRepeatedRecords(results)
        setTimeout(() => {
          setStateRecords({
            show: false,
            message: "",
            event: ""
          })
          setRepeatedRecords([])
        }, 5000);
      }
      if (results.length <= 0) {
        setStateRecords({
          show: true,
          message: "Records uploaded succesfully",
          event: "success"
        })
        setTimeout(() => {
          setStateRecords({
            show: false,
            message: "",
            event: ""
          })
        }, 5000);
      }
    }
    if (location === "Municipalities") {
      const codeIndex: number = columnNames.indexOf('code_department')
      const departmentIndex: number = columnNames.indexOf('code_department')
      const municipalityCodeIndex: number = columnNames.indexOf('code_dane')
      const municipalityIndex: number = columnNames.indexOf('label')
      const munCodeIndex2: number = columnNames.indexOf('code_dane2')
      if (codeIndex === -1 || departmentIndex === -1 || municipalityCodeIndex === -1 || municipalityIndex === -1 || munCodeIndex2 === -1) {
        setStateRecords({
          show: true,
          message: "Wrong column names. Change column names according to the documentation, and try again",
          event: "error"
        })
        setTimeout(() => {
          setStateRecords({
            show: false,
            message: "",
            event: ""
          })
        }, 5000);
        return
      }
      let arrOfData = data
        .slice(1, data.length - 1)
        .map((row: string) => {
          let valueArr = row.split(",");
          let slug = formatString(valueArr[municipalityIndex])
          let dict = {
            dane_code: formatCode(valueArr[municipalityCodeIndex]),
            dane_code2: formatCode(valueArr[munCodeIndex2]) ? formatString(valueArr[munCodeIndex2]) : "",
            department_dane_code: formatCode(valueArr[codeIndex]),
            municipality: valueArr[municipalityIndex].replace(/['"`]+/g, ''),
            slug: slug
          }
          return dict
        })
      let filteredArr = filterInformation(arrOfData, codesDane)
      results.push(...alreadyExists(arrOfData, codesDane))
      await createDocuments(
        filteredArr,
        createDocument,
        "MD"
      )
      await results
      if (results.length > 0) {
        setStateRecords({
          show: true,
          message: "Records uploades except for:",
          event: "warning"
        })
        setRepeatedRecords(results)
        setTimeout(() => {
          setStateRecords({
            show: false,
            message: "",
            event: ""
          })
          setRepeatedRecords([])
        }, 5000);
      }
      if (results.length <= 0) {
        setStateRecords({
          show: true,
          message: "Records uploaded succesfully",
          event: "success"
        })
        setTimeout(() => {
          setStateRecords({
            show: false,
            message: "",
            event: ""
          })
        }, 5000);
      }
    }
  }
}
