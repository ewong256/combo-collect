import { useNavigate, useParams } from "react-router-dom";
import { deleteClip } from "../../router/api1";

export default function DeleteClipConfirmation() {
    const navigate = useNavigate();
    const { clip_id } = useParams();

    console.log("Extracted clip_id from useParams:", clip_id); // Debugging

    const handleConfirmDelete = async () => {
        if (!clip_id) {
            console.error("Invalid clip_id:", clip_id);
            return;
        }

        const response = await deleteClip(clip_id);

        if (!response.errors) {
            console.log(`Clip ${clip_id} deleted successfully!`);
            navigate("/");
        } else {
            console.error("Delete failed:", response.errors);
        }
    };

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h2>Are you sure you want to delete this clip?</h2>
            <button onClick={handleConfirmDelete} style={{ color: "red", marginRight: "10px" }}>
                Yes, Delete
            </button>
            <button onClick={() => navigate("/")} style={{ color: "blue" }}>
                Cancel
            </button>
        </div>
    );
}
