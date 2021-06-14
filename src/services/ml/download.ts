import { createAction } from '@reduxjs/toolkit';
import * as FileSystem from 'expo-file-system';
import { SagaIterator } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import { PCSlice } from './slice';

async function ensureDirExists(targetDir: string) {
  const dirInfo = await FileSystem.getInfoAsync(targetDir);
  if (!dirInfo.exists) {
    console.log("Target directory doesn't exist, creating...");
    await FileSystem.makeDirectoryAsync(targetDir, { intermediates: true });
  }
}

export async function downloadFile(
  targetDir: string,
  url: string,
  fileName: string,
  callback?: (data: FileSystem.DownloadProgressData) => void
): Promise<string> {
  await ensureDirExists(targetDir);
  return new Promise(async (resolve, reject) => {
    try {
      const downloadResumable = FileSystem.createDownloadResumable(
        url,
        targetDir + fileName,
        {},
        callback
      );
      const result = await downloadResumable.downloadAsync();
      if (result) {
        console.log('Finished downloading to ', result.uri);
        resolve(result.uri);
      } else reject(result);
    } catch (e) {
      console.error("Couldn't download file:", e);
      reject(e);
    }
  });
}

export type DownloadTask = {
  name: string;
  url: string;
  dir: string;
  targetFile?: string;
  progressCb?: (data: FileSystem.DownloadProgressData) => void;
  finishCb?: (uri: string) => void;
};

export const downloadAction = createAction<DownloadTask>('downloadAction');

export function* sagaDownload(
  action: ReturnType<typeof downloadAction>
): SagaIterator {
  try {
    const task = action.payload;
    console.log(`Start downloading task: ${task.name}, URL: ${task.url}`);
    let fileName = task.targetFile;
    if (!fileName) {
      const urlSplit = task.url.split('/');
      fileName = urlSplit[urlSplit.length - 1];
    }
    const result = (yield call(
      downloadFile,
      task.dir,
      task.url,
      fileName,
      task.progressCb
    )) as string;
    if (task.finishCb) yield call(task.finishCb, result);
  } catch (err) {
    yield put(
      PCSlice.actions.setError({ code: -1, msg: err.toString(), show: true })
    );
  }
}

// export async function downloadFaceDetect(
//   callback?: (data: FileSystem.DownloadProgressData) => void
// ): Promise<string> {
//   const url =
//     'https://raw.githubusercontent.com/opencv/opencv/master/data/haarcascades/haarcascade_frontalface_alt2.xml';
//   return downloadFile(modelsDir, url, callback);
// }

// export async function downloadFaceLandmark(
//   callback?: (data: FileSystem.DownloadProgressData) => void
// ): Promise<string> {
//   const url =
//     'https://github.com/kurnianggoro/GSOC2017/raw/master/data/lbfmodel.yaml';
//   return downloadFile(modelsDir, url, callback);
// }
