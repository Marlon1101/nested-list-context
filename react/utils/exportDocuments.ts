import * as XLSX
  from "xlsx"

export const exportDocument = async (
  data: any,
  location: any
) => {
  let wb =XLSX.utils.book_new()
  if (data.length > 0) {
    let ws = XLSX.utils.json_to_sheet(data)
    XLSX.utils.book_append_sheet(wb, ws, `${location}`)
  }else {
    wb.SheetNames.push(`${location}`)
    let columnNames:any=[]

if (location === "Departments") {
  columnNames = [['code_dane', 'label']]
}
if ( location === "Municipalities") {
  columnNames = [['code_dane', 'label', 'code_department', 'code_dane2']]
}

    let ws =  XLSX.utils.aoa_to_sheet(columnNames)
    wb.Sheets[`${location}`] = ws
}

  XLSX.writeFile(wb, `${location}.xlsx`)
}
