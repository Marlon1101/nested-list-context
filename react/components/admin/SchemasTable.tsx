import React
  from 'react'
import { FormattedMessage }
  from 'react-intl'
import {
  ButtonWithIcon,
  IconEdit,
  IconVisibilityOn,
  IconDelete,
}
  from 'vtex.styleguide'
import { Link }
  from 'vtex.render-runtime';

export function SchemasTableDepartment(handleModalDelete: any,
  handleModalUpdate: any,
) {
  return (
    {
      properties: {
        label: {
          title: <FormattedMessage
            id="admin-department.schema.label"
          />,
          with: 400
        },
        slug: {
          title: <FormattedMessage
            id="admin-department.schema.slug"
          />,
          with: 400
        },
        code_dane: {
          title: <FormattedMessage
            id="admin-department.schema.code_dane"
          />,
          with: 150
        },
        actions: {
          title: <FormattedMessage
            id="admin-department.schema.actions"
          />,
          cellRenderer: ({ rowData }: any) => {
            return (
              <div className='buttonsActions'>
                <Link
                  to={`/admin/app/department/detail/${rowData.id}`}
                >
                  <ButtonWithIcon
                    icon={<IconVisibilityOn
                      color={'green'} />}
                    variation="secondary"
                  />
                </Link>
                <ButtonWithIcon
                  onClick={(e: any) => handleModalUpdate(e, rowData.id)}
                  icon={<IconEdit />}
                  variation="secondary"
                />
                <div className='mr2'>
                  <ButtonWithIcon
                    onClick={(e: any) => handleModalDelete(e, rowData.id)}
                    icon={<IconDelete color={'red'} />}
                    variation="secondary"
                  />
                </div>
              </div>
            )
          }
        }
      },
    }
  )
}
export function SchemasTableMuncipalitie(
  handleModalDelete: any,
  handleModalUpdate: any
) {
  return (
    {
      properties: {
        label: {
          title: <FormattedMessage
            id="admin-department.schema.label"
          />,
          with: 100
        }
        ,
        slug: {
          title: <FormattedMessage
            id="admin-department.schema.slug"
          />,
          with: 100
        }
        ,
        code_dane: {
          title: <FormattedMessage
            id="admin-department.schema.code_dane"
          />,
          with: 60
        }
        ,
        code_dane2: {
          title: <FormattedMessage
            id="admin-department.schema.code_dane"
          />,
          with: 60
        },
        code_department: {
          title: <FormattedMessage
            id="admin-department.schema.code_department"
          />,
          with: 60
        },
        actions: {
          title: <FormattedMessage
            id="admin-department.schema.actions"
          />,
          cellRenderer: ({ rowData }: any) => {
            return (
              <div className='buttonsActions'>
                <ButtonWithIcon
                  onClick={(e: any) => handleModalUpdate(e, rowData.id)}
                  icon={<IconEdit />}
                  variation="secondary"
                />
                <div className='mr2'>
                  <ButtonWithIcon
                    onClick={(e: any) =>
                      handleModalDelete(e, rowData.id)}
                    icon={<IconDelete
                      color={'red'}
                    />}
                    variation="secondary"
                  />
                </div>
              </div>
            )
          }
        }
      },
    }
  )
}
