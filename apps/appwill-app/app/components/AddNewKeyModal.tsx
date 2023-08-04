import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Modal, Button, InsetInput, Hint, Loader } from '@heathmont/moon-core-tw';
import { ControlsCloseSmall, ControlsPlus } from '@heathmont/moon-icons-tw';
import { Device } from '../../models/device';


interface AddNewKeyModalProps {
    devices: Device[];
    handleAddNewKey: (devices: Device[]) => void;
    setActiveDeviceKey: (key: string) => void;
}

interface FormData {
    deviceName: string;
    model: string;
    phoneNumber: string;
}

const AddNewKeyModal = (props: AddNewKeyModalProps) => {
    const {devices, handleAddNewKey, setActiveDeviceKey} = props;
    const methods = useForm();
    const { register, handleSubmit } = methods;
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const closeModal = () => setIsOpen(false);
    const openModal = () => setIsOpen(true);

    const onSubmit = async(data: any) => {
        setLoading(true)
        const key = Math.floor(Math.random() * Date.now()).toString().slice(0, 6);
        const res = await fetch("/api/devices", {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({...data, key, generateQrCode: false }),
          })
          const responseData  = await res.json();

          handleAddNewKey([
            ...devices,
            {...data as FormData, key, _id: responseData.data._id, generateQrCode: false, steps: [] }
        ])
        setActiveDeviceKey(key);
        setLoading(false)
        closeModal();
    }

    return (
        <>
            <Button onClick={openModal} className='border-transparent bg-transparent  w-auto h-auto text-black underline underline-offset-2 m-4' iconLeft={<ControlsPlus />}>Add new Key</Button>
            <Modal open={isOpen} onClose={closeModal}>
                <Modal.Backdrop />
                <Modal.Panel>
                    <div className="border-b-[0.063rem] border-beerus pt-5 pb-4 px-6 relative">
                        <h3 className="text-moon-18 text-bulma font-medium">Add new key</h3>
                        <span
                            className="absolute top-5 right-5 cursor-pointer"
                            onClick={closeModal}
                        >
                            <ControlsCloseSmall className="text-moon-24" />
                        </span>
                    </div>

                    <FormProvider {...methods}>
                        <form onSubmit={handleSubmit(onSubmit)} >
                            <div className="px-6 py-4 flex flex-col gap-3">
                                <InsetInput placeholder="Device name" aria-invalid={methods.formState.errors.deviceName ? "true" : "false"} error={methods.formState.errors.deviceName ? true : false} {...register("deviceName", { required: true, })}>
                                    <InsetInput.Label>Device name</InsetInput.Label>
                                </InsetInput>
                                {methods.formState.errors.deviceName?.type === "required" && (
                                    <Hint error>Device name is required</Hint>
                                )}
                                <InsetInput placeholder="Device model" aria-invalid={methods.formState.errors.model ? "true" : "false"} error={methods.formState.errors.model ? true : false} {...register("model", { required: true, })}>
                                    <InsetInput.Label>Device model</InsetInput.Label>
                                </InsetInput>
                                {methods.formState.errors.model?.type === "required" && (
                                    <Hint error>Model is required</Hint>
                                )}
                                <InsetInput type="tel" placeholder="Contact phone" aria-invalid={methods.formState.errors.phoneNumber ? "true" : "false"} error={methods.formState.errors.phoneNumber ? true : false} {...register("phoneNumber", { required: true, })}>
                                    <InsetInput.Label>Contact phone</InsetInput.Label>
                                </InsetInput>
                                {methods.formState.errors.phoneNumber?.type === "required" && (
                                    <Hint error>Phone number is required</Hint>
                                )}
                            </div>
                            <div className="flex gap-2 p-4 justify-end pt-2">
                                <Button variant="secondary" onClick={closeModal}>
                                    Cancel
                                </Button>
                                <Button type="submit" className='text-black' animation={loading ? "progress" : undefined}>Add</Button>
                            </div>
                        </form>
                    </FormProvider>

                </Modal.Panel>
            </Modal>
        </>
    );
};

export default AddNewKeyModal;