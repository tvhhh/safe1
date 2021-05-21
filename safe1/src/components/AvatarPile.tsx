import React, { Component } from 'react';
import FacePile from '@/utils/avatarPile';

const FACES = [
  {
    id: 0,
    imageUrl: require('@/assets/img/avatar1.png'),
  },
  {
    id: 1,
    imageUrl: require('@/assets/img/avatar2.png'),
  },
  {
    id: 2,
    imageUrl: require('@/assets/img/avatar3.jpg'),
  },
  {
    id: 3,
    imageUrl: require('@/assets/img/avatar1.png'),
  },
  {
    id: 4,
    imageUrl: require('@/assets/img/avatar2.png'),
  }
];

export default class AvatarPile extends Component {
    
  render () {
    return (
      <FacePile 
          numFaces={4} 
          faces={FACES}
      />
    );
  }
}

