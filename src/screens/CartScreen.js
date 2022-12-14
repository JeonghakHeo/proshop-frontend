import React, { useEffect, useState } from 'react'
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  Row,
  Col,
  ListGroup,
  Image,
  Form,
  Button,
  Card,
  Modal,
} from 'react-bootstrap'
import Message from '../components/Message'
import { addToCart, removeFromCart } from '../actions/cartActions'
import { showDeletedNotification } from '../actions/notificationActions'
import Notification from '../components/Notification'

const CartScreen = () => {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const qty = searchParams.get('qty') ? Number(searchParams.get('qty')) : 1

  const [showModal, setShowModal] = useState(false)

  const handleClose = () => setShowModal(false)
  const handleShow = () => setShowModal(true)

  const dispatch = useDispatch()

  const cart = useSelector((state) => state.cart)
  const { cartItems } = cart

  // console.log(cartItems.reduce((acc, item) => acc + item.qty, 0))

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const notification = useSelector((state) => state.notification)
  const { showDeleted } = notification

  useEffect(() => {
    if (id) {
      dispatch(addToCart(id, qty))
    }
  }, [dispatch, id, qty])

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id))
    handleClose()
    dispatch(showDeletedNotification())
  }

  const checkoutHandler = () => {
    if (!userInfo) {
      navigate('/login?redirect=shipping')
    } else {
      navigate('/shipping')
    }
  }

  return (
    <Row>
      <Notification
        color={'success'}
        message={'Item has been successfully deleted from Cart'}
        show={showDeleted}
      />

      <Col md={8}>
        <h1>Shopping cart</h1>
        {cartItems.length === 0 ? (
          <Message>
            Your cart is empty <Link to='/'>Go back</Link>
          </Message>
        ) : (
          <ListGroup variant='flush'>
            {cartItems.map((item) => (
              <ListGroup.Item key={item.product}>
                <Row>
                  <Col md={2}>
                    <Link to={`/product/${item.product}`}>
                      <Image src={item.image} alt={item.name} fluid rounded />
                    </Link>
                  </Col>
                  <Col md={3}>
                    <Link to={`/product/${item.product}`}>{item.name}</Link>
                  </Col>
                  <Col md={2}>${item.price}</Col>
                  <Col md={2}>
                    <Form.Control
                      as='select'
                      value={item.qty}
                      onChange={(e) =>
                        dispatch(
                          addToCart(item.product, Number(e.target.value))
                        )
                      }
                    >
                      {[...Array(item.countInStock).keys()].map((x) => (
                        <option key={x + 1}>{x + 1}</option>
                      ))}
                    </Form.Control>
                  </Col>
                  <Col md={2}>
                    <Button
                      type='button'
                      variant='light'
                      // onClick={() => removeFromCartHandler(item.product)}
                      onClick={handleShow}
                    >
                      <i className='fas fa-trash'></i>
                    </Button>

                    <Modal
                      show={showModal}
                      onHide={handleClose}
                      style={{ top: '10%' }}
                    >
                      <Modal.Header className='justify-content-center'>
                        <Modal.Title>
                          <i
                            className='fas fa-exclamation-circle text-warning'
                            style={{ fontSize: '5rem' }}
                          ></i>
                        </Modal.Title>
                      </Modal.Header>
                      <Modal.Body className='text-center'>
                        Are you sure you really want to delete this item?
                      </Modal.Body>
                      <Modal.Footer>
                        <Button variant='secondary' onClick={handleClose}>
                          Close
                        </Button>
                        <Button
                          variant='danger'
                          onClick={() => removeFromCartHandler(item.product)}
                        >
                          Delete
                        </Button>
                      </Modal.Footer>
                    </Modal>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Col>

      <Col md={4}>
        <Card>
          <ListGroup>
            <ListGroup.Item>
              <h2>
                Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)})
                items
              </h2>
              ${' '}
              {cartItems
                .reduce((acc, item) => acc + item.qty * item.price, 0)
                .toFixed(2)}
            </ListGroup.Item>
            <ListGroup.Item>
              <Button
                type='button'
                className='btn-block'
                style={{ width: '100%' }}
                disabled={cartItems.length === 0}
                onClick={checkoutHandler}
              >
                Proceed To Checkout
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  )
}

export default CartScreen
