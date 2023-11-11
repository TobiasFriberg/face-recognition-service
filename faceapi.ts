import '@tensorflow/tfjs';
import * as faceapi from '@vladmandic/face-api';
import canvas, { Canvas, Image, ImageData } from 'canvas';
import fs from 'fs';

export const NO_MATCH = 'NO_MATCH';

const loadModels = async () => {
  // @ts-ignore
  faceapi.env.monkeyPatch({ Canvas, Image, ImageData });
  await faceapi.nets.faceRecognitionNet.loadFromDisk(__dirname + '/facejs-models');
  await faceapi.nets.faceLandmark68Net.loadFromDisk(__dirname + '/facejs-models');
  await faceapi.nets.ssdMobilenetv1.loadFromDisk(__dirname + '/facejs-models');
};

loadModels();

const getUserImageDescriptors = async () => {
  const rootFolder = './faces';

  const faces: any[] = await new Promise((resolve) => {
    fs.readdir(rootFolder, async (err, faces) => {
      const filteredFaces = faces.filter((e) => e !== '.DS_Store');
      resolve(filteredFaces);
    });
  });

  const files = async (faceFolder: string) =>
    await new Promise((resolve) => {
      fs.readdir(`${rootFolder}/${faceFolder}`, async (err, files) => {
        resolve(await checkFiles(faceFolder, files));
      });
    });

  const checkFiles = async (faceFolder: string, files: string[]) =>
    await new Promise(async (resolve, rejects) => {
      const filesChecked = await Promise.all(
        files
          .filter((e) => e !== '.DS_Store')
          .map(async (file) => {
            const srcImage: any = await canvas.loadImage(`${rootFolder}/${faceFolder}/${file}`);
            const userImageDescription = await faceapi
              .detectSingleFace(srcImage)
              .withFaceLandmarks()
              .withFaceDescriptor();
            if (!userImageDescription?.descriptor) {
              return;
            }
            return new faceapi.LabeledFaceDescriptors(faceFolder, [userImageDescription.descriptor]);
          })
      );

      resolve(filesChecked);
    });

  return await Promise.all(faces.map(async (file) => await files(file)));
};

export const verifyUserImage = async (image: any) => {
  try {
    const img: any = await canvas.loadImage(image);
    const verificationImageDescription = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();

    if (!verificationImageDescription?.descriptor) {
      throw new Error('no description for verification image');
    }

    const userImageDescription: any = (await getUserImageDescriptors()).flat().filter((e) => e);

    const matcher = new faceapi.FaceMatcher(userImageDescription, 0.6);
    const results = matcher.findBestMatch(verificationImageDescription.descriptor);

    if (results.distance < 0.6) {
      return results.label;
    }

    return NO_MATCH;
  } catch (e: any) {
    throw new Error(`error: ${e}`);
  }
};
