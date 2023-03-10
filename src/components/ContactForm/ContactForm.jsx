import { nanoid } from 'nanoid';
import { Formik } from 'formik';
import avatar from '../../img/avatar.png';
import { modalState } from '../../redux/modalSlice';
import { initialValues } from '../../redux/constants';
import { useSelector, useDispatch } from 'react-redux';
import { selectContact } from '../../redux/selectSlice';
import { Report } from 'notiflix/build/notiflix-report-aio';
import { ReactComponent as IconUser } from '../../img/user.svg';
import { ReactComponent as IconPhone } from '../../img/phone.svg';
import { addContact, editContact } from '../../redux/contactSlice';
import {
  Forma,
  Label,
  Input,
  Button,
  List,
  Item,
  Avatar,
  IconBox,
} from './ContactForm.styled';

const ContactForm = () => {
  const dispatch = useDispatch();
  const selectID = useSelector(state => state.selectID);
  const contacts = useSelector(state => state.contacts);
  const closeModal = () => dispatch(modalState());

  const initialState = () => {
    if (selectID) {
      const selectedContact = contacts.find(contact => contact.id === selectID);
      return selectedContact;
    } else {
      return initialValues;
    }
  };

  const handleSubmit = ({ name, number }, { resetForm }) => {
    const dublName = contacts.find(
      contact => contact.name.toUpperCase() === name.toUpperCase()
    );
    const dublNumber = contacts.find(contact => contact.number === number);
    if (messageDubl(dublName, name)) return;
    if (messageDubl(dublNumber, number)) return;
    if (selectID) {
      const newContact = { id: selectID, name, number };
      dispatch(editContact(newContact));
      dispatch(selectContact(''));
    } else {
      const newContact = { id: nanoid(), name, number };
      dispatch(addContact(newContact));
    }
    resetForm();
    closeModal();
  };

  const messageDubl = (dubl, field) => {
    if (dubl && dubl.id !== selectID) {
      Report.warning(
        `${field}`,
        'This Number is already in the contact list.',
        'OK'
      );
      return true;
    } else return false;
  };

  return (
    <Formik initialValues={initialState()} onSubmit={handleSubmit}>
      <Forma autoComplete="off">
        <Avatar src={avatar} alt="User avatar" />
        <List>
          <Item>
            <IconBox>
              <IconUser fill="currentColor" width="20px" height="20px" />
            </IconBox>
            <Label htmlFor="name">Name</Label>
            <Input
              type="text"
              name="name"
              pattern="^[a-zA-Z??-????-??]+(([' -][a-zA-Z??-????-?? ])?[a-zA-Z??-????-??]*)*$"
              title="Name may contain only letters, apostrophe, dash and spaces. For example Adrian, Jacob Mercer, Charles de Batz de Castelmore d'Artagnan"
              required
            />
          </Item>
          <Item>
            <IconBox>
              <IconPhone fill="currentColor" width="20px" height="20px" />
            </IconBox>
            <Label htmlFor="number">Number</Label>
            <Input
              type="tel"
              name="number"
              pattern="\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}"
              title="Phone number must be digits and can contain spaces, dashes, parentheses and can start with +"
              required
            />
          </Item>
          <Item>
            <Button type="submit">
              {!selectID ? 'Add contact' : 'Edit contact'}
            </Button>
          </Item>
        </List>
      </Forma>
    </Formik>
  );
};

export default ContactForm;