"use client"
import { useState, useEffect } from "react";
import { IconButton, Loader } from '@heathmont/moon-core-tw';
import { GenericLogOut  } from '@heathmont/moon-icons-tw';
import { useSession, signOut} from 'next-auth/react';
import { redirect } from 'next/navigation';

import { Device } from "../../models/device";
import Logo from "../components/Logo";
import QRCodeList from "../components/QRCodeList";
import AddQRCodeModal from "../components/AddQRCodeModal";
import DevicesTable from "../components/DevicesTable";
import AddNewKeyModal from "../components/AddNewKeyModal";
import StepForm from "../components/StepForm";
import Search from "../components/SearchComponent";

function BackOffice() {
    const { data: session } = useSession({
        required: true,
        onUnauthenticated() {
            redirect('/api/auth/signin?callbackUrl=/back-office')
        }
    })

    const getData = async() => {
        try {
        const response = await fetch("/api/devices");

        const data  = await response.json();

        setLoading(false);
        setDevices(data.data);

        } catch {}
    }
    const [loading, setLoading] = useState(true);
    const [activeDeviceKey, setActiveDeviceKey] = useState("");
    const [devices, setDevices] = useState<Device[]>([]);
    const [activeDevice, setActiveDevice] = useState<Device | undefined>(undefined);

    useEffect(() => {
        getData();
    }, []);

    useEffect(() => {
        const selectedDevice = devices.filter(device => device.key === activeDeviceKey)
        setActiveDevice(selectedDevice[0])
    }, [activeDeviceKey]);

    const handleRemoveQrCode = async(devices: Device[]) => {
        setDevices(devices)
    }

    if (loading) {
        return <div className="grid h-screen"><div className="place-self-center self-center"><Loader size="lg" color="border-piccolo" /></div></div>;
    }

    return (
        <div className="grid grid-cols-4 gap-1 gap-y-4" >
            <div className="col-start-1 col-end-5 flex justify-between items-center pt-4 mb-auto">
                <Logo />
                <IconButton onClick={() => signOut()} className="rounded-full border-transparent bg-transparent  w-auto h-auto" icon={<GenericLogOut  className="text-moon-48 text-black font-semibold rounded-full" />} />
            </div>
            <div className="col-start-1 col-end-2 border-2 border-slate-300 rounded-md mb-auto" >
                <QRCodeList devices={devices} handleRemoveQrCode={setDevices} />
                <AddQRCodeModal devices={devices} handleAddNewQrCode={setDevices} />
            </div>
            <div className="col-start-2 col-end-3 rounded-md border-2 border-slate-300 mb-auto">
                <Search devices={devices} handleSelectSearchResult={setActiveDeviceKey} />
                <DevicesTable devices={devices} handleListItemCLick={setActiveDeviceKey} activeDeviceKey={activeDeviceKey} />
                <AddNewKeyModal devices={devices} handleAddNewKey={setDevices} setActiveDeviceKey={setActiveDeviceKey} />
            </div>
            <div className="col-start-3 col-end-5 rounded-md border-2 border-slate-300 mb-auto">
                {!activeDevice &&
                    <div className="flex justify-center justify-items-center m-10">
                        <Logo className="opacity-20" />
                    </div>
                }
                {activeDevice &&
                    <StepForm device={activeDevice} handleDeleteDevice={setDevices} setActiveDevice={setActiveDevice}/>
                }
            </div>
        </div>
    )
}

export default BackOffice
