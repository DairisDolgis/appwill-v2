"use client"
import { useState, useEffect, HTMLInputTypeAttribute } from "react";
import { IconButton, Loader, Modal, Button, Checkbox } from '@heathmont/moon-core-tw';
import { MailFilter, ControlsCloseSmall } from '@heathmont/moon-icons-tw';
import Logo from "../../components/Logo";
import ProductPageFooter from "../../components/ProductPageFooter";
import StepList from "../../components/StepList";
import { useRouter } from 'next/navigation';
import { Device } from "apps/appwill-app/models/device";

const ProductPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const [values, setValues] = useState(['item-*']);
  const [filters, setFilters] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [device, setDevice] = useState<Device>();
  const [stepCount, setStepCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const closeModal = () => setIsOpen(false);
  const openModal = () => setIsOpen(true);

  const getData = async () => {
    try {
      const response = await fetch(`/api/devices/${params.id}`);

      const data = await response.json();

      setLoading(false);
      setDevice(data.data);

      setStepCount(data.data.steps.length);

    } catch { }
  }

  const handleAddFilters = () => {
    const checkboxes: any =document.getElementsByName('program');
    let result = [];
    for (let i = 0; i < checkboxes.length; i++) {
      if (checkboxes[i].checked ) {
        result.push(checkboxes[i].value)
      }
    }
    setFilters(result);
    closeModal();
  }

    useEffect(() => {
      getData();
    }, []);

    if (loading) {
      return <div className="grid h-screen bg-slate-50"><div className="place-self-center self-center"><Loader size="lg" color="border-piccolo" /></div></div>;
    }


    return (
      <>
        <div className="grid h-screen bg-slate-50">
          <div className="flex justify-between m-4 h-fit">
            <Logo onClick={() => router.push(`/`)} className="hover:cursor-pointer" />
            <IconButton className="rounded-full border-transparent bg-transparent  w-auto h-auto" icon={<MailFilter className="text-moon-48 text-black font-semibold rounded-full" />} onClick={openModal} />
            <Modal open={isOpen} onClose={closeModal}>
              <Modal.Backdrop />
              <Modal.Panel>
                <div className="px-6 py-4 pt-8 flex flex-col gap-3 border-b">
                  <Checkbox label="Daily program" id="daily" value="daily" name="program" />
                  <Checkbox label="Weekly program" id="weekly" value="weekly" name="program" />
                  <Checkbox label="Special program" id="special" value="special" name="program" />
                </div>
                <div className="flex gap-2 p-4 justify-end pt-2">
                  <Button variant="secondary" onClick={closeModal}>
                    Cancel
                  </Button>
                  <Button type="submit" onClick={handleAddFilters} className='text-black' >Filter</Button>
                </div>
              </Modal.Panel>
            </Modal>
          </div>
          <div className="m-4">
            <StepList device={device as Device} value={values} handleSetValue={setValues} filters={filters}/>
          </div>
          <ProductPageFooter phoneNumber={device?.phoneNumber as string} handleSetValue={setValues} stepCount={stepCount} />
        </div>
      </>
    )
  }

  export default ProductPage;
