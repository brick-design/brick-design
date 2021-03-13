
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

const slidMenuData=[
	{key:'sub1',icon:'user',title:'subnav 1',subs:[{key:'sub11',name:'option1'},{key:'sub12',name:'option2'},{key:'sub13',name:'option3'},{key:'sub14',name:'option4'}]},
	{key:'sub2',icon:'laptop',title:'subnav 2',subs:[{key:'sub21',name:'option1'},{key:'sub22',name:'option2'},{key:'sub23',name:'option3'},{key:'sub24',name:'option4'}]},
	{key:'sub3',icon:'heart',title:'subnav 3',subs:[{key:'sub31',name:'option1'},{key:'sub32',name:'option2'},{key:'sub33',name:'option3'},{key:'sub34',name:'option4'}]},
	{key:'sub4',icon:'notification',title:'subnav 4',subs:[{key:'sub41',name:'option1'},{key:'sub42',name:'option2'},{key:'sub43',name:'option3'},{key:'sub44',name:'option4'}]}
]

const stepData=[1,2,3,4]

export default {
	'0': {
		componentName: 'Layout',
		props: {
			style: {
				width: null,
				height: '100%',
			},
		},
		state:{
			v:false,n:0,items:listData,listData:['啦啦啦啦','哈哈哈'],
			breadcrumbData:['Home','list','App'],
			menuData:['nav 1','nav 2','nav 3'],
			slidMenuData,
			stepData
		},
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
			children: ['5'],
		},
	},
	'5': {
		componentName: 'Menu.Item',
		props: {
			children: '${item}',
			key: '${item}',
			style: {
				lineHeight: '64px',
			},
		},
		loop:'${menuData}'
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
			children: ['11'],
		},
		props: {
			mode: 'inline',
		},
	},
	'11': {
		componentName: 'Menu.SubMenu',
		loop:'${slidMenuData}',
		props: {
			key: '${item.key}',
		},
		childNodes: {
			children: ['12'],
			title: ['16'],
		},
	},
	'12': {
		componentName: 'Menu.Item',
		loop:'${item.subs}',
		props: {
			key: '${item.key}',
			children: '${item.name}',
		},
	},
	'16': {
		componentName: 'span',
		childNodes: ['17', '18'],
	},
	'17': {
		componentName: 'Icon',
		props: {
			type: '${item.icon}',
		},
	},
	'18': {
		componentName: 'span',
		props: {
			children: '${item.title}',
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
			children: ['45'],
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
		loop:'${breadcrumbData}',
		props: {
			children: '${item}',
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
			animateClass:'bounceInRight animated'
		},
	},
	'51': {
		componentName: 'Steps',
		childNodes: {
			children: ['52'],
		},
	},
	'52': {
		loop:'${stepData}',
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
			actions:['68','71','74'],
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
		props:{
			width:272,
		alt:'logo',
		src:"${funParams.0.image}",
			animateClass:'wobble animated'
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
		props:{
			src:'${funParams.0.avatar}',
			animateClass:'heartBeat animated'
		},

	},
	"80":{
		componentName:'a',
		props:{children:'${funParams.0.title}'},
	},
	"81":{
		componentName:'span',
		props:{children:'${funParams.0.content}'}
	},

}
