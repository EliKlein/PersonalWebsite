import React from 'react';
import {BASE_URL, RESUME_DATE} from '../config';
import './Resume.css';

function Resume() {
  const linkToFile = `${BASE_URL}/Klein_Elias_Resume_${RESUME_DATE}.pdf`;
  return (
    <>
      <a href={linkToFile}>PDF</a> format resumé ({RESUME_DATE.replace("-","/")}).
    </>
  )
}

export default Resume;