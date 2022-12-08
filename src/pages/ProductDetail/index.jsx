import { connect } from "react-redux";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import './styles.css'

import moment from 'moment';

import { InputNumber, notification, Button, message, Tabs, Rate, Input, Avatar } from "antd";
import { UserOutlined } from '@ant-design/icons';

import Title from "../../Title";

import history from "../../utils/history";

import {
  addToCartAction,
  addToReviewAction,
  getReviewListAction,
  getProductDetailAction,
  getProductSameAction,
} from "../../redux/actions";

const ProductDetails = styled.div`
  display: grid;
  padding: 2rem;
  grid-template-columns: 1fr 1.2fr;
  gap: 7rem;
  margin: 3rem auto;
  @media (max-width: 650px) {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
`;

const Left = styled.div`
  display: flex;
  flex-direction: column;
  /* border: 1px solid gray; */
  @media (max-width: 650px) {
    width: 100%;
    height: 45rem;
  }
`;

const Main = styled.div`
  text-align: center;
  background-color: #f6f2f1;
  margin-bottom: 2rem;
  height: 45rem;
  padding: 3rem;
  border: 1px solid #e6e4e4;
  cursor: pointer;
  img {
    object-fit: contain;
    height: 100%;
    width: 100%;
  }
`;

const Thumbnails = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  width: 100%;
  /* border: 1px solid gray; */
`;

const Thumbnail = styled.div`
  height: 10rem;
  background-color: #f6f2f1;
  text-align: center;
  border: 1px solid #e6e4e4;
  cursor: pointer;
  img {
    height: 100%;
    object-fit: contain;
  }
  @media (max-width: 650px) {
    width: 6rem;
    height: 6rem;
  }
`;
const CatLabel = styled.span`
  display: inline-block;
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const Right = styled.div`
  div {
    /* position: relative; */
    z-index: 1;
  }
  @media (max-width: 650px) {
    margin-top: 5rem;
  }
`;

export const Form = styled.form`
  margin-bottom: 2rem;
  div {
    display: inline-block;
    position: relative;
    z-index: 1;
    span {
      position: absolute;
      top: 50%;
      right: 1rem;
      transform: translateY(-60%);
      font-size: 1.3rem;
      z-index: 0;
      pointer-events: none;
    }
  }
`;

export const Select = styled.select`
  font-family: "Poppins", sans-serif;
  width: 6rem;
  padding: 0.3rem;
  border: 1px solid var(--grey1);
  appearance: none;
  outline: none;
  font-weight: 600;
  cursor: pointer;
`;

const TitleDetail = styled.h1`
  font-size: 2.5rem;
  line-height: 1.2;
  margin-bottom: 2rem;
`;
const Price = styled.div`
  font-size: 600;
  font-size: 2rem;
  color: var(--primary);
  margin-bottom: 2rem;
`;

const LinkWrapper = styled.div`
  display: inline-block;
  background: #ff4d4f;
  padding: 0.8rem 4rem;
  color: var(--white);
  border-radius: 3rem;
  margin-bottom: 2rem;
  /* outline: none; */
  cursor: pointer;
  &.disabled {
    cursor: default;
    pointer-events: none;
    color: var(--white);
    background: var(--grey1);
  }
  :hover {
    color: var(--white);
  }
`;

const Heading = styled.h3`
  border-top: 1px solid #e6e4e4;
  margin-top: 1px;
  padding-top: 1rem;
  /* text-transform: uppercase; */
  margin-bottom: 1rem;
`;

const InStock = styled.span`
  display: block;
  margin-bottom: 2rem;
`;

const Discription = styled.p`
  color: var(--grey1);
  text-align: justify;
`;

// style for products related
const WrapperProduct = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
  gap: 3rem;
  /* padding: 0 10rem; */
  margin-bottom: 5rem;
`;

const ImgContainer = styled.div`
  position: relative;
  cursor: pointer;
  img {
    object-fit: cover;
    height: 100%;
    width: 100%;
  }
`;

const IconWrapper = styled.div`
  position: absolute;
  right: 0;
  bottom: 0.6rem;
  background-color: #e7e7e7;
  border-radius: 50%;
  padding: 1.3rem 1.6rem;
  transition: all 300ms ease-in-out;
  :hover {
    background-color: var(--primary);
    color: var(--white);
  }
  &.disabled {
    /* pointer-event: none; */
    cursor: default;
  }
