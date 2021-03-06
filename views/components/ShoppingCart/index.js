/** 购物车以及聊天浮动条 */
import React from 'react';
import { connect } from 'react-redux';
import { Icon, Button, message, Badge } from 'antd';
import classNames from 'classnames';

import ShoppingCartModal from '../ShoppingCartModal';
import ChatModal from '../ChatModal';
import Container from '../Container';
import {
  toggleShoppingCart,
  toggleShoppingChat,
  clearShoppingCart
} from '../../redux/modules/shopping';
import styles from './styles';
import ajax from '../../common/ajax';

/** 购物车总商品数量 */
const getTotalAmount = (items) => (
  items.map(e => e.amount).reduce((a, b) => a + b, 0)
)

/** 购物车总价值 */
const getTotalPrice = (items) => (
  items.map(e => e.price * e.amount).reduce((a, b) => a + b, 0)
)

@connect(
  (state) => ({
    cartItems: state.shopping.cartItems,
    newMsg: state.shopping.newMsg,
    showShoppingCartModal: state.shopping.showShoppingCartModal,
    showShoppingChat: state.shopping.showChatModal,
    user: state.account.user
  }),
  (dispatch) => ({
    toggleShoppingCart: () => dispatch(toggleShoppingCart()),
    toggleShoppingChat: () => dispatch(toggleShoppingChat()),
    clearShoppingCart: () => dispatch(clearShoppingCart())
  })
)
class ShoppingCart extends React.Component {
  render() {
    const { cartItems } = this.props
    return (
      <div className={classNames({
        [styles.cart]: true,
        [styles.show]: (this.props.user||this.props.cartItems.length>0) && !this.props.showShoppingChat && !this.props.showShoppingCartModal
      }) }>
        <ChatModal onCancel={this.props.toggleShoppingChat} footer={null} />
        <ShoppingCartModal onCancel={this.props.toggleShoppingCart} footer={null} />
        <Container>
          <div className={styles.inner}>
            {/* <span className={styles.pricer}>
              { getTotalAmount(cartItems) } 件商品，
              一共 <span className={styles.price}>
                { getTotalPrice(cartItems).toFixed(2) }
              </span> 元
            </span> */}
            {
              this.props.user &&
              <Badge count={this.props.newMsg}
                     onClick={this.props.toggleShoppingChat}>
                <Icon type="aliwangwang-o" />
              </Badge>
            }
            <span className={styles.cartIcon}
              onClick={this.props.toggleShoppingCart}>
              <Icon type="shopping-cart" />
              <span className={styles.counter}>
                { this.props.cartItems.length }
              </span>
              <span className={styles.viewCart}>
                查看购物车
              </span>
            </span>
          </div>
        </Container>
      </div>
    )
  }
}

export default ShoppingCart;
