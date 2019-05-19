import React from 'react'
import {configure, shallow} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import NavigationItems from './NavigationItems'
import NavigationItem from '../NavigationItem/NavigationItem'
import ctx from '../../../containers/auth-context'

configure({adapter: new Adapter()})


describe('<NavigationItems />', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallow(<NavigationItems/>, ctx)
    })

    it('should render 0 <NavigationItem /> elements if not authenticated', () => {
        expect(wrapper.find(NavigationItem)).toHaveLength(0)
    })

})