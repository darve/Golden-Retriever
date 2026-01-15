import axios, { AxiosResponse } from 'axios';

interface SaveResponse {
    success: boolean;
    message?: string;
}

const save = async (filename: string, svg: string): Promise<SaveResponse> => {
    const response: AxiosResponse<SaveResponse> = await axios.post(
        'http://localhost:3001/save',
        { filename, svg }
    );
    return response.data;
};

const save_frame = async (
    filename: string,
    frame: string,
    png: string
): Promise<SaveResponse> => {
    const response: AxiosResponse<SaveResponse> = await axios.post(
        'http://localhost:3001/frame',
        { filename, frame, png }
    );
    return response.data;
};

export default {
    save,
    save_frame
};
