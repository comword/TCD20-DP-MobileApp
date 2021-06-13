import * as FileSystem from 'expo-file-system';
// import { Dispatch } from 'redux';

const modelsDir = FileSystem.cacheDirectory + 'models/';

async function ensureDirExists(targetDir: string) {
  const dirInfo = await FileSystem.getInfoAsync(targetDir);
  if (!dirInfo.exists) {
    console.log("Target directory doesn't exist, creating...");
    await FileSystem.makeDirectoryAsync(targetDir, { intermediates: true });
  }
}

async function downloadFile(
  targetDir: string,
  url: string,
  callback?: (data: FileSystem.DownloadProgressData) => void
): Promise<string> {
  await ensureDirExists(targetDir);
  const urlSplit = url.split('/');
  const fileName = urlSplit[urlSplit.length - 1];
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

export async function downloadFaceDetect(
  callback?: (data: FileSystem.DownloadProgressData) => void
): Promise<string> {
  const url =
    'https://raw.githubusercontent.com/opencv/opencv/master/data/haarcascades/haarcascade_frontalface_alt2.xml';
  return downloadFile(modelsDir, url, callback);
}

export async function downloadFaceLandmark(
  callback?: (data: FileSystem.DownloadProgressData) => void
): Promise<string> {
  const url =
    'https://github.com/kurnianggoro/GSOC2017/raw/master/data/lbfmodel.yaml';
  return downloadFile(modelsDir, url, callback);
}

export async function downloadTFLiteModel(
  callback?: (data: FileSystem.DownloadProgressData) => void
): Promise<string> {
  // const url = '';
  return new Promise((resolve, reject) => {
    callback
      ? callback({ totalBytesWritten: 0, totalBytesExpectedToWrite: 0 })
      : null;
    reject('Not implemented');
  });
}
