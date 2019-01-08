import React, { Component } from 'react';
import { Text } from 'react-native';
import { Card } from 'react-native-elements';

class Contact extends Component {
    static navigationOptions = {
        title: 'Contact Information'
    };
    render() {
        return (
            <Card
                featuredTitle="Contact Information"
            >
                <Text
                    style={{ margin: 10, lineHeight: 30 }}>
                    Our Address {"\n"}
                    121, Clear Water Bay Road {"\n"}
                    Clear Water Bay, Kowloon {"\n"}
                    HONG KONG Tel: +852 1234 5678~{"\n"}
                    Fax: +852 8765 4321 {"\n"}
                    Email:confusion@food.net</Text>
            </Card>
        )
    }
}

export default Contact;
