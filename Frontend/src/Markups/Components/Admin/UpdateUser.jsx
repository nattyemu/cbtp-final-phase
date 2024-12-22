

import React, { useState } from 'react'
import AuthService from '../../../Service/AuthService';

function UpdateUser({ data, onUpdate }) {
  const [form, setForm] = useState({
    role: data.role,
    firstName: data.profile?.firstName || '',
    middleName: data.profile?.middleName || '',
    lastName: data.profile?.lastName || '',
    sex: data.profile?.sex || '',
    email:data.email || ''
  });

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await AuthService.update(form);
      console.log(response)
      // alert(response.data.message);
      onUpdate(); // Trigger the callback to fetch updated data
    } catch (error) {
      console.error(error);
    }
  };
  const handleUpdateCallback = async () => {
    setShowUpdate(false); // Hide the update form
    await fetchData(); // Fetch updated data after submitting update
  };

  // console.log(props.data)
 
 

  

  
  // const handleUpdate=async (e)=>{
  //   e.preventDefault();


  //    console.log(form);
  //    const response = await AuthService.update(form)
     


  //   try {
      
  //     console.log(response.data.message)
  //     alert(response.data.message)
  //     props.fetchData()
      
  //   } catch (error) {
      
  //   }
  // }

  return (
    <>
    <div className='add-user  p-5 '> 
       <div className="add-user-container shadow ">
         <h2 className='text-center fs-2 fw-bold'>Update User</h2>
        <div>

         
    
        <div className="form-group">
          <label htmlFor="role">Role</label>
         <select  
         onChange={(e) => {
                  setForm({
                    ...form,
                    role: e.target.value.toUpperCase(),
                  });
                }}
                id="role" >
            <option value="">{form.role}</option>
            <option value="DEPARTMENT">Department</option>
            <option value="LIBRARY">Librarian</option>
            <option value="GARD">Gard</option>
            <option value="CAFE">CafeHead</option>
            <option value="SUPER_PROCTOR">Proctor Head</option>
            <option value="PROCTOR">Proctor</option>
            <option value="POLICE">Police Officer</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="firstName">First Name</label>
          <input
                  type="text"
                  id="firstName"
                  value={form.firstName}
                  onChange={(e) => {
                    setForm({
                      ...form,
                      firstName: e.target.value,
                    });
                  }}
                />        </div>
        <div className="form-group">
          <label htmlFor="middleName">Middle Name</label>
          <input
                  type="text"
                  id="middleName"
                  value={form.middleName}
                  onChange={(e) => {
                    setForm({
                      ...form,
                      middleName: e.target.value,
                    });
                  }}/>
              </div>

         
        <div className="form-group">
          <label htmlFor="lastName">Last Name</label>
          <input
                  type="text"
                  id="lastName"
                  value={form.lastName}
                  onChange={(e) => {
                    setForm({
                      ...form,
                      lastName: e.target.value,
                    });
                  }}
                />        
            </div>
        <select 
         onChange={(e) => {
                setForm({
                  ...form,
                  sex: e.target.value,
                });
              }}
              id="sex"
              >
            <option value="">{form.sex}</option>
            <option value="male">MALE</option>
            <option value="female">FEMALE</option>
          </select>
        
        
        
        <div className="form-group mt-3 ">
          <button onClick={handleUpdate} >Update</button>
        </div>
         </div>
    </div>
  </div>
    </>
  )
}

export default UpdateUser