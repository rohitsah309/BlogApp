import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import store from "./store/store.js"
import {Authenticate, Login} from "./components/index.js"
import Home from "./pages/Home.jsx"
import AddPost from './pages/AddPosts.jsx'
import Signup from './pages/Signup.jsx'
import EditPost from './pages/EditPost.jsx'
import Post from './pages/Post.jsx'
import AllPost from './pages/AllPost.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element : <App />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/login",
        element: (
          <Authenticate authentication={false}>
            <Login />
          </Authenticate>
        )
      },
      {
        path: "/signup",
        element: (
          <Authenticate authentication={false}>
            <Signup />
          </Authenticate>
        )
      },
      {
        path: "/all-posts",
        element: (
          <Authenticate authentication>
            {" "}
            <AllPost />
          </Authenticate>
        )
      },
      {
        path: "/add-post",
        element: (
          <Authenticate authentication>
            {" "}
            <AddPost />
          </Authenticate>
        )
      },
      {
        path: "/edit-post/:slug",
        element: (
          <Authenticate authentication>
            {" "}
            <EditPost />
          </Authenticate>
        )
      },
      {
        path: "/post/:slug",
        element: <Post />
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={ store}>
      <RouterProvider router={router}>
        <App />
      </RouterProvider> 
    </Provider>
  </StrictMode>,
)
