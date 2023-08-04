import {useState, useEffect} from "react";
import { useFormContext, Controller } from 'react-hook-form';
import Dropzone from 'react-dropzone';
import { Button, Hint } from '@heathmont/moon-core-tw';

const DragAndDropFile = (props: { index: number }) => {
    const { control, setValue, watch } = useFormContext();
    const [image, setImage] = useState<any>([]);
    const data = watch(["steps"]);

    useEffect(() => {
        if (data?.[0]?.[props.index]?.media) {
            setImage(data[0][props.index].media)
        }
    }, [data]);

    return (
        <div className="border-2 border-slate-300 rounded-md bg-goku">
            <Controller
                control={control}
                name={`steps.${props.index}.media`}
                rules={{
                    required: { value: true, message: 'This field is required' },
                }}

                render={({ field: { onChange, onBlur }, fieldState }) => (
                    <>
                        <Dropzone
                            noClick
                            onDrop={(acceptedFiles) => {
                                setValue(`steps.${props.index}.media`, acceptedFiles as unknown as FileList, {
                                    shouldValidate: true,
                                });
                            }}
                            accept={{"image/*": [".png", ".gif", ".jpeg", ".jpg"]}}
                        >
                            {({
                                getRootProps,
                                getInputProps,
                                open,
                            }) => (
                                <div>
                                    <div
                                        className="flex justify-center items-center flex-col"
                                        {...getRootProps()}
                                    >
                                        <input
                                            {...getInputProps({
                                                id: 'spreadsheet',
                                                onChange,
                                                onBlur,
                                            })}
                                        />

                                        <p>
                                            Drag & Drop
                                        </p>
                                        <p>
                                            or
                                        </p>
                                        <Button size="sm" type="button" onClick={() => {
                                            setValue(`steps.${props.index}.media`, undefined, {
                                                shouldValidate: false,
                                            }); open()
                                        }} className="border-2 p-3 border-slate-300 rounded-full bg-appwill-cream text-bulma mb-2">
                                            Browse
                                        </Button>
                                        {image.length
                                            ? <div key={`image-${props.index}`} className="m-2">
                                                <div >
                                                    {data?.[0]?.[props.index]?.mediaType === "picture" && typeof data?.[0]?.[props.index]?.media === 'string' &&
                                                    <img
                                                    src={image}
                                                />
                                                    }
                                                    {data?.[0]?.[props.index]?.mediaType === "picture" && typeof data?.[0]?.[props.index]?.media !== 'string' &&
                                                    <img
                                                    src={URL.createObjectURL(image[0])}
                                                    onLoad={() => { URL.revokeObjectURL(image[0].name) }}
                                                />
                                                    }
                                                    
                                                </div>
                                            </div>
                                            : 'No file selected.'}

                                        <div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </Dropzone>
                        {fieldState.error && (
                            <Hint error>File is required</Hint>
                        )}
                    </>
                )}
            />
        </div>
    );
}

export default DragAndDropFile;