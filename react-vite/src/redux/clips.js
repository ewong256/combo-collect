 /* Created redux store for potential use in case I can't figure out react router v6 */

import {normalizer} from './utils'

const GET_ALL_CLIPS = 'clips/getAll'

const getAllClips = (payload) => {
    return {
        type: GET_ALL_CLIPS,
        payload,
    };
};


export const getAllClipsThunk = () => async (dispatch) => {
    const res = await fetch('/api/clips')

    if (res.ok) {
        const data = await res.json();

        dispatch(getAllClips(normalizer(data.clips)))
    } else {
        const errors = await res.json();
        return errors;
    };
};

export default function clipsReducer(state = {}, { type, payload }) {

    switch (type) {
        case GET_ALL_CLIPS:
            return { ...state, ...payload }

        default:
            return state
    };

};
