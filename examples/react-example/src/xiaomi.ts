import { PageConfigType } from '@brickd/core'
import { borderColors, guides, headerData, ProductData, seckillResult, users } from './xiaomiData'
import styles from './global.less'

const banner = [
	'https://cdn.cnbj1.fds.api.mi-img.com/mi-mall/c7fd00fa846cefaaa73572ea55832854.jpg?w=2452&h=920',
	'https://cdn.cnbj1.fds.api.mi-img.com/mi-mall/85fe83512254832000635fb15f048df5.jpg?thumb=1&w=2452&h=920&f=webp&q=90',
	'https://cdn.cnbj1.fds.api.mi-img.com/mi-mall/aebcb8f7d8c6ddaa754bfbb701a38cbf.jpeg?thumb=1&w=2452&h=920&f=webp&q=90',
	'https://cdn.cnbj1.fds.api.mi-img.com/mi-mall/0f5c49925f3a7d5157b8ac7f4f66b34b.jpg?thumb=1&w=2452&h=920&f=webp&q=90',
]

const banner2 = [
	'https://cdn.cnbj1.fds.api.mi-img.com/mi-mall/5d4298059889417157e8492750328492.jpg?w=632&h=340',
	'https://cdn.cnbj1.fds.api.mi-img.com/mi-mall/8a43378b96501d7e227a9018fe2668c5.jpg?w=632&h=340',
	'https://cdn.cnbj1.fds.api.mi-img.com/mi-mall/793913688bfaee26b755a0b0cc8575fd.jpg?w=632&h=340',
]


