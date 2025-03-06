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
