import { useLoaderData } from "react-router-dom";
import { useState } from "react";
import { deleteClip, updateClip } from "../../router/api1";
import CreateClip from "../CreateClip";
import { useSelector } from "react-redux";

export default function Home() {
    const data = useLoaderData();
    const user = useSelector((state) => state.session.user);
    const [clips, setClips] = useState(data.clips || []);
    const [editClip, setEditClip] = useState(null);
    const [formData, setFormData] = useState({ title: "", description: "", file: null });

    if (!clips.length) {
        return <h1>Loading...</h1>;
    }

    const handleDelete = async (clip_id) => {
        if (window.confirm("Are you sure you want to delete this clip?")) {
            const response = await deleteClip(clip_id);

            if (response?.success) {
                setClips((prevClips) => prevClips.filter((clip) => clip.id !== clip_id));
            } else {
                console.error("Delete failed:", response.errors || "Unknown error");
            }
        }
    };

    const handleEdit = (clip) => {
        setEditClip(clip.id);
        setFormData({ title: clip.title, description: clip.description, file: null });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setFormData((prev) => ({ ...prev, file: e.target.files[0] }));
    };

    const handleUpdate = async (clip_id) => {
        const updatedClip = new FormData();
        updatedClip.append("user_id", user.id);
        updatedClip.append("title", formData.title);
        updatedClip.append("description", formData.description);

        if (formData.file) {
            updatedClip.append("file_url", formData.file); 
        }

        const response = await updateClip(clip_id, updatedClip);

        if (response?.success) {
            setClips((prevClips) =>
                prevClips.map((clip) =>
                    clip.id === clip_id ? { ...clip, ...response.clip } : clip
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
                            <label>
                                Title:
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                />
                            </label>
                            <label>
                                Description:
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                />
                            </label>
                            <label>
                                Upload New Clip:
                                <input type="file" accept="video/*" onChange={handleFileChange} />
                            </label>
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
