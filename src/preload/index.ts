import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const API = {
  // voice
  startVoiceRecording: (callback: () => void) => ipcRenderer.on('c-startVoiceRecording', callback),
  stopVoiceRecording: (callback: () => void) => ipcRenderer.on('c-stopVoiceRecording', callback),
  onNewMp3Blob: (blob: ArrayBuffer) => ipcRenderer.send('c-onNewMp3Blob', blob)
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', API)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = API
}
