import { useRef, useState, useEffect } from "react";
import Icon from "./Icons";

interface PlayerUse {
    src: string;
    onEnded: () => void;
}

const Player: React.FC<PlayerUse> = ({ src, onEnded }) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(true);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.5);
    const [showModalVolume, setShowModalVolume] = useState(false)

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.play();
        }
    }, []);

    const togglePlay = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
            audioRef.current.play();
        }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (audioRef.current) {
            audioRef.current.currentTime = Number(e.target.value);
            setCurrentTime(Number(e.target.value));
        }
    };

    return (
        <div className="bg-purple-700 text-white p-4 rounded-2xl shadow-lg w-full flex flex-col items-center gap-4">
            <ModalVolume hide={!showModalVolume} volume={volume} onChange={(v: number) => setVolume(v)} onClose={() => setShowModalVolume(false)} />
            <audio
                ref={audioRef}
                src={src}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={onEnded}
                autoPlay
            />
            <input
                type="range"
                min="0"
                max={duration}
                value={currentTime}
                onChange={handleSeek}
                className="w-full accent-purple-400"
            />

            <div className="flex justify-center gap-4 p-1">
                {/* Play/Pause */}
                <button
                    onClick={togglePlay}
                    className="bg-purple-500 p-3 rounded-full hover:bg-purple-600 transition"
                >
                    {isPlaying ? (
                        <Icon name="pause" color="white" />
                    ) : (
                        <Icon name="play" color="white" />
                    )}
                </button>

                {/* Volume Toggle */}
                <button
                    onClick={() => setShowModalVolume(prev => !prev)}
                    className="bg-purple-500 p-3 rounded-full hover:bg-purple-600 transition"
                >
                    <Icon name={"volume-2"} color="white" />
                </button>

                {/* Next Song */}
                {/* <button
                    onClick={() => console.log("Next song action")} // ganti ini sesuai logika playlist kamu
                    className="bg-purple-500 p-3 rounded-full hover:bg-purple-600 transition"
                >
                    <Icon name="skip-forward" color="white" />
                </button> */}
            </div>


        </div>
    );
};

type ModalVolumeUse = {
    hide: boolean
    volume: number
    onChange: (v: number) => void
    onClose: () => void
}

const ModalVolume: React.FC<ModalVolumeUse> = ({ hide, volume, onChange, onClose }) => {
    if (hide) return null;

    return (
        <div className="absolute bottom-24 bg-purple-700 text-white p-4 rounded-xl shadow-lg w-60">
            <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold">Adjust Volume</span>
                <button onClick={onClose} className="hover:text-gray-300 transition">
                    <Icon name="x" size={18} color="white" />
                </button>
            </div>
            <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => onChange(Number(e.target.value))}
                className="w-full accent-purple-400"
            />
            <div className="text-center mt-2 text-xs">{Math.round(volume * 100)}%</div>
        </div>
    );
}

export default Player;

