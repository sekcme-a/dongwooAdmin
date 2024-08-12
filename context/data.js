import { createContext, useState, useEffect, useContext } from "react";
import { firestore as db } from "firebase/firebase";
import { useRouter } from "next/router";

const dataContext = createContext()

export default function useData(){
    return useContext(dataContext)
}

export function DataProvider(props){
  const router = useRouter()
  const {id} = router.query
    const [teamList, setTeamList] = useState()
    const [team, setTeam]= useState()

    const [posts, setPosts] = useState({})
    const [thumbnails, setThumbnails] = useState()

    useEffect(()=>{
      if(id) fetch_team(id)
    },[id])

    useEffect(()=>{
      console.log(posts)
    },[posts])
    useEffect(()=>{
      console.log(thumbnails)
    },[thumbnails])

    const fetch_team_list = async() => {
      const list = await db.collection("team").get()
      const list_refined = list.docs.map(doc => ({id: doc.id, ...doc.data()}))
      setTeamList(list_refined)
    }

    const fetch_team = async (id) => {
      const doc = await db.collection("team").doc(id).get()
      if(doc.exists)
        setTeam({
          ...doc.data()
        })
    }

    const fetch_post = async(postId) => {
      const doc = await db.collection("team").doc(id).collection("posts").doc(postId).get()
      if(doc.exists) setPosts(prevPosts => ({...prevPosts, [postId]: doc.data()}))
    }

    const fetch_thumbnails_list = async(type) => {
      console.log(type)
      const query = await db.collection("team").doc(id).collection("thumbnails").where("type","==",type).orderBy("publishedAt", "desc").orderBy("savedAt", "desc").get()
      const list = query.docs.map(doc => ({...doc.data(), id: doc.id}))
      setThumbnails({...thumbnails, [type]: [...list]})
    }


    const value = {
      teamList, setTeamList, fetch_team_list,
      team, setTeam, fetch_team,
      posts, setPosts, fetch_post,
      thumbnails, fetch_thumbnails_list
    }

    return <dataContext.Provider value={value} {...props} />
}