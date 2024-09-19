export default function NewPost (){
    const addPost = async () => {   
        "use server";
        console.log("submitted")
    }




    return (
        <div>
            <h1>New Post</h1>
            <form action={addPost}>
                <input name="title" type="text" placeholder="Title" />
            </form>
        </div>
    )


}