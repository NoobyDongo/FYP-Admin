'use client'
import Themed from "@/components/Theme/Themed";
import { Box, Button, Typography, Stack, Fade, Drawer, IconButton, Divider, Paper, List, ListItem, ListItemButton, TextField, InputAdornment } from "@mui/material";

import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import NextImage from "@/components/Images/NextImage";
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import React from 'react';
import IconButtonWithTooltip from "@/components/IconButtonWithTooltip";
import { AddOutlined, CloseOutlined, DeleteOutlineOutlined, RemoveOutlined } from "@mui/icons-material";
import GET from "@/client/get";
import { CartProvider, useCart } from "@/client/CartContext";
import updateCartEvent from "@/client/updateCartEvent";


const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 60000 } }
})
function Wrapper({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        {children}
      </LocalizationProvider>
    </QueryClientProvider>
  )
}

function SectionItem({ item }) {
  const { get, cart, cartList, addItem, removeItem, setQuantity: _setQuantity } = useCart()
  const [inCart, setInCart] = React.useState(false)
  const [quantity, __setQuantity] = React.useState(cart[item.id]?.quantity || 1)

  const setQuantity = (value) => {
    if (value === 0) {
      removeItem(item)
      return
    }
    if (value)
      _setQuantity(item.id, value)
    __setQuantity(value)
  }

  React.useEffect(() => {
    const handle = (e) => {
      __setQuantity(e.detail)
    }
    window.addEventListener(`updateCart${item.id}`, handle)
    return () => window.removeEventListener(`updateCart${item.id}`, handle)
  }, [])

  React.useEffect(() => {
    setInCart(cart[item.id])
  }, [cart[item.id]])

  const addToCart = () => {
    //setInCart(item)
    addItem(item)
  }

  const removeFromCart = () => {
    //setInCart(false)
    removeItem(item)
  }

  return (
    <Stack key={item.id} sx={{
      width: 190,
      py: 3,
      px: 1,
      height: 380,
    }} gap={1}>

      <ProductImage id={item.id} name={item.images?.[0]?.name} size={180} />

      <Stack gap={.25}>
        <Box sx={{
          width: 1,
          fontWeight: 600,
          color: 'primary.main',
        }}>
          <Typography variant='body' component='span'>${Math.floor(item.price)}</Typography>
          <Typography variant='body2' fontWeight={600} component='span'>.{(parseFloat(item.price - Math.floor(item.price)).toFixed(2) * 100).toString().padStart(2, '0')}</Typography>
        </Box>
        <Typography variant='body2' fontWeight={500}>{item.name}</Typography>
      </Stack>

      <Box sx={{
        mt: "auto",
        borderRadius: 50,
      }}>
        {inCart && <QuantitySelector fullWidth min={0} max={15}
          value={quantity} onChange={setQuantity}
        />}
        {!inCart &&
          <Button variant='contained' className={inCart ? '.Mui-disabled' : ''} sx={(theme) => ({
            width: 1,
            borderRadius: 'inherit',
            textTransform: 'none',
            boxShadow: 'none',
            fontWeight: 700,
            pointerEvents: 'auto !important',
            cursor: 'pointer !important',
            color: theme.palette.text.disabled,
            backgroundColor: theme.palette.action.disabled,
            '&:hover': {
              backgroundColor: theme.palette.action.disabled,
              boxShadow: 'none',
            },
            ...(!inCart && {
              color: theme.palette.text.primary,
              backgroundColor: theme.palette.primary.secondary,
              '&:hover': {
                backgroundColor: theme.palette.mode === 'dark' ?
                  theme.palette.primary.dark : theme.palette.primary.light,
                boxShadow: 'none',
              }
            }),
          })} onClick={inCart ? removeFromCart : addToCart} disableRipple>
            {inCart ? `Remove from Cart` : "Add to Cart"}
          </Button>
        }
      </Box>

    </Stack>
  )
}

