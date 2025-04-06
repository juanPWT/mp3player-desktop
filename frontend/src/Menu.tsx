import { useState, useEffect } from "react";
import { ChooseFolder, ListMusic } from "../wailsjs/go/main/App"
import Player from "./Player";

const Menu = () => {
    const [musicFiles, setMusicFiles] = useState<string[]>([]);
    const [currentMusic, setCurrentMusic] = useState<boolean>(false);
    const [playingNow, setPlayingNow] = useState<String>("");
    const [currentIndex, setCurrentIndex] = useState<number>(0);

    const chooseFolder = async () => {
        await ChooseFolder();
        refreshMusicList();
    };

    const refreshMusicList = async () => {
        const files = await ListMusic();
        setMusicFiles(files);
    };

    const onEnded = () => {
        if (currentIndex < musicFiles.length - 1) {
            setPlayingNow(musicFiles[currentIndex + 1].replace(/\\/g, "/").replace(".mp3", "").split("/").pop() || "")
            setCurrentIndex(currentIndex + 1)
        } else {
            setPlayingNow(musicFiles[0].replace(/\\/g, "/").replace(".mp3", "").split("/").pop() || "")
            setCurrentIndex(0)
        }
    }

    useEffect(() => {
        refreshMusicList();
    }, []);

    return (
        <div className="p-4 bg-gray-900 text-white rounded-lg">
            <button onClick={chooseFolder} className="p-2 md-2 border border-2 w-full border-purple-400 text-purple-400 rounded-lg hover:shadow hover:shadow-purple-400 cursor-pointer">Folder</button>
            {currentMusic && <p className="text-purple-400 text-lg md-2 font-bold">{playingNow}</p>}
            {currentMusic && <Player src={`http://localhost:5050/stream?file=${encodeURIComponent(musicFiles[currentIndex])}`} onEnded={onEnded} />}
            <ul className="mt-4">
                {musicFiles.map((file, index) => {
                    return (<li key={index} className="mt-2">
                        <button
                            onClick={() => {
                                setCurrentMusic(true)
                                setPlayingNow(file.replace(/\\/g, "/").replace(".mp3", "").split("/").pop() || "")
                                setCurrentIndex(index)
                            }
                            }
                            className="border p-2 border-purple-400 rounded-lg text-purple-400 hover:bg-purple-400 hover:text-white"
                        >
                            {file.replace(/\\/g, "/").split("/").pop()}
                        </button>
                    </li>);
                }
                )}
            </ul>
        </div>
    );
}

export default Menu
