import { useLoaderData } from "react-router-dom";
import { useState } from "react";
import { deleteClip, updateClip } from "../../router/api1";
import CreateClip from "../CreateClip";

export default function Home() {
    const data = useLoaderData();
    const [clips, setClips] = useState(data.clips || []);
    const [editClip, setEditClip] = useState(null);
    const [formData, setFormData] = useState({ title: "", description: "" });

    if (!clips.length) {
        return <h1>Loading...</h1>;
    }


    const handleDelete = async (clip_id) => {
        if (window.confirm("Are you sure you want to delete this clip?")) {
            const response = await deleteClip(clip_id);

            if (response?.success) {
                setClips((prevClips) => prevClips.filter(clip => clip.id !== clip_id));
            } else {
                console.error("Delete failed:", response.errors || "Unknown error");
            }
        }
    };


    const handleEdit = (clip) => {
        setEditClip(clip.id);
        setFormData({ title: clip.title, description: clip.description });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };


    const handleUpdate = async (clip_id) => {
        const response = await updateClip(clip_id, formData);

        if (response?.success) {
            setClips((prevClips) =>
                prevClips.map((clip) =>
                    clip.id === clip_id ? { ...clip, ...formData } : clip
                )
            );
            setEditClip(null);
        } else {
            console.error("Update failed:", response.errors || "Unknown error");
        }
    };

    return (
        <>
            <h1>COMBO COLLECT</h1>
            <CreateClip />

            {clips.map((el) => (
                <div key={el.id}>
                    {editClip === el.id ? (

                        <div>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                            />
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                            />
                            <button onClick={() => handleUpdate(el.id)}>Save</button>
                            <button onClick={() => setEditClip(null)}>Cancel</button>
                        </div>
                    ) : (

                        <>
                            <h2>{el.title}</h2>
                            <p>{el.description}</p>
                            {el.file_url && (
                                <video width="640" height="360" controls>
                                    <source src={el.file_url} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            )}
                            <button onClick={() => handleEdit(el)}>Edit</button>
                            <button onClick={() => handleDelete(el.id)} style={{ color: "red" }}>
                                Delete
                            </button>
                        </>
                    )}
                </div>
            ))}
        </>
    );
}
