import {useState, useEffect} from 'react';
import React from 'react';
import DropDownPicker from 'react-native-dropdown-picker';

export function DropDown({handle}: any) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    {label: 'ON', value: 1},
    {label: 'OFF', value: 0}
  ]);

  useEffect(() => {
    handle(value);
  }, [value])

  return (
    <DropDownPicker
      open={open}
      value={value}
      items={items}
      setOpen={setOpen}
      setValue={setValue}
      setItems={setItems}
      theme="DARK"
      placeholder="Select mode"
    />
  );
}