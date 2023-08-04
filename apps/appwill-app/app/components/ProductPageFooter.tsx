import { useState, useEffect } from "react";
import { IconButton } from '@heathmont/moon-core-tw';
import { ControlsChevronLeft, ControlsChevronRight, GenericHome, TextListView, DevicesPhone } from '@heathmont/moon-icons-tw';
import { useRouter } from 'next/navigation';

interface ProductPageFooterProps {
  phoneNumber: string;
  handleSetValue: (value: string[]) => void;
  stepCount: number;
}


const ProductPageFooter = (props: ProductPageFooterProps) => {
  const router = useRouter()
  const { phoneNumber, handleSetValue, stepCount } = props;
  const [index, setIndex] = useState(-1);


  const handleLeftCLick = () => {
    setIndex(index-1);
  }

  const handleRightCLick = () => {
    setIndex(index+1);
  }

  const handleCloseAllSteps = () => {
    setIndex(-1);
  }

  useEffect(() => {
    handleSetValue([`item-${index}`])
 }, [index]);


  return (
    <div className="flex gap-4 bg-white p-4 rounded-lg drop-shadow-lg w-fit h-fit place-self-center self-end mb-4">
      <IconButton onClick={() => handleLeftCLick()} icon={<ControlsChevronLeft className="text-black" />} className="border-transparent bg-transparent" disabled={index === -1}/>
      <IconButton onClick={() => handleCloseAllSteps()} icon={<TextListView className="text-black" />} className="border-transparent bg-transparent" />
      <IconButton onClick={() => handleRightCLick()} icon={<ControlsChevronRight className="text-black" />} className="border-transparent bg-transparent" disabled={index === stepCount}/>
      <IconButton onClick={() => router.push(`/`)} icon={<GenericHome className="text-black" />} className="border-transparent bg-transparent" />
      <IconButton onClick={() => navigator.clipboard.writeText(phoneNumber)} icon={<DevicesPhone className="text-black" />} />
    </div>
  )
}

export default ProductPageFooter;
