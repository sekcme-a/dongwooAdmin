import { useState, useEffect } from "react"
import { firestore as db } from "firebase/firebase"
import { TextField, Button } from "@mui/material"

const AddTeam = () => {
  //*****for inputs
  const [values, setValues] = useState({
    teamId: "",
    teamName:"",

  })
  const onValuesChange = (prop) => (event) => {
      setValues(prevValues => ({...prevValues, [prop]: event.target.value}))
  }
  const handleValues = (type, value) => {
    setValues(prevValues => ({ ...prevValues, [type]: value }))
  }
  //for inputs*****

  const onButtonClick = async () => {
    const is_team_exists = async() => {
      const doc = await db.collection("team").doc(values.teamId).get()
      return doc.exists
    }

    if(values.teamId && values.teamName) {
      const res = await is_team_exists()
      if(res)
        alert("이미 있는 팀 ID입니다.")
      else{
        await db.collection("team").doc(values.teamId).set({
          ...values,
          profile: "/images/logo.png"
        })
        await db.collection("team_admin").doc(values.teamId).set({
          users: []
        })
        alert("성공적으로 생성되었습니다.")
      }
    }

  }

  return(
    <div style={{padding: "30px 40px"}}>
      <TextField
        label="팀 ID"
        variant="standard"
        value={values.teamId}
        onChange={onValuesChange("teamId")}
        size="small"
        fullWidth
      />
      <TextField
        label="팀명"
        variant="standard"
        value={values.teamName}
        onChange={onValuesChange("teamName")}
        size="small"
        fullWidth
      />
      <Button
        variant="contained"
        onClick={onButtonClick}
        sx={{mt:"20px"}}
        fullWidth
      >
        팀 생성
      </Button>
    </div>
  )
}

export default AddTeam