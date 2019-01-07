import React, { Component } from 'react';
import Menu from './MenuComponent';
import { View } from 'react-native';
import { DISHES } from '../shared/dishes';
import Dishdetail from './DishdetailComponent';


class Main extends Component {
    state = {
        dishes: DISHES,
        selectedDish: null
    }
    onDishSelect = (dishId) => {
        this.setState({ selectedDish: dishId })
    }
    render() {

        return (
            <View >
                <Menu dishes={this.state.dishes} onPress={this.onDishSelect} />
                <Dishdetail dish={this.state.dishes.filter((dish) => dish.id === this.state.selectedDish)[0]} />
            </View>
        );
    }
}

export default Main;