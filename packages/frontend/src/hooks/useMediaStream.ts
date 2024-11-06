import { useState, useEffect } from 'react';

export default function useMediaStream() {
    const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function getMediaStream() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                setMediaStream(stream);
            } catch (err) {
                setError("사용자의 카메라와 마이크에 접근하지 못했습니다.");
            }
        }

        getMediaStream();
    }, []);

    return { mediaStream, error };
}
