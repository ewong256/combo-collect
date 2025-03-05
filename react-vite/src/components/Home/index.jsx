import { useLoaderData } from "react-router-dom";
import { useState } from "react";
import { deleteClip } from "../../router/api1";
import CreateClip from "../CreateClip";

export default function Home() {
    const data = useLoaderData();
    const [clips, setClips] = useState(data.clips || []);



    if (!data.clips) {
        return <h1>Loading...</h1>;
    }

    const handleDelete = async (clip_id) => {
        if (window.confirm("Are you sure you want to delete this clip?")) {
            const response = await deleteClip(clip_id)

            if (!response.errors) {
                setClips(clips.filter(clip => clip.id !== clip_id))
            } else {
                console.error("Delete failed:", response.errors)
            }
        }
    };

    return (
        <>
            <h1>COMBO COLLECT</h1>

            <CreateClip />

            {data.clips.map((el) => (
                <div key={el.id}>
                    <h2>{el.title}</h2>
                    <p>{el.description}</p>
                    {el.file_url && (
                        <video width="640" height="360" controls>
                            <source src={el.file_url} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    )}
                <button onClick={() => handleDelete(el.id)} style={{ color: "red" }}>
                        Delete
                    </button>
                </div>
            ))}
        </>
    );
}
