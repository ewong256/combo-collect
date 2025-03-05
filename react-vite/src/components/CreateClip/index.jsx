import { Form, useSubmit, useActionData } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';

export default function CreateClip() {


    const user = useSelector((state) => state.session.user)
    const submit = useSubmit()

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState(null);
    const actionData = useActionData()
    const [error, setError] = useState('')

    const onSubmit = (e) => {
        e.preventDefault()

        const newClip = new FormData();
        newClip.append("user_id", user.id)
        newClip.append("title", title)
        newClip.append("description", description)
        newClip.append("file_url", file)

        submit(newClip, {method: 'post', encType: 'multipart/form-data'})
    }

    useEffect(() => {
        if (actionData && actionData.errors) {
            setError(actionData.errors.message || 'Something went wrong!');
        } else {
            setError('')
            setTitle('')
            setDescription('')
            setFile(null)
        }
    }, [actionData])

    return <>
        <h1>Post a new clip!</h1>
        <Form onSubmit={onSubmit}>
        {error.length !== 0 && <p style={{color: "red"}}>{error}</p>}
        <label>
                    Title:
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Description:
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </label>
                <label>
                    Upload Clip:
                    <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => setFile(e.target.files[0])}
                        required
                    />
                </label>
                <button type="submit">Upload</button>
        </Form>
    </>
}
