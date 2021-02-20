export default {
	'0': {
		componentName: 'Layout',
		props: {
			style: {
				width: null,
				height: '100%',
			},
		},
		childNodes: ['2', '8', '1', '49'],
	},
	'1': {
		componentName: 'Layout.Footer',
		props: {
			style: {
				backgroundColor: '#dcdbe0',
				height: '50px',
			},
		},
	},
	'2': {
		componentName: 'Layout.Header',
		props: {
			style: {
				width: null,
				height: null,
			},
		},
		childNodes: ['3', '4'],
	},
	'3': {
		componentName: 'div',
		props: {
			style: {
				marginTop: '16px',
				marginBottom: '16px',
				marginRight: '28px',
				backgroundColor: 'rgba(255, 255, 255, 0.2)',
				float: 'left',
				width: '120px',
				height: '31px',
			},
		},
	},
	'4': {
		componentName: 'Menu',
		props: {
			mode: 'horizontal',
			theme: 'dark',
		},
		childNodes: {
			children: ['5', '6', '7'],
		},
	},
	'5': {
		componentName: 'Menu.Item',
		props: {
			children: 'nav 1',
			key: '1',
			style: {
				lineHeight: '64px',
			},
		},
	},
	'6': {
		componentName: 'Menu.Item',
		props: {
			children: 'nav 2',
			key: '2',
			style: {
				lineHeight: '64px',
			},
		},
	},
	'7': {
		componentName: 'Menu.Item',
		props: {
			children: 'nav 3',
			key: '3',
			style: {
				lineHeight: '64px',
			},
		},
	},
	'8': {
		componentName: 'Layout',
		props: {
			style: {
				height: '100px',
			},
		},
		childNodes: ['9', '43'],
	},
	'9': {
		componentName: 'Layout.Sider',
		props: {
			theme: 'light',
		},
		childNodes: {
			children: ['10'],
		},
	},
	'10': {
		componentName: 'Menu',
		childNodes: {
			children: ['11', '19', '27', '35'],
		},
		props: {
			mode: 'inline',
		},
	},
	'11': {
		componentName: 'Menu.SubMenu',
		props: {
			key: 'sub1',
		},
		childNodes: {
			children: ['12', '13', '14', '15'],
			title: ['16'],
		},
	},
	'12': {
		componentName: 'Menu.Item',
		props: {
			key: '1',
			children: 'option1',
		},
	},
	'13': {
		componentName: 'Menu.Item',
		props: {
			children: 'option2',
			key: '2',
		},
	},
	'14': {
		componentName: 'Menu.Item',
		props: {
			children: 'option3',
			key: '3',
		},
	},
	'15': {
		componentName: 'Menu.Item',
		props: {
			children: 'option4',
			key: '4',
		},
	},
	'16': {
		componentName: 'span',
		childNodes: ['17', '18'],
	},
	'17': {
		componentName: 'Icon',
		props: {
			type: 'user',
		},
	},
	'18': {
		componentName: 'span',
		props: {
			children: 'subnav 1',
		},
	},
	'19': {
		componentName: 'Menu.SubMenu',
		props: {
			key: 'sub2',
		},
		childNodes: {
			children: ['20', '21', '22', '23'],
			title: ['24'],
		},
	},
	'20': {
		componentName: 'Menu.Item',
		props: {
			key: '1',
			children: 'option1',
		},
	},
	'21': {
		componentName: 'Menu.Item',
		props: {
			children: 'option2',
			key: '2',
		},
	},
	'22': {
		componentName: 'Menu.Item',
		props: {
			children: 'option3',
			key: '3',
		},
	},
	'23': {
		componentName: 'Menu.Item',
		props: {
			children: 'option4',
			key: '4',
		},
	},
	'24': {
		componentName: 'span',
		childNodes: ['25', '26'],
	},
	'25': {
		componentName: 'Icon',
		props: {
			type: 'laptop',
		},
	},
	'26': {
		componentName: 'span',
		props: {
			children: 'subnav 2',
		},
	},
	'27': {
		componentName: 'Menu.SubMenu',
		props: {
			key: 'sub3',
		},
		childNodes: {
			children: ['28', '29', '30', '31'],
			title: ['32'],
		},
	},
	'28': {
		componentName: 'Menu.Item',
		props: {
			key: '1',
			children: 'option1',
		},
	},
	'29': {
		componentName: 'Menu.Item',
		props: {
			children: 'option2',
			key: '2',
		},
	},
	'30': {
		componentName: 'Menu.Item',
		props: {
			children: 'option3',
			key: '3',
		},
	},
	'31': {
		componentName: 'Menu.Item',
		props: {
			children: 'option4',
			key: '4',
		},
	},
	'32': {
		componentName: 'span',
		childNodes: ['33', '34'],
	},
	'33': {
		componentName: 'Icon',
		props: {
			type: 'heart',
		},
	},
	'34': {
		componentName: 'span',
		props: {
			children: 'subnav 3',
		},
	},
	'35': {
		componentName: 'Menu.SubMenu',
		props: {
			key: 'sub1',
		},
		childNodes: {
			children: ['36', '37', '38', '39'],
			title: ['40'],
		},
	},
	'36': {
		componentName: 'Menu.Item',
		props: {
			key: '1',
			children: 'option1',
		},
	},
	'37': {
		componentName: 'Menu.Item',
		props: {
			children: 'option2',
			key: '2',
		},
	},
	'38': {
		componentName: 'Menu.Item',
		props: {
			children: 'option3',
			key: '3',
		},
	},
	'39': {
		componentName: 'Menu.Item',
		props: {
			children: 'option4',
			key: '4',
		},
	},
	'40': {
		componentName: 'span',
		childNodes: ['41', '42'],
	},
	'41': {
		componentName: 'Icon',
		props: {
			type: 'notification',
		},
	},
	'42': {
		componentName: 'span',
		props: {
			children: 'subnav 4',
		},
	},
	'43': {
		componentName: 'Layout',
		props: {
			style: {
				paddingTop: 0,
				paddingBottom: '24px',
				paddingLeft: '24px',
				paddingRight: '24px',
				width: null,
				height: '100%',
			},
		},
		childNodes: ['44', '48'],
	},
	'44': {
		componentName: 'Breadcrumb',
		childNodes: {
			children: ['45', '46', '47'],
		},
		props: {
			style: {
				marginTop: '16px',
				marginBottom: '16px',
			},
		},
	},
	'45': {
		componentName: 'Breadcrumb.Item',
		props: {
			children: 'Home',
		},
	},
	'46': {
		componentName: 'Breadcrumb.Item',
		props: {
			children: 'List',
		},
	},
	'47': {
		componentName: 'Breadcrumb.Item',
		props: {
			children: 'App',
		},
	},
	'48': {
		componentName: 'Layout.Content',
		childNodes:['55'],
		props: {
			style: {
				paddingTop: '24px',
				paddingBottom: '24px',
				paddingLeft: '24px',
				paddingRight: '24px',
				backgroundColor: '#ffffff',
				height: '100%',
			},
		},
	},
	'49': {
		componentName: 'Drawer',
		childNodes: {
			title: ['50'],
			children: ['51'],
		},
	},
	'50': {
		state:{a:true},
		isRender:'${a}',
		componentName: 'Avatar',
		props: {
			src:
				'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=2584019613,1728895621&fm=26&gp=0.jpg',
			size: 100,
		},
	},
	'51': {
		componentName: 'Steps',
		childNodes: {
			children: ['52', '53', '54'],
		},
	},
	'52': {
		componentName: 'Steps.Step',
	},
	'53': {
		componentName: 'Steps.Step',
	},
	'54': {
		componentName: 'Steps.Step',
	},
	"55":{
		componentName: 'Carousel',
		props:{
			autoplay:true
		},
		childNodes:['56','58','60']
	},
	"56":{
		componentName: 'div',
		childNodes:['57']
	},
	"57":{
		componentName: 'img',
		props:{
			style:{
				width:'100%',
				height:'200px'
			},
			src: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2346282507,2171850944&fm=26&gp=0.jpg'
		}
	},
	"58":{
		componentName: 'div',
		childNodes:['59']
	},
	"59":{
		componentName: 'img',
		props:{
			style:{
				width:'100%',
				height:'200px'
			},
			src: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=364397611,3916868751&fm=26&gp=0.jpg'
		}
	},
	"60":{
		componentName: 'div',
		childNodes:['61']
	},
	"61":{
		componentName: 'img',
		props:{
			style:{
				width:'100%',
				height:'200px'
			},
			src: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3672347654,250980527&fm=26&gp=0.jpg'
		}
	},
}
