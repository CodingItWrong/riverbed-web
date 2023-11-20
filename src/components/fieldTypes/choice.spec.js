import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import choiceFieldDataType from './choice';

describe('choice field type', () => {
  let user;

  beforeEach(() => {
    user = userEvent.setup();
  });

  it.todo('formatValue');

  it.todo('getSortValue');

  describe('EditorComponent', () => {
    const {EditorComponent} = choiceFieldDataType;
    const choices = [
      {id: 234, label: 'Apple'},
      {id: 345, label: 'Banana'},
      {id: 456, label: 'Cherry'},
    ];
    const field = {id: 123, attributes: {options: {choices}}};
    const label = 'My Field';

    it('preselects the option corresponding to the value', () => {
      render(<EditorComponent field={field} label={label} value={345} />);

      expect(screen.getByRole('combobox', {name: label})).toHaveTextContent(
        'Banana',
      );
    });

    it('shows the empty placeholder if the value is null', () => {
      render(<EditorComponent field={field} label={label} value={null} />);

      expect(screen.getByRole('combobox', {name: label})).toHaveTextContent(
        '(choose)',
      );
    });

    it('renders the choices as dropdown options, with an empty option', async () => {
      render(<EditorComponent field={field} label={label} value={null} />);
      await user.click(screen.getByRole('combobox', {name: label}));

      const options = screen.getAllByRole('option');
      expect(options.length).toEqual(4);
      expect(options[0]).toHaveTextContent('(choose)');
      expect(options[1]).toHaveTextContent('Apple');
      expect(options[2]).toHaveTextContent('Banana');
      expect(options[3]).toHaveTextContent('Cherry');
    });

    it('only shows the default option when choices is missing', async () => {
      // TODO: think about if we need to test undefined as well/instead
      const fieldWithNoChoices = {
        id: 123,
        attributes: {options: {choices: null}},
      };
      render(
        <EditorComponent
          field={fieldWithNoChoices}
          label={label}
          value={null}
        />,
      );

      expect(screen.getByRole('combobox', {name: label})).toHaveTextContent(
        '(choose)',
      );
      await user.click(screen.getByRole('combobox', {name: label}));
      const options = screen.getAllByRole('option');
      expect(options.length).toEqual(1);
      expect(options[0]).toHaveTextContent('(choose)');
    });

    it('only shows the default option when options are missing', async () => {
      const fieldWithNoChoices = {
        id: 123,
        attributes: {},
      };
      render(
        <EditorComponent
          field={fieldWithNoChoices}
          label={label}
          value={null}
        />,
      );

      expect(screen.getByRole('combobox', {name: label})).toHaveTextContent(
        '(choose)',
      );
      await user.click(screen.getByRole('combobox', {name: label}));
      const options = screen.getAllByRole('option');
      expect(options.length).toEqual(1);
      expect(options[0]).toHaveTextContent('(choose)');
    });

    it('calls setValue with the ID of the choice chosen by the user', async () => {
      const setValue = jest.fn().mockName('setValue');
      render(
        <EditorComponent
          field={field}
          label={label}
          value={null}
          setValue={setValue}
        />,
      );

      await user.click(screen.getByRole('combobox', {name: label}));
      await user.click(screen.getByRole('option', {name: 'Banana'}));

      expect(setValue).toHaveBeenCalledWith(345);
    });

    it('calls setValue with undefined if the user chooses the empty option', async () => {
      const setValue = jest.fn().mockName('setValue');
      render(
        <EditorComponent
          field={field}
          label={label}
          value={456}
          setValue={setValue}
        />,
      );

      await user.click(screen.getByRole('combobox', {name: label}));
      await user.click(screen.getByRole('option', {name: '(choose)'}));

      // TODO: maybe this should be null for simplicity
      expect(setValue).toHaveBeenCalledWith(undefined);
    });
  });
});
