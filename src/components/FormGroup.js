import Divider from '@mui/material/Divider';
import ListSubheader from '@mui/material/ListSubheader';
import Stack from '@mui/material/Stack';

export default function FormGroup({title, children}) {
  return (
    <>
      <Divider />
      <div>
        <ListSubheader component="div">{title}</ListSubheader>
        <Stack>{children}</Stack>
      </div>
      <Divider />
    </>
  );
}
