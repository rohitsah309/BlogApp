import {useCallback, useEffect} from "react";
import { useForm, useWatch } from "react-hook-form";
import { Button, Input, RichTextEditor, Select } from "../index";

import services from "../../appwrite/config"
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PostForm({post}) {

    const { register, handleSubmit, setValue, control, getValues} = useForm({
        defaultValues: {
            title: post?.title || "",
            slug: post?.$id || "",
            content: post?.content || "",
            status: post?.status || "active",
        }
    });

    const navigate = useNavigate()
    const userData = useSelector((state) => state.auth.userData);
  


    const submit = async (data) => {
        if(post){
            const file = data.image[0] ? await services.uploadFile(data.image[0]) : null;

            
            if (file) {
                services.deleteFile(post.featuredImage)
            }
            
            const dbPost = await services.updatePost(post.$id,{
                ...data,
                featuredImage: file ? file.$id : undefined,
            })

            if(dbPost) {
                navigate(`/post/${dbPost.$id}`)
            }
        } else {
            const file = await services.uploadFile(data.image[0])
            console.log("Uploaded File:", file);
            if(file) {
                const fileId = file.$id
                data.featuredImage = fileId
                const dbPost = await services.createPost({...data, userId : userData.$id, featuredImage: fileId});

                if(dbPost) {
                    navigate(`/post/${dbPost.$id}`)
                }
            }
        }
    }

    const slugTransform = useCallback((value) => {
        if(value && typeof value === "string")
            return value
                .trim()
                .toLowerCase()
                .replace(/[^a-zA-Z\d\s]+/g, "-")
                .replace(/\s/g, "-");

        
        return "";                
    },[],);

    const title = useWatch({
        control,
        name : "title",
    })

    useEffect(() => {
        if(title !== undefined) {
            setValue("slug", slugTransform(title), {
                shouldValidate: true,
            });
        }
    
    }, [title, setValue, slugTransform])

    return (
        <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
            <div className="w-2/3 px-2">
                <Input 
                    label="Title :"
                    placeholder = "Title"
                    className="mb-4"
                    {...register("title", {required:true})}
                />
                <Input 
                    label= "slug"
                    placeholder = "slug"
                    className="mb-4"
                    {...register ("slug", {required:true})}
                    onInput = {(e) => {
                        setValue("slug",slugTransform(e.currentTarget.value), {shouldValidate : true});
                    }}
                />
                <RichTextEditor label="Content :" name="content" control={control} defaultValue={getValues("content")} />

            </div>
            <div className="w-1/3 px-2">
                <Input 
                    label="Featured Image"
                    type="file"
                    className="mb-4"
                    accept = "image/png, image/jpg, image/jpeg, image/gif"
                    {...register("image", {required:true})}
                />
                {post && (
                    <div className="w-full mb-4">
                        <img
                            src={services.getFileView(post.featuredImage)}
                            alt={post.title}
                            className="rounded-lg" 
                        />
                    </div>
                )}
                <Select
                options={["active", "inactive"]}
                label="status"
                className="mb-4"
                {...register("status", {required:true})}
                />
                <Button
                    type="submit"
                    bgColor= {post ? "bg-green-500" : undefined} className="w-full cursor-pointer">
                    {post ? "update" : "submit"}
                </Button>
            </div>
        </form>
    )
}