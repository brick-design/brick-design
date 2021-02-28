
const images=[
	'https://t7.baidu.com/it/u=3435942975,1552946865&fm=193&f=GIF',
	'https://t7.baidu.com/it/u=2621658848,3952322712&fm=193&f=GIF',
	'https://t7.baidu.com/it/u=1415984692,3889465312&fm=193&f=GIF',
	'https://t7.baidu.com/it/u=4080826490,615918710&fm=193&f=GIF',
	'https://t7.baidu.com/it/u=334080491,3307726294&fm=193&f=GIF',
	'https://t7.baidu.com/it/u=3713375227,571533122&fm=193&f=GIF',
	'https://t7.baidu.com/it/u=2235903830,1856743055&fm=193&f=GIF',
	'https://t7.baidu.com/it/u=801209673,1770377204&fm=193&f=GIF',
	'https://t7.baidu.com/it/u=1635608122,693552335&fm=193&f=GIF',
	'https://t7.baidu.com/it/u=774679999,2679830962&fm=193&f=GIF',
	'https://t7.baidu.com/it/u=1856946436,1599379154&fm=193&f=GIF',
	'https://t7.baidu.com/it/u=1010739515,2488150950&fm=193&f=GIF',
	'https://t7.baidu.com/it/u=1314925964,1262561676&fm=193&f=GIF',
	'https://t7.baidu.com/it/u=813347183,2158335217&fm=193&f=GIF',
	'https://t7.baidu.com/it/u=3694360626,2933607547&fm=193&f=GIF'

]
/**
 * mock 数据
 */
const listData:any[] = [];
for (let i = 0; i < 23; i++) {
	listData.push({
		href: 'http://ant.design',
		title: `ant design part ${i}`,
		avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
		image:images[i]||images[1],
		description:
			'Ant Design, a design language for background applications, is refined by Ant UED Team.',
		content:
			'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
	});
}

export default {
	'0': {
		componentName: 'Layout',
		props: {
			style: {
				width: null,
				height: '100%',
			},
		},
		state:{v:false,n:0,items:listData},
		childNodes: ['2', '8', '1', '49'],
		api:'https://api.apiopen.top/getJoke'
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
			children: ['10',"62","64","63","65"],
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
		childNodes:["66"],
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
		props:{
			visible:'${v}',
			$onClose:'this.v=!this.v'
		},
		childNodes: {
			title: ['50'],
			children: ['51'],
		},
	},
	'50': {
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
	"62":{
		componentName:'Button',
		props:{
			$onClick:'this.v=!this.v',
			children:'点我',
			type:'primary',
			style:{marginLeft: 20}
		}
	},
	"63":{
		componentName:'Button',
		props:{
			$onClick:'this.n++',
			children:'累加',
			type:'primary',
			style:{marginLeft: 20}

		}
	},
	"64":{
		componentName:'Typography.Title',
		props:{
			children:'${n}',
			style:{marginLeft: 20}

		}
	},
	"65":{
		componentName:'Button',
		props:{
			$onClick:'this.n--',
			children:'累减',
			type:'danger',
			style:{marginLeft:20}
		}
	},
	"66":{
		componentName:"List",
		childNodes:{
			'#renderItem':["67"]
		},
		props:{
			itemLayout:"vertical",
			size:'large',
			pagination:{
				pageSize: 2,
			},
			dataSource:'${items}',

		}
	},
	"67":{
		componentName:"List.Item",
		childNodes:{
			actions:['68','71','74',],
			extra:["77"],
			children:["78",'81'],
		},
		props:{
			key:'${funParams.0.title}'
		}
	},
	"68":{
		componentName:'span',
		childNodes:["69","70"]
	},
	"69":{
		componentName:'Icon',
		props:{type:"star-o",key:"list-vertical-star-o"}
	},
	"70":{
		componentName:'span',
		props:{
			children:'156'
		}
	},
	"71":{
		componentName:'span',
		childNodes:["72","73"]
	},
	"72":{
		componentName:'Icon',
		props:{type:"like-o",key:"list-vertical-like-o"}
	},
	"73":{
		componentName:'span',
		props:{
			children:'156'
		}
	},
	"74":{
		componentName:'span',
		childNodes:["75","76"]
	},
	"75":{
		componentName:'Icon',
		props:{type:"message",key:"list-vertical-message"}
	},
	"76":{
		componentName:'span',
		props:{
			children:'2'
		}
	},
	"77":{
		componentName:'img',
		props:{width:272,
		alt:'logo',
		src:"${funParams.0.image}"
		},
	},
	"78":{
		componentName:'List.Item.Meta',
		props:{description:'${funParams.0.description}'},
		childNodes:{
			avatar:['79'],
			title:['80'],
		}
	},
	"79":{
		componentName:'Avatar',
		props:{src:'${funParams.0.avatar}'},

	},
	"80":{
		componentName:'a',
		props:{children:'${funParams.0.title}'},
	},
	"81":{
		componentName:'span',
		props:{children:'${funParams.0.content}'}
	}

}
