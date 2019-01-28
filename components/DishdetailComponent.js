import React, { Component } from 'react';
import { Text, View, ScrollView, FlatList, Modal, StyleSheet, Button, Alert, PanResponder } from 'react-native';
import { Card, Icon, FormInput, Rating } from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite, postComment, fetchComments } from '../redux/ActionCreators';
import * as Animatable from 'react-native-animatable';

const mapStateToProps = state => {
    return {
        dishes: state.dishes,
        comments: state.comments,
        favorites: state.favorites
    }
}
const mapDispatchToProps = dispatch => ({
    postFavorite: (dishId) => dispatch(postFavorite(dishId)),
    postComment: (comment) => dispatch(postComment(comment))
})



const RenderComments = (props) => {

    const comments = props.comments;

    const renderCommentItem = ({ item, index }) => {

        return (
            <View key={index} style={{ margin: 10 }}>
                <Text style={{ fontSize: 14 }}>{item.comment}</Text>
                <Rating
                    imageSize={20}
                    readonly
                    startingValue={item.rating}
                    style={{ paddingVertical: 10 }}
                />

                <Text style={{ fontSize: 12 }}>{'-- ' + item.author + ', ' + item.date} </Text>
            </View>
        );
    };

    return (
        <Animatable.View animation="fadeInUp" duration={2000} delay={1000}>
            <Card title='Comments' >
                <FlatList
                    data={comments}
                    renderItem={renderCommentItem}
                    keyExtractor={item => item.id.toString()}
                />
            </Card>
        </Animatable.View>
    );
}

const RenderDish = (props) => {
    handleViewRef = ref => this.view = ref;

    const dish = props.dish;
    const recognizeDrag = ({ moveX, moveY, dx, dy }) => {
        if (dx < -200)
            return true;
        else
            return false;
    }

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: (e, gestureState) => {
            return true;
        },
        onPanResponderGrant: () => { this.view.rubberBand(1000).then(endState => console.log(endState.finished ? 'finished' : 'cancelled')); },
        onPanResponderEnd: (e, gestureState) => {
            console.log("pan responder end", gestureState);
            if (recognizeDrag(gestureState))
                Alert.alert(
                    'Add Favorite',
                    'Are you sure you wish to add ' + dish.name + ' to favorite?',
                    [
                        { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                        { text: 'OK', onPress: () => { props.favorite ? console.log('Already favorite') : props.onPressFavorite() } },
                    ],
                    { cancelable: false }
                );

            return true;
        }
    })

    if (dish != null) {
        return (
            <Animatable.View animation="fadeInDown" duration={2000} delay={1000}
                ref={this.handleViewRef}
                {...panResponder.panHandlers}>

                <Card
                    featuredTitle={dish.name}
                    image={{ uri: baseUrl + dish.image }}>
                    <Text style={{ margin: 10 }}>
                        {dish.description}
                    </Text>
                    <View style={styles.iconWrapper}>
                        <Icon
                            raised
                            reverse
                            name={props.favorite ? 'heart' : 'heart-o'}
                            type='font-awesome'
                            color='#f50'
                            containerStyle={styles.favoriteIcon}
                            onPress={() => props.favorite ? console.log('Already favorite') : props.onPressFavorite()}
                        />
                        <Icon
                            raised
                            reverse
                            name='pencil'
                            type='font-awesome'
                            color='#512DA7'
                            containerStyle={styles.addCommentIcon}
                            onPress={() => props.onPressModal()}
                        />
                    </View>
                </Card>

            </Animatable.View>
        );
    }
    else {
        return (<View></View>);
    }
}

class DishDetail extends Component {

    state = {
        rating: 2.5,
        comment: '',
        author: '',
        showModal: false
    }



    toggleModal = () => {
        this.setState({ showModal: !this.state.showModal });

    }

