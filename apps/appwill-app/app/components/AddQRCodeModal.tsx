import { useState } from 'react';
import { Modal, Button, Dropdown, MenuItem } from '@heathmont/moon-core-tw';
import { ControlsCloseSmall, ControlsPlus } from '@heathmont/moon-icons-tw';
import { Device } from '../../models/device';


interface AddQRCodeModalProps {
  devices: Device[];
  handleAddNewQrCode: (devices: Device[]) => void;
}

const AddQRCodeModal = (props: AddQRCodeModalProps) => {
  const {devices, handleAddNewQrCode} = props;
  const [isOpen, setIsOpen] = useState(false);
  const options = devices.map((device: Device) => {
    if (!device.generateQrCode) {
      return device
    }
    })
  const [option, setOption] = useState<Device | null>(null);

  const closeModal = () => setIsOpen(false);
  const openModal = () => setIsOpen(true);

  const handleCreateQrCodeButtonClick = async() => {
    if (option) {
      closeModal()
      const updatedDevices = devices.map((device: Device) => {
        if (device.key !== option.key) {
          return device
        }
        if (device.key === option.key) {
          return {...option, generateQrCode: true}
        }
        })
  
      handleAddNewQrCode(updatedDevices as Device[])

      await fetch(`/api/devices/${option._id}`, {
        method: 'PUT',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({...option, generateQrCode: true}),
      })
    }
  }
  
  return (
    <>
    <Button onClick={openModal} className='border-transparent bg-transparent  w-auto h-auto text-bulma font-medium underline underline-offset-2 m-4' iconLeft={<ControlsPlus />}>Add new QR code</Button>
      <Modal open={isOpen} onClose={closeModal}>
        <Modal.Backdrop />
        <Modal.Panel>
          <div className="border-b-[0.063rem] border-beerus pt-5 pb-4 px-6 relative">
            <h3 className="text-moon-18 text-bulma font-medium">Add new QR code</h3>
            <span
              className="absolute top-5 right-5 cursor-pointer"
              onClick={closeModal}
            >
              <ControlsCloseSmall className="text-moon-24" />
            </span>
          </div>
          <div className="px-6 py-4 flex flex-col gap-3">
            <Dropdown value={option} onChange={setOption} size="xl">
              {({ open }) => (
                <>
                  <Dropdown.Select
                    open={open}
                    label="Device Name"
                    placeholder="Select device name..."
                  >
                    {option?.deviceName} {option?.model}
                  </Dropdown.Select>

                  <Dropdown.Options>
                    {options.map((option, index) => (
                      <Dropdown.Option value={option} key={index}>
                        {({ selected, active }) => (
                          <MenuItem isActive={active} isSelected={selected}>
                            {option?.deviceName} {option?.model}
                          </MenuItem>
                        )}
                      </Dropdown.Option>
                    ))}
                  </Dropdown.Options>
                </>
              )}
            </Dropdown>
          </div>
          <div className="flex gap-2 p-4 justify-end pt-2">
            <Button variant="secondary" onClick={closeModal}>
              Cancel
            </Button>
            <Button onClick={handleCreateQrCodeButtonClick} className='text-black' disabled={!option}>Create</Button>
          </div>
        </Modal.Panel>
      </Modal>
    </>
  );
};

export default AddQRCodeModal;