`;

const ProductItem = styled.div`
  overflow: hidden;
  padding: 2rem 0;
  i {
    transition: all 300ms ease-in-out;
  }
  :hover {
    box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.3);
  }
  :hover ${IconWrapper} {
    border-radius: 1rem 0 0 0;
  }
`;

const Bottom = styled.div`
  padding: 1rem;
  text-align: center;
`;

const ProductLink = styled(Link)`
  margin-bottom: 1rem;
  font-weight: inherit;
  font-size: 1.5rem;
  color: var(--black);
  :hover {
    color: var(--primary);
  }
`;

const PriceLabel = styled.span`
  color: var(--primary);
  font-size: 1.8rem;
`;

const PriceRelated = styled.div``;

function ProductDetailPage({
  productDetail,
  getProductDetail,
  getReviewList,
  reviewList,
  match,
  productSame,
  getProductSame,
  cartList,
  addToCart,
  addToReview,
}) {
  const { TabPane } = Tabs;
  const { TextArea } = Input;

  const [qty, setQty] = useState(1);
  const productId = match.params.id;
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const [review, setReview] = useState();
  const [rate, setRate] = useState();

  function onChangeText(e) {
    setReview(e.target.value);
  }

  function handleAddToReview() {
    if (rate && review) {
      const newReview = {
        name: userInfo.name,
        rate: rate,
        review: review,
        date: moment().format('hh:mm DD/MM/YYYY'),
      }
      setRate('');
      addToReview({newReview: newReview,  userId: userInfo.id, productId: parseInt(productId),})
      message.success('Cảm ơn bạn đã góp ý cho sản phẩm của chúng tôi')
    } else {
      message.warning('Bạn cần nhập đánh giá đầy đủ')
    }
  }

  function renderReviewList() {

    return reviewList.data.map((item, index) => {
      return (
        <div className="comment-content" key={index}>
          <ul className="comment-list">
            <li>
              <div className='avt'>
                <Avatar size={50} icon={<UserOutlined />} />
                <h4>{item.name}</h4>
              </div>
              <div className="rating-box">
                <div>Được đánh giá vào lúc {item.date}</div>
                <div>
                  <Rate style={{ color: "#F6A500"}} value={item.rate} disabled />
                </div>
                <p>{item.review}</p>
              </div>
            </li>
          </ul>
        </div>
      );
    });
  }
  function renderRateList() {
    var showRate = 0;
    reviewList.data.forEach((item) => {
      showRate = showRate + item.rate
    })
    return Math.ceil(showRate / reviewList.data.length)
  }

  function callback(key) {
    console.log(key);
  }
  const Demo = () => (
    <Tabs defaultActiveKey="1" size="large" onChange={callback}>
      <TabPane tab="Thông tin sản phẩm" key="1">
        <div className="container-info">
          <div>
            <h4>Mã hàng: </h4>
            <p>{productDetail.data.code}</p>
          </div>
          <div>
            <h4>Tên nhà cung cấp: </h4>
            <p>{productDetail.data.publisher.name}</p>
          </div>
          <div>
            <h4>Tác giả: </h4>
            <p>{productDetail.data.author}</p>
          </div>
          <div>
            <h4>Năm xuất bản: </h4>
            <p>{productDetail.data.publicYear}</p>
          </div>
          <div>
            <h4>Trọng lượng: </h4>
            <p>{productDetail.data.weight} g</p>
          </div>
          <div>
            <h4>Kích thước bao bì: </h4>
            <p>{productDetail.data.size}</p>
          </div>
          <div>
            <h4>Số trang: </h4>
            <p>{productDetail.data.numberPages}</p>
          </div>
          <div>
            <h4>Hình thức: </h4>
            <p>{productDetail.data.formality}</p>
          </div>
        </div>
        <div className="descrip" dangerouslySetInnerHTML={{
          __html: productDetail.data.description
        }}>
        </div>
      </TabPane>
      <TabPane tab="Khách hàng nhận xét" key="2">
        {userInfo ? (
          <div className="container-rating">
            <div>
              <p>Bạn đánh giá sản phẩm này thế nào ?</p>
              <p>
                <Rate
                  style={{ color: "#F6A500"}}
                  allowHalf
                  onChange={(value) => {
                    setRate(value);
                  }}
                  value={rate}
                />
              </p>
              <div style={{ display: "flex" }}>
                <TextArea
                  value={review}
                  showCount
                  maxLength={1000}
                  autoSize={{ minRows: 2 }}
                  placeholder="Nhập vào nhận xét của bạn về sản phẩm"
                  style={{ maxWidth: "1400px", width: "100%" }}
                  onChange={onChangeText}
                />
                <Button
                  style={{height: '54px', marginLeft: '18px'}}
                  type='primary'
                  onClick={() => {
                    handleAddToReview();
                    setReview("");
                  }}
                >
                  Đánh giá{" "}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <p>
            Chỉ có thành viên mới có thể viết nhận xét. Vui lòng{" "}
            <Link to="/login">đăng nhập</Link> hoặc{" "}
            <Link to="/register">đăng ký</Link>
          </p>
        )}
        {renderReviewList()}
      </TabPane>
    </Tabs>
  );

  function handleAddToCart() {
    if (!userInfo) {
      const key = `open${Date.now()}`;
      return notification.warning({
        message: "Chưa đăng nhập",
        description: "Bạn cần đăng nhập để thêm vào giỏ hàng",
        key,
        btn: (
          <Button
            type="primary"
            onClick={() => {
              notification.close(key);
              history.push("/login");
            }}
          >
            Đăng nhập
          </Button>
        ),
      });
    } else {
      const existProductIndex = cartList.data.findIndex(
        (item) => item.productId === parseInt(productId)
      );
      if (existProductIndex !== -1) {
        const newCartList = cartList.data;
        newCartList.splice(existProductIndex, 1, {
          productId: parseInt(productId),
          count: cartList.data[existProductIndex].count + qty,
          name: productDetail.data.name,
          price: productDetail.data.price,
          image: productDetail.data.image,
          // countInStock: productDetail.data.countInStock,
        });
        addToCart({
          userId: userInfo.id,
          carts: newCartList,
        });
        message.success('Cập nhật giỏ hàng thành công!')
      } else {
        addToCart({
          userId: userInfo.id,
          carts: [
            ...cartList.data,
            {
              productId: parseInt(productId),
              count: qty,
              name: productDetail.data.name,
              price: productDetail.data.price,
              image: productDetail.data.image,
              // countInStock: productDetail.data.countInStock,
            },
          ],
        });
        message.success('Thêm vào giỏ hàng thành công!')
      }
    }
  }
  
  function onChange(value) {
    setQty(value);
  }


  useEffect(() => {
    getProductDetail({ id: productId });
    getReviewList({productId: productId});
  }, [productId]);

  useEffect(() => {
    if (productDetail.data.categoryId) {
      getProductSame({ categoryId: productDetail.data.categoryId });
    }
  }, [productDetail.data]);
  
  // change ảnh chi tiết
  const bigImage = productDetail.data.image ||[];
  const [stt, setStt] = useState(0);
  
  const handletab = (index) => {
    setStt(index);
  };
  if (productDetail.load) return <img src="https://cdn0.fahasa.com/media/theme/default/loader.gif" alt="" />;
  return (
    <>
      <ProductDetails
        className="container"
        style={{ backgroundColor: "white", borderRadius: ".5rem" }}
      >
        <Left>
          <Main>
            <img src={bigImage[stt]} alt="" />
          </Main>
          <Thumbnails>
            {bigImage.map((item, index) => {
              return (
                <Thumbnail key={index}>
                  <img
                    src={item}
                    alt=""
                    onClick={() => {
                      handletab(index);
                    }}
                  />
                </Thumbnail>
              );
            })}
          </Thumbnails>
        </Left>

        <Right>
          <CatLabel>
            Trang Chủ {">"} {productDetail.data.category.name}
          </CatLabel>
          <TitleDetail>{productDetail.data.name}</TitleDetail>
          <Rate style={{ color: "#F6A500"}} value={renderRateList()} disabled />{" "}
          <span style={{ color: "#F6A500", marginLeft: "1rem" }}>
            ({reviewList.data.length} đánh giá)
          </span>
          <Price>
            Giá:{" "}
            {parseFloat(productDetail.data.price)
              .toFixed(3)
              .toLocaleString("VN_vi")}{" "}
            VNĐ
          </Price>
          {productDetail.data.countInStock > 0 && (
            <div>
              <p>
                Số lượng:{" "}
                <InputNumber
                  min={1}
                  max={productDetail.data.countInStock}
                  defaultValue="1"
                  onChange={onChange}
                />
              </p>
            </div>
          )}{" "}
          <br />
          <InStock>
            Status:{" "}
            {productDetail.data.countInStock > 0 ? "Còn hàng" : "Hết hàng"}
          </InStock>
          {productDetail.data.countInStock === 0 ? (
            <LinkWrapper
              to="#"
              className="disabled"
              onClick={(event) => event.preventDefault()}
            >
              Thêm vào giỏ hàng
            </LinkWrapper>
          ) : (
            <LinkWrapper className="white" onClick={() => handleAddToCart()}>
              Thêm vào giỏ hàng
            </LinkWrapper>
          )}
          <Heading>Ưu đãi liên quan</Heading>
          <Discription>
            <div className="promotion-detail">
              <div>
                <img
                  src="https://cdn0.fahasa.com/skin/frontend/ma_vanese/fahasa/images/ico_promo_sp.svg?q=9065"
                  alt=""
                />
              </div>
              <div>
                Giảm ngay 20K, đơn hàng từ 50K, thanh toán qua Ví ZaloPay
              </div>
            </div>
            <div className="promotion-detail">
              <div>
                <img
                  src="https://cdn0.fahasa.com/skin/frontend/ma_vanese/fahasa/images/ico_promo_sp.svg?q=9065"
                  alt=""
                />
              </div>
              <div>Hoàn 30%, tối đa 100K, thanh toán ví Moca</div>
            </div>
            <div className="promotion-detail">
              <div>
                <img
                  src="https://cdn0.fahasa.com/skin/frontend/ma_vanese/fahasa/images/ico_promo_sp.svg?q=9065"
                  alt=""
                />
              </div>
              <div>Nhập mã "QRMEGA": Giảm ngay 10%, thanh toán qua VNPAY</div>
            </div>
            <div className="promotion-detail">
              <div>
                <img
                  src="https://cdn0.fahasa.com/skin/frontend/ma_vanese/fahasa/images/ico_promo_sp.svg?q=9065"
                  alt=""
                />
              </div>
              <div>
                Nhập mã "AIRPAY024", Giảm ngay 10%, đơn hàng từ 0đ, thanh toán
                qua ví AirPay
              </div>
            </div>
            {/* {productDetail.data.description} */}
          </Discription>
        </Right>
      </ProductDetails>
      {/* review */}
      <div className="content-comment">{Demo()}</div>

      {/* products relate  */}
      <section className="container">
        <Title title="Related Products" subtitle="Chossen Goods Books" />
        <WrapperProduct
          style={{ backgroundColor: "white", borderRadius: ".5rem" }}
        >
          {productSame.data.map((productSameItem, productSameIndex) => (
            <ProductItem key={productSameIndex}>
              <ImgContainer>
                <Link to={`/product/${productSameItem.id}`}>
                  <img
                    src={productSameItem.image[0]}
                    alt={productSameItem.name}
                  />
                </Link>
                {productSameItem.countInStock === 0 ? (
                  <IconWrapper className="disabled">
                    <i className="fas fa-shopping-cart"></i>
                  </IconWrapper>
                ) : (
                  <IconWrapper>
                    <i className="fas fa-shopping-cart"></i>
                  </IconWrapper>
                )}
              </ImgContainer>
              <Bottom>
                {/* <div style={{ width: "100%", height: "4.2rem" }}> */}
                  <ProductLink to={`/product/${productSameItem.id}`}>
                    {productSameItem.name}
                  </ProductLink>
                {/* </div> */}
                <PriceRelated>
                  <PriceLabel>
                    {parseInt(productSameItem.price)
                      .toFixed(3)
                      .toLocaleString("VN_vi")}
                    đ
                  </PriceLabel>
                </PriceRelated>
              </Bottom>
            </ProductItem>
          ))}
        </WrapperProduct>
      </section>
    </>
  );
}

const mapStateToProps = (state) => {
  const { productDetail, productSame } = state.productReducer;
  const { cartList } = state.cartReducer;
  const { reviewList } = state.reviewReducer;
  console.log("🚀 ~ file: index.jsx ~ line 572 ~ mapStateToProps ~ reviewList", reviewList)
  return {
    productDetail,
    productSame,
    cartList,
    reviewList,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getProductDetail: (params) => dispatch(getProductDetailAction(params)),
    getProductSame: (params) => dispatch(getProductSameAction(params)),
    addToCart: (params) => dispatch(addToCartAction(params)),
    getReviewList: (params) => dispatch(getReviewListAction(params)),
    addToReview: (params) => dispatch(addToReviewAction(params)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductDetailPage);
