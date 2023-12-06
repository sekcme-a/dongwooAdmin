import { useEffect, useState } from "react";
import useUserData from "context/userData"
import { useRouter } from "next/router";
import { firestore as db } from "firebase/firebase";
import { CircularProgress } from "@mui/material";
import ApplicationList from "src/application/ApplicationList"

const Application = () => {
  const router = useRouter()
  const {id} = router.query
  const [list, setList] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(()=>{
    const fetchData = async () => {
      const query = await db.collection("team").doc("development").collection("applications").orderBy("createdAt", "desc").get()
      const docList = query.docs.map((doc) => {
        return {...doc.data(), id: doc.id}
      })  
      setList(docList)
      setIsLoading(false)
    }
    fetchData()
  },[])
  
  if(isLoading) return(
    <CircularProgress />
  )

  return(
    <>
      <ApplicationList list={list} type="contact" countPerPage={10}/>
    </>
  )
}

export default Application