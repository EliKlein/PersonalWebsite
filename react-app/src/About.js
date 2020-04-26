import React from 'react';
import { RESUME_DATE } from './config';
import './About.css';

function About() {
  const pdfLink = `Klein_Elias_Resume_${RESUME_DATE}.pdf`;
  const date = RESUME_DATE.replace(/-/g, "/");
  return (
    <div className="About-Main container">
      <p>
        This is my{" "}
        <a href={pdfLink}>PDF</a>
        {" "}format resumé (dated {date}).
      </p>
      <h5 className="Content-Related-Head">Me as a person:</h5>
      <div className="row">
        <ul className="About-List col-9">
          <li>I try to think rationally</li>
          <li>I enjoy solving new logical problems.</li>
          <li>When I have time, I like to try new ways to do things.</li>
          <li>
            I lean on apathy over anger. If I don't like something, I ask
            myself what I can do about it and if it's worth doing.
          </li>
          <li>
            I often take the time to reevaluate my opinions if they are
            challenged.
          </li>
          <li>
            I make baking a hobby, though I spend much of my time on the
            internet.
          </li>
          <li>I tend to be honest. For example, I avoid false praise.</li>
        </ul>
        <div className="About-Card card col">
          <img className="rounded img-fluid" src="PersonalWebsite/one_eternity_later.jpg"
            alt="Spongebob 'one eternity later' card"></img>
          Oh, and this is where I would put a picture of me. If I had one. But
          I don't really take pictures of myself, so this is going to have to
          wait until I figure out what kind of picture to take.
        </div>
      </div>
    </div>
  )
}

export default About;