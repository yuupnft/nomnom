import { useEffect, useState } from 'react';
import styles from '../styles/Button.module.css';

import {Gaegu} from 'next/font/google';

const gaegu = Gaegu({
  weight: ['400', '700'],
  subsets: ['latin']
});

export default function Button(props) {
  return (
    <div className={`${styles.btn} ${gaegu.className}`}>
      <a href={props.link}>{props.name}</a>
    </div>
  )
}