    handleAddComment = () => {
        Keyboard.dismiss();
        const { rating, comment, author } = this.state;
        const dishId = this.props.navigation.getParam('dishId', '');
        const id = this.props.comments.comments.length;
        let d = new Date();
        let date = d.toISOString();
        this.props.postComment({ id, dishId, rating, comment, author, date });
        this.resetForm();
        this.toggleModal();

    }

    resetForm = () => {
        this.setState({
            rate: 2.5,
            comment: '',
            author: '',
            showModal: false
        });
    }

    static navigationOptions = {
        title: 'Dish Details'

    };
    markFavorite = (dishId) => {
        this.props.postFavorite(dishId);
    }

    ratingCompleted = (rating) => {

        this.setState({
            rating: rating
        }, () => {
        });
    }

    render() {
        const dishId = this.props.navigation.getParam('dishId', '');
        return (
            <ScrollView>
                <RenderDish dish={this.props.dishes.dishes[+dishId]}
                    favorite={this.props.favorites.some(el => el === dishId)}
                    onPressFavorite={() => this.markFavorite(dishId)}
                    onPressModal={this.toggleModal}
                />
                <RenderComments comments={this.props.comments.comments.filter((comment) => comment.dishId === dishId)} />
                <Modal animationType={"slide"} transparent={false}
                    visible={this.state.showModal}
                    onDismiss={(e) => { e.preventDefault; this.toggleModal() }}
                    onRequestClose={(e) => { e.preventDefault; this.toggleModal() }}>
                    <ScrollView keyboardShouldPersistTaps={'never'} contentContainerStyle={styles.modal}>

                        <Rating
                            showRating
                            type="star"
                            fractions={1}
                            startingValue={this.state.rate}
                            imageSize={40}
                            onFinishRating={this.ratingCompleted}
                            ratingTextColor="#F1C40F"
                            style={{ paddingVertical: 10, alignItems: "center" }}

                        />
                        <View style={styles.formRow}>
                            <View style={styles.formIcon}>
                                <Icon
                                    name='user'
                                    type='font-awesome'
                                    color='#000000'
                                />
                            </View>
                            <View style={styles.formInput}>
                                <FormInput
                                    placeholder="AUTHOR"
                                    onChangeText={(text) => this.setState({ author: text })}
                                    value={this.state.author}
                                />
                            </View>
                        </View>
                        <View style={styles.formRow}>
                            <View style={styles.formIcon}>
                                <Icon
                                    name='comment'
                                    type='font-awesome'
                                    color='#000000'
                                />
                            </View>
                            <View style={styles.formInput}>
                                <FormInput
                                    placeholder="COMMENT"
                                    onChangeText={(text) => this.setState({ comment: text })}
                                    value={this.state.comment}
                                />
                            </View>
                        </View>
                        <View style={{ marginTop: 20 }}>
                            <Button
                                onPress={() => { this.handleAddComment(); }}
                                color="#512DA8"
                                title="Submit"

                            />
                        </View>
                        <View style={{ marginTop: 20 }}>
                            <Button
                                onPress={() => { this.toggleModal(); this.resetForm(); }}
                                color="#808080"
                                title="CANCEL"
                            />
                        </View>
                    </ScrollView>
                </Modal>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    formRow: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderBottomColor: '#8A9197',
        borderBottomWidth: 1,
        paddingLeft: 20,
        paddingRight: 20

    },
    formIcon: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start'
    },
    formInput: {
        flex: 6,
        paddingRight: 10,
        paddingLeft: 0,
        backgroundColor: '#fff',
        color: '#424242',
    },
    iconWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        flexDirection: 'row',
        margin: 20
    },
    favoriteIcon: {

    },
    addCommentIcon: {

    },
    modal: {
        justifyContent: 'center',
        margin: 20
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        backgroundColor: '#512DA8',
        textAlign: 'center',
        color: 'white',
        marginBottom: 20
    },
    modalText: {
        fontSize: 18,
        margin: 10
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(DishDetail);