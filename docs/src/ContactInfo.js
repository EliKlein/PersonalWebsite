import React from 'react';
import './ContactInfo.css';
import { CONTACT } from './config';
import ContactItem from './ContactItem';

function ContactInfo() {
  // might have to change some of these to more generic classes later,
  // but for now...
  return (
    <>
      <h4 className="Content-Related-Head">
        My current information:
      </h4>
      <div className="container">
        {
          CONTACT.map(
            (props, index) => <ContactItem {...props} key={index} />
          )
        }
      </div>
    </>
  )
}

export default ContactInfo;