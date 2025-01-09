import { Input } from "../global/input";
import Modal from "../global/modal";
import { React, Sweetalert2, pathname } from '../imports';
import { CellAlign, TableCellType, TableColumn } from '../types';
import { Table, TableRowAction } from "./table";

console.log("What?!")

const columns: TableColumn[] = [
  { label: "#", key: "no", sortable: true, cellType: TableCellType.Number, align: CellAlign.Center },
  { label: "Guest Name", key: "full_name", sortable: true, cellType: TableCellType.String, align: CellAlign.Center },
  { label: "Role", key: "role", sortable: true, cellType: TableCellType.String, align: CellAlign.Center },
  { label: "Email Address", key: "email", sortable: true, cellType: TableCellType.String, align: CellAlign.Center },
  { label: "School", key: "school", sortable: true, cellType: TableCellType.String, align: CellAlign.Center },
  { label: "Position", key: "position", sortable: true, cellType: TableCellType.String, align: CellAlign.Center },
  { label: "Action", key: "action", sortable: false, cellType: TableCellType.Custom, align: CellAlign.Center },
];

function EditGuest({
  formData,
  onChange,
}:
  {
    formData: any,
    onChange: (data: any) => void
  }) {
  return (
    <div className="p-8">
      <Input disabled type="email" label="Email Address" inputClassName="border-black" className="mb-2" labelColor="black" name="edit_email" placeholder="Email Address" value={formData.email} onChange={(e: any) => onChange({ ...formData, email: e.target.value })} required />
      <Input label="Full Name" inputClassName="border-black" className="mb-2" labelColor="black" name="edit_full_name" placeholder="Full Name" value={formData.full_name} onChange={(e: any) => onChange({ ...formData, full_name: e.target.value })} required />
      <Input disabled={(formData.position.length > 0 && formData.position.toLowerCase() !== "none")} required={!formData.position || formData.position.toLowerCase() === "none"} inputClassName="border-black" className="mb-2" labelColor="black" placeholder="Leave blank or type NONE if not a student" label="School" name="edit_school" value={formData.school} onChange={(e: any) => onChange({ ...formData, school: e.target.value })} />
      <Input disabled={(formData.school.length > 0 && formData.school.toLowerCase() !== "none")} required={!formData.school || formData.school.toLowerCase() === "none"} inputClassName="border-black" className="mb-2" labelColor="black" placeholder="Leave blank or type NONE if not an employee" label="Position" name="edit_position" value={formData.position} onChange={(e: any) => onChange({ ...formData, position: e.target.value })} />
      <Input readOnly inputClassName="border-black" className="mb-2" labelColor="black" placeholder="Why you want to access this hub?" label="Reasons" name="edit_reasons" value={formData.reasons} />
      <Input type="password" label="Password" inputClassName="border-black" className="mb-2" labelColor="black" name="edit_password" placeholder="Password (Leave blank if not change)" value={formData.password} onChange={(e: any) => onChange({ ...formData, password: e.target.value })} />
    </div>
  )
}


