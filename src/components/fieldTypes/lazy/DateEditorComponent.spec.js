import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DateEditorComponent from './DateEditorComponent';

describe('DateEditorComponent', () => {
  let user;

  const field = {id: 123};
  const label = 'My Field';

  beforeEach(() => {
    user = userEvent.setup();
  });

  it('displays dates based on a date string', () => {
    const dateString = '2023-10-31';
    render(<DateEditorComponent field={field} value={dateString} />);

    expect(screen.getByDisplayValue('10/31/2023')).toBeVisible();
  });

  it('displays an empty field when the date is null', () => {
    render(<DateEditorComponent field={field} value={null} />);

    expect(screen.getByDisplayValue('')).toBeVisible();
  });

  it('calls setValue with a string-formatted date upon change', async () => {
    // TODO: consider renaming to onChange or something
    const setValue = jest.fn().mockName('setValue');
    render(
      <DateEditorComponent
        field={field}
        label={label}
        value={null}
        setValue={setValue}
      />,
    );

    await user.type(screen.getByRole('textbox', {name: label}), '10/31/2023');

    // TODO: investigate multiple calls to setValue while typing, see if that causes issues
    expect(setValue).toHaveBeenCalledWith('2023-10-31');
  });

  it('calls setValue with null upon clearing the field', async () => {
    const dateString = '2023-10-31';
    const setValue = jest.fn().mockName('setValue');
    render(
      <DateEditorComponent
        field={field}
        value={dateString}
        setValue={setValue}
      />,
    );

    await user.clear(screen.getByRole('textbox'));

    expect(setValue).toHaveBeenCalledWith(null);
  });
});