function Section({ label }) {
  const { data = [] } = GET('/api/client/record/product', {
    method: 'GET',
    option: "all"
  }, [])

  return (
    <Box>
      <Typography>{label}</Typography>

      <Stack direction='row' flexWrap='wrap'>
        {data.map((item, index) =>
          <SectionItem key={index} item={item} />
        )}
      </Stack>
    </Box>
  )
}

function QuantitySelector({ min = 1, max = 15, onChange: _setQuantity, value: quantity, fullWidth }) {
  /*
    const [quantity, __setQuantity] = React.useState(parseQunatity(_quantity, min, max))
    React.useEffect(() => {
      console.log('quantity', _quantity)
      __setQuantity(parseQunatity(_quantity, min, max))
    }, [_quantity])
  */
  const setQuantity = (value) => {
    let val = parseQuantity(value, min, max)
    //__setQuantity(val)
    _setQuantity(val)
  }

  const onChange = (e) => {
    if (!e.target.value && e.target.value !== 0)
      _setQuantity('')
    //__setQuantity('')
    else
      setQuantity(parseQuantity(e.target.value, min, max))
  }
  const onBlur = () => {
    if (!quantity && quantity !== 0)
      setQuantity(min)
    else
      setQuantity(quantity)
  }

  const removeItem = () => {
    setQuantity(parseQuantity(quantity - 1, min, max))
  }

  const addItem = () => {
    setQuantity(parseQuantity(quantity + 1, min, max))
  }

  return (
    <TextField variant='outlined' size='small'
      value={quantity}
      sx={{
        mt: 'auto',
      }}
      onBlur={onBlur}
      onChange={onChange}
      InputProps={{
        sx: theme => ({
          borderRadius: 50,
          p: .25,
          px: 1,
          width: 'fit-content',
          '.MuiOutlinedInput-notchedOutline': {
            borderWidth: `${1}px !important`,
            borderColor: `${theme.palette.input.border.main} !important`,
          }
        }),
        inputProps: {
          sx: {
            py: 0,
            height: 30,
            ...(!fullWidth && {
              width: 20,
            }),
            minWidth: 0,
            textAlign: 'center',
          },
        },
        startAdornment: <InputAdornment position="start">
          <IconButton
            color="primary"
            aria-label="decrease quantity"
            size='small'
            edge="start"
            disableFocusRipple
            disabled={quantity === min}
            onClick={removeItem}
          >
            <RemoveOutlined />
          </IconButton>
        </InputAdornment>,
        endAdornment: <InputAdornment position="end">
          <IconButton
            color="primary"
            aria-label="increase quantity"
            edge="end"
            size='small'
            disableFocusRipple
            disabled={quantity === max}
            onClick={addItem}
          >
            <AddOutlined />
          </IconButton>
        </InputAdornment>
      }} />
  )
}

function parseQuantity(value, min = 1, max = 15) {
  return Math.max(Math.min(isNaN(parseInt(value)) ? min : parseInt(value), max), min)
}

const cartPreviewWidth = 320

const ShoppingCartItem = React.forwardRef(({ item }, ref) => {
  const { product } = item
  const { setQuantity: __setQuantity, cart, removeItem } = useCart()
  const [quantity, _setQuantity] = React.useState(cart[product.id].quantity)

  const setQuantity = (value) => {
    if (value) {
      __setQuantity(product.id, value)
      window.dispatchEvent(updateCartEvent(product.id, value))
    }
    _setQuantity(value)
  }

  return (
    <ListItem sx={{ p: 0 }} className="item">
      <Stack direction='row' sx={{ width: 1 }}>
        <ProductImage id={product.id} name={product.images?.[0]?.name} size={90} />
        <Stack sx={{
          pl: 2,
          pt: 1,
          pb: .5,
          pr: 0,
          minWidth: 0,
          flex: 1,
        }}>
          <Typography variant='body2' fontWeight={500} sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            width: 160,
          }}>{product.name}</Typography>

          <Stack direction="row" justifyContent='space-between' sx={{
            mt: 'auto',
          }}>
            <QuantitySelector min={1} max={15} value={quantity} onChange={setQuantity} />
            <IconButtonWithTooltip className="remove" label={"Remove"} onClick={() => removeItem(product)}>
              <DeleteOutlineOutlined />
            </IconButtonWithTooltip>
          </Stack>

        </Stack>

      </Stack>

    </ListItem>
  )
})
ShoppingCartItem.displayName = 'ShoppingCartItem'

