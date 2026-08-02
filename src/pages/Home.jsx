import {useEffect, useState} from 'react'
import services from "../appwrite/config";
import {Container, PostCard} from '../components'
import { useSelector } from 'react-redux';


function Home() {
    const [posts, setPosts] = useState([])
    const authStatus = useSelector((state) => state.auth.status);
    
    useEffect(() => {
        if (!authStatus) return;

        const fetchPosts = async () => {
            const posts = await services.getPosts();

            if (posts) {
                setPosts(posts.documents);
            }
        };

        fetchPosts();
    }, [authStatus]);

  
    if (!authStatus) {
        return (
            <div className="w-full py-8 mt-4 text-center">
                <Container>
                    <div className="flex flex-wrap">
                        <div className="p-2 w-full">
                            <h1 className="text-2xl font-bold hover:text-gray-500">
                                Login to read posts
                            </h1>
                        </div>
                    </div>
                </Container>
            </div>
        )
    }
    if (posts.length === 0) {
        return (
            <div className="w-full py-8 mt-4 text-center">
                <Container>
                    <h1 className="text-2xl font-bold">
                    No posts available
                    </h1>
                </Container>
            </div>
        );
    }
    return (
        <div className='w-full py-8'>
            <Container>
                <div className='flex flex-wrap'>
                    {posts.map((post) => (
                        <div key={post.$id} className='p-2 w-1/4'>
                            <PostCard {...post} />
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    )
}

export default Home