import React, {Component} from 'react';
import {Image, requireNativeComponent} from 'react-native';

const Images = () => {
    return (
        <Image source = {require('./src/profile_pic.jpg')}
        style = {{width: 100, height: 100, borderRadius: 100/2}}
        />
    )
}

export default Images;