function ShoppingCart() {
  const { cartList, setCart } = useCart()
  const [preview, setPreview] = React.useState(false)
  const itemRef = React.useRef([])

  React.useEffect(() => {
    itemRef.current = []
  }, [cartList])

  const onClose = React.useCallback((event, reason) => {
    if (reason === 'backdropClick') {
      setPreview(false)
      return
    }
  }, [])


  return (
    <>
      <IconButtonWithTooltip label={"Shopping Cart"} onClick={() => setPreview(true)}>
        <ShoppingCartOutlinedIcon />
        {
          cartList.length > 0 &&
          <Box sx={{
            borderRadius: '50%',
            width: 10,
            height: 10,
            padding: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'background.default',
            position: 'absolute',
            bottom: -1,
            right: -1,
            fontFamily: 'inherit',
          }}>
            <Typography variant='body2' fontWeight={600} color='primary'>{cartList.length}</Typography>
          </Box>
        }
      </IconButtonWithTooltip>


      <Drawer anchor='right' open={preview} onClose={onClose}
        PaperProps={{
          elevation: 5,
          height: '100vh',
          sx: {
            width: cartPreviewWidth,
            backgroundColor: 'background.default',
            overflow: 'overlay',
            direction: 'rtl',
            '&>*': {
              direction: 'ltr',
            }
          },
        }}>
        <Stack direction='row' justifyContent='space-between' alignItems='center' sx={theme => ({
          position: 'sticky', top: 0, zIndex: 20,
          backgroundColor: theme.palette.background.default,
          borderBottom: 1,
          borderColor: 'divider',
          px: 2, py: 2
        })}>
          <Typography variant='h6' fontWeight={600}>Cart preview ({cartList.length})</Typography>
          <CloseOutlined onClick={() => setPreview(false)} sx={{
            color: 'text.secondary',
            cursor: 'pointer',
          }} />
        </Stack>
        <List sx={{
          py: .5,
          '& .item': {
            px: 2,
            py: 1,
            '&:hover': {
              '& .remove': {
                opacity: 1,
              }
            },
            '& .remove': {
              opacity: 0,
              transition: 'opacity 0.1s',
            }
          },
        }}>
          {
            cartList.map((item, index) => {
              return (
                <ShoppingCartItem ref={el => itemRef.current[index] = el} item={item} key={item.product.id + index} />
              )
            })
          }

        </List>
        <Stack gap={1} sx={theme => ({
          p: 2, pt: 0, mt: 'auto',
          position: 'sticky', bottom: 0, zIndex: 20,
          backgroundColor: theme.palette.background.default,
        })}>
          <Button variant="contained" sx={{
            textTransform: 'none',
            fontWeight: 600,
            fontSize: 14,
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none',
            },
          }}>Checkout</Button>
        </Stack>

      </Drawer>
    </>
  )
}

function ProductImage({ id, name, size = 50, sx, style, ...others }) {
  return (
    <NextImage {...others} sx={{
      alignSelf: "center",
      borderRadius: 2,
      minWidth: size,
      minHeight: size,
      ...sx,
    }} style={{
      objectFit: 'contain',
      ...style,
    }} src={`/api/image/product/${id}/${name}`} width={size} height={size} />

  )
}

export default function Home() {

  return (
    <Wrapper>
      <CartProvider>
        <Themed darkmode={false}>
          <Box>
            <Box>
              V#
            </Box>

            <ShoppingCart />

            <Stack>
              <Section label='Section 1'>

              </Section>

            </Stack>
          </Box>

        </Themed>
      </CartProvider>
    </Wrapper>
  );
}