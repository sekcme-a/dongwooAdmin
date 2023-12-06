

import { useEffect, useState } from "react";
import styles from "./ApplicationList.module.css"
import { useRouter } from "next/router";

import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';


const ApplicationList = ({list, type, countPerPage}) => {
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
    router.push(`/${id}/applicationdoc/${postId}`)
  }

  return(
    <div className={styles.main_container}>
      <div className={styles.header}>
        <div className={styles.no}>No</div>
        <div className={styles.name}>이름</div>
        <div className={styles.title}>전화번호</div>
        <div className={styles.read}>확인유무</div>  
        <div className={styles.published_at}>작성일</div>
      </div>
      <ul className={styles.list}>
        {listForThisPage?.map((item, index) => (
          <li key={index} onClick={()=>handleItemclick(item.id)}>
            <div className={styles.no}>{list?.length-((10*(page-1))+index)}</div>
            <div className={styles.name}>{item.name}</div>  
            <div className={styles.title}>{item.phoneNumber}</div>
            <div className={styles.read}>{item.unread ? "읽지않음":"읽음"}</div>
            <div className={styles.published_at}>{formatDateToYYYYMMDD(item?.createdAt.toDate())}</div>
          </li>
        ))}

      </ul>

      <div className={styles.center} style={{marginTop:"30px"}}>
        <Pagination count={count} page={page} onChange={handleChange} />
      </div>
    </div>
  )
  // else
  // return(
  //   <div className={styles.main_container}>
  //     <ul className={styles.list_mobile}>
  //       {listForThisPage?.map((item, index) => (
  //         <li key={index} onClick={()=>handleItemclick(item.id)}>
  //           <div className={styles.title}>{item.title}</div>
  //           <div className={item.condition==="게제중" ? `${styles.condition} ${styles.published}`:styles.condition}>{item.condition}</div>
  //           <div className={styles.published_at}>{formatDateToYYYYMMDD(item?.savedAt.toDate())}</div>
  //         </li>
  //       ))}

  //     </ul>

  //     <div className={styles.center} style={{marginTop:"30px"}}>
  //       <Pagination count={count} page={page} onChange={handleChange} />
  //     </div>
  //   </div>
  // )
          
}
export default ApplicationList