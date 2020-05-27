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
          <li>
            I'm always curious about how things work, or if things work. I
            dive into new technologies to find out exactly what makes them
            tick. I also sometimes experiment with bizarre code (on my own) to
            see if it does what I think it will.
          </li>
          <li>
            I accept things for what they are. When I want things to change,
            it's based in solid reasoning, and I have the ability to instigate
            the change I want.
          </li>
          <li>
            I listen to others, and I'm good at acting on criticism. Honestly,
            in person I probably seem like I'm making excuses, but I do that
            to help myself understand what I can do better.
          </li>
          <li>
            I avoid false praise because I don't like lying. If I'm not a
            fan of something, I still know what parts I do appreciate, and
            if I can't focus on that, I think about what could be improved.
          </li>
          <li>
            I'd like to mention some hobbies now:
            <ul className="About-SubList">
              <li>Video/board/role-playing/card Games</li>
              <li>Baking (not cooking)</li>
              <li>Crossword puzzles (New York Times app)</li>
              <li>Puns (maybe more of a personality trait than a hobby)</li>
              <li>Netflix/etc. (I like anime in particular)</li>
              <li>Piano (no improvising)</li>
            </ul>
          </li>
        </ul>
        <img className="rounded img-fluid col" src="picture-of-me.jpg"
          alt="me"></img>
      </div>
    </div>
  )
}

export default About;