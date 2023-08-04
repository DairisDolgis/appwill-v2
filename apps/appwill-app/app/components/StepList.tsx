import { useState, useEffect } from "react";
import { Accordion, Modal } from '@heathmont/moon-core-tw';
import { ControlsChevronDownSmall, ChatCommentBubbleAlert } from '@heathmont/moon-icons-tw';
import { Device } from '../../models/device';
import { Step } from "apps/appwill-app/models/step";

interface StepListProps {
    device: Device,
    value: string[];
    handleSetValue: (value: string[]) => void;
    filters?: string[];
}

const StepList = (props: StepListProps) => {
    const { device, value, handleSetValue, filters } = props;
    const [isOpen, setIsOpen] = useState(false);
    const [steps, setSteps] = useState<Step[] | undefined>(device ? device.steps : []);

    const closeModal = () => setIsOpen(false);
    const openModal = () => setIsOpen(true);



    useEffect(() => {
        if (filters && filters.length > 0 && device && device.steps) {
            setSteps(device.steps.filter(step => {
                return filters.some(filter => step.programs.includes(filter))

            }))     
        }  
    }, [filters]);



    return (
        <Accordion value={value} onValueChange={handleSetValue}>
            {steps && steps.map((step, index) => (
                <Accordion.Item value={`item-${index}`} key={`item-${index}`}>
                    <Accordion.Header className="moon-open:[&_svg]:rotate-180">
                        <Accordion.Button>
                            <div className="flex gap-2">
                                <div className="w-6 h-6 rounded-full flex justify-center items-center bg-appwill-cream">
                                    <p>{index + 1}</p>
                                </div>
                                <span>{step.header}</span>
                            </div>
                            <ControlsChevronDownSmall className="text-trunks text-moon-24 transition duration-200 moon-open:text-bulma" />
                        </Accordion.Button>
                    </Accordion.Header>
                    <Accordion.Content>
                        <div className="flex flex-col gap-2 m-4">
                            {step.activateWarningText &&
                                <div className="flex gap-2 items-center">
                                    <ChatCommentBubbleAlert className="text-moon-48 border-2 rounded-lg drop-shadow-xl" />
                                    <p className="text-moon-24 transition-colors break-normal text-left">{step.warningText}</p>
                                </div>
                            }
                            {step.mediaType === "youtube" &&
                                <iframe
                                    className="w-auto sm:w-[80%] h-60 sm:h-80 sm:mx-4 sm:mb-4 rounded-lg"
                                    src={
                                        (step.media as string).includes("/watch?v=")
                                            ? (step.media as string).replace("/watch?v=", "/embed/")
                                            : (step.media as string)
                                    }
                                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>

                            }
                            {step.mediaType === "picture" &&
                                <>
                                    <img
                                        src={step.media as string}
                                        className="w-auto sm:w-[80%] h-60 sm:h-80 sm:mx-4 sm:mb-4 rounded-lg"
                                        onClick={openModal}
                                    />
                                    <Modal open={isOpen} onClose={closeModal}>
                                        <Modal.Backdrop className="bg-black" />
                                        <Modal.Panel>
                                            <img
                                                src={step.media as string}
                                                className="rounded-lg"
                                                onClick={openModal}
                                            />
                                        </Modal.Panel>
                                    </Modal>
                                </>
                            }
                            <p className="text-moon-24 transition-colors">{step.comments}</p>
                        </div>
                    </Accordion.Content>
                </Accordion.Item>
            ))}
        </Accordion>
    )
};

export default StepList;