export default function GuestsPage() {
  console.log("in page?!")
  const [tableData, setTableData] = React.useState([])
  const [formData, setFormData] = React.useState({
    account: 'guest',
    full_name: '',
    email: '',
    password: '',
    school: '',
    position: '',
    reasons: '',
  })

  const onCloseModal = React.useCallback(() => {
    setFormData({
      account: 'guest',
      full_name: '',
      email: '',
      password: '',
      school: '',
      position: '',
      reasons: '',
    })
  }, [])

  const [openEditGuest, setOpenEditGuest] = React.useState(false)

  const onOpenEditGuest = React.useCallback((data: any) => {
    setFormData({
      account: 'guest',
      full_name: data.full_name,
      email: data.email,
      password: '',
      school: data.school || '',
      position: data.position || '',
      reasons: data.reasons
    })
    setOpenEditGuest(true)
  }, [])

  const fetchList = () => {
    fetch(pathname('/api/guest/all'))
      .then(response => response.json())
      .then(({ success, error }) => {
        if (error) {
          console.log(error);
        } else {
          setTableData(success.map((data: any, i: number) => {
            return {
              no: i + 1,
              id: data.id,
              created_at: data.created_at,
              full_name: data.full_name,
              email: data.email,
              role: data.role[0].toUpperCase() + data.role.substring(1),
              school: data.school || 'NONE',
              position: data.position || 'NONE',
              reasons: data.reasons,
              action: <TableRowAction id={data.id} onEdit={(id: any) => {
                if (id === data.id) {
                  onOpenEditGuest(data);
                }
              }} onDelete={(id: any) => {
                Sweetalert2.fire({
                  title: 'Are you sure?',
                  text: "You won't be able to revert this!",
                  icon: 'warning',
                  showCancelButton: true,
                  confirmButtonColor: '#3085d6',
                  cancelButtonColor: '#d33',
                  confirmButtonText: 'Yes, delete guest account!'
                }).then(({ isConfirmed }: any) => {
                  if (isConfirmed) {
                    fetch(pathname(`/api/guest/delete?id=${id}`), { method: 'DELETE' })
                      .then(response => response.json())
                      .then(({ success, error }) => {
                        if (!success) {
                          console.log(error);
                          Sweetalert2.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Failed to delete guest account: ' + error,
                            confirmButtonText: 'Try Again',
                          });
                        } else {
                          fetchList();
                          Sweetalert2.fire({
                            icon: 'success',
                            title: 'Deleted!',
                            text: 'Guest account has been deleted successfully.',
                            timer: 3000
                          });
                        }
                      })
                      .catch((er) => {
                        console.log(er);
                        Sweetalert2.fire({
                          icon: 'error',
                          title: 'Error',
                          text: 'Failed to delete guest account',
                          timer: 3000
                        });
                      })
                  }
                })
              }} />,
            }
          }))
        }
      })
      .catch((e) => {
        console.log(e);
        Sweetalert2.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to fetch guest list',
          confirmButtonText: 'Try Again',
          showCancelButton: true,
        }).then(({ isConfirmed }: any) => {
          if (isConfirmed) {
            setTimeout(() => fetchList(), 50);
          }
        })
      })
  };

  React.useEffect(() => {
    fetchList();
  }, [])

  const handleEditGuest = React.useCallback(async (close: () => void) => {
    console.log(formData)
    try {
      const response = await fetch(pathname('/api/update'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          school: !formData.school ? 'none' : formData.school,
          position: !formData.position ? 'none' : formData.position
        }),
      })
      const data = await response.json()

      if (data.success) {
        close()
        onCloseModal()
        Sweetalert2.fire({
          icon: 'success',
          title: 'Success',
          text: 'Guest account has been updated successfully.',
          timer: 3000
        })
        setTimeout(() => fetchList(), 100)
      } else {
        Sweetalert2.fire({
          icon: 'error',
          title: 'Failed',
          text: data.error,
        })
      }
    } catch (e) {
      console.log(e)
      Sweetalert2.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update guest account',
        confirmButtonText: 'Try Again',
        showCancelButton: true,
      }).then(({ isConfirmed }: any) => {
        if (isConfirmed) {
          setTimeout(() => handleEditGuest(close), 100)
        }
      })
    }
  }, [formData]);

  return (<>
    <div className="w-full min-h-[calc(100vh-160px)] h-fit text-black p-4 min-w-fit">
      <h1 className="text-black text-2xl my-2">Guest List</h1>
      <Table columns={columns} items={tableData}>
        {/* Additional Toolbar Button */}
        <div className="px-4">
          {/* Refresh Button */}
          <button type="button" onClick={() => fetchList()} className="hover:text-yellow-500" title="Refresh List"><span className="material-symbols-outlined">refresh</span></button>
        </div>
      </Table>
    </div>
    <Modal open={openEditGuest} header={'Edit Guest Account'} content={<EditGuest formData={formData} onChange={setFormData} />} onConfirm={handleEditGuest} onCancel={onCloseModal} onClose={() => setOpenEditGuest(false)} />
  </>)
}

