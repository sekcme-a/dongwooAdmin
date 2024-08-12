import { useEffect, useState } from "react";
import useUserData from "context/userData"
import { useRouter } from "next/router";
import useData from "context/data";

import { firestore as db } from "firebase/firebase";
import styles from "src/post/edit.module.css"
import { Button, CircularProgress, Grid, TextField, Checkbox, Switch } from "@mui/material";
import { BasketCheck, ViewCarousel } from "mdi-material-ui";

import Editor from "src/public/components/Editor";
import { storage } from "firebase/firebase";

import DropperImage from "src/public/components/DropperImage"


const Edit = () => {
  const {user, userData} = useUserData
  const {posts, setPosts, fetch_post,team} = useData()
  const router = useRouter()
  const {id, type,  postId} = router.query

  const [isPostLoading, setIsPostLoading] = useState(true)

  const [isImageLoading, setIsImageLoading] = useState(false)

  //새로 추가될 파일들 (file형식)
  const [fileList, setFileList] = useState([])
  //이전에 있었던 파일들 (파일명과 donwloadUrl 있음)
  const [prevFileList, setPrevFileList] = useState([])

  const [isLoading, setIsLoading] = useState(false)

  //*****for inputs
  const [values, setValues] = useState({
    content: "",
    title:"",
    author:"",
    condition:"미게제",
    isHeight: true,
    linkUrl:"",
    publishedAt: formatDateToYYYYMMDD(new Date())
  })
  const onValuesChange = (prop) => (event) => {
      setValues(prevValues => ({...prevValues, [prop]: event.target.value}))
  }
  const handleValues = (item, value) => {
    setValues(prevValues => ({ ...prevValues, [item]: value }))
  }
  const [error, setError] = useState({
    type:"",
    message:""
  })
  const handleError = (type, message) => { setError({type: type, message: message})}
  //for inputs*****

  useEffect(()=> {
    const asdf = async () => {
      const query = await db.collection("team").doc("dongwoomain").collection("posts").get()
      query.docs.map(doc => {
        db.collection("team").doc("dongwoomain").collection("posts").doc(doc.id).update({
          publishedAt: formatDateToYYYYMMDD(doc.data().savedAt.toDate())
        })
      })
    }
    // asdf()
  },[])

  useEffect(()=> {
    if(team&& team.teamName){
      setValues(prev=> ({
        ...prev,
        author: team.teamName
      }))
    }
  },[team])

  useEffect(()=>{
    const fetchData = async () => {
      await fetch_post(postId)
      setIsPostLoading(false)
    }
    fetchData()
  },[postId])

  useEffect(()=> {
    if(posts[postId]){
      setValues({...posts[postId]})
      setPrevFileList([...posts[postId].files])
    }
  },[posts])

  const onFileChange = (e) => {
    if (e.target.files[0] !== undefined) {
      if (e) {
        setFileList([
          ...fileList,
          {
            file: e.target.files[0]
          }
        ])
      }
    }
  }

  const onFileListDeleteClick = (file) => {
    let FL = [...fileList]
    let i = 0;
    FL.forEach((item) => {
      if(item!==undefined)
        if (item.file.name === file)
          delete FL[i]
      i++
    })
    setFileList([...FL])
  }

  const onPrevFileDeleteClick = (index) => {
    const after = prevFileList.filter((_,i) => i!==index)
    setPrevFileList(after)
  }


  const onContentChange = (html) => {
    handleValues("content", html)
  }


  const onSaveButtonClick = async () => {
    setIsLoading(true)
    console.log("hasdf")
    const files = await uploadFiles()

    const batch = db.batch()
    batch.set( db.collection("team").doc(id).collection("posts").doc(postId), {
      ...values,
      files: [...files,...prevFileList],
      type: type,
      savedAt: new Date(),
    })

    batch.set(db.collection("team").doc(id).collection("thumbnails").doc(postId),{
      title: values.title,
      publishedAt: values.publishedAt,
      savedAt: new Date(),
      type: type,
      condition: values.condition,
      author: values.author,
    } )

    await batch.commit()
    setValues({
      ...values,
      files:  [...files,...prevFileList],
    })
    alert("성공적으로 저장되었습니다.")
    setIsLoading(false)
  }
  const uploadFiles = async () => {
    let x;
    let filesURL="";
    return new Promise(async function (resolve, reject) {
      // fileList.forEach(async (file) => {
      //   if (file !== undefined) {
      //     x = await FileUpload("files", file.file, user.uid)
      //     filesURL = filesURL.concat( `${file.file.name}URLSTARTPOINT${x}URLENDPOINT`)
      //   }
      // })
      let files = []
      for (let i = 0; i < fileList.length; i++){
        if (fileList[i] !== undefined) {
          const fileRef = storage.ref().child(`post/${id}/${postId}/${i}`)
          await fileRef.put(fileList[i].file)
          const url = await fileRef.getDownloadURL()
          files.push({url : url, name: fileList[i].file.name})
        }
      }
      resolve(files)
    })
  }

  const onPublishButtonClick = async () => {
    setIsLoading(true)
    const files = await uploadFiles()
    const batch = db.batch()
    batch.set(db.collection("team").doc(id).collection("posts").doc(postId), {
      ...values,
      files:  [...files,...prevFileList],
      type: type,
      condition: "게제중",
      savedAt: new Date()
    } )

    batch.set(db.collection("team").doc(id).collection("thumbnails").doc(postId), {
      title: values.title,
      author: values.author,
      type: type,
      condition: "게제중",
      publishedAt: values.publishedAt,
      savedAt: new Date()
    })
    
     await batch.commit()

    setValues({
      ...values,
      files:  [...files,...prevFileList],
      condition: "게제중"
    })
    alert("성공적으로 게제되었습니다.")
    setIsLoading(false)
  }
  const onUnpublishButtonClick = async () => {
    setIsLoading(true)
    const batch = db.batch()
    batch.update(db.collection("team").doc(id).collection("posts").doc(postId), {condition: "미게제"})
    batch.update(db.collection("team").doc(id).collection("thumbnails").doc(postId), {condition: "미게제"})
    await batch.commit()
    setValues({...values, condition:"미게제"})
    alert("게제취소되었습니다.")
    setIsLoading(false)
  }

  const onDeleteClick = async () => {
    setIsLoading(true)
    
    if(confirm("해당 게시물을 삭제하시겠습니까?")){
      const batch = db.batch()
      batch.delete(db.collection("team").doc(id).collection("posts").doc(postId))
      batch.delete(db.collection("team").doc(id).collection("thumbnails").doc(postId))
      await batch.commit()

      alert("삭제되었습니다.")
      router.back()
    }
  }


  const handleImgUrl = async (url) => {
    console.log(url)
    setValues(prevValues => ({
      ...prevValues,
      thumbnailImg: url
    }))
    alert("적용되었습니다.")
  }


  function formatDateToYYYYMMDD(date) {
    if(date instanceof Date){
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
      const day = String(date.getDate()).padStart(2, '0');
    
      return `${year}-${month}-${day}`;
    } else return "-"
  }



  if(isPostLoading) return (<CircularProgress />)
  else 
  return(
    <>
      <h1>상태 : {values?.condition==="게제중" ? "게제중":"미게제"}</h1>
      <Grid container spacing={2} sx={{mt:"20px"}} className={styles.main_container}>

        <Grid item xs={12} md={8}>
          <TextField
            label="제목"
            variant="outlined"
            error={error.type==="title"}
            helperText={error.type!=="title" ? "" : error.message}
            value={values.title}
            onChange={onValuesChange("title")}
            size="small"
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={4} >
          <TextField
            label="작성자"
            variant="outlined"
            error={error.type==="author"}
            helperText={error.type!=="author" ? "" : error.message}
            value={values.author}
            onChange={onValuesChange("author")}
            size="small"
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={4} >
          <TextField
            label="게제일"
            variant="outlined"
            error={error.type==="publishedAt"}
            helperText={error.type!=="publishedAt" ? "" : error.message}
            value={values.publishedAt}
            onChange={onValuesChange("publishedAt")}
            size="small"
            fullWidth
          />
        </Grid>
        {type==="popup" &&
          <>
            <Grid item xs={12} style={{display:"flex", alignItems:"center"}}>
              <Switch
                checked={values.isHeight}
                onChange={(e) => setValues(prevValues=>({...prevValues, isHeight: e.target.checked}))}
              />
              <p>{values.isHeight===true ? "세로형" : "가로형"}</p>
            </Grid>
            <Grid item xs={12} style={{display:"flex", alignItems:"center"}}>
              <TextField
                label="이동할 경로 (https://를 포함한 전체 주소를 입력해주세요, 없으면 빈칸으로 설정)"
                variant="outlined"
                value={values.linkUrl}
                onChange={onValuesChange("linkUrl")}
                size="small"
                fullWidth
              />
            </Grid>
          </>
        }
        {type!=="announcement" && type!=="advertisement" && 
          <Grid item xs={12}>
            <h1>{type!=='popup' ? "썸네일 이미지" : "팝업 이미지"}</h1>
            <DropperImage imgURL={values.thumbnailImg} setImgURL={handleImgUrl} path={`data/post/${type}/${postId}`} setLoading={setIsImageLoading} />
            {isImageLoading  && <CircularProgress /> }
            
          </Grid>
        }
        {type!=="popup" && 
        <Grid item xs={12}>
          <div className={styles.file_container}>첨부파일 : <input type="file" name="selectedFile[]" onChange={onFileChange} />
            <div style={{marginTop:"10px"}} />
            {fileList && fileList.map((item, index) => {
              if (item !== undefined) {
                return (
                  <><h4 key={index} className={styles.files}>{item.file.name}<h4 className={styles.fileDelete} onClick={() => { onFileListDeleteClick(item.file.name) }}>X</h4></h4><br/></>
                )
              }
            })}
            {prevFileList && prevFileList.map((item, index) => {
              return(
                <>
                  <h4 key={index} className={styles.files}>{item.name}<h4 className={styles.fileDelete} onClick={() => { onPrevFileDeleteClick(index) }}>X</h4></h4><br/>
                </>
              )
            })}
          </div>
        </Grid>
        }

        {type!=='popup' && 
          <>
            <div className={styles.border} />

            <Editor path={`post/${id}/${postId}`} handleChange={onContentChange} textData={values.content}/>
          </>
        }

        <div style={{display:"flex", justifyContent:"space-between", width:"100%", marginTop:"60px"}}>
          <div>
            <Button
              variant="contained"
              onClick={onSaveButtonClick}
              disabled={isLoading}
            >
              {isLoading ? "저장중" : "저 장"}
            </Button>
            <Button
              variant="contained"
              onClick={!values.condition ? () => onPublishButtonClick() : values.condition==="미게제" ? () => onPublishButtonClick()  : () => onUnpublishButtonClick() }
              disabled={isLoading}
              color = {!values.condition ? "primary" : values.condition==="미게제" ? "primary" : "error" }
              sx={{ ml:"30px"}}
            >
              {!values.condition ? "게 제" : values.condition==="미게제" ? "게 제" : "게제취소"}
            </Button>
          </div>
          <div>
            <Button
              variant="contained"
              onClick={onDeleteClick}
              disabled={isLoading}
              color = "error"
              sx={{ml:"30px"}}
            >
              {type!=='popup' ? "게시물 삭제" : "팝업 삭제"}
            </Button>
          </div>
        </div>
      </Grid>
    </> 
  )
}

export default Edit