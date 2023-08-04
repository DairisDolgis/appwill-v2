import { QRCode } from 'react-qrcode-logo';
import { Button } from '@heathmont/moon-core-tw';
import html2canvas from 'html2canvas';
import { Device } from '../../models/device';


interface QRCodeListProps {
    devices: Device[];
    handleRemoveQrCode: (devices: Device[]) => void;
}

function QRCodeList(props: QRCodeListProps) {
    const {devices, handleRemoveQrCode} = props;

    const downloadQRCode = (id: string) => {
		html2canvas(document.querySelector(`#${id}`) as any)
			.then(function (canvas) {
				const link = document.createElement('a');
				link.download = 'qrcode.png';
				link.href = canvas.toDataURL();
				link.click();
			});
	}

    const url = window.location.href.replace("back-office", "");

    const handleDeleteQrCode = async(currentDevice: Device) => {
            const updatedDevices = devices.map((device: Device) => {
              if (device.key !== currentDevice.key) {
                return device
              }
              if (device.key === currentDevice.key) {
                return {...device, generateQrCode: false}
              }
              })

              await fetch(`/api/devices/${currentDevice._id}`, {
                method: 'PUT',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({...currentDevice, generateQrCode: false}),
              })
        
              handleRemoveQrCode(updatedDevices as Device[])
          
    }

    return (
        <>
        <div className="flex space-x-4 border-2 border-slate-300 rounded-md m-4 items-center flex-wrap" key="qrcode-landing-page">
            <h3 className="text-moon-14 text-bulma font-medium self-start m-4">Landing page QR code</h3>
            <div>
                <div className='m-4 flex items-center'>
                <QRCode
                id="qrcode-canvas-landing-page"
                size={150}
                value={url}
                fgColor="#E6BEAE"
                eyeColor={[
                    {
                        outer: '#000000',
                        inner: '#E6BEAE',
                    },
                    {
                        outer: '#000000',
                        inner: '#E6BEAE',
                    },
                    {
                        outer: '#000000',
                        inner: '#E6BEAE',
                    }
                ]}
                qrStyle="dots"
            />
            <Button className='border-transparent bg-transparent  w-min h-min text-bulma font-medium underline underline-offset-2'  onClick={() => downloadQRCode("qrcode-canvas-landing-page")} >Download</Button>
            </div>
            </div>
        </div>
        {devices.map((device: Device) => {
            if (device.generateQrCode) {
                return (
                    <div className="flex space-x-4 border-2 border-slate-300 rounded-md m-4 items-center flex-wrap" key={`qrcode-${device.key}`}>
                    <h3 className="text-moon-14 text-bulma font-medium self-start m-4">{device.deviceName} {device.model} QR code</h3>
                    <div>
                        <div className='m-4 flex items-center'>
                        <QRCode
                        id={`qrcode-canvas-${device.key}`}
                        size={150}
                        value={`${url}/${device.key}`}
                        fgColor="#E6BEAE"
                        eyeColor={[
                            {
                                outer: '#000000',
                                inner: '#E6BEAE',
                            },
                            {
                                outer: '#000000',
                                inner: '#E6BEAE',
                            },
                            {
                                outer: '#000000',
                                inner: '#E6BEAE',
                            }
                        ]}
                        qrStyle="dots"
                    />
                    <Button className='border-transparent bg-transparent  w-min h-min text-bulma font-medium underline underline-offset-2'  onClick={() => downloadQRCode(`qrcode-canvas-${device.key}`)} >Download</Button>
                    </div>
                    <Button className='border-transparent bg-transparent  w-auto h-auto mb-2 text-chichi' onClick={() => handleDeleteQrCode(device)}>Delete</Button>
                    </div>
                </div>
                )
            }
            })}
        </>
    )
}

export default QRCodeList;
