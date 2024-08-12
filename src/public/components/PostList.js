import { useEffect, useState } from "react";
import styles from "./PostList.module.css"
import { useRouter } from "next/router";

import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';


const ArticleList = ({list, type, countPerPage}) => {
  const [monitorSize, setMonitorSize] = useState(1000);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(1)
  const handleChange = (event, value) => {
    setPage(value);
  };
  const router = useRouter()
  const {id} = router.query

  const [listForThisPage, setListForThisPage] = useState([])

  useEffect(()=>{
    setPage(1)
    if(list.length%(countPerPage)===0)  setCount(list.length/countPerPage)
    else setCount((Math.trunc(list.length/(countPerPage+1))+1))
  },[list])


  //페이지에 따라 보이는 게시물 변경
  useEffect(()=> {
    const listForCurrentPage = list.slice((page-1)*countPerPage, (countPerPage*page))
    setListForThisPage(listForCurrentPage)
  },[page, list])

  function formatDateToYYYYMMDD(date) {
    if(date instanceof Date){
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
      const day = String(date.getDate()).padStart(2, '0');
    
      return `${year}-${month}-${day}`;
    } else return "-"
  }

  //***모니터 크기 측정 */
  
  useEffect(() => {
      const handleResize = () => {
      setMonitorSize(window.innerWidth);
      };  
  
      window.addEventListener('resize', handleResize);
  
      return () => {
      window.removeEventListener('resize', handleResize);
      };
  }, []);
  //**모니터 크기 측정 끝 */

  const handleItemclick = (postId) => {
    router.push(`/${id}/post/edit/${type}/${postId}`)
  }

  if(monitorSize>600)
  return(
    <div className={styles.main_container}>
      <div className={styles.header}>
        <div className={styles.no}>No</div>
        <div className={styles.title}>제목</div>
        <div className={styles.condition}>게제상태</div>
        <div className={styles.author}>작성자</div>
        <div className={styles.published_at}>작성일</div>
      </div>
      <ul className={styles.list}>
        {listForThisPage?.map((item, index) => (
          <li key={index} onClick={()=>handleItemclick(item.id)}>
            <div className={styles.no}>{list?.length-((10*(page-1))+index)}</div>
            <div className={styles.title}>{item.title}</div>
            <div className={item.condition==="게제중" ? `${styles.condition} ${styles.published}`:styles.condition}>{item.condition}</div>
            <div className={styles.author}>{item.author}</div>
            <div className={styles.published_at}>{item.publishedAt}</div>
          </li>
        ))}

      </ul>

      <div className={styles.center} style={{marginTop:"30px"}}>
        <Pagination count={count} page={page} onChange={handleChange} />
      </div>
    </div>
  )
  else
  return(
    <div className={styles.main_container}>
      <ul className={styles.list_mobile}>
        {listForThisPage?.map((item, index) => (
          <li key={index} onClick={()=>handleItemclick(item.id)}>
            <div className={styles.title}>{item.title}</div>
            <div className={item.condition==="게제중" ? `${styles.condition} ${styles.published}`:styles.condition}>{item.condition}</div>
            <div className={styles.published_at}>{item.publishedAt}</div>
          </li>
        ))}

      </ul>

      <div className={styles.center} style={{marginTop:"30px"}}>
        <Pagination count={count} page={page} onChange={handleChange} />
      </div>
    </div>
  )
          
}
export default ArticleList