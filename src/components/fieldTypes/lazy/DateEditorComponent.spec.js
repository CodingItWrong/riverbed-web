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

    // the accessible field DOM structure has no single <input>: each part of
    // the date is a spinbutton, and typing advances to the next one
    await user.click(screen.getByRole('spinbutton', {name: 'Month'}));
    await user.keyboard('10312023');

    expect(setValue).toHaveBeenCalledWith('2023-10-31');
  });

  it('does not call setValue when an invalid date is entered', async () => {
    const setValue = jest.fn().mockName('setValue');
    render(
      <DateEditorComponent
        field={field}
        label={label}
        value={null}
        setValue={setValue}
      />,
    );

    // simulates a partially-entered date: month only, no day or year
    await user.click(screen.getByRole('spinbutton', {name: 'Month'}));
    await user.keyboard('1');

    expect(setValue).not.toHaveBeenCalled();
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

    // ctrl+A selects every section, so Delete empties the whole field
    await user.click(screen.getByRole('spinbutton', {name: 'Month'}));
    await user.keyboard('{Control>}a{/Control}{Delete}');

    expect(setValue).toHaveBeenCalledWith(null);
  });
});
