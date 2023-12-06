
import { Button } from "@mui/material"
import { useRouter } from "next/router"
import styles from "src/application/Applicationdoc.module.css"
import { useEffect, useState } from "react"
import { firestore as db } from "firebase/firebase"
import DownloadIcon from '@mui/icons-material/Download';

const ApplicationDoc = () => {
  const router = useRouter()
  const {postId} = router.query
  const [data, setData] = useState({})
  const [isLoading, setIsLoading] = useState(true)


  useEffect(()=>{
    const fetchData = async () => {
      const doc = await db.collection("team").doc("development").collection("applications").doc(postId).get()
      if(doc.exists){
        setData({...doc.data()})
        await db.collection("team").doc("development").collection("applications").doc(postId).update({unread: false})
        setIsLoading(false)
      } else {
        alert('삭제되거나 없는 문의입니다.')
        router.back()
      }
    }
    fetchData()
  },[])

  

  const onDeleteClick = async () => {
    if(confirm("정말로 삭제하시겠습니까?")){
      await db.collection("team").doc("development").collection("applications").doc(postId).delete()
      alert("성공적으로 삭제되었습니다.")
      router.back()
    }
  }



  return(
    <div className={styles.main_container}>
      <h1>작성일: <p>{data.createdAt?.toDate().toLocaleString()}</p></h1>
      <h1>신청인: <p>{data.name}</p></h1>
      <h3 className={styles.folder_text}>이력서 및 자기소개서</h3>
      <ul className={styles.folder}>
        {data?.fileList?.map((item, index) => (
          <li key={index} className={styles.file} onClick={()=>router.push(item.url)}>
            <DownloadIcon /><a target="_blank">{item.name}</a>
          </li>
        ))}
      </ul>
      <h1>전화번호: <p>{data.phoneNumber}</p></h1>
      <h2>지원하는 채용공고명 및 지원분야: <p>{data.text}</p></h2>
      <div className={styles.button_container}>
        <Button
          variant="contained"
          onClick={onDeleteClick}
          sx={{mt:"30px", mr:"30px"}}
          size="small"
          color="error"
        >
          {`삭제`}
        </Button>
        <Button
          variant="contained"
          onClick={()=> router.back()}
          sx={{mt:"30px"}}
        >
          {`< 돌아가기`}
        </Button>
      </div>
    </div>
  )
}

export default ApplicationDoc