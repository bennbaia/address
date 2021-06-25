import './App.css';
import React, { useState, useEffect } from 'react';
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import db from "./firebase";
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField';

function App() {
  const [addresses, setAddress] = useState(null)
  const [showAddNew, setShowAddNew] = useState(false)
  const [newPic, setNewPic] = useState("")
  const [newFName, setNewFName] = useState("")
  const [newLName, setNewLName] = useState("")
  const [newEmail, setNewEmail] = useState("")
  const [newPhone, setNewPhone] = useState("")
  const [showEdit, setShowEdit] = useState(false)
  const [editRow, setEditRow] = useState(-1)
  const [editPic, setEditPic] = useState("")
  const [editFName, setEditFName] = useState("")
  const [editLName, setEditLName] = useState("")
  const [editEmail, setEditEmail] = useState("")
  const [editPhone, setEditPhone] = useState("")
  const [searchName, setSearchName] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    getAllAddresses()
  }, [])

  const getAllAddresses = () => {
    let list = []

    db.collection('addresses').get().then(
      snap => snap.docs.forEach((item) => list.push([item.data(), item.id]))
    ).then(() => setAddress([...list]))
  }

  const handleAddNew = () => {
    setShowAddNew(true)
  }

  const handleCancelAdd = () => {
    setShowAddNew(false)
    clearNew()
  }

  const handleSubmitNewRecord = () => {
    if (verifyEmail(newEmail) === false || verifyPhone(newPhone) == false) {
      setError("invalid email/phone")
    } else {
      db.collection('addresses').doc().set({
        pic: newPic,
        firstName: newFName,
        lastName: newLName,
        phone: newPhone,
        email: newEmail
      })
      getAllAddresses()
      handleCancelAdd()
      setError("")
    }
  }

  const clearNew = () => {
    setNewPic("")
    setNewFName("")
    setNewLName("")
    setNewEmail("")
    setNewPhone("")
  }

  const handleDelete = (id) => {
    db.collection("addresses").doc(id).delete().then( () => {
      getAllAddresses()
    })
  }

  const handleShowEdit = (i, row) => {
    setShowEdit(true)
    setEditRow(i)
    setEditPic(row.pic)
    setEditFName(row.firstName)
    setEditLName(row.lastName)
    setEditEmail(row.email)
    setEditPhone(row.phone)
  }

  const verifyEmail = (email) => {
    let res = false
    const re = /^[a-zA-Z0-9]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    res = re.test(String(email).toLowerCase())
    return res
  }

  const verifyPhone = (phone) => {
    let res = false
    const re = /^\d{3}\d{3}\d{4}$/
    res = re.test(String(phone))
    console.log(res)
    return res
  }

  const handleSave = (id) => {
    if (verifyEmail(editEmail) === false || verifyPhone(editPhone) == false) {
      setError("invalid email/phone")
    } else {
      db.collection('addresses').doc(id).set({
        pic: editPic,
        firstName: editFName,
        lastName: editLName,
        phone: editPhone,
        email: editEmail
      }).then(() => {
        setShowEdit(false)
        setEditRow(-1)
        getAllAddresses()
        setError("")
      })
    }

  }

  const sortByName = () => {
    let list = []

    db.collection('addresses').orderBy('firstName').get().then(
      snap => snap.docs.forEach((item) => list.push([item.data(), item.id]))
    ).then(() => setAddress([...list]))
  }

  const sortByPhone = () => {
    let list = []

    db.collection('addresses').orderBy('phone').get().then(
      snap => snap.docs.forEach((item) => list.push([item.data(), item.id]))
    ).then(() => setAddress([...list]))
  }

  const handleSearch = () => {
    let list = []

    db.collection('addresses').where("firstName", "==", searchName).get().then(
      snap => snap.docs.forEach((item) => list.push([item.data(), item.id]))
    ).then(() => setAddress([...list]))
  }

  const handleResetSearch = () => {
    getAllAddresses()
  }

  return (
    addresses &&
    <div className="App">
      <h1>AddressX</h1>
      <div>
        <Button onClick={() => sortByName()} style={{ backgroundColor: "lightGray", marginRight: "10px" }}>Sort Name</Button>
        <Button onClick={() => sortByPhone()} style={{ backgroundColor: "lightGray" }}>Sort Phone</Button>
      </div>
      <div style={{ margin: "10px" }}>
        <TextField placeholder="enter name" value={searchName} onChange={(e) => setSearchName(e.target.value)} />
        <Button onClick={() => handleSearch()} style={{ backgroundColor: "lightGray", marginLeft: "10px" }}>search</Button>
        <Button onClick={() => handleResetSearch()} style={{ backgroundColor: "lightGray", marginLeft: "10px" }}>reset search</Button>
      </div>
      <span style={{ color: "red" }}>{error}</span>
      <Table style={{ marginRight: "50px", fontSize: "100px" }}>
        <TableHead>
          <TableRow>
            <TableCell>pic</TableCell>
            <TableCell>name</TableCell>
            <TableCell>email</TableCell>
            <TableCell>phone</TableCell>
            <TableCell>alter</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {addresses.map((row, i) => (
            showEdit && (i === editRow) ?
              <TableRow key={i}>
                <TableCell><TextField onChange={(e) => setEditPic(e.target.value)} value={editPic} /></TableCell>
                <TableCell style={{ width: "50px" }}><TextField onChange={(e) => setEditFName(e.target.value)} value={editFName} />
                  <TextField onChange={(e) => setEditLName(e.target.value)} value={editLName} /></TableCell>
                <TableCell style={{ width: "50px" }}><TextField onChange={(e) => setEditEmail(e.target.value)} value={editEmail} /></TableCell>
                <TableCell><TextField onChange={(e) => setEditPhone(e.target.value)} value={editPhone} /></TableCell>
                <TableCell><Button style={{ color: "green", width: "10px" }} onClick={() => handleSave(row[1])}>Save</Button>
                  <Button style={{ color: "green", width: "50px" }} onClick={() => handleShowEdit(i, row[0])}>Edit</Button></TableCell>
              </TableRow>
              :
              <TableRow key={i}>
                <TableCell><img style={{ width: "50px" }} src={row[0].pic} /></TableCell>
                <TableCell style={{ width: "50px" }}>{row[0].firstName} {row[0].lastName}</TableCell>
                <TableCell style={{ width: "50px" }}>{row[0].email}</TableCell>
                <TableCell>{row[0].phone}</TableCell>
                <TableCell><Button style={{ color: "green", width: "10px" }} onClick={() => handleShowEdit(i, row[0])}>Edit</Button>
                  <Button style={{ color: "red", width: "10px" }} onClick={() => handleDelete(row[1])}>Delete</Button></TableCell>
              </TableRow>
          ))}
        </TableBody>
      </Table>
      {showAddNew &&
        <div>
          <TableRow>
            <TableCell style={{ width: "50px" }}><TextField value={newPic} onChange={(e) => setNewPic(e.target.value)} placeholder="pic url" /></TableCell>
            <TableCell style={{ width: "80px" }}><TextField value={newFName} onChange={(e) => setNewFName(e.target.value)} placeholder="first name" />
              <TextField value={newLName} onChange={(e) => setNewLName(e.target.value)} placeholder="last name" /></TableCell>
            <TableCell><TextField value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="email" /></TableCell>
            <TableCell><TextField value={newPhone} onChange={(e) => setNewPhone(e.target.value)} placeholder="phone" /></TableCell>
          </TableRow>
          <Button onClick={() => handleSubmitNewRecord()}>submit</Button>
          <Button onClick={() => handleCancelAdd()}>cancel</Button>
        </div>
      }
      <Button onClick={() => handleAddNew()}>Add New</Button>
    </div>
  );
}

export default App;
