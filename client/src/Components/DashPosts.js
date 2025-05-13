import { Button, Modal, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import { AiOutlineDelete } from 'react-icons/ai';
import { PiWarningBold } from 'react-icons/pi';
import { useSelector } from 'react-redux'

export default function DashPosts() {
  const {currentUser} = useSelector((state)=> state.user);
  const [userPost, setUserPost]= useState([]);
  const [showMore, setShowMore] = useState(true); 
  const [showmodal, setshowmodal] = useState(false);
  const [postIdtoDelete, setPostIdtoDelete] = useState(null);
  const [DeleteMessage, setDeleteMessage] = useState(null);
  const [errorMessage,setErrorMessage] = useState(null);
  console.log(userPost);
  useEffect(() => {
     const getpostdata=async()=>{
      try {
        const res = await fetch(`/api/post/getposts?userId=${currentUser._id}`);
        const data = await res.json();
        if(res.ok){
          setUserPost(data.posts);
          if(data.posts.length < 1){
            setShowMore(false);
          }
        }
        else{
           
        }
        
      } catch (error) {
        console.log(error)
      }
    }
    
    if(currentUser.isAdmin){
      getpostdata();
    }
  }, [currentUser._id])
  

  const handleShowMore = async()=>{
    const startIndex = userPost.length;
    try {
      const res = await fetch(`/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`);
      const data = await res.json();
      if(res.ok){
        setUserPost((prev)=> [...prev, ...data.posts]);
        if(data.posts.length < 1){
          setShowMore(false);
        }
      }
      else{
        
      }
    } catch (error) {
      
    }
  }


  const handleDeletePost= async()=>{
      try {
          const res = await fetch(`/api/post/deletepost/${postIdtoDelete}/${currentUser._id}`,{
            method: 'DELETE'
          });

          const data = await res.json();
          if(res.ok){
            setDeleteMessage('post has been deleted');
            setErrorMessage(data.message);
          }
          
      } catch (error) {
        console.log(error)
      }

      setshowmodal(false);
  }
  return (
      <div className='w-48'>
      <Table className='w-48'>
        <TableHead>
          <TableHeadCell>DATE UPDATE</TableHeadCell>
          <TableHeadCell>POST IMAGE</TableHeadCell>
          <TableHeadCell>POST TITLE</TableHeadCell>
          <TableHeadCell>CATEGORY</TableHeadCell>
          <TableHeadCell>DELETE</TableHeadCell>
          <TableHeadCell>EDIT</TableHeadCell>
        </TableHead>
        {userPost.map((posts)=> <TableBody>
        <TableRow>
          <TableCell>{new Date(posts.createdAt).toLocaleDateString()}</TableCell>
          <TableCell><img src={posts.image} alt="" width={30} height={20} /></TableCell>
          <TableCell>{posts.title}</TableCell>
          <TableCell>{posts.categories}</TableCell>
          <TableCell><Button onClick={()=>{setshowmodal(true); setPostIdtoDelete(posts._id)}}>Delete</Button></TableCell>
          <TableCell><Button>Update </Button></TableCell>
          </TableRow>
        </TableBody>)}
      </Table>

      {
        showMore && 
       (<button onClick={handleShowMore} className='mb-6 text-yellow-300 text-center border-solid border-yellow-300 m-auto'>+Show More</button>)
      }
      <Modal show={showmodal} onClose={()=>{setshowmodal(false)}} popup size={'md'}  >
              <Modal.Header />
              <Modal.Body>
                <div className="flex flex-col">
                  <PiWarningBold className="w-14 h-14 m-auto dark:text-white"/>
                  <div className="m-auto mb-3">Are you sure you want to delete Your Account</div>
                </div>
                <div className="flex flex-row m-auto justify-between">
                <Button color={'red'} className="bg-red-600 text-white hover:text-black" onClick={()=>handleDeletePost()}>Yes i'm sure {<AiOutlineDelete className="text-xl text-black dark:text-white"/> }</Button>
                <Button color={'red'} onClick={()=>{setshowmodal(false)}}>Cancel</Button>
                </div>
              </Modal.Body>
            </Modal>

      </div>
  )

}
