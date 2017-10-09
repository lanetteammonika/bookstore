import React, {Component} from 'react';
import {findDOMNode} from 'react-dom';
import {
    Well,
    ControlLabel,
    FormGroup,
    FormControl,
    Panel,
    Button,
    InputGroup,
    DropdownButton,
    MenuItem,
    Row,
    Col,
    Image
} from 'react-bootstrap';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {postBooks, deleteBooks, getBooks,resetButton} from '../../actions/booksActions';
import axios from 'axios';

class BookForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            images: [{}],
            img: ''
        }
    }

    componentDidMount() {
        this.props.getBooks();

        axios.get('/api/images')
            .then((res) => {
                this.setState({images: res.data})
            })
            .catch((err) => {
                this.setState({images: "error while fetching images from server", img: ''})
            })
    }

    handleSubmit() {
        const book = [{
            title: findDOMNode(this.refs.title).value,
            description: findDOMNode(this.refs.description).value,
            images: findDOMNode(this.refs.images).value,
            price: findDOMNode(this.refs.price).value,
        }];
        this.props.postBooks(book);
    }

    onDelete() {
        let bookid = findDOMNode(this.refs.delete).value;
        this.props.deleteBooks(bookid)
    }

    handleSelect(img) {
        this.setState({
            img: '/images/' + img
        })
    }

    resetForm() {
        this.props.resetButton();
            findDOMNode(this.refs.title).value='',
            findDOMNode(this.refs.description).value='',
            findDOMNode(this.refs.price).value=''
        this.setState({img: '' })
    }

    render() {

        const booksList = this.props.books.map(function (booksArr) {
            return (
                <option key={booksArr._id}>{booksArr._id}</option>
            )
        });

        const imgList = this.state.images.map(function (imgArr, i) {
            return (
                <MenuItem key={i} eventKey={imgArr.name}
                          onClick={this.handleSelect.bind(this, imgArr.name)}>{imgArr.name}</MenuItem>

            )
        }, this)

        return (
            <Well>
                <Row>
                    <Col xs={12} sm={6}>
                        <Panel>
                            <InputGroup>
                                <FormControl type="text" ref="images" value={this.state.img}/>
                                <DropdownButton
                                    componentClass={InputGroup.Button}
                                    id="input-dropdown-addon"
                                    title="Select an Image"
                                    bsStyle="primary"
                                >
                                    {imgList}
                                </DropdownButton>
                            </InputGroup>
                            <Image src={this.state.img} responsive/>
                        </Panel>
                    </Col>
                    <Col xs={12} sm={6}>
                        <Panel>
                            <FormGroup controlId="title" validationState={this.props.validation}>
                                <ControlLabel>Title</ControlLabel>
                                <FormControl
                                    type="text"
                                    placeholder="Enter title"
                                    ref="title"
                                />
                                <FormControl.Feedback/>
                            </FormGroup>
                                <FormGroup controlId="description" validationState={this.props.validation}>

                                <ControlLabel>Description</ControlLabel>
                                <FormControl
                                    type="text"
                                    placeholder="Enter Description"
                                    ref="description"
                                />
                                    <FormControl.Feedback/>
                                </FormGroup>
                            <FormGroup controlId="price" validationState={this.props.validation}>

                            <ControlLabel>Price</ControlLabel>
                                <FormControl
                                    type="text"
                                    placeholder="Enter Price"
                                    ref="price"
                                />
                                <FormControl.Feedback/>

                            </FormGroup>

                            <Button onClick={(!this.props.msg) ? (this.handleSubmit.bind(this)) : (this.resetForm.bind(this))}
                                        bsStyle={(!this.props.style) ? ("primary") : (this.props.style)}>
                                    {(!this.props.msg) ? ("SaveBook") : (this.props.msg)}
                                </Button>
                        </Panel>
                        <Panel style={{marginTop: '25px'}}>
                            <FormGroup controlId="formControlsSelect">
                                <ControlLabel>Select a Book</ControlLabel>
                                <FormControl ref="delete" componentClass="select" placeholder="select">
                                    <option value="select">select</option>
                                    {booksList}
                                </FormControl>
                            </FormGroup>
                            <Button onClick={this.onDelete.bind(this)} bsStyle="danger">Delete Book</Button>
                        </Panel>
                    </Col>
                </Row>

            </Well>
        )
    }
}
function mapStateToProps(state) {
    return {
        books: state.books.books,
        msg: state.books.msg,
        style: state.books.style,
        validation:state.books.validation
    };
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({postBooks: postBooks, deleteBooks: deleteBooks, getBooks: getBooks,resetButton:resetButton}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(BookForm)
