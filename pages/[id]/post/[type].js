import { useEffect, useState } from "react";
import useUserData from "context/userData"
import useData from "context/data";
import { useRouter } from "next/router";
import { Button, CircularProgress, TextField,InputAdornment } from "@mui/material";

import SearchIcon from '@mui/icons-material/Search';
import { firestore as db } from "firebase/firebase";
import styles from "src/post/announcement.module.css"

import PostList from "src/public/components/PostList";

const Posts = () => {
  const {user, userData} = useUserData()
  const {thumbnails,  fetch_thumbnails_list} = useData()
  const router = useRouter()
  const {id,type} = router.query

  const [publishedPostCount, setPublishedPostCount] = useState("")
  const [unpublishedPostCount, setUnpublishedPostCount] = useState("")

  const [input, setInput] = useState("")
  const [filteredList, setFilteredList] = useState([])

  const [isLoading, setIsLoading] = useState(true)

  useEffect(()=>{
    const fetchData = async () => {
      if(type) await fetch_thumbnails_list(type)
      setIsLoading(false)
    }
    fetchData()
  },[type])
  
  useEffect(()=> {
    if(thumbnails){
      let pc = 0
      let upc = 0
      thumbnails[type]?.map((post)=> {
        if(post.condition==="게제중") pc++
        else upc++
      })
      setPublishedPostCount(pc)
      setUnpublishedPostCount(upc)
    }
  },[thumbnails])

  useEffect(()=>{
    if(input==="" && thumbnails && thumbnails[type])
      setFilteredList(thumbnails[type])
  },[input, thumbnails])
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      const filteredData = filterData(thumbnails[type], input)
      setFilteredList(filteredData)
    }
  };
  const filterData = (list, input) => {
    return list.filter(item => {
      return Object.values(item).some(value =>
        String(value).toLowerCase().includes(input.toLowerCase())
      );
    });
  }



  const onNewClick = async () => {
    const doc = await db.collection("team").doc(id).collection("thumbnails").doc().get()

    router.push(`/${id}/post/edit/${type}/${doc.id}`)
  }
  
  return(
    <>
      <div className={styles.header_container}>
        {type!=='popup' ? 
        <h1>게제중 게시물 : {publishedPostCount}개 / 미게제 게시물 : {unpublishedPostCount}개</h1>
        :
        <h1>게제중 팝업 : {publishedPostCount}개 / 미게제 팝업 : {unpublishedPostCount}개</h1>
        }
        <Button
          variant="contained"
          onClick={onNewClick}
        >
          {type!=="popup" ? "+ 새 게시물" : "+ 새 팝업"}
        </Button>

      </div>
      <div style={{display:"flex", justifyContent:"flex-end", marginTop:"10px"}}>
        <TextField
          label="Search"
          variant="outlined"
          value={input}
          onChange={(e)=>setInput(e.target.value)}
          size="small"
          onKeyDown={handleKeyPress}
          InputProps={{
            endAdornment: <InputAdornment position="end"><SearchIcon /></InputAdornment>,
          }}
          className={styles.search_box}
        />
      </div>
      {isLoading ? <CircularProgress /> : <PostList list={filteredList} type={type} countPerPage={10} />}
    </>
  )
}

export default Posts