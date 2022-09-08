import React from 'react';
import QRCode from 'qrcode';

export interface IQRCodeProps {
  text: string;
}

export default React.memo<IQRCodeProps>(({ text }) => {
  const [qrCodeImageUrl, setQRCodeImageUrl] = React.useState<string>('');
  React.useEffect(() => {
    (async () => {
      setQRCodeImageUrl(await QRCode.toDataURL(text));
    })();
  }, [text]);
  return <img src={qrCodeImageUrl} />;
});
