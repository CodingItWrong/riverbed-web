import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import SectionHeader from './SectionHeader';

export default function FormGroup({title, children}) {
  return (
    <>
      <Divider />
      <div>
        <SectionHeader>{title}</SectionHeader>
        <Stack spacing={1}>{children}</Stack>
      </div>
    </>
  );
}
