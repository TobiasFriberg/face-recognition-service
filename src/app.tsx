import React, { useRef, useState } from 'react';
import { Content, Wrapper } from './styles';
import Webcam from 'react-webcam';
import { AddToaster, Button, InputField, Popup } from 'tobui';

const videoConstraints = {
  width: 640,
  height: 360,
  facingMode: 'user',
};

export const App = () => {
  const webcamRef = useRef<any>(null);
  const [name, setName] = useState('');
  const [snappedImage, setSnappedImage] = useState('');

  const uploadPhoto = async () => {
    try {
      await fetch(`${SERVER_URL}:${SERVER_PORT}/api/upload`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ image: snappedImage, name: name }),
      });

      AddToaster({ text: 'Uploaded successfully', variant: 'success' });
      setSnappedImage('');
    } catch (e) {
      AddToaster({ text: 'Something went wrong, try again later.', variant: 'error' });
    }
  };

  const snap = () => {
    if (!name) {
      AddToaster({ text: 'No name was provided', variant: 'error' });
      return;
    }

    const img = webcamRef.current.getScreenshot();
    setSnappedImage(img);
  };

  return (
    <Wrapper>
      <Popup open={!!snappedImage} onClose={() => setSnappedImage('')}>
        <Wrapper>
          <Content>
            <img src={snappedImage} />
            <Button disabled={!name} variant="primary" onClick={() => uploadPhoto()}>
              Upload
            </Button>
          </Content>
        </Wrapper>
      </Popup>
      <Content>
        <Webcam
          audio={false}
          width="100%"
          height="auto"
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
        />
        <InputField value={name} onChange={(value) => setName(value)} label="Name" />
        <Button disabled={!name} variant="primary" onClick={() => snap()}>
          Snap photo
        </Button>
      </Content>
    </Wrapper>
  );
};