const slidMenuData = [{
	key: 1,
	title: '手机 电话卡',
},
	{
		key: 2,
		title: '电视 盒子',
	},
	{
		key: 3,
		title: '笔记本 显示器',
	},
	{
		key: 4,
		title: '家电 插线板',
	},
	{
		key: 5,
		title: '出行 穿戴',
	},
	{
		key: 6,
		title: '智能 路由器',
	},
	{
		key: 7,
		title: '电源 配件',
	},
	{
		key: 8,
		title: '健康 儿童',
	},
	{
		key: 9,
		title: '耳机 音响',
	},
	{
		key: 10,
		title: '生活 箱包',
	},
]
const data: PageConfigType = {
	0: {
		componentName: 'div',
		state: { banner, slidMenuData, banner2, ProductData, guides, users },
		props: {
			style: {
				display: 'flex',
				flex: 1,
				flexDirection: 'column',
				alignItems: 'center',
				backgroundColor: '#f5f5f5',
				width: '100%',
			},
		},
		childNodes: ['54', '52', '74', '18', '69', '70'],
	},
	1: {
		componentName: 'div',
		props: {
			style: {
				width: 1226,
				backgroundColor: '#fff',
				display: 'flex',
				flexDirection: 'column',
			},
		},
		childNodes: ['10', '16'],
	},
	2: {
		componentName: 'div',

		props: {
			style: {
				height: 100,
				width: 1226,
				display: 'flex',
				flexDirection: 'row',
				alignItems: 'center',
				backgroundColor: '#fff',
				justifyContent: 'space-between',
			},
		},
		childNodes: ['3', '4', '73'],
	},
	3: {
		componentName: 'img',
		props: {
			src: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fwww.canva.cn%2Flearn%2Fwp-content%2Fuploads%2Fsites%2F17%2F2019%2F11%2F1000.png&refer=http%3A%2F%2Fwww.canva.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1618299431&t=e9fd3262b900bd370391699d178994bd',
			style: {
				width: 55,
				height: 55,
				marginRight: 199,
			},
		},

	},
	4: {
		componentName: 'div',
		props: {
			style: {
				display: 'flex',
				flex: 1,
			},
		},
		childNodes: ['5'],
	},
	5: {
		componentName: 'span',
		loop: headerData,
		props: {
			children: '${item.title}',
			className: `${styles['header-title']}`,
			style: {
				fontSize: 16,
				marginRight: 20,
			},
			$onMouseOver: `function(e){
			if(!!this.item.products){
			this.height=230
			this.setPageState({products:this.item.products})
			}else{
			this.height=0
			this.setPageState({products:null})

			}
			}`,
		},
	},
	6: {
		componentName: 'Input',
		props: {
			style: {
				width: 245,
				height: 50,
				justifySelf: 'flex-end',
				borderRadius: 0,
				borderColor: '#',
			},
			placeholder: '星辰大海',
		},

	},
	7: {
		componentName: 'Carousel',
		props: {
			effect: 'fade',
			autoplay: true,
			style: {
				width: '100%',
			},
		},
		childNodes: ['8'],
	},
	8: {
		loop: '${banner}',
		componentName: 'div',
		props: {
			style: {
				width: '100%',
			},
		},
		childNodes: ['9'],
	},
	9: {
		componentName: 'img',
		props: {
			src: '${item}',
			style: {
				height: 470,
				width: '100%',
			},

		},
	},
	10: {
		componentName: 'div',
		props: {
			style: {
				position: 'relative',
				width: '100%',
				height: 470,

			},
		},
		childNodes: ['7', '14'],
	},
	'11': {
		componentName: 'Menu',
		childNodes: {
			children: ['12'],
		},
		props: {
			mode: 'vertical',
			theme: 'dark',
			// $onSelect:"function(item){console.log(item)}",
			style: {
				width: 234,
				backgroundColor: 'rgba(105,101,101,.6)',
			},
		},
	},
	'12': {
		componentName: 'Menu.SubMenu',
		loop: '${slidMenuData}',
		props: {
			key: '${item.key}',
			style: {
				fontSize: 14,
				color: '#fff',
			},
		},
		childNodes: {
			title: ['13'],
		},
	},
	'13': {
		componentName: 'span',

		props: {
			children: '${item.title}',
		},
	},
	14: {
		componentName: 'div',
		props: {
			style: {
				height: '100%',
				width: '100%',
				display: 'flex',
				flexDirection: 'row',
				position: 'absolute',
				top: 0,
			},
		},
		childNodes: ['11', '15'],
	},
	15: {
		componentName: 'div',
		props: {
			style: {
				backgroundColor: '#fff',
				height: '100%',
				boxShadow: '0 8px 16px rgb(0 0 0 / 18%)',
			},
		},
		childNodes: ['53'],
	},
	16: {
		componentName: 'div',
		props: {
			style: {
				width: '100%',
				display: 'flex',
				flexDirection: 'row',
				marginTop: 14,
				marginBottom: 20,
				justifyContent: 'space-between',
				alignItems: 'center',
			},
		},
		childNodes: ['40', '17'],
	},
	17: {
		loop: '${banner2}',
		componentName: 'img',
		props: {
			style: {
				height: 170,
				width: '24%',
			},
			src: '${item}',
		},
	},
	18: {
		componentName: 'div',
		props: {
			style: {
				width: 1226,
				display: 'flex',
				backgroundColor: '#0000',
				flexDirection: 'column',
			},
		},
		childNodes: ['19'],
	},
	19: {
		loop: '${ProductData}',
		componentName: 'div',
		props: {
			style: {
				display: 'flex',
				flexDirection: 'column',
			},
		},
		childNodes: ['29', '20', '24'],
	},
	20: {
		componentName: 'div',
		props: {
			style: {
				height: 58,
				display: 'flex',
				flexDirection: 'row',
				justifyContent: 'space-between',
				alignItems: 'center',
			},
		},
		childNodes: ['21', '22'],
	},
	21: {
		componentName: 'span',
		props: {
			style: { fontSize: 22 },
			children: '${item.title}',
		},
	},
	22: {
		componentName: 'div',
		props: {
			display: 'flex',
			flexDirection: 'row',
		},
		childNodes: ['23'],
	},
	23: {
		loop: '${item.actions}',
		componentName: 'span',
		props: {
			style: { marginLeft: 30 },
			children: '${item.title}',
		},
	},
	24: {
		componentName: 'div',
		props: {
			style: {
				width: '100%',
				height: 614,
				display: 'flex',
			},
		},
		childNodes: ['25', '30'],
	},
	25: {
		componentName: 'div',
		props: {
			style: {
				height: '100%',
				width: 234,
				display: 'flex',
				flexDirection: 'column',
				marginRight: '2%',

			},
		},
		childNodes: ['26'],
	},
	26: {
		loop: '${item.posters}',
		componentName: 'Card',
		props: {
			hoverable: true,
			style: {
				display: 'flex',
				flex: 1,
				marginTop: '${item.key|isEquals:\'2\':\'20px\':\'0px\'}',
			},
		},
		childNodes: { cover: ['28'] },
	},
	28: {
		componentName: 'img',
		props: {
			style: {
				height: '100%',
				width: 234,
			},
			src: '${item.img}',
		},
	},
	29: {
		componentName: 'img',
		props: {
			style: { width: '100%', height: 120, margin: '30px 0px' },
			src: '${item.bigPoster}',
		},
	},
	30: {
		componentName: 'Row',
		props: {
			gutter: [16, 16],
		},
		childNodes: ['31'],
	},
	31: {
		loop: '${item.product}',
		componentName: 'Col',
		props: { span: 6, style: { height: '50%' } },
		childNodes: ['32'],
	},
	32: {
		componentName: 'Card',
		props: {
			hoverable: true,
			style: {
				width: '100%',
				height: '100%',
				display: 'flex',
				flexDirection: 'column',
				// justifyContent:'center',
				alignItems: 'center',
			},
		},
		childNodes: {
			children: ['33', '34', '35', '38'],
		},
	},
	33: {
		componentName: 'img',
		props: {
			src: '${item.product_picture}',
			style: {
				width: 160,
				height: 160,
			},
		},
	},
	34: {
		componentName: 'div',
		props: {
			children: '${item.product_name}',
			style: { fontSize: 14, color: '#333333', margin: '0 10px 2px', textAlign: 'center' },
		},
	},
	35: {
		componentName: 'div',
		props: {
			style: { fontSize: 12, color: '#b0b0b0', margin: '0 10px 10px', textAlign: 'center' },
			children: '${item.product_title}',
		},
	},
	36: {
		componentName: 'span',
		props: {
			children: '${item.product_selling_price}元起',
			style: {
				color: '#ff6700',
				fontSize: 14,
			},
		},
	},
	37: {
		componentName: 'span',
		props: {
			children: '${item.product_price}',
			style: {
				color: '#b0b0b0',
				fontSize: 14,
				marginLeft: 5,
			},
		},
	},
	38: {
		componentName: 'div',
		props: {
			style: {
				display: 'flex',
				flexDirection: 'row',
				justifyContent: 'center',
			},
		},
		childNodes: ['36', '39'],
	},
	39: {
		componentName: 'del',
		childNodes: ['37'],
	},
	40: {
		componentName: 'Row',
		props: {
			style: {
				width: '24%',
				height: '100%',
			},
		},
		childNodes: ['41'],
	},
	41: {
		loop: [{ icon: 'dashboard', title: '小米秒杀' }, { icon: 'windows', title: '企业团购' }, {
			icon: 'chrome',
			title: 'F码通道',
		}, { icon: 'pie-chart', title: '米粉卡' }, { icon: 'gitlab', title: '依旧换新' }, { icon: 'code-sandbox', title: '话费充值' }],
		componentName: 'Col',
		props: {
			span: 8,
			className: styles['guides'],
			style: {
				backgroundColor: '#5f5750',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center',
				height: 82,
			},
		},
		childNodes: ['42', '43'],
	},
	42: {
		componentName: 'Icon',
		props: {
			type: '${item.icon}',
			style: {
				fontSize: 24,
			},
		},
	},
	43: {
		componentName: 'span',
		props: {
			children: '${item.title}',
			style: {
				fontSize: 12,
				marginTop: 8,
			},
		},
	},
	44: {
		componentName: 'div',
		state: { height: 0 },
		props: {
			style: {
				display: 'flex',
				width: '100%',
				alignItems: 'center',
				flexDirection: 'column',
				height: 100,
			},
		},
		isStateDomain: true,
		childNodes: ['2', '45'],
	},
	45: {
		componentName: 'div',
		props: {
			style: {
				height: '${height}',
				transition: 'all 200ms',
				width: '100%',
				position: 'absolute',
				backgroundColor: '#fff',
				display: 'flex',
				justifyContent: 'center',
				top: 140,
				zIndex: 1000,
				overflow: 'hidden',
				boxShadow: '0 2px 4px 0 rgba(174, 174, 174, 0.5)',
			},
			$onMouseLeave: `function(){
			this.height=0
			}`,
		},
		childNodes: ['51'],
	},
	46: {
		loop: '${products}',
		componentName: 'div',
		props: {
			style: {
				display: 'flex',
				flex: 1,
				justifyContent: 'center',
				alignItems: 'center',
				flexDirection: 'column',
			},
		},
		childNodes: ['47', '50', '49'],
	},
	47: {
		componentName: 'div',
		props: {
			style: {
				display: 'flex',
				justifyContent: 'center',
				width: '100%',
				borderLeftWidth: '${index|isEquals:0:0:1}',
				borderLeftColor: '#e0e0e0',
				borderLeftStyle: 'solid',
			},
		},
		childNodes: ['48'],
	},
	48: {
		componentName: 'img',
		props: {
			src: '${item.product_picture}',
			style: {
				width: 160,
				height: 110,
			},
		},
	},
	49: {
		componentName: 'span',
		props: {
			children: '${item.product_selling_price}元',
			style: {
				color: '#ff6700',
				fontSize: 12,
			},
		},
	},
	50: {
		componentName: 'span',
		props: {
			style: {
				marginTop: 16,
				fontSize: 12,
				color: '#333',
			},
			children: '${item.product_name}',
		},
	},
	51: {
		componentName: 'div',
		props: {
			style: {
				width: 1226,
				display: 'flex',
			},
		},
		childNodes: ['46'],
	},
	52: {
		componentName: 'div',
		props: {
			style: {
				display: 'flex',
				width: '100%',
				flexDirection: 'column',
				backgroundColor: '#fff',
				alignItems: 'center',
			},
		},
		childNodes: ['44', '1'],
	},
	53: { componentName: 'Row' },
	54: {
		componentName: 'div',
		props: {
			style: {
				height: 40,
				width: '100%',
				backgroundColor: '#333',
				display: 'flex',
				justifyContent: 'center',
			},
		},
		childNodes: ['55'],
	},
	55: {
		componentName: 'div',
		props: {
			style: {
				width: 1226,
				display: 'flex',
				flexDirection: 'row',
				alignItems: 'center',
				justifyContent: 'space-between',
			},
		},
		childNodes: ['56', '60'],
	},
	56: {
		componentName: 'div',
		props: {
			style: {
				display: 'flex',
				flexDirection: 'row',
			},
		},
		childNodes: ['57'],
	},
	57: {
		loop: '${guides}',
		componentName: 'div',
		props: {
			style: {
				display: 'flex',
				flexDirection: 'row',
			},
		},
		childNodes: ['59', '58'],
	},
	58: {
		componentName: 'span',
		props: {
			className: `${styles['guides']}`,
			children: '${item}',
			style: {
				fontSize: 12,
			},
		},

	},
	59: {
		componentName: 'span',
		condition: 'this.index===0',
		props: {
			children: '|',
			style: {
				color: '#b0b0b0',
				fontSize: 12,
				margin: '0 0.3em',
			},
		},

	},
	60: {
		componentName: 'div',
		props: {
			style: {
				position: 'relative',
				display: 'flex',
				flexDirection: 'row',
				alignItems: 'center',
			},
		},
		childNodes: ['61', '64'],
	},
	61: {
		loop: '${users}',
		componentName: 'div',
		props: {
			style: {
				display: 'flex',
				flexDirection: 'row',
			},
		},
		childNodes: ['63', '62'],
	},
	62: {
		componentName: 'span',
		props: {
			className: `${styles['guides']}`,
			children: '${item}',
			style: {
				fontSize: 12,
			},
		},

	},
	63: {
		componentName: 'span',
		condition: 'this.index===0',
		props: {
			children: '|',
			style: {
				color: '#b0b0b0',
				fontSize: 12,
				margin: '0 0.3em',
			},
		},

	},
	64: {
		componentName: 'div',
		state: { height: 0 },
		isStateDomain: true,
		props: {
			className: styles['cart'],
			style: {
				width: 120,
				height: 40,
				marginLeft: 25,
				display: 'flex',
				flexDirection: 'row',
				justifyContent: 'center',
				alignItems: 'center',
			},
			$onMouseOver: `function(e){
			this.height=100
			}`,
		},
		childNodes: ['65', '66', '67'],
	},
	65: {
		componentName: 'Icon',
		props: {
			style: {
				fontSize: 16,
			},
			type: 'shopping-cart',
		},
	},
	66: {
		componentName: 'span',
		props: {
			children: '购物车 (0)',
		},
	},
	67: {
		componentName: 'div',
		props: {
			style: {
				position: 'absolute',
				transition: 'all 200ms',
				top: 40,
				right: 0,
				width: 280,
				height: '${height}',
				backgroundColor: '#fff',
				boxShadow: '0 8px 16px rgb(0 0 0 / 18%)',
				zIndex: 1000,
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				overflow: 'hidden',
			},
			$onMouseLeave: `function(e){
			this.height=0
			}`,
		},
		childNodes: ['68'],

	},
	68: {
		componentName: 'span',
		props: {
			children: '购物车中还没有商品，赶紧选购吧！',
			props: {
				style: {
					color: '#000',
				},
			},
		},
	},
	69: {
		componentName: 'div',
		props: {
			style: {
				height: 332,
				width: '100%',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				backgroundColor: '#fff',
				marginTop: 12,
			},
		},
	},
	70: {
		componentName: 'BackTop',
	},
	71: {
		componentName: 'div',
		props: {
			className: styles['search-Icon'],
			style: {
				width: 52,
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				height: 50,
			},
		},
		childNodes: ['72'],
	},
	72: {
		componentName: 'Icon',
		props: {
			type: 'search',
			style: {
				fontSize: 24,
			},
		},
	},
	73: {
		componentName: 'div',
		props: {
			style: {
				display: 'flex',
				flexDirection: 'row',
			},
		},
		childNodes: ['6', '71'],
	},
	74: {
		componentName: 'div',
		props: {
			style: {
				width: 1226,
				height: 400,
			},
		},
		childNodes: ['75', '81'],
	},
	75: {
		componentName: 'div',
		props: {
			style: {
				height: 58,
				display: 'flex',
				flexDirection: 'row',
				justifyContent: 'space-between',
				alignItems: 'center',
			},
		},
		childNodes: ['76', '77'],
	},
	76: {
		componentName: 'span',
		props: {
			style: { fontSize: 22 },
			children: '小米秒杀',
		},
	},
	77: {
		componentName: 'div',
		props: {
			display: 'flex',
			flexDirection: 'row',
		},
		childNodes: ['78'],
	},
	78: {
		componentName: 'Button.Group',
		childNodes: ['79', '80'],
	},
	79: {
		componentName: 'Button',
		props: {
			className: styles['btn'],
			icon: 'left',
			size: 'small',
			width: 36,
		},
	},
	80: {
		componentName: 'Button',
		props: {
			className: styles['btn'],
			icon: 'right',
			size: 'small',
			width: 36,
		},
	},
	81: {
		componentName: 'div',
		props: {
			style: {
				display: 'flex',
				flexDirection: 'row',
				justifyContent:'space-between'

			},
		},
		childNodes: ['82','99'],
	},
	82: {
		componentName: 'div',
		props: {
			style: {
				width: 234,
				height: 339,
				backgroundColor: '#f1eded',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center',
				borderTopStyle: 'solid',
				borderTopColor: 'red',
				borderTopWidth: 1,
			},
		},
		childNodes: ['83', '84', '85', '86'],
	},
	83: {
		componentName: 'span',
		props: {
			children: '10:00 场',
			style: {
				fontSize: 21,
				color: '#ef3a3b',
			},
		},
	},
	84: {
		componentName: 'img',
		props: {
			src: 'data:img/jpg;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAA1CAYAAAAklDnhAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJ%0AbWFnZVJlYWR5ccllPAAAAyNpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdp%0Abj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6%0AeD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1%0AMTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJo%0AdHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlw%0AdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAv%0AIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RS%0AZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpD%0AcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChNYWNpbnRvc2gpIiB4bXBNTTpJbnN0YW5j%0AZUlEPSJ4bXAuaWlkOjY4Q0ZFMkY5MTJFNzExRThCMkM4OEM1RTNBNjczQUVBIiB4bXBNTTpEb2N1%0AbWVudElEPSJ4bXAuZGlkOjY4Q0ZFMkZBMTJFNzExRThCMkM4OEM1RTNBNjczQUVBIj4gPHhtcE1N%0AOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NjhDRkUyRjcxMkU3MTFFOEIy%0AQzg4QzVFM0E2NzNBRUEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NjhDRkUyRjgxMkU3MTFF%0AOEIyQzg4QzVFM0E2NzNBRUEiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94Onht%0AcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5oEyacAAACoklEQVR42sSYv0tbURTHX0LqD6T4g4pE%0AcHDoUOloBxVd/QFFEcQqWtrSKlKFmmAslopohzgIbv4FwUEE0clFujiIi+BSIbRQ0ooKRReRULHf%0AS48Qgu++c3/FAx+iyU3eJzf3nnPuC/1qavQ04zVY8szjCHRGNN9cBD6DSkOJKzAGzsOaH/AW1FuY%0AjRg4EH/oiJSCTxYk1sDK7T86Iu9BraHED/Au9wlVkYdg2lAiC/rBhYnIB/DIUOQj2M9/UkWkCsQN%0AJbbA8l0vqIhMgXIDiZ/gFbgxEakBEwYSf8Eg+OM3gCsyA8oMRETy25UN4IjUgVEDiW2wGDSIIzIL%0AijUljsFLv3WhIvKYFphOXNO6OOUMDhKZA7qFcQF85Q6WXeQpeKEpcULlvY8xthp8iwR8I93qLLb7%0AKnOsSPWNfhd6Bro99yHqTi9IhyWzEXIsIXbSG7Djt1jbQHsBZkMkyZRs13wpgIRoiJKy7dsBWh1L%0AbN5Vt3JFQrQ2XMYeGKBk5yvSI7aRQ4k0eA4uZZlVPM47lDgTZxd6lKb4AcqkLuKSZiIdVGsiVFNc%0AxDV9yT1Orekjoe+MDw4pHqwmaJewit66Ql0QaX+DOTaZe4DitAFZxQaaEynKnJ6KCDeaQAtj3A7V%0AkBtXIpwT3iFV06zqquaKPKEtKIsM6Mo/StoWiQeMvSCJjO4+54hEwTCjuTk0STgckUm6QxTY3LgU%0AKc+/jyFrblyKCIkKbnPjSkT8HDGV5saVyBAtVHZz40Ik7HNTRtrcuBARF2tQbW5ciCR0mhvbIs2E%0AcnNjWySh29zYFGnIK25KzY1Nkdziptzc2BKJUu7Qbm5sicQom2o3NzZEKqiu/DZpbmyIjIAHNBMZ%0A7x4iTALjhcgVQSIl3v87w5vePcY/AQYAFYR6skFSqBUAAAAASUVORK5CYII=',
			style: {
				width: 34,
				height: 53,
				marginTop: 25,
				marginBottom: 25,
			},
		},
	},
	85: {
		componentName: 'span',
		props: {
			children: '距离结束还有',
			style: {
				color: 'rgba(0,0,0,.54)',
				fontSize: 15,
			},
		},
	},
	86: {
		componentName: 'div',
		state: { countdown: ['01', '56', '30'] },
		props: {
			style: {
				display: 'flex',
				flexDirection: 'row',
				alignItems: 'center',
				marginTop:28
			},
		},
		isStateDomain: true,
		childNodes: ['87'],
	},
	87: {
		loop: '${countdown}',
		componentName: 'div',
		props: {
			style: {
				display: 'flex',
				flexDirection: 'row',
			},
		},
		childNodes: ['89', '88'],
	},
	88: {
		componentName: 'div',
		props: {
			children: '${item}',
			style: {
				width: 46,
				height: 46,
				justifyContent:'center',
				alignItems:'center',
				display:'flex',
				backgroundColor: '#605751',
				color: '#fff',
				fontSize: 24,
			},
		},
	},
	89: {
		componentName: 'span',
		condition:'this.index===0',
		props: {
			children: ':',
			style: {
				color: '#605751',
				fontSize: 28,
				marginLeft:5,
				marginRight:5
			},
		},
	},
	90: {
	componentName: 'Carousel',
		state:{seckillResult,borderColors},
		props: {
		effect: 'scrollx',
			autoplay: true,
			dots:false,
			style:{
			width:'100%',
				height:'100%'
			}
	},
		isStateDomain:true,
	childNodes: ['98'],
},
	91:{
		loop:'${item}',
		componentName:'div',
		props: {
			style: {
				width: 234,
				height: 339,
				backgroundColor: '#FFF',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center',
				borderTopStyle: 'solid',
				borderTopColor: 'this.borderColors[Math.round(Math.random()*5)]',
				borderTopWidth: 1,
			},
		},
		childNodes: ['92','93','94','95'],
	},
	92:{
		componentName:'img',
		props:{
			src:'${item.pc_img}',
			style:{
				width:160,
				height:160,
				marginBottom:22
			}
		}
	},
	93:{
		componentName:'span',
		props:{
			children:"${item.goods_name}",
			style:{
				fontSize: 14,
textOverflow: 'ellipsis',
color: '#212121',
				overflow: 'hidden',
				whiteSpace: 'nowrap'
			}
		}
	},
	94:{componentName:'span',
		props:{
		children:'${item.desc}',
		style:{
			fontSize: 12,
color: '#b0b0b0',
			marginBottom:20
		}
		}
	},
	95:{
		componentName:'div',
		props:{
			style:{
				display:'flex',
				flexDirection:'row',
				fontSize:12
			}
		},
		childNodes:['96','97']
	},
	96:{
		componentName:'span',
		props:{
			children:'${item.seckill_Price}元',
			style:{
				color:'#ff6709'
			}
		}
	},
	97:{
		componentName:'del',
		props:{
			children:'${item.goods_price}元',
			style:{
				marginLeft:5
			}
		}
	},
	98:{
		loop:'${seckillResult}',
		componentName:'div',

		childNodes:['100']
	},
	99:{
		componentName:'div',
		props:{
			style:{
				width: 978,
				height:340,
			}
		},
		childNodes:['90']
	},
	100:{componentName:'div',
		props:{
			style:{
				width:978,
				height:340,
				display:'flex',
				flexDirection:'row',
				justifyContent:'space-between'
			}
		},
		childNodes:['91']
	}
}

export default data
