import {useState, useEffect} from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import services from '../appwrite/config';
import { Button, Container } from '../components'
import parse  from 'html-react-parser';
import { useSelector } from 'react-redux';


export default function Post() {
    const [post, setPost] =useState(null);
    const navigate = useNavigate()
    const{slug} = useParams()

    const userData = useSelector((state) => state.auth.userData);

    const isAuthor = post && userData ? post.userId ===userData.$id : false;

    useEffect(() => {
        if(slug) {
            services.getPost(slug).then((post) => {
                if(post) {
                    setPost(post);
                    console.log(post)
                }
                else navigate("/");
            })
        } else navigate("/")
    },[slug, navigate])

    const deletePost = () => {
        services.deletePost(post.$id).then((status) => {
            if(status) {
                services.deleteFile(post.featuredImage);
                navigate("/")
            }
        });
    }
    

    if(!post) {
        return <div>Loading...</div>
    }
    const imageUrl = services.getFileView(post.featuredImage);
    console.log(imageUrl);
    
    return (
        <div className='py-8'>
            <Container>
                <div className='w-full flex justify-center mb-4 relative border rounded-xl p-2'>
                    {post && (
                        <img
                            src={services.getFileView(post.featuredImage)}
                            alt={post.title}
                            className='rounded-xl'
                    />
                    )}

                    {isAuthor && (
                        <div className='absolute right-6 top-6'>
                            <Link to={`/edit-post/${post.$id}`}>
                            <Button bgColor='bg-green-500' className='mr-3 cursor-pointer'>
                                Edit
                            </Button>
                            </Link>
                            <Button bgColor='bg-red-500' onClick = {deletePost} className='cursor-pointer'>
                                Delete
                            </Button>
                        </div>
                    )}
                </div>
                <div className='w-full mb-6'>
                    <h1 className='text2xl font-bold'>{post.title}</h1>
                </div>
                <div className='browser-css'>
                    {parse(post.content)}
                </div>
            </Container>
        </div>
    )
    
}