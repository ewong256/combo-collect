import { useLoaderData, useNavigate } from "react-router-dom";
import { useState } from "react";
import CreateClip from "../CreateClip";

export default function Home() {
    const data = useLoaderData();
    const navigate = useNavigate();
    // const [clips, setClips] = useState(data.clips || []);

    if (!data.clips) {
        return <h1>Loading...</h1>;
    }

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
            
                    <button onClick={() => navigate(`/clips/${el.id}/delete`)} style={{ color: "red" }}>
                        Delete
                    </button>
                </div>
            ))}
        </>
    );
}
