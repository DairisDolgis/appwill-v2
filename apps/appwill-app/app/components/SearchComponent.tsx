import { useState } from "react";
import { SearchCmdk } from '@heathmont/moon-core-tw';
import { Device } from "../../models/device";


interface SearchProps {
  devices: Device[];
  handleSelectSearchResult: (key: string) => void;
}

function Search(props: SearchProps) {
  const {devices, handleSelectSearchResult} = props;
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const handleSelect = (value: string) => {
    setOpen(false);
    handleSelectSearchResult(value);
  }

  const filterItems = (values: Device[], search: string) => { return values.filter(({ deviceName, key, model }) => +deviceName.toLowerCase().includes(search) || +key.toLowerCase().includes(search) || +model.toLowerCase().includes(search)); }
  const filteredItems = filterItems(devices, search.toLowerCase());

  return (
    <div className="m-4">
      <SearchCmdk.Trigger onClick={() => { setOpen(true) }}>
        <SearchCmdk.TriggerIcon />
        <span className="text-moon-16"></span>
      </SearchCmdk.Trigger>

      {open && <SearchCmdk.Overlay />}

      <SearchCmdk
        open={open}
        onOpenChange={setOpen}
        label="Search"
        shouldFilter={false}
        loop={true}
      >
        <SearchCmdk.InputWrapper>
          <SearchCmdk.Icon />
          <SearchCmdk.Input
            value={search}
            onValueChange={setSearch}
            placeholder="Search for a device"
          />
          <SearchCmdk.Kbd onClick={() => setOpen(false)}>
            Esc
          </SearchCmdk.Kbd>
        </SearchCmdk.InputWrapper>
        <SearchCmdk.Separator />
        <SearchCmdk.Result>
          <SearchCmdk.NoResults>
            No Results
          </SearchCmdk.NoResults>
            {filteredItems.map(({ deviceName, key, model }) =>
              <SearchCmdk.ResultItem
                key={key}
                value={key}
                onSelect={handleSelect}
              >
                {deviceName} {model}
              </SearchCmdk.ResultItem>
            )}
        </SearchCmdk.Result>
      </SearchCmdk>
    </div>
  );
}

export default Search;
