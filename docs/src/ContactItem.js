import React from 'react';

function ContactItem({ name, location, link, after }) {
  return (
    <p className="ContactInfo-para">
      <strong>{name + ": "}</strong>{
        location ? <a href={location}>{link}</a> : link
      }{
        after ? <br /> : null
      }{after}
    </p>
  )
}

export default ContactItem;