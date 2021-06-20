import {useState, useEffect} from 'react';
import React from 'react';
import DropDownPicker from 'react-native-dropdown-picker';

export function DropDown({handle, onDanger, deviceType}: any) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    {label: 'ON', value: 1},
    {label: 'OFF', value: 0}
  ]);
  const [onDangerItems, setonDangerItems] = useState([
    {label: 'OFF', value: 0}
  ]);

  useEffect(() => {
    handle(value);
    console.log(onDanger())
  }, [value])

  return (
    <DropDownPicker
      open={open}
      value={value}
      items={deviceType === 'power' && onDanger()? onDangerItems: items}
      setOpen={setOpen}
      setValue={setValue}
      setItems={deviceType === 'power' && onDanger()? setonDangerItems : setItems}
      theme="DARK"
      placeholder="Select mode"
    />
  );
}