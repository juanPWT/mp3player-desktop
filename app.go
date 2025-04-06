package main

import (
	"context"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	musicFolder string
	ctx         context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx

    // start server 
    go func() {
        http.HandleFunc("/stream", a.StreamMusic)   
        err := http.ListenAndServe("127.0.0.1:5050", nil)
        if err != nil {
            runtime.LogError(ctx, "Filed stream file music: "+err.Error() )
        }
    }()

    runtime.LogInfo(ctx, "Streaming server runnning in http://localhost:5050")
}

func (a *App) ChooseFolder() {
	folder, err := runtime.OpenDirectoryDialog(a.ctx, runtime.OpenDialogOptions{})
	if err != nil {
		fmt.Println("Error selecting folder: ", err)
		return
	}

	a.musicFolder = folder
	runtime.LogInfo(a.ctx, "Selected music folder: "+folder)
}

func (a *App) ListMusic() []string {
	if a.musicFolder == "" {
		return []string{}
	}

	files := []string{}

	// ambil musik dari folder
	err := filepath.Walk(a.musicFolder, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}

		if !info.IsDir() && filepath.Ext(path) == ".mp3" {
			files = append(files, path)
		}

		return nil
	})

	if err != nil {
		fmt.Println("Error get list music: ", err)
		return []string{}
	}

	return files
}

func (a *App) StreamMusic(w http.ResponseWriter, r *http.Request) {
	filepath := r.URL.Query().Get("file")
	file, err := os.Open(filepath)

	if err != nil {
		http.Error(w, "file not found", http.StatusNotFound)
		return
	}

	defer file.Close()

	w.Header().Set("Content-Type", "audio/mpeg")
	w.Header().Set("Accept-Ranges", "bytes")
	io.Copy(w, file)
}
