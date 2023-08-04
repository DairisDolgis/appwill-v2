import { Device } from "../../models/device";

interface DevicesTableProps {
  devices: Device[];
  handleListItemCLick: (key: string) => void;
  activeDeviceKey: string;
}

const DevicesTable = (props: DevicesTableProps) => {
  const {devices, handleListItemCLick, activeDeviceKey} = props;

  const handleItemCLick = (key: string) => {
    handleListItemCLick(key);
  }

  return (
    <div className="flex flex-col m-4">
      <div className="flex justify-between pl-2 pr-2">
      <h3 className="text-moon-14 text-bulma font-medium">Key</h3>
      <h3 className="text-moon-14 text-bulma font-medium">Device name / model</h3>
      </div>
      {devices.map((device: Device) => (
        <div className={"border-2 hover:cursor-pointer hover:border-slate-300 rounded-full mb-1 flex justify-between pl-2 pr-2 " + (activeDeviceKey === device.key ? 'border-slate-300 bg-appwill-cream' : 'border-transparent')} key={`product-${device.key}`} onClick={() => handleItemCLick(device.key)}>
          <h3 className="text-moon-14 text-bulma font-medium">{device.key}</h3>
          <h3 className="text-moon-14 text-bulma font-medium">{device.deviceName} {device.model}</h3>
        </div>
      ))}
    </div>
  );
};

export default DevicesTable;
