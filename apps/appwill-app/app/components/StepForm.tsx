import { useEffect, useMemo, useState } from "react";
import { useForm, FormProvider, useFieldArray, FieldArrayWithId } from 'react-hook-form';
import { Input, Button, Hint } from '@heathmont/moon-core-tw';
import { ControlsPlus, ControlsExpand, ControlsChevronDown, ControlsChevronUp } from '@heathmont/moon-icons-tw';
import DragAndDropFile from './DragAndDropFile';
import { Device } from '../../models/device';
import { Step } from '../../models/step';

interface StepFormProps {
    device: Device;
    handleDeleteDevice: (devices: Device[]) => void;
    setActiveDevice: (device: Device | undefined) => void;
}

export default function StepForm(props: StepFormProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const defaultValues = {
        header: "",
        programs: [""],
        activateWarningText: false,
        warningText: "",
        mediaType: "",
        media: "",
        comments: ""
    };

    const [copiedStep, setCopiedStep] = useState<Step | undefined>(undefined);

    const { device, handleDeleteDevice, setActiveDevice } = props;

    const methods = useForm({
        defaultValues: useMemo(() => {
            return device;
        }, [device])
    });

    const { register, handleSubmit, formState, control, reset, watch } = methods;

    useEffect(() => {
        reset(device);
        setActiveIndex(0);
    }, [device]);

    const { fields, append, remove, swap, update } = useFieldArray({
        control,
        name: "steps",
    });

    const encodePicture = async(step: Step) => {
        const reader = new FileReader();
        reader.readAsDataURL(step.media[0] as Blob)
        await new Promise(resolve => reader.onload = () => {resolve(reader.result)});
        
        return {...step, media: reader.result}
    }

    const onSubmit = async(formData: Device) => {
        let data = formData as any;
        if (data.steps && data.steps.length > 0) {
            data.steps = await Promise.all(data.steps.map(async (step: any) => {
                if (step.mediaType === "picture" && typeof step.media !== "string") {
                    return await encodePicture(step)
                }
                return step
            }));
        }
        setLoading(true);
        await fetch(`/api/devices/${data._id}`, {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({...data}),
          })

          setLoading(false);
    };

    const handleAddStepClick = (fields: FieldArrayWithId<Device, "steps", "id">[]) => {
        append(defaultValues)
        setActiveIndex(fields.length);
    };

    const data = watch(["steps"]);

    const handleSwap = (index: number, nexIndex: number) => {
        swap(index, nexIndex);
        setActiveIndex(nexIndex);
    };

    const handleCopy = (index: number) => {
        if (data?.[0]?.[index]) {
            setCopiedStep(data[0][index])
        }
    }

    const handlePaste = (index: number) => {
        if (copiedStep) {
            update(index, copiedStep)
        }
    }

    const handleDelete = async() => {
        await fetch(`/api/devices/${device._id}`, {
            method: 'DELETE',
            headers: {
            'Content-Type': 'application/json',
            'id': device._id
            },
            body: JSON.stringify({...device}),
          }).then(async() => {
            const response = await fetch("/api/devices");

            const data  = await response.json();

            setActiveDevice(undefined);
    
            handleDeleteDevice(data.data);
          }
            
          )

    }

    return (
        <>
            <div className="flex flex-col m-4">
                <div className={"flex justify-between items-center"}>
                    <div className={"border-2 rounded-full justify-between mb-2 flex pl-2 pr-2 border-slate-300 bg-appwill-cream w-1/3 items-center"}>
                        <h3 className="text-moon-14 text-bulma font-medium">{device.key}</h3>
                        <h3 className="text-moon-14 text-bulma font-medium">{device.deviceName} {device.model}</h3>
                    </div>
                    <Button size="xs" className='border-transparent bg-transparent  w-auto h-auto mb-2 text-trunks' onClick={handleDelete}>Delete</Button>
                </div>
                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {fields.map((field, index, fields) => (
                            <div className={"flex"} key={`product-wrapper-${field.id}`}>
                                <div className={"mr-4"}>
                                    {index !== 0 &&
                                        <>
                                            <ControlsChevronUp className="hover:cursor-pointer" onClick={() => handleSwap(index, index - 1)} />
                                        </>
                                    }
                                    {index + 1 !== fields.length &&
                                        <>
                                            <ControlsChevronDown className="hover:cursor-pointer" onClick={() => handleSwap(index, index + 1)} />
                                        </>
                                    }
                                </div>
                                {index !== activeIndex &&
                                    <div className={"border-2 rounded-full mb-2 flex pl-2 pr-2 border-slate-300 items-center justify-between w-full"} key={`product-header-${field.id}`}>
                                        <h3 className="text-moon-14 text-bulma font-medium">{index + 1}. {data?.[0]?.[index]?.header}</h3>
                                        <ControlsExpand className="hover:cursor-pointer" onClick={() => setActiveIndex(index)} />
                                    </div>
                                }
                                {index === activeIndex &&
                                    <div className="flex flex-col gap-y-4 border-2 border-slate-300 p-4 rounded-md mb-4 w-full" key={`product-${field.id}`}>
                                        <Input type="text" placeholder="Header" {...register(`steps.${index}.header`, { required: true, })} aria-invalid={formState.errors.steps?.[index]?.header ? "true" : "false"} error={formState.errors.steps?.[index]?.header ? true : false} />
                                        {formState.errors.steps?.[index]?.header?.type === "required" && (
                                            <Hint error>Header is required</Hint>
                                        )}
                                        <div className="flex justify-between">
                                            <div className="flex items-center mb-4">
                                                <input className="bg-gray-50 border-gray-300 focus:ring-3 focus:bg-appwill-cream accent-appwill-cream h-4 w-4 rounded" type="checkbox" value="daily" {...register(`steps.${index}.programs`, {
                                                    required: {
                                                        value: true, message: "test"
                                                    }
                                                })} />
                                                <label className="text-sm ml-3 font-medium text-gray-900">Daily program</label>
                                            </div>
                                            <div className="flex items-center mb-4">
                                                <input className="bg-gray-50 border-gray-300 focus:ring-3 focus:bg-appwill-cream accent-appwill-cream h-4 w-4 rounded" type="checkbox" value="weekly" {...register(`steps.${index}.programs`, {
                                                    required: {
                                                        value: true, message: "test"
                                                    }
                                                })} />
                                                <label className="text-sm ml-3 font-medium text-gray-900">Weekly program</label>
                                            </div>
                                            <div className="flex items-center mb-4">
                                                <input className="bg-gray-50 border-gray-300 focus:ring-3 focus:bg-appwill-cream accent-appwill-cream h-4 w-4 rounded" type="checkbox" value="special" {...register(`steps.${index}.programs`, {
                                                    required: {
                                                        value: true, message: "test"
                                                    }
                                                })} />
                                                <label className="text-sm ml-3 font-medium text-gray-900">Special program</label>
                                            </div>
                                        </div>
                                        {formState.errors.steps?.[index]?.programs?.type === "required" && (
                                            <Hint error>Atleast one is required</Hint>
                                        )}
                                        <div className="flex items-center mb-4">
                                            <input className="bg-gray-50 border-gray-300 focus:ring-3 focus:bg-appwill-cream accent-appwill-cream h-4 w-4 rounded" type="checkbox" {...register(`steps.${index}.activateWarningText`)} />
                                            <label className="text-sm ml-3 font-medium text-gray-900">Activate WARNING text</label>
                                        </div>
                                        <Input type="text" placeholder="Warning text" {...register(`steps.${index}.warningText`)} />
                                        <select {...register(`steps.${index}.mediaType`)} className="rounded-md block w-full max-w-full py-0 px-4 m-0 appearance-none text-[1rem] text-bulma transition-shadow box-border relative z-[2] bg-gohan shadow-input hover:shadow-input-hov focus:shadow-input-focus focus:outline-none focus-visible::shadow-input-focus focus-visible::outline-none h-10 leading-10">
                                            <option value="picture">Picture</option>
                                            <option value="youtube">You Tube</option>
                                        </select>
                                        {data?.[0]?.[index]?.mediaType === "picture" &&
                                            <DragAndDropFile index={index} />
                                        }
                                        {data?.[0]?.[index]?.mediaType === "youtube" &&
                                        <>
                                        <Input type="text" placeholder="You Tube link" {...register(`steps.${index}.media`, { required: true, })} aria-invalid={formState.errors.steps?.[index]?.media ? "true" : "false"} error={formState.errors.steps?.[index]?.media ? true : false}/>
                                        {formState.errors.steps?.[index]?.media?.type === "required" && (
                                            <Hint error>Media link is required</Hint>
                                        )}
                                        </>
                                            
                                        }
                                        <Input type="text" placeholder="Add comments" {...register(`steps.${index}.comments`)} />
                                        <div className="flex justify-between">
                                            <div className="flex justify-between items-center">
                                                <Button type="submit" className='border-transparent bg-transparent  w-auto h-auto text-roshi' animation={loading ? "progress" : undefined}>Save</Button>
                                                <Button size="xs" className='border-transparent bg-transparent  w-auto h-auto text-trunks' onClick={() => handleCopy(index)}>Copy</Button>
                                                <Button size="xs" className='border-transparent bg-transparent  w-auto h-auto text-trunks' onClick={() => handlePaste(index)}>Paste</Button>
                                            </div>
                                            <Button size="xs" className='border-transparent bg-transparent  w-auto h-auto text-chichi' onClick={() => remove(index)}>Delete</Button>
                                        </div>
                                    </div>
                                }
                            </div>
                        ))}
                    </form>
                </FormProvider>
            </div>
            <Button className='border-transparent bg-transparent  w-auto h-auto text-bulma font-medium underline underline-offset-2 m-4' iconLeft={<ControlsPlus />} onClick={() => handleAddStepClick(fields)}>Add step</Button>
        </>
    );
}