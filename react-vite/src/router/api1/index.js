export const getAllClips = async () => {
    const res = await fetch ('/api/clips')
    const data = await res.json()

    return data
}

export const getClipById = async (clip_id) => {
    const res = await fetch(`/api/clips/${clip_id}`);
    const data = await res.json()

    return data
}

export async function updateClip(clip_id, updatedData) {
    const response = await fetch(`/api/clips/${clip_id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
        return { errors: await response.json() };
    }

    return { success: true, clip: await response.json() };
}

export const postNewClip = async ({ request }) => {
    const newClip = await request.formData()

    const res = await fetch('/api/clips', {
        method: "POST",
        body: newClip,
    })

    if (res.ok) {
        const data = await res.json()
        return data
    } else {
        const errors = await res.json()
        return { errors }
    }
}


export const deleteClip = async (clip_id) => {
    const res = await fetch(`/api/clips/${clip_id}`, {
        method: "DELETE",
    })

    if (res.ok) {
        return await res.json()
    } else {
        const errors = await res.json()
        return { errors }
    }
}
