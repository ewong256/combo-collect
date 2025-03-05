export const getAllClips = async () => {
    const res = await fetch ('/api/clips')
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
